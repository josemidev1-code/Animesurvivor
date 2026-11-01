"""Página de revisión para el usuario: solo los packs que la IA dejó con "sigueDudoso": true.

Cada pack muestra sus motivos, la animación elegida en movimiento sobre la hierba del juego y todos sus fotogramas
numerados; pinchar un fotograma lo pone o lo quita de la animación elegida. «Descargar decisiones» guarda
decisiones.json, que se aplica con herramientas/aplicar_decisiones.py.

Uso:  python herramientas/revision_html.py   -> herramientas/_revisar/revision.html (se abre con doble clic)
"""
import glob, json, os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar_animaciones as m
from proponer_fotogramas import NOMBRES, PROPUESTAS, nombre_propuesta

SALIDA = os.path.join(m.RAIZ, 'herramientas', '_revisar', 'revision.html')


def fotograma(ruta):
    """Fotograma limpio y reducido a su píxel real, como data URL."""
    im = m.limpiar(ruta); b = im.getbbox()
    if not b: return ''
    im = im.crop(b); e = m.escala_pixel(im)
    if e > 1.05: im = im.resize((max(1, round(im.width / e)), max(1, round(im.height / e))), Image.NEAREST)
    return m.data_url(im)


def hierba():
    try:
        with open(os.path.join(m.RAIZ, 'escenarios_tiles.js'), encoding='utf-8') as fh: t = fh.read()
        return json.loads(t[t.index('{'):t.rindex('}') + 1])['grass']['src']
    except (OSError, ValueError, KeyError):
        return ''


def generar(propuestas, salida=SALIDA):
    datos = []
    for p in propuestas:
        rutas = m.frames_del_pack(p['pack'])
        datos.append({'nombre': p.get('nombre') or nombre_propuesta(p), 'pack': p['pack'], 'motivos': p.get('motivos', []),
                      'anims': {k: list(p.get(k) or []) for k in NOMBRES},
                      'frames': [fotograma(r) for r in rutas]})
    html = PLANTILLA.replace('/*DATOS*/', json.dumps(datos, ensure_ascii=False)) \
                    .replace('/*NOMBRES*/', json.dumps(NOMBRES, ensure_ascii=False)) \
                    .replace('/*HIERBA*/', json.dumps(hierba()))
    os.makedirs(os.path.dirname(salida), exist_ok=True)
    with open(salida, 'w', encoding='utf-8') as fh: fh.write(html)
    return salida


