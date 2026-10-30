"""Hoja con TODOS los fotogramas de un pack de sprites/, numerados, sin fondo blanco.

Los números son los que se usan en herramientas/animaciones*.json.
Uso:  python herramientas/ver_pack.py "<ruta del pack dentro de sprites/>" [escala]
      python herramientas/ver_pack.py "<pack>" 4 10,11,12   -> solo esos fotogramas, grandes
Salida: herramientas/_revisar/pack_<nombre>.png
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, limpiar, RAIZ

pack = sys.argv[1]
S = int(sys.argv[2]) if len(sys.argv) > 2 else 2
solo = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else None
rutas = frames_del_pack(pack)
idx = solo if solo is not None else list(range(len(rutas)))
fr = []
for i in idx:
    im = limpiar(rutas[i]); b = im.getbbox(); fr.append((i, im.crop(b) if b else im))
lim = 300 if solo else 140
cw = min(lim, max(f.width for _, f in fr)) * (S if solo else 1) + 10
ch = min(lim, max(f.height for _, f in fr)) * (S if solo else 1) + 24
cols = max(1, (2400 if solo else 1500) // cw); filas = (len(fr) + cols - 1) // cols
hoja = Image.new('RGBA', (cols * cw, filas * ch), (70, 163, 127, 255)); d = ImageDraw.Draw(hoja)
for n, (i, f) in enumerate(fr):
    x, y = (n % cols) * cw, (n // cols) * ch
    k = S if (solo or max(f.width, f.height) <= 70) else 1
    f2 = f.resize((f.width * k, f.height * k), Image.NEAREST)
    if f2.width > cw - 8 or f2.height > ch - 22: f2.thumbnail((cw - 8, ch - 22), Image.NEAREST)
    hoja.paste(f2, (x + (cw - f2.width) // 2, y + ch - 4 - f2.height), f2)
    d.rectangle((x, y, x + 40, y + 14), fill=(20, 12, 28, 255)); d.text((x + 3, y + 2), str(i), fill=(255, 220, 80, 255))
os.makedirs(os.path.join(RAIZ, 'herramientas', '_revisar'), exist_ok=True)
nombre = os.path.basename(pack.rstrip('/\\')).replace(' ', '_')[:40] + ('_sel' if solo else '')
out = os.path.join(RAIZ, 'herramientas', '_revisar', 'pack_' + nombre + '.png')
hoja.save(out)
print(out, f'{len(rutas)} fotogramas en el pack (0-{len(rutas) - 1})')
for i, f in fr: print(i, os.path.basename(rutas[i]), f.size)
