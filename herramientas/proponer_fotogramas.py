"""Propone qué fotogramas de un pack forman cada animación, con nota de confianza, y localiza sus efectos
(rayos, bolas, auras, estelas). Marca el pack como dudoso, con motivos, cuando no está claro.

Uso:  python herramientas/proponer_fotogramas.py "<pack dentro de sprites/>" [...]
Salida: herramientas/propuestas/<pack>.json (ver Planes y diseños/superpowers/specs/2026-11-01-propuesta-fotogramas-design.md)
"""
import glob, json, os, re, statistics, sys, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
from rasgos import rasgos_pack, comun, parecido, nombre_pack

OBLIGATORIAS = ('idle', 'move', 'attack', 'kick', 'ki', 'hurt')
NOMBRES = {'idle': 'guardia', 'move': 'moverse', 'attack': 'puñetazos', 'kick': 'patada', 'ki': 'ki',
           'pow': 'poder', 'hurt': 'daño', 'faint': 'muerte'}
UMBRAL = 0.6
PESO_ORDEN = 0.5
PROPUESTAS = os.path.join(m.RAIZ, 'herramientas', 'propuestas')


def utiles(rs):
    return [r for r in rs if not r.get('vacio')]


def densidad(r):
    return bin(int(r['silueta'], 16)).count('1') / 256


def elegir_guardia(rs):
    """El primer fotograma de pie del sprite de juego. Los packs traen al principio arte oficial, caras, escenas o
    versiones grandes: se descartan por no tener el tamaño de píxel ni el alto habituales del pack."""
    us = [r for r in utiles(rs) if r['alto'] >= 8] or utiles(rs)
    if not us: return 0
    E = statistics.median(r['escala'] for r in us)
    mismo = [r for r in us if abs(r['escala'] / E - 1) < 0.15] or us
    H = statistics.median(r['alto'] for r in mismo)
    de_pie = [r for r in mismo if r['prop'] < 0.9 and abs(r['incl']) < 0.06 and r['sueltos'] < 0.05
              and 0.9 * H <= r['alto'] <= 1.3 * H]
    return (de_pie or mismo)[0]['i']


def tramos(idx):
    """Agrupa índices en tramos de fotogramas seguidos: [3,4,5,9,10] -> [[3,4,5],[9,10]]."""
    out = []
    for i in sorted(idx):
        if out and i == out[-1][-1] + 1: out[-1].append(i)
        else: out.append([i])
    return out


