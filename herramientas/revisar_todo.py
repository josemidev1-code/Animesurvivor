"""Hoja de revisión de varias formas a la vez: una fila por forma, con TODOS los fotogramas de cada animación.

Uso:  python herramientas/revisar_todo.py vegeta vegetaue ...   (sin argumentos: todos)
Salida: herramientas/_revisar/todo_<n>.png (varias hojas si son muchas formas)
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import leer_config, cargar_forma, tira, RAIZ

cfg = leer_config(); solo = set(sys.argv[1:])
formas = [(h, f) for h in cfg for f in sorted(cfg[h], key=int) if not solo or h in solo]
Z = 2; POR_HOJA = 6
os.makedirs(os.path.join(RAIZ, 'herramientas', '_revisar'), exist_ok=True)
for n0 in range(0, len(formas), POR_HOJA):
    filas = []
    for h, f in formas[n0:n0 + POR_HOJA]:
        try:
            anims, ret, _ = cargar_forma(cfg[h][f])
        except SystemExit as e:
            filas.append((f'{h} {f}: ERROR {e}', [])); continue
        filas.append((f'{h} {f}', [(n, tira(fr)) for n, fr in anims.items()] + ([('retrato', (ret, ret.width, ret.height))] if ret else [])))
    W = 2400; H = sum(22 + max([t[2] for _, t in fl] or [10]) * Z + 8 for _, fl in filas)
    hoja = Image.new('RGBA', (W, H), (70, 163, 127, 255)); d = ImageDraw.Draw(hoja); y = 2
    for titulo, fl in filas:
        d.rectangle((0, y, W, y + 18), fill=(20, 12, 28, 255)); d.text((6, y + 4), titulo, fill=(255, 220, 80, 255)); y += 22
        x = 6; alto = max([t[2] for _, t in fl] or [10]) * Z
        for n, (im, cw, ch) in fl:
            im2 = im.resize((im.width * Z, im.height * Z), Image.NEAREST)
            if x + im2.width > W: break
            d.text((x, y), n, fill=(255, 255, 255, 255))
            hoja.paste(im2, (x, y + alto - im2.height), im2)
            d.line((x, y + alto - 1, x + im2.width, y + alto - 1), fill=(200, 60, 60, 255))
            x += im2.width + 18
        y += alto + 8
    out = os.path.join(RAIZ, 'herramientas', '_revisar', f'todo_{n0 // POR_HOJA + 1}.png'); hoja.save(out); print(out, hoja.size)
