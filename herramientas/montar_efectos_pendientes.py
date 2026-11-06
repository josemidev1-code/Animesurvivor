from pathlib import Path
import json
import montar_animaciones as m
r=Path(__file__).resolve().parents[1]
selecciones={"kame":{"prefix":"165_","groups":[[0,4],[1,5],[3,6]]},"masenko":{"prefix":"167_","groups":[[0,3],[1,4],[2,6]]}}
out={}
for key,selection in selecciones.items():
 packs=[p for p in (r/'sprites').rglob(selection['prefix']+'*') if p.is_dir()]
 if len(packs)!=1:raise ValueError('Pack ambiguo o inexistente: '+selection['prefix'])
 pack=packs[0].relative_to(r/'sprites').as_posix();files=m.frames_del_pack(pack);parts=[]
 for group in selection['groups']:
  images=[]
  for i in group:
   im=m.limpiar(files[i]);im=im.crop(im.getbbox());images.append(m.data_url(im))
  parts.append(images)
 out[key]={'pack':pack,'parts':parts}
template=(r/'herramientas/efectos_packs_plantilla.js').read_text(encoding='utf-8')
(r/'02 - Código del juego/efectos_packs.js').write_text(template.replace('__DATA__',json.dumps(out,separators=(',',':'))),encoding='utf-8')
print('Efectos Kamehameha y Masenko: 12 imagenes incorporadas.')
