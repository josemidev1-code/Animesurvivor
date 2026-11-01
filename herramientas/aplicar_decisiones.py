"""Pasa a las selecciones las decisiones que el usuario descargó de la página de revisión (decisiones.json).

- Propuesta de una forma que ya está en el juego ('forma' y 'grupo'): cambia esas animaciones en su JSON de
  herramientas/animaciones/ y guarda la selección anterior en "<anim>Antes".
- Propuesta de un pack nuevo: queda "aprobada" con las animaciones decididas (el bloque 3 la da de alta).

Uso:  python herramientas/aplicar_decisiones.py <ruta de decisiones.json>
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
import proponer_fotogramas as pf


def _leer(ruta):
    with open(ruta, encoding='utf-8') as fh: return json.load(fh)


def _escribir(ruta, datos):
    with open(ruta, 'w', encoding='utf-8') as fh: json.dump(datos, fh, ensure_ascii=False, indent=2)


def aplicar(decisiones):
    """Aplica las decisiones y devuelve los avisos (packs desconocidos o sin aprobar)."""
    avisos = []
    for nombre, dec in decisiones.items():
        ruta = os.path.join(pf.PROPUESTAS, nombre + '.json')
        if not os.path.exists(ruta):
            avisos.append(f'{nombre}: no hay propuesta con ese nombre; se ignora'); continue
        if not dec.get('vale'):
            avisos.append(f'{nombre}: sin «Vale»; no se aplica'); continue
        prop = _leer(ruta); anims = dec.get('anims', {})
        if prop.get('forma') and prop.get('grupo'):
            h, f = prop['forma'].split('/')
            ruta_grupo = os.path.join(m.RAIZ, prop['grupo'])
            grupo = _leer(ruta_grupo); forma = grupo['heroes'][h][f]
            for k, v in anims.items():
                if forma.get(k) != v:
                    if k in forma: forma[k + 'Antes'] = forma[k]
                    forma[k] = v
            _escribir(ruta_grupo, grupo)
        else:
            prop.update(anims)
        prop['aprobada'] = True
        _escribir(ruta, prop)
    return avisos


if __name__ == '__main__':
    for a in aplicar(_leer(sys.argv[1])): print(a)
