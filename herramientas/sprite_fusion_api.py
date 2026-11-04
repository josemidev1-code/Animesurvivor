"""Genera ciclos de andar con la API de Sprite Fusion (https://www.spritefusion.com/docs/pixel-art-generator/api).

Cada animación cuesta 15 créditos de la cuenta de Josemi. La clave se lee de la variable SPRITE_FUSION_API_KEY o del
archivo .env de la raíz (línea SPRITE_FUSION_API_KEY=...); nunca se imprime ni se guarda en otro sitio (.env está en
.gitignore). No se reintenta nada automáticamente: si una petición falla se avisa y se sigue con la siguiente.

Uso:
  python herramientas/sprite_fusion_api.py --creditos            # solo mira los créditos que quedan
  python herramientas/sprite_fusion_api.py goku_0 vegeta_0       # anima esas imágenes de entrada/
  python herramientas/sprite_fusion_api.py --todos [--max 20]    # todas las que faltan (salta las que flotan y las hechas)
Entrada:  Recursos pendientes/sprite_fusion/entrada/<heroe>_<forma>.png  (exportar_sprite_fusion.py)
Salida:   Recursos pendientes/sprite_fusion/salida/<heroe>_<forma>.<webp|png|gif> + <...>.json con lo que devolvió la API
Después:  python herramientas/importar_sprite_fusion.py
"""
import base64, json, os, re, sys, time, urllib.request, urllib.error
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
    salidas, fin, inicio = [], None, None
    for intento in range(5):
        try:
            with pedir('/generate', cuerpo) as r:
                for linea in r:
                    linea = linea.decode('utf-8', 'replace').strip()
                    if not linea.startswith('data:'): continue
                    ev = json.loads(linea[5:].strip()); t = ev.get('type')
                    if t == 'started': inicio = ev; print(nombre, ': empezada, créditos reservados', ev.get('credits', {}).get('reserved'))
                    elif t == 'output': salidas.append(ev.get('asset', {}))
                    elif t == 'completed': fin = ev
            break
        except urllib.error.HTTPError as e:
            # los errores antes del stream no reservan créditos: con 429 (límite de ritmo) es seguro esperar y repetir
            if e.code == 429 and intento < 4:
                espera = int(e.headers.get('Retry-After') or 30); print(nombre, ': límite de ritmo, espero', espera, 's'); time.sleep(espera); continue
            texto = e.read().decode('utf-8', 'replace')[:300]; print(nombre, ': error', e.code, texto)
            if e.code in (401, 402): sys.exit('Parado: ' + ('clave no válida' if e.code == 401 else 'sin créditos o sin acceso'))
            return False
        except Exception as e:
            print(nombre, ': la conexión falló', type(e).__name__, '(no se reintenta: podría haberse cobrado)'); break
    if not fin: print(nombre, ': la conexión se cortó antes de terminar (no se reintenta; mira el historial de la web)'); return False
    os.makedirs(SALIDA, exist_ok=True)
    json.dump({'started': inicio, 'completed': fin, 'outputs': salidas},open(os.path.join(SALIDA, nombre + '.json'), 'w', encoding='utf-8'), indent=1)
    if fin.get('status') != 'succeeded' or not salidas: print(nombre, ': falló', fin.get('error')); return False
    a = salidas[-1]; url = a.get('spritesheetUrl') or a.get('assetUrl')
    ext = {'image/webp': '.webp', 'image/gif': '.gif'}.get(a.get('contentType') if not a.get('spritesheetUrl') else 'image/png', '.png')
    if a.get('assetUrl') and (a.get('contentType') or '').endswith(('webp', 'gif')): url, ext = a['assetUrl'], ('.gif' if a['contentType'].endswith('gif') else '.webp')
    dst = os.path.join(SALIDA, nombre + ext)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r: open(dst, 'wb').write(r.read())
    print(nombre, ': hecho ->', os.path.relpath(dst, RAIZ), '| créditos que quedan:', fin.get('credits', {}).get('remaining'))
    return True


def flotan():
    """Formas con modo 'flotar' en andar.js: no andan, no hace falta gastar créditos en ellas."""
    t = open(os.path.join(RAIZ, '02 - Código del juego', 'andar.js'), encoding='utf-8').read()
    return {h + '_' + f for h, f in re.findall(r"'([\w]+)/(\d+)'\s*:\s*\{\s*modo\s*:\s*'flotar'", t)}


def hecho(nombre):
    return any(os.path.exists(os.path.join(SALIDA, nombre + e)) for e in ('.webp', '.gif', '.png'))


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or args == ['--creditos']: print('Créditos:', creditos()); sys.exit()
    maximo = None
    if '--max' in args: i = args.index('--max'); maximo = int(args[i + 1]); del args[i:i + 2]
    if args == ['--todos']:
        fuera = flotan()
        args = sorted(f[:-4] for f in os.listdir(ENTRADA) if f.endswith('.png') and f[:-4] not in fuera)
        print(len(fuera), 'formas flotan y se saltan')
    pendientes = [n for n in args if not hecho(n)]
    if len(pendientes) < len(args): print(len(args) - len(pendientes), 'ya generadas, se saltan')
    if maximo is not None: pendientes = pendientes[:maximo]
    c = creditos(); print('Créditos antes:', c, '| pendientes:', len(pendientes), '| coste:', 15 * len(pendientes))
    if c is not None and c < 15 * len(pendientes):
        pendientes = pendientes[:c // 15]; print('No llegan los créditos: solo se harán', len(pendientes))
    hechos = sum(animar(n) for n in pendientes)
    print(hechos, 'de', len(pendientes), 'animaciones generadas')
