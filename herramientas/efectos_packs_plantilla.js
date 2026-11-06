// Recursos reales de sprites/; regenerar con herramientas/montar_efectos_pendientes.py.
(function(){
'use strict';
const data=__DATA__,cache={},status={loaded:0,failed:0,total:0};
for(const [key,entry] of Object.entries(data))cache[key]=entry.parts.map(group=>group.map(url=>{const im=new Image();status.total++;im.onload=()=>status.loaded++;im.onerror=()=>status.failed++;im.src=url;return im}));
window.PACK_FX={status,drawShot(ctx,p,x,y,time){
 if(p.packFx!=='masenko')return false;
 const im=cache.masenko[2][(time*12|0)%2];if(!im.complete||!im.naturalWidth)return false;
 const h=Math.max(8,Math.round(p.r*2.4)),w=Math.round(im.width/im.height*h);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(x,y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.drawImage(im,-Math.round(w*.6),-Math.round(h/2),w,h);ctx.restore();return true;
},drawBeam(ctx,b,L,W,t,fade){
 const key=b.mv==='masenko'?'masenko':b.mv==='kame'||b.mv==='gohanfutkame'?'kame':null;
 if(!b.hero||!key||L<2)return false;
 const fi=(t*12|0)%2,parts=cache[key].map(group=>group[fi]);
 if(parts.some(im=>!im.complete||!im.naturalWidth))return false;
 const [start,body,tip]=parts,H=Math.max(2,Math.round(W*1.9)),startH=Math.max(2,Math.round(H*.6));
 const startW=Math.max(1,Math.min(L*.25,start.width/start.height*startH)),tipW=Math.max(1,Math.min(L*.4,tip.width/tip.height*H)),bodyW=Math.max(0,L-startW-tipW);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=Math.max(.2,fade);
 ctx.drawImage(start,0,-startH/2,startW,startH);
 if(bodyW>0)ctx.drawImage(body,startW-1,-H/2,bodyW+2,H);
 ctx.drawImage(tip,L-tipW,-H/2,tipW,H);ctx.restore();return true;
}};
})();
