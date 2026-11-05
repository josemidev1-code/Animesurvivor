"""Recorta los objetos elegidos y los incrusta junto al logo: funciona con file://.

Uso: python herramientas/montar_objetos.py
No genera dibujos. Conserva el GIF de Lady-Pixel sin ninguna modificación.
"""
import base64
import json
from collections import deque
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
OBJETOS = RAIZ / "ui" / "objetos"
UI = RAIZ / "ui"


def uri(archivo):
    tipo = "gif" if archivo.suffix.lower() == ".gif" else "png"
    return f"data:image/{tipo};base64," + base64.b64encode(archivo.read_bytes()).decode()


def recortar(imagen, caja):
    x, y, w, h = caja
    salida = imagen.crop((x, y, x + w, y + h)).convert("RGBA")
    fondo = imagen.convert("RGBA").getpixel((0, imagen.height - 1))
    cola = deque([(i, j) for i in range(w) for j in (0, h - 1)] +
                 [(i, j) for j in range(h) for i in (0, w - 1)])
    vistos = set()
    while cola:
        i, j = cola.popleft()
        if (i, j) in vistos or not (0 <= i < w and 0 <= j < h):
            continue
        vistos.add((i, j))
        c = salida.getpixel((i, j))
        if abs(c[0]-fondo[0]) < 15 and abs(c[1]-fondo[1]) < 15 and abs(c[2]-fondo[2]) < 15:
            salida.putpixel((i, j), (0, 0, 0, 0))
            cola.extend([(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)])
    limites = salida.getbbox()
    if not limites:
        raise ValueError(f"Recorte vacío: {caja}")
    return salida.crop(limites)


def main():
    fuentes = json.loads((OBJETOS / "fuentes.json").read_text(encoding="utf-8"))["fuentes"]
    imagenes = {k: uri(UI / f"{k}.png")
                for k in ["logo"] + [f"esfera{i}" for i in range(1, 8)]}
    creditos = []
    for fuente in fuentes:
        original = OBJETOS / fuente["archivo"]
        creditos.append({"what": fuente["nombre"], "name": fuente["autor"], "url": fuente["url"]})
        if "imagenIntegra" in fuente:
            imagenes[fuente["imagenIntegra"]] = uri(original)
        if "objetos" in fuente:
            with Image.open(original) as hoja:
                for clave, caja in fuente["objetos"].items():
                    salida = OBJETOS / f"{clave}.png"
                    recortar(hoja, caja).save(salida)
                    imagenes[clave] = uri(salida)

    # Añadir todos los objetos e iconos en ui/objetos/*.png
    for png in OBJETOS.glob("*.png"):
        clave = png.stem
        if clave not in imagenes:
            imagenes[clave] = uri(png)

    # Añadir sprites de Shenron para la cinemática
    for shen_part in ["shenron", "shenron_pose1", "shenron_pose2", "shenron_nubes", "shenron_rayos"]:
        shen_f = UI / f"{shen_part}.png"
        if shen_f.exists():
            imagenes[shen_part] = uri(shen_f)

    texto = "// Generado por herramientas/montar_objetos.py; imágenes y créditos sin fetch.\n"
    texto += "window.UI_IMG=" + json.dumps(imagenes, ensure_ascii=False, separators=(",", ":")) + ";\n"
    texto += "window.RECURSOS_CREDITOS=" + json.dumps(creditos, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (RAIZ / "02 - Código del juego/ui_imagenes.js").write_text(texto, encoding="utf-8")
    print(f"{len(imagenes)} imágenes incrustadas, {len(creditos)} fuentes acreditadas en ui_imagenes.js.")

    # Generar shenron_imagen.js con la animación y fotogramas de Shenron
    shen_text = "// Generado por herramientas/montar_objetos.py con sprites oficiales de Shenron SW2\n"
    shen_text += f'window.SHENRON_IMG="{imagenes.get("shenron_pose1", imagenes.get("shenron", ""))}";\n'
    shen_text += f'window.SHENRON_POSE2="{imagenes.get("shenron_pose2", "")}";\n'
    shen_text += f'window.SHENRON_NUBES="{imagenes.get("shenron_nubes", "")}";\n'
    shen_text += f'window.SHENRON_RAYOS="{imagenes.get("shenron_rayos", "")}";\n'
    (RAIZ / "02 - Código del juego/shenron_imagen.js").write_text(shen_text, encoding="utf-8")
    print("shenron_imagen.js actualizado con animación multi-frame.")


if __name__ == "__main__":
    main()
