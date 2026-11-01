"""Mide los fotogramas tal como están en el juego (animaciones_juego.js): tamaño del píxel de dibujo de cada
animación frente a la guardia, y manchas sueltas (polvo, chispas) en la animación de moverse."""
import sys, json, base64, io, collections, re
from PIL import Image
sys.path.insert(0, sys.argv[1] + '/herramientas')
from montar_animaciones import escala_pixel

src = open(sys.argv[1] + '/animaciones_juego.js', encoding='utf-8').read()
data = json.loads(src[src.index('{'):src.rindex('}') + 1])


def frames(a):
    im = Image.open(io.BytesIO(base64.b64decode(a['url'].split(',', 1)[1]))).convert('RGBA')
    return [im.crop((k * a['w'], 0, (k + 1) * a['w'], a['h'])) for k in range(im.width // a['w'])]


def manchas(im):
    """Píxeles opacos que no están unidos al cuerpo (la mancha más grande)."""
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


filas = []
for hid, formas in data['h'].items():
    for fk, f in formas.items():
        A = f['anims']
        if 'Idle' not in A: continue
        base = escala_pixel(frames(A['Idle'])[0])
        r = {'id': f'{hid}/{fk}', 'pack': f.get('pack', '')}
        for nom in ('Walk', 'Attack', 'Kick', 'Cast', 'Pow', 'Hurt'):
            if nom in A:
                fs = frames(A[nom])
                r[nom] = max((escala_pixel(x) / base for x in fs), key=lambda v: abs(v - 1))
        if 'Walk' in A:
            fw = frames(A['Walk'])
            r['suelto'] = max(manchas(x) for x in fw)
            r['altoWalk'] = max(x.getbbox()[3] - x.getbbox()[1] for x in fw if x.getbbox())
            r['altoIdle'] = frames(A['Idle'])[0].getbbox()[3] - frames(A['Idle'])[0].getbbox()[1]
        filas.append(r)

json.dump(filas, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(filas), 'formas')
mal = lambda v: v is not None and abs(v - 1) > 0.15
for nom in ('Walk', 'Attack', 'Kick', 'Cast', 'Pow', 'Hurt'):
    print(nom, 'con píxel distinto a la guardia (>15%):', sum(mal(r.get(nom)) for r in filas))
print('Moverse con manchas sueltas >5%:', sum(r.get('suelto', 0) > 0.05 for r in filas))
print('Moverse más bajo que el 70% de la guardia:', sum(r.get('altoWalk', 99) < 0.7 * r.get('altoIdle', 1) for r in filas))
