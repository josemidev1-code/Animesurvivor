"""Previsualiza las animaciones elegidas de un personaje/forma tal como saldrán en el juego.

Uso:  python herramientas/previsualizar.py goku 0
Salida en herramientas/_revisar/:
  <heroe>_<forma>.png  hoja: una fila por animación, fotogramas alineados por los pies (para revisar)
  <heroe>_<forma>.gif  todas las animaciones moviéndose a la vez, con sus duraciones reales
"""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import leer_config, cargar_forma, tira, CLAVES, DUR, RAIZ

heroe, forma = sys.argv[1], sys.argv[2]
f = leer_config()[heroe][forma]
anims, ret, esc = cargar_forma(f)
Z = 3
tiras = {n: tira(fr) for n, fr in anims.items()}
os.makedirs(os.path.join(RAIZ, 'herramientas', '_revisar'), exist_ok=True)
base = os.path.join(RAIZ, 'herramientas', '_revisar', f'{heroe}_{forma}')

# hoja estática
W = max(im.width for im, _, _ in tiras.values()) * Z + 120
H = sum(ch * Z + 8 for _, _, ch in tiras.values()) + (ret.height * 2 + 10 if ret else 0) + 10
hoja = Image.new('RGBA', (max(W, 300), H), (70, 163, 127, 255)); d = ImageDraw.Draw(hoja); y = 6
for n, (im, cw, ch) in tiras.items():
    d.text((4, y + ch * Z // 2), f'{n} x{im.width // cw}', fill=(255, 255, 255, 255))
    for k in range(im.width // cw):
        d.rectangle((110 + k * cw * Z, y, 110 + (k + 1) * cw * Z - 1, y + ch * Z - 1), outline=(45, 120, 92, 255))
        d.line((110 + k * cw * Z, y + (ch - 4) * Z, 110 + (k + 1) * cw * Z - 1, y + (ch - 4) * Z), fill=(200, 60, 60, 255))
    hoja.paste(im.resize((im.width * Z, im.height * Z), Image.NEAREST), (110, y), im.resize((im.width * Z, im.height * Z), Image.NEAREST))
    y += ch * Z + 8
if ret:
    d.text((4, y + 20), 'retrato', fill=(255, 255, 255, 255)); r2 = ret.resize((ret.width * 2, ret.height * 2), Image.NEAREST); hoja.paste(r2, (110, y), r2)
hoja.save(base + '.png')

# gif animado
cel = max(cw for _, cw, _ in tiras.values()); alto = max(ch for _, _, ch in tiras.values())
GW, GH = cel * Z * len(tiras), alto * Z + 16
paso = 1000 / 60 * 2
fotos = []
for t in range(0, 150):
    c = Image.new('RGBA', (GW, GH), (70, 163, 127, 255)); dd = ImageDraw.Draw(c)
    for j, (n, (im, cw, ch)) in enumerate(tiras.items()):
        clave = [k for k, v in CLAVES.items() if v == n][0]
        du = f.get(clave + 'Du') or [DUR[n]] * (im.width // cw)
        tick = (t * 2) % sum(du); k = 0
        while tick >= du[k]: tick -= du[k]; k += 1
        cell = im.crop((k * cw, 0, (k + 1) * cw, ch)).resize((cw * Z, ch * Z), Image.NEAREST)
        x0 = j * cel * Z; c.paste(cell, (x0 + (cel * Z - cell.width) // 2, GH - cell.height), cell)
        dd.text((x0 + 4, 3), n, fill=(255, 255, 255, 255))
    fotos.append(c.convert('P', palette=Image.ADAPTIVE))
fotos[0].save(base + '.gif', save_all=True, append_images=fotos[1:], duration=round(paso), loop=0, disposal=2)
print(base + '.png'); print(base + '.gif'); print('escala del pack:', round(esc, 2))
