#!/usr/bin/env python3
"""Convierte la biblioteca cruda de sprites en tiras listas para el juego.

Solo lee ``sprites/`` y ``_organizacion_sprites/inventario.csv``. La salida se
construye primero en un directorio temporal y después reemplaza ``personajes/``.
No usa numpy ni ninguna dependencia distinta de Pillow.
"""

from __future__ import annotations

import argparse
import colorsys
import csv
import hashlib
import json
import math
import os
import re
import shutil
import statistics
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from PIL import Image

try:  # Aceleración opcional; el fallback inferior solo necesita Pillow.
    import numpy as np
    from scipy import ndimage
except ImportError:  # pragma: no cover - depende del Python local del usuario
    np = None
    ndimage = None


ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / "sprites"
INVENTORY = ROOT / "_organizacion_sprites" / "inventario.csv"
OVERRIDES = Path(__file__).with_name("ajustes.json")
OUTPUT = ROOT / "personajes"
STAGING = ROOT / ".personajes_importando"
REPORT = Path(__file__).with_name("informe_importacion.json")
ANIM_ORDER = ("idle", "walk", "attack", "ki", "hurt")
ANIM_LIMITS = {"idle": 6, "walk": 10, "attack": 12, "ki": 10, "hurt": 8}
FPS = {"idle": 5, "walk": 9, "attack": 11, "ki": 8, "hurt": 7}
LOW_CONFIDENCE = 0.55
SKIP_TOP = {"06_Escenarios", "08_Referencias", "09_Packs_mixtos_por_revisar"}
SKIP_CHARACTERS = {"varios", "fondos"}


def natural_key(value: str) -> list[Any]:
    return [int(part) if part.isdigit() else part.casefold()
            for part in re.split(r"(\d+)", value)]


def slug(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "sin-nombre"


def label(value: str) -> str:
    value = re.sub(r"^\d+_", "", value)
    value = value.replace("_", " ").strip()
    value = re.sub(r"\s+", " ", value)
    replacements = (
        (r"\bFreeza\b", "Freezer"), (r"\bSsj\b", "SSJ"),
        (r"\bSsj\s*([234])\b", r"SSJ\1"), (r"\bSsjg\b", "SSJG"),
        (r"\bSsjb\b", "SSJ Blue"), (r"\bUi\b", "UI"),
        (r"\bDbz\b", "DBZ"), (r"\bDbs\b", "DBS"),
        (r"\(Saga Freezer\)", "(Saga de Freezer)"),
    )
    for pattern, replacement in replacements:
        value = re.sub(pattern, replacement, value, flags=re.IGNORECASE)
    return value


def pack_display_name(pack_name: str, override: dict[str, Any]) -> str:
    if override.get("rename"):
        return str(override["rename"]).strip()
    value = label(pack_name)
    # Muchos nombres terminan en el crédito del autor, tras ')' o una marca HD.
    value = re.sub(r"\s+[✓✔]\s*.*$", "", value)
    return value.strip(" -")


def read_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8-sig") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path} debe contener un objeto JSON")
    return value


def near_white(pixel: tuple[int, int, int]) -> bool:
    high, low = max(pixel), min(pixel)
    saturation = 0.0 if high == 0 else (high - low) / high
    return low >= 235 and saturation <= 0.085


