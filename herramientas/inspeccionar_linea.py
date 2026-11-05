import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import leer_config, frames_del_pack

def inspect_hero_line(hero_name):
    cfg = leer_config()
    if hero_name not in cfg:
        print(f"Hero '{hero_name}' not found in configs")
        return
        
    print(f"=== HERO: {hero_name} ===")
    forms = sorted(cfg[hero_name].keys(), key=lambda x: int(x) if x.isdigit() else str(x))
    for f_id in forms:
        f = cfg[hero_name][f_id]
        pack = f.get('pack')
        try:
            rutas = frames_del_pack(pack)
            n_frames = len(rutas)
        except Exception as ex:
            n_frames = f"ERR: {ex}"
        keys = {k: f[k] for k in ['idle', 'move', 'attack', 'kick', 'ki', 'pow', 'hurt', 'faint'] if k in f}
        print(f"  Form {f_id}: {pack} ({n_frames} frames)")
        print(f"    Current: {keys}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        inspect_hero_line(sys.argv[1])
    else:
        print("Usage: python herramientas/inspeccionar_linea.py <hero_name>")
