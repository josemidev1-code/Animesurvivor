"""Animaciones con la API de Sprite Fusion (https://www.spritefusion.com/docs/pixel-art-generator/api).

Cada acción cuesta 15 créditos de la cuenta de Josemi. La clave se lee de SPRITE_FUSION_API_KEY o del .env de la raíz
(está en .gitignore); nunca se imprime. No se reintenta nada: si una petición se corta, se avisa (el resultado puede
recuperarse desde el historial de la web).

Según la guía de Sprite Fusion, para andar o atacar hay que crear primero una POSE adecuada (edit) y animar esa pose:
  python herramientas/sprite_fusion_api.py --creditos
  python herramientas/sprite_fusion_api.py base goku_0 [...]          # gratis: imagen base a tamaño real con margen
  python herramientas/sprite_fusion_api.py pose goku_0 [...]          # 15 cr.: 2 poses de andar -> salida/goku_0_pose{0,1}.png
  python herramientas/sprite_fusion_api.py animar goku_0:1 [...]      # 15 cr.: anima la pose 1 -> salida/goku_0_8.png (tira)
  python herramientas/sprite_fusion_api.py disparo goku_0:Cast:1      # 15 cr.: andar disparando desde el fotograma 1 de Cast
  python herramientas/sprite_fusion_api.py golpe goku_0:Attack:0      # 15 cr.: andar dando puñetazos
Todo lo pedido queda apuntado en Recursos pendientes/sprite_fusion/registro.json (petición, coste, ids y archivos).
Después:  python herramientas/importar_sprite_fusion.py
"""
import base64, io, json, os, sys, time, urllib.request, urllib.error
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from exportar_sprite_fusion import RAIZ, anim_set, fotograma

BASE = 'https://www.spritefusion.com/api/v1'
SF = os.path.join(RAIZ, 'Recursos pendientes', 'sprite_fusion')
BASES, SALIDA, REG = os.path.join(SF, 'base'), os.path.join(SF, 'salida'), os.path.join(SF, 'registro.json')
UA = {'User-Agent': 'AnimeSurvivor-herramientas/1.0'}
MARGEN = 12  # píxeles libres a cada lado para que el paso no se corte

POSE = ('Redraw this exact sprite in a side-view walking pose facing right, mid-step: front leg forward, back leg '
        'behind, arms swinging opposite to the legs. It must stay the SAME sprite: identical height in pixels, identical '
        'large head, hair, face, chunky short proportions, outfit details, palette, black outline and pixel size. Do not '
        'make the character taller, slimmer or more detailed. Keep the head and torso pixels as they are; only the legs '
        'and arms move. Transparent background, no effects, no shadow.')
ANDAR_DISPARO = ('Side view walk cycle to the right while shooting: the legs walk with clear alternating steps, feet on '
                 'the same ground line, but the upper body, head and the extended shooting arm stay fixed in this exact '
                 'firing pose, aimed straight ahead, with only a tiny bob on each step. Keep exactly the same character, '
                 'proportions, colors and pixel size in every frame. Seamless loop. No projectile, no effects, no background.')
ANDAR_GOLPE = ('Side view: the character walks forward to the right while punching: alternating steps with the feet on the '
               'same ground line and a fast straight punch forward with the front arm, then the arm comes back. Keep exactly '
               'the same character, proportions, colors and pixel size in every frame. Seamless loop. No effects, no background.')
ANDAR = ('Side view walk cycle to the right, seamless loop with a steady rhythm. Legs alternate clearly with the feet '
         'planted on the same ground line, the arms swing opposite to the legs, a small body bob on each step. Keep exactly '
         'the same character, hair, outfit, colors and pixel size in every frame. No effects, no aura, no background.')


def clave():
    k = os.environ.get('SPRITE_FUSION_API_KEY')
    env = os.path.join(RAIZ, '.env')
    if not k and os.path.exists(env):
        for l in open(env, encoding='utf-8'):
            if l.strip().startswith('SPRITE_FUSION_API_KEY='): k = l.split('=', 1)[1].strip().strip('"\'')
    if not k: sys.exit('Falta la clave: crea .env con SPRITE_FUSION_API_KEY=... en la raíz del proyecto.')
    return k


