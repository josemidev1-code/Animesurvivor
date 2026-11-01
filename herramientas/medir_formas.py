"""Mide los fotogramas tal como están en el juego (animaciones_juego.js) y lista tres problemas:

- sueltos:    polvo o chispas separadas del cuerpo en la animación de moverse (más del 5 % de los píxeles opacos);
- agachadas:  la pose de moverse mide menos del 70 % del alto de la guardia;
- desiguales: algún fotograma con el píxel de dibujo más de un 15 % distinto del de la guardia.

Uso:  python herramientas/medir_formas.py
"""
import base64, io, json, os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import escala_pixel, RAIZ

ANIMS = ('Walk', 'Attack', 'Kick', 'Cast', 'Pow', 'Hurt')


def frames(a):
    """Fotogramas de una tira del juego ({'w','h','url'})."""
    im = Image.open(io.BytesIO(base64.b64decode(a['url'].split(',', 1)[1]))).convert('RGBA')
    return [im.crop((k * a['w'], 0, (k + 1) * a['w'], a['h'])) for k in range(im.width // a['w'])]


def manchas(im):
    """Fracción de píxeles opacos que no están unidos (vecindad de 8) a la mancha más grande."""
    w, h = im.size; px = im.load(); seen = set(); comps = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0 and (x, y) not in seen:
                st = [(x, y)]; seen.add((x, y)); n = 0
                while st:
                    a, b = st.pop(); n += 1
                    for da in (-1, 0, 1):
                        for db in (-1, 0, 1):
                            q = (a + da, b + db)
                            if 0 <= q[0] < w and 0 <= q[1] < h and q not in seen and px[q][3] > 0:
                                seen.add(q); st.append(q)
                comps.append(n)
    comps.sort(reverse=True)
    return sum(comps[1:]) / max(1, sum(comps))


def alto(im):
    b = im.getbbox()
    return b[3] - b[1] if b else 0


def medir(ruta_js):
    """Una fila por forma con la escala de cada animación relativa a la guardia, polvo y altos."""
    src = open(ruta_js, encoding='utf-8').read()
    data = json.loads(src[src.index('{'):src.rindex('}') + 1])
    filas = []
    for hid, formas in data['h'].items():
        for fk, f in formas.items():
            A = f['anims']
            if 'Idle' not in A: continue
            guardia = frames(A['Idle'])[0]
            base = escala_pixel(guardia)
            r = {'id': f'{hid}/{fk}', 'pack': f.get('pack', '')}
            for nom in ANIMS:
                if nom in A:
                    r[nom] = max((escala_pixel(x) / base for x in frames(A[nom])), key=lambda v: abs(v - 1))
            if 'Walk' in A:
                fw = frames(A['Walk'])
                r['suelto'] = max(manchas(x) for x in fw)
                r['altoWalk'] = max(alto(x) for x in fw)
                r['altoIdle'] = alto(guardia)
            filas.append(r)
    return filas


def problemas(filas):
    return {
        'sueltos': [r['id'] for r in filas if r.get('suelto', 0) > 0.05],
        'agachadas': [r['id'] for r in filas if 'altoWalk' in r and r['altoWalk'] < 0.7 * r['altoIdle']],
        'desiguales': [r['id'] for r in filas if any(r.get(n) is not None and abs(r[n] - 1) > 0.15 for n in ANIMS)],
    }


if __name__ == '__main__':
    p = problemas(medir(os.path.join(RAIZ, 'animaciones_juego.js')))
    for k, v in p.items():
        print(f'{k} ({len(v)}):', ' '.join(v))
