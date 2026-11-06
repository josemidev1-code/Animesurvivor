from pathlib import Path
import sys,json,hashlib,collections,importlib.util,time
from PIL import Image
sys.dont_write_bytecode=True
root=Path(__file__).resolve().parent.parent
source=root/'sprites'
out=root/'herramientas/_revisar/auditoria_completa';out.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('montador',root/'herramientas/montar_animaciones.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
config=module.leer_config()
runtime_text=(root/'02 - Código del juego/animaciones_juego.js').read_text(encoding='utf-8')
runtime=json.loads(runtime_text[runtime_text.index('{'):runtime_text.rindex('}')+1])['h']
files=[];broken=[];hashes=collections.defaultdict(list);packs=collections.defaultdict(list)
for path in source.rglob('*'):
 if not path.is_file():continue
 relative=path.relative_to(source).as_posix();data=path.read_bytes();digest=hashlib.sha256(data).hexdigest()
 entry={'path':relative,'size':len(data),'sha256':digest};hashes[digest].append(relative)
 if path.suffix.lower() in {'.png','.jpg','.jpeg','.gif','.webp','.bmp'}:
  try:
   with Image.open(path) as image:
    entry.update(width=image.width,height=image.height,frames=getattr(image,'n_frames',1));image.verify()
  except Exception as error:entry['error']=str(error);broken.append(entry)
  packs[path.parent.relative_to(source).as_posix()].append(entry)
 files.append(entry)
used=set();issues=[];forms=[]
for hero,variants in config.items():
 for form,selection in variants.items():
  record={'hero':hero,'form':form,'pack':selection.get('pack'),'animations':{},'errors':[]}
  try:
   paths=module.frames_del_pack(selection['pack']);used.add(str(Path(paths[0]).parent.relative_to(source)).replace('\\','/'))
   lookup=dict(enumerate(paths))
   if selection.get('pack2'):
    secondary=module.frames_del_pack(selection['pack2']);lookup.update({1000+i:p for i,p in enumerate(secondary)})
    if secondary:used.add(Path(secondary[0]).parent.relative_to(source).as_posix())
   for key,name in module.CLAVES.items():
    indexes=selection.get(key,[])
    if indexes:
     invalid=[i for i in indexes if not isinstance(i,int) or i not in lookup]
     if invalid:record['errors'].append(f'{key}: índices inexistentes {invalid}')
     record['animations'][name]=len(indexes)
     built=runtime.get(hero,{}).get(form,{}).get('anims',{}).get(name)
     if not built:record['errors'].append(f'{name}: falta en juego')
     elif len(built['du'])!=len(indexes):record['errors'].append(f'{name}: {len(indexes)} seleccionados frente a {len(built["du"])} montados')
   for key in ['idle','move','attack','kick','ki','pow','hurt']:
    if not selection.get(key):record['errors'].append(f'Falta secuencia {key}')
  except (Exception,SystemExit) as error:record['errors'].append(str(error))
  forms.append(record)
  if record['errors']:issues.append(record)
duplicates=[v for v in hashes.values() if len(v)>1]
pack_records=[]
for name,images in sorted(packs.items()):
 pack_records.append({'path':name,'images':len(images),'bytes':sum(i['size'] for i in images),'used':name in used,'invalid':sum('error' in i for i in images)})
report={'files':len(files),'bytes':sum(f['size'] for f in files),'packs':pack_records,'forms':forms,'broken':broken,'issues':issues,'duplicates':duplicates,'empty':[f for f in files if f['size']==0],'unreferenced_packs':[p for p in pack_records if not p['used']]}
(out/'inventario.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'files':len(files),'images':sum(len(v) for v in packs.values()),'packs':len(packs),'used_packs':len(used),'configured_heroes':len(config),'configured_forms':len(forms),'runtime_heroes':len(runtime),'runtime_forms':sum(map(len,runtime.values())),'broken':len(broken),'forms_with_issues':len(issues),'duplicate_groups':len(duplicates),'empty_files':len(report['empty']),'unreferenced_packs':len(report['unreferenced_packs'])},ensure_ascii=False,indent=2),flush=True)
print('INCIDENCIAS',json.dumps(issues,ensure_ascii=False)[:11000],flush=True)
