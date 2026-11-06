"""Audita qué hay en sprites/ y qué llega al juego: packs sin usar, fotogramas sin usar y ataques que faltan.

Uso:  python herramientas/auditar_animaciones.py
Escribe: 01 - Guía y documentación/AUDITORIA_ANIMACIONES.md
No mira el contenido de las imágenes: un fotograma sin usar puede ser un efecto o un duplicado, no siempre un ataque.
"""
import collections, datetime, os, re, sys
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as M

SP = M.SPRITES
EXTRA = ['attack2', 'attack3', 'kick2', 'beam', 'up']  # dash no cuenta: por norma es el mismo cuerpo que el vuelo
NO_PERSONAJE = ('06_Escenarios', '08_Referencias', 'shenron')
rel = lambda d: os.path.relpath(d, SP).replace(os.sep, '/')

packs = {}
for d, _, fs in os.walk(SP):
    n = sum(f.lower().endswith(('.png', '.gif', '.jpg', '.jpeg', '.webp', '.bmp')) for f in fs)
    if n: packs[rel(d)] = n

src = open(os.path.join(M.RAIZ, '02 - Código del juego', 'script.js'), encoding='utf-8').read()
jugables = set(re.findall(r"\b(\w+):\{name:'[^']+',rar:", src)) | set(re.findall(r"\bHDEF\.(\w+)=\{", src))

usados = collections.defaultdict(set)
heroes = collections.defaultdict(lambda: {'formas': [], 'n': 0, 'sel': 0, 'falta': collections.Counter()})
filas = []
for h, formas in M.leer_config().items():
    for f, s in formas.items():
        if not s.get('pack'): continue
        fr = M.frames_del_pack(s['pack'])
        if not fr: continue
        p = rel(os.path.dirname(fr[0]))
        sel = {i for k in M.CLAVES for i in (s.get(k) or []) if isinstance(i, int) and i < 1000}
        if isinstance(s.get('portrait'), int): sel.add(s['portrait'])
        usados[p] |= sel
        falta = [k for k in EXTRA if not s.get(k)]
        filas.append((h, f, len(fr), len(sel), falta))
        H = heroes[h]; H['formas'].append(f); H['n'] += len(fr); H['sel'] += len(sel); H['falta'].update(falta)

sin = {k: v for k, v in packs.items() if k not in usados}
pers = {k: v for k, v in sin.items() if not k.startswith(NO_PERSONAJE)}
tot = sum(packs[p] for p in usados); sel = sum(len(v) for v in usados.values())
jug = [r for r in filas if r[0] in jugables]; ene = [r for r in filas if r[0] not in jugables]
sin0 = [r for r in jug if len(r[4]) == len(EXTRA)]; compl = [r for r in jug if not r[4]]

L = [f'# Auditoría de animaciones ({datetime.date.today()})', '',
     'Generada con `python herramientas/auditar_animaciones.py`. Compara `sprites/` con las selecciones montadas en el juego. '
     'Un fotograma sin usar puede ser un efecto o un duplicado: la cifra indica material sin aprovechar, no ataques exactos.', '',
     '## Resumen', '',
     f'- Carpetas con imágenes: **{len(packs)}** ({sum(packs.values())} imágenes). En el juego: **{len(usados)}**. Sin usar: **{len(sin)}**.',
     f'- De las {len(sin)} sin usar, {len(sin) - len(pers)} son escenarios, referencias o Shenron; quedan **{len(pers)}** con personajes ({sum(pers.values())} imágenes).',
     f'- En los packs usados hay {tot} imágenes y el juego usa **{sel}** ({sel * 100 // tot} %).',
     f'- Formas de personajes jugables: {len(jug)}. Con los 5 ataques extra completos: **{len(compl)}**. Sin ninguno: **{len(sin0)}**.',
     f'- Formas solo de enemigo u otras: {len(ene)}.', '',
     'Ataques extra contados: `attack2`, `attack3`, `kick2`, `beam` y `up`. `dash` no cuenta porque reutiliza el cuerpo del vuelo.', '',
     '## Personajes jugables, de menos a más completos', '', '| Personaje | Formas | Fotogramas en sus packs | Usados | Ataques extra que faltan |', '|---|---:|---:|---:|---:|']
for h, d in sorted(((h, d) for h, d in heroes.items() if h in jugables), key=lambda x: (-sum(x[1]['falta'].values()), x[0])):
    L.append(f"| {h} | {len(d['formas'])} | {d['n']} | {d['sel']} | {sum(d['falta'].values())} |")
L += ['', '## Packs de personajes sin usar', '', '| Imágenes | Pack |', '|---:|---|']
L += [f'| {v} | `{k}` |' for k, v in sorted(pers.items())]
destino = os.path.join(M.RAIZ, '01 - Guía y documentación', 'AUDITORIA_ANIMACIONES.md')
open(destino, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
sys.stdout.reconfigure(encoding='utf-8')
print('\n'.join(L[4:12]))
print('jugables', len({r[0] for r in jug}), 'mayor', sorted(((r[2] - r[3], r[0], r[1], r[2], r[3], len(r[4])) for r in jug), reverse=True)[:10])
print('sin0 ejemplos', [f'{r[0]}/{r[1]}' for r in sin0[:30]])
