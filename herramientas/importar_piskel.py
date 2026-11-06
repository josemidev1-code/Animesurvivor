"""Reordena/repite sprites originales editados en Piskel y devuelve la selección al juego.

No acepta dibujos nuevos ni fotogramas de otro pack. El manifiesto se genera con
preparar_piskel.py; los PNG editados deben corresponder a sprites exportados.
Uso: python herramientas/importar_piskel.py archivo.piskel --manifiesto origen.json
     --heroe goku --forma 0 --anim attack [--aplicar]
Sin --aplicar solo comprueba y muestra la selección; montar_animaciones.py la incorpora.
"""
import argparse
import base64
import hashlib
import io
import json
import re
from pathlib import Path
from PIL import Image
try:
    from .montar_animaciones import RAIZ, CLAVES, leer_config
except ImportError:
    from montar_animaciones import RAIZ, CLAVES, leer_config


def huella(im):
    """Ignora margen transparente, conservando píxeles, proporción y procedencia."""
    im = im.convert('RGBA')
    box = im.getbbox()
    if not box:
        raise ValueError('Fotograma vacío')
    im = im.crop(box)
    # Piskel puede cambiar RGB bajo alpha=0; no forma parte del dibujo.
    pixels = bytearray(im.tobytes())
    for i in range(0, len(pixels), 4):
        if pixels[i + 3] == 0:
            pixels[i:i + 3] = b'\0\0\0'
    return hashlib.sha256(str(im.size).encode() + pixels).hexdigest()


def leer_piskel(path):
    data = json.loads(Path(path).read_text(encoding='utf-8'))['piskel']
    w, h, fps = data['width'], data['height'], data['fps']
    if not (isinstance(w, int) and isinstance(h, int) and 0 < w <= 4096 and 0 < h <= 4096 and 0 < fps <= 60):
        raise ValueError('Tamaño o velocidad de Piskel inválidos')
    layers = [json.loads(x) if isinstance(x, str) else x for x in data['layers']]
    if len(layers) != 1 or layers[0].get('opacity', 1) != 1:
        raise ValueError('Usa una sola capa opaca para conservar los sprites originales')
    layer = layers[0]
    count = layer['frameCount']
    if not isinstance(count, int) or not 0 < count <= 1024:
        raise ValueError('Número de fotogramas inválido')
    frames = [None] * count
    for chunk in layer['chunks']:
        if not chunk['base64PNG'].startswith('data:image/png;base64,'):
            raise ValueError('La capa no contiene un PNG incrustado')
        image = Image.open(io.BytesIO(base64.b64decode(chunk['base64PNG'].split(',', 1)[1], validate=True))).convert('RGBA')
        # layout de Piskel es [columna][fila], con el índice de tiempo en cada celda.
        for x, column in enumerate(chunk['layout']):
            for y, index in enumerate(column):
                if index is None or index == -1:
                    continue
                if not isinstance(index, int) or not 0 <= index < count or frames[index] is not None:
                    raise ValueError('Índice duplicado o fuera de rango en layout')
                if (x + 1) * w > image.width or (y + 1) * h > image.height:
                    raise ValueError('Una celda del layout sale fuera de la imagen')
                frames[index] = image.crop((x*w, y*h, (x+1)*w, (y+1)*h))
    if any(x is None for x in frames):
        raise ValueError('Faltan fotogramas en el archivo Piskel')
    return frames, fps


def seleccion(piskel, manifest, heroe, forma, anim):
    origen = json.loads(Path(manifest).read_text(encoding='utf-8'))
    cfg = leer_config()[heroe][str(forma)]
    if origen.get('heroe') != heroe or str(origen.get('forma')) != str(forma) or origen.get('pack') != cfg['pack']:
        raise ValueError('El manifiesto no corresponde al personaje, forma y pack actuales')
    if anim not in CLAVES and not re.fullmatch(r'tecnica_[a-zA-Z0-9_]+', anim):
        raise ValueError('Animación desconocida')
    frames, fps = leer_piskel(piskel)
    known = {x['sha256']: x['indice'] for x in origen['frames']}
    indices, durations = [], []
    for i, frame in enumerate(frames):
        key = huella(frame)
        if key not in known:
            raise ValueError(f'Fotograma {i}: no coincide con un sprite original del manifiesto')
        index = known[key]
        if indices and indices[-1] == index:
            durations[-1] += 60 / fps
        else:
            indices.append(index)
            durations.append(60 / fps)
    if anim in ('ki', 'beam', 'hurt') and len(indices) == 1 and len(frames) >= 2:
        # Dos poses idénticas siguen siendo carga/descarga (o daño/retroceso).
        # Se conserva el tiempo total aunque Piskel haya duplicado la misma imagen.
        indices *= 2
        durations = [durations[0] / 2] * 2
    if anim in ('ki', 'beam', 'hurt') and len(indices) != 2:
        raise ValueError('Ki, rayo y daño necesitan exactamente dos fotogramas')
    return {anim: indices, anim + 'Du': [max(1, round(t)) for t in durations]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('piskel')
    parser.add_argument('--manifiesto', required=True)
    parser.add_argument('--heroe', required=True)
    parser.add_argument('--forma', default='0')
    parser.add_argument('--anim', required=True)
    parser.add_argument('--aplicar', action='store_true')
    args = parser.parse_args()
    result = seleccion(args.piskel, args.manifiesto, args.heroe, args.forma, args.anim)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.aplicar:
        path = Path(RAIZ) / 'herramientas/animaciones/zzzz_piskel.json'
        data = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'heroes': {}}
        data['heroes'].setdefault(args.heroe, {}).setdefault(args.forma, {}).update(result)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Selección guardada. Monta con: python herramientas/montar_animaciones.py {args.heroe}')


if __name__ == '__main__':
    main()
