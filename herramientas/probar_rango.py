import sys, os
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, leer_config, limpiar

def make_sequence_gif(heroe, forma, start, end, name):
    cfg = leer_config()
    f = cfg[heroe][forma]
    rutas = frames_del_pack(f['pack'])
    frames = []
    for i in range(start, min(end + 1, len(rutas))):
        im = limpiar(rutas[i])
        max_dim = max(im.width, im.height)
        if max_dim > 100:
            sc = 100.0 / max_dim
            im = im.resize((int(im.width * sc), int(im.height * sc)), Image.NEAREST)
        frames.append(im)
    if frames:
        out_path = f"herramientas/_revisar/{heroe}_{forma}_{name}_{start}_{end}.gif"
        frames[0].save(out_path, save_all=True, append_images=frames[1:], duration=150, loop=0)
        print("Guardado:", out_path)

if __name__ == '__main__':
    heroe = sys.argv[1]
    forma = sys.argv[2]
    start = int(sys.argv[3])
    end = int(sys.argv[4])
    name = sys.argv[5] if len(sys.argv) > 5 else "test"
    make_sequence_gif(heroe, forma, start, end, name)
