import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from preparar_piskel import export_to_piskel
from montar_animaciones import leer_config

def export_characters(char_list):
    cfg = leer_config()
    for h in char_list:
        if h in cfg:
            for f in cfg[h].keys():
                try:
                    export_to_piskel(h, f)
                except Exception as ex:
                    print(f"Error exporting {h}/{f}: {ex}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        export_characters(sys.argv[1:])
    else:
        print("Usage: python herramientas/exportar_piskel_lote.py <char1> <char2> ...")
