"""Atajo para meter un pack completo como personaje jugable (petición «todos los personajes», 2 nov. 2026).

  python herramientas/meter.py ver "<pack>"
      Hoja numerada del pack (ver_pack.py) en herramientas/_revisar/pack_<nombre>.png.
  python herramientas/meter.py poner <id> "<pack>" idle=0,1 move=7 attack=29,30,31 kick=47,48 ki=61,63 pow=70,71 hurt=17,18 [faint=60] [espejo] [pack2="<pack>" (sus fotogramas se numeran desde 1000)]
      Apunta la forma en herramientas/animaciones/todos.json, monta el personaje y saca su previsualización.
  python herramientas/meter.py alta <id> "<NOMBRE>" <familia> <potencia> "<descripción>" "<FORMA>" <aura>
      Lo da de alta en script.js (NUEVOS y SIGS_SERIE). Familias: goku, vegeta, black, otro.
      Potencia: 1 base, 2 SSJ, 3 SSJ2/SSJ3/SSJ4/God/Blue, 4 UI/MUI/Ego y formas máximas.
  python herramientas/meter.py quitar <id>
      Lo quita de todos.json y de animaciones_juego.js (para packs que al mirarlos no sirven).
Elige siempre los fotogramas a mano mirando la hoja: las propuestas automáticas fallan mucho.
"""
import json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m

RAIZ = m.RAIZ
TODOS = os.path.join(RAIZ, 'herramientas', 'animaciones', 'todos.json')
JS = os.path.join(RAIZ, '02 - Código del juego', 'script.js')
ANIM = os.path.join(RAIZ, '02 - Código del juego', 'animaciones_juego.js')
PY = sys.executable

FAMILIAS = {  # técnicas de la serie que ya existen en MV
    'goku': ('kame', ['kiblast', 'punch', 'kame', 'kaioken', 'instant', 'genki']),
    'vegeta': ('galick', ['kiblast', 'punch', 'galick', 'bigbang', 'finalflash', 'finalexp']),
    'black': ('blackkame', ['kiblast', 'kiblade', 'blackkame', 'lances', 'scythe', 'kick']),
    'otro': ('kame', ['kiblast', 'punch', 'kick', 'kame', 'renzoku']),
}
# vida, velocidad y ataque según la potencia de la forma (como los personajes que ya había)
POT = {1: (115, 64, 1.0, 3), 2: (120, 66, 1.12, 4), 3: (125, 67, 1.25, 5), 4: (130, 70, 1.35, 5)}


def cargar():
    return json.load(open(TODOS, encoding='utf-8'))


def guardar(T):
    json.dump(T, open(TODOS, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def ver(pack):
    subprocess.run([PY, os.path.join(RAIZ, 'herramientas', 'ver_pack.py'), pack], check=True, stdout=subprocess.DEVNULL)


def poner(hid, pack, args):
    f = {'pack': pack}
    for a in args:
        if a == 'espejo': f['espejo'] = True; continue
        if a.startswith('pack2='): f['pack2'] = a[6:]; continue  # pack hermano: sus fotogramas van desde 1000
        k, v = a.split('=')
        f[k] = [int(x) for x in v.split(',') if x != '']
    T = cargar(); T['heroes'][hid] = {'0': f}; guardar(T)
    subprocess.run([PY, os.path.join(RAIZ, 'herramientas', 'montar_animaciones.py'), hid], check=True)
    subprocess.run([PY, os.path.join(RAIZ, 'herramientas', 'previsualizar.py'), hid, '0'], check=True, stdout=subprocess.DEVNULL)
    print('previsualización:', os.path.join(RAIZ, 'herramientas', '_revisar', hid + '_0.png'))


def alta(hid, nombre, fam, pot, desc, forma, aura):
    hp, spd, atk, rar = POT[int(pot)]
    if fam == 'vegeta': hp, spd, atk = hp - 15, spd + 2, round(atk + 0.1, 2)
    if fam == 'black': spd, atk = spd + 2, round(atk + 0.05, 2)
    start, sig = FAMILIAS[fam]
    s = open(JS, encoding='utf-8').read()
    if re.search(r'\n ' + re.escape(hid) + r':\{name:', s): print('ya estaba', hid); return
    linea = (f" {hid}:{{name:'{nombre}',rar:{rar},hp:{hp},spd:{spd},atk:{atk},start:'{start}',desc:'{desc}',"
             f"forms:['{forma}'],aura:['{aura}'],sig:{json.dumps(sig).replace(chr(34), chr(39)).replace(' ', '')}}},\n")
    marca = " // «todos los personajes» (2 nov.)"
    i = s.index(marca); j = s.index('\n', i)
    s = s[:j + 1] + linea + s[j + 1:]
    fin = s.index("};", s.index('const SIGS_SERIE='))
    s = s[:fin] + f",\n {hid}:{json.dumps(sig).replace(chr(34), chr(39)).replace(' ', '')}" + s[fin:]
    open(JS, 'w', encoding='utf-8').write(s)
    print('alta', hid, nombre, hp, spd, atk)


def quitar(hid):
    T = cargar(); T['heroes'].pop(hid, None); guardar(T)
    t = open(ANIM, encoding='utf-8').read(); i = t.index('{'); j = t.rindex('}') + 1
    d = json.loads(t[i:j]); d['h'].pop(hid, None)
    open(ANIM, 'w', encoding='utf-8').write(t[:i] + json.dumps(d, separators=(',', ':')) + t[j:])
    print('quitado', hid)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'ver': ver(a[1])
    elif a[0] == 'poner': poner(a[1], a[2], a[3:])
    elif a[0] == 'alta': alta(*a[1:8])
    elif a[0] == 'quitar': quitar(a[1])