def remove_border_background(source: Image.Image) -> Image.Image | None:
    """Quita el blanco o un color plano conectado con el borde de la imagen."""
    rgba = source.convert("RGBA")
    width, height = rgba.size
    if width == 0 or height == 0:
        return None
    if np is not None and ndimage is not None:
        array = np.asarray(rgba)
        rgb_array = array[:, :, :3].astype(np.int16, copy=False)
        border_array = np.concatenate((rgb_array[0], rgb_array[-1],
                                       rgb_array[:, 0], rgb_array[:, -1]))
        dominant = Counter(map(tuple, border_array.tolist())).most_common(1)[0][0]
        delta_border = np.max(np.abs(border_array - np.asarray(dominant)), axis=1)
        flat_background = (dominant if np.count_nonzero(delta_border <= 12) /
                           max(1, len(border_array)) >= 0.55 else None)
        high = np.max(rgb_array, axis=2)
        low = np.min(rgb_array, axis=2)
        candidates = (low >= 235) & ((high - low) <= high * 0.085)
        if flat_background is not None:
            candidates |= np.max(np.abs(rgb_array - np.asarray(flat_background)), axis=2) <= 42
        seeds = np.zeros((height, width), dtype=bool)
        seeds[0] = candidates[0]; seeds[-1] = candidates[-1]
        seeds[:, 0] |= candidates[:, 0]; seeds[:, -1] |= candidates[:, -1]
        exterior = ndimage.binary_propagation(
            seeds, structure=np.asarray(((0, 1, 0), (1, 1, 1), (0, 1, 0)), dtype=bool),
            mask=candidates)
        cleaned_array = array.copy()
        cleaned_array[exterior, 3] = 0
        cleaned = Image.fromarray(cleaned_array, "RGBA")
        box = cleaned.getbbox()
        return cleaned.crop(box) if box else None

    rgb = rgba.convert("RGB")
    rgb_pixels = list(rgb.getdata())
    border = ([rgb_pixels[x] for x in range(width)] +
              [rgb_pixels[(height - 1) * width + x] for x in range(width)] +
              [rgb_pixels[y * width] for y in range(height)] +
              [rgb_pixels[y * width + width - 1] for y in range(height)])
    dominant = Counter(border).most_common(1)[0][0]
    close_border = sum(max(abs(pixel[i] - dominant[i]) for i in range(3)) <= 12
                       for pixel in border)
    flat_background = dominant if close_border / max(1, len(border)) >= 0.55 else None

    def background(pixel: tuple[int, int, int]) -> bool:
        if near_white(pixel):
            return True
        # Algunos packs en realidad usan un marco bicolor (p. ej. morado y
        # gris violáceo). La conectividad impide que esta tolerancia borre el
        # mismo tono dentro del personaje.
        return bool(flat_background and
                    max(abs(pixel[i] - flat_background[i]) for i in range(3)) <= 42)

    white = bytearray(1 if background(pixel) else 0 for pixel in rgb_pixels)
    exterior = bytearray(width * height)
    stack: list[int] = []

    def seed(index: int) -> None:
        if white[index] and not exterior[index]:
            stack.append(index)

    for x in range(width):
        seed(x)
        seed((height - 1) * width + x)
    for y in range(height):
        seed(y * width)
        seed(y * width + width - 1)
    # Flood-fill por líneas: conserva exactamente la conectividad 4-dir del
    # BFS clásico, pero evita una operación de deque por cada píxel de fondo.
    while stack:
        index = stack.pop()
        if exterior[index] or not white[index]:
            continue
        x, y = index % width, index // width
        row = y * width
        left = x
        while left and white[row + left - 1] and not exterior[row + left - 1]:
            left -= 1
        right = x
        while right + 1 < width and white[row + right + 1] and not exterior[row + right + 1]:
            right += 1
        exterior[row + left:row + right + 1] = b"\x01" * (right - left + 1)
        for neighbor_y in (y - 1, y + 1):
            if not 0 <= neighbor_y < height:
                continue
            neighbor_row = neighbor_y * width
            scan_x = left
            while scan_x <= right:
                pos = neighbor_row + scan_x
                if white[pos] and not exterior[pos]:
                    stack.append(pos)
                    scan_x += 1
                    while (scan_x <= right and white[neighbor_row + scan_x]
                           and not exterior[neighbor_row + scan_x]):
                        scan_x += 1
                else:
                    scan_x += 1

    pixels = list(rgba.getdata())
    cleaned = [(r, g, b, 0 if exterior[i] else a)
               for i, (r, g, b, a) in enumerate(pixels)]
    rgba.putdata(cleaned)
    box = rgba.getbbox()
    return rgba.crop(box) if box else None


@dataclass
class Frame:
    name: str
    source_index: int
    image: Image.Image
    w: int
    h: int
    aspect: float
    opaque: int
    dark: float
    skin: float
    bright_sat: float
    saturation: float
    hue_dominance: float
    hue_bins: int
    effect_score: float
    effect_kind: str


