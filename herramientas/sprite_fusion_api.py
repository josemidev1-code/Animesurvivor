"""Genera ciclos de andar con la API de Sprite Fusion (https://www.spritefusion.com/docs/pixel-art-generator/api).

Cada animación cuesta 15 créditos de la cuenta de Josemi. La clave se lee de la variable SPRITE_FUSION_API_KEY o del
archivo .env de la raíz (línea SPRITE_FUSION_API_KEY=...); nunca se imprime ni se guarda en otro sitio (.env está en
.gitignore). No se reintenta nada automáticamente: si una petición falla se avisa y se sigue con la siguiente.

Uso:
  python herramientas/sprite_fusion_api.py --creditos            # solo mira los créditos que quedan
  python herramientas/sprite_fusion_api.py goku_0 vegeta_0       # anima esas imágenes de entrada/
Entrada:  Recursos pendientes/sprite_fusion/entrada/<heroe>_<forma>.png  (exportar_sprite_fusion.py)
Salida:   Recursos pendientes/sprite_fusion/salida/<heroe>_<forma>.<webp|png|gif> + <...>.json con lo que devolvió la API
Después:  python herramientas/importar_sprite_fusion.py
"""
import base64, json, os, sys, urllib.request, urllib.error
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://www.spritefusion.com/api/v1'
ENTRADA = os.path.join(RAIZ, 'Recursos pendientes', 'sprite_fusion', 'entrada')
SALIDA = os.path.join(RAIZ, 'Recursos pendientes', 'sprite_fusion', 'salida')
PROMPT = ('Side view walk cycle, the character walks to the right, seamless loop. Keep exactly the same character, '
          'outfit, hair, colors, proportions and pixel size. Natural steps with the feet touching the ground, arms '
          'swinging slightly. No effects, no aura, no background.')
UA = {'User-Agent': 'AnimeSurvivor-herramientas/1.0'}


def clave():
    k = os.environ.get('SPRITE_FUSION_API_KEY')
    if not k and os.path.exists(os.path.join(RAIZ, '.env')):
        for linea in open(os.path.join(RAIZ, '.env'), encoding='utf-8'):
            if linea.strip().startswith('SPRITE_FUSION_API_KEY='): k = linea.split('=', 1)[1].strip().strip('"\'')
    if not k: sys.exit('Falta la clave: crea .env con SPRITE_FUSION_API_KEY=... en la raíz del proyecto.')
    return k


def pedir(ruta, cuerpo=None):
    h = {**UA, 'Authorization': 'Bearer ' + clave()}
    if cuerpo is not None: h['Content-Type'] = 'application/json'; h['Accept'] = 'text/event-stream'
    return urllib.request.urlopen(urllib.request.Request(BASE + ruta, data=None if cuerpo is None else json.dumps(cuerpo).encode(), headers=h), timeout=600)


def creditos():
    return json.load(pedir('/credits')).get('credits')


def animar(nombre):
    ruta = os.path.join(ENTRADA, nombre + '.png')
    if not os.path.exists(ruta): print(nombre, ': no existe', ruta); return False
    im = Image.open(ruta).convert('RGBA'); colores = len({p for p in im.getdata() if p[3] > 40})
    datos = base64.b64encode(open(ruta, 'rb').read()).decode()
    cuerpo = {'operation': 'animate', 'prompt': PROMPT, 'inputs': [{'data_url': 'data:image/png;base64,' + datos}],
              'output_frames': 8, 'colors': max(8, min(32, colores))}
    salidas, fin = [], None
    try:
        with pedir('/generate', cuerpo) as r:
            for linea in r:
                linea = linea.decode('utf-8', 'replace').strip()
                if not linea.startswith('data:'): continue
                ev = json.loads(linea[5:].strip()); t = ev.get('type')
                if t == 'started': print(nombre, ': empezada, créditos reservados', ev.get('credits', {}).get('reserved'))
                elif t == 'progress': print(nombre, ':', ev.get('message'))
                elif t == 'output': salidas.append(ev.get('asset', {}))
                elif t == 'completed': fin = ev
    except urllib.error.HTTPError as e:
        print(nombre, ': error', e.code, e.read().decode('utf-8', 'replace')[:300]); return False
    if not fin: print(nombre, ': la conexión se cortó antes de terminar (no se reintenta)'); return False
    os.makedirs(SALIDA, exist_ok=True)
    json.dump({'completed': fin, 'outputs': salidas}, open(os.path.join(SALIDA, nombre + '.json'), 'w', encoding='utf-8'), indent=1)
    if fin.get('status') != 'succeeded' or not salidas: print(nombre, ': falló', fin.get('error')); return False
    a = salidas[-1]; url = a.get('spritesheetUrl') or a.get('assetUrl')
    ext = {'image/webp': '.webp', 'image/gif': '.gif'}.get(a.get('contentType') if not a.get('spritesheetUrl') else 'image/png', '.png')
    if a.get('assetUrl') and (a.get('contentType') or '').endswith(('webp', 'gif')): url, ext = a['assetUrl'], ('.gif' if a['contentType'].endswith('gif') else '.webp')
    dst = os.path.join(SALIDA, nombre + ext)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r: open(dst, 'wb').write(r.read())
    print(nombre, ': hecho ->', os.path.relpath(dst, RAIZ), '| créditos que quedan:', fin.get('credits', {}).get('remaining'))
    return True


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or args == ['--creditos']: print('Créditos:', creditos()); sys.exit()
    print('Créditos antes:', creditos())
    hechos = sum(animar(n) for n in args)
    print(hechos, 'de', len(args), 'animaciones generadas')
