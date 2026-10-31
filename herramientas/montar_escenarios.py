"""Genera escenarios_tiles.js: suelos y decorados reales para los mapas (pack Ninja Adventure, CC0, de Pixel-Boy y AAA).

Los suelos sustituyen a los conjuntos de TILES dibujados por código; los decorados, a los árboles y rocas genéricos de DECOR.
Uso: python herramientas/montar_escenarios.py [vista.png]   (con vista, guarda además un mosaico de prueba de cada suelo)
"""
import base64, io, json, os, random, sys
from PIL import Image, ImageDraw
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(RAIZ, 'sprites', '06_Escenarios', 'Tiles')
hoja = lambda n: Image.open(os.path.join(D, n + '.png')).convert('RGBA')
FL, IN, VI = hoja('tileset_floor'), hoja('tileset_interior_floor'), hoja('tileset_village_abandoned')
t16 = lambda im, c, r: im.crop((c * 16, r * 16, c * 16 + 16, r * 16 + 16))

# suelo del juego -> (hoja, [(columna, fila)...], filtro CSS opcional para teñir)
SUELOS = {
    'grass':   (FL, [(11, 12), (12, 12), (13, 12), (14, 12), (15, 12)], ''),
    'steppe':  (FL, [(0, 12), (1, 12), (2, 12), (3, 12), (4, 12)], ''),
    'sand':    (FL, [(0, 5), (1, 5), (2, 5), (3, 5), (4, 5)], ''),
    'canyon':  (FL, [(11, 19), (12, 19), (13, 19), (14, 19), (15, 19)], ''),
    'redrock': (FL, [(11, 5), (12, 5), (13, 5), (14, 5), (15, 5)], 'hue-rotate(-20deg) saturate(2.2) brightness(.82)'),
    'stone':   (IN, [(1, 13), (2, 13), (1, 13), (2, 13)], ''),
    'road':    (IN, [(12, 13), (13, 13), (12, 13), (13, 13)], ''),
    'ruin':    (IN, [(1, 13), (2, 13), (1, 13), (2, 13)], 'saturate(.35) brightness(.9)'),
    'time':    (IN, [(1, 13), (2, 13), (1, 13), (2, 13)], 'saturate(.1) brightness(1.3)'),
    'snow':    (FL, [(0, 19), (1, 19), (2, 19), (3, 19), (4, 19)], ''),
}
# suelos propios de cada mapa que reutilizan una de las baldosas anteriores, con su tinte
ALIAS = {
    'mgrass': ('grass', ''), 'fgrass': ('grass', 'brightness(.92)'), 'forest': ('grass', 'brightness(.72) saturate(1.1)'),
    'kgrass': ('grass', 'brightness(1.08)'), 'bgrass': ('grass', 'hue-rotate(-10deg)'), 'ksgrass': ('grass', 'hue-rotate(15deg) brightness(1.05)'),
    'lookgrass': ('grass', ''), 'lawn': ('grass', ''), 'cgrass': ('grass', 'saturate(.85)'),
    'dirt': ('canyon', ''), 'kroad': ('sand', 'brightness(.95)'), 'beach': ('sand', 'saturate(.55) brightness(1.12)'),
    'dune': ('sand', ''), 'osand': ('sand', 'hue-rotate(-8deg) saturate(1.2)'), 'ocrack': ('canyon', 'hue-rotate(-15deg) saturate(1.6)'),
    'hell': ('redrock', 'brightness(.7)'), 'basalt': ('canyon', 'saturate(.3) brightness(.45)'),
    'ringst': ('stone', 'saturate(.2) brightness(1.1)'), 'stand': ('stone', ''), 'pave': ('stone', 'saturate(.3)'), 'lookfl': ('stone', 'saturate(.25) brightness(1.15)'),
    'croad': ('road', ''),
}
# decorado del juego -> (recorte en tileset_village_abandoned, filtro)
ARBOL_A, ARBOL_B, ARBOL_P, ARBOL_P2 = (0, 96, 64, 144), (0, 144, 64, 192), (64, 96, 96, 128), (64, 144, 96, 176)
ROCA, ROCA_P = (112, 80, 144, 112), (48, 80, 64, 96)
NAMEK = 'hue-rotate(95deg) saturate(1.3)'
DECORADOS = {
    'tree0': (ARBOL_P, NAMEK), 'tree1': (ARBOL_A, NAMEK),
    'ftree': (ARBOL_P, ''), 'btree': (ARBOL_P2, ''), 'btree2': (ARBOL_P, ''), 'kstree': (ARBOL_P2, ''),
    'bigtree': (ARBOL_A, ''), 'rock': (ROCA_P, ''), 'boulder': (ROCA, ''),
}

def a_url(im):
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

suelos = {}
for k, (im, cel, f) in SUELOS.items():
    tira = Image.new('RGBA', (16 * len(cel), 16))
    for i, (c, r) in enumerate(cel): tira.paste(t16(im, c, r), (16 * i, 0))
    suelos[k] = {'src': a_url(tira), 'n': len(cel), 'f': f}
for k, (base, f) in ALIAS.items():
    suelos[k] = {**suelos[base], 'f': ' '.join(x for x in (suelos[base]['f'], f) if x)}
decor = {k: {'src': a_url(VI.crop(r)), 'f': f} for k, (r, f) in DECORADOS.items()}
with open(os.path.join(RAIZ, 'escenarios_tiles.js'), 'w', encoding='utf-8') as fh:
    fh.write('// Generado por herramientas/montar_escenarios.py: suelos y decorados del pack Ninja Adventure (CC0, Pixel-Boy y AAA)\n')
    fh.write('window.ESC_TILES=' + json.dumps(suelos) + ';\nwindow.ESC_DECOR=' + json.dumps(decor) + ';\n')
print(len(suelos), 'suelos y', len(decor), 'decorados')

if len(sys.argv) > 1:  # mosaico de prueba (sin filtros) para ver si las baldosas casan al repetirse
    W = 8; o = Image.new('RGBA', ((W * 16 + 8) * len(SUELOS), 6 * 16 + 14), (30, 30, 30, 255)); d = ImageDraw.Draw(o); rnd = random.Random(3)
    for j, (k, (im, cel, f)) in enumerate(SUELOS.items()):
        for y in range(6):
            for x in range(W): o.paste(t16(im, *rnd.choice(cel)), (j * (W * 16 + 8) + x * 16, 14 + y * 16))
        d.text((j * (W * 16 + 8), 1), k, fill=(255, 255, 0))
    o.resize((o.width * 2, o.height * 2), Image.NEAREST).save(sys.argv[1])