def pedir(ruta, cuerpo=None):
    h = {**UA, 'Authorization': 'Bearer ' + clave()}
    if cuerpo is not None: h['Content-Type'] = 'application/json'; h['Accept'] = 'text/event-stream'
    datos = None if cuerpo is None else json.dumps(cuerpo).encode()
    return urllib.request.urlopen(urllib.request.Request(BASE + ruta, data=datos, headers=h), timeout=900)


def creditos(): return json.load(pedir('/credits')).get('credits')


def registro():
    return json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}


def guardar_registro(r):
    json.dump(r, open(REG, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)


def bajar(url, dst):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r: open(dst, 'wb').write(r.read())
    return os.path.relpath(dst, RAIZ)


def data_url(ruta): return 'data:image/png;base64,' + base64.b64encode(open(ruta, 'rb').read()).decode()


def generar(etiqueta, cuerpo):
    """Lanza una petición, imprime el avance y devuelve (completed, [asset, ...]) o (None, []) si falla."""
    outs, fin = [], None
    try:
        with pedir('/generate', cuerpo) as r:
            for l in r:
                l = l.decode('utf-8', 'replace').strip()
                if not l.startswith('data:'): continue
                ev = json.loads(l[5:].strip()); t = ev.get('type')
                if t == 'started': print(etiqueta, ': empezada,', ev.get('request_id'), '| quedan', ev.get('credits', {}).get('remaining'))
                elif t == 'output': outs.append(ev.get('asset', {}))
                elif t == 'completed': fin = ev
    except urllib.error.HTTPError as e:
        print(etiqueta, ': error', e.code, e.read().decode('utf-8', 'replace')[:300]); return None, []
    if not fin: print(etiqueta, ': se cortó antes de terminar (no se reintenta; mirar el historial de la web)'); return None, outs
    if fin.get('status') != 'succeeded': print(etiqueta, ': falló', fin.get('error')); return fin, outs
    return fin, outs


def base(nombre):
    """Guardia de la forma a tamaño real (sin ampliar), con margen transparente y los pies abajo."""
    h, f = nombre.rsplit('_', 1); F = anim_set()[h][f]
    fr = fotograma(F['anims']['Idle']); fr = fr.crop(fr.getbbox())
    lado = max(fr.width, fr.height) + 2 * MARGEN; lado += lado % 2
    im = Image.new('RGBA', (lado, lado)); im.paste(fr, ((lado - fr.width) // 2, lado - fr.height - 2))
    os.makedirs(BASES, exist_ok=True); ruta = os.path.join(BASES, nombre + '.png'); im.save(ruta)
    print(nombre, ': base', im.size, '->', os.path.relpath(ruta, RAIZ)); return ruta


def cuadro(nombre, anim, i):
    """Fotograma i de una animación del pack (p. ej. Cast 1) como imagen de partida, con margen."""
    h, f = nombre.rsplit('_', 1); fr = fotograma(anim_set()[h][f]['anims'][anim], int(i)); fr = fr.crop(fr.getbbox())
    lado = max(fr.width, fr.height) + 2 * MARGEN; lado += lado % 2
    im = Image.new('RGBA', (lado, lado)); im.paste(fr, ((lado - fr.width) // 2, lado - fr.height - 2))
    os.makedirs(BASES, exist_ok=True); ruta = os.path.join(BASES, f'{nombre}_{anim}{i}.png'); im.save(ruta)
    print(nombre, ':', anim, i, im.size, '->', os.path.relpath(ruta, RAIZ)); return ruta


def pose(nombre):
    ruta = os.path.join(BASES, nombre + '.png')
    if not os.path.exists(ruta): ruta = base(nombre)
    fin, outs = generar(nombre + ' pose', {'operation': 'edit', 'prompt': POSE, 'inputs': [{'data_url': data_url(ruta)}], 'tags': ['animesurvivor']})
    if not outs: return False
    os.makedirs(SALIDA, exist_ok=True); R = registro(); E = R.setdefault(nombre, {}); E['poses'] = []
    for i, a in enumerate(outs):
        E['poses'].append({'id': a.get('id'), 'archivo': bajar(a['assetUrl'], os.path.join(SALIDA, f'{nombre}_pose{i}.png'))})
    E['pose_req'] = {'prompt': POSE, 'hora': time.strftime('%Y-%m-%d %H:%M')}; guardar_registro(R)
    print(nombre, ':', len(outs), 'poses ->', ', '.join(p['archivo'] for p in E['poses']), '| quedan', (fin or {}).get('credits', {}).get('remaining'))
    return True


def animar(arg, prompt=ANDAR, frames=8, clave_sal='andar'):
    nombre, _, i = arg.partition(':'); R = registro(); E = R.get(nombre, {})
    if ':' in i:  # fotograma del pack: goku_0:Cast:1
        anim, k = i.split(':'); entrada = {'data_url': data_url(cuadro(nombre, anim, k))}; i = anim + k
    elif i:  # la pose vuelve recortada: se le devuelve el margen para que el paso no se corte
        fr = Image.open(os.path.join(RAIZ, E['poses'][int(i)]['archivo'])).convert('RGBA'); fr = fr.crop(fr.getbbox())
        lado = max(fr.width, fr.height) + 2 * MARGEN; lado += lado % 2
        im = Image.new('RGBA', (lado, lado)); im.paste(fr, ((lado - fr.width) // 2, lado - fr.height - 2))
        ruta = os.path.join(BASES, f'{nombre}_pose{i}.png'); im.save(ruta); entrada = {'data_url': data_url(ruta)}
    else:
        entrada = {'data_url': data_url(os.path.join(BASES, nombre + '.png'))}
    colores = 32
    fin, outs = generar(nombre + ' animar', {'operation': 'animate', 'prompt': prompt, 'inputs': [entrada],
                                           'output_frames': frames, 'colors': colores, 'tags': ['animesurvivor']})
    if not outs: return False
    a = outs[-1]; os.makedirs(SALIDA, exist_ok=True); arch = {}
    if a.get('spritesheetUrl'): arch['tira'] = bajar(a['spritesheetUrl'], os.path.join(SALIDA, f'{nombre}{"" if clave_sal == "andar" else "_" + clave_sal}_{a.get("frameCount") or frames}.png'))
    if a.get('assetUrl'):
        ext = {'image/gif': '.gif', 'image/webp': '.webp', 'image/png': '.apng.png'}.get(a.get('contentType'), '.bin')
        arch['animacion'] = bajar(a['assetUrl'], os.path.join(SALIDA, f'{nombre}_{clave_sal}_anim{ext}'))
    E.setdefault('animaciones', []).append({'tipo': clave_sal, 'id': a.get('id'), 'desde': ('pose' + i) if i else 'base', 'prompt': prompt,
                                            'fotogramas': a.get('frameCount'), 'fps': a.get('fps'), **arch, 'hora': time.strftime('%Y-%m-%d %H:%M')})
    R[nombre] = E; guardar_registro(R)
    print(nombre, ': animación ->', arch, '| quedan', (fin or {}).get('credits', {}).get('remaining'))
    return True


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a == ['--creditos']: print('Créditos:', creditos()); sys.exit()
    orden, nombres = a[0], a[1:]
    if orden == 'base': [base(n) for n in nombres]; sys.exit()
    fn = {'pose': pose, 'animar': animar, 'disparo': lambda n: animar(n, ANDAR_DISPARO, 8, 'disparo'),
          'golpe': lambda n: animar(n, ANDAR_GOLPE, 8, 'golpe')}[orden]
    print('Créditos antes:', creditos(), '| coste previsto:', 15 * len(nombres))
    print(sum(bool(fn(n)) for n in nombres), 'de', len(nombres), 'hechas | créditos ahora:', creditos())
