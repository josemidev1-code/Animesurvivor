"""Hojas para que la IA revise las propuestas: una fila por animación con los fotogramas propuestos (marco amarillo)
y sus vecinos (±3), una fila de efectos y un resumen en texto con los motivos de duda.

Uso:  python herramientas/hoja_dudosos.py      -> una hoja por cada propuesta sin "revisadoIA"
Salida: herramientas/_revisar/dudosos/<pack>.png y .txt

Tras mirarla, la IA corrige el JSON de herramientas/propuestas/ y pone "revisadoIA": true y "sigueDudoso": true/false.
"""
import glob, json, os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
from proponer_fotogramas import NOMBRES, PROPUESTAS
from rasgos import nombre_pack

SALIDA = os.path.join(m.RAIZ, 'herramientas', '_revisar', 'dudosos')
CELDA = 96
LETRA = ImageFont.load_default(13)  # con tildes y ñ


def miniatura(ruta):
    im = m.limpiar(ruta); b = im.getbbox()
    im = im.crop(b) if b else im
    im.thumbnail((CELDA - 6, CELDA - 18), Image.NEAREST)
    return im


def hoja(propuesta, salida_dir=SALIDA):
    rutas = m.frames_del_pack(propuesta['pack']); n = len(rutas); cache = {}
    def mini(i):
        if i not in cache: cache[i] = miniatura(rutas[i])
        return cache[i]
    filas = []
    for k, nom in NOMBRES.items():
        sel = propuesta.get(k) or []
        vecinos = sorted({j for i in sel for j in range(i - 3, i + 4) if 0 <= j < n})
        filas.append((nom, vecinos, set(sel)))
    ef = sorted({i for v in propuesta.get('efectos', {}).values() for i in v})
    filas.append(('efectos', ef, set(ef)))
    ancho = max(1, max(len(v) for _, v, _ in filas)) * CELDA + 110
    out = Image.new('RGBA', (ancho, len(filas) * CELDA), (70, 163, 127, 255)); d = ImageDraw.Draw(out)
    for f, (nom, idx, marcados) in enumerate(filas):
        y = f * CELDA; d.text((6, y + CELDA // 2 - 6), nom, fill=(255, 255, 255, 255), font=LETRA)
        for c, i in enumerate(idx):
            x = 110 + c * CELDA; t = mini(i)
            out.paste(t, (x + (CELDA - t.width) // 2, y + CELDA - 3 - t.height), t)
            if i in marcados: d.rectangle((x, y, x + CELDA - 1, y + CELDA - 1), outline=(255, 220, 0, 255), width=3)
            d.rectangle((x, y, x + 26, y + 12), fill=(20, 12, 28, 255)); d.text((x + 2, y + 1), str(i), fill=(255, 220, 80, 255))
    os.makedirs(salida_dir, exist_ok=True)
    base = os.path.join(salida_dir, nombre_pack(propuesta['pack']))
    out.save(base + '.png')
    lineas = [propuesta['pack'], f'{n} fotogramas', '', 'Motivos de duda:'] + [f'- {t}' for t in propuesta.get('motivos', [])]
    lineas += ['', 'Propuesta:'] + [f'{nom}: {propuesta.get(k) or []}' for k, nom in NOMBRES.items()]
    lineas += [f"retrato: {propuesta.get('portrait')}", f"efectos: {propuesta.get('efectos', {})}"]
    with open(base + '.txt', 'w', encoding='utf-8') as fh: fh.write('\n'.join(lineas) + '\n')
    return base + '.png', base + '.txt'


if __name__ == '__main__':
    for ruta in sorted(glob.glob(os.path.join(PROPUESTAS, '*.json'))):
        with open(ruta, encoding='utf-8') as fh: p = json.load(fh)
        if not p.get('revisadoIA'): print(*hoja(p))