def frame_metrics(name: str, index: int, image: Image.Image) -> Frame:
    width, height = image.size
    samples = []
    step = max(1, math.ceil((width * height) / 5000))
    for n, (r, g, b, a) in enumerate(image.getdata()):
        if a >= 32 and n % step == 0:
            samples.append((r, g, b))
    total = max(1, len(samples))
    dark = skin = bright_sat = sat_sum = 0.0
    hues: Counter[int] = Counter()
    for r, g, b in samples:
        high, low = max(r, g, b), min(r, g, b)
        sat = 0.0 if high == 0 else (high - low) / high
        lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        dark += lum < 72
        skin += (r > 115 and 42 < g < 215 and b < 180 and r > g * 1.04 and r > b * 1.08)
        bright_sat += lum > 165 and sat > 0.30
        sat_sum += sat
        if sat > 0.25 and high > 70:
            hue = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[0]
            hues[int(hue * 12) % 12] += 1
    dark /= total; skin /= total; bright_sat /= total; sat_sum /= total
    colored = sum(hues.values()) or 1
    hue_dominance = max(hues.values(), default=0) / colored
    hue_bins = sum(count / colored >= 0.035 for count in hues.values())
    aspect = width / max(1, height)
    extreme = max(0.0, aspect - 1.75) / 1.5 + max(0.0, 0.40 - aspect)
    monochrome_glow = max(0.0, hue_dominance - 0.56) * 1.4
    no_body = max(0.0, 0.10 - dark) * 2.5 + max(0.0, 0.025 - skin) * 3
    diversity_penalty = 0.22 if hue_bins >= 4 else 0.0
    effect_score = extreme + monochrome_glow + no_body + bright_sat * 0.35 - diversity_penalty
    if aspect >= 1.85 or aspect <= 0.34:
        effect_kind = "beam"
    elif aspect <= 1.45 and bright_sat >= 0.18 and hue_dominance >= 0.48:
        effect_kind = "ball"
    else:
        effect_kind = "aura"
    return Frame(name, index, image, width, height, aspect, len(samples), dark,
                 skin, bright_sat, sat_sum, hue_dominance, hue_bins,
                 effect_score, effect_kind)


def is_effect(frame: Frame) -> bool:
    # La tinta negra y la piel son señales mucho más fiables de personaje que
    # el número de tonos: el pixel art pequeño suele cuantizar toda la ropa en
    # solo dos o tres colores y antes parecía, erróneamente, un ki monocromo.
    if frame.aspect >= 1.75 or frame.aspect <= 0.30:
        return frame.skin < 0.030 or frame.dark < 0.080
    if frame.skin >= 0.030:
        return False
    if frame.effect_score >= 0.54 and frame.hue_bins <= 3 and frame.dark < 0.16 and (
            frame.bright_sat > 0.16 or frame.saturation > 0.42):
        return True
    if frame.dark < 0.045 and frame.bright_sat > 0.14 and frame.hue_dominance > 0.50:
        return True
    if frame.bright_sat > 0.58 and frame.dark < 0.045 and frame.skin < 0.018:
        return True
    return False


def evenly(items: list[Frame], limit: int) -> list[Frame]:
    if len(items) <= limit:
        return items
    indexes = [round(i * (len(items) - 1) / (limit - 1)) for i in range(limit)]
    return [items[i] for i in indexes]


def around(items: list[Frame], center: Frame, limit: int,
           predicate: Any) -> list[Frame]:
    ranked = sorted((item for item in items if predicate(item)),
                    key=lambda item: (abs(item.source_index - center.source_index), item.source_index))
    return sorted(ranked[:limit], key=lambda item: item.source_index)


def stable_runs(frames: list[Frame]) -> list[list[Frame]]:
    runs: list[list[Frame]] = []
    current: list[Frame] = []
    for frame in frames:
        if current:
            prev = current[-1]
            near_sequence = frame.source_index - prev.source_index <= 3
            near_size = (abs(frame.w - prev.w) / max(frame.w, prev.w) <= 0.38 and
                         abs(frame.h - prev.h) / max(frame.h, prev.h) <= 0.32)
            if not (near_sequence and near_size):
                if current: runs.append(current)
                current = []
        current.append(frame)
    if current: runs.append(current)
    return runs


