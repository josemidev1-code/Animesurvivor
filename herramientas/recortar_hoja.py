"""Convierte una hoja de sprites (una sola imagen, p. ej. de DeviantArt) en un pack: un PNG por fotograma.

Uso:  python herramientas/recortar_hoja.py <hoja.png> <carpeta_pack_dentro_de_sprites> [x0,y0,x1,y1] [altomin] [altomax] [tolerancia_fondo=18] [union=2]
  - El fondo es el color más repetido de la hoja (o la transparencia) y se quita.
  - x0,y0,x1,y1 (opcional) limita la zona a recortar, para saltar retratos, textos y la mitad en espejo.
  - Las figuras se numeran por filas (de arriba abajo y de izquierda a derecha), igual que lee ver_pack.py.
"""
import os, sys, collections
from PIL import Image
sys.setrecursionlimit(10000)
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
hoja = Image.open(sys.argv[1]).convert('RGBA')
dest = os.path.join(RAIZ, 'sprites', sys.argv[2]); os.makedirs(dest, exist_ok=True)
zona = [int(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != '-' else [0, 0, hoja.width, hoja.height]
amin = int(sys.argv[4]) if len(sys.argv) > 4 else 16
amax = int(sys.argv[5]) if len(sys.argv) > 5 else 140
TOL = int(sys.argv[6]) if len(sys.argv) > 6 else 18  # sube para hojas con ruido de compresión alrededor del fondo
W, H = hoja.size; px = hoja.load()
fondo = collections.Counter(px[x, y] for x in range(0, W, 3) for y in range(0, H, 3)).most_common(1)[0][0]
def es_fondo(c):
    return c[3] < 20 or (abs(c[0] - fondo[0]) + abs(c[1] - fondo[1]) + abs(c[2] - fondo[2]) < TOL and fondo[3] > 0)
x0, y0, x1, y1 = zona
# fondo = lo que parece fondo Y está conectado con el borde de la zona (así no se borran los blancos
# de dentro de un sprite aunque la tolerancia sea alta)
fuera = [[False] * W for _ in range(H)]
pila = [(x, y) for x in range(x0, x1) for y in (y0, y1 - 1)] + [(x, y) for y in range(y0, y1) for x in (x0, x1 - 1)]
while pila:
    x, y = pila.pop()
    if x0 <= x < x1 and y0 <= y < y1 and not fuera[y][x] and es_fondo(px[x, y]):
        fuera[y][x] = True; pila += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
lleno = [[False] * W for _ in range(H)]
for y in range(y0, y1):
    for x in range(x0, x1):
        lleno[y][x] = not fuera[y][x]
vis = [[False] * W for _ in range(H)]; cajas = []
G = int(sys.argv[7]) if len(sys.argv) > 7 else 2  # une trozos separados por 1-2 px (estelas, mechones)
for y in range(y0, y1):
    for x in range(x0, x1):
        if lleno[y][x] and not vis[y][x]:
            pila = [(x, y)]; vis[y][x] = True; bx0 = bx1 = x; by0 = by1 = y
            while pila:
                cx, cy = pila.pop()
                bx0, bx1, by0, by1 = min(bx0, cx), max(bx1, cx), min(by0, cy), max(by1, cy)
                for dx in range(-G, G + 1):
                    for dy in range(-G, G + 1):
                        nx, ny = cx + dx, cy + dy
                        if x0 <= nx < x1 and y0 <= ny < y1 and lleno[ny][nx] and not vis[ny][nx]:
                            vis[ny][nx] = True; pila.append((nx, ny))
            cajas.append((bx0, by0, bx1 + 1, by1 + 1))
cajas = [b for b in cajas if amin <= b[3] - b[1] <= amax and b[2] - b[0] <= amax * 1.6 and (b[2] - b[0]) * (b[3] - b[1]) > 120]
# orden de lectura: filas por la base de cada figura
cajas.sort(key=lambda b: (b[3] // 24, b[0]))
for f in os.listdir(dest):
    if f.endswith('.png'): os.remove(os.path.join(dest, f))
for i, b in enumerate(cajas):
    im = hoja.crop(b); p = im.load()
    for yy in range(im.height):
        for xx in range(im.width):
            if fuera[b[1] + yy][b[0] + xx] or not lleno[b[1] + yy][b[0] + xx] or not vis[b[1] + yy][b[0] + xx]: p[xx, yy] = (0, 0, 0, 0)
    im.save(os.path.join(dest, f'{i:03d}.png'))
print(len(cajas), 'fotogramas en', dest)
