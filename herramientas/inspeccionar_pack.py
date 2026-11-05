import sys
import os
import glob
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, leer_config

cfg = leer_config()

def inspect_character(heroe, forma):
    f = cfg[heroe][forma]
    pack = f['pack']
    frames = frames_del_pack(pack)
    print(f"=== {heroe}/{forma} ({pack}) ===")
    print(f"Total frames: {len(frames)}")
    for i, path in enumerate(frames):
        basename = os.path.basename(path)
        print(f"  [{i:03d}] {basename}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        inspect_character(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python herramientas/inspeccionar_pack.py <heroe> <forma>")