def classify(frames: list[Frame], forced: dict[str, list[str]],
             excluded: set[str], pack_hint: str = "") -> tuple[dict[str, list[Frame]], dict[str, bool], float]:
    usable = [f for f in frames if f.name not in excluded]
    by_name = {f.name: f for f in usable}
    if not usable:
        raise ValueError("no quedan frames de personaje tras aplicar exclusiones")
    median_w = statistics.median(f.w for f in usable)
    median_h = statistics.median(f.h for f in usable)

    def normal(f: Frame) -> bool:
        return (0.65 <= f.w / median_w <= 1.30 and
                0.70 <= f.h / median_h <= 1.28 and 0.38 <= f.aspect <= 1.35)

    def upright(f: Frame) -> bool:
        return normal(f) and f.aspect <= 0.86 and f.h >= median_h * 0.88

    upright_pool = [f for f in usable if upright(f)] or [f for f in usable if normal(f)] or usable
    transformed = any(word in pack_hint.casefold() for word in
                      ("ssj", "super saiyan", "golden", "dorado", "blue", "god"))
    if transformed:
        idle_center = min(upright_pool, key=lambda f: (f.dark, f.source_index))
    else:
        idle_center = min(upright_pool, key=lambda f: f.source_index)
    # Un único frame geométricamente muy estable produce un idle más útil que
    # mezclar una patada de tamaño parecido. El usuario puede animarlo con un
    # override cuando el pack tenga una secuencia de respiración identificada.
    idle = [idle_center]
    walk_similar = [f for f in upright_pool
                    if abs(f.aspect - idle_center.aspect) <= 0.12
                    and abs(f.h - idle_center.h) / max(f.h, idle_center.h) <= 0.16]
    walk = around(walk_similar or upright_pool, idle_center,
                  min(6, ANIM_LIMITS["walk"]), lambda _f: True)

    ki_candidates = [f for f in usable if
                     f.bright_sat >= 0.30 or
                     (f.w * f.h >= median_w * median_h * 1.75 and
                      f.w >= median_w * 1.25 and f.h >= median_h * 1.15) or
                     (f.saturation >= 0.52 and f.w >= median_w * 1.12 and f.h >= median_h * .9)]
    hurt_candidates = [f for f in usable if f not in ki_candidates and
                       f.aspect >= 1.10 and f.h <= median_h * 0.82]
    attack_candidates = [f for f in usable if
                         f not in ki_candidates and f not in hurt_candidates and
                         (f.w >= median_w * 1.08 or f.aspect >= 0.92)]
    selected = {
        "idle": idle,
        "walk": walk,
        "attack": evenly(attack_candidates, ANIM_LIMITS["attack"]),
        "ki": evenly(ki_candidates, ANIM_LIMITS["ki"]),
        "hurt": evenly(hurt_candidates, ANIM_LIMITS["hurt"]),
    }
    fallback: dict[str, bool] = {name: not bool(selected[name]) for name in ANIM_ORDER}
    selected["attack"] = selected["attack"] or evenly(walk, 4)
    selected["ki"] = selected["ki"] or evenly(selected["attack"], 4)
    selected["hurt"] = selected["hurt"] or [selected["idle"][0]]

    for anim, names in forced.items():
        if anim not in selected or not isinstance(names, list):
            continue
        chosen = [by_name[Path(str(name)).name] for name in names
                  if Path(str(name)).name in by_name]
        if chosen:
            selected[anim] = evenly(chosen, ANIM_LIMITS[anim])
            fallback[anim] = False

    actual = sum(not fallback[name] for name in ANIM_ORDER)
    amount = min(1.0, math.log2(len(usable) + 1) / 5.5)
    walk_quality = min(1.0, len(selected["walk"]) / 5)
    confidence = 0.14 + actual * 0.09 + amount * 0.12 + walk_quality * 0.10
    return selected, fallback, round(min(0.90, confidence), 2)


