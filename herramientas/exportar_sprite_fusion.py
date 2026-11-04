"""Exporta una imagen limpia de cada forma del juego para generar su ciclo de andar en Sprite Fusion (AI Pixel Art
Animator, https://www.spritefusion.com/) con la cuenta de Josemi.

Saca de 02 - Código del juego/animaciones_juego.js el primer fotograma de guardia (Idle) de cada forma, tal como se ve
en el juego (mirando a la derecha, sin fondo), ampliado x4 sin suavizar, a:
    Recursos pendientes/sprite_fusion/entrada/<heroe>_<forma>.png
Uso:  python herramientas/exportar_sprite_fusion.py [heroe ...]      (sin nada: todas las formas)
Lo generado se deja en Recursos pendientes/sprite_fusion/salida/ y se mete en el juego con importar_sprite_fusion.py.
"""
import base64, io, json, os, re, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANIM = os.path.join(RAIZ, '02 - Código del juego', 'animaciones_juego.js')
SALIDA = os.path.join(RAIZ, 'Recursos pendientes', 'sprite_fusion', 'entrada')
ZOOM = 4
PIE = 4  # el juego recorta 4 filas de la parte de abajo de cada fotograma


def anim_set():
    t = open(ANIM, encoding='utf-8').read()
    return json.loads(t[t.index('{'):t.rindex('}') + 1])['h']


def fotograma(a, i=0):
    """Fotograma i de una animación del juego ({w, h, du, url}) sin las filas del pie."""
    im = Image.open(io.BytesIO(base64.b64decode(a['url'].split(',', 1)[1]))).convert('RGBA')
    return im.crop((i * a['w'], 0, (i + 1) * a['w'], a['h'] - PIE))


def main():
    H = anim_set(); quiero = set(sys.argv[1:]); os.makedirs(SALIDA, exist_ok=True); n = 0
    for h, formas in H.items():
        if quiero and h not in quiero: continue
        for f, F in formas.items():
            fr = fotograma(F['anims']['Idle']); b = fr.getbbox()
            if not b: continue
            fr = fr.crop(b); fr = fr.resize((fr.width * ZOOM, fr.height * ZOOM), Image.NEAREST)
            fr.save(os.path.join(SALIDA, f'{h}_{f}.png')); n += 1
    print(n, 'imágenes en', SALIDA)


if __name__ == '__main__':
    main()
