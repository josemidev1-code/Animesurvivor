"""Monta las animaciones elegidas a mano en herramientas/animaciones.json y genera animaciones_juego.js.

Cada forma de personaje indica su pack de sprites/ y qué fotogramas (por número, en orden natural
de nombre de archivo) forman cada animación. El script limpia el fondo blanco, reduce los sprites
HD a su tamaño de píxel real, alinea todos los fotogramas por los pies y escribe las tiras en base64
(así el juego funciona abriendo index.html con doble clic, sin servidor).

Uso:  python herramientas/montar_animaciones.py            (todas)
      python herramientas/montar_animaciones.py goku vegeta (solo esos personajes)
"""
import base64, collections, glob, io, json, os, re, sys
from collections import deque
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(RAIZ, 'sprites')
# nombre en el juego -> duración por defecto de cada fotograma (ticks de 1/60 s)
DUR = {'Idle': 24, 'Walk': 8, 'Attack': 5, 'Kick': 6, 'Cast': 12, 'Pow': 6, 'Hurt': 10}
CLAVES = {'idle': 'Idle', 'move': 'Walk', 'attack': 'Attack', 'kick': 'Kick', 'ki': 'Cast', 'pow': 'Pow', 'hurt': 'Hurt'}
PIE = 4  # el juego recorta 4 filas de la parte de abajo de cada celda

nat = lambda s: [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)]


def frames_del_pack(pack):
    d = os.path.join(SPRITES, pack)
    if not os.path.isdir(d):
        # los nombres con tildes pueden venir mal codificados: busca por prefijo numérico
        pref = os.path.basename(pack).split('_')[0] + '_'
        cand = [p for p in glob.glob(os.path.join(SPRITES, os.path.dirname(pack), pref + '*')) if os.path.isdir(p)]
        if not cand: raise SystemExit(f'No encuentro el pack {pack}')
        d = cand[0]
    return sorted(glob.glob(os.path.join(d, '*.png')), key=lambda f: nat(os.path.basename(f)))


def limpiar(ruta):
    im = Image.open(ruta).convert('RGBA'); w, h = im.size; px = im.load(); visto = set(); q = deque()
    for x in range(w): q.extend([(x, 0), (x, h - 1)])
    for y in range(h): q.extend([(0, y), (w - 1, y)])
    while q:
        x, y = q.popleft()
        if (x, y) in visto or not (0 <= x < w and 0 <= y < h): continue
        visto.add((x, y)); c = px[x, y]
        if not (c[3] < 20 or (c[0] > 232 and c[1] > 232 and c[2] > 232)): continue
        px[x, y] = (0, 0, 0, 0); q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return im


