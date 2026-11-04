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
DUR = {'Idle': 24, 'Walk': 8, 'Attack': 5, 'Kick': 6, 'Cast': 12, 'Pow': 6, 'Hurt': 10, 'Faint': 14, 'Attack2': 5, 'Attack3': 5, 'Kick2': 6, 'Beam': 12, 'Up': 6, 'Dash': 8, 'Throw': 6, 'FxGenki': 6}
CLAVES = {'idle': 'Idle', 'move': 'Walk', 'attack': 'Attack', 'kick': 'Kick', 'ki': 'Cast', 'pow': 'Pow', 'hurt': 'Hurt', 'faint': 'Faint',
          # ataques extra del pack (4 nov.): más combos, pose propia de rayo, brazos arriba y embestida
          'attack2': 'Attack2', 'attack3': 'Attack3', 'kick2': 'Kick2', 'beam': 'Beam', 'up': 'Up', 'dash': 'Dash', 'throw': 'Throw', 'fxgenki': 'FxGenki'}
PIE = 4  # el juego recorta 4 filas de la parte de abajo de cada celda
ALTO_BASE = 52  # alto en píxeles de la postura de guardia de un adulto (ver "altura" en cada forma)

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
    """Quita el fondo: blanco, o el color liso que rodee al personaje (algunos packs traen fondo azul, verde...)."""
    im = Image.open(ruta).convert('RGBA'); w, h = im.size; px = im.load(); visto = set(); q = deque()
    borde = [px[x, 0] for x in range(w)] + [px[x, h - 1] for x in range(w)] + [px[0, y] for y in range(h)] + [px[w - 1, y] for y in range(h)]
    color, n = collections.Counter(c[:3] for c in borde if c[3] >= 20).most_common(1)[0] if any(c[3] >= 20 for c in borde) else ((255, 255, 255), 0)
    liso = n >= len(borde) * 0.4
    def fondo(c):
        if c[3] < 20: return True
        if c[0] > 232 and c[1] > 232 and c[2] > 232: return True
        return liso and abs(c[0] - color[0]) + abs(c[1] - color[1]) + abs(c[2] - color[2]) <= 24
    for x in range(w): q.extend([(x, 0), (x, h - 1)])
    for y in range(h): q.extend([(0, y), (w - 1, y)])
    while q:
        x, y = q.popleft()
        if (x, y) in visto or not (0 <= x < w and 0 <= y < h): continue
        visto.add((x, y))
        if not fondo(px[x, y]): continue
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


def quitar_sueltos(im, max_parte=0.25):
    """Borra el polvo y las chispas separadas del cuerpo: manchas no unidas (vecindad de 8) a la principal y más
    pequeñas que max_parte de ella. Las grandes se quedan (espadas, colas o auras que vienen separadas)."""
    w, h = im.size; px = im.load(); visto = set(); comps = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0 and (x, y) not in visto:
                pila = [(x, y)]; visto.add((x, y)); puntos = []
                while pila:
                    a, b = pila.pop(); puntos.append((a, b))
                    for da in (-1, 0, 1):
                        for db in (-1, 0, 1):
                            q = (a + da, b + db)
                            if 0 <= q[0] < w and 0 <= q[1] < h and q not in visto and px[q][3] > 0:
                                visto.add(q); pila.append(q)
                comps.append(puntos)
    if len(comps) < 2: return im
    mayor = max(len(c) for c in comps); out = im.copy(); po = out.load()
    for c in comps:
        if len(c) < max_parte * mayor:
            for q in c: po[q] = (0, 0, 0, 0)
    return out


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


