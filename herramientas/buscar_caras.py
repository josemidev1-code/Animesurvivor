"""Busca caras grandes (retratos) para las formas que no tienen una en su propio pack.

Para cada forma sin `portrait` ni `retrato` (o las que se pidan), mira todos los packs de la carpeta del mismo
personaje y propone los fotogramas que parecen una cara grande (silueta casi llena y casi cuadrada, más grande que el
sprite de juego). Saca una hoja por forma para revisarla a ojo: a la izquierda el sprite de juego, a la derecha las
candidatas con «pack · fotograma». La elección se apunta a mano en el JSON de la forma como
"retrato": ["<pack>", <fotograma>].

Uso:  python herramientas/buscar_caras.py                 (todas las formas sin cara propia)
      python herramientas/buscar_caras.py goku/2 black/0  (solo esas)
Salida: herramientas/_revisar/caras/<heroe>_<forma>.png y herramientas/_revisar/caras/candidatas.json
"""
import json, os, statistics, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
import montar_animaciones as m
from rasgos import rasgos_pack

SALIDA = os.path.join(m.RAIZ, 'herramientas', '_revisar', 'caras')
SPRITES = os.path.join(m.RAIZ, 'sprites')
MAX_CAND = 11


def formas():
    cfg = m.leer_config()
    return cfg.get('heroes', cfg)


def densidad(r):
    return bin(int(r['silueta'], 16)).count('1') / 256


def packs_hermanos(pack):
    carpeta = os.path.dirname(pack)
    base = os.path.join(SPRITES, carpeta)
    out = [pack]
    for d in sorted(os.listdir(base)):
        p = carpeta + '/' + d
        if p != pack and os.path.isdir(os.path.join(base, d)) and m.frames_del_pack(p):
            out.append(p)
    return out


def _fila(s, r):
    return bin(int(s, 16))[2:].zfill(256)[r * 16:(r + 1) * 16].count('1')


def candidatas(pack):
    """Fotogramas con forma de busto: silueta densa, casi cuadrada y cortada por abajo (las dos filas inferiores
    de la silueta casi llenas). Un cuerpo de pie acaba en los pies y un aura acaba en redondo."""
    try:
        rs = rasgos_pack(pack)
    except Exception:
        return []
    res = []
    for r in rs:
        if r.get('vacio') or r.get('alto', 0) < 30: continue
        s = r['silueta']
        if _fila(s, 15) >= 9 and _fila(s, 14) >= 9 and densidad(r) >= 0.55 and 0.55 <= r['prop'] <= 1.5:
            # primero los recuadros de cara (silueta llena también arriba y muy densa); las auras van detrás
            res.append((densidad(r) + (0.5 if _fila(s, 0) >= 14 else 0), r['i']))
    return res


def miniatura(im, w, h):
    im = im.crop(im.getbbox() or (0, 0, im.width, im.height))
    k = min(w / im.width, h / im.height)
    return im.resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.NEAREST)


CW, CH, COLS = 96, 112, 1 + MAX_CAND


def fila_hoja(clave, F, cands):
    """Una fila: el sprite de juego y las candidatas numeradas 0, 1, 2…"""
    img = Image.new('RGB', (CW * COLS, CH), (34, 34, 51))
    d = ImageDraw.Draw(img)
    try:
        anims, _, _ = m.cargar_forma(F)
        guardia = anims.get('Idle', [None])[0]
    except Exception:
        guardia = None
    celdas = [(clave, guardia)] + [(f'{j}', m.limpiar(m.frames_del_pack(p)[i])) for j, (p, i) in enumerate(cands)]
    for k, (txt, im) in enumerate(celdas):
        x = k * CW
        if im is not None:
            t = miniatura(im.convert('RGBA'), CW - 6, CH - 18)
            img.paste(t, (x + (CW - t.width) // 2, 2), t)
        d.text((x + 3, CH - 13), txt, fill=(255, 210, 63) if k == 0 else (255, 255, 255))
        d.line([(x + CW - 1, 0), (x + CW - 1, CH)], fill=(70, 70, 100))
    return img


def una(arg):
    clave, f = arg
    cands = []
    for p in packs_hermanos(f['pack']):
        for sc, i in candidatas(p):
            cands.append((sc, p, i))
    cands = [(p, i) for sc, p, i in sorted(cands, key=lambda c: -c[0])[:MAX_CAND]]
    fila_hoja(clave, f, cands).save(os.path.join(SALIDA, clave.replace('/', '_') + '.png'))
    print(clave, len(cands), flush=True)
    return clave, [[p, i] for p, i in cands]


def main():
    os.makedirs(SALIDA, exist_ok=True)
    H = formas()
    pedidas = sys.argv[1:]
    tareas = []
    for heroe, F in H.items():
        if heroe.startswith('e_') or not isinstance(F, dict): continue
        for n, f in F.items():
            if not isinstance(f, dict): continue
            clave = f'{heroe}/{n}'
            if pedidas and clave not in pedidas: continue
            if not pedidas and (f.get('retrato') or 'portrait' in f): continue
            tareas.append((clave, f))
    import multiprocessing
    with multiprocessing.Pool(os.cpu_count() or 2) as pool:
        todas = dict(pool.map(una, tareas, chunksize=1))
    # hojas de 8 formas para revisar de un vistazo
    claves = list(todas)
    for h in range(0, len(claves), 8):
        filas = [Image.open(os.path.join(SALIDA, c.replace('/', '_') + '.png')) for c in claves[h:h + 8]]
        hoja = Image.new('RGB', (CW * COLS, CH * len(filas)), (0, 0, 0))
        for k, im in enumerate(filas): hoja.paste(im, (0, k * CH))
        hoja.save(os.path.join(SALIDA, f'hoja_{h // 8:02d}.png'))
    with open(os.path.join(SALIDA, 'candidatas.json'), 'w', encoding='utf-8') as fh:
        json.dump(todas, fh, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
