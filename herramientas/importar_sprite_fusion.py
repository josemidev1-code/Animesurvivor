"""Mete en el juego los ciclos de andar generados con Sprite Fusion.

Deja cada resultado en  Recursos pendientes/sprite_fusion/salida/<heroe>_<forma>.<png|gif|webp>  (el mismo nombre que la
imagen de entrada). Vale un GIF/WebP animado o una tira PNG: fotogramas en fila separados por columnas transparentes, o
cuadrados del alto de la imagen, o indicando el número al final del nombre (goku_0_8.png = 8 fotogramas en fila).
Si la imagen no tiene transparencia se quita el color de las esquinas.

Cada fotograma se recorta, se escala (vecino más cercano) a la altura que el personaje tiene en el juego y se apoya en
los pies. Escribe  02 - Código del juego/andar_frames.js  (window.ANDAR_FRAMES); el juego usa esos pasos al andar en
lugar de los generados por código. Revisar siempre el resultado a ojo (herramientas/andar_revision.js).
Uso:  python herramientas/importar_sprite_fusion.py
"""
import base64, io, json, os, re, sys
from PIL import Image, ImageSequence

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from exportar_sprite_fusion import RAIZ, anim_set, fotograma, PIE

ENTRADA = os.path.join(RAIZ, 'Recursos pendientes', 'sprite_fusion', 'salida')
JS = os.path.join(RAIZ, '02 - Código del juego', 'andar_frames.js')
DU = 6  # ticks de 1/60 s por fotograma (unos 10 por segundo)


def sin_fondo(im):
    im = im.convert('RGBA')
    if im.getextrema()[3][0] < 250: return im
    px = im.load(); fondo = px[0, 0][:3]
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if abs(r - fondo[0]) + abs(g - fondo[1]) + abs(b - fondo[2]) < 24: px[x, y] = (0, 0, 0, 0)
    return im


def trocear(ruta, n=0):
    im = Image.open(ruta)
    if getattr(im, 'is_animated', False): return [sin_fondo(f.copy()) for f in ImageSequence.Iterator(im)]
    im = sin_fondo(im)
    if n: w = im.width // n; return [im.crop((i * w, 0, (i + 1) * w, im.height)) for i in range(n)]
    a = im.split()[3]; cols = [any(a.getpixel((x, y)) > 40 for y in range(im.height)) for x in range(im.width)]
    tramos, x = [], 0
    while x < im.width:
        if cols[x]:
            x0 = x
            while x < im.width and cols[x]: x += 1
            tramos.append((x0, x))
        else: x += 1
    if len(tramos) > 1: return [im.crop((a0, 0, a1, im.height)) for a0, a1 in tramos]
    if im.width % im.height == 0 and im.width > im.height:
        return [im.crop((i * im.height, 0, (i + 1) * im.height, im.height)) for i in range(im.width // im.height)]
    return [im]


def main():
    H = anim_set(); out = {}
    if not os.path.isdir(ENTRADA): os.makedirs(ENTRADA)
    for nom in sorted(os.listdir(ENTRADA)):
        base, ext = os.path.splitext(nom)
        if ext.lower() not in ('.png', '.gif', '.webp'): continue
        m = re.match(r'(.+?)_(\d+)(?:_(\d+))?$', base)
        if not m or m.group(1) not in H or m.group(2) not in H[m.group(1)]: print('sin forma en el juego:', nom); continue
        h, f = m.group(1), m.group(2)
        ref = fotograma(H[h][f]['anims']['Idle']); alto = ref.getbbox()[3] - ref.getbbox()[1]
        frs = []
        for fr in trocear(os.path.join(ENTRADA, nom), int(m.group(3) or 0)):
            b = fr.getbbox()
            if not b: continue
            fr = fr.crop(b); k = alto / fr.height
            frs.append(fr.resize((max(1, round(fr.width * k)), alto), Image.NEAREST))
        if len(frs) < 2: print('menos de 2 fotogramas, se salta:', nom); continue
        W = max(f.width for f in frs) + 2; Hh = alto + 2 + PIE
        tira = Image.new('RGBA', (W * len(frs), Hh), (0, 0, 0, 0))
        for i, fr in enumerate(frs): tira.paste(fr, (i * W + (W - fr.width) // 2, Hh - PIE - fr.height), fr)
        bio = io.BytesIO(); tira.save(bio, 'PNG')
        out[f'{h}/{f}'] = {'w': W, 'h': Hh, 'du': [DU] * len(frs), 'url': 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()}
        print(f'{h}/{f}: {len(frs)} pasos')
    with open(JS, 'w', encoding='utf-8') as fh:
        fh.write('// Generado por herramientas/importar_sprite_fusion.py (ciclos de andar de Sprite Fusion). No editar a mano.\n')
        fh.write('window.ANDAR_FRAMES=' + json.dumps(out, separators=(',', ':')) + ';\n')
    print(len(out), 'formas con pasos de Sprite Fusion ->', JS)


if __name__ == '__main__':
    main()
