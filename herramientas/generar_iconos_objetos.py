"""Dibuja a 26x26 los iconos de objetos cuyo recorte original era erróneo y los incrusta en el juego.

Sustituye en ui/objetos/ y en 02 - Código del juego/ui_imagenes.js: armaduraSaiyan, kinton, scouter,
scouterRojo, pesas, bastongoku y mafuba. Sin suavizado: 26 px caben exactos en el icono de 32 del juego.
Uso: python herramientas/generar_iconos_objetos.py
"""
import base64
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
TAM = 26


def lienzo():
    im = Image.new('RGBA', (TAM, TAM), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def armadura():
    im, d = lienzo()
    # traje azul al cuello
    d.rectangle([9, 1, 16, 4], fill='#2563eb')
    d.rectangle([10, 1, 15, 2], fill='#60a5fa')
    # hombreras doradas
    d.polygon([(1, 5), (8, 3), (8, 9), (3, 11), (1, 9)], fill='#eab308')
    d.polygon([(24, 5), (17, 3), (17, 9), (22, 11), (24, 9)], fill='#ca8a04')
    d.line([(2, 5), (8, 3)], fill='#fde047')
    d.line([(17, 3), (23, 5)], fill='#fde047')
    # peto blanco
    d.polygon([(6, 5), (19, 5), (20, 14), (5, 14)], fill='#f1f5f9')
    d.polygon([(13, 5), (19, 5), (20, 14), (13, 14)], fill='#cbd5e1')
    d.line([(9, 7), (12, 10)], fill='#94a3b8')
    d.line([(16, 7), (13, 10)], fill='#64748b')
    d.line([(6, 5), (19, 5)], fill='#ffffff')
    # bandas del abdomen
    for i, y in enumerate((15, 18, 21)):
        ancho = 7 - i
        d.rectangle([12 - ancho, y, 13 + ancho, y + 2], fill='#facc15')
        d.rectangle([13, y, 13 + ancho, y + 2], fill='#ca8a04')
        d.line([(12 - ancho, y), (13 + ancho, y)], fill='#fef08a')
    return im


def kinton():
    im, d = lienzo()
    # estela que se afina hacia la izquierda
    d.ellipse([0, 15, 6, 19], fill='#f59e0b')
    d.ellipse([3, 12, 11, 20], fill='#f59e0b')
    # cuerpo de la nube: sombra y luego luz
    for caja in ([6, 9, 17, 21], [13, 7, 24, 20], [9, 5, 19, 16]):
        d.ellipse(caja, fill='#f59e0b')
    for caja in ([7, 9, 16, 18], [14, 7, 23, 17], [10, 5, 18, 14], [4, 12, 10, 17]):
        d.ellipse(caja, fill='#fde047')
    for caja in ([11, 6, 15, 9], [16, 8, 20, 11], [7, 11, 10, 13]):
        d.ellipse(caja, fill='#fffbeb')
    return im


def scouter(lente, lente_luz, punto):
    im, d = lienzo()
    # banda sobre la cabeza
    d.arc([3, 1, 25, 25], 180, 330, fill='#94a3b8')
    d.arc([4, 2, 24, 24], 180, 330, fill='#475569')
    # auricular
    d.rectangle([18, 11, 24, 19], fill='#64748b')
    d.rectangle([18, 11, 24, 12], fill='#cbd5e1')
    d.rectangle([20, 14, 22, 16], fill='#ef4444')
    # brazo y lente
    d.rectangle([12, 14, 18, 16], fill='#475569')
    d.polygon([(1, 9), (14, 11), (14, 21), (3, 20)], fill='#1e293b')
    d.polygon([(2, 10), (13, 12), (13, 20), (4, 19)], fill=lente)
    d.polygon([(2, 10), (13, 12), (13, 14), (3, 13)], fill=lente_luz)
    d.rectangle([9, 16, 10, 17], fill=punto)
    d.line([(5, 18), (8, 18)], fill=lente_luz)
    return im


def pesas():
    im, d = lienzo()
    d.rectangle([7, 11, 18, 14], fill='#94a3b8')
    d.rectangle([7, 11, 18, 11], fill='#e2e8f0')
    d.rectangle([7, 14, 18, 14], fill='#475569')
    for x0, x1, y0, y1 in ((0, 2, 8, 17), (3, 6, 4, 21)):
        d.rectangle([x0, y0, x1, y1], fill='#334155')
        d.rectangle([x0, y0, x1, y0 + 1], fill='#64748b')
        d.rectangle([25 - x1, y0, 25 - x0, y1], fill='#1e293b')
        d.rectangle([25 - x1, y0, 25 - x0, y0 + 1], fill='#475569')
    # franja naranja de entrenamiento
    d.rectangle([3, 11, 6, 14], fill='#f97316')
    d.rectangle([19, 11, 22, 14], fill='#ea580c')
    return im


def baston():
    im, d = lienzo()
    for i in range(3, 23):
        x, y = 24 - i, i
        d.rectangle([x - 1, y - 1, x + 1, y + 1], fill='#b91c1c')
        d.point((x - 1, y - 1), fill='#f87171')
        d.point((x, y - 1), fill='#ef4444')
    for cx, cy in ((22, 3), (3, 22)):
        d.rectangle([cx - 2, cy - 2, cx + 2, cy + 2], fill='#d97706')
        d.rectangle([cx - 2, cy - 2, cx + 1, cy - 1], fill='#fde047')
        d.point((cx - 2, cy - 2), fill='#fffbeb')
    return im


def mafuba():
    im, d = lienzo()
    # tapa
    d.rectangle([9, 2, 16, 3], fill='#fbbf24')
    d.rectangle([6, 4, 19, 6], fill='#b45309')
    d.rectangle([6, 4, 19, 4], fill='#f59e0b')
    # cuerpo de la vasija
    d.ellipse([3, 6, 22, 24], fill='#92400e')
    d.ellipse([3, 6, 18, 22], fill='#c2410c')
    d.ellipse([5, 8, 11, 14], fill='#fb923c')
    # sello de papel
    d.rectangle([10, 8, 15, 23], fill='#fef3c7')
    d.rectangle([14, 8, 15, 23], fill='#fde68a')
    d.rectangle([11, 10, 13, 11], fill='#b91c1c')
    d.rectangle([12, 12, 12, 17], fill='#b91c1c')
    d.rectangle([11, 19, 13, 20], fill='#b91c1c')
    return im


ICONOS = {
    'armaduraSaiyan': armadura(),
    'kinton': kinton(),
    'scouter': scouter('#22c55e', '#86efac', '#fef08a'),
    'scouterRojo': scouter('#dc2626', '#fca5a5', '#fef08a'),
    'pesas': pesas(),
    'bastongoku': baston(),
    'mafuba': mafuba(),
}


def main():
    js = RAIZ / '02 - Código del juego' / 'ui_imagenes.js'
    texto = js.read_text(encoding='utf-8')
    for nombre, im in ICONOS.items():
        im.save(RAIZ / 'ui' / 'objetos' / f'{nombre}.png')
        buf = io.BytesIO()
        im.save(buf, 'PNG')
        dato = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
        texto, n = re.subn(rf'"{nombre}":"data:image/[^"]+"', lambda _: f'"{nombre}":{json.dumps(dato)}', texto)
        if n != 1:
            raise SystemExit(f'{nombre}: {n} coincidencias en ui_imagenes.js')
    js.write_text(texto, encoding='utf-8')
    print('Iconos generados:', ', '.join(ICONOS))


if __name__ == '__main__':
    main()
