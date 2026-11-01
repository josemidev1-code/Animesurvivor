# Genera portadas_mapas.js: una portada por mapa sacada de sprites/06_Escenarios (incrustada, sin fetch).
import glob,io,base64,json,os
from PIL import Image
os.chdir(os.path.join(os.path.dirname(__file__),'..'))
fs=[f for f in sorted(glob.glob('sprites/06_Escenarios/**/*',recursive=True)) if f.lower().endswith(('.png','.jpg','.jpeg','.webp','.gif'))]
# índice de la hoja de miniaturas (orden alfabético de rutas) -> mapa
ELEGIDAS={'namek':85,'tierra':20,'arena':16,'time':121,'vegetasei':83,'futuro':82,'kame':47,'paoz':30,'kaio':23,'lookout':11,
 'budokai':56,'redribbon':67,'musculo':71,'capsule':36,'yardrat':87,'kaioshin':41,'infierno':128,'bills':49,'poder':112,
 'pradera':7,'bosque':15,'desierto':32,'gizard':69,'volcan':24}
W,H=264,165
out={};fuentes={}
for k,i in ELEGIDAS.items():
  im=Image.open(fs[i]).convert('RGB');r=max(W/im.width,H/im.height)
  im=im.resize((round(im.width*r),round(im.height*r)),Image.LANCZOS);x=(im.width-W)//2;y=(im.height-H)//2;im=im.crop((x,y,x+W,y+H))
  b=io.BytesIO();im.save(b,'JPEG',quality=82);out[k]='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
  fuentes[k]=fs[i].replace(chr(92),'/')
open('02 - Código del juego/portadas_mapas.js','w',encoding='utf-8').write('// Generado por herramientas/montar_portadas.py\nwindow.MAP_COVER='+json.dumps(out)+';\nwindow.MAP_COVER_SRC='+json.dumps(fuentes,ensure_ascii=False,indent=0)+';\n')
print(len(out),os.path.getsize('02 - Código del juego/portadas_mapas.js'))