def clasificar(rs, espejo=False):
    s = -1 if espejo else 1
    us = utiles(rs)
    vacia = {k: [] for k in ('idle', 'move', 'attack', 'kick', 'ki', 'pow', 'hurt', 'faint')}
    res = dict(vacia, portrait=None, guardia=0, espejo=espejo, confianza={},
               efectos={'rayo': [], 'bola': [], 'aura': [], 'estela': []})
    if not us: return res
    g = elegir_guardia(rs); G = rs[g]
    if G.get('vacio'): return res
    H = G['alto']; W = G['ancho']; res['guardia'] = g
    c = {r['i']: comun(r['paleta'], G['paleta']) for r in us}
    rel = {r['i']: r['alto'] / H for r in us}
    cuerpo = [r for r in us if c[r['i']] >= 0.45 and r['escala'] < 2.5 * G['escala']]

    # efectos: casi ningún color del personaje
    for r in us:
        if c[r['i']] < 0.15:
            k = 'rayo' if r['prop'] >= 1.4 else 'bola' if r['prop'] >= 0.7 else 'aura'
            res['efectos'][k].append(r['i'])
        elif r['escala'] >= 2.5 * G['escala'] or (rel[r['i']] < 0.35 and r['prop'] > 1.4):
            res['efectos']['estela'].append(r['i'])
    efecto = {i for v in res['efectos'].values() for i in v}

    # retrato: silueta casi llena, cuadrada
    ret = [r for r in us if densidad(r) >= 0.8 and 0.6 <= r['prop'] <= 1.3 and r['i'] not in efecto and r['i'] != g]
    res['portrait'] = ret[-1]['i'] if ret else None
    fuera = efecto | ({res['portrait']} if res['portrait'] is not None else set())
    cuerpo = [r for r in cuerpo if r['i'] not in fuera]

    def conf(k, v): res['confianza'][k] = round(max(0.0, min(1.0, v)), 2)

    # guardia: tramo alrededor de g con siluetas parecidas
    idle = [g] + [r['i'] for r in cuerpo if abs(r['i'] - g) <= 3 and r['i'] != g
                  and parecido(r['silueta'], G['silueta']) >= 0.85 and 0.9 <= rel[r['i']] <= 1.1]
    res['idle'] = sorted(idle)[:3]; conf('idle', 0.6 + 0.15 * (len(res['idle']) - 1))
    usado = set(res['idle'])

    # moverse: inclinado hacia donde mira, sin polvo delante
    def punt_move(r):
        p = r['incl'] * s + 0.15 * (r['prop'] >= 1.0) + 0.3 * min(rel[r['i']], 1)
        if r['sueltoX'] is not None: p += 0.3 if r['sueltoX'] * s < 0 else -0.6
        return p
    cand = [r for r in cuerpo if r['i'] not in usado and rel[r['i']] >= 0.5 and r['incl'] * s > 0.08]
    if cand:
        mejor = max(cand, key=punt_move); res['move'] = [mejor['i']]; conf('move', 0.4 + punt_move(mejor))
    usado |= set(res['move'])

    # daño: inclinado hacia atrás; muerte: tumbado
    tumb = [r['i'] for r in cuerpo if r['prop'] > 1.6 and rel[r['i']] < 0.5 and r['i'] not in usado]
    if tumb: res['faint'] = [tumb[-1]]; conf('faint', 0.6)
    atras = [r['i'] for r in cuerpo if r['incl'] * s < -0.1 and 0.6 <= rel[r['i']] <= 1.05 and r['i'] not in usado]
    if atras:
        t = max(tramos(atras), key=len); res['hurt'] = t[:2]; conf('hurt', 0.5 + 0.2 * (len(t) >= 2))
    usado |= set(res['hurt']) | set(res['faint'])

    # ki: cuerpo justo antes de un efecto de bola o rayo
    ki = [r['i'] for r in cuerpo if r['i'] not in usado
          and any(0 < e - r['i'] <= 3 for e in res['efectos']['rayo'] + res['efectos']['bola'])]
    if ki: t = tramos(ki)[0]; res['ki'] = t[-2:]; conf('ki', 0.5 + 0.2 * (len(t) >= 2))
    usado |= set(res['ki'])

    # poder: cuerpo con aura (colores a medias)
    pw = [r['i'] for r in us if 0.15 <= c[r['i']] < 0.45 and r['i'] not in fuera and r['i'] not in usado]
    if pw: t = max(tramos(pw), key=len); res['pow'] = t[:3]; conf('pow', 0.6)
    usado |= set(res['pow'])

    # golpes: brazo o pierna estirada (más ancho que la guardia); el primer tramo son puñetazos, el siguiente patada
    golpe = [r['i'] for r in cuerpo if r['i'] not in usado and r['ancho'] > 1.25 * W and 0.75 <= rel[r['i']] <= 1.15]
    gr = [t for t in tramos(golpe)]
    if gr: res['attack'] = gr[0][:4]; conf('attack', 0.5 + 0.1 * min(3, len(gr[0])))
    if len(gr) > 1: res['kick'] = gr[1][:3]; conf('kick', 0.5 + 0.1 * min(2, len(gr[1])))
    return res


def motivos_dudoso(prop, rs):
    """Por qué la propuesta no es segura (lista vacía = segura)."""
    s = -1 if prop.get('espejo') else 1
    g = rs[prop.get('guardia', 0)] if not rs[prop.get('guardia', 0)].get('vacio') else None
    out = []
    if prop.get('espejo', False) is None:
        out.append('no se sabe hacia dónde mira el pack: compruébalo (y pon "espejo" si mira a la izquierda)')
    if len(utiles(rs)) < 8: out.append('el pack tiene pocos fotogramas útiles')
    for k in OBLIGATORIAS:
        if not prop.get(k): out.append(f'falta la animación de {NOMBRES[k]}')
        elif prop.get('confianza', {}).get(k, 0) < UMBRAL: out.append(f'poca confianza en {NOMBRES[k]}')
    if g and prop.get('move'):
        mv = [rs[i] for i in prop['move'] if not rs[i].get('vacio')]
        if any(r['alto'] < 0.7 * g['alto'] for r in mv): out.append('la pose de moverse está muy agachada')
        if any(r['sueltoX'] is not None and r['sueltoX'] * s > 0 for r in mv):
            out.append('la pose de moverse parece un salto hacia atrás (polvo delante)')
    if g:
        for k in OBLIGATORIAS:
            if any(not rs[i].get('vacio') and abs(rs[i]['escala'] / g['escala'] - 1) > 0.15 for i in prop.get(k, [])):
                out.append(f'tamaño de píxel distinto en {NOMBRES[k]}')
    return out


