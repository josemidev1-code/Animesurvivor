import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, leer_config, limpiar

cfg = leer_config()

def scan_frames(heroe, forma):
    f = cfg[heroe][forma]
    rutas = frames_del_pack(f['pack'])
    print(f"\n--- Scan {heroe}/{forma} ({len(rutas)} frames) ---")
    for i, r in enumerate(rutas):
        im = limpiar(r)
        bb = im.getbbox()
        if bb:
            w = bb[2] - bb[0]
            h = bb[3] - bb[1]
            ratio = w / h
            # Burning attack hand signs, Buster Cannon, Shining Sword slash, Dash flight
            if ratio > 1.3 or w > 45 or i in [2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 40, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 80, 81, 82, 83, 84, 85, 86, 87, 88]:
                print(f"  Frame {i:2d}: size=({w:2d}x{h:2d}), ratio={ratio:.2f}")

for form_id in ['0', '1', '2']:
    scan_frames('trunks', form_id)
