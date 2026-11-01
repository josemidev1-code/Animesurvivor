# Genera shenron_imagen.js con el Shenron pixelado de sprites/shenron/shenron.jpg (sin fondo, a su rejilla real).
import io,base64,os
from PIL import Image
os.chdir(os.path.join(os.path.dirname(__file__),'..'))
im=Image.open('sprites/shenron/shenron.jpg').convert('RGB')
# píxel de 14,15 px; bordes de la rejilla en x=14+k·14,15 e y=1+k·14,15 (medido con las diferencias entre columnas)
P,OX,OY=14.15,14-14.15,1.0
W,H=int((im.width-OX)/P),int((im.height-OY)/P)
sm=Image.new('RGBA',(W,H));px=sm.load();src=im.load()
for gx in range(W):
  for gy in range(H):
    cx,cy=OX+(gx+0.5)*P,OY+(gy+0.5)*P
    m=[src[min(im.width-1,max(0,int(cx)+i)),min(im.height-1,max(0,int(cy)+j))] for i in range(-3,4) for j in range(-3,4)]
    m.sort(key=sum);px[gx,gy]=m[len(m)//2]+(255,)
claro=lambda c:min(c[:3])>200
# fondo: blanco conectado con los bordes
pila=[(x,y) for x in range(W) for y in (0,H-1)]+[(x,y) for y in range(H) for x in (0,W-1)];vis=set()
while pila:
  x,y=pila.pop()
  if (x,y) in vis or not(0<=x<W and 0<=y<H):continue
  vis.add((x,y))
  if not claro(px[x,y]):continue
  px[x,y]=(0,0,0,0);pila+=[(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
# el humo del cigarro (arriba a la derecha) fuera
for x in range(int(W*0.84),W):
  for y in range(0,int(H*0.36)):
    c=px[x,y]
    if c[3] and min(c[:3])>110:px[x,y]=(0,0,0,0)
sm.save('ui/shenron.png')
b=io.BytesIO();sm.save(b,'PNG')
open('02 - Código del juego/shenron_imagen.js','w',encoding='utf-8').write('// Generado por herramientas/montar_shenron.py desde sprites/shenron/shenron.jpg\nwindow.SHENRON_IMG="data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()+'";\n')
sm.resize((W*6,H*6),Image.NEAREST).save(os.environ.get('VISTA','_vista_shenron.png'))
print('ok')