def _sin_tildes(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().upper()


def autor_de(pack):
    """Autor del pack según su carpeta original (_ORIGEN_Y_CREDITOS.md) o el nombre de la carpeta."""
    texto = os.path.basename(pack.rstrip('/\\'))
    nota = os.path.join(m.SPRITES, pack, '_ORIGEN_Y_CREDITOS.md')
    if os.path.exists(nota):
        with open(nota, encoding='utf-8', errors='ignore') as fh:
            texto += ' ' + ' '.join(l for l in fh if 'Carpeta original' in l)
    t = _sin_tildes(texto)
    if 'ANDRES GAMEN' in t: return 'ANDRES GAMEN'
    par = re.search(r'\(([^()]+)\)\s*$', os.path.basename(pack.rstrip('/\\')))
    return re.sub(r'[^0-9A-Z]', '', _sin_tildes(par.group(1))) if par else None


_MANUALES = None


def manuales():
    """Selecciones hechas a mano, agrupadas por pack: {pack: [('goku/0', forma), ...]}."""
    global _MANUALES
    if _MANUALES is None:
        _MANUALES = {}
        for h, formas in m.leer_config().items():
            for f, forma in formas.items():
                if forma.get('pack'): _MANUALES.setdefault(forma['pack'], []).append((f'{h}/{f}', forma))
    return _MANUALES


def plantilla(pack, rs, excluir=frozenset(), minimo=0.8):
    """Usa como plantilla las selecciones a mano de otros packs del mismo autor: cada fotograma elegido allí se busca
    en este pack por parecido de silueta (los autores no siempre ordenan igual). Se quedan las animaciones cuyo
    parecido medio llega a `minimo`, con confianza 0,9."""
    autor = autor_de(pack)
    if not autor: return None
    us = utiles(rs); mejor, nota_mejor = None, 0
    for q, formas in manuales().items():
        if q == pack or autor_de(q) != autor: continue
        formas = [(i, f) for i, f in formas if i not in excluir]
        if not formas: continue
        f = formas[0][1]
        try: rq = rasgos_pack(q)
        except SystemExit: continue
        t, sims = {}, []
        for k in NOMBRES:
            idx = [j for j in f.get(k, []) if j < len(rq) and not rq[j].get('vacio')]
            if not idx: continue
            # parecido de silueta, penalizado si el fotograma está en otra parte del pack (los autores suelen
            # mantener el orden de las animaciones aunque cambie el número de fotogramas)
            pares = [max(((parecido(rq[j]['silueta'], r['silueta']) - PESO_ORDEN * abs(r['i'] / len(rs) - j / len(rq)),
                           r['i']) for r in us)) for j in idx]
            sim = sum(s for s, _ in pares) / len(pares)
            if sim >= minimo: t[k] = [i for _, i in pares]; sims.append(sim)
        nota = sum(sims)
        if t and nota > nota_mejor: mejor, nota_mejor = (q, t), nota
    if not mejor: return None
    q, t = mejor
    t['confianza'] = {k: 0.9 for k in t}
    t['plantilla'] = q
    return t


def nombre_propuesta(p):
    """Nombre del archivo de una propuesta: el del pack, o forma + pack si arregla una forma del juego."""
    return nombre_pack(p['forma'] + '_' + p['pack']) if p.get('forma') else nombre_pack(p['pack'])


def proponer(pack, espejo=None, guardar=True, excluir=frozenset()):
    rs = rasgos_pack(pack)
    p = clasificar(rs, espejo)
    t = plantilla(pack, rs, excluir)
    if t:
        p['confianza'].update(t.pop('confianza')); p.update(t)
    p.update(pack=pack, autor=autor_de(pack), origen='plantilla' if t else 'reglas')
    p['nombre'] = nombre_propuesta(p)
    p['motivos'] = motivos_dudoso(p, rs)
    p['dudoso'] = bool(p['motivos'])
    if guardar:
        os.makedirs(PROPUESTAS, exist_ok=True)
        with open(os.path.join(PROPUESTAS, p['nombre'] + '.json'), 'w', encoding='utf-8') as fh:
            json.dump(p, fh, ensure_ascii=False, indent=1)
    return p


def grupo_de(h, f, clave='move'):
    """Archivo de selección (ruta relativa al proyecto) donde está definida `clave` de la forma h/f."""
    rutas = [os.path.join(m.RAIZ, 'herramientas', 'animaciones.json')] + \
        sorted(glob.glob(os.path.join(m.RAIZ, 'herramientas', 'animaciones', '*.json')))
    hallado = None
    for r in rutas:
        if not os.path.exists(r): continue
        with open(r, encoding='utf-8') as fh: forma = json.load(fh).get('heroes', {}).get(h, {}).get(f, {})
        if clave in forma or (hallado is None and 'pack' in forma): hallado = r
    return os.path.relpath(hallado, m.RAIZ).replace('\\', '/') if hallado else None


def proponer_forma(id_forma, guardar=True):
    """Arreglo para una forma que ya está en el juego: otro `move` si la pose está muy agachada y `escalaFrames`
    para los fotogramas cuyo tamaño de píxel no cuadra con la guardia. Siempre pasa por revisión."""
    from medir_formas import frames
    from montar_animaciones import escala_pixel
    h, f = id_forma.split('/'); F = m.leer_config()[h][f]; pack = F['pack']
    rs = rasgos_pack(pack); s = -1 if F.get('espejo') else 1; G = rs[F['idle'][0]]
    p = {'pack': pack, 'forma': id_forma, 'grupo': grupo_de(h, f), 'espejo': bool(F.get('espejo')), 'motivos': [],
         'efectos': clasificar(rs, F.get('espejo', False))['efectos']}
    for k in NOMBRES: p[k] = list(F.get(k, []))
    p['portrait'] = F.get('portrait')
    # moverse: si la pose actual mide menos del 70 % de la guardia, el impulso más alto del pack
    if F.get('move') and all(rs[i]['alto'] < 0.7 * G['alto'] for i in F['move'] if not rs[i].get('vacio')):
        usados = {i for k in NOMBRES for i in F.get(k, []) if k != 'move'}
        cand = [r for r in utiles(rs) if r['i'] not in usados and r['alto'] >= 0.7 * G['alto']
                and r['incl'] * s > 0.05 and comun(r['paleta'], G['paleta']) >= 0.45
                and abs(r['escala'] / G['escala'] - 1) < 0.15 and not (r['sueltoX'] is not None and r['sueltoX'] * s > 0)]
        if cand:
            p['move'] = [max(cand, key=lambda r: r['incl'] * s + r['alto'] / G['alto'])['i']]
            p['motivos'].append(f"pose de moverse agachada: se propone {p['move']} en vez de {F['move']}")
        else:
            p['motivos'].append('pose de moverse agachada y no hay impulso más alto en el pack')
    # tamaño de píxel: se corrige cada fotograma con la proporción medida en el juego
    src = open(os.path.join(m.RAIZ, '02 - Código del juego/animaciones_juego.js'), encoding='utf-8').read()
    A = json.loads(src[src.index('{'):src.rindex('}') + 1])['h'][h][f]['anims']
    base = escala_pixel(frames(A['Idle'])[0]); _, _, esc = m.cargar_forma(F)
    manual = {int(k): v for k, v in F.get('escalaFrames', {}).items()}
    medir = lambda i: escala_pixel(m.limpiar(m.frames_del_pack(pack)[i]))
    ef = {}
    for k, nom in m.CLAVES.items():
        if nom not in A or not F.get(k): continue
        for i, im in zip(F[k], frames(A[nom])):
            r = escala_pixel(im) / base
            if abs(r - 1) <= 0.15: continue
            mi = medir(i)
            usada = manual.get(i) or (esc if F.get('escalaFija') or esc <= 1.05 or abs(mi - esc) / esc < 0.12 else mi)
            ef[str(i)] = round(usada * r, 2)
    if ef:
        p['escalaFrames'] = ef; p['motivos'].append(f'tamaño de píxel desigual: se propone escalaFrames {ef}')
    p['dudoso'] = True; p['nombre'] = nombre_propuesta(p)
    if guardar:
        os.makedirs(PROPUESTAS, exist_ok=True)
        with open(os.path.join(PROPUESTAS, p['nombre'] + '.json'), 'w', encoding='utf-8') as fh:
            json.dump(p, fh, ensure_ascii=False, indent=1)
    return p


def todos_los_packs():
    """Carpetas de sprites/ que tienen PNG."""
    out = []
    for d, _, fs in os.walk(m.SPRITES):
        if any(f.lower().endswith('.png') for f in fs): out.append(os.path.relpath(d, m.SPRITES).replace('\\', '/'))
    return sorted(out)


if __name__ == '__main__':
    if sys.argv[1:] == ['--formas-actuales']:
        from medir_formas import medir, problemas
        pr = problemas(medir(os.path.join(m.RAIZ, '02 - Código del juego/animaciones_juego.js')))
        for idf in dict.fromkeys(pr['agachadas'] + pr['desiguales']):
            print(idf, *proponer_forma(idf)['motivos'], sep='\n  ')
        sys.exit()
    for pk in (todos_los_packs() if sys.argv[1:] == ['--todos'] else sys.argv[1:]):
        try: p = proponer(pk)
        except Exception as e:  # un pack raro no debe parar la tanda entera
            print(pk, '· ERROR', e); continue
        print(pk, '· dudoso' if p['dudoso'] else '· seguro', *p['motivos'], sep='\n  ')