def save_strip(path: Path, frames: list[Frame]) -> dict[str, Any]:
    cell_w = max(frame.w for frame in frames)
    cell_h = max(frame.h for frame in frames)
    strip = Image.new("RGBA", (cell_w * len(frames), cell_h), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        x = index * cell_w + (cell_w - frame.w) // 2
        y = cell_h - frame.h
        strip.alpha_composite(frame.image, (x, y))
    path.parent.mkdir(parents=True, exist_ok=True)
    strip.save(path, format="PNG", optimize=True, compress_level=9)
    return {
        "w": cell_w, "h": cell_h, "frames": len(frames),
        "nativeSizes": [[frame.w, frame.h] for frame in frames],
        "sourceFrames": [frame.name for frame in frames],
    }


def read_credit_file(path: Path) -> list[str]:
    raw = path.read_bytes()
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            text = raw.decode(encoding); break
        except UnicodeDecodeError:
            continue
    else:
        text = ""
    credits = []
    generic = {"creditos", "credits", "credito", "autor", "author"}
    stem = re.sub(r"[_-]+", " ", path.stem).strip()
    if stem.casefold() not in generic and stem:
        credits.append(stem)
    for line in text.splitlines():
        line = re.sub(r"\s+", " ", line).strip(" \t-–—")
        if line and len(line) <= 160 and not line.startswith(("http://", "https://")):
            credits.append(line)
    return credits[:12]


def credits_for(pack_dir: Path) -> list[str]:
    credits: list[str] = []
    for path in sorted(pack_dir.glob("*.txt"), key=lambda p: natural_key(p.name)):
        credits.extend(read_credit_file(path))
    unique = []
    seen = set()
    for credit in credits:
        key = credit.casefold()
        if key not in seen:
            seen.add(key); unique.append(credit)
    return unique


def suggest_rarity(character: str, name: str) -> int:
    text = f"{character} {name}".casefold()
    five = ("gogeta", "vegetto", "vegito", "gotenks", "kefla", "ultra instinto",
            " instinto superior", " ui", "dios", "god", "blue", "beast", "orange",
            "fusion", "fusión", "whis", "bills", "beerus", "zeno")
    four = ("ssj", "super saiyan", "kaioken", "forma final", "perfect", "perfecto",
            "majin", "golden", "black", "full power", "transform")
    if any(word in text for word in five): return 5
    if any(word in text for word in four): return 4
    return 3


def suggest_role(character: str, name: str) -> str:
    # La forma puede mencionar la saga de otro personaje ("Goku ... Saga
    # Freezer"); el bucket de personaje del inventario es la señal fiable.
    text = character.casefold()
    bosses = ("freezer", "frieza", "cell", "majin buu", "kid buu", "jiren", "broly",
              "zamasu", "goku black", "moro", "janemba", "cumber", "cooler", "bills",
              "beerus", "toppo", "frost", "omega", "baby", "hit")
    enemies = ("raditz", "saibaman", "turles", "nappa", "androide", "android",
               "ginyu", "dabura", "zarbon", "dodoria")
    if any(word in text for word in bosses): return "boss"
    if any(word in text for word in enemies): return "enemy"
    return "hero"


def fx_groups(frames: list[Frame], excluded: set[str]) -> list[tuple[str, list[Frame]]]:
    groups: dict[tuple[str, int], list[Frame]] = defaultdict(list)
    for frame in frames:
        if frame.name in excluded: continue
        # El bin de tono evita mezclar, por ejemplo, ki azul con proyectiles morados.
        rgba = frame.image.resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))
        h = colorsys.rgb_to_hsv(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255)[0]
        groups[(frame.effect_kind, int(h * 6) % 6)].append(frame)
    ordered = sorted(groups.items(), key=lambda item: min(f.source_index for f in item[1]))
    return [(key[0], evenly(value, 12)) for key, value in ordered[:6]]


