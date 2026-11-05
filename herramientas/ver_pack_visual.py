import sys
import os
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, leer_config, limpiar, escala_pixel, RAIZ

def generar_mural(heroe, forma):
    cfg = leer_config()
    if heroe not in cfg or forma not in cfg[heroe]:
        print(f"Error: {heroe}/{forma} no encontrado")
        return
    f = cfg[heroe][forma]
    pack = f['pack']
    rutas = frames_del_pack(pack)
    print(f"Creando mural para {heroe}/{forma}: {len(rutas)} fotogramas...")
    
    cols = 10
    rows = (len(rutas) + cols - 1) // cols
    cell_w, cell_h = 100, 110
    
    mural = Image.new('RGBA', (cols * cell_w, rows * cell_h), (35, 39, 42, 255))
    draw = ImageDraw.Draw(mural)
    
    for idx, r in enumerate(rutas):
        c = idx % cols
        row = idx // cols
        x0 = c * cell_w
        y0 = row * cell_h
        
        # marco
        draw.rectangle([x0, y0, x0 + cell_w - 2, y0 + cell_h - 2], outline=(60, 65, 70))
        draw.text((x0 + 4, y0 + 3), f"#{idx}", fill=(255, 215, 0))
        
        try:
            im = Image.open(r).convert('RGBA')
            # auto-scale if too big
            max_dim = max(im.width, im.height)
            if max_dim > 85:
                scale = 85.0 / max_dim
                im = im.resize((int(im.width * scale), int(im.height * scale)), Image.NEAREST)
            # paste centered
            px = x0 + (cell_w - im.width) // 2
            py = y0 + 20 + (cell_h - 22 - im.height)
            mural.paste(im, (px, py), im)
        except Exception as e:
            draw.text((x0 + 4, y0 + 20), "ERR", fill=(255, 0, 0))
            
    out_dir = os.path.join(RAIZ, "herramientas", "_revisar")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"mural_{heroe}_{forma}.png")
    mural.save(out_path)
    print(f"Mural guardado en: {out_path}")

if __name__ == '__main__':
    if len(sys.argv) > 2:
        generar_mural(sys.argv[1], sys.argv[2])
    else:
        print("Uso: python herramientas/ver_pack_visual.py <heroe> <forma>")