PLANTILLA = r'''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Revisión de fotogramas</title>
<style>
:root{--fondo:#16181d;--panel:#22252c;--texto:#e8e8ea;--suave:#9aa0aa;--marca:#ffd23f;--ok:#4caf7a}
body{margin:0;background:var(--fondo);color:var(--texto);font:15px/1.4 system-ui,sans-serif;padding:16px}
h1{font-size:20px;margin:0 0 4px}.ayuda{color:var(--suave);margin:0 0 16px}
.pack{background:var(--panel);border-radius:10px;padding:14px;margin:0 0 16px}
.pack.vale{outline:2px solid var(--ok)}.pack h2{font-size:15px;margin:0 0 6px;word-break:break-all}
.motivos{color:var(--marca);margin:0 0 10px;padding-left:18px}
.fila{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start}
canvas{image-rendering:pixelated;border-radius:6px;background:#3a7a3a}
.botones button,.vale-btn,#bajar{background:#333843;color:var(--texto);border:1px solid #444a56;border-radius:6px;
  padding:5px 10px;margin:0 4px 4px 0;cursor:pointer;font:inherit}
.botones button.activa{background:var(--marca);color:#111}.vale-btn.si{background:var(--ok);color:#111}
.tira{display:flex;flex-wrap:wrap;gap:4px;margin-top:10px}
.f{position:relative;width:56px;height:64px;background:#2d3139;border-radius:4px;display:flex;align-items:flex-end;
  justify-content:center;cursor:pointer;border:2px solid transparent}
.f img{max-width:52px;max-height:52px;image-rendering:pixelated}.f.sel{border-color:var(--marca)}
.f span{position:absolute;top:1px;left:3px;font-size:10px;color:var(--suave)}
#bajar{position:sticky;bottom:12px;background:var(--marca);color:#111;font-weight:600;padding:10px 16px}
</style></head><body>
<h1>Revisión de fotogramas</h1>
<p class="ayuda">Elige una animación, mírala en movimiento y pincha fotogramas para ponerlos o quitarlos.
Cuando un pack esté bien, pulsa «Vale». Al acabar, pulsa «Descargar decisiones» y pásale el archivo a la IA.</p>
<div id="packs"></div>
<button id="bajar">Descargar decisiones</button>
<script>
const DATOS=/*DATOS*/, NOMBRES=/*NOMBRES*/, HIERBA=/*HIERBA*/;
const est={};const suelo=new Image();if(HIERBA)suelo.src=HIERBA;
const caja=document.getElementById('packs');
for(const p of DATOS){
  est[p.nombre]={vale:false,anims:JSON.parse(JSON.stringify(p.anims)),actual:'idle'};
  const imgs=p.frames.map(u=>{const i=new Image();i.src=u;return i});
  const d=document.createElement('div');d.className='pack';
  d.innerHTML=`<h2></h2><ul class="motivos"></ul><div class="fila"><canvas width="160" height="120"></canvas>
    <div><div class="botones"></div><button class="vale-btn">Vale</button></div></div><div class="tira"></div>`;
  d.querySelector('h2').textContent=p.pack;
  for(const t of p.motivos){const li=document.createElement('li');li.textContent=t;d.querySelector('.motivos').append(li)}
  const s=est[p.nombre],bots=d.querySelector('.botones'),tira=d.querySelector('.tira');
  const pintar=()=>{bots.querySelectorAll('button').forEach(b=>b.classList.toggle('activa',b.dataset.k===s.actual));
    tira.querySelectorAll('.f').forEach(f=>f.classList.toggle('sel',s.anims[s.actual].includes(+f.dataset.i)))};
  for(const k in NOMBRES){const b=document.createElement('button');b.dataset.k=k;b.textContent=NOMBRES[k];
    b.onclick=()=>{s.actual=k;pintar()};bots.append(b)}
  p.frames.forEach((u,i)=>{if(!u)return;const f=document.createElement('div');f.className='f';f.dataset.i=i;
    f.innerHTML=`<span>${i}</span><img src="${u}" alt="">`;
    f.onclick=()=>{const a=s.anims[s.actual],j=a.indexOf(i);if(j>=0)a.splice(j,1);else{a.push(i);a.sort((x,y)=>x-y)}pintar()};
    tira.append(f)});
  const vb=d.querySelector('.vale-btn');vb.onclick=()=>{s.vale=!s.vale;vb.classList.toggle('si',s.vale);d.classList.toggle('vale',s.vale)};
  const cv=d.querySelector('canvas'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  (function bucle(t){c.clearRect(0,0,cv.width,cv.height);
    if(suelo.complete&&suelo.naturalWidth)for(let y=0;y<cv.height;y+=32)for(let x=0;x<cv.width;x+=32)c.drawImage(suelo,0,0,16,16,x,y,32,32);
    const a=s.anims[s.actual];if(a.length){const im=imgs[a[Math.floor(t/180)%a.length]];
      if(im&&im.complete){const w=im.width*2,h=im.height*2;c.drawImage(im,Math.round(cv.width/2-w/2),cv.height-8-h,w,h)}}
    requestAnimationFrame(bucle)})(0);
  pintar();caja.append(d);
}
document.getElementById('bajar').onclick=()=>{
  const out={};for(const k in est)out[k]={vale:est[k].vale,anims:est[k].anims};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}));
  a.download='decisiones.json';a.click()};
</script></body></html>'''


if __name__ == '__main__':
    props = []
    for ruta in sorted(glob.glob(os.path.join(PROPUESTAS, '*.json'))):
        with open(ruta, encoding='utf-8') as fh: p = json.load(fh)
        if p.get('sigueDudoso') and not p.get('aprobada'): props.append(p)
    print(generar(props), f'{len(props)} packs')