def process_pack(job: dict[str, Any]) -> dict[str, Any]:
    pack_key = job["packKey"]
    pack_dir = SPRITES / Path(pack_key)
    out_dir = STAGING / job["characterId"] / job["formId"]
    override = job["override"]
    excluded = {Path(str(name)).name for name in override.get("excludeFrames", [])}
    frames: list[Frame] = []
    effects: list[Frame] = []
    seen: set[bytes] = set()
    warnings: list[str] = []
    for index, filename in enumerate(job["files"]):
        path = SPRITES / Path(filename)
        try:
            with Image.open(path) as source:
                cleaned = remove_border_background(source)
        except Exception as exc:
            warnings.append(f"{path.name}: {type(exc).__name__}: {exc}")
            continue
        if cleaned is None:
            warnings.append(f"{path.name}: vacío tras quitar fondo")
            continue
        digest = hashlib.sha1(cleaned.tobytes() + repr(cleaned.size).encode()).digest()
        if digest in seen:
            continue
        seen.add(digest)
        frame = frame_metrics(path.name, index, cleaned)
        (effects if is_effect(frame) else frames).append(frame)
    if not frames and effects:
        # Un pack entero de aura puede confundir la heurística: rescata los más corpóreos.
        rescued = sorted(effects, key=lambda f: (f.effect_score, -f.dark, -f.skin))[:max(1, min(6, len(effects)))]
        frames.extend(rescued)
        effects = [f for f in effects if f not in rescued]
        warnings.append("se rescataron frames de menor puntuación de efecto")
    if not frames:
        raise ValueError("ningún PNG utilizable de personaje")

    forced = override.get("animations", {}) if isinstance(override.get("animations", {}), dict) else {}
    selected, fallback, confidence = classify(frames, forced, excluded, Path(pack_key).name)
    anims: dict[str, Any] = {}
    for anim in ANIM_ORDER:
        meta = save_strip(out_dir / f"{anim}.png", selected[anim])
        meta.update({"src": f"personajes/{job['characterId']}/{job['formId']}/{anim}.png",
                     "fps": FPS[anim], "fallback": fallback[anim]})
        # Orden legible y estable en roster.js.
        anims[anim] = {key: meta[key] for key in ("src", "w", "h", "frames", "fps",
                                                    "nativeSizes", "sourceFrames", "fallback")}
    fx = []
    for number, (kind, group) in enumerate(fx_groups(effects, excluded), start=1):
        meta = save_strip(out_dir / f"fx_{number}.png", group)
        fx.append({"src": f"personajes/{job['characterId']}/{job['formId']}/fx_{number}.png",
                   "w": meta["w"], "h": meta["h"], "frames": meta["frames"],
                   "kind": kind, "nativeSizes": meta["nativeSizes"],
                   "sourceFrames": meta["sourceFrames"]})

    name = pack_display_name(Path(pack_key).name, override)
    rarity_value = override.get("rarity")
    rarity = int(rarity_value if rarity_value is not None else suggest_rarity(job["character"], name))
    rarity = max(3, min(5, rarity))
    role_value = override.get("role")
    role = str(role_value if role_value is not None else suggest_role(job["character"], name))
    if role not in {"hero", "enemy", "boss"}: role = "hero"
    entry = {
        "id": f"{job['characterId']}--{job['formId']}",
        "character": job["character"], "characterId": job["characterId"],
        "name": name, "saga": label(job["saga"]), "category": label(job["category"]),
        "packDir": pack_key.replace("\\", "/"), "credits": credits_for(pack_dir),
        "anims": anims, "fx": fx, "quality": confidence,
        "rarity": rarity, "role": role,
    }
    return {"entry": entry, "warnings": warnings, "frameCount": len(frames),
            "effectCount": len(effects), "duplicatesDropped": len(job["files"]) - len(frames) - len(effects)}


def load_inventory() -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    packs: dict[str, dict[str, Any]] = {}
    skipped_rows: list[dict[str, Any]] = []
    with INVENTORY.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            destination = row["destino"].replace("\\", "/")
            if row["accion"] != "conservar" or Path(destination).suffix.casefold() != ".png":
                continue
            pack_key = row["carpeta"].replace("\\", "/")
            parts = Path(pack_key).parts
            top = parts[0] if parts else ""
            character = row["personaje"].strip()
            reason = None
            if top in SKIP_TOP: reason = f"categoría excluida: {top}"
            elif character.casefold() in SKIP_CHARACTERS: reason = f"bucket excluido: {character}"
            if reason:
                skipped_rows.append({"packDir": pack_key, "reason": reason})
                continue
            record = packs.setdefault(pack_key, {
                "packKey": pack_key, "character": character,
                "category": parts[0] if parts else row["categoria"],
                "saga": parts[1] if len(parts) > 1 else row["categoria"], "files": []})
            record["files"].append(destination)
    for record in packs.values():
        record["files"].sort(key=natural_key)
    unique_skips = {(item["packDir"], item["reason"]): item for item in skipped_rows}
    return packs, sorted(unique_skips.values(), key=lambda item: natural_key(item["packDir"]))


