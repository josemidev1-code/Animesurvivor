"""Limpia el ruido de JPEG que dejan algunas hojas de DeviantArt al recortarlas (4 nov. 2026).

Uso:  python herramientas/limpiar_ruido.py "<pack dentro de sprites>" [claridad=200] [pasadas=2] [motas=4] [fondo=rrggbb]
  - Quita el halo claro y gris pegado al borde transparente (píxeles muy claros y poco saturados).
  - Quita las motas sueltas de `motas` píxeles o menos.
Reescribe los PNG del pack. Revisar siempre después con ver_pack.py o previsualizar.py.
"""
import os, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pack = os.path.join(RAIZ, 'sprites', sys.argv[1])
CLARO = int(sys.argv[2]) if len(sys.argv) > 2 else 200
PASADAS = int(sys.argv[3]) if len(sys.argv) > 3 else 2
MOTAS = int(sys.argv[4]) if len(sys.argv) > 4 else 4
# opcional: color del fondo de la hoja (p. ej. 22b14c) para quitar también el halo teñido de ese color
FONDO = tuple(int(sys.argv[5][i:i + 2], 16) for i in (0, 2, 4)) if len(sys.argv) > 5 else None


def _tenido(c):
    # se parece al fondo: el canal dominante del fondo destaca igual que en el fondo
    k = max(range(3), key=lambda i: FONDO[i])
    otros = [c[i] for i in range(3) if i != k]
    return c[k] > 90 and c[k] - max(otros) > 45


def limpiar(im):
    im = im.convert('RGBA'); px = im.load(); W, H = im.size
    vacio = lambda x, y: not (0 <= x < W and 0 <= y < H) or px[x, y][3] < 20
    for _ in range(PASADAS):
        quitar = []
        for y in range(H):
            for x in range(W):
                r, g, b, a = px[x, y]
                if a < 20: continue
                claro = min(r, g, b) >= CLARO - 40 and (r + g + b) / 3 >= CLARO and max(r, g, b) - min(r, g, b) < 40
                tenido = FONDO and _tenido((r, g, b))
                if (claro or tenido) and any(vacio(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    quitar.append((x, y))
        for x, y in quitar: px[x, y] = (0, 0, 0, 0)
    vis = set()
    for y in range(H):
        for x in range(W):
            if px[x, y][3] < 20 or (x, y) in vis: continue
            comp = [(x, y)]; vis.add((x, y)); i = 0
            while i < len(comp):
                cx, cy = comp[i]; i += 1
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        n = (cx + dx, cy + dy)
                        if n not in vis and not vacio(*n): vis.add(n); comp.append(n)
            if len(comp) <= MOTAS:
                for p in comp: px[p] = (0, 0, 0, 0)
    caja = im.getbbox()
    return im.crop(caja) if caja else im


for f in sorted(os.listdir(pack)):
    if f.endswith('.png'):
        r = os.path.join(pack, f); limpiar(Image.open(r)).save(r)
print('limpio', pack)
