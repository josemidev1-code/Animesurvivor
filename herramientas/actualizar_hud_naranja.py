import re

script_path = '02 - Código del juego/script.js'
with open(script_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the HUD drawing block
old_hud_block = """function hud(time){
  const ps=stats(),hk=SC*DPR/2>1?1:2,HW=VW*2/hk,HH=VH*2/hk;
  // El HUD se dibuja a un píxel de la imagen por unidad (la mitad que el mundo; el doble si la pantalla va a escala x1):
  // ocupa menos y la letra «Press Start 2P» sale a su tamaño exacto (8 o 16), así no se emborrona. Coordenadas de HUD.
  ctx.save();ctx.scale(hk/2,hk/2);
  // arriba a la izquierda: nombre (y forma), nivel y vida con números; la experiencia es una línea fina debajo
  {const H=HEROES[S.hid],fo=P.form>0?H.forms[P.form]:'',tw=(Math.floor(S.t/60)+'').length*16+48,cab=Math.max(4,(HW/2-tw/2-12)/8|0),
      nm=[fo?H.name+' · '+fo:H.name,fo,H.name].find(t=>t&&t.length<=cab)||H.name.slice(0,cab),lv='Nv.'+P.lvl,hx=6+lv.length*8+6,hy=16,
      hw=Math.max(60,Math.min(180,(HW/2-69-hx-6|0)&~1)),f=clamp(P.hp/ps.maxhp,0,1);
    text(nm,6,4,'#ffffff',8,'left');text(lv,6,hy,'#ffd23f',8,'left');
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(hx-1,hy-1,hw+2,10);ctx.fillStyle='#3a1018';ctx.fillRect(hx,hy,hw,8);
    ctx.fillStyle=f<0.3?'#ff2a3a':'#ff4d5e';ctx.fillRect(hx,hy,Math.round(hw*f),8);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(hx,hy,Math.round(hw*f),1);
    text(Math.ceil(P.hp)+'/'+Math.round(ps.maxhp),hx+hw/2,hy,'#ffffff',8);
    ctx.fillStyle='#10162a';ctx.fillRect(hx,hy+10,hw,2);ctx.fillStyle='#3a9aff';ctx.fillRect(hx,hy+10,Math.round(hw*clamp(P.xp/P.need,0,1)),2)}
  // técnicas y mejoras que llevas: iconos a su tamaño real (16) con el nivel en la esquina
  {let x=6;for(const id of P.order){const mv=P.moves[id];ctx.fillStyle=mv.evo?'#ffd23f':'#2c3a6e';ctx.fillRect(x-1,33,18,18);ctx.fillStyle='#10162a';ctx.fillRect(x,34,16,16);
      ctx.drawImage(ic(id),x,34);text(mv.evo?'9':String(mv.lv),x+17,43,mv.evo?'#ffd23f':'#ffffff',8,'right');x+=20}
    x=6;for(const id in P.cards){ctx.drawImage(ic(id),x,55);text(String(P.cards[id]),x+17,64,'#bfe6ff',8,'right');x+=20}}
  // arriba en el centro: tiempo, las siete esferas y una línea con mapa, derrotados, zeni y dificultad
  {const m=Math.floor(S.t/60),s=Math.floor(S.t%60);text(m+':'+String(s).padStart(2,'0'),HW/2,4,'#ffffff',16);
    for(let i=0;i<7;i++){const x=HW/2-69+i*20,y=23,im=DBIMG[i+1];if(i>=S.balls)ctx.globalAlpha=0.3;
      if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,x,y,18,18);else{circ(x+9,y+9,9,OUTL);circ(x+9,y+9,8,'#e0761a');circ(x+8,y+8,6,'#f2a02a')}ctx.globalAlpha=1}
    text((HW>=560?(S.isl?S.isl.name:MAPS[S.map].name)+' · ':'')+S.kills+' derrotados · '+S.zeni+' zeni'+(S.diff?' · '+DIFF[S.diff].n:''),HW/2,44,'rgba(200,210,235,.75)',8)}
  // debajo: el evento en curso o la vida del jefe (nunca coinciden: no hay eventos con un jefe en pantalla)
  if(S.ev){const E=S.ev,y=58;
    if(E.k==='kaio')text(`RETO DE KAIO ${Math.min(E.need,S.kills-E.k0)}/${E.need} · ${Math.ceil(E.t)}s`,HW/2,y,'#ffd23f',8);
    if(E.k==='furia')text(`FURIA SAIYAN x2 · ${Math.ceil(E.t)}s`,HW/2,y,'#ff7a3a',8);
    if(E.k==='elite')text(`GUERRERO DE ÉLITE · ${Math.ceil(E.t)}s`,HW/2,y,'#ff4d5e',8);
    if(E.k==='gravedad')text(`GRAVEDAD x100 · EXP x2 · ${Math.ceil(E.t)}s`,HW/2,y,'#c0a0ff',8);
    if(E.k==='tiempo')text(`TIEMPO DETENIDO · ${Math.ceil(E.t)}s`,HW/2,y,'#bfe6ff',8);
    if(E.k==='fusion')text(`FUSIÓN · ${Math.ceil(E.t)}s`,HW/2,y,'#ffd23f',8);
    if(E.k==='genkidama')text(`GENKIDAMA ${Math.ceil(E.t)}`,HW/2,y,'#6ab8ff',8)}
  if(S.boss&&!S.boss.dead){const w=Math.min(320,HW-160)&~1,bx=HW/2-w/2;text(ET[S.boss.type].n,HW/2,58,'#ffb0f0',8);bar(bx,69,w,6,S.boss.hp/S.boss.maxhp,'#c83ad8')}
  // abajo: casillas de técnicas (1, 2, 3…), su nombre, avisos y la ayuda de controles los primeros 30 s
  {const L=sigOpen(),n=L.length,t2=TACTIL?2:1,w=8+16*t2,gap=4,x0=HW/2-(n*w+(n-1)*gap)/2|0,y=HH-(TACTIL?46:12)-w;P.barR=[];
    for(let i=0;i<n;i++){const x=x0+i*(w+gap),on=i===P.sel;P.barR.push([x*hk/2,y*hk/2,w*hk/2,w*hk/2]);ctx.fillStyle=on?'rgba(70,46,0,.85)':'rgba(8,10,30,.75)';ctx.fillRect(x,y,w,w);
      ctx.drawImage(sigIcon(L[i]),x+4,y+4,16*t2,16*t2);if((P.sigTimers||{})[L[i]]>0){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x,y,w,Math.round(w*clamp(P.sigTimers[L[i]]/Math.max(0.4,MV[L[i]].st(sigLv(i)).cd*ps.cd),0,1)))}
      ctx.fillStyle=on?'#ffd23f':'#3a4a7a';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+w-1,w,1);ctx.fillRect(x,y,1,w);ctx.fillRect(x+w-1,y,1,w);text(String(i+1),x+2,y+2,'#ffd23f',8,'left')}
    if(L[P.sel])text(MV[L[P.sel]].name,HW/2,y-11,'#ff9a3a',8);
    if(S.t<30)text('WASD moverse · 1-'+n+' priorizar ataque · Esc pausa',HW/2,HH-10,'rgba(200,210,235,.6)',8);"""

new_hud_block = """function hud(time){
  const ps=stats(),hk=SC*DPR/2>1?1:2,HW=VW*2/hk,HH=VH*2/hk;
  // HUD Dragon Ball Naranja (estilo PokéSurvivor): marco de Gi naranja, acentos ki ámbar y barras nítidas
  ctx.save();ctx.scale(hk/2,hk/2);
  // arriba a la izquierda: placa del héroe, nivel, vida verde y experiencia dorada
  {const H=HEROES[S.hid],fo=P.form>0?H.forms[P.form]:'',tw=(Math.floor(S.t/60)+'').length*16+48,cab=Math.max(4,(HW/2-tw/2-12)/8|0),
      nm=[fo?H.name+' · '+fo:H.name,fo,H.name].find(t=>t&&t.length<=cab)||H.name.slice(0,cab),lv='Nv.'+P.lvl,hx=6+lv.length*8+8,hy=16,
      hw=Math.max(68,Math.min(180,(HW/2-69-hx-6|0)&~1)),f=clamp(P.hp/ps.maxhp,0,1);
    // contenedor exterior naranja Dragon Ball
    ctx.fillStyle='rgba(20,9,3,.88)';ctx.fillRect(4,2,hx+hw+2,23);
    ctx.fillStyle='#c2410c';ctx.fillRect(4,2,hx+hw+2,1);ctx.fillRect(4,24,hx+hw+2,1);ctx.fillRect(4,2,1,23);ctx.fillRect(hx+hw+5,2,1,23);
    text(nm,8,4,'#fff7ed',8,'left');
    // chapa de nivel
    ctx.fillStyle='#9a3412';ctx.fillRect(7,hy-1,lv.length*8+2,10);
    ctx.fillStyle='#ea580c';ctx.fillRect(7,hy-1,lv.length*8+2,1);
    text(lv,8,hy,'#fef08a',8,'left');
    // barra de vida (verde cuando está sana, ámbar si baja del 50%, roja crítica < 25%)
    ctx.fillStyle='#000000';ctx.fillRect(hx-1,hy-1,hw+2,10);
    ctx.fillStyle='#2b0d02';ctx.fillRect(hx,hy,hw,8);
    ctx.fillStyle=f<0.25?'#ef4444':f<0.5?'#f59e0b':'#22c55e';ctx.fillRect(hx,hy,Math.round(hw*f),8);
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(hx,hy,Math.round(hw*f),1);
    text(Math.ceil(P.hp)+'/'+Math.round(ps.maxhp),hx+hw/2,hy,'#ffffff',8);
    // barra de experiencia dorada Super Saiyan
    ctx.fillStyle='#1e0a02';ctx.fillRect(hx,hy+9,hw,2);
    ctx.fillStyle='#ffd23f';ctx.fillRect(hx,hy+9,Math.round(hw*clamp(P.xp/P.need,0,1)),2)}
  // técnicas y mejoras: marcos naranja Dragon Ball y fondo cálido
  {let x=6;for(const id of P.order){const mv=P.moves[id];
      ctx.fillStyle=mv.evo?'#ffd23f':'#ea580c';ctx.fillRect(x-1,28,18,18);
      ctx.fillStyle='#1c0b03';ctx.fillRect(x,29,16,16);
      ctx.drawImage(ic(id),x,29);text(mv.evo?'★':String(mv.lv),x+17,38,mv.evo?'#ffd23f':'#fed7aa',8,'right');x+=20}
    x=6;for(const id in P.cards){ctx.drawImage(ic(id),x,50);text(String(P.cards[id]),x+17,59,'#fed7aa',8,'right');x+=20}}
  // arriba en el centro: tiempo en oro, 7 esferas y panel de estadísticas
  {const m=Math.floor(S.t/60),s=Math.floor(S.t%60);text(m+':'+String(s).padStart(2,'0'),HW/2,4,'#ffd23f',16);
    for(let i=0;i<7;i++){const x=HW/2-69+i*20,y=23,im=DBIMG[i+1];if(i>=S.balls)ctx.globalAlpha=0.3;
      if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,x,y,18,18);else{circ(x+9,y+9,9,OUTL);circ(x+9,y+9,8,'#ea580c');circ(x+8,y+8,6,'#f59e0b')}ctx.globalAlpha=1}
    text((HW>=560?(S.isl?S.isl.name:MAPS[S.map].name)+' · ':'')+S.kills+' derrotados · '+S.zeni+' zeni'+(S.diff?' · '+DIFF[S.diff].n:''),HW/2,44,'#fed7aa',8)}
  // eventos / jefe
  if(S.ev){const E=S.ev,y=58;
    if(E.k==='kaio')text(`RETO DE KAIO ${Math.min(E.need,S.kills-E.k0)}/${E.need} · ${Math.ceil(E.t)}s`,HW/2,y,'#ffd23f',8);
    if(E.k==='furia')text(`FURIA SAIYAN x2 · ${Math.ceil(E.t)}s`,HW/2,y,'#f97316',8);
    if(E.k==='elite')text(`GUERRERO DE ÉLITE · ${Math.ceil(E.t)}s`,HW/2,y,'#ef4444',8);
    if(E.k==='gravedad')text(`GRAVEDAD x100 · EXP x2 · ${Math.ceil(E.t)}s`,HW/2,y,'#fb923c',8);
    if(E.k==='tiempo')text(`TIEMPO DETENIDO · ${Math.ceil(E.t)}s`,HW/2,y,'#fed7aa',8);
    if(E.k==='fusion')text(`FUSIÓN · ${Math.ceil(E.t)}s`,HW/2,y,'#ffd23f',8);
    if(E.k==='genkidama')text(`GENKIDAMA ${Math.ceil(E.t)}`,HW/2,y,'#38bdf8',8)}
  if(S.boss&&!S.boss.dead){const w=Math.min(320,HW-160)&~1,bx=HW/2-w/2;text(ET[S.boss.type].n,HW/2,58,'#ffedd5',8);bar(bx,69,w,6,S.boss.hp/S.boss.maxhp,'#ea580c')}
  // abajo: casillas de técnicas de combate con marco Dragon Ball Naranja y selector dorado
  {const L=sigOpen(),n=L.length,t2=TACTIL?2:1,w=8+16*t2,gap=4,x0=HW/2-(n*w+(n-1)*gap)/2|0,y=HH-(TACTIL?46:12)-w;P.barR=[];
    for(let i=0;i<n;i++){const x=x0+i*(w+gap),on=i===P.sel;P.barR.push([x*hk/2,y*hk/2,w*hk/2,w*hk/2]);
      // fondo y borde naranja Gi / dorado
      ctx.fillStyle=on?'rgba(180,83,9,.92)':'rgba(30,14,5,.88)';ctx.fillRect(x,y,w,w);
      ctx.drawImage(sigIcon(L[i]),x+4,y+4,16*t2,16*t2);
      if((P.sigTimers||{})[L[i]]>0){ctx.fillStyle='rgba(0,0,0,.58)';ctx.fillRect(x,y,w,Math.round(w*clamp(P.sigTimers[L[i]]/Math.max(0.4,MV[L[i]].st(sigLv(i)).cd*ps.cd),0,1)))}
      ctx.fillStyle=on?'#ffd23f':'#c2410c';
      ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+w-1,w,1);ctx.fillRect(x,y,1,w);ctx.fillRect(x+w-1,y,1,w);
      if(on){ctx.fillStyle='#fed7aa';ctx.fillRect(x+1,y+1,w-2,1)}
      text(String(i+1),x+2,y+2,on?'#ffd23f':'#fed7aa',8,'left')}
    if(L[P.sel])text(MV[L[P.sel]].name,HW/2,y-11,'#ffedd5',8);
    if(S.t<30)text('WASD moverse · 1-'+n+' priorizar ataque · Esc pausa',HW/2,HH-10,'#fed7aa',8);"""

# Normalize and replace
c_norm = c.replace('\r\n', '\n')
old_norm = old_hud_block.replace('\r\n', '\n')
new_norm = new_hud_block.replace('\r\n', '\n')

if old_norm in c_norm:
    c_norm = c_norm.replace(old_norm, new_norm)
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print('script.js actualizado con HUD Dragon Ball Naranja con exito')
else:
    print('No se encontro el bloque exacto en script.js')
