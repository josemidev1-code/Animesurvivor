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
            # Makankosappo charge (two fingers to forehead) is usually ratio 0.5-0.7, dash is ratio > 1.5
            if ratio > 1.3 or w > 45 or i in [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 22, 23, 24, 28, 29, 30, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 70, 71, 72, 73, 74, 75]:
                print(f"  Frame {i:2d}: size=({w:2d}x{h:2d}), ratio={ratio:.2f}")

for form_id in ['0', '1']:
    scan_frames('piccolo', form_id)
