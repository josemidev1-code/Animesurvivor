"""Baja el ORIGINAL a tamaño completo de una ficha de DeviantArt y muestra su autor, título y descripción.

Uso:  python herramientas/bajar_deviantart.py <url_de_la_ficha> [destino.png]
  - Sin destino solo imprime los datos (para leer las condiciones antes de bajar nada).
  - La imagen buena es baseUri + ?token= del bloque "fullview" con "r":1 (la de og:image viene reescalada).
"""
import json, re, sys, urllib.request
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
url = sys.argv[1]
html = urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read().decode('utf-8')
m = re.search(r'window\.__INITIAL_STATE__ = JSON\.parse\("((?:[^"\\]|\\.)*)"\)', html)
txt = re.sub(r'\\(u[0-9a-fA-F]{4}|.)', lambda g: chr(int(g.group(1)[1:], 16)) if g.group(1)[0] == 'u' and len(g.group(1)) == 5 else
             {'n': '\n', 't': '\t', 'r': '\r'}.get(g.group(1), g.group(1)), m.group(1))
ent = json.loads(txt)['@@entities']
did = re.search(r'-(\d+)/?$', url).group(1)
dv = ent['deviation'][did]
autor = ent.get('user', {}).get(str(dv.get('author')), {}).get('username', dv.get('author'))
print('Título:', dv.get('title'), '| Autor:', autor)
ex = ent.get('deviationExtended', {}).get(did, {})
desc = ex.get('descriptionText', {}).get('excerpt') or ''
if not desc:
    def textos(n):
        if isinstance(n, dict):
            if n.get('type') == 'text': yield n.get('text', '')
            for v in n.values(): yield from textos(v)
        elif isinstance(n, list):
            for v in n: yield from textos(v)
    desc = ' '.join(textos(ex.get('descriptionText', {})))
print('Descripción:', desc[:3000])
print('Licencia:', json.dumps(ex.get('license') or dv.get('license')), '| Descargable:', dv.get('isDownloadable'))
media = dv['media']
tipos = {t['t']: t for t in media['types']}
fv = [t for t in media['types'] if t['t'] == 'fullview']
print('Tamaños fullview:', [(t.get('w'), t.get('h'), t.get('r')) for t in fv])
if len(sys.argv) > 2:
    t = fv[-1]
    img = media['baseUri']
    if t.get('c'):
        img += '/' + t['c'].replace('<prettyName>', media['prettyName']).lstrip('/')
        print('AVISO: el fullview viene reescalado por el servidor (no hay original sin cuenta)')
    if media.get('token'): img += '?token=' + media['token'][0]
    open(sys.argv[2], 'wb').write(urllib.request.urlopen(urllib.request.Request(img, headers=UA)).read())
    from PIL import Image
    print('Guardado', sys.argv[2], Image.open(sys.argv[2]).size)
