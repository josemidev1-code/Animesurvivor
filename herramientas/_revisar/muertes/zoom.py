import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
import montar_animaciones as m
from PIL import Image, ImageDraw
C = m.leer_config(); items = [a.split(':') for a in sys.argv[2:]]
cel = []
for idf, frs in items:
    h, f = idf.split('/'); F = C[h][f]; rutas = m.frames_del_pack(F['pack'])
    for i in [F['idle'][0]] + [int(x) for x in frs.split(',')]:
        im = m.limpiar(rutas[i]); b = im.getbbox(); im = im.crop(b)
        if F.get('espejo'): im = im.transpose(Image.FLIP_LEFT_RIGHT)
        cel.append((f'{idf} {i}', im))
k = 2; W = max(c.width for _, c in cel) * k + 10; H = max(c.height for _, c in cel) * k + 20
cols = 6; hoja = Image.new('RGBA', (W * cols, H * ((len(cel) + cols - 1) // cols)), (70, 163, 127, 255)); d = ImageDraw.Draw(hoja)
for n, (t, im) in enumerate(cel):
    x, y = n % cols * W, n // cols * H; im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    hoja.paste(im, (x + 5, y + H - 4 - im.height), im); d.text((x + 3, y + 2), t, fill=(255, 220, 80, 255))
hoja.thumbnail((1600, 2000)); hoja.save(os.path.join(os.path.dirname(__file__), sys.argv[1]))
