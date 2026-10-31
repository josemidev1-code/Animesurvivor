"""Escribe (o reemplaza entera) una forma en un archivo de herramientas/animaciones/.

Uso:  python herramientas/poner.py <archivo.json> <heroe> <forma> '<json de la forma>'
Ej.:  python herramientas/poner.py personajes.json raditz 0 '{"pack":"...","idle":[0,1],...}'
"""
import json, os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ruta = os.path.join(RAIZ, 'herramientas', 'animaciones', sys.argv[1])
d = json.load(open(ruta, encoding='utf-8')) if os.path.exists(ruta) else {'heroes': {}}
d['heroes'].setdefault(sys.argv[2], {})[sys.argv[3]] = json.loads(sys.argv[4])
d['heroes'][sys.argv[2]] = dict(sorted(d['heroes'][sys.argv[2]].items(), key=lambda kv: int(kv[0])))
with open(ruta, 'w', encoding='utf-8') as fh:
    json.dump(d, fh, ensure_ascii=False, indent=1)
print(sys.argv[2], sys.argv[3], 'ok')