def busto(im):
    """Cara de reserva cuando no hay retrato: cabeza y hombros del fotograma de guardia, centrados en la cabeza."""
    b = im.getbbox(); alto = b[3] - b[1]; y1 = b[1] + max(14, round(alto * 0.5)); px = im.load()
    cab = [x for y in range(b[1], b[1] + max(6, alto // 5)) for x in range(b[0], b[2]) if px[x, y][3] > 0]
    cx = (min(cab) + max(cab)) / 2 if cab else (b[0] + b[2]) / 2; m = round((y1 - b[1]) * 0.5)
    c = im.crop((max(0, round(cx - m)), b[1], min(im.width, round(cx + m)), y1))
    return c


def data_url(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def cargar_forma(f):
    """Fotogramas ya limpios y reducidos de cada animación de una forma: {'Idle': [img,...], ...}, retrato."""
    rutas = frames_del_pack(f['pack'])
    if f.get('pack2'):  # pack hermano (p. ej. el de daño aparte): sus fotogramas se numeran desde 1000
        rutas = dict(enumerate(rutas)); rutas.update({1000 + j: r for j, r in enumerate(frames_del_pack(f['pack2']))})
    usados = sorted({i for k in CLAVES for i in f.get(k, [])} | ({f['portrait']} if 'portrait' in f else set()))
    malos = [i for i in usados if i not in rutas] if isinstance(rutas, dict) else [i for i in usados if i >= len(rutas)]
    if malos: raise SystemExit(f"{f['pack']}: el pack solo tiene {len(rutas)} fotogramas (0-{len(rutas) - 1}); no existen {malos}")
    crudos = {i: limpiar(rutas[i]) for i in usados}
    # cada fotograma puede venir ampliado a un zoom distinto: se mide uno a uno; si está cerca del
    # zoom habitual del pack se usa el habitual (la medida tiene algo de ruido y no queremos que el tamaño baile)
    medidas = {i: escala_pixel(crudos[i]) for i in usados}
    esc = f.get('escala') or sorted(medidas[i] for i in f.get('idle', usados))[len(f.get('idle', usados)) // 2]
    fija = f.get('escalaFija', False)
    # si no se detecta el zoom (sale ~1) pero el personaje es enorme, se escala por altura: ~56 px de pie
    alto_idle = sorted(crudos[i].getbbox()[3] - crudos[i].getbbox()[1] for i in f.get('idle', usados))[0]
    if not f.get('escala') and alto_idle / max(esc, 1) > 110:
        esc, fija = alto_idle / 56, True
    manual = {int(k): v for k, v in f.get('escalaFrames', {}).items()}  # zoom a mano de fotogramas sueltos
    def escala_de(i):
        if i in manual: return manual[i]
        m = medidas[i]
        if fija or esc <= 1.05 or abs(m - esc) / esc < 0.12: return esc
        return m
    red = lambda i: crudos[i].resize((max(1, round(crudos[i].width / escala_de(i))), max(1, round(crudos[i].height / escala_de(i)))), Image.NEAREST) if escala_de(i) > 1.05 else crudos[i]
    peq = {i: red(i) for i in usados}
    if not f.get('conservarSueltos'):  # al moverse, sin polvo ni chispas pegadas al fotograma
        for i in f.get('move', []): peq[i] = quitar_sueltos(peq[i])
    if f.get('espejo'):  # el pack mira a la izquierda: el juego necesita que miren a la derecha
        peq = {i: im.transpose(Image.FLIP_LEFT_RIGHT) for i, im in peq.items()}
    # mismo tamaño en todas las formas: la postura de guardia se lleva a la altura del personaje (ALTO_BASE
    # o "altura" en la forma); así no encoge ni crece al transformarse aunque cada pack venga a otra escala
    altos = sorted(peq[i].getbbox()[3] - peq[i].getbbox()[1] for i in f.get('idle', usados) if peq[i].getbbox())
    k = (f.get('altura') or ALTO_BASE) / altos[len(altos) // 2] if altos else 1
    if abs(k - 1) > 0.04:
        peq = {i: im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.NEAREST) for i, im in peq.items()}
    anims = {nombre: [peq[i] for i in f[k2]] for k2, nombre in CLAVES.items() if f.get(k2)}
    if 'Hurt' in anims:  # nunca tumbado en el suelo: si un fotograma de daño está tumbado se usa el de pie
        de_pie = [im for im in anims['Hurt'] if (lambda b: (b[2] - b[0]) <= 1.35 * (b[3] - b[1]))(im.getbbox())]
        if de_pie: anims['Hurt'] = [de_pie[min(j, len(de_pie) - 1)] for j in range(len(anims['Hurt']))]
    ret = None
    if f.get('retrato'):  # cara grande de otro pack del mismo personaje: ["<pack>", fotograma]
        rp, ri = f['retrato']; ret = limpiar(frames_del_pack(rp)[ri]); e = escala_pixel(ret)
        if e > 1.05: ret = ret.resize((max(1, round(ret.width / e)), max(1, round(ret.height / e))), Image.NEAREST)
    elif 'portrait' in f:
        ret = crudos[f['portrait']]; e = medidas[f['portrait']]
        if e > 1.05: ret = ret.resize((max(1, round(ret.width / e)), max(1, round(ret.height / e))), Image.NEAREST)
    if not ret and anims.get('Idle'):
        ret = busto(anims['Idle'][0])
    if ret:  # caras gigantes (packs HD sin zoom detectable): se reducen a un tamaño de retrato
        ret = ret.crop(ret.getbbox()); m = max(ret.size)
        if m > 64: k = -(-m // 64); ret = ret.resize((max(1, ret.width // k), max(1, ret.height // k)), Image.NEAREST)
    return anims, ret, esc


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
    # sin cara grande propia ni de otro pack: el retrato es un recorte del sprite; la selección no lo enseña
    if ret and not (f.get('retrato') or 'portrait' in f): res['busto'] = 1
    return res


def leer_config():
    """herramientas/animaciones.json más cualquier herramientas/animaciones/*.json (un archivo por grupo de personajes)."""
    heroes = {}
    rutas = [os.path.join(RAIZ, 'herramientas', 'animaciones.json')] + sorted(glob.glob(os.path.join(RAIZ, 'herramientas', 'animaciones', '*.json')))
    for r in rutas:
        if not os.path.exists(r): continue
        for h, formas in json.load(open(r, encoding='utf-8')).get('heroes', {}).items():
            for f, e in formas.items():  # se mezcla campo a campo: extras.json solo añade muerte y retrato
                heroes.setdefault(h, {}).setdefault(f, {}).update(e)
    return heroes


def main():
    heroes = leer_config()
    solo = set(sys.argv[1:])
    destino = os.path.join(RAIZ, '02 - Código del juego/animaciones_juego.js')
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
