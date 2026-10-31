"""Propone fotogramas de MUERTE (tumbado) y RETRATO (cara grande) para cada forma elegida, buscando en su pack.

Escribe herramientas/animaciones/extras.json con "faint" y "portrait" (solo para las formas que no los tengan ya
puestos a mano). Después hay que revisarlos con previsualizar.py / revisar_todo.py como el resto.
Uso:  python herramientas/buscar_extras.py
"""
import json, os, sys
from collections import deque
from concurrent.futures import ProcessPoolExecutor
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import leer_config, frames_del_pack, RAIZ

SALIDA = os.path.join(RAIZ, 'herramientas', 'animaciones', 'extras.json')


def rasgos(ruta):
    """Forma del fotograma (reducido para ir rápido): caja visible, cobertura y variedad de colores."""
    im = Image.open(ruta).convert('RGBA'); k = max(1, max(im.size) // 120)
    im = im.resize((max(1, im.width // k), max(1, im.height // k)), Image.NEAREST); w, h = im.size; px = im.load()
    borde = [px[x, 0] for x in range(w)] + [px[x, h - 1] for x in range(w)] + [px[0, y] for y in range(h)] + [px[w - 1, y] for y in range(h)]
    from collections import Counter
    col, n = Counter(c[:3] for c in borde if c[3] >= 20).most_common(1)[0] if any(c[3] >= 20 for c in borde) else ((255, 255, 255), 0)
    liso = n >= len(borde) * 0.4
    fondo = lambda c: c[3] < 20 or (c[0] > 232 and c[1] > 232 and c[2] > 232) or (liso and sum(abs(c[i] - col[i]) for i in range(3)) <= 24)
    visto = set(); q = deque([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
    while q:
        x, y = q.popleft()
        if (x, y) in visto or not (0 <= x < w and 0 <= y < h): continue
        visto.add((x, y))
        if not fondo(px[x, y]): continue
        px[x, y] = (0, 0, 0, 0); q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    b = im.getbbox()
    if not b: return None
    bw, bh = b[2] - b[0], b[3] - b[1]
    op = sum(1 for y in range(b[1], b[3]) for x in range(b[0], b[2]) if px[x, y][3] > 0)
    colores = len({px[x, y][:3] for y in range(b[1], b[3]) for x in range(b[0], b[2]) if px[x, y][3] > 0})
    # retrato: imagen casi rectangular y opaca (la cara ocupa todo); sin limpiar el fondo se mide igual de bien
    return {'w': bw * k, 'h': bh * k, 'cob': op / max(1, bw * bh), 'col': colores, 'opaco_total': not liso and n == 0}


def analizar(args):
    heroe, forma, f = args
    rutas = frames_del_pack(f['pack'])
    R = [rasgos(r) for r in rutas]
    idle_h = sorted(R[i]['h'] for i in f.get('idle', [0]) if i < len(R) and R[i])[0]
    prop = {}
    if 'portrait' not in f:
        cand = [(i, r) for i, r in enumerate(R) if r and r['cob'] > 0.86 and 0.55 < r['w'] / r['h'] < 1.8 and r['col'] > 40 and r['h'] > idle_h * 0.45]
        if cand: prop['portrait'] = max(cand, key=lambda t: (t[1]['cob'], t[0]))[0]
    if 'faint' not in f:
        hurt = f.get('hurt', [0]); ref = max(hurt)
        cand = [i for i, r in enumerate(R) if r and 1.45 < r['w'] / r['h'] < 3.6 and 0.22 < r['cob'] < 0.75 and r['col'] > 15
                and r['h'] < idle_h * 0.75 and i not in f.get('move', [])]
        if cand:
            cerca = sorted(cand, key=lambda i: (0 if i > ref else 1, abs(i - ref)))
            sel = sorted(cerca[:2])
            if len(sel) == 2 and sel[1] - sel[0] > 3: sel = [cerca[0]]
            prop['faint'] = sel
    return heroe, forma, prop


def main():
    cfg = leer_config()
    trabajos = [(h, fo, f) for h, fs in cfg.items() for fo, f in fs.items() if 'pack' in f and ('portrait' not in f or 'faint' not in f)]
    salida = {}
    with ProcessPoolExecutor() as ex:
        for h, fo, prop in ex.map(analizar, trabajos):
            if prop: salida.setdefault(h, {})[fo] = prop
            print(h, fo, prop or 'nada')
    json.dump({'heroes': salida}, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('escrito', SALIDA)


if __name__ == '__main__':
    main()