def build_jobs(packs: dict[str, dict[str, Any]], overrides: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    jobs = []; skipped = []; used_ids: dict[str, set[str]] = defaultdict(set)
    pack_overrides = overrides.get("packs", {}) if isinstance(overrides.get("packs", {}), dict) else {}
    for key in sorted(packs, key=natural_key):
        record = dict(packs[key])
        override = pack_overrides.get(key, {})
        if not isinstance(override, dict): override = {}
        if override.get("excludePack"):
            skipped.append({"packDir": key, "reason": "excluido por ajustes.json"}); continue
        char_id = slug(record["character"])
        base = slug(label(Path(key).name))
        form_id = base
        if form_id in used_ids[char_id]:
            form_id = f"{base}-{hashlib.sha1(key.encode('utf-8')).hexdigest()[:6]}"
        used_ids[char_id].add(form_id)
        record.update({"characterId": char_id, "formId": form_id, "override": override})
        jobs.append(record)
    return jobs, skipped


def output_size(path: Path) -> int:
    return sum(item.stat().st_size for item in path.rglob("*") if item.is_file())


def write_manifest(entries: list[dict[str, Any]]) -> None:
    text = "// Generado por herramientas/importar_sprites.py. No editar a mano.\n"
    text += "window.ANIME_ROSTER = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
    (STAGING / "roster.js").write_text(text, encoding="utf-8", newline="\n")


def replace_output() -> None:
    old = ROOT / ".personajes_anterior"
    if old.exists(): shutil.rmtree(old)
    if OUTPUT.exists(): OUTPUT.rename(old)
    try:
        STAGING.rename(OUTPUT)
    except Exception:
        if old.exists() and not OUTPUT.exists(): old.rename(OUTPUT)
        raise
    if old.exists(): shutil.rmtree(old)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=max(1, min(8, (os.cpu_count() or 2) - 1)))
    parser.add_argument("--only", help="procesa solo packs cuyo path contenga este texto (para diagnóstico)")
    args = parser.parse_args()
    started = time.time()
    if not INVENTORY.exists() or not SPRITES.exists():
        parser.error("faltan sprites/ o _organizacion_sprites/inventario.csv")
    overrides = read_json(OVERRIDES)
    packs, skipped = load_inventory()
    jobs, manual_skips = build_jobs(packs, overrides)
    skipped.extend(manual_skips)
    if args.only:
        needle = args.only.casefold()
        jobs = [job for job in jobs if needle in job["packKey"].casefold()]
        if not jobs: parser.error(f"ningún pack coincide con --only {args.only!r}")
    if STAGING.exists(): shutil.rmtree(STAGING)
    STAGING.mkdir()
    results = []; failures = []
    print(f"Importando {len(jobs)} packs con {args.workers} procesos…", flush=True)
    try:
        with ProcessPoolExecutor(max_workers=args.workers) as executor:
            futures = {executor.submit(process_pack, job): job for job in jobs}
            for done, future in enumerate(as_completed(futures), start=1):
                job = futures[future]
                try:
                    results.append(future.result())
                except Exception as exc:
                    failures.append({"packDir": job["packKey"],
                                     "reason": f"{type(exc).__name__}: {exc}"})
                if done % 10 == 0 or done == len(jobs):
                    print(f"  {done}/{len(jobs)} packs", flush=True)
        entries = sorted((result["entry"] for result in results),
                         key=lambda entry: (natural_key(entry["character"]), natural_key(entry["name"])))
        write_manifest(entries)
        generated_bytes = output_size(STAGING)
        replace_output()
    except BaseException:
        if STAGING.exists(): shutil.rmtree(STAGING)
        raise

    characters = len({entry["characterId"] for entry in entries})
    low = [entry["packDir"] for entry in entries if entry["quality"] < LOW_CONFIDENCE]
    report = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "source": str(INVENTORY.relative_to(ROOT)).replace("\\", "/"),
        "processedPacks": len(entries), "skippedPacks": len(skipped),
        "failedPacks": len(failures), "characters": characters, "forms": len(entries),
        "outputBytes": generated_bytes, "outputMiB": round(generated_bytes / 1048576, 2),
        "lowConfidenceThreshold": LOW_CONFIDENCE, "lowConfidencePacks": low,
        "skipped": sorted(skipped, key=lambda item: natural_key(item["packDir"])),
        "failures": failures,
        "warnings": {result["entry"]["packDir"]: result["warnings"]
                     for result in results if result["warnings"]},
        "elapsedSeconds": round(time.time() - started, 2),
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("\nResultado")
    print(f"  procesados: {len(entries)} | omitidos: {len(skipped)} | fallidos: {len(failures)}")
    print(f"  personajes: {characters} | formas: {len(entries)}")
    print(f"  salida: {report['outputMiB']:.2f} MiB | baja confianza (<{LOW_CONFIDENCE}): {len(low)}")
    print(f"  tiempo: {report['elapsedSeconds']:.2f} s | informe: {REPORT.relative_to(ROOT)}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
