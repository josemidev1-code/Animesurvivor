"""Propone qué fotogramas de un pack forman cada animación, con nota de confianza, y localiza sus efectos
(rayos, bolas, auras, estelas). Marca el pack como dudoso, con motivos, cuando no está claro.

Uso:  python herramientas/proponer_fotogramas.py "<pack dentro de sprites/>" [...]
Salida: herramientas/propuestas/<pack>.json (ver docs/superpowers/specs/2026-11-01-propuesta-fotogramas-design.md)
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
from rasgos import rasgos_pack, comun, parecido, nombre_pack

OBLIGATORIAS = ('idle', 'move', 'attack', 'kick', 'ki', 'hurt')
NOMBRES = {'idle': 'guardia', 'move': 'moverse', 'attack': 'puñetazos', 'kick': 'patada', 'ki': 'ki',
           'pow': 'poder', 'hurt': 'daño', 'faint': 'muerte'}
UMBRAL = 0.6
PROPUESTAS = os.path.join(m.RAIZ, 'herramientas', 'propuestas')


def utiles(rs):
    return [r for r in rs if not r.get('vacio')]


def densidad(r):
    return bin(int(r['silueta'], 16)).count('1') / 256


def elegir_guardia(rs):
    """Entre los 8 primeros fotogramas útiles, el más alto de pie (estrecho y sin inclinarse)."""
    prim = utiles(rs)[:8]
    if not prim: return 0
    de_pie = [r for r in prim if r['prop'] < 0.9 and abs(r['incl']) < 0.08 and r['sueltos'] < 0.05] or prim
    return max(de_pie, key=lambda r: r['alto'])['i']


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
    g = elegir_guardia(rs); G = rs[g]; H = G['alto']; W = G['ancho']; res['guardia'] = g
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


def proponer(pack, espejo=False, guardar=True):
    rs = rasgos_pack(pack)
    p = clasificar(rs, espejo)
    p.update(pack=pack, motivos=motivos_dudoso(p, rs))
    p['dudoso'] = bool(p['motivos'])
    if guardar:
        os.makedirs(PROPUESTAS, exist_ok=True)
        with open(os.path.join(PROPUESTAS, nombre_pack(pack) + '.json'), 'w', encoding='utf-8') as fh:
            json.dump(p, fh, ensure_ascii=False, indent=1)
    return p


if __name__ == '__main__':
    for pk in sys.argv[1:]:
        p = proponer(pk)
        print(pk, '· dudoso' if p['dudoso'] else '· seguro', *p['motivos'], sep='\n  ')
