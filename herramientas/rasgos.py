"""Rasgos de cada fotograma de un pack de sprites/, medidos sobre el fotograma limpio y reducido a su píxel real.

Las medidas se guardan en herramientas/_revisar/medidas/<pack>.json y solo se recalculan si cambian los archivos
del pack (los HD tardan en limpiarse).
"""
import collections, json, os, re, sys, unicodedata
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m

CACHE = os.path.join(m.RAIZ, 'herramientas', '_revisar', 'medidas')


def nombre_pack(pack):
    """Nombre de archivo estable para un pack: sin tildes, espacios ni barras."""
    s = unicodedata.normalize('NFKD', pack).encode('ascii', 'ignore').decode()
    return re.sub(r'[^0-9A-Za-z]+', '_', s).strip('_')[:120]


def comun(a, b):
    """Fracción de los píxeles de la paleta a cuyos colores también están en la paleta b."""
    cb = {tuple(c[:3]) for c in b}; tot = sum(c[3] for c in a)
    return sum(c[3] for c in a if tuple(c[:3]) in cb) / tot if tot else 0.0


def parecido(sa, sb):
    """Parecido de dos siluetas de 16x16 (en hex): 1 iguales, 0 opuestas."""
    return 1 - bin(int(sa, 16) ^ int(sb, 16)).count('1') / 256


def _manchas(im):
    w, h = im.size; px = im.load(); visto = set(); comps = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0 and (x, y) not in visto:
                pila = [(x, y)]; visto.add((x, y)); pts = []
                while pila:
                    a, b = pila.pop(); pts.append((a, b))
                    for da in (-1, 0, 1):
                        for db in (-1, 0, 1):
                            q = (a + da, b + db)
                            if 0 <= q[0] < w and 0 <= q[1] < h and q not in visto and px[q][3] > 0:
                                visto.add(q); pila.append(q)
                comps.append(pts)
    return sorted(comps, key=len, reverse=True)


def medir_fotograma(ruta, i):
    im = m.limpiar(ruta); b = im.getbbox()
    if not b: return {'i': i, 'vacio': True}
    im = im.crop(b); esc = m.escala_pixel(im)
    if esc > 1.05: im = im.resize((max(1, round(im.width / esc)), max(1, round(im.height / esc))), Image.NEAREST)
    b = im.getbbox()
    if not b: return {'i': i, 'vacio': True}
    im = im.crop(b); w, h = im.size; px = im.load()
    comps = _manchas(im); cuerpo = comps[0]; sueltos = [q for c in comps[1:] for q in c]
    cx = sum(q[0] for q in cuerpo) / len(cuerpo)
    arriba = [q[0] for q in cuerpo if q[1] < h / 2]; abajo = [q[0] for q in cuerpo if q[1] >= h / 2]
    incl = (sum(arriba) / len(arriba) - sum(abajo) / len(abajo)) / h if arriba and abajo else 0.0
    pal = collections.Counter((p[0] // 16, p[1] // 16, p[2] // 16)
                              for p in (px[x, y] for y in range(h) for x in range(w)) if p[3] > 0)
    mask = im.getchannel('A').point(lambda a: 255 if a else 0).resize((16, 16), Image.BOX)
    bits = ''.join('1' if v > 76 else '0' for v in mask.tobytes())
    return {'i': i, 'vacio': False, 'escala': round(esc, 3), 'alto': h, 'ancho': w, 'prop': round(w / h, 3),
            'incl': round(incl, 3), 'sueltos': round(len(sueltos) / (len(cuerpo) + len(sueltos)), 4),
            'sueltoX': round((sum(q[0] for q in sueltos) / len(sueltos) - cx) / h, 3) if sueltos else None,
            'paleta': [[r, g, bb, n] for (r, g, bb), n in pal.items()], 'silueta': f'{int(bits, 2):064x}'}


def rasgos_pack(pack, cache_dir=CACHE):
    """Rasgos de cada fotograma del pack, en el orden de frames_del_pack."""
    rutas = m.frames_del_pack(pack)
    firma = [[os.path.basename(r), os.path.getsize(r), os.stat(r).st_mtime_ns] for r in rutas]
    destino = os.path.join(cache_dir, nombre_pack(pack) + '.json')
    if os.path.exists(destino):
        with open(destino, encoding='utf-8') as fh: c = json.load(fh)
        if c.get('firma') == firma: return c['rasgos']
    rs = [medir_fotograma(r, i) for i, r in enumerate(rutas)]
    os.makedirs(cache_dir, exist_ok=True)
    with open(destino, 'w', encoding='utf-8') as fh: json.dump({'pack': pack, 'firma': firma, 'rasgos': rs}, fh)
    return rs
