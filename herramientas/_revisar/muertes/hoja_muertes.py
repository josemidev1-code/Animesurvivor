import os, sys, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
import montar_animaciones as m
from rasgos import rasgos_pack, comun
from proponer_fotogramas import densidad
from PIL import Image, ImageDraw
FORMAS = sys.argv[1].split()
C = m.leer_config(); out = {}
filas = []
for idf in FORMAS:
    h, f = idf.split('/'); F = C[h][f]; pack = F['pack']; rs = rasgos_pack(pack)
    G = rs[F['idle'][0]]; H = G['alto']
    usados = {i for k in ('idle','move','attack','kick','ki','pow','hurt') for i in F.get(k, [])}
    malos = set(F.get('faintAntes', []))
    cand = [r for r in rs if not r.get('vacio') and r['i'] not in usados and r['i'] not in malos
            and densidad(r) >= 0.3 and r["prop"] > 1.2 and r['alto'] < 0.62 * H and comun(r['paleta'], G['paleta']) >= 0.35]
    cand.sort(key=lambda r: -comun(r['paleta'], G['paleta']))
    out[idf] = [r['i'] for r in cand[:6]]
    filas.append((idf, pack, F['idle'][0], out[idf], F.get('espejo')))
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'candidatos.json'), 'w'), indent=0)
CW, CH = 130, 90
hoja = Image.new('RGBA', (CW * 7 + 110, CH * len(filas)), (70, 163, 127, 255)); d = ImageDraw.Draw(hoja)
for y, (idf, pack, g, cs, esp) in enumerate(filas):
    rutas = m.frames_del_pack(pack)
    d.text((4, y * CH + 4), idf, fill=(255, 255, 255, 255))
    for n, i in enumerate([g] + cs):
        im = m.limpiar(rutas[i]); b = im.getbbox(); im = im.crop(b) if b else im
        if esp: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        im.thumbnail((CW - 6, CH - 16), Image.NEAREST)
        x = 110 + n * CW
        hoja.paste(im, (x + 3, y * CH + CH - 3 - im.height), im)
        d.rectangle((x, y * CH, x + CW - 1, y * CH + CH - 1), outline=(30, 90, 70, 255))
        d.text((x + 3, y * CH + 2), ('G' if n == 0 else '') + str(i), fill=(255, 220, 80, 255))
hoja.save(os.path.join(os.path.dirname(__file__), sys.argv[2]))
print({k: len(v) for k, v in out.items()})