def escala_pixel(im):
    """Tamaño de cada píxel del dibujo original (los sprites HD vienen ampliados, a veces por un factor no entero)."""
    px = im.load(); w, h = im.size; runs = collections.Counter()
    for y in range(0, h, max(1, h // 60)):
        r = 1
        for x in range(1, w):
            if px[x, y] == px[x - 1, y]: r += 1
            else:
                if px[x - 1, y][3] > 0: runs[r] += 1
                r = 1
    if not runs: return 1.0
    base = runs.most_common(1)[0][0]
    if base <= 1: return 1.0
    ok = [(r, c) for r, c in runs.items() if round(r / base) >= 1 and abs(r / base - round(r / base)) < 0.25]
    den = sum(c * round(r / base) for r, c in ok)
    return sum(c * r for r, c in ok) / den if den else 1.0


def ancla(im):
    """Punto de apoyo: centro de los pies (filas opacas más bajas) y borde inferior."""
    b = im.getbbox(); px = im.load()
    filas = max(2, (b[3] - b[1]) // 7); xs = []
    for y in range(b[3] - filas, b[3]):
        for x in range(b[0], b[2]):
            if px[x, y][3] > 0: xs.append(x)
    cx = (min(xs) + max(xs)) / 2 if xs else (b[0] + b[2]) / 2
    return cx, b[3]


def tira(imgs):
    """Une fotogramas en una tira de celdas iguales, alineados por los pies."""
    an = [ancla(i) for i in imgs]
    izq = max(cx - i.getbbox()[0] for i, (cx, _) in zip(imgs, an))
    der = max(i.getbbox()[2] - cx for i, (cx, _) in zip(imgs, an))
    alto = max(by - i.getbbox()[1] for i, (_, by) in zip(imgs, an))
    medio = int(max(izq, der)) + 2
    cw, ch = medio * 2, int(alto) + 2 + PIE
    out = Image.new('RGBA', (cw * len(imgs), ch), (0, 0, 0, 0))
    for k, (i, (cx, by)) in enumerate(zip(imgs, an)):
        out.paste(i, (k * cw + medio - round(cx), ch - PIE - by), i)
    return out, cw, ch


def data_url(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def cargar_forma(f):
    """Fotogramas ya limpios y reducidos de cada animación de una forma: {'Idle': [img,...], ...}, retrato."""
    rutas = frames_del_pack(f['pack'])
    usados = sorted({i for k in CLAVES for i in f.get(k, [])} | ({f['portrait']} if 'portrait' in f else set()))
    malos = [i for i in usados if i >= len(rutas)]
    if malos: raise SystemExit(f"{f['pack']}: el pack solo tiene {len(rutas)} fotogramas (0-{len(rutas) - 1}); no existen {malos}")
    crudos = {i: limpiar(rutas[i]) for i in usados}
    # cada fotograma puede venir ampliado a un zoom distinto: se mide uno a uno; si está cerca del
    # zoom habitual del pack se usa el habitual (la medida tiene algo de ruido y no queremos que el tamaño baile)
    medidas = {i: escala_pixel(crudos[i]) for i in usados}
    esc = f.get('escala') or sorted(medidas[i] for i in f.get('idle', usados))[len(f.get('idle', usados)) // 2]
    fija = f.get('escalaFija', False)
    def escala_de(i):
        m = medidas[i]
        if fija or esc <= 1.05 or abs(m - esc) / esc < 0.12: return esc
        return m
    red = lambda i: crudos[i].resize((max(1, round(crudos[i].width / escala_de(i))), max(1, round(crudos[i].height / escala_de(i)))), Image.NEAREST) if escala_de(i) > 1.05 else crudos[i]
    peq = {i: red(i) for i in usados}
    if f.get('espejo'):  # el pack mira a la izquierda: el juego necesita que miren a la derecha
        peq = {i: im.transpose(Image.FLIP_LEFT_RIGHT) for i, im in peq.items()}
    anims = {nombre: [peq[i] for i in f[k]] for k, nombre in CLAVES.items() if f.get(k)}
    ret = peq[f['portrait']] if 'portrait' in f else None
    return anims, (ret.crop(ret.getbbox()) if ret else None), esc


def montar_forma(f):
    anims, ret, _ = cargar_forma(f)
    out = {}
    for k, nombre in CLAVES.items():
        if nombre not in anims: continue
        im, cw, ch = tira(anims[nombre])
        du = f.get(k + 'Du') or [DUR[nombre]] * len(anims[nombre])
        out[nombre] = {'w': cw, 'h': ch, 'du': du, 'url': data_url(im)}
    res = {'anims': out, 'pack': f['pack']}
    if ret: res['portrait'] = data_url(ret)
    return res


def leer_config():
    """herramientas/animaciones.json más cualquier herramientas/animaciones/*.json (un archivo por grupo de personajes)."""
    heroes = {}
    rutas = [os.path.join(RAIZ, 'herramientas', 'animaciones.json')] + sorted(glob.glob(os.path.join(RAIZ, 'herramientas', 'animaciones', '*.json')))
    for r in rutas:
        if not os.path.exists(r): continue
        for h, formas in json.load(open(r, encoding='utf-8')).get('heroes', {}).items():
            heroes.setdefault(h, {}).update(formas)
    return heroes


def main():
    heroes = leer_config()
    solo = set(sys.argv[1:])
    destino = os.path.join(RAIZ, 'animaciones_juego.js')
    previo = {}
    if solo and os.path.exists(destino):
        t = open(destino, encoding='utf-8').read(); previo = json.loads(t[t.index('{'):t.rindex('}') + 1])['h']
    salida = {k: v for k, v in previo.items() if k not in solo}
    for heroe, formas in heroes.items():
        if solo and heroe not in solo: continue
        salida[heroe] = {}
        for forma, f in formas.items():
            salida[heroe][forma] = montar_forma(f)
            a = salida[heroe][forma]['anims']
            print(heroe, forma, ' '.join(f'{n}{len(v["du"])}({v["w"]}x{v["h"]})' for n, v in a.items()))
    with open(destino, 'w', encoding='utf-8') as fh:
        fh.write('// Generado por herramientas/montar_animaciones.py a partir de herramientas/animaciones.json. No editar a mano.\n')
        fh.write('window.ANIM_SET=' + json.dumps({'h': salida}, separators=(',', ':')) + ';\n')
    print('escrito', destino, round(os.path.getsize(destino) / 1024), 'KB')


if __name__ == '__main__':
    main()
