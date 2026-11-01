"""Compara lo que propone la herramienta con lo elegido a mano en los packs que ya usa el juego.

Para cada pack, la plantilla excluye todas las formas de ese mismo pack (si no, se copiaría a sí misma).
Uso:  python herramientas/validar_propuestas.py   -> resumen y herramientas/_revisar/validacion.md
"""
import collections, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
import proponer_fotogramas as pf


def acierta(propuesto, a_mano):
    """Acierto si todos los propuestos caen en el tramo de los elegidos a mano (con 2 de margen a cada lado)."""
    return bool(propuesto) and all(min(a_mano) - 2 <= i <= max(a_mano) + 2 for i in propuesto)


def validar():
    por_anim = collections.defaultdict(lambda: [0, 0]); dudosos = 0; fallos = []; packs = 0
    for pack, formas in pf.manuales().items():
        try:
            mano = formas[0][1]
            p = pf.proponer(pack, mano.get('espejo', False), guardar=False, excluir=frozenset(i for i, _ in formas))
        except SystemExit:
            continue
        packs += 1; dudosos += p['dudoso']
        for k in pf.OBLIGATORIAS:
            if not mano.get(k): continue
            ok = acierta(p.get(k, []), mano[k]); por_anim[k][0] += ok; por_anim[k][1] += 1
            if not ok: fallos.append((formas[0][0], k, p.get(k, []), mano[k], p.get('origen')))
    tot = [sum(v[i] for v in por_anim.values()) for i in (0, 1)]
    return {'por_anim': {k: tuple(v) for k, v in por_anim.items()}, 'global': tot[0] / max(1, tot[1]),
            'dudosos': dudosos, 'packs': packs, 'fallos': fallos}


def informe(v):
    lin = ['# Validación de las propuestas', '',
           f"Aciertos en las animaciones obligatorias: **{v['global']:.0%}** · packs dudosos: {v['dudosos']} de {v['packs']}", '',
           '| Animación | Aciertos |', '|---|---|']
    lin += [f"| {pf.NOMBRES[k]} | {a}/{t} ({a / t:.0%}) |" for k, (a, t) in v['por_anim'].items()]
    cuenta = collections.Counter(f[1] for f in v['fallos'])
    lin += ['', '## Fallos', '', f'Por animación: {dict(cuenta)}', '']
    lin += [f'- {f} · {pf.NOMBRES[k]}: propuesto {p}, a mano {h} ({o})' for f, k, p, h, o in v['fallos']]
    return '\n'.join(lin) + '\n'


if __name__ == '__main__':
    v = validar()
    salida = os.path.join(m.RAIZ, 'herramientas', '_revisar', 'validacion.md')
    os.makedirs(os.path.dirname(salida), exist_ok=True)
    with open(salida, 'w', encoding='utf-8') as fh: fh.write(informe(v))
    print(f"aciertos {v['global']:.1%} · dudosos {v['dudosos']}/{v['packs']}")
    for k, (a, t) in v['por_anim'].items(): print(f'  {k}: {a}/{t}')
