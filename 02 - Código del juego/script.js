(()=>{
'use strict';
const $=s=>document.querySelector(s);
const cv=$('#game'), sctx=cv.getContext('2d');
const view=document.createElement('canvas'), ctx=view.getContext('2d');
let VW=400,VH=250,SC=1,DPR=1;
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  const w=innerWidth,h=innerHeight;
  // unos 200 de alto, pero cada píxel de la imagen ocupa un número ENTERO de píxeles de la pantalla (1, 2, 3…):
  // con escalas como x1,5 o x2,5 los píxeles salían desiguales y la letra borrosa. Ante la duda, la escala menor (más campo).
  const kk=Math.max(1,Math.floor(Math.round(Math.min(w,h)*DPR/200)/2));SC=2*kk/DPR;
  VW=Math.ceil(w/SC); VH=Math.ceil(h/SC);
  view.width=VW*2; view.height=VH*2;
  cv.width=Math.round(w*DPR); cv.height=Math.round(h*DPR);
  ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false; sctx.imageSmoothingEnabled=false;
}
addEventListener('resize',resize); resize();

// ---------- utils ----------
const {rnd,clamp,TAU,h2,vnoise,fbm,hex,mk,srand}=window.AS_UTILS;

// ---------- pixel sprite tools ----------
const OUTL='#120c18';
function addOutline(c,col=OUTL){
  const g=c.getContext('2d'),W=c.width,H=c.height,id=g.getImageData(0,0,W,H),d=id.data,[r,gg,b]=hex(col),out=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i+3])continue;
    if((x>0&&d[i-1])||(x<W-1&&d[i+7])||(y>0&&d[i-W*4+3])||(y<H-1&&d[i+W*4+3]))out.push(i)}
  for(const i of out){d[i]=r;d[i+1]=gg;d[i+2]=b;d[i+3]=255}
  g.putImageData(id,0,0);return c}
function gridCanvas(rows,pal,outline=true){
  const h=rows.length,w=Math.max(...rows.map(r=>r.length)),o=outline?1:0,c=mk(w+2*o,h+2*o),g=c.getContext('2d');
  for(let y=0;y<h;y++)for(let x=0;x<rows[y].length;x++){const col=pal[rows[y][x]];if(col){g.fillStyle=col;g.fillRect(x+o,y+o,1,1)}}
  return outline?addOutline(c):c}
function flipC(c){const n=mk(c.width,c.height),g=n.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(c,0,0);return n}
function tintC(c,col){const n=mk(c.width,c.height),g=n.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return n}
// pixel-shaded ball (cols dark->light), light from top-left
function pball(g,cx,cy,r,cols,ry){ry=ry||r;
  for(let y=-ry;y<=ry;y++)for(let x=-r;x<=r;x++){const d=Math.sqrt((x*x)/(r*r)+(y*y)/(ry*ry));if(d>1)continue;
    let l=0.55-(x/r)*0.35-(y/ry)*0.45-d*0.25; if(((x+y)&1)&&l>0.2)l+=0.06;
    const i=clamp(Math.floor(l*cols.length*1.1),0,cols.length-1);g.fillStyle=cols[i];g.fillRect(cx+x,cy+y,1,1)}}

// ---------- character sprite data (hand-authored, original) ----------
const K='#160f1e';
const B_GOKU=[
"...h...h..h...",
".h.hh.hhh.hh.h",
".hhhhhhhhhhhhh",
"hhhHhhhhhhHhhh",
"hhhhhhhhhhhhhh",
".hhhhshhhshhh.",
".hhssssssssshh",
"..hskssssksh..",
"..ssssssssss..",
"...sssSSsss...",
"....SssssS....",
"..oobbssbboo..",
".ooooobbooooo.",
"ssooooooooooss",
"bs.oooooooo.sb",
"...bbbbbbbb..."];
const B_VEG=[
".....hh.......",
"....hhhh.h....",
"..h.hhhhhhh...",
".hhhhhhhhhhhh.",
".hhhhHhhhhHhhh",
"..hhhhhhhhhhh.",
"..hhhhhhhhhhh.",
"..hhhsshsshhh.",
"..hsskssskssh.",
"...ssssssssh..",
"....ssSSss....",
"..wbbbssbbbw..",
".ywwwwbbwwwwy.",
"bbwwwwwwwwwwbb",
"ww.WwwwwwwW.ww",
"...yybbbbyy..."];
const B_PIC=[
"....a....a....",
".....a..a.....",
"....wwwwww....",
"...wwwwwwww...",
"...wwWWWWww...",
"...pppppppp...",
"..ggggggggggg.",
".gggkggggkggg.",
"...gggggggg...",
"....gGGGGg....",
".cWWppggppWWc.",
"cWWppppppppWWc",
"cgg.pppppp.ggc",
"crr.pppppp.rrc",
"cc..bbbbbb..cc",
"c............c"];
const B_SAIBA=[
".....LLLLLL.....",
"...LLlllllgLL...",
"..LlgllllglllL..",
".Llllggllllgll..",
".lllllllglllllg.",
".lglllllllllgll.",
".llkkklllkkklll.",
".llkrklllkrklll.",
"..lkkllllllkkl..",
"..llllllllllll..",
"...lgllllllgl...",
"....gGGGGGGg....",
"..gggggggggggg..",
".ggG.ggggggg.Ggg",
".gG..ggGGggg..Gg",
".g...ggggggg...g"];
const B_SOLD=[
".....ssssss.....",
"....ssssssss....",
"...ssSsssssss...",
"..cccsssssSss...",
"..ckcsskssskss..",
"...ssssssssss...",
"....ssSSSSss....",
".....ssssss.....",
".yyy.dssssd.yyy.",
"yyyyywwwwwwyyyyy",
"yyy.wwwWWwwwwyyy",
"dd..wwwwwwwwW.dd",
"dd..wWwwwwwWw.dd",
"ss..wwwwwwwww.ss",
"....dddyyyddd...",
"....dddddddddd.."];
const B_CJR=[
"..gg....gg..",
".gggg..gggg.",
"..gggggggg..",
"..gdggggdg..",
"..bbbbbbbb..",
"..bkbbbbkb..",
"..bbbbbbbb..",
"...bPPPPb...",
".ggbbbbbbgg.",
"gg.gdggdg.gg",
"b..gggggg..b",
"...ggdggg..."];
const B_GINYU=[
"...k......k...",
"...kk....kk...",
"....pppppp....",
"...pppppppp...",
"...pkppppkp...",
"...pppppppp...",
"....pPPPPp....",
"..yy.pppp.yy..",
".yyywwwwwwyyy.",
".yywwwwwwwwyy.",
"pp.wwWwwWww.pp",
"pp.wwwwwwww.pp",
"ww..dddddd..ww"];
const B_FRZ=[
".....pppp.....",
"....pPPppp....",
"....wppppw....",
"...wwwwwwww...",
"...wrkwwkrw...",
"...wwwwwwww...",
"....wwppww....",
".....wwww.....",
"..pp.wwww.pp..",
".pPpwwppwwpPp.",
"ww.wwwPpwww.ww",
"ww.wwwwwwww.ww",
"....wWWWWw..ww",
"............w."];
const B_CELL=[
"..g........g..",
"..gg......gg..",
"...gggggggg...",
"...gdggggdg...",
"....ffffff....",
"....fkffkf....",
"....ffppff....",
"...bbffffbb...",
".bbgggggggggb.",
"bbggdgggdgggbb",
"gg.ggggdggg.gg",
"ff.gdggggdg.ff",
"....bbbbbb...."];
const B_BUU=[
".......pp.....",
"......pp......",
"....pppppp....",
"...pppppppp...",
"...pkkppkkp...",
"...pppppppp...",
"....pppkpp....",
".....pppp.....",
"...pppppppp...",
"..pppppppppp..",
"pp.ppPPPPpp.pp",
"pp.pppppppp.pp",
"....yykkyy...."];
const B_DOD=[
"...s.s..s.s...",
"...pppppppp...",
"..pppppppppp..",
"..pkpppppccp..",
"..pppppppppp..",
"..ppPPPPPPpp..",
".pppppppppppp.",
"yypwwwwwwwwpyy",
"yywwwwwwwwwwyy",
"pp.wwwwwwwww.pp",
"pp.wwwwwwwww.pp",
"...dddddddd..."];
const B_ZAR=[
"....hhhhhh....",
"...hhhhhhhh...",
"...hssssssh...",
"...skssssks...",
"...ssssssss...",
"....sssSss....",
"..yyhsssshyy..",
".yyywwwwwwyyy.",
"cyywwwwwwwwyyc",
"cs.wwWwwWww.sc",
"cs.wwwwwwww.sc",
"cw..dddddd..wc"];
const B_RAD=[
"....hhhhhh....",
"..hhhhhhhhhh..",
".hhhhhhhhhhhh.",
".hhhsssssshhh.",
".hhskssssskhh.",
".hhsssssssshh.",
".hhhssSSsshhh.",
"hhyywwwwwwyyhh",
"hhywwwwwwwwyhh",
"hs.wwwwwwww.sh",
"hs.wwWwwWww.sh",
"hh..dddddd..hh",
"hh..........hh"];
const B_NAP=[
"....ssssss....",
"...ssssssss...",
"...sSssssSs...",
"...kkssskks...",
"...ssssssss...",
"...shhhhhhs...",
"....ssssss....",
"yy.ssssssss.yy",
"yyywwwwwwwwyyy",
"ss.wwWwwWww.ss",
"ss.wwwwwwww.ss",
"ss..dddddd..ss"];
const B_A19=[
".....rrr......",
"....kkkkkk....",
"...kkkkkkkk...",
"...wwwwwwww...",
"..wwbwwwwbww..",
"..wwwwwwwwww..",
"..wwwppppwww..",
"...wwwwwwww...",
".kkkkggggkkkk.",
"wwkkkkkkkkkkww",
"ww.kkkyykkk.ww",
"...kkkkkkkk..."];
const B_DAB=[
"...w......w...",
"...ww....ww...",
"....hhhhhh....",
"...hrrrrrrh...",
"...rkrrrrkr...",
"...rrrrrrrr...",
"....rrRRrr....",
"..cc.rrrr.cc..",
".cccppppppccc.",
"cc.rppppppr.cc",
"cc.rppPPppr.cc",
"c...pppppp...c"];
const B_FBUU=[
"......pp......",
".....pp.......",
"....pppppp....",
"...pppppppp...",
"...pkpppkpp...",
"...pppPPppp...",
"..cpppppppppc.",
".cpppppppppppc",
"cppppppppppppc",
"cppppPPPPppppc",
"c.pyyykkyyypc.",
"c..wwwwwwww..c"];
const B_BLOB=[
"....pppp....",
"...pppppp...",
"..pkppppkp..",
"..pppppppp..",
"..ppPPPPpp..",
"...pppppp..."];
const LEGT={
 i:["...LLLLLLLL...","...LLLL.LLLL..","...LLL...LLL..","..FFFF...FFFF."],
 a:["...LLLLLLLL...","...LLLL.LLLL..","...LLL..FFFF..","..FFFF........"],
 b:["...LLLLLLLL...","..LLLL.LLLL...","..FFFF..LLL...","........FFFF.."]};
function legs(w,L,F,v){const cut=(14-w)>>1;return LEGT[v].map(r=>(cut<0?'.'.repeat(-cut)+r+'.'.repeat(-cut):r.slice(cut,cut+w)).replace(/L/g,L).replace(/F/g,F))}
function buildChar(body,w,L,F,pal){
  const fr=['i','a','i','b'].map(v=>gridCanvas(body.concat(legs(w,L,F,v)),pal)),fl=fr.map(flipC);
  return{fr,fl,wh:fr.map(c=>tintC(c,'#ffffff')),whf:fl.map(c=>tintC(c,'#ffffff')),w:fr[0].width,h:fr[0].height}}

const PAL={
 goku:{h:'#1c1a2c',H:'#3b3a5c',s:'#f6c38f',S:'#d9915f',o:'#f2771a',b:'#2747b5',k:K},
 vegeta:{h:'#1c1a2c',H:'#3b3a5c',s:'#f2bd8a',S:'#d48a5a',b:'#2b3fa8',w:'#f4f4f8',W:'#b9c2d6',y:'#e8b738',k:K},
 piccolo:{a:'#4a9a34',g:'#6cc04a',G:'#4a9a34',w:'#f2f2f2',W:'#c9c9d4',p:'#5a3ea8',b:'#3b6fd4',c:'#f4f4f4',r:'#e07a8a',k:K,m:'#6b3a1e'},
 saiba:{L:'#c4ef86',l:'#9bd65a',g:'#3f8f2f',G:'#2a6a22',k:'#101010',r:'#ff3030'},
 saibaX:{L:'#fff6a0',l:'#f0d84a',g:'#b89a1a',G:'#7a6210',k:'#101010',r:'#ff3030'},
 saibaR:{L:'#ffc0b0',l:'#f08a7a',g:'#a83a2e',G:'#6a1f1a',k:'#101010',r:'#ffe040'},
 soldier:{s:'#79b4e0',S:'#4d84b5',c:'#4dff6a',w:'#ece6da',W:'#bdb3a0',y:'#d2a24c',d:'#262838',k:K},
 soldierE:{s:'#e79ac0',S:'#b86a90',c:'#ff5a5a',w:'#d7e4f0',W:'#97a8c0',y:'#7a6ad0',d:'#1a1f30',k:K},
 celljrE:{g:'#3a9a2a',d:'#0d200a',b:'#3a76d8',P:'#ffffff',k:K},
 celljr:{g:'#5cc04a',d:'#1d3a1a',b:'#6aa6e8',P:'#d8e4ff',k:K},
 ginyu:{k:'#141018',p:'#8a5ac8',P:'#5a3a98',w:'#ece6da',W:'#bdb3a0',y:'#d2a24c',d:'#262838'},
 frieza:{w:'#f6f2fb',W:'#c7bdd8',p:'#8b3bd1',P:'#c58af0',r:'#e0244a',k:K},
 mecha:{w:'#c9d0dc',W:'#7f889c',p:'#5a3ab8',P:'#9fb0ff',r:'#ff3b3b',k:K},
 cell:{g:'#4fb04a',d:'#14281a',f:'#e8dcf0',p:'#a86cc8',b:'#1a1a24',k:K},
 buu:{p:'#f19ac0',P:'#d56a9c',w:'#f4f4f4',y:'#e8c030',k:K},
 dodoria:{s:'#c05a80',p:'#ee8fb4',P:'#c86890',w:'#3a5ab8',W:'#26408a',y:'#a07040',d:'#1a1a22',k:K,c:'#4dff6a'},
 zarbon:{h:'#2f7a4a',s:'#86c9c0',S:'#5a9a90',w:'#ece6da',W:'#bdb3a0',y:'#d2a24c',c:'#f4f4f4',d:'#262838',k:K},
 frieza100:{w:'#fbe8ff',W:'#d8a8e8',p:'#c050e0',P:'#f0a0ff',r:'#ff2a4a',k:K},
 raditz:{h:'#1c1a2c',s:'#f2bd8a',S:'#d48a5a',w:'#3a3040',W:'#28202e',y:'#8a6a3a',d:'#2a1a3a',k:K},
 nappa:{h:'#1c1a2c',s:'#f2bd8a',S:'#d48a5a',w:'#e8e8e0',W:'#b8b8b0',y:'#7a5a3a',d:'#2a2a40',k:K},
 a19:{r:'#e03a3a',k:'#2a2a38',w:'#f4f0ea',b:'#3a6ad8',p:'#e88aa8',g:'#4a7ad8',y:'#e8c030'},
 dabura:{w:'#f4e8d0',h:'#1c1a2c',r:'#d84040',R:'#a02a2a',k:K,c:'#2a2a6a',p:'#e8e8f4',P:'#b8b8d0'},
 fatbuu:{p:'#f19ac0',P:'#d56a9c',c:'#6a3ab8',y:'#e8c030',k:K,w:'#f4f4f4'},
 blob:{p:'#f19ac0',P:'#d56a9c',k:K},
 rrsoldier:{s:'#f2c08a',S:'#d48a5a',c:'#2a2a2a',w:'#5a8a42',W:'#3e6a2e',y:'#c83030',d:'#2a2a2a',k:K},
 majin:{s:'#b08ae0',S:'#7a5ab0',c:'#ffd23f',w:'#3a3a4a',W:'#2a2a38',y:'#d84aa0',d:'#1a1a24',k:K},
};
const HAIR=[null,{h:'#ffd83a',H:'#fff6a8',k:'#13786f'},{h:'#ffe24a',H:'#ffffff',k:'#13786f'},{h:'#ffc61f',H:'#fff3a0',k:'#13786f'}];
const SPR={};
// ---------- hero sprites v3: layered pixel painter (36x52, shaded, 3 directions) ----------
const HW=36,HH=52;
const HPAL={
 goku:{d:'#0a0812',h:'#1c1a2c',H:'#34334f',l:'#4c4b70',s:'#f6c38f',S:'#d9915f',t:'#ffe0bc',e:'#ffffff',k:'#160f1e',m:'#a0503a',B:'#1c1a2c',
   o:'#f2771a',O:'#c0500c',q:'#ffa64a',b:'#2747b5',D:'#16307a',n:'#4f74e0',w:'#f4f4f4'},
 vegeta:{d:'#0a0812',h:'#1c1a2c',H:'#34334f',l:'#4c4b70',s:'#f2bd8a',S:'#d48a5a',t:'#ffdcb4',e:'#ffffff',k:'#160f1e',m:'#a0503a',B:'#1c1a2c',
   b:'#2b3fa8',D:'#1a2870',n:'#4a5ed0',w:'#f4f4f8',W:'#b4bed4',x:'#ffffff',y:'#e8b738',Y:'#a88420'},
 piccolo:{g:'#6cc04a',G:'#4a9a34',j:'#9ad878',a:'#4a9a34',s:'#6cc04a',S:'#4a9a34',t:'#9ad878',e:'#ffffff',k:'#160f1e',m:'#2a5a1a',B:'#3a7a2a',
   w:'#f2f2f2',W:'#c4c4d2',p:'#5a3ea8',P:'#3e2a7a',u:'#7a5ec8',c:'#f4f4f4',C:'#c4c4d2',b:'#3b6fd4',D:'#2a4fa0',r:'#e07a8a',R:'#a0302a',M:'#4a2812',z:'#6b3a1e'},
};
// hair colour sets by form
const HAIRC={base:null,ssj:{h:'#ffd21f',H:'#e8960e',l:'#fff8d0',d:'#a8581a',B:'#e0a010',e:'#ffffff'},ssj3:{h:'#ffc61a',H:'#e08a0a',l:'#fff8d8',d:'#a0501a',B:'#ffc61a'},
  ui:{h:'#dfe3ee',H:'#9aa2bc',l:'#ffffff',B:'#9aa2bc',k:'#6a7290'},ego:{h:'#8a4ad8',H:'#5a2a9a',l:'#c8a0ff',B:'#5a2a9a',k:'#c02a6a'},rose:{h:'#ff6ab8',H:'#c03a88',l:'#ffc8e6',B:'#c03a88',k:'#7a1a5a'},god:{h:'#e8304a',H:'#a01a30',l:'#ff8a9a',B:'#a01a30'},blue:{h:'#3ad0f0',H:'#1a8ab8',l:'#b0f4ff',B:'#1a8ab8'}};
// spikes: [baseX,baseY,tipX,tipY,halfWidth]
const SPK={
 goku:{cap:[18,16,9,8],sp:[[13,12,7,4,3.5],[17,10,16,2,3.5],[21,11,27,4,3.5],[25,15,33,12,3],[25,19,32,24,3],[11,15,3,12,3],[11,19,4,24,3]],
   bang:[[12,16,11,23,2.5],[15,15,14,20,2],[19,15,21,20,2],[23,16,25,23,2.5]],back:[[14,24,13,29,3],[18,24,18,30,3],[22,24,23,29,3]]},
 gokuSSJ:{cap:[18,15,9,8],sp:[[12,12,5,1,4],[15,10,12,0,3.5],[18,10,19,0,3.5],[21,10,26,0,3.5],[24,12,32,4,3.5],[26,16,34,13,3],[10,15,2,10,3],[11,19,3,21,3],[26,20,33,23,3]],
   bang:[[13,16,12,22,2.5],[17,15,16,20,2],[21,15,22,20,2],[23,16,25,22,2.5]],back:[[14,24,12,30,3],[18,24,18,31,3],[22,24,24,30,3]]},
 gokuSSJ2:{cap:[18,15,9,8],sp:[[12,12,4,1,4],[15,10,12,0,3.5],[18,10,19,0,3.5],[21,10,27,0,3.5],[24,12,33,4,3.5],[26,16,35,13,3],[10,15,1,10,3],[11,19,2,21,3],[26,20,34,23,3]],
   bang:[[13,16,12,22,2.5],[16,15,14,23,1.5],[21,15,22,20,2],[23,16,25,22,2.5]],back:[[14,24,12,31,3],[18,24,18,32,3],[22,24,24,31,3]]},
 gokuSSJ3:{cap:[18,15,9,8],sp:[[12,12,7,2,4],[18,10,18,1,4],[24,12,29,2,4],[10,16,4,12,3],[26,16,32,12,3]],
   bang:[[13,16,12,22,2.5],[23,16,25,22,2.5]],back:[[14,24,13,30,3],[18,24,18,31,3],[22,24,23,30,3]],long:1},
 vegeta:{cap:[18,15,8,7],sp:[[12,13,8,3,3.5],[15,11,13,0,3.5],[18,10,18,0,4],[21,11,23,0,3.5],[24,13,28,3,3.5],[26,16,31,10,2.5],[10,16,5,10,2.5]],
   bang:[[18,15,18,20,2.5]],back:[[13,22,12,26,3],[18,22,18,27,3],[23,22,24,26,3]]},
 vegetaSSJ:{cap:[18,15,8,7],sp:[[12,13,7,1,3.5],[15,11,12,0,3.5],[18,10,18,0,4],[21,11,24,0,3.5],[24,13,30,2,3.5],[26,16,33,9,2.5],[10,16,3,9,2.5]],
   bang:[[18,15,18,20,2.5]],back:[[13,22,12,27,3],[18,22,18,28,3],[23,22,24,27,3]]},
};
function triFill(G,ax,ay,bx,by,cx,cy,col,shade,light){
  const x0=Math.floor(Math.min(ax,bx,cx)),x1=Math.ceil(Math.max(ax,bx,cx)),y0=Math.floor(Math.min(ay,by,cy)),y1=Math.ceil(Math.max(ay,by,cy));
  const ar=(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);if(Math.abs(ar)<0.01)return;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x+0.5,py=y+0.5;
    const w0=((bx-px)*(cy-py)-(by-py)*(cx-px))/ar,w1=((cx-px)*(ay-py)-(cy-py)*(ax-px))/ar,w2=1-w0-w1;
    if(w0<-0.02||w1<-0.02||w2<-0.02)continue;
    // b = left base corner, c = right base corner; light on the left
    let ch=col;if(w2<0.22)ch=shade;else if(w1<0.18)ch=light;else if(Math.abs(w1-w2)<0.07&&w0>0.3&&w0<0.85)ch='d';put(G,x,y,ch)}}
function put(G,x,y,ch){x=Math.round(x);y=Math.round(y);if(y>=0&&y<HH&&x>=0&&x<HW)G[y][x]=ch}
function rectG(G,x,y,w,h,ch){for(let j=0;j<h;j++)for(let i=0;i<w;i++)put(G,x+i,y+j,ch)}
function hrow(G,x,y,w,m){for(let i=0;i<w;i++)put(G,x+i,y,i===w-1?m[1]:i===0?m[2]:m[0])}
function srect(G,x,y,w,h,m,round){ // m=[base,shade,light]
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(round&&j===0&&(i===0||i===w-1))continue;
    let ch=m[0];if(i===w-1||j===h-1)ch=m[1];else if(i===0&&w>2)ch=m[2];put(G,x+i,y+j,ch)}}
function ellG(G,cx,cy,rx,ry,m,clip){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const d=(x*x)/(rx*rx)+(y*y)/(ry*ry);if(d>1)continue;if(clip&&clip(cx+x,cy+y))continue;
  let ch=m[0];if(x>rx*0.45&&y>-ry*0.3||d>0.8&&y>0)ch=m[1];else if(x<-rx*0.3&&y<0&&d<0.8)ch=m[2];put(G,cx+x,cy+y,ch)}}
function stampG(G,rows,x,y,flip){for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const ch=rows[j][i];if(ch!=='.')put(G,flip?x+rows[j].length-1-i:x+i,y+j,ch)}}
function spikeSet(G,set,ox,flipSide){for(const [bx,by,tx,ty,w] of set){
  let BX=bx+ox,TX=tx+ox;const dx=TX-BX,dy=ty-by,l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w;
  triFill(G,TX,ty,BX-nx,by-ny,BX+nx,by+ny,'h','H','l')}}
const FACE_F=[
"ssssssssssss",
"ssssssssssss",
"sBBBssssBBBs",
"seekssssskes",
"sekksssskkes",
"sssssSSsssss",
"ssssssssssss",
"sssssmmsssss",
".SssssssssS.",
"..SSssssSS..",
"....SSSS...."];
const FACE_V=[
"ssssssssssss",
"ssssssssssss",
"sBBBBssBBBBs",
"ssBekssskeBs",
"sseKksskKess",
"sssssSSsssss",
"ssssssssssss",
"ssssmmmmssss",
".SssssssssS.",
"..SSssssSS..",
"....SSSS...."];
const FACE_S=[
"ssssssssss",
"ssssssssss",
"sssssssBBB",
"sssssseeks",
"sssssseKks",
"sssssssssst",
"ssssssssSs",
"Ssssssssms",
".Sssssssss",
"..SSsssss.",
"...SSSS..."];
const FACE_P=[
"gggggggggggg",
"gGGGggggGGGg",
"gGeekggkeeGg",
"ggekkggkkegg",
"gggggGGggggg",
"gggggggggggg",
"ggggkkkkgggg",
".GggggggggG.",
"..GGggggGG..",
"....GGGG...."];
const FACE_PS=[
"gggggggggg",
"ggggggGGGg",
"ggggggeekg",
"gggggggkkg",
"ggggggggggj",
"ggggggggGg",
"Ggggggkkkg",
".Ggggggggg",
"..GGgggg..",
"...GGGG..."];
function blankG(){return Array.from({length:HH},()=>Array(HW).fill('.'))}
// pose descriptor -> grid
function paintHero(id,form,dir,pose,f){
  const G=blankG(),side=dir==='side',back=dir==='up';
  // timing offsets
  let bob=0,lL=0,lR=0,aL=0,aR=0,stride=0;
  if(pose==='idle'){bob=f%2}
  else if(pose==='walk'){bob=f%2;if(f===1){lL=2;aL=-1;aR=1;stride=3}if(f===3){lR=2;aL=1;aR=-1;stride=-3}}
  else if(pose==='hurt'){bob=1}
  else{bob=0}
  const hy=bob; // head shift
  const D=HDEF[id],isP=D.head==='turban',bald=D.head==='bald';
  const spk=D.hair?D.hair[Math.min(form,D.hair.length-1)]:null;
  // ---- long hair (SSJ3) behind body
  if(spk&&spk.long){const cx=side?15:18;for(let y=18;y<46;y++){const w=Math.round(8+(y-18)*0.12);for(let x=-w;x<=w;x++){const ch=Math.abs(x)>w-2?'H':(x<-w+3?'l':'h');
    if(y>42&&((x+y)&3)===0)continue;put(G,cx+x,y+hy,ch)}}}
  // ---- cape (Piccolo) behind body
  if(isP){if(back){srect(G,8,29+bob,20,21-bob,['c','C','c'])}else if(side){for(let y=29+bob;y<50;y++){const w=4+Math.round((y-29)*0.25);rectG(G,13-w-(pose==='walk'?f%2:0),y,w,1,'c');put(G,13-w-(pose==='walk'?f%2:0),y,'C')}}
    else{for(let y=30+bob;y<50;y++){const w=Math.round((y-30)*0.2);rectG(G,9-w,y,3,1,'C');rectG(G,24+w,y,3,1,'C')}}}
  // ---- legs
  const mat=D.mats;
  const legTop=41;
  if(!side){
    const leg=(x,lift,flipToe)=>{const bot=51-lift;for(let y=legTop;y<=bot;y++){const boot=y>bot-4;const w=6+((!boot&&y>bot-7&&mat.baggy)?1:0);
      hrow(G,x-(w>6&&!flipToe?1:0),y,w,boot?mat.boot:mat.pants)}
      if(mat.toe)rectG(G,x+(flipToe?4:0),bot,2,1,mat.toe)};
    leg(12,lL,false);leg(18,lR,true);
    if(mat.sash&&!back){rectG(G,19,41,2,4,mat.sash[0]);put(G,20,45,mat.sash[1])}
  }else{
    const leg=(hip,dxf,dark,cast)=>{for(let y=legTop;y<=51;y++){const k=(y-legTop)/10,x=Math.round(hip+dxf*k);const boot=y>47;
      const m=boot?mat.boot:mat.pants;hrow(G,x,y,6,dark?[m[1],m[1],m[1]]:m)}
      const xf=Math.round(hip+dxf);rectG(G,xf+5,50,2,2,dark?mat.boot[1]:mat.boot[0]);if(mat.toe)rectG(G,xf+5,51,2,1,mat.toe)};
    const st=pose==='cast'?3:stride;
    leg(14,-st,true);leg(15,st,false);
  }
  // ---- torso
  const tY=29+bob;
  if(!side){
    srect(G,12,tY,12,10,mat.torso,true);
    mat.chest&&mat.chest(G,tY,back);
    srect(G,12,tY+10,12,2,mat.belt);
  }else{
    srect(G,13,tY,10,10,mat.torso,true);
    mat.chestS&&mat.chestS(G,tY);
    srect(G,13,tY+10,10,2,mat.belt);
  }
  // ---- arms
  const arm=(x,y,len,dx,m,hand,front)=>{for(let j=0;j<len;j++){const xx=Math.round(x+dx*j/len);const mm=j>=len-mat.cuffLen?(mat.cuff||m):m;hrow(G,xx,y+j,4,j===0?[mm[0],mm[1],mm[0]]:mm)}
    const hx=Math.round(x+dx);srect(G,hx,y+len,4,3,hand);};
  if(!side){
    const yA=tY+(pose==='hurt'?-3:0);
    if(pose==='hurt'){arm(8,yA,9,-2,mat.arm,mat.hand);arm(24,yA,9,2,mat.arm,mat.hand)}
    else{arm(8,tY+aL+1,9,0,mat.arm,mat.hand);arm(24,tY+aR+1,9,0,mat.arm,mat.hand)}
    if(mat.pads&&!back)mat.pads(G,tY,false);
    if(mat.pads&&back)mat.pads(G,tY,false);
  }else{
    if(pose==='cast'&&f===0){ // charge: both hands pulled back at the hip
      for(let j=0;j<6;j++)hrow(G,14-j,tY+2+j,4,mat.arm);srect(G,6,tY+8,5,4,mat.hand);
    }else if(pose==='cast'){ // fire: both arms thrust forward
      for(let i=0;i<10;i++){put(G,18+i,tY+3,mat.arm[2]);put(G,18+i,tY+4,mat.arm[0]);put(G,18+i,tY+5,mat.arm[0]);put(G,18+i,tY+6,mat.arm[1])}rectG(G,18,tY+3,10,1,mat.arm[2]);srect(G,28,tY+2,4,6,mat.hand);put(G,31,tY+4,'k');
    }else{
      const sw=pose==='walk'?(f===1?3:f===3?-3:0):0;
      arm(17,tY+1,9,sw,mat.arm,mat.hand);
    }
    if(mat.pads)mat.pads(G,tY,true);
  }
  // ---- head
  const hx=0,hY=hy;
  if(isP){
    // ears
    if(!side){for(let i=0;i<4;i++){put(G,11-i,20+hY-i,'g');put(G,11-i,21+hY-i,'G');put(G,24+i,20+hY-i,'g');put(G,24+i,21+hY-i,'G')}}
    else{for(let i=0;i<4;i++){put(G,15-i,21+hY-i,'g');put(G,15-i,22+hY-i,'G')}}
    if(back){ellG(G,18,22+hY,6,6,['g','G','j'])}
    else if(side)stampG(G,FACE_PS,16,18+hY);else stampG(G,FACE_P,12,18+hY);
    // turban
    const tx=side?17:18;ellG(G,tx,13+hY,9,7,['w','W','w']);rectG(G,tx-9,14+hY,19,2,'w');rectG(G,tx-8,16+hY,17,2,'p');rectG(G,tx-8,17+hY,17,1,'P');
    if(!back){rectG(G,tx-4,11+hY,8,1,'W')}
    const ant=(x0,dir)=>{for(let i=0;i<6;i++)put(G,x0+dir*Math.round(i*0.5),7+hY-i,'a');put(G,x0+dir*3,1+hY,'g');put(G,x0+dir*3+dir,1+hY,'g')};
    if(side){ant(tx+2,1);ant(tx-2,-1)}else{ant(tx-4,-1);ant(tx+4,1)}
  }else{
    // ears + neck
    if(!side){put(G,11,21+hY,'s');put(G,11,22+hY,'S');put(G,24,21+hY,'s');put(G,24,22+hY,'S')}
    rectG(G,side?17:16,28+hY,4,2,'S');
    if(back){ellG(G,18,21+hY,7,7,['h','H','l'])}
    else if(side){stampG(G,FACE_S,17,18+hY);put(G,18,21+hY,'S');put(G,18,22+hY,'S')}
    else stampG(G,D.face==='V'?FACE_V:FACE_F,12,18+hY);
    if(D.ear&&!back&&!side){put(G,11,23+hY,'y');put(G,24,23+hY,'y')}
    if(bald){ellG(G,side?17:18,19+hY,8,7,['s','S','t'],back?null:side?((x,y)=>x>=19&&y>19+hY):((x,y)=>y>19+hY&&x>11&&x<24));
      if(!back&&!side)for(const [a,b] of [[16,13],[18,13],[20,13],[17,15],[19,15],[18,17]])put(G,a,b+hY,'D');return G}
    if(D.majin===form&&!back&&!side){put(G,17,18+hY,'k');put(G,18,18+hY,'k');put(G,16,19+hY,'k');put(G,19,19+hY,'k')}
    // hair
    const shift=side?-3:0,sp=side?spk.sp.map(([a,b,c,d,w])=>[a,b,c-4,d,w]):spk.sp;
    ellG(G,spk.cap[0]+shift,spk.cap[1]+hY,spk.cap[2],spk.cap[3],['h','H','l'],back?null:side?((x,y)=>x>=18&&y>18+hY):((x,y)=>y>19+hY&&x>12&&x<23));
    spikeSet(G,sp.map(([a,b,c,d,w])=>[a,b+hY,c,d+hY,w]),shift);
    if(back)spikeSet(G,spk.back.map(([a,b,c,d,w])=>[a,b+hY,c,d+hY,w]),0);
    else if(side)spikeSet(G,spk.bang.filter(b=>b[0]>=17).map(([a,b,c,d,w])=>[a+3,b+hY,c+3,d+hY,w]),0);
    else spikeSet(G,spk.bang.map(([a,b,c,d,w])=>[a,b+hY,c,d+hY,w]),0);
    if(side)spikeSet(G,[[13,18+hY,6,22+hY,3],[13,22+hY,7,27+hY,3]],0);
    if(D.band){rectG(G,side?11:10,17+hY,side?13:16,2,'r');put(G,side?10:9,18+hY,'R');put(G,side?9:8,19+hY,'r')}
  }
  return G}
function matsFor(id,form){
  if(id==='goku')return{
    torso:['o','O','q'],belt:['b','D','n'],pants:['o','O','q'],boot:['b','D','n'],toe:'D',baggy:1,
    arm:['s','S','t'],hand:['s','S','t'],cuff:['b','D','n'],cuffLen:3,sash:['b','D'],
    chest(G,y,back){if(back){ellG(G,18,y+4,3,3,['w','w','w']);put(G,18,y+3,'k');put(G,17,y+4,'k');put(G,18,y+4,'k');put(G,19,y+4,'k');put(G,18,y+5,'k');return}
      rectG(G,15,y,6,1,'b');rectG(G,16,y+1,4,1,'b');rectG(G,17,y+2,2,1,'D');put(G,14,y,'O');put(G,21,y,'O');put(G,15,y+1,'O');put(G,20,y+1,'O');
      ellG(G,14,y+5,1,1,['w','w','w']);put(G,14,y+5,'k');rectG(G,13,y+8,10,1,'O')},
    chestS(G,y){rectG(G,20,y,3,2,'b');put(G,19,y+2,'O');rectG(G,14,y+8,8,1,'O')}};
  if(id==='vegeta')return{
    torso:['w','W','x'],belt:['W','W','w'],pants:['b','D','n'],boot:['w','W','x'],toe:'y',
    arm:['b','D','n'],hand:['w','W','x'],cuffLen:0,
    chest(G,y,back){rectG(G,15,y,6,1,'b');if(!back){rectG(G,13,y+6,10,1,'W');rectG(G,13,y+8,10,1,'W')}},
    chestS(G,y){rectG(G,19,y,4,1,'b');rectG(G,14,y+6,8,1,'W')},
    pads(G,y,side){if(side){srect(G,16,y-1,6,3,['y','Y','w'],true)}else{srect(G,10,y-1,5,3,['y','Y','w'],true);srect(G,21,y-1,5,3,['y','Y','w'],true)}}};
  return{ // piccolo
    torso:['p','P','u'],belt:['b','D','b'],pants:['p','P','u'],boot:['z','M','z'],baggy:1,
    arm:['g','G','j'],hand:['g','G','j'],cuff:['R','R','r'],cuffLen:2,sash:['b','D'],
    chest(G,y,back){if(!back){rectG(G,16,y,4,1,'g');rectG(G,17,y+1,2,1,'g');put(G,15,y,'P');put(G,20,y,'P')}},
    chestS(G,y){rectG(G,20,y,3,2,'g')},
    pads(G,y,side){if(side){srect(G,12,y-3,12,4,['c','C','c'],true)}else{srect(G,7,y-3,22,4,['c','C','c'],true)}}};
}
// ---------- roster: every playable hero is data (hair per form, outfit, palette) ----------
const scaleSpk=(S,k,extra)=>({cap:S.cap,sp:S.sp.map(([a,b,c,d,w])=>[a,b,a+(c-a)*k,b+(d-b)*k,w]),bang:S.bang,back:S.back,long:S.long,...(extra||{})});
SPK.trunks={cap:[18,16,9,8],sp:[[11,14,9,25,3],[13,17,12,24,2.5],[25,14,27,25,3],[23,17,24,24,2.5],[15,10,14,5,3],[21,10,22,5,3]],
  bang:[[15,16,15,21,2.5],[19,16,20,21,2.5]],back:[[12,22,12,29,3],[18,24,18,30,3],[24,22,24,29,3]]};
SPK.bob18={cap:[18,16,9,8],sp:[[10,15,9,27,3.5],[13,17,12,26,2.5],[26,15,27,27,3.5],[23,17,24,26,2.5]],
  bang:[[14,16,13,21,2.5],[17,16,17,21,2],[21,16,22,21,2.5]],back:[[12,22,12,28,3],[18,24,18,28,3],[24,22,24,28,3]]};
SPK.withBang=(S)=>({...S,bang:[...S.bang,[16,15,15,23,1.6]]});
const HAIR2={lssj:{h:'#d8f040',H:'#9ab820',l:'#f8ffc0',d:'#5a7a10',B:'#9ab820',k:'#3a3a3a'},lav:{h:'#b8a0e0',H:'#8a70b8',l:'#e8dcff',d:'#5a4a80',B:'#8a70b8'},
  blond:{h:'#f8e070',H:'#d0a840',l:'#fff8c8',d:'#9a7a20',B:'#d0a840',k:'#2a6ad8'},dark:{}};
Object.assign(HAIRC,HAIR2);
const GI={torso:['o','O','q'],belt:['b','D','n'],pants:['o','O','q'],boot:['b','D','n'],toe:'D',baggy:1,arm:['s','S','t'],hand:['s','S','t'],cuff:['b','D','n'],cuffLen:3,sash:['b','D'],
  chest:matsFor('goku').chest,chestS:matsFor('goku').chestS};
const GI_PLAIN={...GI,chest(G,y,back){if(back)return;rectG(G,15,y,6,1,'b');rectG(G,16,y+1,4,1,'b');rectG(G,17,y+2,2,1,'D');put(G,14,y,'O');put(G,21,y,'O');rectG(G,13,y+8,10,1,'O')}};
const SKIN={s:'#f6c38f',S:'#d9915f',t:'#ffe0bc',e:'#ffffff',k:'#160f1e',m:'#a0503a'};
const DARKH={d:'#0a0812',h:'#1c1a2c',H:'#34334f',l:'#4c4b70',B:'#1c1a2c'};
const ORANGEGI={o:'#f2771a',O:'#c0500c',q:'#ffa64a',b:'#2747b5',D:'#16307a',n:'#4f74e0',w:'#f4f4f4'};
const HDEF={
 goku:{name:'GOKU',rar:0,hp:120,spd:64,atk:1.0,start:'kame',desc:'Equilibrado. Empieza con Kamehameha.',
   forms:['BASE','SUPER SAIYAN','SUPER SAIYAN 2','SUPER SAIYAN 3','SSJ BLUE'],hair:[SPK.goku,SPK.gokuSSJ,SPK.gokuSSJ2,SPK.gokuSSJ3,SPK.gokuSSJ],hc:['dark','ssj','ssj','ssj3','blue'],
   mats:GI,pal:{...DARKH,...SKIN,...ORANGEGI}},
 vegeta:{name:'VEGETA',rar:0,hp:100,spd:66,atk:1.15,start:'galick',desc:'Más ataque, menos vida. Empieza con Galick Gun.',face:'V',majin:3,
   forms:['BASE','SUPER SAIYAN','SUPER VEGETA','MAJIN VEGETA','SSJ BLUE'],hair:[SPK.vegeta,SPK.vegetaSSJ,SPK.vegetaSSJ,SPK.vegetaSSJ,SPK.vegetaSSJ],hc:['dark','ssj','ssj','ssj','blue'],
   mats:matsFor('vegeta'),pal:{...HPAL.vegeta}},
 piccolo:{name:'PICCOLO',rar:0,hp:140,spd:58,atk:0.95,start:'makanko',regen:0.6,desc:'Resistente y se regenera. Empieza con Makankosappo.',head:'turban',
   forms:['BASE','FUSIÓN CON NAIL','FUSIÓN CON KAMI','PICCOLO NARANJA'],mats:matsFor('piccolo'),pal:{...HPAL.piccolo},aura:['white','white','white','orange'],
   formPal:[null,{p:'#3a2a90',P:'#24186a'},{p:'#2a2070',P:'#18124a',c:'#fff8e0'},{g:'#f08a3a',G:'#c0602a',j:'#ffb070',s:'#f08a3a',a:'#c0602a',p:'#1c1c2a',P:'#0c0c18',u:'#3a3a4a',r:'#ffd0a0'}]},
 krilin:{name:'KRILIN',rar:3,hp:105,spd:68,atk:0.95,start:'kienzan',desc:'Rápido. Empieza con Kienzan.',head:'bald',
   forms:['BASE','POTENCIAL','MAESTRO','DEFINITIVO'],mats:GI,pal:{...DARKH,...SKIN,...ORANGEGI},aura:['white','white','white','white']},
 yamcha:{name:'YAMCHA',rar:3,hp:110,spd:66,atk:1.0,start:'aura',desc:'Colmillo de lobo: aura que quema. Rápido.',
   forms:['BASE','GARRA DE LOBO','LOBO SALVAJE','LOBO DEFINITIVO'],hair:[{...SPK.goku,long:1}],hc:['dark'],mats:GI_PLAIN,pal:{...DARKH,...SKIN,...ORANGEGI,o:'#f28a2a',b:'#2a6a3a',D:'#184a24',n:'#4a8a5a'},aura:['white','white','white','white']},
 goten:{name:'GOTEN',rar:3,hp:100,spd:70,atk:1.0,start:'kame',desc:'Pequeño y muy veloz. Empieza con Kamehameha.',
   forms:['BASE','SUPER SAIYAN','SSJ ÉLITE','SSJ MÁXIMO'],hair:[scaleSpk(SPK.goku,0.85),scaleSpk(SPK.gokuSSJ,0.9)],hc:['dark','ssj','ssj','ssj'],
   mats:GI_PLAIN,pal:{...DARKH,...SKIN,...ORANGEGI,o:'#e8622a',b:'#2a4fc8'}},
 gohan:{name:'GOHAN',rar:4,hp:115,spd:64,atk:1.1,start:'kame',desc:'Poder oculto. Empieza con Kamehameha.',
   forms:['BASE','SUPER SAIYAN','SUPER SAIYAN 2','DEFINITIVO'],hair:[scaleSpk(SPK.goku,0.85),SPK.gokuSSJ,SPK.gokuSSJ2,SPK.withBang(scaleSpk(SPK.goku,0.85))],hc:['dark','ssj','ssj','dark'],
   mats:GI_PLAIN,pal:{...DARKH,...SKIN,o:'#5a3ea8',O:'#3e2a7a',q:'#7a5ec8',b:'#d8402a',D:'#a02a1a',n:'#f06a4a',w:'#f4f4f4'},aura:['gold','gold','gold','white']},
 trunks:{name:'TRUNKS',rar:4,hp:110,spd:66,atk:1.12,start:'burning',desc:'Del futuro. Empieza con Burning Attack.',
   forms:['BASE','SUPER SAIYAN','SUPER TRUNKS','SSJ IRA'],hair:[SPK.trunks,SPK.gokuSSJ,SPK.gokuSSJ2,SPK.gokuSSJ2],hc:['lav','ssj','ssj','ssj'],
   mats:{torso:['c','C','u'],belt:['v','v','v'],pants:['g','G','i'],boot:['y','Y','i'],arm:['s','S','t'],hand:['s','S','t'],cuffLen:0,
     chest(G,y,back){if(back){for(let i=0;i<8;i++)put(G,24-i,y-5+i,i<3?'z':'Z');return}rectG(G,16,y,4,10,'v');put(G,15,y+1,'C');put(G,20,y+1,'C');rectG(G,13,y+2,2,1,'y')},
     chestS(G,y){rectG(G,20,y,3,10,'v')},pads(G,y,side){if(!side){put(G,25,y-3,'z');put(G,26,y-4,'z');put(G,27,y-5,'Z')}}},
   pal:{...DARKH,...SKIN,c:'#3a5ab8',C:'#26408a',u:'#5a7ad8',v:'#1a1a22',g:'#7a7a8a',G:'#5a5a6a',i:'#9a9aaa',y:'#e8b738',Y:'#a88420',z:'#7a4a2a',Z:'#c8c8d8'}},
 a18:{name:'ANDROIDE 18',rar:4,hp:110,spd:68,atk:1.05,start:'orbs',desc:'Energía infinita. Empieza con esferas que giran.',
   forms:['BASE','MEJORADA','ILIMITADA','DEFINITIVA'],hair:[SPK.bob18],hc:['blond'],aura:['white','white','white','white'],
   mats:{torso:['c','C','u'],belt:['v','v','v'],pants:['b','D','n'],boot:['v','v','V'],arm:['s','S','t'],hand:['s','S','t'],cuffLen:3,cuff:['w','W','w'],
     chest(G,y,back){if(back)return;for(let j=0;j<8;j+=2)rectG(G,16,y+j,4,1,'w');rectG(G,16,y+1,4,1,'v');rectG(G,16,y+3,4,1,'v');rectG(G,16,y+5,4,1,'v')},
     chestS(G,y){rectG(G,20,y,3,8,'w')}},
   pal:{...SKIN,...HAIRC.blond,c:'#3a6ad8',C:'#24489a',u:'#6a9af0',v:'#1a1a22',V:'#2a2a3a',w:'#f4f4f4',W:'#c4c4d2',b:'#3a5ab8',D:'#24489a',n:'#5a7ad8'}},
 bardock:{name:'BARDOCK',rar:4,hp:125,spd:62,atk:1.1,start:'riot',desc:'Padre de Goku. Empieza con Riot Javelin.',band:1,
   forms:['BASE','SUPER SAIYAN','SUPER SAIYAN 2','SUPER SAIYAN 3'],hair:[SPK.goku,SPK.gokuSSJ,SPK.gokuSSJ2,SPK.gokuSSJ3],hc:['dark','ssj','ssj','ssj3'],
   mats:{...matsFor('vegeta'),hand:['s','S','t'],cuff:['r','R','r'],cuffLen:2},
   pal:{...HPAL.vegeta,w:'#6a8a5a',W:'#48663a',x:'#8aaa7a',y:'#3a3a2a',Y:'#22221a',b:'#1a1a24',D:'#0e0e16',n:'#3a3a4a',r:'#d8302a',R:'#901a14'}},
 broly:{name:'BROLY',rar:5,hp:160,spd:58,atk:1.25,start:'eraser',desc:'El Super Saiyan Legendario. Empieza con Eraser Cannon.',face:'V',
   forms:['BASE','SUPER SAIYAN','LEGENDARIO','LEGENDARIO MAX'],hair:[scaleSpk(SPK.vegeta,0.7),SPK.gokuSSJ2,scaleSpk(SPK.gokuSSJ2,1.15),scaleSpk(SPK.gokuSSJ2,1.25)],hc:['dark','ssj','lssj','lssj'],
   aura:['gold','gold','green','green'],
   mats:{torso:['s','S','t'],belt:['y','Y','y'],pants:['w','W','x'],boot:['E','E','F'],baggy:1,arm:['s','S','t'],hand:['s','S','t'],cuff:['y','Y','y'],cuffLen:2,sash:['r','R'],
     chest(G,y,back){if(back)return;rectG(G,14,y+3,3,1,'S');rectG(G,19,y+3,3,1,'S');put(G,18,y+5,'S');put(G,18,y+7,'S');rectG(G,15,y,6,1,'y')},chestS(G,y){rectG(G,15,y+3,4,1,'S')}},
   pal:{...DARKH,...SKIN,w:'#f4f4f4',W:'#c4c4d2',x:'#ffffff',y:'#e8b738',Y:'#a88420',E:'#1a1a24',F:'#34344a',r:'#c02a2a',R:'#801a1a'}},
 vegetto:{name:'VEGETTO',rar:5,hp:130,spd:68,atk:1.3,start:'finalkame',desc:'Fusión Potara. Empieza con Final Kamehameha.',face:'V',ear:1,
   forms:['BASE','SUPER VEGETTO','SSJ GOD','SSJ BLUE'],hair:[SPK.withBang(SPK.vegeta),SPK.withBang(SPK.vegetaSSJ)],hc:['dark','ssj','god','blue'],
   mats:{...GI_PLAIN,hand:['w','W','w'],cuffLen:0,belt:['w','W','w'],boot:['w','W','w'],toe:'y',sash:['w','W'],pants:['b','D','n'],torso:['b','D','n'],
     chest(G,y,back){if(back)return;rectG(G,15,y,6,1,'o');rectG(G,16,y+1,4,1,'o');rectG(G,17,y+2,2,1,'O')},chestS(G,y){rectG(G,20,y,3,2,'o')}},
   pal:{...DARKH,...SKIN,...ORANGEGI,b:'#28348a',D:'#181f5a',n:'#4a58b8',W:'#c4c4d2',y:'#e8b738'}},
 gogeta:{name:'GOGETA',rar:5,hp:130,spd:68,atk:1.3,start:'stardust',desc:'Fusión por danza. Empieza con Stardust Breaker.',face:'V',
   forms:['BASE','SUPER GOGETA','SSJ GOD','SSJ BLUE'],hair:[SPK.gokuSSJ2,SPK.gokuSSJ2],hc:['dark','ssj','god','blue'],
   mats:{torso:['s','S','t'],belt:['b','D','n'],pants:['w','W','x'],boot:['E','E','F'],baggy:1,arm:['s','S','t'],hand:['s','S','t'],cuff:['v','v','y'],cuffLen:2,sash:['b','D'],
     chest(G,y,back){if(back){srect(G,12,y,12,10,['v','v','V']);return}rectG(G,12,y,4,10,'v');rectG(G,20,y,4,10,'v');rectG(G,15,y,1,10,'y');rectG(G,20,y,1,10,'y')},
     chestS(G,y){rectG(G,13,y,6,10,'v');rectG(G,18,y,1,10,'y')}},
   pal:{...DARKH,...SKIN,w:'#f4f4f4',W:'#c4c4d2',x:'#ffffff',v:'#1e2240',V:'#121530',y:'#f0b030',b:'#3a6ad8',D:'#24489a',n:'#6a9af0',E:'#1a1a24',F:'#34344a'}},
};
HAIRC.dark={};
HDEF.black={...HDEF.goku,name:'GOKU BLACK',rar:5,atk:1.2,hp:110,desc:'El villano del futuro. Pega fuerte. Empieza con Kamehameha.',forms:['BASE','SUPER SAIYAN ROSÉ'],aura:['gold','red'],pal:{...HDEF.goku.pal,o:'#3a3a4a',O:'#24242e',q:'#55556a',b:'#c8202a',D:'#801018',n:'#ff5a4a'},hc:['dark','rose'],hair:[SPK.goku,SPK.gokuSSJ],ear:1};
HDEF.gohanb={...HDEF.gohan,name:'GOHAN BESTIA',rar:5,atk:1.3,hp:120,desc:'Su poder despierta con la furia. Empieza con Kamehameha.',forms:['BASE','SUPER SAIYAN 2','DEFINITIVO','BESTIA'],
  hair:[scaleSpk(SPK.goku,0.85),SPK.gokuSSJ2,SPK.withBang(scaleSpk(SPK.goku,0.85)),SPK.gokuSSJ2],hc:['dark','ssj','dark','ui'],aura:['gold','gold','white','red'],formPal:{3:{k:'#e0243a'}}};
HDEF.gokuui={...HDEF.goku,name:'GOKU UI',rar:5,atk:1.25,spd:70,hp:115,desc:'Ultra Instinto: rapidísimo. Empieza con Kamehameha.',forms:['BASE','SUPER SAIYAN','SSJ BLUE','ULTRA INSTINTO'],
  hair:[SPK.goku,SPK.gokuSSJ,SPK.gokuSSJ,SPK.goku],hc:['dark','ssj','blue','ui'],aura:['gold','gold','blue','white']};
HDEF.vegetaue={...HDEF.vegeta,name:'VEGETA EGO',rar:5,atk:1.35,hp:120,desc:'Ultra Ego: más fuerte cuanto más pelea. Empieza con Galick Gun.',forms:['BASE','SUPER SAIYAN','SSJ BLUE','ULTRA EGO'],
  hair:[SPK.vegeta,SPK.vegetaSSJ,SPK.vegetaSSJ,SPK.vegetaSSJ],hc:['dark','ssj','blue','ego'],aura:['gold','gold','blue','red'],majin:99,formPal:null};
HDEF.gohanb.npc=1; // Yamcha y Goten ya tienen sprites (3 nov.)
HDEF.yamcha.forms=['BASE'];HDEF.yamcha.start='sokidan';HDEF.yamcha.desc='Colmillo de lobo y Sōkidan teledirigido. Rápido.';
HDEF.goten.forms=['SUPER SAIYAN'];HDEF.goten.aura=['gold'];

HDEF.a17npc={...HDEF.a18,name:'ANDROIDE 17',npc:1,rar:0,hc:['dark'],pal:{...HDEF.a18.pal,...DARKH,c:'#2a2a34',C:'#1a1a22',u:'#3a3a48',w:'#f2771a',W:'#c0500c'}};
HDEF.a18npc={...HDEF.a18,npc:1,rar:0};
HDEF.bardock.forms=['BASE','SUPER SAIYAN','SUPER SAIYAN 2','SUPER SAIYAN 4'];HDEF.bardock.aura=['gold','gold','gold','red'];
HDEF.vegetto.forms=['BASE','SUPER VEGETTO','SUPER VEGETTO 2','SSJ BLUE'];
HDEF.black.forms=['BASE','SUPER SAIYAN','SUPER SAIYAN ROSÉ'];HDEF.black.aura=['gold','gold','red'];HDEF.black.hc=['dark','dark','rose'];
HDEF.gokuui.forms=[...HDEF.gokuui.forms,'UI DOMINADO'];HDEF.gokuui.aura=[...HDEF.gokuui.aura,'white'];
HDEF.gotenks={...HDEF.goten,name:'GOTENKS',rar:4,hp:115,spd:70,atk:1.15,desc:'La fusión de Goten y Trunks. Rápido y fuerte.',forms:['BASE'],npc:0};
HDEF.kefla={...HDEF.goten,name:'KEFLA',rar:5,hp:120,spd:68,atk:1.25,start:'eraser',desc:'Fusión de Kale y Caulifla. Empieza con Eraser Cannon.',forms:['SUPER SAIYAN'],aura:['green'],npc:0};
HDEF.caulifla={...HDEF.goten,name:'CAULIFLA',rar:3,hp:105,spd:70,atk:1.05,start:'galick',desc:'Saiyan del Universo 6. Muy veloz.',forms:['BASE'],npc:0};
HDEF.kale={...HDEF.goten,name:'KALE',rar:4,hp:130,spd:60,atk:1.1,start:'eraser',desc:'Su furia despierta al Berserker.',forms:['BASE','BERSERKER'],aura:['gold','green'],npc:0};
HDEF.kyabe={...HDEF.goten,name:'KYABE',rar:3,hp:110,spd:64,atk:1.0,start:'galick',desc:'Saiyan del Universo 6. Equilibrado.',forms:['SUPER SAIYAN'],aura:['gold'],npc:0};
HDEF.gohanadult={...HDEF.gohan,name:'GOHAN ADULTO',rar:4,hp:120,atk:1.15,desc:'El poder místico de Gohan. Empieza con Kamehameha.',forms:['BASE','MÍSTICO'],aura:['white','white']};
HDEF.gokugt={...HDEF.goku,name:'GOKU GT',rar:5,hp:125,atk:1.2,desc:'Super Saiyan 4. Empieza con Kamehameha.',forms:['BASE','SUPER SAIYAN 4'],aura:['gold','red']};
HDEF.vegetagt={...HDEF.vegeta,name:'VEGETA GT',rar:5,hp:110,atk:1.3,desc:'Super Saiyan 4. Empieza con Galick Gun.',forms:['BASE','SUPER SAIYAN 4'],aura:['gold','red'],majin:99};
HDEF.gokusuper={...HDEF.goku,name:'GOKU SUPER',rar:5,hp:120,atk:1.15,desc:'Kaioken y poder divino. Empieza con Kamehameha.',forms:['BASE','KAIOKEN','SSJ KAIOKEN','SSJ GOD','BLUE KAIOKEN'],aura:['white','red','gold','red','blue']};
HDEF.vegetasuper={...HDEF.vegeta,name:'VEGETA SUPER',rar:5,hp:110,atk:1.3,desc:'Orgullo divino. Empieza con Galick Gun.',forms:['BASE','SUPER SAIYAN','SSJ GOD','SSJ BLUE','BLUE FULL POWER'],aura:['gold','gold','red','blue','blue'],majin:99};
HDEF.trunkscell={...HDEF.trunks,name:'TRUNKS (CELL)',rar:3,hp:115,desc:'Trunks con armadura. Empieza con Burning Attack.',forms:['BASE']};
HDEF.roshi={...HDEF.krilin,name:'MAESTRO ROSHI',rar:3,hp:100,spd:56,atk:1.1,start:'kame',desc:'El inventor del Kamehameha.',forms:['BASE']};
// personajes añadidos desde los packs de sprites/ (animaciones en herramientas/animaciones/nuevos.json)
const NUEVOS={
 raditz:{name:'RADITZ',rar:3,hp:115,spd:64,atk:1.05,start:'galick',desc:'El hermano de Goku. Empieza con Galick Gun.',forms:['BASE','SUPER SAIYAN'],aura:['white','gold'],sig:['kiblast','punch','galick','kick','renzoku','bigbang']},
 saibaman:{name:'SAIBAMAN',rar:3,hp:90,spd:72,atk:0.95,start:'kame',desc:'Pequeño y rápido. Explota si hace falta.',forms:['BASE'],aura:['purple'],sig:['kiblast','punch','kick','scatter','finalexp']},
 a16:{name:'ANDROIDE 16',rar:4,hp:160,spd:56,atk:1.15,start:'eraser',desc:'Enorme y resistente. Empieza con su cañón.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','powerblitz','finalflash','finalexp']},
 a17:{name:'ANDROIDE 17',rar:4,hp:110,spd:70,atk:1.05,start:'orbs',desc:'Energía infinita y barrera. Muy veloz.',forms:['BASE'],aura:['blue'],sig:['kiblast','kick','punch','a18volley','powerblitz']},
 freezer:{name:'FREEZER',rar:5,hp:110,spd:66,atk:1.25,start:'kienzan',desc:'El emperador del universo. Empieza con el Disco Mortal.',forms:['1ª FORMA','3ª FORMA','FORMA FINAL','100%','GOLDEN','BLACK'],aura:['purple','purple','purple','purple','gold','purple'],sig:['kiblast','kienzan','punch','lances','kick','omega']},
 cooler:{name:'COOLER',rar:4,hp:120,spd:62,atk:1.2,start:'kienzan',desc:'El hermano de Freezer. Golpes y rayos.',forms:['FORMA FINAL'],aura:['purple'],sig:['kiblast','kienzan','punch','kick','omega']},
 janemba:{name:'JANEMBA',rar:5,hp:130,spd:62,atk:1.25,start:'makanko',desc:'El demonio del Más Allá. Espada y portales.',forms:['SUPER JANEMBA'],aura:['purple'],sig:['kiblast','kiblade','punch','kick','hellzone']},
 cell:{name:'CELL',rar:5,hp:125,spd:62,atk:1.2,start:'kame',desc:'El androide perfecto. Absorbe y crece.',forms:['IMPERFECTO','SEMIPERFECTO','PERFECTO','GOLDEN','MAJIN'],aura:['gold','gold','gold','gold','gold'],sig:['kiblast','punch','kame','kienzan','kick','finalexp']},
 buu:{name:'MAJIN BUU',rar:5,hp:150,spd:60,atk:1.15,start:'donut',desc:'Se regenera sin parar. Cinco formas.',regen:0.5,forms:['GORDO','MALIGNO','SUPER BUU','BUU GOHAN','KID BUU'],aura:['purple','purple','purple','purple','purple'],sig:['kiblast','punch','kick','renzoku','finalexp','roar']},
 turles:{name:'TURLES',rar:4,hp:120,spd:64,atk:1.15,start:'galick',desc:'El Saiyan del Árbol Sagrado.',forms:['BASE','SSJ MALIGNO'],aura:['purple','red'],sig:['kiblast','punch','renzoku','kick','bigbang','finalflash']},
 bills:{name:'BILLS',rar:5,hp:130,spd:66,atk:1.35,start:'bigbang',desc:'El Dios de la Destrucción. Empieza con Big Bang.',forms:['DIOS DESTRUCTOR'],aura:['purple'],sig:['kiblast','punch','kick','renzoku','hakai']},
 frost:{name:'FROST',rar:3,hp:110,spd:64,atk:1.1,start:'kienzan',desc:'El tramposo del Universo 6.',forms:['1ª FORMA','FORMA FINAL'],aura:['purple','purple'],sig:['kiblast','punch','lances','kick','kienzan']},
 hit:{name:'HIT',rar:5,hp:115,spd:70,atk:1.3,start:'kienzan',desc:'El asesino legendario. Salta en el tiempo.',forms:['BASE'],aura:['purple'],sig:['kiblast','punch','kick','instant','silver']},
 zamasu:{name:'ZAMASU',rar:5,hp:120,spd:64,atk:1.25,start:'makanko',desc:'El Kaioshin que odia a los mortales.',forms:['BASE','FUSIONADO'],aura:['white','purple'],sig:['kiblast','kiblade','punch','lances','kick','scythe']},
 jiren:{name:'JIREN',rar:5,hp:150,spd:62,atk:1.35,start:'eraser',desc:'El más fuerte del Universo 11.',forms:['BASE','MÁXIMO PODER','HAKAISHIN'],aura:['red','red','purple'],sig:['kiblast','punch','kick','powerblitz','roar','omega']},
 toppo:{name:'TOPPO',rar:4,hp:150,spd:56,atk:1.2,start:'eraser',desc:'Líder de las Tropas del Orgullo.',forms:['BASE'],aura:['red'],sig:['kiblast','punch','kick','powerblitz','hakai']},
 moro:{name:'MORO',rar:5,hp:130,spd:62,atk:1.25,start:'orbs',desc:'El devorador de planetas.',forms:['ULTRA INSTINTO'],aura:['white'],sig:['kiblast','punch','kick','finalexp','omega']},
 babyvegeta:{name:'BABY VEGETA',rar:5,hp:120,spd:66,atk:1.3,start:'galick',desc:'El parásito Tsufur en el cuerpo de Vegeta.',forms:['SUPER BABY'],aura:['gold'],sig:['kiblast','punch','galick','kick','finalshine','bigbang']},
 bra:{name:'BRA',rar:3,hp:105,spd:70,atk:1.05,start:'masenko',desc:'La hija de Vegeta, del Multiverso.',forms:['BASE','SUPER SAIYAN'],aura:['white','gold'],sig:['kiblast','punch','kick','masenko','renzoku']},
 gohandbs:{name:'GOHAN DBS',rar:5,hp:120,spd:66,atk:1.25,start:'masenko',desc:'Gohan de Super, del Torneo del Poder a la saga de Granolah.',forms:['BASE','MÍSTICO','ULTRA INSTINTO','MUI','BESTIA'],aura:['white','white','silver','silver','purple'],sig:['kiblast','punch','kick','masenko','kame','gekiretsu']},
 gohanposeido:{name:'GOHAN POSEÍDO',rar:3,hp:105,spd:66,atk:1.1,start:'masenko',desc:'Gohan controlado por una fuerza oscura.',forms:['POSEÍDO'],aura:['purple'],sig:['kiblast','punch','kick','masenko']},
 gohanmanga:{name:'GOHAN MANGA',rar:4,hp:115,spd:66,atk:1.15,start:'masenko',desc:'Gohan en la saga de Moro del manga.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','masenko','kame']},
 bardockalt:{name:'BARDOCK LEYENDAS',rar:5,hp:125,spd:64,atk:1.2,start:'riot',desc:'Bardock en sus versiones de fans.',forms:['BASE','SUPER SAIYAN','BLACK','EVOLUCIÓN'],aura:['white','gold','red','gold'],sig:['kiblast','punch','kick','riot','finalshine']},
 cumber:{name:'CUMBER',rar:5,hp:140,spd:60,atk:1.3,start:'eraser',desc:'El Saiyan del mal de Heroes.',forms:['BASE'],aura:['purple'],sig:['kiblast','punch','kick','eraser','roar']},
 dlrx:{name:'DLRX',rar:4,hp:115,spd:68,atk:1.15,start:'kame',desc:'Saiyan creado por fans.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 zombies:{name:'SAIYANS ZOMBI',rar:3,hp:120,spd:58,atk:1.1,start:'kame',desc:'Gohan, Goku y Vegeta convertidos en zombis.',forms:['GOHAN','GOKU','VEGETA'],aura:['green','green','green'],sig:['kiblast','punch','kick','kame','galick']},
 brolyfan:{name:'BROLY FANMADE',rar:5,hp:150,spd:58,atk:1.3,start:'eraser',desc:'Broly en formas inventadas por fans.',forms:['SSJ FALSO','SUPER SAIYAN 3'],aura:['green','gold'],sig:['kiblast','punch','kick','eraser','omega']},
 gogetafan:{name:'GOGETA FANMADE',rar:5,hp:135,spd:70,atk:1.35,start:'stardust',desc:'Gogeta en formas de fans.',forms:['BLUE EVOLUTION','SSJ4 BLUE','MUI'],aura:['blue','blue','silver'],sig:['kiblast','punch','kick','bbkame','stardust']},
 vegettofan:{name:'VEGETTO FANMADE',rar:5,hp:135,spd:70,atk:1.35,start:'kame',desc:'Vegetto en formas de fans.',forms:['SSJ DIOS','DIOS KAIOKEN','SUPER SAIYAN 4','MUI'],aura:['red','red','red','silver'],sig:['kiblast','punch','kick','kame','finalflash','kiblade']},
 gokuxeno:{name:'GOKU XENO',rar:5,hp:125,spd:68,atk:1.3,start:'kame',desc:'El Goku de la Patrulla del Tiempo.',forms:['BASE','SSJ DIOS','SUPER SAIYAN 4'],aura:['white','red','red'],sig:['kiblast','punch','kick','kame','instant','genki']},
 gokumoro:{name:'GOKU SAGA MORO',rar:5,hp:125,spd:68,atk:1.3,start:'kame',desc:'Goku con la ropa rota en la lucha contra Moro.',forms:['BASE','SUPER SAIYAN','SSJ DIOS','SSJ BLUE','ULTRA INSTINTO','MUI'],aura:['white','gold','red','blue','silver','silver'],sig:['kiblast','punch','kick','kame','instant','silver']},
 gokubroly:{name:'GOKU PELÍCULA BROLY',rar:5,hp:125,spd:68,atk:1.3,start:'kame',desc:'Goku frente a Broly: de base a Super Saiyan Blue perfecto.',forms:['BASE','SUPER SAIYAN','SSJ DIOS','SSJ BLUE PERFECTO'],aura:['white','gold','red','blue'],sig:['kiblast','punch','kick','kame','instant','genki']},
 vegetamanga:{name:'VEGETA BLUE MANGA',rar:5,hp:130,spd:66,atk:1.3,start:'galick',desc:'Vegeta con el traje dañado y el Blue perfeccionado del manga.',forms:['SSJ BLUE','SSJ BLUE PERFECTO'],aura:['blue','blue'],sig:['kiblast','punch','kick','galick','finalflash','bigbang']},
 vegetabroly:{name:'VEGETA DIOS · BROLY',rar:5,hp:130,spd:66,atk:1.25,start:'galick',desc:'Super Saiyan Dios durante el combate contra Broly.',forms:['SSJ DIOS'],aura:['red'],sig:['kiblast','punch','kick','galick','finalflash','bigbang']},
 blacktime:{name:'BLACK TIME BREAKER',rar:5,hp:120,spd:68,atk:1.3,start:'blackkame',desc:'El Goku Black enmascarado de Heroes.',forms:['SSJ DIOS','SSJ ROSÉ','SSJ ROSÉ 3'],aura:['red','purple','purple'],sig:['kiblast','punch','kick','blackkame','kiblade','scythe']},
 blackfan:{name:'GOKU BLACK FANMADE',rar:5,hp:120,spd:68,atk:1.3,start:'blackkame',desc:'Goku Black en formas alternativas creadas por fans.',forms:['SSJ RAGE','ROSÉ KAIOKEN','ROSÉ ULTRA INSTINTO','MUI'],aura:['gold','red','purple','silver'],sig:['kiblast','punch','kick','blackkame','kiblade','scythe']},
 gokualt:{name:'GOKU ALTERNATIVO',rar:5,hp:130,spd:66,atk:1.3,start:'kame',desc:'Tres versiones de Goku creadas por fans: Místico, Ikari y Bestia.',forms:['MÍSTICO','IKARI','BESTIA'],aura:['white','green','purple'],sig:['kiblast','punch','kick','kame','instant','genki']},
 // hojas de DeviantArt (sesión 10; animaciones en herramientas/animaciones/deviantart.json, créditos en PACK_CREDITS)
 nappa:{name:'NAPPA',rar:3,hp:150,spd:58,atk:1.15,start:'breakcannon',desc:'El gigante de élite Saiyan. Break Cannon y Bomber DX.',forms:['BASE'],aura:['gold'],sig:['kiblast','punch','breakcannon','kick','bomberdx']},
 ginyu:{name:'CAPITÁN GINYU',rar:4,hp:125,spd:62,atk:1.15,start:'milky',desc:'Líder de las Fuerzas Especiales. Cambia de cuerpo con su rival.',forms:['BASE'],aura:['purple'],sig:['kiblast','punch','kick','milky','bodychange']},
 jeice:{name:'JEICE',rar:3,hp:105,spd:70,atk:1.05,start:'burning',desc:'El veloz de las Fuerzas Especiales. Lanza la Crusher Ball.',forms:['BASE'],aura:['red'],sig:['kiblast','punch','kick','crusherball','renzoku']},
 guldo:{name:'GULDO',rar:3,hp:95,spd:58,atk:1.0,start:'kienzan',desc:'Detiene el tiempo y lanza rocas con la mente.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','psychorock','timefreeze']},
 uub:{name:'UUB',rar:4,hp:120,spd:68,atk:1.15,start:'kame',desc:'La reencarnación de Kid Buu y alumno de Goku.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kiai','kame','renzoku']},
 mrsatan:{name:'MR. SATÁN',rar:3,hp:130,spd:60,atk:0.95,start:'megaton',desc:'El campeón del mundo. Sin ki: puñetazos, patadas y regalos explosivos.',forms:['BASE'],aura:['white'],sig:['punch','kick','megaton','dynamite','presentbomb']},
 a21:{name:'ANDROIDE 21',rar:5,hp:125,spd:66,atk:1.25,start:'photonwave',desc:'La androide con hambre de Majin. Convierte a sus rivales en dulces.',forms:['MAJIN'],aura:['purple'],sig:['kiblast','punch','kick','choco','photonwave','fullcourse']},
 // «todos los personajes» (2 nov.): un pack completo = un personaje propio; animaciones en herramientas/animaciones/todos.json
 granola:{name:'GRANOLA',rar:4,hp:115,spd:68,atk:1.2,start:'granolasnipe',desc:'El último cerealiano: francotirador con el ojo derecho y el deseo de ser el más fuerte.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 gas:{name:'GAS',rar:4,hp:140,spd:64,atk:1.2,start:'gasring',desc:'El más fuerte de los Heeters tras pedir su deseo a las esferas de Cereal.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 omega:{name:'OMEGA SHENRON',rar:5,hp:150,spd:60,atk:1.3,start:'minusball',desc:'El dragón oscuro de una estrella: Bola de Energía Negativa y Minus Energy Power Ball.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 super17:{name:'SUPER 17',rar:4,hp:135,spd:62,atk:1.15,start:'hellstorm',desc:'Fusión de los dos Androides 17: absorbe el ki y lanza la Tormenta Infernal.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 pangt:{name:'PAN GT',rar:3,hp:100,spd:70,atk:1.0,start:'masenko',desc:'La nieta de Goku en la saga GT: rápida, valiente y con Giru siempre cerca.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 slug:{name:'LORD SLUG',rar:4,hp:130,spd:62,atk:1.15,start:'slugball',desc:'Namekiano demoníaco de la película: crece, estira el brazo y lanza bolas de ki.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 tarble:{name:'TARBLE',rar:3,hp:105,spd:68,atk:1.05,start:'galick',desc:'El hermano pequeño de Vegeta: Super Saiyan tranquilo que pelea si hace falta.',forms:['SUPER SAIYAN'],aura:['gold'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 reycold:{name:'REY COLD',rar:4,hp:135,spd:60,atk:1.2,start:'deathbeam',desc:'El padre de Freezer y Cooler; enorme, cruel y con un cañón de ki en la mano.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 cui:{name:'CUI',rar:3,hp:105,spd:66,atk:0.95,start:'cuiblast',desc:'Rival de Vegeta en el ejército de Freezer; rápido y presumido.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 kibitoshin:{name:'KIBITOSHIN',rar:4,hp:120,spd:67,atk:1.12,start:'kaikai',desc:'Fusión de Shin y Kibito con los pendientes Pothala; se teletransporta y cura.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 shin:{name:'SUPREMO KAIOSHIN',rar:4,hp:115,spd:67,atk:1.1,start:'kaishot',desc:'El dios de la creación del Universo 7: ráfagas de ki rosa y poderes divinos.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 videl:{name:'VIDEL',rar:3,hp:100,spd:66,atk:0.95,start:'videlkick',desc:'Hija de Mr. Satán y justiciera de Satan City; vuela y pelea a patadas.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 gokunino:{name:'GOKU NIÑO',rar:3,hp:110,spd:66,atk:1.0,start:'jankenpon',desc:'El niño de la cola de mono: Nyoibo, nube Kinton y su Jan Ken.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 trunksnino:{name:'TRUNKS NIÑO',rar:3,hp:105,spd:70,atk:1.1,start:'burningatk',desc:'El hijo de Vegeta y Bulma: travieso, rápido y Super Saiyan desde pequeño.',forms:['BASE','SUPER SAIYAN'],aura:['white','gold'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 tenshinhan:{name:'TENSHINHAN',rar:3,hp:120,spd:66,atk:1.1,start:'kikoho',desc:'Tres ojos y cuatro brazos si hace falta: Kikoho, Taiyoken y Dodonpa.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kick','kame','renzoku']},
 taopaipai:{name:'TAO PAI PAI',rar:3,hp:115,spd:64,atk:1.0,start:'dodonpa',desc:'El asesino más famoso del mundo; dispara el Dodonpa con el dedo.',forms:['BASE'],aura:['white'],sig:['kiblast','taopunch','kick','dodonpa','renzoku']},
 roshi:{name:'MAESTRO ROSHI',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'El maestro de la tortuga; inventó el Kamehameha y aún puede hinchar los músculos.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','mafuba','kick']},
 gokureymono:{name:'GOKU REY MONO',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku Rey Mono en Super Saiyan, de DB Tale (fanmade).',forms:['SSJ REY MONO'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 vegetamui:{name:'VEGETA UI DOMINADO',rar:5,hp:115,spd:72,atk:1.45,start:'galick',desc:'Vegeta con el Ultra Instinto dominado, versión fanmade.',forms:['UI DOMINADO'],aura:['white'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegitoblue254:{name:'VEGETTO BLUE',rar:5,hp:130,spd:70,atk:1.35,start:'finalkame',desc:'Vegetto en Super Saiyan Blue, la fusión con los Pendientes Pothala.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','finalkame','spiritsword','bigbang','kick']},
 bramajin:{name:'BRA MAJIN SSJ',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Bra adulta poseída por Babidi en Super Saiyan, de Dragon Ball Multiverse (fanmade).',forms:['SSJ MAJIN'],aura:['gold'],sig:['kiblast','punch','kick','kame','renzoku']},
 zamasufusion:{name:'ZAMASU FUSIONADO (DESHACIÉNDOSE)',rar:5,hp:130,spd:72,atk:1.4,start:'blackkame',desc:'Zamasu fusionado mientras su cuerpo inmortal se deshace.',forms:['FUSIÓN'],aura:['purple'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 gokussj4daima:{name:'GOKU SSJ4 (DAIMA)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan 4, versión de Dragon Ball Daima.',forms:['SSJ4'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 blackrose290:{name:'BLACK ROSÉ (HD)',rar:5,hp:125,spd:69,atk:1.3,start:'blackkame',desc:'Goku Black en Super Saiyan Rosé, megapack de sprites HD.',forms:['SSJ ROSÉ'],aura:['purple'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 gokussjfp:{name:'GOKU SSJ FULL POWER',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Goku en Super Saiyan a pleno poder, sprite HD de estilo SWL.',forms:['SSJ FULL POWER'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussj053:{name:'GOKU SSJ (CLÁSICO)',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Goku en Super Saiyan, sprite clásico de Dragon Ball Z.',forms:['SSJ'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 goku045:{name:'GOKU (CLÁSICO 2)',rar:3,hp:115,spd:64,atk:1.0,start:'kame',desc:'Goku en estado base, segunda versión del sprite clásico.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 goku044:{name:'GOKU (CLÁSICO)',rar:3,hp:115,spd:64,atk:1.0,start:'kame',desc:'Goku en estado base, sprite clásico de Dragon Ball Z.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussjkaioken2:{name:'GOKU SSJ KAIOKEN (HALO)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en el Más Allá, con halo, combinando Super Saiyan y Kaioken.',forms:['SSJ KAIOKEN'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussjlegend:{name:'GOKU SSJ LEGENDARIO',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con el poder del Super Saiyan Legendario, versión fanmade.',forms:['SSJ LEGENDARIO'],aura:['green'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokudiosberserk:{name:'GOKU DIOS BERSERKER',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku Super Saiyan Dios desatado con aura oscura, versión fanmade.',forms:['DIOS BERSERKER'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussj4dios:{name:'GOKU SSJ4 DIOS',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku en Super Saiyan 4 con el poder de un dios, versión fanmade.',forms:['SSJ4 DIOS'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussjsupremo:{name:'GOKU SSJ SUPREMO',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en un Super Saiyan supremo con chispas, versión fanmade.',forms:['SSJ SUPREMO'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuultradios:{name:'GOKU ULTRA SSJ DIOS',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku en una forma Super Saiyan Dios potenciada, versión fanmade.',forms:['ULTRA SSJ DIOS'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuidios:{name:'GOKU UI DIOS',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku combinando el Ultra Instinto con el Super Saiyan Dios, versión fanmade.',forms:['UI DIOS'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuiblue:{name:'GOKU UI BLUE',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku combinando el Ultra Instinto con el Super Saiyan Blue, versión fanmade.',forms:['UI BLUE'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuiblueevo:{name:'GOKU UI BLUE EVOLUTION',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku fusionando el Ultra Instinto con el Blue Evolución, versión fanmade.',forms:['UI BLUE EVOLUTION'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuevilssj2:{name:'GOKU MALIGNO SSJ2',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku poseído en Super Saiyan 2 de pelo rojo, versión fanmade.',forms:['SSJ2 MALIGNO'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussjkaioken:{name:'GOKU SSJ KAIOKEN',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku combinando el Super Saiyan con el Kaioken.',forms:['SSJ KAIOKEN'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussj2buu:{name:'GOKU SSJ2 (BUU)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan 2, saga de Majin Buu, sprite HD de estilo SWL.',forms:['SSJ2'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuuimanga:{name:'GOKU UI SEÑAL (MANGA)',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con la señal del Ultra Instinto, versión del manga.',forms:['UI SEÑAL'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuimanga:{name:'GOKU UI DOMINADO (MANGA)',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con el Ultra Instinto dominado, manga del Torneo del Poder.',forms:['UI DOMINADO'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokubluedbfz:{name:'GOKU BLUE (FIGHTERZ)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan Blue, estilo Dragon Ball FighterZ.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokubluemoro:{name:'GOKU BLUE (MORO)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan Blue, manga de la saga de Moro.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuuiverdadero:{name:'GOKU UI VERDADERO',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con el Ultra Instinto a su manera, manga de Granola.',forms:['UI VERDADERO'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuigranola:{name:'GOKU UI (GRANOLA)',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con el Ultra Instinto dominado, saga de Granola.',forms:['UI DOMINADO'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussjchaqueta:{name:'GOKU SSJ CHAQUETA',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Goku en Super Saiyan con su chaqueta naranja, saga de Super Hero.',forms:['SSJ'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokupatrulla:{name:'GOKU PATRULLERO',rar:3,hp:115,spd:64,atk:1.0,start:'kame',desc:'Goku con el uniforme de la Patrulla Galáctica, saga de Moro.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokumuifp:{name:'GOKU UI DOMINADO',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con el Ultra Instinto dominado a pleno poder, Torneo del Poder.',forms:['UI DOMINADO'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuuisign:{name:'GOKU UI SEÑAL',rar:5,hp:130,spd:70,atk:1.35,start:'kame',desc:'Goku con la señal del Ultra Instinto, Torneo del Poder.',forms:['UI SEÑAL'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokubluewhis:{name:'GOKU BLUE (WHIS)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan Blue con su gi, saga de Freezer resucitado.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussj3swl:{name:'GOKU SSJ3 (HD)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan 3, sprite HD de estilo SWL.',forms:['SSJ3'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokussj3mais:{name:'GOKU SSJ3 (CLÁSICO)',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan 3, saga de Majin Buu, sprite clásico.',forms:['SSJ3'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 vegetabluemal:{name:'VEGETA BLUE MALIGNO',rar:5,hp:110,spd:69,atk:1.35,start:'galick',desc:'Vegeta Blue con aura oscura, versión maligna de Dragon Ball Heroes.',forms:['BLUE MALIGNO'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetauihd:{name:'VEGETA ULTRA INSTINTO',rar:5,hp:115,spd:72,atk:1.45,start:'galick',desc:'Vegeta con el Ultra Instinto, versión fanmade en HD.',forms:['ULTRA INSTINTO'],aura:['white'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetassjhd:{name:'VEGETA SSJ (HD)',rar:4,hp:105,spd:68,atk:1.22,start:'galick',desc:'Vegeta en Super Saiyan, sprite HD de estilo ULSW.',forms:['SSJ'],aura:['gold'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetaxeno:{name:'VEGETA XENO',rar:3,hp:100,spd:66,atk:1.1,start:'galick',desc:'Vegeta Xeno, patrullero del tiempo de Dragon Ball Heroes.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetaego:{name:'VEGETA ULTRA EGO',rar:5,hp:115,spd:72,atk:1.45,start:'galick',desc:'Vegeta con el Ultra Ego, poder de destrucción de la saga de Granola.',forms:['ULTRA EGO'],aura:['purple'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetabaseulsw:{name:'VEGETA (HD)',rar:3,hp:100,spd:66,atk:1.1,start:'galick',desc:'Vegeta en estado base, sprite HD de estilo ULSW.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetablueevo:{name:'VEGETA BLUE EVOLUTION',rar:5,hp:115,spd:72,atk:1.45,start:'galick',desc:'Vegeta en Super Saiyan Blue Evolución, Torneo del Poder.',forms:['BLUE EVOLUTION'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetabluefp:{name:'VEGETA BLUE FULL POWER',rar:5,hp:115,spd:72,atk:1.45,start:'galick',desc:'Vegeta en Super Saiyan Blue al máximo, Torneo del Poder.',forms:['BLUE FULL POWER'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetablueulsw:{name:'VEGETA BLUE (HD)',rar:5,hp:110,spd:69,atk:1.35,start:'galick',desc:'Vegeta en Super Saiyan Blue, sprite HD de estilo ULSW.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetablue092:{name:'VEGETA BLUE (SUPER)',rar:5,hp:110,spd:69,atk:1.35,start:'galick',desc:'Vegeta en Super Saiyan Blue, sprite clásico de Super.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetabluewhis:{name:'VEGETA BLUE (WHIS)',rar:5,hp:110,spd:69,atk:1.35,start:'galick',desc:'Vegeta en Super Saiyan Blue, saga de Freezer resucitado.',forms:['SSJ BLUE'],aura:['blue'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetassjwhis:{name:'VEGETA SSJ (WHIS)',rar:4,hp:105,spd:68,atk:1.22,start:'galick',desc:'Vegeta en Super Saiyan con la armadura de la saga de Freezer resucitado.',forms:['SUPER SAIYAN'],aura:['gold'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 vegetassj4gt:{name:'VEGETA SSJ4 GT',rar:5,hp:110,spd:69,atk:1.35,start:'galick',desc:'Vegeta en Super Saiyan 4, de Dragon Ball GT.',forms:['SUPER SAIYAN 4'],aura:['red'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 gokussj4gt:{name:'GOKU SSJ4 GT',rar:5,hp:125,spd:67,atk:1.25,start:'kame',desc:'Goku en Super Saiyan 4, de Dragon Ball GT.',forms:['SUPER SAIYAN 4'],aura:['red'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 vegetayardrat:{name:'VEGETA YARDRAT',rar:3,hp:100,spd:66,atk:1.1,start:'galick',desc:'Vegeta con la ropa de Yardrat.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','galick','bigbang','finalflash','finalexp']},
 gokuyardratswl:{name:'GOKU YARDRAT SSJ SWL',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Goku de Yardrat en Super Saiyan, otro estilo de sprite.',forms:['SUPER SAIYAN'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuyardratssj:{name:'GOKU YARDRAT SSJ',rar:4,hp:120,spd:66,atk:1.12,start:'kame',desc:'Goku de Yardrat en Super Saiyan.',forms:['SUPER SAIYAN'],aura:['gold'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 gokuyardrat:{name:'GOKU YARDRAT',rar:3,hp:115,spd:64,atk:1.0,start:'kame',desc:'Goku con la ropa de Yardrat, tras Namek.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','kame','kaioken','instant','genki']},
 blackmajin:{name:'MAJIN BLACK DIOS',rar:5,hp:125,spd:69,atk:1.3,start:'blackkame',desc:'Goku Black Majin en Super Saiyan Dios, de los fans.',forms:['SSJ DIOS'],aura:['red'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 blackrosen:{name:'BLACK ROSÉ EVOLUTION',rar:5,hp:125,spd:69,atk:1.3,start:'blackkame',desc:'Goku Black Rosé evolucionado, de los fans.',forms:['ROSÉ EVOLUTION'],aura:['purple'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 blackfalso:{name:'GOKU BLACK SSJ FALSO',rar:4,hp:120,spd:68,atk:1.17,start:'blackkame',desc:'Goku Black en Super Saiyan falso, de los fans.',forms:['SSJ FALSO'],aura:['gold'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 blackkaioshin:{name:'GOKU BLACK KAIOSHIN',rar:3,hp:115,spd:66,atk:1.05,start:'blackkame',desc:'Goku Black con el traje de Kaioshin.',forms:['BASE'],aura:['purple'],sig:['kiblast','kiblade','blackkame','lances','scythe','kick']},
 jirengray:{name:'JIREN (TORNEO)',rar:5,hp:150,spd:62,atk:1.35,start:'eraser',desc:'Jiren del Torneo del Poder, otro estilo de sprite.',forms:['BASE'],aura:['red'],sig:['kiblast','jirenrush','powerimpact','kick','roar','omega']},
 vegettofalso:{name:'VEGETTO SSJ FALSO',rar:5,hp:130,spd:68,atk:1.3,start:'finalkame',desc:'Vegetto en su forma de Super Saiyan falso.',forms:['SSJ FALSO'],aura:['gold'],sig:['kiblast','punch','finalkame','spiritsword','bigbang','kick']},
 trunksarmor:{name:'TRUNKS ARMADURA',rar:4,hp:110,spd:66,atk:1.12,start:'burning',desc:'Trunks del futuro con la armadura Saiyan.',forms:['BASE'],aura:['white'],sig:['kiblast','punch','burning','kick','finishbuster','renzoku']},
};
// formas añadidas a personajes que ya estaban
Object.assign(HDEF.gokugt,{forms:['BASE','SUPER SAIYAN','SUPER SAIYAN 3','SUPER SAIYAN 4'],aura:['white','gold','gold','red']});
Object.assign(HDEF.vegetagt,{forms:['BASE','SUPER SAIYAN','SUPER SAIYAN 4'],aura:['white','gold','red']});
Object.assign(HDEF.piccolo,{forms:['BASE','PICCOLO NARANJA'],aura:['white','orange']});
Object.assign(HDEF.kefla,{forms:['SUPER SAIYAN','SSJ BLUE'],aura:['green','blue']});
Object.assign(HDEF.broly,{forms:['CONTENIDO','SUPER SAIYAN','LEGENDARIO','SUPER SAIYAN 4'],aura:['gold','gold','green','red']});
Object.assign(HDEF.gohanadult,{forms:['BASE','MÍSTICO','BESTIA'],aura:['white','white','purple']});
Object.assign(HDEF.trunkscell,{forms:['BASE','SUPER SAIYAN','ULTRA SSJ'],aura:['white','gold','gold']});
Object.assign(HDEF.trunks,{forms:['BASE','SUPER SAIYAN','SSJ2 MANGA'],aura:['white','gold','gold']});
Object.assign(HDEF.gogeta,{forms:['SUPER GOGETA','SUPER SAIYAN 4','SSJ BLUE'],aura:['gold','red','blue']});
for(const id in NUEVOS){const N=NUEVOS[id];HDEF[id]={...HDEF.goku,...N};delete HDEF[id].sig}
const HEROES=HDEF;
function heroPal(id,form){const D=HDEF[id],p={...D.pal};
  if(D.hc){const k=D.hc[Math.min(form,D.hc.length-1)];if(k&&k!=='dark'){Object.assign(p,HAIRC[k]);if(!HAIRC[k].k)p.k=k==='blue'?'#1a6ab8':k==='god'?'#a01a30':'#13786f'}}
  if(D.formPal&&D.formPal[form])Object.assign(p,D.formPal[form]);
  return p}
function heroAura(id,form){const D=HDEF[id];if(D.aura)return D.aura[Math.min(form,D.aura.length-1)];
  const k=D.hc?D.hc[Math.min(form,D.hc.length-1)]:'ssj';return k==='god'?'red':k==='blue'?'blue':k==='lssj'?'green':'gold'}

const HCACHE={};
function heroFrames(id,form){const key=id+form;if(HCACHE[key])return HCACHE[key];
  if(HDEF[id].custom){const m=MYC['h:'+id+':0'],fr={c:m.c,f:m.f,w:m.w,wf:m.wf},wk=autoWalk(m.c).map(c=>({c,f:flipC(c),w:m.w,wf:m.wf})),out={};
    for(const dir of ['down','up','side']){out[dir+'idle']=[fr,fr];out[dir+'walk']=wk}out.cast=[fr,fr];out.hurt=[fr];return HCACHE[key]=out}
  const pal=heroPal(id,form),out={};
  const mkF=(dir,pose,f)=>{const c=gridCanvas(paintHero(id,form,dir,pose,f).map(r=>r.join('')),pal);return{c,f:flipC(c),w:tintC(c,'#ffffff'),wf:null}};
  for(const dir of ['down','up','side']){out[dir+'idle']=[0,1].map(f=>mkF(dir,'idle',f));out[dir+'walk']=[0,1,2,3].map(f=>mkF(dir,'walk',f))}
  out.cast=[0,1].map(f=>mkF('side','cast',f));out.hurt=[mkF('down','hurt',0)];
  for(const k in out)for(const fr of out[k])fr.wf=flipC(fr.w);
  return HCACHE[key]=out}
// keep the old API for places that only need a portrait frame
function heroSprite(id,form){const F=heroFrames(id,form);return{fr:[F.downidle[0].c,F.downwalk[1].c,F.downidle[1].c,F.downwalk[3].c],w:HW+2,h:HH+2}}

// ---------- villain sprites v3: same painter, front view, 4-frame walk ----------
const spikeTri=(G,bx,by,tx,ty,w,m)=>{const dx=tx-bx,dy=ty-by,l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w;triFill(G,tx,ty,bx-nx,by-ny,bx+nx,by+ny,m[0],m[1],m[2])};
function paintVillain(V,f){
  const G=blankG();let bob=f%2,lL=f===1?2:0,lR=f===3?2:0,aL=f===1?-1:f===3?1:0,aR=-aL;
  const tw=V.tw||12,tx=18-tw/2,tY=(V.tY||29)+bob,hY=bob;
  V.behind&&V.behind(G,tY,hY,f);
  // legs
  const lw=V.lw||6,legTop=tY+(V.th||10)+2-bob;
  const leg=(x,lift,right)=>{const bot=51-lift;for(let y=legTop;y<=bot;y++){const boot=y>bot-(V.bootH||4);hrow(G,x,y,lw,boot?V.boot:V.pants)}
    if(V.shin)rectG(G,x+1,bot-6,lw-2,3,V.shin)};
  leg(18-lw-(V.gap||0),lL,false);leg(18+(V.gap||0),lR,true);
  // torso
  srect(G,tx,tY,tw,V.th||10,V.torso,true);V.chest&&V.chest(G,tY,tx,tw);
  if(V.belt)srect(G,tx,tY+(V.th||10),tw,2,V.belt);
  // arms
  const aw=V.aw||4,al=V.al||9;
  const arm=(x,y)=>{for(let j=0;j<al;j++){const m=j>=al-(V.cuffLen||0)?V.cuff:V.arm;hrow(G,x,y+j,aw,j===0?[m[0],m[1],m[0]]:m)}srect(G,x,y+al,aw,3,V.hand)};
  arm(tx-aw,tY+1+aL);arm(tx+tw,tY+1+aR);
  V.pads&&V.pads(G,tY,tx,tw);
  V.head(G,hY,tY);
  return G}
const VDEF={
 dodoria:{tw:18,th:11,lw:7,gap:1,aw:5,al:8,tY:27,
   torso:['w','W','x'],belt:['d','d','D'],pants:['d','d','D'],boot:['v','V','v'],arm:['p','P','q'],hand:['p','P','q'],
   chest(G,y,x,w){rectG(G,x+3,y+6,w-6,4,'y');rectG(G,x+3,y+6,w-6,1,'Y');for(let i=0;i<3;i++)rectG(G,x+4,y+7+i,w-8,1,i%2?'Y':'y')},
   pads(G,y,x,w){srect(G,x-6,y-3,9,5,['y','Y','z'],true);srect(G,x+w-3,y-3,9,5,['y','Y','z'],true)},
   head(G,h){ellG(G,18,19+h,9,8,['p','P','q']);for(const [a,b,c,d] of [[12,13,9,9],[16,11,15,6],[20,11,21,6],[24,13,27,9],[10,18,6,16],[26,18,30,16]])spikeTri(G,a,b+h,c,d+h,1.6,['s','S','s']);
     stampG(G,["kk.......cc","ek.....ccce","........cc.","...........","....nnnn...","...nNNNNn.."],12,18+h)}},
 zarbon:{torso:['w','W','x'],belt:['y','Y','y'],pants:['d','d','D'],boot:['w','W','x'],arm:['s','S','t'],hand:['s','S','t'],cuff:['y','Y','y'],cuffLen:2,
   behind(G,y){srect(G,9,y,18,20,['c','C','c'])},
   chest(G,y,x,w){rectG(G,x,y+7,w,1,'W')},
   pads(G,y,x,w){srect(G,x-3,y-2,6,4,['y','Y','w'],true);srect(G,x+w-3,y-2,6,4,['y','Y','w'],true)},
   head(G,h){stampG(G,FACE_F,12,18+h);ellG(G,18,16+h,8,6,['h','H','l'],(x,y)=>y>19+h&&x>12&&x<23);rectG(G,13,15+h,10,2,'y');put(G,18,15+h,'r');
     for(let y=20;y<34;y++){put(G,25,y+h,'h');put(G,26,y+h,'H')}put(G,11,23+h,'y');put(G,24,23+h,'y')}},
 ginyu:{torso:['w','W','x'],belt:['d','d','D'],pants:['d','d','D'],boot:['w','W','x'],arm:['p','P','q'],hand:['p','P','q'],
   chest(G,y,x,w){rectG(G,x+1,y+6,w-2,1,'W');rectG(G,x+1,y+8,w-2,1,'W')},
   pads(G,y,x,w){srect(G,x-4,y-2,7,4,['y','Y','w'],true);srect(G,x+w-3,y-2,7,4,['y','Y','w'],true)},
   head(G,h){ellG(G,18,21+h,7,7,['p','P','q']);stampG(G,["kkk....kkk","..ek..ke..","..........","...kkkk..."],13,19+h);
     spikeTri(G,13,15+h,10,7+h,2,['k','k','k']);spikeTri(G,23,15+h,26,7+h,2,['k','k','k']);ellG(G,18,15+h,6,3,['k','k','k'])}},
 frieza:{tw:10,lw:5,gap:0,aw:3,torso:['w','W','x'],pants:['w','W','x'],boot:['w','W','x'],shin:'p',arm:['w','W','x'],hand:['w','W','x'],
   behind(G,y,h,f){for(let i=0;i<14;i++){const x=24+i,yy=46-Math.round(Math.sin(i/14*Math.PI)*6)+(f%2);put(G,x,yy,'w');put(G,x,yy+1,'W')}put(G,37,44,'p')},
   chest(G,y,x,w){ellG(G,18,y+3,3,2,['p','P','q'])},
   pads(G,y,x,w){ellG(G,x-1,y+1,3,3,['p','P','q']);ellG(G,x+w,y+1,3,3,['p','P','q'])},
   head(G,h){ellG(G,18,20+h,7,8,['w','W','x']);ellG(G,18,15+h,7,4,['p','P','q'],(x,y)=>y>16+h);stampG(G,["........","kk....kk",".rk..kr.","........","...pp..."],14,21+h)}},
 cell:{lw:6,torso:['g','G','j'],belt:['b','B','b'],pants:['b','B','n'],boot:['b','B','n'],arm:['b','B','n'],hand:['w','W','w'],
   behind(G,y){for(let i=0;i<9;i++){rectG(G,6-i,y+2+i,4,2,'v');rectG(G,26+i,y+2+i,4,2,'v');put(G,6-i,y+2+i,'V');put(G,29+i,y+3+i,'V')}},
   chest(G,y,x,w){for(const [a,b] of [[2,2],[6,4],[9,1],[3,7],[8,7],[5,9]])put(G,x+a,y+b,'d');rectG(G,x,y+10,w,1,'u')},
   pads(G,y,x,w){srect(G,x-3,y-1,4,4,['g','G','j'],true);srect(G,x+w-1,y-1,4,4,['g','G','j'],true)},
   head(G,h){spikeTri(G,13,16+h,11,3+h,3,['g','G','j']);spikeTri(G,23,16+h,25,3+h,3,['g','G','j']);ellG(G,18,19+h,7,6,['g','G','j']);
     for(const [a,b] of [[12,8],[24,8],[14,14],[22,14]])put(G,a,b+h,'d');stampG(G,["ffffffff","fkkffkkf","feffffef","ffffffff","fffuufff",".ffffff."],14,20+h)}},
 raditz:{torso:['w','W','x'],belt:['d','d','D'],pants:['d','d','D'],boot:['w','W','x'],arm:['d','d','D'],hand:['s','S','t'],cuff:['r','R','r'],cuffLen:2,
   behind(G,y,h){for(let yy=14;yy<50;yy++){const w=Math.round(8+(yy-14)*0.15);for(let x=-w;x<=w;x++)put(G,18+x,yy+h,Math.abs(x)>w-2?'H':'h')}},
   chest(G,y,x,w){rectG(G,x+1,y+6,w-2,1,'W')},
   pads(G,y,x,w){srect(G,x-4,y-2,7,4,['y','Y','z'],true);srect(G,x+w-3,y-2,7,4,['y','Y','z'],true)},
   head(G,h){stampG(G,FACE_V,12,18+h);ellG(G,18,16+h,9,7,['h','H','l'],(x,y)=>y>19+h&&x>12&&x<23);rectG(G,12,17+h,12,1,'r')}},
 nappa:{tw:16,lw:7,gap:1,aw:5,torso:['w','W','x'],belt:['d','d','D'],pants:['d','d','D'],boot:['w','W','x'],arm:['s','S','t'],hand:['s','S','t'],
   chest(G,y,x,w){rectG(G,x+1,y+6,w-2,1,'W');rectG(G,x+1,y+8,w-2,1,'W')},
   pads(G,y,x,w){srect(G,x-5,y-2,8,4,['y','Y','z'],true);srect(G,x+w-3,y-2,8,4,['y','Y','z'],true)},
   head(G,h){ellG(G,18,20+h,7,8,['s','S','t']);stampG(G,["BBB...BBB",".ek...ke.","....S....","..BBBBB..",".B.....B."],14,19+h)}},
 a19:{tw:16,th:11,lw:7,gap:1,aw:5,torso:['k','k','K'],belt:['y','Y','y'],pants:['k','k','K'],boot:['k','k','K'],arm:['w','W','x'],hand:['w','W','x'],
   chest(G,y,x,w){rectG(G,x+2,y,w-4,2,'n');rectG(G,x+6,y+3,4,3,'y')},
   head(G,h){ellG(G,18,21+h,8,7,['w','W','x']);ellG(G,18,15+h,8,4,['k','k','K'],(x,y)=>y>16+h);ellG(G,18,10+h,2,2,['r','R','r']);
     stampG(G,["..........","..nk..kn..","..........","...pppp...","....pp...."],13,20+h)}},
 dabura:{torso:['c','C','c'],belt:['k','k','K'],pants:['c','C','c'],boot:['k','k','K'],arm:['r','R','q'],hand:['r','R','q'],
   behind(G,y){srect(G,8,y-1,20,22,['v','V','v'])},
   chest(G,y,x,w){rectG(G,x+4,y,4,6,'r')},
   head(G,h){ellG(G,18,20+h,7,8,['r','R','q']);ellG(G,18,14+h,7,4,['h','H','l'],(x,y)=>y>16+h);spikeTri(G,13,14+h,10,7+h,1.8,['w','W','w']);spikeTri(G,23,14+h,26,7+h,1.8,['w','W','w']);
     stampG(G,["kkk..kkk",".yk..ky.","........","..kkkk.."],14,20+h)}},
 fatbuu:{tw:22,th:12,lw:7,gap:2,aw:5,al:8,tY:28,torso:['p','P','q'],belt:['y','Y','k'],pants:['w','W','x'],boot:['y','Y','y'],bootH:3,arm:['p','P','q'],hand:['w','W','x'],
   behind(G,y){srect(G,5,y-1,26,20,['v','V','v'])},
   chest(G,y,x,w){rectG(G,x+2,y,w-4,2,'k');rectG(G,x+9,y+11,4,1,'k')},
   head(G,h){ellG(G,18,20+h,8,7,['p','P','q']);stampG(G,["....pp....","...ppp....","..........",".kk....kk.","..........","...kkkk..."],13,11+h);ellG(G,18,13+h,2,2,['p','P','q'])}},
 buu:{tw:10,lw:6,gap:0,torso:['p','P','q'],belt:['k','k','y'],pants:['w','W','x'],boot:['y','Y','y'],bootH:3,arm:['p','P','q'],hand:['w','W','x'],
   head(G,h){ellG(G,18,20+h,7,7,['p','P','q']);for(let i=0;i<7;i++){put(G,18+Math.round(Math.sin(i/7*3)*4),13-i+h,'p');put(G,19+Math.round(Math.sin(i/7*3)*4),13-i+h,'P')}
     stampG(G,["kkk..kkk","ekk..kke","........","..kkkk.."],14,19+h)}},
};
VDEF.frieza100={...VDEF.frieza,tw:14,aw:5,lw:6};
VDEF.golden={...VDEF.frieza};
VDEF.mecha={...VDEF.frieza,head(G,h){VDEF.frieza.head(G,h);rectG(G,19,17+h,6,6,'m');put(G,21,19+h,'r');rectG(G,19,23+h,6,1,'M')}};
// Ginyu Force members share Ginyu's body with their own skin colours
const GFORCE={burter:{p:'#4a7ad8',P:'#2a52a8',q:'#7aa8f0'},jeice:{p:'#e05a4a',P:'#a8382a',q:'#ff8a7a'},guldo:{p:'#6ac84a',P:'#3a8a2a',q:'#9ae87a'}};
const VPAL={
 dodoria:{p:'#ee8fb4',P:'#c86890',q:'#ffb8d4',s:'#c05a80',S:'#903a60',w:'#3a5ab8',W:'#26408a',x:'#5a7ad8',y:'#a07040',Y:'#7a5028',z:'#c08a50',d:'#1a1a22',D:'#2a2a36',v:'#f0f0f0',V:'#b8b8c8',k:K,e:'#ffffff',c:'#4dff6a',n:'#5a4ab8',N:'#3a2a90'},
 zarbon:{s:'#86c9c0',S:'#5a9a90',t:'#a8e4dc',h:'#2f7a4a',H:'#1f5a34',l:'#4a9a64',d:'#1f1f2a',D:'#2f2f3a',w:'#ece6da',W:'#bdb3a0',x:'#ffffff',y:'#e8b738',Y:'#a88420',c:'#f4f4f4',C:'#c4c4d2',r:'#e0244a',e:'#ffffff',k:K,B:'#1f5a34',m:'#5a9a90'},
 ginyu:{p:'#8a5ac8',P:'#5a3a98',q:'#aa7ae8',k:K,e:'#ffffff',w:'#ece6da',W:'#bdb3a0',x:'#ffffff',y:'#d2a24c',Y:'#a07a2c',d:'#262838',D:'#363848'},
 frieza:{w:'#f6f2fb',W:'#bdb4d0',x:'#ffffff',p:'#8b3bd1',P:'#5e1fa0',q:'#c58af0',r:'#e0244a',k:K},
 golden:{w:'#f8e020',W:'#d8900e',x:'#fff6a0',p:'#4a1a6a',P:'#2a0a40',q:'#8a5aaa',r:'#ff2020',k:K},
 frieza100:{w:'#fbe8ff',W:'#d0a0e0',x:'#ffffff',p:'#c050e0',P:'#8a20b0',q:'#f0a0ff',r:'#ff2a4a',k:K},
 mecha:{w:'#d4dae4',W:'#8b93a6',x:'#ffffff',p:'#3a5ad8',P:'#22389a',q:'#8ab0ff',r:'#ff3b3b',m:'#4a6ab8',M:'#2a3a7a',k:K},
 cell:{g:'#9ad83a',G:'#5a9a20',j:'#c8f070',d:'#1d4a1a',b:'#3a2a52',B:'#24183a',n:'#5a4a7a',w:'#f0f0f0',W:'#b8b8c8',f:'#f4f0f8',k:K,e:'#ffffff',u:'#a040d0',v:'#4a2a6a',V:'#8a6ab0'},
 raditz:{s:'#f2bd8a',S:'#d48a5a',t:'#ffdcb4',h:'#1c1a2c',H:'#34334f',l:'#4c4b70',B:'#1c1a2c',w:'#3a3040',W:'#28202e',x:'#5a5060',y:'#8a6a3a',Y:'#5a4220',z:'#aa8a5a',d:'#2a1a3a',D:'#3a2a4a',r:'#c02a2a',R:'#801a1a',e:'#ffffff',k:K,m:'#a0503a'},
 nappa:{s:'#f2bd8a',S:'#d48a5a',t:'#ffdcb4',B:'#1c1a2c',w:'#e8e8e0',W:'#b8b8b0',x:'#ffffff',y:'#7a5a3a',Y:'#5a3a1a',z:'#9a7a5a',d:'#2a2a40',D:'#3a3a50',e:'#ffffff',k:K},
 a19:{w:'#f4f0ea',W:'#c8c0b4',x:'#ffffff',k:'#2a2a38',K:'#44445a',y:'#e8c030',Y:'#a88420',n:'#3a6ad8',r:'#e03a3a',R:'#a01a1a',p:'#e88aa8'},
 dabura:{r:'#d84040',R:'#a02a2a',q:'#f07070',h:'#1c1a2c',H:'#34334f',l:'#4c4b70',w:'#f4e8d0',W:'#c8b898',k:K,K:'#2a2a3a',c:'#e8e8f4',C:'#b8b8d0',y:'#ffd23f',v:'#2a2a6a',V:'#1a1a4a'},
 fatbuu:{p:'#f19ac0',P:'#c86a98',q:'#ffc0dc',w:'#f4f4f4',W:'#c8c8d4',x:'#ffffff',y:'#e8c030',Y:'#a88420',k:K,v:'#6a3ab8',V:'#4a2088'},
 buu:{p:'#f19ac0',P:'#c86a98',q:'#ffc0dc',w:'#f4f4f4',W:'#c8c8d4',x:'#ffffff',y:'#e8c030',Y:'#a88420',k:K,e:'#ffffff'},
};
function villainSprite(id){const V=VDEF[id],pal=VPAL[id];
  const fr=[0,1,2,3].map(f=>gridCanvas(paintVillain(V,f).map(r=>r.join('')),pal)),fl=fr.map(flipC);
  return{fr,fl,wh:fr.map(c=>tintC(c,'#ffffff')),whf:fl.map(c=>tintC(c,'#ffffff')),w:fr[0].width,h:fr[0].height,big:1}}

function enemySprite(id){
  if(SPR[id]&&!SPR[id].pending)return SPR[id];
  if(id!=='shadow'){const sp=scEnemy(id);if(sp)return SPR[id]=sp}
  {const m=myEnemy(id);if(m)return SPR[id]=m}
  // tu sombra: tu mismo pack de sprites, oscurecido (nada dibujado por código)
  if(id==='shadow'&&S&&P){const h=[S.hid,P.form];if(String(ET.shadow.hero)!==String(h)){ET.shadow.hero=h;delete SCTC.shadow}SCTINT.shadow='brightness(.35) sepia(1) hue-rotate(220deg) saturate(2.5)';const sp=scEnemy('shadow');if(sp)return sp}
  if(ET[id]&&ET[id].alias)return SPR[id]=enemySprite(ET[id].alias);
  // Mientras se decodifica el PNG no se inventa un personaje por código.
  // No se guarda en SPR: el render vuelve a pedir su sprite cuando esté listo.
  return ENEMIGO_CARGANDO}
const ENEMIGO_CARGANDO=(()=>{const c=mk(1,1);return{pending:1,fr:[c],fl:[c],wh:[c],whf:[c],w:16,h:26,big:1}})();

// ---------- Namek tiles & decor (procedural pixel art) ----------
const T=16, TILES={grass:[],water:[]};
(function buildTiles(){
  const base=['#56b468','#4ea964','#60bd70'];
  for(let v=0;v<8;v++){const c=mk(T,T),g=c.getContext('2d'),r=srand(1000+v*77);
    g.fillStyle=base[v%3];g.fillRect(0,0,T,T);
    for(let i=0;i<22;i++){g.fillStyle=r()<.5?'#479e60':'#72c97e';g.fillRect(r()*T|0,r()*T|0,1,1)}
    const tufts=v<3?3:v<6?1:0;
    for(let i=0;i<tufts;i++){const x=1+r()*12|0,y=2+r()*11|0;g.fillStyle='#358a58';g.fillRect(x,y,1,2);g.fillRect(x+2,y,1,2);g.fillRect(x+1,y+1,1,2);g.fillStyle='#7fd86e';g.fillRect(x+1,y,1,1)}
    if(v===6){for(let i=0;i<3;i++){const x=2+r()*11|0,y=2+r()*11|0;g.fillStyle=i?'#f7f0a0':'#ffffff';g.fillRect(x,y,1,1);g.fillStyle='#e8c84a';g.fillRect(x+1,y,1,1)}}
    if(v===7){for(let i=0;i<3;i++){const x=2+r()*11|0,y=2+r()*11|0;g.fillStyle='#93a888';g.fillRect(x,y,2,1);g.fillStyle='#6f8466';g.fillRect(x,y+1,2,1)}}
    TILES.grass.push(c)}
  for(let f=0;f<4;f++){const c=mk(T,T),g=c.getContext('2d');g.fillStyle='#2f97a0';g.fillRect(0,0,T,T);
    const r=srand(55);for(let i=0;i<14;i++){g.fillStyle='#2a8791';g.fillRect(r()*T|0,r()*T|0,2,1)}
    for(let i=0;i<3;i++){const y=(i*5+3)%T,x=((i*7+f*2)%T);g.fillStyle='#7fdbd2';g.fillRect(x,y,3,1);g.fillRect((x+8)%T,(y+2)%T,2,1)}
    TILES.water.push(c)}
})();
const DECOR={};
// Suelos y decorados reales (escenarios_tiles.js, pack Ninja Adventure CC0): sustituyen a los dibujados por código
// al cargar la imagen; si no carga, se queda el dibujo anterior.
(function escenariosReales(){const pinta=(src,f,cb)=>{const im=new Image();im.onload=()=>{const c=mk(im.width,im.height),g=c.getContext('2d');g.imageSmoothingEnabled=false;if(f)g.filter=f;g.drawImage(im,0,0);cb(c)};im.src=src};
  for(const k in window.ESC_TILES||{}){const E=ESC_TILES[k];pinta(E.src,E.f,c=>{const L=[];for(let i=0;i<E.n;i++){const t=mk(T,T);t.getContext('2d').drawImage(c,i*T,0,T,T,0,0,T,T);L.push(t)}if(TILES[k])TILES[k].splice(0,TILES[k].length,...L)})}
  for(const k in window.ESC_DECOR||{}){const E=ESC_DECOR[k];pinta(E.src,E.f,c=>{DECOR[k]=c})}})();
(function buildDecor(){
  // Ajissa tree, seen from above: round blue-green canopy with shadow
  for(let v=0;v<2;v++){const s=v?30:24,c=mk(s+8,s+8),g=c.getContext('2d'),r=s/2|0;
    g.fillStyle='rgba(10,40,30,.35)';for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)g.fillRect(r+6+x,r+7+y,1,1);
    pball(g,r+3,r+3,r,['#1f6b6f','#2b878a','#3aa3a2','#5cc5b8','#8fe6d0']);
    const rr=srand(9+v);for(let i=0;i<10;i++){g.fillStyle='#226e72';g.fillRect(r+3+(rr()*2-1)*r*0.7|0,r+3+(rr()*2-1)*r*0.7|0,2,1)}
    DECOR['tree'+v]=addOutline(c,'#0f2a2c')}
  {const c=mk(14,12),g=c.getContext('2d');pball(g,7,6,6,['#55604a','#717e60','#8e9c78','#b1bf98'],5);DECOR.rock=addOutline(c,'#1d2418')}
  // Namekian dome house from above
  {const c=mk(34,34),g=c.getContext('2d');
    g.fillStyle='rgba(10,40,30,.35)';for(let y=-12;y<=12;y++)for(let x=-12;x<=12;x++)if(x*x+y*y<=144)g.fillRect(19+x,20+y,1,1);
    pball(g,16,16,12,['#9fb3a8','#c4d4c8','#e2eee4','#f8fff8']);
    g.fillStyle='#2d5b48';for(const [x,y] of [[7,22],[16,26],[25,22]]){g.fillRect(x-1,y-1,3,3)}
    g.fillStyle='#b9cbbf';g.fillRect(15,2,3,3);
    DECOR.house=addOutline(c,'#22362c')}
  // rock mesa (Namek's tall stone pillars) seen from above
  {const c=mk(48,52),g=c.getContext('2d');
    pball(g,24,30,20,['#5b5a3a','#6e6d45','#7e7c4e'],18);
    pball(g,24,24,20,['#8a8a58','#a3a26a','#bcbb7d','#d4d39a'],17);
    g.fillStyle='#7b7a50';for(let i=0;i<8;i++){const a=i/8*TAU;g.fillRect(24+Math.cos(a)*12|0,24+Math.sin(a)*10|0,3,1)}
    g.fillStyle='#5aa850';g.fillRect(18,16,6,3);g.fillRect(27,20,4,2);g.fillStyle='#78c868';g.fillRect(19,16,3,1);
    DECOR.mesa=addOutline(c,'#2a2a18')}
})();
const waterMemo=new Map();
function isWater(tx,ty){const k=tx*100003+ty;let v=waterMemo.get(k);if(v===undefined){
  v=(tx*tx+ty*ty>64)&&fbm(tx/9,ty/9,1)>0.66; if(waterMemo.size>40000)waterMemo.clear(); waterMemo.set(k,v)}return v}

const canyonMemo=new Map();
function isCanyon(tx,ty){const k=tx*100003+ty;let v=canyonMemo.get(k);if(v===undefined){
  const n=fbm(tx/7,ty/14,11);v=(tx*tx+ty*ty>64)&&n>0.43&&n<0.5;if(canyonMemo.size>40000)canyonMemo.clear();canyonMemo.set(k,v)}return v}
const lavaMemo=new Map();
function isLava(tx,ty){const k=tx*100003+ty;let v=lavaMemo.get(k);if(v===undefined){const n=fbm(tx/9,ty/9,23);v=(tx*tx+ty*ty>49)&&n>0.69;if(lavaMemo.size>40000)lavaMemo.clear();lavaMemo.set(k,v)}return v}
const isRoad=(tx,ty)=>{const m=((tx%26)+26)%26,n=((ty%22)+22)%22;return m<3||n<3};
const onRing=(tx,ty)=>Math.abs(tx)<=11&&Math.abs(ty)<=11;
(function buildMoreTiles(){
  const mkSet=(n,seed,fn)=>{const out=[];for(let v=0;v<n;v++){const c=mk(T,T),g=c.getContext('2d'),r=srand(seed+v*131);fn(g,r,v);out.push(c)}return out};
  const px=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  TILES.sand=mkSet(8,300,(g,r,v)=>{px(g,0,0,T,T,['#c9a66b','#c39f63','#cfac72'][v%3]);
    for(let i=0;i<20;i++)px(g,r()*T|0,r()*T|0,1,1,r()<.5?'#b08d55':'#dcbd85');
    if(v===3||v===4){let x=r()*8|0,y=r()*8|0;for(let i=0;i<7;i++){px(g,x,y,1,1,'#8f6c3c');x+=r()<.5?1:0;y+=1}}
    if(v===5){for(let i=0;i<3;i++){const x=2+r()*11|0,y=3+r()*10|0;px(g,x,y,1,2,'#8f9a4a');px(g,x+2,y,1,2,'#8f9a4a');px(g,x+1,y+1,1,1,'#b0b860')}}
    if(v===6){for(let i=0;i<3;i++){const x=2+r()*11|0,y=2+r()*11|0;px(g,x,y,2,1,'#a89070');px(g,x,y+1,2,1,'#7e6848')}}});
  TILES.canyon=mkSet(4,500,(g,r,v)=>{px(g,0,0,T,T,'#6e4a2a');for(let i=0;i<18;i++)px(g,r()*T|0,r()*T|0,2,1,r()<.5?'#5e3e22':'#7e5634')});
  TILES.time=mkSet(6,900,(g,r,v)=>{px(g,0,0,T,T,['#f6f4ee','#f2f0e8','#f8f7f2'][v%3]);px(g,0,T-1,T,1,'#e6e2d6');px(g,T-1,0,1,T,'#e6e2d6');
    for(let i=0;i<5;i++)px(g,r()*15|0,r()*15|0,1,1,'#ebe8de');if(v===5)px(g,2+r()*10|0,2+r()*10|0,2,2,'#fff8d0')});
  {const c=mk(72,58),g=c.getContext('2d');
    px(g,6,26,60,28,'#f2f0ea');px(g,6,26,60,2,'#ffffff');px(g,6,50,60,4,'#d6d2c4');px(g,6,30,60,3,'#e0b040');px(g,6,33,60,1,'#a87a20');
    for(let i=0;i<6;i++){px(g,10+i*10,34,4,16,'#ffffff');px(g,13+i*10,34,1,16,'#d6d2c4')}
    px(g,30,38,12,16,'#3a3a52');px(g,31,39,10,15,'#24243a');px(g,30,37,12,1,'#e0b040');
    pball(g,36,22,13,['#c8c4b6','#e2ded2','#f4f2ec','#ffffff'],10);px(g,20,22,32,6,'#f2f0ea');px(g,22,26,28,1,'#d6d2c4');
    px(g,35,4,2,6,'#e0b040');px(g,34,3,4,2,'#ffe066');
    for(const x of [2,62]){px(g,x,18,8,36,'#f6f4ee');px(g,x+6,18,2,36,'#d6d2c4');px(g,x,16,8,3,'#e0b040');pball(g,x+4,14,4,['#c8c4b6','#e2ded2','#f4f2ec','#ffffff'],3)}
    DECOR.temple=addOutline(c,'#2a2a3a')}
  {const c=mk(14,22),g=c.getContext('2d');px(g,4,0,6,2,'#e0b040');px(g,5,2,4,4,'#bfe6ff');px(g,6,6,2,2,'#e8d8a0');px(g,5,8,4,4,'#bfe6ff');px(g,6,9,2,3,'#e8d8a0');px(g,4,12,6,2,'#e0b040');
    px(g,2,16,10,4,'#d6d2c4');px(g,2,16,10,1,'#ffffff');DECOR.hourglass=addOutline(c,'#2a2a3a')}
  TILES.redrock=mkSet(7,1500,(g,r,v)=>{px(g,0,0,T,T,['#a8543a','#a04e36','#b05c40'][v%3]);for(let i=0;i<18;i++)px(g,r()*T|0,r()*T|0,1,1,r()<.5?'#8a3e2a':'#c06a4a');
    if(v===4||v===5){let x=r()*12|0,y=0;for(let i=0;i<T;i++){px(g,x,y,1,1,'#6a2a1e');x+=r()<.45?(r()<.5?-1:1):0;y++}}if(v===6)for(let i=0;i<3;i++)px(g,2+r()*11|0,2+r()*11|0,2,2,'#7a3424')});
  TILES.lava=[0,1,2,3].map(f=>{const c=mk(T,T),g=c.getContext('2d');g.fillStyle='#e0401a';g.fillRect(0,0,T,T);const r=srand(1700+f);
    for(let i=0;i<10;i++){const x=(r()*T+f*2)%T|0,y=r()*T|0;g.fillStyle=i%3?'#ff8a2a':'#ffd23f';g.fillRect(x,y,2,1)}g.fillStyle='#b02a10';g.fillRect((f*4)%T,(f*5+3)%T,3,2);return c});
  {const c=mk(22,20),g=c.getContext('2d');pball(g,11,9,9,['#8a8e9a','#aab0bc','#ccd2dc','#f0f4f8'],8);px(g,6,7,10,4,'#5a1a2a');px(g,7,8,8,2,'#c83a4a');px(g,8,8,2,1,'#ff9aa0');px(g,4,16,3,4,'#6a6e78');px(g,15,16,3,4,'#6a6e78');DECOR.pod=addOutline(c,'#1e1418')}
  {const c=mk(18,30),g=c.getContext('2d');for(let y=0;y<30;y++){const w=Math.max(2,Math.round(3+y*0.45));px(g,9-(w>>1),y,w,1,y<4?'#c8705a':'#8a3e2a');px(g,9-(w>>1),y,1,1,'#b0583e')}px(g,2,27,14,3,'#6a2a1e');DECOR.redspire=addOutline(c,'#1e0c08')}
  TILES.road=mkSet(4,1100,(g,r,v)=>{px(g,0,0,T,T,['#4a4a50','#46464c','#4e4e54'][v%3]);for(let i=0;i<14;i++)px(g,r()*T|0,r()*T|0,1,1,r()<.5?'#3a3a40':'#5a5a62');
    if(v===3){let x=r()*10|0,y=0;for(let i=0;i<T;i++){px(g,x,y,1,1,'#2a2a30');x+=r()<.4?(r()<.5?-1:1):0;y++}}});
  TILES.ruin=mkSet(7,1300,(g,r,v)=>{px(g,0,0,T,T,['#9a9284','#948c7e','#a0988a'][v%3]);for(let i=0;i<18;i++)px(g,r()*T|0,r()*T|0,1,1,r()<.5?'#867e70':'#aea696');
    if(v===4||v===5){let x=r()*12|0,y=0;for(let i=0;i<T;i++){px(g,x,y,1,1,'#5e584e');x+=r()<.45?(r()<.5?-1:1):0;y++}}
    if(v===6){for(let i=0;i<4;i++)px(g,2+r()*11|0,2+r()*11|0,2,1,'#6a8a4a')}});
  for(const [k,w,h,seed] of [['ruin0',40,46,1],['ruin1',30,34,2]]){const c=mk(w,h),g=c.getContext('2d'),r=srand(4000+seed);
    px(g,0,8,w,h-8,'#b8b0a0');px(g,0,8,3,h-8,'#d0c8b8');px(g,w-4,8,4,h-8,'#8e8678');
    for(let x=0;x<w;x+=2){const top=8+((r()*10)|0);g.clearRect(x,0,2,top)}
    for(let y=20;y<h-6;y+=9)for(let x=4;x<w-6;x+=8){px(g,x,y,5,5,'#2a2a34');if(r()<.4)px(g,x,y,5,2,'#ff9a3a')}
    px(g,0,h-3,w,3,'#7a7466');DECOR[k]=addOutline(c,'#1e1c18')}
  {const c=mk(24,14),g=c.getContext('2d');px(g,2,4,20,7,'#8a3a2a');px(g,5,1,13,4,'#6e2e22');px(g,7,2,4,2,'#2a3a4a');px(g,12,2,4,2,'#2a3a4a');px(g,2,9,20,2,'#5a2418');
    px(g,4,10,4,4,'#1a1a1a');px(g,16,10,4,4,'#1a1a1a');px(g,9,5,6,1,'#c85a3a');DECOR.car=addOutline(c,'#140c08')}
  {const c=mk(16,9),g=c.getContext('2d');pball(g,5,5,4,['#6e695f','#8a8478','#a49e90','#beb8aa'],3);pball(g,11,6,3,['#5e584e','#7a7466','#958f82','#aea89a'],2);DECOR.rubble=addOutline(c,'#1e1c18')}
  TILES.stone=mkSet(6,700,(g,r,v)=>{px(g,0,0,T,T,['#d9d5c9','#d2cec2','#dedacf'][v%3]);px(g,0,T-1,T,1,'#a9a597');px(g,T-1,0,1,T,'#a9a597');px(g,0,0,T,1,'#ebe8df');
    for(let i=0;i<8;i++)px(g,r()*15|0,r()*15|0,1,1,'#c4c0b3');
    if(v>=4){let x=2+r()*8|0,y=1;for(let i=0;i<9;i++){px(g,x,y,1,1,'#8e8a7e');x+=r()<.4?(r()<.5?-1:1):0;y++}}});
  TILES.steppe=mkSet(8,900,(g,r,v)=>{px(g,0,0,T,T,['#9fae62','#97a75c','#a8b66a'][v%3]);
    for(let i=0;i<18;i++)px(g,r()*T|0,r()*T|0,1,1,r()<.5?'#879650':'#b9c47a');
    if(v===5||v===6){const x=3+r()*8|0,y=3+r()*8|0;for(let i=0;i<9;i++)px(g,x+(r()*6|0)-3,y+(r()*4|0)-2,2+(r()*2|0),1,i%3?'#b39a62':'#c4ab72')}
    if(v<3){const x=2+r()*11|0,y=3+r()*10|0;px(g,x,y,1,2,'#6f8a40');px(g,x+2,y,1,2,'#6f8a40');px(g,x+1,y+1,1,2,'#6f8a40')}});
  // wasteland decor
  {const c=mk(40,58),g=c.getContext('2d');pball(g,20,40,16,['#6a3e22','#7e4a28','#8e5630'],12);
    g.fillStyle='#8e5630';g.fillRect(9,14,22,28);g.fillStyle='#7e4a28';g.fillRect(9,14,5,28);g.fillStyle='#a8683a';g.fillRect(26,14,5,28);
    pball(g,20,14,11,['#a8683a','#c07a44','#d48e54','#e8a868'],8);g.fillStyle='#8e5630';for(let i=0;i<5;i++)g.fillRect(10,20+i*5,20,1);
    DECOR.spire=addOutline(c,'#2a160a')}
  {const c=mk(40,58),g=c.getContext('2d');pball(g,20,40,16,['#5a564a','#6a665a','#7a766a'],12);
    g.fillStyle='#7a766a';g.fillRect(9,14,22,28);g.fillStyle='#6a665a';g.fillRect(9,14,5,28);g.fillStyle='#8e8a7e';g.fillRect(26,14,5,28);
    pball(g,20,14,11,['#8e8a7e','#a4a092','#bab6a8','#d0ccbe'],8);DECOR.spire2=addOutline(c,'#1e1c16')}
  {const c=mk(18,14),g=c.getContext('2d');pball(g,9,7,8,['#7a5a3a','#94704a','#ae8a5e','#c8a678'],6);DECOR.boulder=addOutline(c,'#2a1a0a')}
  {const c=mk(30,20),g=c.getContext('2d');for(let y=-9;y<=9;y++)for(let x=-14;x<=14;x++){const d=(x*x)/196+(y*y)/81;if(d>1)continue;
      g.fillStyle=d>0.75?(y<0?'#7e5e36':'#d8bc88'):(y<0?'#8f6c40':'#a8865a');if(d<0.35)g.fillStyle='#9a7a4e';g.fillRect(15+x,10+y,1,1)}DECOR.crater=c}
  {const c=mk(14,18),g=c.getContext('2d');g.fillStyle='rgba(60,40,10,.3)';g.fillRect(4,14,9,3);g.fillStyle='#4a8a3a';g.fillRect(5,2,4,14);g.fillRect(1,6,2,5);g.fillRect(11,4,2,6);g.fillRect(3,9,2,2);g.fillRect(9,8,2,2);
    g.fillStyle='#6aaa4a';g.fillRect(6,2,1,13);g.fillRect(1,6,1,4);g.fillRect(11,4,1,5);DECOR.cactus=addOutline(c,'#1a3010')}
})();
// Objetos reales: fuentes, originales y recortes en ui/objetos/.
const OBJ_IMG={};
for(const id of ['senzu','capsulaVida','capsulaKi','radar']){
  if(!window.UI_IMG?.[id])continue;
  const im=new Image();im.onload=()=>{delete ICON_C[id];if(id==='radar')delete ICON_C.magnet};im.src=window.UI_IMG[id];OBJ_IMG[id]=im;
}
function drawObjeto(id,x,y,w=14){const im=OBJ_IMG[id];if(!im?.complete||!im.naturalWidth)return;
  const h=w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,Math.round(x-w/2),Math.round(y-h),w,h)}
// ---------- icons ----------
function icon(id){
  const c=mk(16,16),g=c.getContext('2d');const px=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  const objeto=OBJ_IMG[id==='magnet'?'radar':id];
  if(objeto){if(objeto.complete&&objeto.naturalWidth){const z=Math.min(16/objeto.naturalWidth,16/objeto.naturalHeight),w=objeto.naturalWidth*z,h=objeto.naturalHeight*z;g.drawImage(objeto,(16-w)/2,(16-h)/2,w,h)}return c}
  switch(id){
   case 'kiblast':pball(g,9,8,4,['#e09a1a','#ffd23f','#fff3a0','#ffffff']);px(1,7,4,2,'#ffd23f');px(2,10,3,1,'#ffb020');break;
   case 'kame':px(0,6,12,4,'#3aa8ff');px(0,7,12,2,'#bff0ff');pball(g,12,8,3,['#3aa8ff','#9fe8ff','#ffffff']);break;
   case 'galick':px(0,6,12,4,'#9b3cff');px(0,7,12,2,'#f0b0ff');pball(g,12,8,3,['#9b3cff','#e6a8ff','#ffffff']);break;
   case 'makanko':px(0,7,15,2,'#ffe86a');for(let x=0;x<15;x+=3){px(x,5,1,1,'#ff7ad0');px(x+1,10,1,1,'#ff7ad0');px(x+2,6,1,4,'#ffb0ea')}break;
   case 'masenko':pball(g,8,8,6,['#d08a10','#ffcc33','#fff09a','#ffffff']);break;
   case 'kienzan':for(let x=-6;x<=6;x++){const h=Math.round(Math.sqrt(36-x*x)/3);px(8+x,8-h,1,h*2+1,'#ffd23f')}px(3,8,10,1,'#fff8c0');break;
   case 'genki':pball(g,8,8,7,['#2a7ad8','#6ab8ff','#bfe6ff','#ffffff']);break;
   case 'bigbang':pball(g,8,8,6,['#3a6ad8','#8ac8ff','#e0f4ff','#ffffff']);px(1,1,2,2,'#bfe6ff');px(13,12,2,2,'#bfe6ff');break;
   case 'burning':pball(g,8,8,6,['#d86a10','#ffb03a','#fff3c0','#ffffff']);break;
   case 'riot':px(1,7,12,3,'#2a6ad8');px(1,8,12,1,'#e0f4ff');pball(g,12,8,3,['#2a6ad8','#7ab8ff','#ffffff']);break;
   case 'eraser':pball(g,8,8,7,['#3aa020','#a0f040','#f0ffc0','#ffffff']);break;
   case 'finalkame':px(0,5,12,6,'#2a5ad8');px(0,7,12,2,'#f0d040');pball(g,12,8,3,['#2a5ad8','#f0d040','#ffffff']);break;
   case 'stardust':for(let a=0;a<5;a++){const t=a/5*TAU-Math.PI/2;px(8+Math.cos(t)*6|0,8+Math.sin(t)*6|0,2,2,'#ff6ad0')}pball(g,8,8,4,['#a02ad8','#ff6ad0','#ffffff']);break;
   case 'aura':for(let a=0;a<24;a++){const t=a/24*TAU;px(8+Math.cos(t)*6|0,8+Math.sin(t)*6|0,2,2,a%2?'#ff4a3a':'#ffb03a')}break;
   case 'orbs':pball(g,8,8,6,['#c85a10','#f2911a','#ffc44a','#fff0b0']);px(7,6,2,4,'#d81e1e');px(6,7,4,2,'#d81e1e');break;
   case 'power':px(4,4,8,8,'#d83a3a');px(5,3,6,1,'#d83a3a');px(5,5,6,2,'#ff7a6a');px(3,6,1,4,'#a82020');break;
   case 'hp':px(3,4,4,6,'#ff4d5e');px(9,4,4,6,'#ff4d5e');px(4,10,8,2,'#ff4d5e');px(6,12,4,2,'#ff4d5e');px(7,6,2,4,'#ff4d5e');px(4,5,2,2,'#ffb0b8');break;
   case 'speed':for(let i=0;i<3;i++){px(2+i*4,4,2,2,'#4fd1a5');px(4+i*4,6,2,4,'#4fd1a5');px(2+i*4,10,2,2,'#4fd1a5')}break;
   case 'cd':pball(g,8,8,6,['#1a3a8a','#3a6ad8','#7aa8ff']);px(7,4,2,5,'#ffffff');px(8,8,3,2,'#ffffff');break;
   case 'magnet':break;
   case 'regen':pball(g,8,8,5,['#3a7a2a','#5aa83a','#8ad25a','#c8f09a'],6);px(7,3,1,10,'#3a7a2a');break;
   case 'area':for(let a=0;a<20;a++){const t=a/20*TAU;px(8+Math.cos(t)*6|0,8+Math.sin(t)*6|0,1,1,'#ffd23f')}px(7,7,3,3,'#ffd23f');break;
   case 'armor':px(3,3,10,9,'#d7e4f0');px(4,4,8,7,'#ece6da');px(3,3,3,3,'#d2a24c');px(10,3,3,3,'#d2a24c');px(6,12,4,2,'#262838');break;
   case 'xp':pball(g,8,8,5,['#1a5ad8','#3a9aff','#9ad8ff','#ffffff']);break;
   case 'senzu':break;
   default:px(4,4,8,8,'#888');
  }
  return addOutline(c)}

// ---------- game data ----------
const FORM_LV=[0,10,20,30,40];
// moves: up to 4 slots, max level 5, evolve at 5 with matching run card ("carta dorada")
const MV={
 kiblast:{name:'Ráfaga de Ki',kind:'shot',col:['#e09a1a','#ffd23f','#ffffff'],evo:'Ráfaga Infinita',req:'speed',
   st:l=>({cd:0.75-l*0.06,dmg:8+l*3,count:1+Math.floor(l/2),spd:210,pierce:l>=4?1:0}),
   ds:['Dispara bolas de ki al enemigo más cercano.','+3 daño','+1 proyectil','+3 daño, más cadencia','Atraviesa 1 enemigo, +1 proyectil']},
 kame:{name:'Kamehameha',only:['goku','gohan','goten'],kind:'beam',col:['#1f6fe0','#6cd0ff','#f4ffff'],evo:'Kamehameha x10',req:'cd',
   st:l=>({cd:6.5-l*0.45,dmg:30+l*12,len:240+l*20,wid:16+l*2.5,dur:0.9+l*0.08,charge:0.75}),
   ds:['ESPECIAL: carga y lanza una onda gigante.','+Daño','+Grosor y alcance','+Daño','+Daño y menos recarga']},
 galick:{name:'Galick Gun',only:['vegeta'],kind:'beam',col:['#7a24d8','#d08aff','#fff0ff'],evo:'Final Flash',req:'power',
   st:l=>({cd:6.0-l*0.45,dmg:33+l*12,len:230+l*20,wid:15+l*2.5,dur:0.85+l*0.08,charge:0.7}),
   ds:['ESPECIAL: carga y lanza una onda púrpura gigante.','+Daño','+Grosor y alcance','+Daño','+Daño y menos recarga']},
 makanko:{name:'Makankosappo',only:['piccolo'],kind:'beam',spiral:1,col:['#ffb000','#ffe86a','#ffffff'],evo:'Makankosappo Definitivo',req:'area',
   st:l=>({cd:5.0-l*0.4,dmg:44+l*15,len:300+l*20,wid:7+l*1,dur:0.6+l*0.05,charge:0.9}),
   ds:['ESPECIAL: rayo en espiral que lo atraviesa todo.','+Daño','+Alcance','+Daño','+Daño y menos recarga']},
 masenko:{name:'Masenko',kind:'big',col:['#d08a10','#ffcc33','#ffffff'],evo:'Masenko Supremo',req:'power',
   st:l=>({cd:2.4-l*0.15,dmg:22+l*8,rad:22+l*3,spd:130}),
   ds:['Bola de energía que explota al impactar.','+Daño','+Radio de explosión','+Daño','+Daño y cadencia']},
 kienzan:{name:'Kienzan',kind:'disc',col:['#e0a010','#ffd23f','#fff8c0'],evo:'Kienzan Doble',req:'magnet',
   st:l=>({cd:2.6-l*0.18,dmg:18+l*7,count:1+(l>=3?1:0),range:0.45+l*0.04}),
   ds:['Disco cortante que va y vuelve.','+Daño','+1 disco','+Daño y alcance','+Daño y cadencia']},
 genki:{name:'Genkidama',only:['goku','gohan'],kind:'bomb',col:['#2a7ad8','#6ab8ff','#bfe6ff','#ffffff'],evo:'Genkidama Universal',req:'hp',
   st:l=>({cd:6.5-l*0.5,dmg:50+l*22,rad:34+l*5}),
   ds:['Una esfera gigante cae sobre los enemigos.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 bigbang:{name:'Big Bang Attack',only:['vegeta','vegetto'],kind:'big',col:['#3a6ad8','#8ac8ff','#e0f4ff','#ffffff'],evo:'Big Bang Final',req:'area',
   st:l=>({cd:3.0-l*0.25,dmg:34+l*12,rad:28+l*4,spd:120}),
   ds:['Esfera que estalla en una gran explosión.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 burning:{name:'Burning Attack',only:['trunks'],kind:'big',col:['#d86a10','#ffb03a','#fff3c0','#ffffff'],evo:'Burning Attack Final',req:'power',
   st:l=>({cd:2.6-l*0.2,dmg:34+l*12,rad:28+l*4,spd:140}),ds:['Bola ardiente que estalla.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 riot:{name:'Riot Javelin',only:['bardock'],kind:'big',col:['#2a6ad8','#7ab8ff','#e0f4ff','#ffffff'],evo:'Spirit of Saiyans',req:'hp',
   st:l=>({cd:2.4-l*0.2,dmg:32+l*12,rad:26+l*4,spd:170}),ds:['Lanza de energía que explota.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 eraser:{name:'Eraser Cannon',only:['broly'],kind:'big',col:['#3aa020','#a0f040','#f0ffc0','#ffffff'],evo:'Gigantic Meteor',req:'area',
   st:l=>({cd:3.0-l*0.25,dmg:44+l*15,rad:40+l*5,spd:100}),ds:['Esfera verde con explosión enorme.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 finalkame:{name:'Final Kamehameha',only:['vegetto'],kind:'beam',col:['#2a5ad8','#f0d040','#ffffff'],evo:'Final Kamehameha x100',req:'cd',
   st:l=>({cd:6.0-l*0.45,dmg:36+l*13,len:260+l*20,wid:18+l*2.5,dur:0.9+l*0.08,charge:0.7}),ds:['ESPECIAL: onda gigante azul y dorada.','+Daño','+Grosor y alcance','+Daño','+Daño y menos recarga']},
 stardust:{name:'Stardust Breaker',only:['gogeta'],kind:'bomb',col:['#a02ad8','#ff6ad0','#ffe0ff','#ffffff'],evo:'Soul Punisher',req:'power',
   st:l=>({cd:5.0-l*0.4,dmg:60+l*24,rad:38+l*5}),ds:['ESPECIAL: estrella que estalla sobre los enemigos.','+Daño','+Radio','+Daño','+Daño y cadencia']},
 aura:{name:'Aura de Ki',kind:'aura',col:['#ff4a3a','#ffb03a'],evo:'Kaio-ken x20',req:'regen',
   st:l=>({cd:0.5-l*0.03,dmg:4+l*2.5,rad:26+l*5}),
   ds:['Quema a los enemigos que se acercan.','+Daño','+Radio','+Daño','+Radio y daño']},
 orbs:{name:'Esferas del Dragón',kind:'orbit',col:['#f2911a'],evo:'Esferas Sagradas',req:'cd',
   st:l=>({count:1+l,dmg:8+l*3,rad:30+l*2,spd:2.6+l*0.2}),
   ds:['Esferas que giran a tu alrededor.','+1 esfera','+1 esfera, +daño','+1 esfera','+1 esfera, +daño']},
};
// ---------- v14: signature attacks ----------
// Each hero has 4-6 attacks from the series. They unlock as the player levels up and appear in the bar at the bottom;
// the number keys pick which one fires by itself (auto-aim, on cooldown). The player only moves and switches.
// pose: which sprite row plays while the attack winds up/releases (cast = open hand, up = ki over the head, atk/kick = melee)
const MV0=new Set(Object.keys(MV));
Object.assign(MV.kiblast,{pose:'cast'});Object.assign(MV.kame,{pose:'beam'});Object.assign(MV.galick,{pose:'beam'});Object.assign(MV.makanko,{pose:'beam'});
Object.assign(MV.masenko,{pose:'up'});Object.assign(MV.kienzan,{pose:'up'});Object.assign(MV.genki,{pose:'up'});Object.assign(MV.bigbang,{pose:'cast'});
Object.assign(MV.burning,{pose:'cast'});Object.assign(MV.riot,{pose:'cast'});Object.assign(MV.eraser,{pose:'cast'});Object.assign(MV.finalkame,{pose:'beam'});Object.assign(MV.stardust,{pose:'up'});
const BEAM=(name,col,cd,d0,d1,len,wid,ch)=>({name,kind:'beam',pose:'beam',sig:1,col,st:l=>({cd:cd-l*0.4,dmg:d0+l*d1,len:len+l*20,wid:wid+l*2.5,dur:0.9+l*0.08,charge:ch})});
const BIG=(name,col,cd,d0,d1,rad,spd,pose='cast')=>({name,kind:'big',pose,sig:1,col,st:l=>({cd:cd-l*0.2,dmg:d0+l*d1,rad:rad+l*4,spd})});
const SHOT=(name,col,cd,d0,d1,n0,spd,o={})=>({name,kind:'shot',pose:'cast',sig:1,col,ring:o.ring,home:o.home,st:l=>({cd:cd-l*0.06,dmg:d0+l*d1,count:n0+l,spd,pierce:o.pierce||0})});
const NOVA=(name,col,cd,d0,d1,rad,stun=0,o={})=>({name,kind:'nova',pose:'cast',sig:1,col,heal:o.heal,shield:o.shield,st:l=>({cd:cd-l*0.3,dmg:d0+l*d1,rad:rad+l*6,stun:stun?stun+l*0.2:0})});
const BOMB=(name,col,cd,d0,d1,rad)=>({name,kind:'bomb',pose:'up',sig:1,col,st:l=>({cd:cd-l*0.4,dmg:d0+l*d1,rad:rad+l*5})});
// cuerpo a cuerpo: de cerca no disparan (px), protección extra tras el combo (s), empuje de cada golpe, aturdimiento (s), distancia de parada del impulso (px)
const MELEE_AJ={sinDisparo:60,guardaExtra:0.25,empuje:0.6,aturde:0.2,parada:20};
const MELEE=(name,col,pose,cd,d0,d1,hits,reach,rad,o={})=>({name,kind:'melee',pose,sig:1,col,...o,st:l=>({cd:cd-l*0.06,dmg:d0+l*d1,hits:hits+(l>=4?1:0),reach,rad,kb:o.kb||70})});
const SWORD=(name,col,cd,d0,d1,rad,arc)=>({name,kind:'sword',pose:'atk',sig:1,col,st:l=>({cd:cd-l*0.05,dmg:d0+l*d1,rad:rad+l*3,arc})});
Object.assign(MV,{
 punch:MELEE('Combo de golpes',['#ffffff','#ffd23f'],'atk',0.9,8,4,3,80,20),
 kick:MELEE('Patada voladora',['#ffffff','#ffb03a'],'kick',1.2,14,6,2,100,24,{kb:160}),
 lariat:MELEE('Lariat',['#a0f040','#ffffff'],'atk',1.4,20,8,2,110,30,{kb:200}),
 instant:MELEE('Teletransporte',['#bfe6ff','#ffffff'],'atk',2.0,18,7,3,240,26,{tp:1}),
 kaioken:MELEE('Kaioken',['#ff3a2a','#ffb0a0'],'kick',2.4,10,4,6,170,24,{kaio:1}),
 dragonfist:MELEE('Puño del Dragón',['#ffd23f','#fff3a0'],'atk',4.5,60,24,1,200,46,{dragon:1,kb:280}),
 silver:MELEE('Golpe del Instinto',['#e0f0ff','#ffffff'],'kick',1.6,18,8,4,260,28,{tp:1}),
 tsword:SWORD('Espada del Futuro',['#e8f4ff','#ffffff'],0.9,16,6,34,1.9),
 spiritsword:SWORD('Espada Espiritual',['#3a8aff','#bfe6ff'],1.1,22,8,44,2.2),
 kiblade:SWORD('Espada de Ki',['#ff4ad0','#ffc0f0'],1.0,20,7,38,1.8),
 scythe:SWORD('Guadaña Rosé',['#d02a80','#ffb0e0'],2.2,36,12,60,3.4),
 renzoku:SHOT('Renzoku Energy Dan',['#e09a1a','#ffd23f','#ffffff'],1.2,7,3,5,230,{home:1}),
 scatter:SHOT('Ráfaga de Krilin',['#e0a010','#ffd23f','#fff8c0'],1.3,6,2,6,220,{home:1}),
 hellzone:SHOT('Hellzone Grenade',['#d8b010','#ffe060','#ffffff'],2.2,8,3,10,150,{ring:1,pierce:1,home:1}),
 lances:SHOT('Lanzas Divinas',['#c02a80','#ff6ad0','#ffe0ff'],1.2,9,3,4,260,{pierce:1}),
 blaster:SHOT('Blaster Meteor',['#2a9a20','#8af06a','#f0fff0'],1.6,8,3,8,170,{ring:1,home:1}),
 ghost:SHOT('Ataque Kamikaze Fantasma',['#c8d0e8','#ffffff','#ffffff'],1.5,12,4,3,120,{pierce:2,home:1}),
 a18volley:SHOT('Ráfaga de Energía',['#1a6ad8','#7ad0ff','#ffffff'],1.0,7,3,4,240),
 gekiretsu:SHOT('Gekiretsu Madan',['#d8a010','#ffe060','#ffffff'],1.4,8,3,6,210,{home:1}),
 finalflash:BEAM('Final Flash',['#d8b010','#fff06a','#ffffff'],7,40,14,280,22,1.0),
 eyebeam:{...BEAM('Rayo de los Ojos',['#d02020','#ff8a6a','#ffffff'],1.8,22,8,220,3,0.2),st:l=>({cd:1.8-l*0.08,dmg:22+l*8,len:220,wid:4,dur:0.25,charge:0.2})},
 heatdome:BEAM('Heat Dome Attack',['#d8a010','#ffe060','#ffffff'],6,36,13,250,18,0.8),
 fskame:BEAM('Kamehameha Padre e Hijo',['#1f6fe0','#6cd0ff','#ffffff'],7,44,15,300,22,0.8),
 bbkame:BEAM('Big Bang Kamehameha',['#2a5ad8','#f0d040','#ffffff'],6.5,46,16,290,22,0.8),
 giganticray:BEAM('Gigantic Ray',['#3aa020','#a0f040','#f0ffc0'],6,40,14,270,20,0.8),
 blackkame:BEAM('Kamehameha Negro',['#a01a6a','#ff4ab0','#ffd0f0'],6,40,14,260,18,0.75),
 finalshine:BEAM('Final Shine Attack',['#2a9a20','#8af06a','#f0fff0'],6,42,15,270,18,0.8),
 godkame:BEAM('Kamehameha Divino',['#c8202a','#ff8a6a','#fff0f0'],6.5,46,16,290,22,0.8),
 gamma:BEAM('Gamma Burst Flash',['#1a6ad8','#7ad0ff','#ffffff'],7,48,16,300,24,0.9),
 kame10x:BEAM('Kamehameha x10',['#c8202a','#6cd0ff','#ffffff'],7,50,17,310,26,0.9),
 finalspirit:BEAM('Final Spirit Cannon',['#2a6ad8','#7ab8ff','#e0f4ff'],6,40,14,260,18,0.8),
 lightgren:BIG('Light Grenade',['#d8b010','#fff06a','#ffffff','#ffffff'],3.2,38,13,34,120),
 finishbuster:BIG('Finish Buster',['#d8a010','#ffe060','#fff3c0','#ffffff'],3.0,36,13,32,130,'up'),
 powerblitz:BIG('Power Blitz',['#d8b010','#ffe86a','#fff8c0','#ffffff'],2.4,30,11,24,170),
 omega:BIG('Omega Blaster',['#2a9a20','#8af06a','#d0ffc0','#ffffff'],5,60,22,56,70),
 rebellion:BIG('Rebellion Trigger',['#2a6ad8','#7ab8ff','#e0f4ff','#ffffff'],3.0,36,13,32,140),
 victory:BIG('Victory Cannon',['#d86a10','#ffb03a','#fff3c0','#ffffff'],3.0,38,13,34,120),
 crush:BIG('Crush Cannon',['#c8204a','#ff6a8a','#ffd0e0','#ffffff'],2.8,36,13,30,140),
 kyabecannon:BIG('Cañón de Kyabe',['#d8a010','#ffe060','#fff3c0','#ffffff'],2.8,34,12,30,140),
 donut:{name:'Donut Galáctico',kind:'disc',pose:'up',sig:1,col:['#e0a010','#ffd23f','#fff8c0'],st:l=>({cd:2.4-l*0.16,dmg:20+l*7,count:1+(l>=3?1:0),range:0.5+l*0.04})},
 finalexp:NOVA('Final Explosion',['#ffd23f','#fff3a0','#ffffff'],9,90,30,70),
 hakai:NOVA('Hakai',['#7a24d8','#d08aff','#fff0ff'],7,70,25,60),
 roar:NOVA('Gigantic Roar',['#2a9a20','#8af06a','#f0fff0'],4,40,14,55),
 taiyoken:NOVA('Taiyoken',['#ffffff','#fff8c0','#ffffff'],6,5,2,90,1.6),
 mafuba:NOVA('Mafuba',['#2a9a20','#8af06a','#f0fff0'],7,20,8,70,2.5),
 dodonpa:BEAM('Dodonpa',['#d8b010','#fff06a','#ffffff'],4,24,9,230,7,0.3),
 taopunch:MELEE('Golpe de la Grulla',['#ffffff','#ff8ad0'],'punch',0.9,10,5,3,80,22),
 rogafu:MELEE('Rōgafūfūken',['#e8e8ff','#8ab0ff'],'punch',0.8,9,5,4,85,24),
 sokidan:SHOT('Sōkidan',['#3a8ad8','#a0e0ff','#ffffff'],1.4,16,6,1,330,{home:1,pierce:2}),
 kikoho:BEAM('Kikoho',['#c8a010','#ffe860','#ffffff'],3.6,30,11,200,14,0.4),
 burningatk:BEAM('Burning Attack',['#d86010','#ffb040','#fff3c0'],3.2,26,10,220,9,0.25),
 jankenpon:MELEE('Jan Ken',['#ffd23f','#ff8a3a'],'punch',1.1,14,6,3,80,26,{kb:120}),
 videlkick:MELEE('Patada Justiciera',['#ffffff','#c070ff'],'kick',0.85,10,5,3,90,24),
 kaishot:SHOT('Esfera Divina',['#d02a9a','#ff8ad8','#ffffff'],1.5,18,7,1,280,{pierce:3}),
 kaikai:NOVA('Kai Kai',['#3aa0ff','#a0e0ff','#ffffff'],5,30,10,75,0.8),
 coldcannon:BIG('Cañón de Cold',['#c02a7a','#ff7ac0','#ffe0f0','#ffffff'],3.0,34,12,30,130),
 slugball:BIG('Bola Explosiva',['#d8a010','#ffe060','#fff8d0','#ffffff'],3.2,32,12,30,120),
 slugarm:MELEE('Brazo Estirado',['#4ac040','#b0ff9a'],'punch',1.0,12,6,2,130,22,{kb:110}),
 hellstorm:BEAM('Tormenta Infernal',['#d8a010','#ffe860','#ffffff'],3.0,26,10,240,8,0.2),
 s17barrier:NOVA('Barrera Absorbente',['#3a8ad8','#a0e0ff','#ffffff'],7,15,6,60,0,{shield:1}),
 minusball:BIG('Minus Energy Power Ball',['#d86010','#ffb040','#fff3c0','#ffffff'],3.4,40,14,36,110),
 negaball:SHOT('Bola de Energía Negativa',['#c0207a','#ff6ad0','#ffffff'],1.6,20,8,1,260,{pierce:2}),
 giru:SHOT('Giru Bomba',['#c8c8d0','#ffffff','#ffd23f'],2.0,16,6,1,220,{home:1}),
 granolasnipe:BEAM('Disparo Certero',['#2ac070','#9affc0','#ffffff'],2.2,30,12,320,4,0.15),
 granolarain:SHOT('Lluvia de Ki',['#2ac070','#9affc0','#ffffff'],1.6,10,4,4,300),
 gasring:SHOT('Anillo Paralizador',['#d02ad0','#ff8aff','#ffffff'],1.8,14,6,1,240,{ring:1,pierce:3}),
 gasbeam:BEAM('Rayo de Gas',['#d02ad0','#ff8aff','#ffffff'],3.4,28,11,230,9,0.3),
 cuiblast:SHOT('Ráfaga de Cui',['#8a3ad8','#d0a0ff','#ffffff'],1.2,12,5,2,300),
 // ataques propios de cada personaje (sesión 9)
 deathbeam:{...BEAM('Rayo Mortal',['#a0207a','#ff6ad0','#ffffff'],1.6,24,9,260,3,0.15),st:l=>({cd:1.6-l*0.08,dmg:24+l*9,len:260,wid:4,dur:0.22,charge:0.15})},
 deathball:BOMB('Death Ball',['#c83a10','#ff8a3a','#ffd08a','#fff6e0'],7,70,26,40),
 supernova:BOMB('Supernova',['#c8204a','#ff6a8a','#ffd0e0','#ffffff'],7,74,27,42),
 sphere:BOMB('Esfera de Destrucción',['#5a1a8a','#b06aff','#f0d0ff','#ffffff'],7.5,80,28,44),
 revdeathball:BOMB('Revenge Death Ball',['#a01a1a','#ff5a3a','#ffb08a','#ffffff'],7.5,78,28,44),
 doublesunday:BEAM('Double Sunday',['#7a24d8','#d08aff','#fff0ff'],5.5,34,12,240,16,0.6),
 saturday:BIG('Saturday Crush',['#7a24d8','#d08aff','#fff0ff','#ffffff'],2.6,30,11,26,170),
 hellflash:BEAM('Hell Flash',['#c89a10','#ffe066','#ffffff'],6,40,14,270,20,0.8),
 rocketpunch:BIG('Puño Cohete',['#5a6a7a','#c0d0e0','#ffffff','#ffffff'],2.6,34,12,22,220),
 barrier:NOVA('Barrera',['#3a8aff','#bfe6ff','#ffffff'],6,18,6,56,0,{shield:1.6}),
 solarkame:BEAM('Kamehameha Solar',['#1a6ad8','#7ad0ff','#ffffff'],7,50,17,310,26,0.9),
 choco:SHOT('Rayo Chocolate',['#d02a80','#ff8ad0','#ffe0f0'],1.1,10,4,2,200,{pierce:2,home:1}),
 vanish:BIG('Bola Desvanecedora',['#d02a80','#ff8ad0','#ffe0f0','#ffffff'],3,40,14,36,110),
 killdriver:NOVA('Kill Driver',['#8a1a1a','#ff7a3a','#ffffff'],4,36,13,62),
 calamity:BEAM('Calamity Blaster',['#8a1a1a','#ff7a3a','#ffffff'],6,40,14,260,18,0.8),
 timeskip:NOVA('Salto Temporal',['#7a3ad8','#d0b0ff','#ffffff'],6,26,9,90,2.2),
 holywrath:BEAM('Ira Divina',['#2a9a20','#c0ff8a','#ffffff'],6,42,15,270,20,0.8),
 powerimpact:BIG('Power Impact',['#c8202a','#ff8a6a','#ffd0c0','#ffffff'],3,44,15,38,120),
 jirenrush:MELEE('Golpe del Orgullo',['#ff5a3a','#ffd0c0'],'atk',1.3,22,8,3,160,28,{kb:200}),
 justiceflash:SHOT('Justice Flash',['#2a9a20','#8af06a','#f0fff0'],1.3,10,4,4,230,{home:1}),
 absorb:NOVA('Absorción de Energía',['#2a6a5a','#8af0c0','#f0fff0'],6,30,10,70,0,{heal:0.25}),
 dimsword:SWORD('Espada Dimensional',['#8a1a2a','#ff5a6a'],1.4,30,10,56,2.6),
 rakshasa:MELEE('Garra Rakshasa',['#8a1a2a','#ff8a9a'],'atk',2.4,16,6,4,200,30,{tp:1}),
 evilkame:BEAM('Kamehameha Maligno',['#3a1a5a','#a050d0','#ffd0ff'],6.5,46,16,290,22,0.8),
 soulpunisher:NOVA('Soul Punisher',['#a02ad8','#ff6ad0','#ffe0ff'],6,48,17,80),
 ikarikame:BEAM('Kamehameha Ikari',['#2a9a20','#8af06a','#f0fff0'],6.5,46,16,290,22,0.8),
 beastcannon:{...BEAM('Cañón Especial Bestia',['#c8c8e0','#ffffff','#ffffff'],5,52,18,320,8,0.9),spiral:1},
 brablast:SHOT('Ráfaga de Bra',['#d02a80','#ff8ad0','#fff0f8'],1.0,8,3,4,230,{home:1}),
 timebreak:NOVA('Ruptura del Tiempo',['#5a1a6a','#c060d0','#ffe0ff'],6,30,11,85,1.8),
 acidspit:SHOT('Ácido Saibaman',['#4a8a1a','#a0f040','#f0ffc0'],1.0,7,3,2,170,{pierce:1}),
 // personajes de DeviantArt (sesión 10)
 breakcannon:BEAM('Break Cannon',['#d86a10','#ffb03a','#ffffff'],6,42,15,270,20,0.8),
 bomberdx:NOVA('Bomber DX',['#d86a10','#ffb03a','#fff3c0'],6,44,16,75),
 milky:BEAM('Milky Cannon',['#7a24d8','#d08aff','#ffffff'],5.5,40,14,260,18,0.7),
 bodychange:NOVA('Cambio de Cuerpo',['#7a24d8','#d08aff','#ffffff'],7,20,8,80,2.2),
 crusherball:BIG('Crusher Ball',['#c8202a','#ff6a3a','#ffd08a','#ffffff'],2.8,36,13,30,150),
 psychorock:SHOT('Rocas Psíquicas',['#6a4a2a','#b08a5a','#f0e0c0'],1.4,10,4,3,200,{home:1}),
 timefreeze:NOVA('Parada del Tiempo',['#2a9a20','#8af06a','#f0fff0'],7,10,4,110,2.6),
 kiai:NOVA('Kiai',['#c8d0e8','#ffffff','#ffffff'],3.5,26,10,70),
 megaton:MELEE('Megaton Punch',['#ffffff','#ffd23f'],'atk',1.6,26,10,1,120,30,{kb:220}),
 dynamite:MELEE('Dynamite Kick',['#ff8a3a','#ffd23f'],'kick',1.8,24,9,2,140,30,{kb:200}),
 presentbomb:BOMB('Regalo Explosivo',['#c8202a','#ff8a6a','#ffd0c0','#ffffff'],6,50,18,36),
 photonwave:BEAM('Photon Wave',['#d02a80','#ff8ad0','#ffffff'],6,44,15,280,20,0.8),
 fullcourse:NOVA('Menú Completo',['#d02a80','#ff8ad0','#ffe0f0'],7,34,12,70,0,{heal:0.3}),
});
const SIGS={goku:['kiblast','punch','kame','kaioken','instant','genki'],vegeta:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 piccolo:['kiblast','punch','eyebeam','makanko','hellzone','lightgren'],krilin:['kiblast','kick','kienzan','scatter','taiyoken','kame'],
 gohan:['kiblast','kick','masenko','kame','gekiretsu','fskame'],trunks:['kiblast','tsword','burning','finishbuster','heatdome','masenko'],
 a18:['a18volley','kick','kienzan','powerblitz','punch'],bardock:['kiblast','punch','riot','kick','rebellion','finalspirit'],
 broly:['blaster','lariat','eraser','roar','omega','kick'],vegetto:['kiblast','punch','finalkame','spiritsword','bigbang','kick'],
 gogeta:['kiblast','punch','kick','bbkame','stardust'],black:['lances','kiblade','blackkame','punch','scythe','kick'],
 gokuui:['kiblast','silver','kick','kame','instant','genki'],vegetaue:['kiblast','punch','galick','finalflash','hakai','bigbang'],
 gotenks:['ghost','punch','donut','victory','kick'],kefla:['blaster','kick','giganticray','punch','roar'],caulifla:['renzoku','kick','crush','punch','roar'],
 kale:['blaster','lariat','eraser','roar','kick'],kyabe:['kiblast','punch','galick','renzoku','kyabecannon','kick'],
 gohanadult:['kiblast','punch','masenko','kame','makanko','fskame'],gokugt:['kiblast','punch','kame','instant','dragonfist','kame10x'],
 vegetagt:['kiblast','punch','galick','bigbang','finalshine','kick'],gokusuper:['kiblast','punch','kaioken','kame','godkame','genki'],
 vegetasuper:['renzoku','punch','galick','bigbang','finalflash','gamma'],trunkscell:['kiblast','tsword','burning','finishbuster','kick','heatdome'],
 roshi:['kiblast','punch','kame','mafuba','kick']};
// villanos y variantes: técnicas propias de la serie (antes casi todos tenían la misma lista)
const SIGS_SERIE={raditz:['kiblast','punch','saturday','doublesunday','kick','renzoku'],saibaman:['acidspit','punch','kick','scatter','finalexp'],
 a16:['kiblast','punch','rocketpunch','hellflash','kick','finalexp'],a17:['a18volley','kick','barrier','powerblitz','punch'],
 freezer:['deathbeam','kienzan','punch','lances','deathball','kick'],cooler:['deathbeam','kienzan','punch','kick','supernova'],
 janemba:['kiblast','dimsword','rakshasa','hellzone','kick'],cell:['kiblast','punch','kame','kienzan','solarkame','finalexp'],
 buu:['choco','punch','kick','vanish','finalexp','roar'],turles:['kiblast','punch','killdriver','kick','calamity','renzoku'],
 bills:['kiblast','punch','kick','sphere','hakai'],frost:['deathbeam','punch','lances','kick','kienzan'],
 hit:['kiblast','instant','timeskip','punch','silver'],zamasu:['kiblast','kiblade','lances','holywrath','kick','scythe'],
 jiren:['kiblast','jirenrush','powerimpact','kick','roar','omega'],toppo:['justiceflash','punch','kick','powerblitz','hakai'],
 moro:['kiblast','punch','absorb','kick','omega'],babyvegeta:['kiblast','punch','galick','kick','finalshine','revdeathball'],
 cumber:['kiblast','punch','evilkame','kick','eraser','roar'],gokuxeno:['kiblast','punch','kame10x','instant','kaioken','dragonfist'],
 gohanposeido:['kiblast','punch','kick','masenko','evilkame'],bardockalt:['kiblast','punch','kick','riot','rebellion','finalspirit'],
 brolyfan:['eraser','lariat','blaster','omega','roar','kick'],zombies:['kiblast','punch','kick','kame','galick','finalexp'],
 gohandbs:['kiblast','kick','masenko','gekiretsu','makanko','fskame'],gohanmanga:['kiblast','punch','masenko','makanko','kick','beastcannon'],
 bra:['brablast','kick','punch','masenko','renzoku'],dlrx:['kiblast','punch','kick','renzoku','finishbuster','kame'],
 gogetafan:['kiblast','punch','kick','bbkame','stardust','soulpunisher'],vegettofan:['kiblast','spiritsword','punch','finalkame','kick','kiblade'],
 gokumoro:['kiblast','silver','kick','kame','instant','godkame'],gokubroly:['kiblast','punch','kame','instant','godkame','genki'],
 vegetamanga:['kiblast','punch','galick','finalflash','gamma','finalexp'],vegetabroly:['renzoku','punch','galick','finalflash','gamma','finalexp'],
 blacktime:['lances','kiblade','blackkame','timebreak','kick','scythe'],blackfan:['kiblade','lances','scythe','blackkame','timebreak','kick'],
 gokualt:['kiblast','punch','kaioken','ikarikame','dragonfist','genki'],
 nappa:['kiblast','punch','breakcannon','kick','bomberdx','lariat'],ginyu:['kiblast','punch','kick','milky','bodychange','renzoku'],
 jeice:['kiblast','punch','kick','crusherball','renzoku'],guldo:['kiblast','punch','kick','psychorock','timefreeze'],
 uub:['kiblast','punch','kick','kiai','kame','renzoku'],mrsatan:['punch','kick','megaton','dynamite','presentbomb'],
 a21:['kiblast','punch','kick','choco','photonwave','fullcourse'],
 jirengray:['kiblast','jirenrush','powerimpact','kick','roar','omega'],
 vegettofalso:['kiblast','punch','finalkame','spiritsword','bigbang','kick'],trunksarmor:['kiblast','punch','burning','kick','finishbuster','renzoku'],
 blackkaioshin:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 blackfalso:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 blackrosen:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 blackmajin:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 gokuyardrat:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuyardratssj:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuyardratswl:['kiblast','punch','kame','kaioken','instant','genki'],
 vegetayardrat:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 gokussj4gt:['kiblast','punch','kame','kaioken','instant','genki'],
 vegetassj4gt:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetassjwhis:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetabluewhis:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetablue092:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetablueulsw:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetabluefp:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetablueevo:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetabaseulsw:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetaego:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetaxeno:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetassjhd:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetauihd:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 vegetabluemal:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 gokussj3mais:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussj3swl:['kiblast','punch','kame','kaioken','instant','genki'],
 gokubluewhis:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuuisign:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuifp:['kiblast','punch','kame','kaioken','instant','genki'],
 gokupatrulla:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjchaqueta:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuigranola:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuuiverdadero:['kiblast','punch','kame','kaioken','instant','genki'],
 gokubluemoro:['kiblast','punch','kame','kaioken','instant','genki'],
 gokubluedbfz:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuimanga:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuuimanga:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussj2buu:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjkaioken:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuevilssj2:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuiblueevo:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuiblue:['kiblast','punch','kame','kaioken','instant','genki'],
 gokumuidios:['kiblast','punch','kame','kaioken','instant','genki'],
 gokuultradios:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjsupremo:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussj4dios:['kiblast','punch','kame','kaioken','instant','genki'],
 gokudiosberserk:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjlegend:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjkaioken2:['kiblast','punch','kame','kaioken','instant','genki'],
 goku044:['kiblast','punch','kame','kaioken','instant','genki'],
 goku045:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussj053:['kiblast','punch','kame','kaioken','instant','genki'],
 gokussjfp:['kiblast','punch','kame','kaioken','instant','genki'],
 blackrose290:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 gokussj4daima:['kiblast','punch','kame','kaioken','instant','genki'],
 zamasufusion:['kiblast','kiblade','blackkame','lances','scythe','kick'],
 bramajin:['kiblast','punch','kick','kame','renzoku'],
 vegitoblue254:['kiblast','punch','finalkame','spiritsword','bigbang','kick'],
 vegetamui:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 gokureymono:['kiblast','punch','kame','kaioken','instant','genki'],
 taopaipai:['kiblast','taopunch','kick','dodonpa','renzoku'],
 tenshinhan:['kiblast','punch','kick','kame','renzoku'],
 trunksnino:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 gokunino:['kiblast','punch','kame','kaioken','instant','genki'],
 videl:['kiblast','punch','kick','kame','renzoku'],
 shin:['kiblast','punch','kick','kame','renzoku'],
 kibitoshin:['kiblast','punch','kick','kame','renzoku'],
 cui:['kiblast','punch','kick','kame','renzoku'],
 reycold:['kiblast','punch','kick','kame','renzoku'],
 tarble:['kiblast','punch','galick','bigbang','finalflash','finalexp'],
 slug:['kiblast','punch','kick','kame','renzoku'],
 pangt:['kiblast','punch','kame','kaioken','instant','genki'],
 super17:['kiblast','punch','kick','kame','renzoku'],
 omega:['kiblast','punch','kick','kame','renzoku'],
 gas:['kiblast','punch','kick','kame','renzoku'],
 granola:['kiblast','punch','kick','kame','renzoku']};
for(const id in NUEVOS)SIGS[id]=SIGS_SERIE[id]||NUEVOS[id].sig;
// 3 nov.: técnicas propias del plan «sprites para casa»
Object.assign(SIGS,{yamcha:['kiblast','rogafu','kick','sokidan','kame'],tenshinhan:['kiblast','punch','kikoho','taiyoken','dodonpa','kick'],
 goten:['kiblast','punch','kame','kick','renzoku'],gokunino:['kiblast','punch','jankenpon','kame','kick'],videl:['kiblast','videlkick','punch','renzoku','kick'],
 shin:['kiblast','punch','kaishot','kaikai','kick'],kibitoshin:['kiblast','punch','kaikai','kaishot','kick'],cui:['kiblast','punch','cuiblast','kick','renzoku'],
 trunksnino:['kiblast','punch','burningatk','kick','renzoku']});
const UNLOCK_LV=[1,1,3,6,10,15];
let FO=null;const fxSl=[],fxRg=[];
function sigList(hid=S.hid){if(SIGS[hid])return SIGS[hid];const st=HEROES[hid]&&HEROES[hid].start;return['kiblast','punch',MV[st]&&st!=='kiblast'?st:'kame','kick','renzoku']}
function sigOpen(){return sigList().slice(0,P.sigU||2)}
function sigLv(i){return clamp(1+((P.sigB&&P.sigB[i])||0)+Math.floor(P.lvl/12),1,5)}
function sigSelect(n){if(state!=='play'||!P)return;const L=sigOpen();if(n<0||n>=L.length||n===P.sel)return;P.sel=n;P.sigT=Math.min(P.sigT,0.25);sfx('shot')}
function sigReach(W,st){return W.kind==='melee'?st.reach:W.kind==='sword'?st.rad+70:W.kind==='beam'?Math.min(st.len,300):W.kind==='nova'?st.rad:W.kind==='big'?220:260}
// hand position: chest height, a little in front of the hero; 'up' attacks come from above the head
// si el enemigo está encima o debajo, la bola sale de la mano por arriba o por abajo
function sigOrigin(pose,a){const f=pose==='beam'?13:8;return pose==='up'?{x:P.x,y:P.y-34}:{x:P.x+Math.cos(a)*f,y:P.y-13+Math.sin(a)*(pose==='beam'?3:9)}}
function sigUpdate(dt,ps){
  const L=sigOpen();if(P.sel>=L.length)P.sel=0;
  if(L.length>P.sigN){if(P.sigN)P.newSig={t:3.2,i:L.length-1};P.sigN=L.length}
  if(P.newSig&&(P.newSig.t-=dt)<=0)P.newSig=null;
  if(P.kaioT>0)P.kaioT-=dt;if(P.powT>0)P.powT-=dt;if(P.shieldT>0)P.shieldT-=dt;
  for(const a of [fxSl,fxRg])for(let i=a.length-1;i>=0;i--)if((a[i].t+=dt)>=a[i].dur)a.splice(i,1);
  if(P.dash){const D=P.dash,k=Math.min(1,dt/Math.max(dt,D.t));parts.push({x:P.x+rnd(-4,4),y:P.y-rnd(4,24),vx:0,vy:-8,t:0.25,c:D.c,s:2});
    if(solidMove(P,(D.x-P.x)*k,(D.y-P.y)*k,5))P.dash=null;else if((D.t-=dt)<=0)P.dash=null}
  if(P.combo&&!P.dash){const C=P.combo;if((C.t-=dt)<=0){C.t=0.09;C.i++;const last=C.i>=C.n,hx=P.x+C.d*10,hy=P.y-6;
      near(hx,hy,C.rad+14,e=>{if(Math.hypot(e.x-hx,e.y-hy)<C.rad+e.r){hurt(e,C.dmg,C.d*C.kb*(last?1:MELEE_AJ.empuje),0);if(!e.boss&&(!ET[e.type].elite||(e.golpesR=(e.golpesR||0)+1)%2===0))e.stun=Math.max(e.stun||0,MELEE_AJ.aturde)}});
      for(let i=0;i<5;i++)parts.push({x:hx+C.d*rnd(4,12),y:hy-rnd(4,16),vx:C.d*rnd(20,70),vy:rnd(-40,10),t:0.22,c:C.col[i%2],s:2});
      if(C.dragon&&last){fxRg.push({x:hx,y:hy-6,t:0,dur:0.5,rad:C.rad*1.6,col:C.col});cam.shake=Math.max(cam.shake||0,6)}
      P.atkT=P.atkD=0.16;P.atkK=C.kick?2:0;P.atkA=C.d>0?0:Math.PI;if(last)P.combo=null}}
  if(P.swing&&!P.dash&&(P.swing.t-=dt)<=0){const G=P.swing,t=G.tg,a=Math.atan2(t.y-P.y,t.x-P.x);P.swing=null;
    near(P.x,P.y-6,G.rad+14,e=>{const ea=Math.atan2(e.y-P.y,e.x-P.x),df=Math.abs(((ea-a)%TAU+TAU*1.5)%TAU-Math.PI);if(df<G.arc/2&&Math.hypot(e.x-P.x,e.y-P.y)<G.rad+e.r)hurt(e,G.dmg,Math.cos(a)*90,Math.sin(a)*90)});
    fxSl.push({x:P.x,y:P.y-10,a,arc:G.arc,r:G.rad,t:0,dur:0.22,col:G.col});P.atkT=P.atkD=0.25;P.atkK=0;P.atkA=a;sfx('shot')}
  if(P.pend){const Q=P.pend;if((Q.t-=dt)<=0){P.pend=null;FO=sigOrigin(Q.pose,Q.a);fire(Q.id,Q.m,Q.st,ps);FO=null}return}
  if(P.cast||P.combo||P.dash||P.swing)return;
  if((P.sigT-=dt*(S.ev&&S.ev.k==='fusion'?1.6:1))>0)return;
  const id=L[P.sel];if(!id)return;const W=MV[id],st=W.st(sigLv(P.sel)),m={lv:sigLv(P.sel),evo:false};
  const t=nearest(P.x,P.y,sigReach(W,st));if(!t){P.sigT=0.1;return}
  const a=Math.atan2(t.y-6-(P.y-13),t.x-P.x);P.sigT=P.sigCD=Math.max(0.35,st.cd*ps.cd);
  if(W.pose==='up'||W.kind==='nova'||(W.kind!=='beam'&&W.kind!=='melee'&&W.kind!=='sword'&&W.pose==='cast')){
    const up=W.pose==='up',wind=up?0.5:W.kind==='nova'?0.3:0.12;
    P.pend={id,m,st,t:wind,T:wind,pose:up?'up':W.pose,a,col:W.col};{const d=Math.cos(a)<0?-1:1;if(!P.moving){P.face=d;P.dir='side'}}return}
  FO=sigOrigin(W.pose,a);fire(id,m,st,ps);FO=null}
function fireSig(W,st,dmg,ps){
  const t=nearest(P.x,P.y,sigReach(W,st)+10);if(!t)return;const d=t.x>=P.x?1:-1;if(!P.moving){P.face=d;P.dir='side'}
  if(W.kind==='melee'){const far=Math.hypot(t.x-P.x,t.y-P.y)>st.rad*0.8,tx=t.x-d*MELEE_AJ.parada,ty=t.y+1;
    if(far&&W.tp){for(let i=0;i<10;i++)parts.push({x:P.x+rnd(-6,6),y:P.y-rnd(0,30),vx:rnd(-24,24),vy:-rnd(10,34),t:0.35,c:W.col[0],s:2});P.x=tx;P.y=ty;solidPlace(P,5,1)}
    else if(far)P.dash={x:tx,y:ty,t:0.12,c:W.col[0]};
    P.combo={n:st.hits,i:0,t:0,d,dmg,rad:st.rad*ps.area,kb:st.kb,col:W.col,kick:W.pose==='kick',dragon:W.dragon};P.iframe=Math.max(P.iframe,st.hits*0.09+MELEE_AJ.guardaExtra);
    if(W.kaio)P.kaioT=1.4;if(W.dragon)sfx('charge');return}
  if(W.kind==='sword'){let dd=Math.hypot(t.x-P.x,t.y-P.y);const rad=st.rad*ps.area;
    if(dd>rad*0.8){const a0=Math.atan2(t.y-P.y,t.x-P.x),k=(dd-rad*0.6)/dd;P.dash={x:P.x+(t.x-P.x)*k,y:P.y+(t.y-P.y)*k,t:0.1,c:W.col[0]}}
    P.swing={t:0.12,tg:t,rad,arc:st.arc,dmg,col:W.col};return}
  if(W.kind==='nova'){const rad=st.rad*ps.area;let hit=0;near(P.x,P.y-6,rad+14,e=>{const dx=e.x-P.x,dy=e.y-P.y,dd=Math.hypot(dx,dy)||1;if(dd<rad+e.r){hurt(e,dmg,dx/dd*180,dy/dd*180);hit++;if(st.stun)e.stun=st.stun}});
    // barrera: invulnerable un rato; absorción: cura según los enemigos tocados
    if(W.shield){P.iframe=Math.max(P.iframe,W.shield);P.shieldT=W.shield}
    if(W.heal&&hit){const mx=stats().maxhp;P.hp=Math.min(mx,P.hp+mx*0.03*Math.min(hit,8)*W.heal*4);fx(P.x,P.y-12,'green',18,0.5)}
    fxRg.push({x:P.x,y:P.y-10,t:0,dur:0.45,rad,col:W.col});if(st.stun)S.flash=Math.max(S.flash,0.25);cam.shake=Math.max(cam.shake||0,5);P.atkT=P.atkD=0.3;P.atkK=1;P.atkA=d>0?0:Math.PI;sfx('charge')}}
function sigIcon(id){const k='s:'+id;if(ICON_C[k])return ICON_C[k];if(MV0.has(id))return ICON_C[k]=ic(id);
  const W=MV[id],c=mk(16,16),g=c.getContext('2d'),px=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)},C=W.col;
  switch(W.kind){
   case 'beam':px(0,6,12,4,C[0]);px(0,7,12,2,C[1]);pball(g,12,8,3,[C[0],C[1],'#ffffff']);break;
   case 'big':pball(g,8,8,6,[C[0],C[1],C[2]||'#ffffff','#ffffff']);break;
   case 'shot':pball(g,4,4,2,[C[0],C[1],'#ffffff']);pball(g,11,7,2,[C[0],C[1],'#ffffff']);pball(g,5,12,2,[C[0],C[1],'#ffffff']);break;
   case 'disc':for(let x=-6;x<=6;x++){const h=Math.round(Math.sqrt(36-x*x)/3);px(8+x,8-h,1,h*2+1,C[1])}px(6,7,4,3,'rgba(0,0,0,0)');g.clearRect(6,7,4,3);break;
   case 'nova':for(let a=0;a<TAU;a+=0.2){px(Math.round(8+Math.cos(a)*6),Math.round(8+Math.sin(a)*6),1,1,C[0]);px(Math.round(8+Math.cos(a)*4),Math.round(8+Math.sin(a)*4),1,1,C[1])}px(7,7,2,2,'#ffffff');break;
   case 'sword':for(let i=0;i<11;i++){px(2+i,13-i,2,1,C[1]);px(3+i,13-i,1,1,'#ffffff')}px(2,11,4,1,'#8a6a3a');break;
   default:{const s=W.pose==='kick';px(5,4,6,7,C[1]);px(4,5,8,5,C[1]);px(6,5,4,2,'#ffffff');for(const [x,y] of [[1,2],[14,3],[2,13],[13,13],[8,0],[8,15]])px(x,y,1,1,C[0]);if(s)px(3,11,10,2,C[0])}}
  return ICON_C[k]=addOutline(c,'#101020')}
const CARDS={
 power:{name:'Entrenamiento',ds:'+12% de daño'},
 hp:{name:'Gravedad x100',ds:'+20 de vida máxima'},
 armor:{name:'Armadura Saiyan',ds:'-1 de daño recibido'},
 speed:{name:'Sin pesas',ds:'+8% de velocidad'},
 cd:{name:'Control del Ki',ds:'-8% de recarga'},
 magnet:{name:'Rastreador',ds:'+35% radio de recogida'},
 regen:{name:'Semillas Senzu',ds:'+0.5 vida por segundo'},
 area:{name:'Concentración',ds:'+10% de área'},
 xp:{name:'Sabiduría de Kaio',ds:'+10% de experiencia'},
};
const ET={
 crate:{n:'Caja',hp:20,spd:0,dmg:0,xp:0,r:8},
 saiba:{n:'Saibaman',hp:8,spd:32,dmg:5,xp:1,r:6},
 soldier:{n:'Soldado',hp:18,spd:28,dmg:8,xp:2,r:7,shoot:3.6},
 rrsoldier:{n:'Soldado Red Ribbon',hp:18,spd:30,dmg:8,xp:2,r:7,shoot:3.2},
 majin:{n:'Esbirro de Babidi',hp:22,spd:32,dmg:9,xp:2,r:7,shoot:3.4},
 blob:{n:'Bolita de Buu',hp:12,spd:46,dmg:6,xp:1,r:5},
 celljr:{n:'Cell Jr.',hp:34,spd:50,dmg:10,xp:3,r:6},
 a17e:{n:'ANDROIDE 17',hp:450,spd:58,dmg:15,xp:45,r:8,elite:1,shoot:1.8,hero:['a17npc',0]},
 a18e:{n:'ANDROIDE 18',hp:420,spd:62,dmg:15,xp:45,r:8,elite:1,shoot:2,hero:['a18npc',0]},
 raditzE:{n:'RADITZ',hp:520,spd:56,dmg:16,xp:45,r:8,elite:1,shoot:1.7,alias:'raditz'},
 nappaE:{n:'NAPPA',hp:700,spd:44,dmg:18,xp:50,r:9,elite:1,alias:'nappa'},
 celljrE:{n:'CELL JR.',hp:260,spd:74,dmg:13,xp:25,r:7,elite:1},
 shadow:{n:'TU SOMBRA',hp:900,spd:60,dmg:18,xp:80,r:8,elite:1,shoot:1.4,hero:['goku',0],aura:'red'},
 burter:{n:'BURTER',hp:420,spd:52,dmg:14,xp:40,r:8,elite:1},
 jeice:{n:'JEICE',hp:380,spd:44,dmg:14,xp:40,r:8,elite:1,shoot:1.6},
 guldo:{n:'GULDO',hp:320,spd:36,dmg:12,xp:40,r:8,elite:1,shoot:2.2},
 saibaX:{n:'Saibaman suicida',hp:30,spd:60,dmg:28,xp:4,r:6,kami:1},
 saibaR:{n:'Saibaman rojo',hp:55,spd:44,dmg:12,xp:5,r:6},
 soldierE:{n:'Élite',hp:80,spd:32,dmg:14,xp:7,r:7,shoot:2.6},
 saibaB:{n:'Saibaman de ki',hp:18,spd:30,dmg:8,xp:2,r:6,shoot:3.4},
 cellsemiE:{n:'CELL SEMIPERFECTO',hp:300,spd:70,dmg:13,xp:25,r:8,elite:1},
 vegetaE:{n:'VEGETA',hp:620,spd:56,dmg:17,xp:50,r:8,elite:1,shoot:1.8},
 turlesE:{n:'TURLES',hp:480,spd:54,dmg:15,xp:40,r:8,elite:1,shoot:1.8},
 frostE:{n:'FROST',hp:420,spd:58,dmg:14,xp:40,r:8,elite:1,shoot:1.6},
 hitE:{n:'HIT',hp:560,spd:62,dmg:17,xp:50,r:8,elite:1,shoot:2},
 zamasuE:{n:'ZAMASU',hp:520,spd:58,dmg:16,xp:50,r:8,elite:1,shoot:1.7},
 superbuuE:{n:'SUPER BUU',hp:780,spd:56,dmg:18,xp:55,r:9,elite:1,shoot:1.9},
 coolerE:{n:'COOLER',hp:600,spd:54,dmg:17,xp:50,r:8,elite:1,shoot:1.6},
 a16E:{n:'ANDROIDE 16',hp:820,spd:40,dmg:18,xp:55,r:9,elite:1,shoot:2.4},
 cellimpE:{n:'CELL IMPERFECTO',hp:540,spd:60,dmg:15,xp:45,r:8,elite:1},
 kidbuuE:{n:'KID BUU',hp:650,spd:66,dmg:16,xp:50,r:8,elite:1,shoot:1.9,alias:'buu'},
 fatbuuE:{n:'MAJIN BUU',hp:900,spd:38,dmg:18,xp:55,r:10,elite:1,alias:'fatbuu'},
 majinvE:{n:'MAJIN VEGETA',hp:700,spd:58,dmg:17,xp:50,r:8,elite:1,shoot:1.7,alias:'majinv'},
 dodoria:{n:'DODORIA',boss:1,ai:'dash'},
 turles:{n:'TURLES',boss:1,ai:'frieza'},
 frost:{n:'FROST',boss:1,ai:'dash'},
 coolerB:{n:'COOLER',boss:1,ai:'frieza'},
 vegetaSB:{n:'VEGETA',boss:1,ai:'dash'},
 freezaF:{n:'FREEZER FORMA FINAL',boss:1,ai:'spiral'},
 a16B:{n:'ANDROIDE 16',boss:1,ai:'dash'},
 janemba:{n:'SUPER JANEMBA',boss:1,ai:'buu'},
 jiren:{n:'JIREN',boss:1,ai:'dash'},
 hitB:{n:'HIT',boss:1,ai:'dash'},
 superbuuB:{n:'SUPER BUU',boss:1,ai:'buu'},
 zamasuB:{n:'ZAMASU',boss:1,ai:'frieza'},
 billsB:{n:'BILLS',boss:1,ai:'spiral'},
 zarbon:{n:'ZARBON',boss:1,ai:'frieza'},
 ginyu:{n:'CAPITÁN GINYU',boss:1,ai:'dash'},
 frieza:{n:'FREEZER',boss:1,ai:'frieza'},
 frieza100:{n:'FREEZER 100%',boss:1,ai:'spiral'},
 golden:{n:'GOLDEN FREEZER',boss:1,ai:'buu'},
 raditz:{n:'RADITZ',boss:1,ai:'frieza'},
 nappa:{n:'NAPPA',boss:1,ai:'dash'},
 mecha:{n:'MECA FREEZER',boss:1,ai:'spiral'},
 a19:{n:'ANDROIDE 19',boss:1,ai:'spiral'},
 appuleE:{n:'APPULE',hp:360,spd:60,dmg:13,xp:38,r:8,elite:1,shoot:1.7},
 cuiE:{n:'CUI',hp:400,spd:64,dmg:14,xp:40,r:8,elite:1,shoot:1.6},
 blueE:{n:'GENERAL BLUE',hp:480,spd:58,dmg:15,xp:44,r:8,elite:1},
 murasakiE:{n:'NINJA MURASAKI',hp:380,spd:66,dmg:13,xp:38,r:8,elite:1,shoot:2},
 reycoldB:{n:'REY COLD',boss:1,ai:'frieza'},
 slugB:{n:'LORD SLUG',boss:1,ai:'dash'},
 myuuB:{n:'DR. MYUU',boss:1,ai:'dash'},
 super17B:{n:'SUPER 17',boss:1,ai:'frieza'},
 omegaB:{n:'OMEGA SHENRON',boss:1,ai:'cell'},
 gasB:{n:'GAS',boss:1,ai:'dash'},
 zangyaE:{n:'ZANGYA',hp:420,spd:64,dmg:14,xp:42,r:8,elite:1,shoot:1.6},
 bujinE:{n:'BUJIN',hp:400,spd:60,dmg:14,xp:40,r:8,elite:1,shoot:1.9},
 geroE:{n:'DR. GERO',hp:520,spd:50,dmg:15,xp:45,r:8,elite:1,shoot:1.7},
 cell:{n:'CELL PERFECTO',boss:1,ai:'cell'},
 dabura:{n:'DABURA',boss:1,ai:'frieza'},
 fatbuu:{n:'MAJIN BUU',boss:1,ai:'buu'},
 buu:{n:'KID BUU',boss:1,ai:'buu'},
 black:{n:'GOKU BLACK',boss:1,ai:'dash',hero:['black',0]},
 rose:{n:'BLACK SSJ ROSÉ',boss:1,ai:'frieza',hero:['black',2],aura:'red'},
 majinv:{n:'MAJIN VEGETA',boss:1,ai:'dash',hero:['vegeta',3],aura:'gold'},
 brolyB:{n:'BROLY LEGENDARIO',boss:1,ai:'buu',hero:['broly',3],aura:'green'},
 gokuB:{n:'GOKU SSJ',boss:1,ai:'dash',hero:['goku',1],aura:'gold'},
 vegetaB:{n:'VEGETA SSJ',boss:1,ai:'dash',hero:['vegeta',1],aura:'gold'},
 trunksB:{n:'TRUNKS SSJ',boss:1,ai:'dash',hero:['trunks',1],aura:'gold'},
 piccoloB:{n:'PICCOLO DAIMAKU',boss:1,ai:'frieza',hero:['piccolo',0],aura:'green'},
 a17B:{n:'ANDROIDE 17',boss:1,ai:'dash',hero:['a17npc',0]},
 renegA:{n:'Saiyan renegado',hp:40,spd:40,dmg:10,xp:4,r:7},
 renegB:{n:'Saiyan de élite',hp:60,spd:46,dmg:12,xp:5,r:7,shoot:3},
 renegC:{n:'Saiyan oscuro',hp:85,spd:50,dmg:14,xp:6,r:7},
 kingvegE:{n:'REY VEGETA',hp:360,spd:50,dmg:13,xp:35,r:8,elite:1,shoot:2},
 raditzssjE:{n:'RADITZ SSJ',hp:460,spd:58,dmg:15,xp:42,r:8,elite:1,shoot:1.8},
 vegsaiE:{n:'VEGETA SAIYAN',hp:520,spd:58,dmg:16,xp:45,r:8,elite:1,shoot:1.7},
 freeza2E:{n:'FREEZER 2ª FORMA',hp:640,spd:52,dmg:17,xp:50,r:9,elite:1,shoot:1.8},
 cellperfE:{n:'CELL PERFECTO',hp:700,spd:62,dmg:18,xp:55,r:8,elite:1,shoot:1.7},
 a21E:{n:'ANDROIDE 21',hp:620,spd:58,dmg:16,xp:50,r:8,elite:1,shoot:1.6},
 buuthinE:{n:'BUU MALIGNO',hp:720,spd:60,dmg:17,xp:52,r:8,elite:1,shoot:1.8},
 gohanpossE:{n:'GOHAN POSEÍDO',hp:680,spd:64,dmg:17,xp:52,r:8,elite:1,shoot:1.6},
 frost2E:{n:'FROST FINAL',hp:560,spd:60,dmg:16,xp:48,r:8,elite:1,shoot:1.6},
 black2E:{n:'GOKU BLACK',hp:640,spd:64,dmg:17,xp:52,r:8,elite:1,shoot:1.7},
 hit2E:{n:'HIT (SALTO TEMPORAL)',hp:700,spd:66,dmg:18,xp:55,r:8,elite:1,shoot:1.9},
 zamasuhE:{n:'ZAMASU CORRUPTO',hp:760,spd:60,dmg:18,xp:56,r:8,elite:1,shoot:1.6},
 kalessjE:{n:'KALE BERSERKER',hp:900,spd:56,dmg:20,xp:60,r:9,elite:1},
 fakegokuE:{n:'GOKU FALSO',hp:820,spd:62,dmg:19,xp:58,r:8,elite:1,shoot:1.7},
 freeza1B:{n:'FREEZER 1ª FORMA',boss:1,ai:'frieza'},
 freeza2B:{n:'FREEZER 2ª FORMA',boss:1,ai:'dash'},
 freeza3B:{n:'FREEZER 3ª FORMA',boss:1,ai:'spiral'},
 ozaruB:{n:'OZARU',boss:1,ai:'buu'},
 ozarugB:{n:'OZARU DORADO',boss:1,ai:'buu'},
 a21B:{n:'ANDROIDE 21',boss:1,ai:'frieza'},
 a21mB:{n:'ANDROIDE 21 MAJIN',boss:1,ai:'buu'},
 blackssjB:{n:'GOKU BLACK SSJ',boss:1,ai:'dash'},
 zamasufB:{n:'ZAMASU FUSIONADO',boss:1,ai:'spiral'},
 buuthinB:{n:'BUU MALIGNO',boss:1,ai:'dash'},
 buugohanB:{n:'BUU (GOHAN ABSORBIDO)',boss:1,ai:'buu'},
 toppoB:{n:'TOPPO',boss:1,ai:'dash'},
 whisB:{n:'WHIS',boss:1,ai:'spiral'},
 zenoB:{n:'ZENO SAMA',boss:1,ai:'spiral'},
 moroB:{n:'MORO',boss:1,ai:'buu'},
 broly2B:{n:'BROLY (CONTENIDO)',boss:1,ai:'dash'},
 broly3B:{n:'BROLY SUPER SAIYAN',boss:1,ai:'buu'},
 brolyssj4B:{n:'BROLY SSJ4',boss:1,ai:'buu'},
 kalessjB:{n:'KALE BERSERKER',boss:1,ai:'buu'},
 frzS2:{n:'Soldado raso',hp:14,spd:36,dmg:6,xp:1,r:6},
 frzS4:{n:'Soldado de Freezer',hp:26,spd:30,dmg:9,xp:2,r:7,shoot:3.4},
 saiyanLow:{n:'Saiyan de clase baja',hp:50,spd:42,dmg:11,xp:4,r:7},
 garlicH1:{n:'Esbirro de Garlic',hp:45,spd:34,dmg:11,xp:4,r:8},
 garlicH2:{n:'Esbirro de Garlic',hp:60,spd:30,dmg:13,xp:5,r:8,shoot:3.2},
 demonS:{n:'Demonio',hp:30,spd:46,dmg:9,xp:3,r:7},
 demonS2:{n:'Demonio de élite',hp:55,spd:44,dmg:12,xp:5,r:7,shoot:3},
 garlicE:{n:'GARLIC JR.',hp:520,spd:52,dmg:15,xp:45,r:8,elite:1,shoot:1.8},
 demonE:{n:'DEMONIO GIGANTE',hp:900,spd:40,dmg:20,xp:60,r:10,elite:1},
 garlicB:{n:'SUPER GARLIC JR.',boss:1,ai:'buu'},
 babyB:{n:'BABY VEGETA',boss:1,ai:'dash'},
 shenronB:{n:'SHENRON OSCURO',boss:1,ai:'spiral'},
};
// boss strength depends on its slot in the run, not on who it is
const BOSS_SLOT=[{hp:900,spd:38,dmg:11,xp:80},{hp:2600,spd:36,dmg:16,xp:120},{hp:4600,spd:36,dmg:19,xp:160},{hp:7200,spd:40,dmg:22,xp:220},{hp:11000,spd:46,dmg:24,xp:300}];
const MAPS={
 namek:{name:'PLANETA NAMEK',sub:'Saga de Freezer',
   pool:[[0,'saiba',10],[45,'soldier',4],[240,'soldier',3],[330,'saibaR',5],[420,'saibaX',3],[500,'soldierE',6]],
   bosses:['freeza1B','freeza2B','ginyu','frieza','golden'],ring:['saiba','saibaR'],squad:[600,['ginyu','jeice','burter'],'¡FUERZAS ESPECIALES!']},
 tierra:{name:'TIERRA · YERMO',sub:'Sagas Saiyan y Androides',
   pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'celljr',4]],
   bosses:['raditz','turles','mecha','a16B','cell'],ring:['saiba','saibaR'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES!']},
 arena:{name:'JUEGOS DE CELL',sub:'Sagas de Cell y Buu',
   pool:[[0,'majin',10],[40,'celljr',3],[150,'majin',4],[330,'celljr',5],[500,'soldierE',4]],
   bosses:['cell','janemba','ginyu','fatbuu','buu'],ring:['majin','celljr'],squad:[600,['celljrE','celljrE','celljrE','celljrE','celljrE','celljrE','celljrE'],'¡LOS CELL JR.!']},
 time:{name:'SALA DEL TIEMPO',sub:'Un año de entrenamiento en un día',req:1,
   pool:[[0,'saiba',8],[0,'majin',6],[60,'soldierE',4],[150,'celljr',4],[240,'majin',4],[330,'saibaR',5],[480,'soldierE',5]],
   bosses:['freeza2B','turles','a16B','janemba','golden'],ring:['saibaR','celljr'],squad:[600,['shadow'],'¡TU SOMBRA!']},
 vegetasei:{name:'PLANETA VEGETA',sub:'Saga de Bardock',req:1,
   pool:[[0,'soldier',9],[0,'saiba',5],[100,'soldierE',4],[220,'saibaR',5],[280,'saibaX',4],[360,'soldierE',6],[500,'celljr',3]],
   bosses:['freeza1B','freeza2B','raditz','frieza','frieza100'],ring:['soldier','soldierE'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 futuro:{name:'FUTURO DE TRUNKS',sub:'Saga de Goku Black',req:1,
   pool:[[0,'soldier',8],[0,'saiba',6],[90,'celljr',4],[200,'soldierE',4],[320,'majin',5],[480,'saibaR',5]],
   bosses:['a16B','majinv','black','rose','brolyB'],ring:['soldier','soldierE'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES DEL FUTURO!']},
 kame:{name:'KAME HOUSE',sub:'Isla del Maestro Roshi',req:1,cam:[-44,-40],pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['raditz','turles','freeza2B','a16B','cell'],ring:['saiba','saibaR'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 paoz:{name:'MONTE PAOZ',sub:'La casa de Goku',req:1,cam:[-30,-60],pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['raditz','turles','vegetaB','frieza','cell'],ring:['saiba','saibaR'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 kaio:{name:'PLANETA DE KAIO',sub:'Camino de la Serpiente',req:1,cam:[-44,-50],pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['turles','raditz','piccoloB','vegetaB','frieza100'],ring:['saibaR','saibaX'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 lookout:{name:'TEMPLO DE KAMI',sub:'La Atalaya sagrada',req:1,cam:[-44,-262],pool:[[0,'majin',9],[40,'majin',4],[150,'celljr',4],[330,'soldierE',5],[480,'saibaR',5]],bosses:['raditz','turles','cell','fatbuu','buu'],ring:['majin','majin'],squad:[600,['shadow'],'¡TU SOMBRA!']},
 budokai:{name:'TENKAICHI BUDOKAI',sub:'Torneo de Artes Marciales',req:1,cam:[-44,-408],pool:[[0,'majin',9],[40,'majin',4],[150,'celljr',4],[330,'soldierE',5],[480,'saibaR',5]],bosses:['piccoloB','vegetaB','majinv','fatbuu','buu'],ring:['majin','majin'],squad:[600,['celljrE','celljrE','celljrE','celljrE','celljrE','celljrE','celljrE'],'¡LOS CELL JR.!']},
 redribbon:{name:'BASE RED RIBBON',sub:'Saga del Ejército Red Ribbon',req:1,cam:[-44,-60],pool:[[0,'soldier',10],[60,'saiba',5],[200,'celljr',4],[320,'saibaX',4],[480,'soldier',6]],bosses:['a16B','mecha','a17B','trunksB','cell'],ring:['soldier','celljr'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES!']},
 musculo:{name:'TORRE MÚSCULO',sub:'Aldea Jingle',req:1,cam:[-44,-110],pool:[[0,'soldier',10],[60,'saiba',5],[200,'celljr',4],[320,'saibaX',4],[480,'soldier',6]],bosses:['raditz','a16B','turles','mecha','cell'],ring:['soldier','saiba'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES!']},
 capsule:{name:'CIUDAD DEL OESTE',sub:'Corporación Cápsula',req:1,cam:[90,-130],pool:[[0,'soldier',10],[60,'saiba',5],[200,'celljr',4],[320,'saibaX',4],[480,'soldier',6]],bosses:['a16B','frieza','cell','trunksB','black'],ring:['soldier','celljr'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES!']},
 yardrat:{name:'PLANETA YARDRAT',sub:'El refugio de Goku',req:1,cam:[-120,-80],pool:[[0,'soldier',9],[0,'saiba',5],[100,'soldierE',4],[220,'saibaR',5],[300,'saibaX',4],[420,'soldierE',6]],bosses:['ginyu','freeza2B','freeza1B','frieza','frieza100'],ring:['soldier','saibaR'],squad:[600,['ginyu','jeice','burter'],'¡FUERZAS ESPECIALES!']},
 kaioshin:{name:'MUNDO KAIOSHIN',sub:'Saga de Majin Buu',req:1,cam:[-44,-100],pool:[[0,'majin',9],[40,'majin',4],[150,'celljr',4],[330,'soldierE',5],[480,'saibaR',5]],bosses:['janemba','majinv','fatbuu','gokuB','buu'],ring:['majin','majin'],squad:[600,['celljrE','celljrE','celljrE','celljrE','celljrE','celljrE','celljrE'],'¡LOS CELL JR.!']},
 infierno:{name:'INFIERNO',sub:'Saga del Más Allá',req:1,cam:[-110,-90],pool:[[0,'majin',9],[40,'majin',4],[150,'celljr',4],[330,'soldierE',5],[480,'saibaR',5]],bosses:['frieza','cell','janemba','fatbuu','buu'],ring:['majin','saibaR'],squad:[600,['ginyu','jeice','burter'],'¡FUERZAS ESPECIALES!']},
 bills:{name:'PLANETA DE BILLS',sub:'La batalla de los dioses',req:1,cam:[-44,-120],pool:[[0,'soldier',9],[0,'saiba',5],[100,'soldierE',4],[220,'saibaR',5],[300,'saibaX',4],[420,'soldierE',6]],bosses:['frieza','golden','vegetaB','majinv','black'],ring:['soldierE','saibaR'],squad:[600,['ginyu','jeice','burter'],'¡FUERZAS ESPECIALES!']},
 poder:{name:'TORNEO DEL PODER',sub:'Supervivencia universal',req:1,cam:[-44,-28],pool:[[0,'soldier',9],[0,'saiba',5],[100,'soldierE',4],[220,'saibaR',5],[300,'saibaX',4],[420,'soldierE',6]],bosses:['a17B','frieza','brolyB','golden','gokuB'],ring:['soldierE','celljr'],squad:[600,['shadow'],'¡TU SOMBRA!']},
 pradera:{name:'PRADERAS',sub:'Campo de batalla Saiyan',req:1,pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['raditz','turles','vegetaB','piccoloB','frieza'],ring:['saiba','saibaR'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 bosque:{name:'BOSQUE PROFUNDO',sub:'Entrenamiento en la naturaleza',req:1,pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['raditz','turles','a16B','piccoloB','cell'],ring:['saiba','saibaR'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 desierto:{name:'DESIERTO',sub:'Guarida de Yamcha',req:1,pool:[[0,'soldier',10],[60,'saiba',5],[200,'celljr',4],[320,'saibaX',4],[480,'soldier',6]],bosses:['raditz','a16B','turles','mecha','cell'],ring:['soldier','saiba'],squad:[630,['a17e','a18e'],'¡LOS ANDROIDES!']},
 gizard:{name:'YERMO DE GIZARD',sub:'Llegada de los Saiyans',req:1,pool:[[0,'saiba',10],[45,'soldier',4],[200,'celljr',4],[300,'saibaX',3],[330,'saibaR',5],[480,'soldierE',5]],bosses:['turles','raditz','vegetaB','ginyu','frieza'],ring:['saiba','saibaX'],squad:[630,['raditzE','vegsaiE'],'¡SAIYANS DE ÉLITE!']},
 volcan:{name:'TIERRA VOLCÁNICA',sub:'Planeta en llamas',req:1,pool:[[0,'soldier',9],[0,'saiba',5],[100,'soldierE',4],[220,'saibaR',5],[300,'saibaX',4],[420,'soldierE',6]],bosses:['freeza2B','freeza1B','ginyu','frieza100','golden'],ring:['soldierE','saibaR'],squad:[600,['ginyu','jeice','burter'],'¡FUERZAS ESPECIALES!']},
};
const BOSS_T=[180,360,540,720,900];
const WAVE_T=[130,230,310,410,490,590,670,770,850];
const WAVES={"freezer":[["saibaR",14],["soldierE",8],["ginyu",1],["coolerE",1],["saibaX",12],["jeice",1]],"tierra":[["celljr",10],["cellimpE",1],["saibaR",14],["a16E",1],["soldier",12],["a17e",1]],"buu":[["majin",18],["majin",10],["fatbuuE",1],["majinvE",1],["kidbuuE",1],["celljrE",3]],"super":[["soldierE",10],["coolerE",1],["majinvE",1],["a16E",1],["kidbuuE",1],["cellimpE",2]]},WSAGA={"namek":"freezer","vegetasei":"freezer","yardrat":"freezer","volcan":"freezer","gizard":"freezer","kaio":"freezer","tierra":"tierra","redribbon":"tierra","musculo":"tierra","capsule":"tierra","desierto":"tierra","futuro":"tierra","kame":"tierra","paoz":"tierra","pradera":"tierra","bosque":"tierra","arena":"buu","lookout":"buu","budokai":"buu","kaioshin":"buu","infierno":"buu","time":"super","bills":"super","poder":"super"};
const NOSPR={}; // Los tipos sin secuencia propia se retiran tras cargar ANIM_SET.
(function(){const f=t=>NOSPR[t]||t,SQ={'¡FUERZAS ESPECIALES!':'¡INVASORES DEL ESPACIO!','¡LOS CELL JR.!':'¡EL ASALTO DE CELL!'};
  for(const k in MAPS){const M=MAPS[k];M.pool.forEach(p=>p[1]=f(p[1]));if(M.ring)M.ring=M.ring.map(f);M.bosses=M.bosses.map(f);
    if(M.squad){M.squad[1]=M.squad[1].map(f);M.squad[2]=SQ[M.squad[2]]||M.squad[2]}}
  if(MAPS.poder){MAPS.poder.bosses[4]='jiren';MAPS.poder.bosses[1]='hitB'}
  if(MAPS.futuro)MAPS.futuro.bosses=['a16B','black','zamasuB','rose','brolyB'];
  if(MAPS.kaioshin)MAPS.kaioshin.bosses[3]='superbuuB';
  if(MAPS.bills)MAPS.bills.bosses[4]='billsB';
  const EL={freezer:['burter','kingvegE','raditzssjE','turlesE','frostE','vegsaiE','freeza2E','coolerE'],tierra:['geroE','raditzssjE','cellimpE','a16E','cellsemiE','a21E','cellperfE'],
    buu:['garlicE','majinvE','fatbuuE','gohanpossE','buuthinE','demonE','superbuuE'],super:['frost2E','black2E','hitE','zamasuE','hit2E','zamasuhE','vegetaE','fakegokuE','kalessjE']};
  // elites come in one by one, weakest first; renegade saiyans fill the mid game
  for(const k in MAPS){const L=EL[WSAGA[k]||'tierra'];L.forEach((id,i)=>MAPS[k].pool.push([240+i*Math.round(600/L.length),id,0.25]));
    MAPS[k].pool.push([150,'renegA',2],[330,'renegB',2],[520,'renegC',2]);
    const R={freezer:[[0,'frzS2',4],[120,'frzS4',3],[260,'saiyanLow',2]],tierra:[[60,'frzS2',2],[260,'saiyanLow',2]],buu:[[90,'garlicH1',3],[200,'demonS',3],[320,'garlicH2',2],[420,'demonS2',3]],super:[[0,'frzS2',3],[200,'demonS',2],[360,'demonS2',2]]}[WSAGA[k]||'tierra'];
    R.forEach(p=>MAPS[k].pool.push(p.slice()))}
  const B={namek:['dodoria','zarbon','ginyu','freeza3B','frieza100'],vegetasei:['freeza1B','coolerB','raditz','ozaruB','frieza100'],yardrat:['ginyu','freeza1B','freeza2B','freeza3B','frieza'],
    tierra:['raditz','reycoldB','mecha','a21B','cell'],redribbon:['a16B','a19','mecha','a21B','cell'],futuro:['black','blackssjB','zamasuB','rose','zamasufB'],
    kaioshin:['dabura','janemba','majinv','buugohanB','buu'],infierno:['garlicB','cell','superbuuB','ozarugB','janemba'],time:['myuuB','babyB','super17B','moroB','omegaB'],lookout:['garlicB','turles','cell','fatbuu','buu'],
    bills:['golden','toppoB','whisB','gasB','billsB'],poder:['kalessjB','hitB','toppoB','brolyssj4B','jiren'],desierto:['raditz','a16B','broly2B','mecha','cell'],
    pradera:['raditz','slugB','vegetaB','broly3B','frieza'],bosque:['raditz','ozaruB','a16B','piccoloB','cell']};
  for(const k in B)if(MAPS[k])MAPS[k].bosses=B[k].map(f);
  WAVES.buu.push(['superbuuE',1]);WAVES.super.push(['hitE',1],['zamasuE',1]);
  for(const k in WAVES)WAVES[k].forEach(w=>w[0]=f(w[0]))})();

const RINGS=[90,270,450,630,810];
const MAXE=280;

// ---------- audio ----------
let AC=null,muted=false;const sfxLast={};
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){AC=null}
  if(AC){MUS.g=AC.createGain();MUS.g.gain.value=0;MUS.g.connect(AC.destination);MUS.next=AC.currentTime;setInterval(musTick,50)}}
// ---------- chiptune music: a tiny step sequencer, one chord progression per map, faster with a boss ----------
const MUS={g:null,step:0,next:0,nb:null};
const PROG={vegetasei:[[52,55,59],[53,57,60],[50,53,57],[52,56,59]],namek:[[57,60,64],[53,57,60],[55,59,62],[52,55,59]],tierra:[[52,55,59],[48,52,55],[50,53,57],[47,50,54]],arena:[[50,53,57],[46,50,53],[48,52,55],[45,48,52]],
  time:[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],futuro:[[55,58,62],[51,55,58],[53,57,60],[50,53,57]]};
const MEL=[0,-1,2,1,0,-1,1,2,2,-1,1,0,1,-1,2,1];
const mf=n=>440*Math.pow(2,(n-69)/12);
function mnote(type,f,t,d,v,f2){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(MUS.g);o.start(t);o.stop(t+d+0.02)}
function mhat(t,v){if(!MUS.nb){MUS.nb=AC.createBuffer(1,AC.sampleRate*0.05|0,AC.sampleRate);const a=MUS.nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const src=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=7000;src.buffer=MUS.nb;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.045);
  src.connect(f);f.connect(g);g.connect(MUS.g);src.start(t)}
function musTick(){if(!AC||!MUS.g)return;const play=state==='play'&&!muted&&S;MUS.g.gain.setTargetAtTime(play?0.55:0,AC.currentTime,0.08);
  if(!play){MUS.next=AC.currentTime+0.05;return}
  const boss=!!S.boss,spb=60/(boss?158:140)/4;if(MUS.next<AC.currentTime)MUS.next=AC.currentTime+0.02;
  while(MUS.next<AC.currentTime+0.2){const st=MUS.step++,i=st%16,ch=(PROG[S.map]||PROG.namek)[(st>>4)%4],t=MUS.next;
    if(i%2===0)mnote('square',mf(ch[0]-24+(i%8===6?7:0)),t,spb*1.7,0.07);
    mnote('triangle',mf(ch[[0,1,2,1][i%4]]+12),t,spb*0.8,0.05);
    if(i%2===0&&MEL[(i+(st>>4))%16]>=0&&(st>>6)%2===1)mnote('square',mf(ch[MEL[(i+(st>>4))%16]]+24),t,spb*1.8,0.025);
    if(i%4===0)mnote('sine',140,t,0.12,0.18,40);
    if(i%8===4)mhat(t,0.06);if(i%2===1||boss)mhat(t,0.025);
    MUS.next+=spb}}
function sfx(t){
  if(!AC||muted)return;const now=AC.currentTime;if(sfxLast[t]&&now-sfxLast[t]<0.05)return;sfxLast[t]=now;
  const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);
  const set=(type,f1,f2,dur,vol)=>{o.type=type;o.frequency.setValueAtTime(f1,now);o.frequency.exponentialRampToValueAtTime(f2,now+dur);g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(0.0001,now+dur);o.start(now);o.stop(now+dur)};
  switch(t){
   case 'shot':set('square',900,500,0.06,0.025);break;
   case 'hit':set('square',220,110,0.05,0.02);break;
   case 'beam':set('sawtooth',140,60,0.6,0.05);break;
   case 'charge':set('triangle',200,900,0.25,0.05);break;
   case 'boom':set('sawtooth',90,30,0.4,0.08);break;
   case 'gem':set('sine',1200,1600,0.05,0.02);break;
   case 'hurt':set('square',160,60,0.18,0.07);break;
   case 'level':set('square',520,1040,0.3,0.05);break;
   case 'trans':set('sawtooth',80,800,1.2,0.07);break;
   case 'boss':set('sawtooth',60,40,1.0,0.09);break;
  }}

// ---------- state ----------
let ebeams=[];let S, P, enemies, projs, eshots, beams, bombs, gems, pickups, parts, texts;
const cam={x:0,y:0,shake:0};
let state='title',debugSolid=false;
function newGame(hid,map){
  MAPK=map||MAPK;precarga(hid,MAPK);
  solidReset();
  const H=HEROES[hid];
  S={map:MAPK,bossN:0,t:0,kills:0,spawnT:0,bossIdx:0,ringIdx:0,boss:null,banner:null,flash:0,pending:0,hid,won:false,endless:false,nextEndless:0,zeni:0,freeze:0,diff:pickedDiff,meta:metaBonus(),mr:1+0.01*mastRank(hid),aw:awaken(hid),saiba:0,forms:0,evos:0,balls:0,ballN:0,wishes:0,bank:{t:0,kills:0,boss:0,saiba:0,forms:0,evos:0,zeni:0,wishes:0}};S.revives=S.meta.revive;
  P={dir:'down',cast:null,x:0,y:0,hp:H.hp,face:1,anim:0,moving:false,iframe:0,lvl:1,xp:0,need:need(1),form:0,
     moves:{},order:[],cards:{},orbA:0,hitT:0,sel:0,sigT:0.6,sigCD:1,sigN:0,sigU:2,sigB:[],powT:1.2};
  P.hp=stats().maxhp;fxSl.length=0;fxRg.length=0;
  fxs=[];ebeams=[];enemies=[];projs=[];eshots=[];beams=[];bombs=[];gems=[];pickups=[];parts=[];texts=[];
  cam.x=-VW/2;cam.y=-VH/2;
}
const need=l=>Math.floor(4+l*3.5+l*l*0.28);
function addMove(id){if(!P.moves[id]){P.moves[id]={lv:1,t:0.4,evo:false};P.order.push(id)}else P.moves[id].lv++}
function stats(){
  const H=HEROES[S.hid],c=P.cards,f=P.form,M=S.meta;
  return{
    dmg:H.atk*(1+0.12*(c.power||0))*(1+0.25*f)*M.dmg*S.mr*(1+0.08*(S.aw||0)),
    maxhp:Math.round((H.hp+20*(c.hp||0)+15*f+M.hp)*(1+0.08*(S.aw||0))),
    spd:1.3*H.spd*(1+0.08*(c.speed||0))*(1+0.06*f)*M.spd,
    cd:Math.pow(0.92,c.cd||0)*(1-0.05*f)*M.cd,
    mag:55*(1+0.35*(c.magnet||0))*M.mag,
    regen:0.25+(H.regen||0)+0.5*(c.regen||0)+M.regen,
    area:1+0.1*(c.area||0),
    armor:(c.armor||0)+M.armor,
    xp:(1+0.1*(c.xp||0))*M.xp}}

// ---------- input ----------
const keys={};
addEventListener('keydown',e=>{keys[e.code]=true;
  if(e.code==='F2'){debugSolid=!debugSolid;e.preventDefault()}
  if(state==='play'){const m=/^(Digit|Numpad)([1-6])$/.exec(e.code);if(m)sigSelect(+m[2]-1)}
  if(state==='levelup'&&/^Digit[1-4]$/.test(e.code)){const b=$('#ups').querySelectorAll('button')[+e.code.slice(5)-1];if(b)b.click()}
  if((e.code==='Escape'||e.code==='KeyP')){if(state==='play')pauseGame();else if(state==='pause')resume()}
  if(e.code==='KeyM')toggleMute();
  if(/^(Arrow|Space)/.test(e.code)&&state==='play')e.preventDefault()});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;if(state==='play')pauseGame()});
const joy={on:false,id:null,ox:0,oy:0,x:0,y:0};
cv.addEventListener('pointerdown',e=>{initAudio();if(state!=='play')return;{const x=e.clientX/SC,y=e.clientY/SC,R=P&&P.barR||[];for(let i=0;i<R.length;i++){const r=R[i];if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]){sigSelect(i);return}}}joy.on=true;joy.id=e.pointerId;joy.ox=joy.x=e.clientX/SC;joy.oy=joy.y=e.clientY/SC;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(joy.on&&e.pointerId===joy.id){joy.x=e.clientX/SC;joy.y=e.clientY/SC}});
const endJoy=e=>{if(e.pointerId===joy.id)joy.on=false};
cv.addEventListener('pointerup',endJoy);cv.addEventListener('pointercancel',endJoy);

// ---------- spatial hash ----------
const CELL=32,grid=new Map();
const gkey=(cx,cy)=>(cx+32768)*65536+(cy+32768);
function gridBuild(){grid.clear();for(const e of enemies){const k=gkey(Math.floor(e.x/CELL),Math.floor(e.y/CELL));let a=grid.get(k);if(!a)grid.set(k,a=[]);a.push(e)}}
function near(x,y,r,cb){const x0=Math.floor((x-r)/CELL),x1=Math.floor((x+r)/CELL),y0=Math.floor((y-r)/CELL),y1=Math.floor((y+r)/CELL);
  for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++){const a=grid.get(gkey(cx,cy));if(a)for(const e of a)if(!e.dead)cb(e)}}
function nearest(x,y,maxD=260){let best=null,bd=maxD*maxD;for(const e of enemies){if(e.dead)continue;const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;best=e}}return best}
function nearestN(x,y,n){return enemies.filter(e=>!e.dead).map(e=>[e,(e.x-x)**2+(e.y-y)**2]).sort((a,b)=>a[1]-b[1]).slice(0,n).map(a=>a[0])}

// ---------- animated pixel FX (explosions, hit sparks) ----------
const FXPAL={fire:['#ffffff','#fff6a8','#ffd23f','#ff8a2a','#d2381e','#5a2a2a'],
  ki:['#ffffff','#e8f8ff','#9fe0ff','#4aa8ff','#2a5ad8','#2a2a50'],
  gold:['#ffffff','#fffbe0','#ffe066','#ffb020','#e0601e','#5a3a2a'],
  green:['#ffffff','#e8ffd0','#b6f070','#6ac83a','#2f7a2a','#26402a'],
  pink:['#ffffff','#ffe8f6','#ffa8dc','#f060b0','#a02a78','#40263a']};
const FXC={};
function hsh(x,y,s){let h=(x*374761393+y*668265263+s*982451653)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function fxFrames(kind,R){const key=kind+R;if(FXC[key])return FXC[key];const pal=FXPAL[kind],N=7,out=[],S2=R*2+4;
  for(let f=0;f<N;f++){const c=document.createElement('canvas');c.width=c.height=S2;const g=c.getContext('2d'),k=f/(N-1);
    const rO=R*(0.35+0.65*Math.sqrt(k)),rI=k<0.45?0:R*(k-0.4)*1.35;
    for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){const dx=x-S2/2+.5,dy=y-S2/2+.5,d=Math.hypot(dx,dy),n=hsh(x>>1,y>>1,f)*R*0.32;
      if(d>rO-n*0.6||(rI>0&&d<rI+n*0.5))continue;
      // heat: centre hot early, cools over time
      let h=(d/rO)*0.6+k*1.05+(hsh(x>>1,y>>1,f+9)-.5)*0.3;const i=Math.max(0,Math.min(5,Math.floor(h*4.2)));
      if(i===5&&hsh(x,y,f+3)<0.45)continue;g.fillStyle=pal[i];g.fillRect(x,y,1,1)}
    out.push(c)}
  return FXC[key]=out}
function sparkFrames(col){const key='sp'+col;if(FXC[key])return FXC[key];const out=[];
  for(let f=0;f<4;f++){const c=document.createElement('canvas');c.width=c.height=11;const g=c.getContext('2d'),L=[2,5,4,2][f];
    g.fillStyle=f<2?'#ffffff':col;for(let i=-L;i<=L;i++){g.fillRect(5+i,5,1,1);g.fillRect(5,5+i,1,1)}
    if(f>0){const d=f===1?3:2;g.fillStyle=col;for(let i=1;i<=d;i++){g.fillRect(5+i,5+i,1,1);g.fillRect(5-i,5+i,1,1);g.fillRect(5+i,5-i,1,1);g.fillRect(5-i,5-i,1,1)}}
    if(f<3){g.fillStyle='#ffffff';g.fillRect(4,4,3,3)}out.push(c)}
  return FXC[key]=out}
let fxs=[];
function fx(x,y,kind,R,dur){if(fxs.length>90)return;fxs.push({x,y,fr:kind==='spark'?sparkFrames(R):fxFrames(kind,R),t:0,T:dur||0.42})}
function smoke(x,y,n){for(let i=0;i<n&&parts.length<500;i++)parts.push({x:x+rnd(-5,5),y:y+rnd(-4,4),vx:rnd(-10,10),vy:-rnd(8,24),t:rnd(0.4,0.8),c:Math.random()<.5?'#6a6470':'#8a8490',s:2})}
function fxKind(hex){if(!hex||hex[0]!=='#')return'fire';const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return b>r+20&&b>=g-30?'ki':g>r+20&&g>b?'green':r>g+30&&b>g?'pink':'fire'}
const DEATHK={saiba:'green',saibaR:'fire',celljr:'green',blob:'pink',majin:'pink'};

// ---------- combat ----------
function hurt(e,dmg,kx=0,ky=0){
  if(e.dead)return;if(S.ev&&S.ev.k==='furia')dmg*=2;const crit=Math.random()<0.08;if(crit)dmg*=2;
  e.hp-=dmg;e.flash=0.08;if(!e.boss){e.kx+=kx;e.ky+=ky}
  if(texts.length<70)texts.push({x:e.x+rnd(-3,3),y:e.y-e.h*0.8,v:Math.round(dmg),t:0.6,c:crit?'#ffd23f':'#ffffff'});
  sfx('hit');if(fxs.length<40&&Math.random()<0.45)fx(e.x+rnd(-3,3),e.y-e.h*0.5+rnd(-3,3),'spark',crit?'#ffd23f':'#bfe6ff',0.16);
  if(e.hp<=0)kill(e)}
function kill(e){if(e.crate){e.dead=true;crateLoot(e);return}
  if(e.evChest)putPickup({k:'chest',x:e.x,y:e.y});
  e.dead=true;S.kills++;S.kt=S.kt||{};S.kt[e.type]=(S.kt[e.type]||0)+1;if(ET[e.type].elite)S.elites=(S.elites||0)+1;if(e.type==='saiba'||e.type==='saibaR')S.saiba++;
  if(e.boss){for(let i=0;i<6;i++)setTimeout(()=>{fx(e.x+rnd(-18,18),e.y-10+rnd(-18,12),i%2?'fire':'gold',16+(i%3)*4,0.6);smoke(e.x,e.y-10,6)},i*140)}
  else fx(e.x,e.y-e.h*0.45,DEATHK[e.type]||"fire",8,0.36);
  burst(e.x,e.y-6,e.boss?40:6,e.boss?['#ffd23f','#ffffff','#ff7a3a']:['#ffffff','#bfe6ff',e.pc||'#9bd65a']);
  if(e.boss){S.flash=0.3;cam.shake=8;sfx('boom');S.bossKills=(S.bossKills||0)+1;
    for(let i=0;i<12;i++)dropGem(e.x+rnd(-20,20),e.y+rnd(-20,20),Math.ceil(e.xp/12));
    putPickup({k:'chest',x:e.x,y:e.y});putPickup({k:'senzu',x:e.x+14,y:e.y});putPickup({k:'dball',n:(S.ballN++%7)+1,x:e.x-14,y:e.y});
    if(S.boss===e)S.boss=null;
    if(e.final&&!S.won){S.won=true;setTimeout(()=>{if(state==='play')endGame(true)},1500)}
  }else{dropGem(e.x,e.y,e.xp);if(e.ball)putPickup({k:'dball',n:(S.ballN++%7)+1,x:e.x,y:e.y});if(Math.random()<0.006)putPickup({k:'senzu',x:e.x,y:e.y});if(Math.random()<0.012)putPickup({k:'zeni',x:e.x+4,y:e.y})}}
function putPickup(o){solidPlace(o,4);pickups.push(o);return o}
function dropGem(x,y,v){if(gems.length>450){const g=gems[(Math.random()*gems.length)|0];g.v+=v;return}const o={x,y,v,mag:false};solidPlace(o,3);gems.push(o)}
function burst(x,y,n,cols){for(let i=0;i<n&&parts.length<500;i++){const a=rnd(TAU),s=rnd(20,90);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(0.25,0.6),c:cols[i%cols.length],s:Math.random()<.3?2:1})}}
function explode(x,y,rad,dmg,cols){
  near(x,y,rad+12,e=>{const d=Math.hypot(e.x-x,e.y-y);if(d<rad+e.r)hurt(e,dmg,(e.x-x)/(d||1)*80,(e.y-y)/(d||1)*80)});
  if(FXI.boom&&fxs.length<90)fxs.push({x,y,fr:boomFrames(rad,cols),t:0,T:0.42});else fx(x,y,fxKind(cols[1]),Math.max(8,Math.min(28,rad*0.8|0)),0.45);smoke(x,y,4);
  parts.push({ring:1,x,y,t:0.35,T:0.35,r:rad,c:cols[1]});burst(x,y,18,cols);cam.shake=Math.max(cam.shake,3);sfx('boom')}
function roce(v){if(P.iframe>0||state!=='play')return;P.hp-=v;P.hitT=Math.max(P.hitT,0.05);if(P.hp<=0){P.hp=0.5;hitPlayer(1)}}
function hitPlayer(d,big){
  if(P.iframe>0||state!=='play')return;const st=stats();d=Math.max(1,d-st.armor);
  P.hp-=d;P.iframe=big?1.0:0.6;P.hitT=0.2;cam.shake=Math.max(cam.shake,3);sfx('hurt');
  // al recibir un golpe, los enemigos pegados salen despedidos y dejan un hueco para escapar
  for(const e of enemies)if(!e.boss&&!e.crate){const dx=e.x-P.x,dy=e.y-P.y,dd=Math.hypot(dx,dy);if(dd<30){e.kx+=dx/(dd||1)*150;e.ky+=dy/(dd||1)*150}}
  if(P.hp<=0){if(S.revives>0){S.revives--;P.hp=stats().maxhp;P.iframe=2.5;S.flash=0.4;S.banner={t:2,text:'¡SEMILLA SENZU!',sub:'Vuelves a la carga'};fx(P.x,P.y-10,'green',24,0.6);for(const e of enemies)if(!e.boss&&Math.hypot(e.x-P.x,e.y-P.y)<90)hurt(e,9999);sfx('trans');return}
    P.hp=0;P.dead=0.001;P.moving=false;P.cast=null;P.pend=null;state='dying';sfx('boom')}}

// ---------- weapons ----------
const SHOUTS={kame:['KA-ME-HA-ME-HA!','#9fe8ff'],galick:['GALICK HO!','#e6a8ff'],makanko:['MAKANKOSAPPO!','#ffe86a'],genki:['GENKIDAMA!','#bfe6ff'],bigbang:['BIG BANG!','#bfe6ff'],masenko:['MASENKO!','#ffcc33'],burning:['BURNING ATTACK!','#ffb03a'],riot:['RIOT JAVELIN!','#7ab8ff'],eraser:['ERASER CANNON!','#b8f040'],finalkame:['FINAL KAMEHAMEHA!','#f0d040'],stardust:['STARDUST BREAKER!','#ff6ad0']};
function shout(id,ev){return;const sh=SHOUTS[id];if(!sh||Math.random()<0.4)return;P.shout={s:ev?MV[id].evo.toUpperCase()+'!':sh[0],c:sh[1],t:1.1}}
function fire(id,m,st,ps){
  const W=MV[id],ev=m.evo,dmg=st.dmg*ps.dmg*(ev?1.7:1);
  let ox=FO?FO.x:P.x,oy=FO?FO.y:P.y-18;
  const aimAt=t=>t?Math.atan2(t.y-6-oy,t.x-ox):(P.face>0?0:Math.PI);
  switch(W.kind){
   case 'shot':{const n=st.count*(ev?2:1),ts=nearestN(ox,oy,n);
     // se gira hacia el enemigo y la bola sale de la mano, no del pecho ni por la espalda
     if(!FO&&!W.ring&&ts[0]){const d=ts[0].x<P.x?-1:1;if(P.moving){ox=P.x;oy=P.y-18}else{P.atkFace=d;P.face=d;ox=P.x+d*9;oy=P.y-20}}
     for(let i=0;i<n;i++){const t=ts[i%Math.max(1,ts.length)];const a=W.ring?i*TAU/n+rnd(-0.05,0.05):aimAt(t)+(ts.length<n?(i-(n-1)/2)*0.18:rnd(-0.05,0.05));
       projs.push({k:'ki',x:ox,y:oy,vx:Math.cos(a)*st.spd,vy:Math.sin(a)*st.spd,r:4*ps.area,dmg,pierce:st.pierce+(ev?2:0),life:W.home?2.2:1.3,home:W.home?(t||true):null,age:0,hit:new Set(),col:W.col,spr:FO&&KI_REAL.has(id)?heroKi():null})}
     P.atkT=P.atkD=0.24;P.atkK=1;P.atkA=aimAt(ts[0]);sfx('shot');break}
   case 'beam':{const t=nearest(ox,oy,st.len);const a=aimAt(t);shout(id,ev);
     const evm=ev?1.5:1;
     const ch=st.charge||0.25,dur=st.dur*(ev?1.3:1);
     beams.push({x:ox,y:oy,a,len:st.len*ps.area*(ev?1.25:1),wid:st.wid*ps.area*evm,dur,t:-ch,T:ch,tick:0,dmg:dmg*0.45,col:W.col,spiral:W.spiral,hero:1,big:!W.spiral,mv:id});
     P.cast={a,t:ch+dur};sfx('charge');setTimeout(()=>sfx('beam'),ch*1000);break}
   case 'big':{const t=nearest(ox,oy,220);const a=aimAt(t);shout(id,ev);P.atkT=P.atkD=0.3;P.atkK=1;P.atkA=a;
     projs.push({k:'big',x:ox,y:oy,vx:Math.cos(a)*st.spd,vy:Math.sin(a)*st.spd,r:(ev?9:6)*ps.area,dmg,rad:st.rad*ps.area*(ev?1.4:1),life:1.8,hit:new Set(),col:W.col,pierce:0});
     sfx('shot');break}
   case 'disc':{const n=st.count*(ev?2:1),ts=nearestN(ox,oy,6);
     for(let i=0;i<n;i++){const t=ts.length?ts[(Math.random()*ts.length)|0]:null;const a=t?aimAt(t):rnd(TAU);
       projs.push({k:'disc',x:ox,y:oy,vx:Math.cos(a)*220,vy:Math.sin(a)*220,r:5*ps.area,dmg,pierce:999,life:3,out:st.range,age:0,hit:new Set(),col:W.col})}
     sfx('shot');break}
   case 'bomb':{shout(id,ev);const vis=enemies.filter(e=>!e.dead&&Math.abs(e.x-P.x)<VW/2&&Math.abs(e.y-P.y)<VH/2);
     const n=ev?3:1;for(let i=0;i<n;i++){const t=vis.length?vis[(Math.random()*vis.length)|0]:null;
       const tx=t?t.x:P.x+rnd(-60,60),ty=t?t.y:P.y+rnd(-60,60);
       bombs.push({x:tx,y:ty,t:0,fall:0.8,rad:st.rad*ps.area*(ev?1.3:1),dmg,col:W.col})}
     sfx('charge');break}
   case 'melee':case 'sword':case 'nova':fireSig(W,st,dmg,ps);break;
   case 'aura':{const rad=st.rad*ps.area*(ev?1.3:1);near(P.x,P.y-4,rad+12,e=>{if(Math.hypot(e.x-P.x,e.y-P.y)<rad+e.r)hurt(e,dmg,0,0)});break}
  }}
const MCD=[0.4,0,2.2];
function manual(k){if(state!=='play'||!P)return;const ps=stats();P.mcd=P.mcd||[0,0,0];P.mcdM=P.mcdM||MCD.slice();if(P.mcd[k]>0)return;
  if(k===0){const m=P.moves.kiblast||{lv:1},st=MV.kiblast.st(m.lv);fire('kiblast',m,{...st,count:st.count+2},ps);P.mcd[0]=P.mcdM[0]=MCD[0]}
  else if(k===1){if(P.cast)return;let id=P.order.find(i=>MV[i].kind==='beam');const hs=HEROES[S.hid].start;if(!id)id=MV[hs]&&MV[hs].kind==='beam'?hs:'kame';
    const m=P.moves[id]||{lv:1},st=MV[id].st(m.lv);fire(id,m,st,ps);P.mcd[1]=P.mcdM[1]=Math.max(1.2,st.cd*ps.cd*(m.evo?0.8:1))}
  else{const t=nearest(P.x,P.y,280);if(!t)return;const d=t.x>=P.x?1:-1;
    for(let i=0;i<10;i++)parts.push({x:P.x+rnd(-6,6),y:P.y-rnd(0,30),vx:rnd(-24,24),vy:-rnd(10,34),t:0.35,c:'#bfe6ff',s:2});
    P.x=t.x-d*16;P.y=t.y+1;solidPlace(P,5,1);if(!P.moving){P.face=d;P.dir='side'}P.iframe=Math.max(P.iframe,0.35);
    for(let i=0;i<10;i++)parts.push({x:P.x+rnd(-6,6),y:P.y-rnd(0,30),vx:rnd(-24,24),vy:-rnd(10,34),t:0.35,c:'#ffffff',s:2});
    const dmg=(26+4*P.lvl)*ps.dmg;near(t.x,t.y,36,e=>{if(Math.hypot(e.x-t.x,e.y-t.y)<36+e.r)hurt(e,dmg,d*60,0)});
    P.atkT=P.atkD=0.32;P.atkK=0;P.atkA=d>0?0:Math.PI;cam.shake=Math.max(cam.shake||0,3);P.mcd[2]=P.mcdM[2]=MCD[2]}}
function updateMoves(dt,ps){
  for(const id of P.order){const m=P.moves[id],W=MV[id],st=W.st(m.lv);
    if(W.kind==='orbit'){continue}
    if(W.kind==='beam'){m.t-=dt;continue}
    m.t-=dt;if(m.t<=0){m.t=st.cd*ps.cd*(m.evo?0.8:1);fire(id,m,st,ps)}}
  if(P.moves.orbs){const m=P.moves.orbs,st=MV.orbs.st(m.lv),n=st.count+(m.evo?2:0),rad=st.rad*ps.area;
    P.orbA+=dt*st.spd;const dmg=st.dmg*ps.dmg*(m.evo?1.7:1);
    for(let i=0;i<n;i++){const a=P.orbA+i*TAU/n,x=P.x+Math.cos(a)*rad,y=P.y-8+Math.sin(a)*rad;
      near(x,y,16,e=>{if((e.orbT||0)<=S.t&&Math.hypot(e.x-x,e.y-6-y)<e.r+5){e.orbT=S.t+0.45;hurt(e,dmg,Math.cos(a)*60,Math.sin(a)*60)}})}}}

// ---------- spawning ----------
function spawn(type,x,y){
  let d=ET[type];if(!d)throw new Error('Enemigo sin animaciones revisadas: '+type);if(d.boss)d={r:13,...d,...BOSS_SLOT[Math.max(0,Math.min(4,S.bossN||0))]};else if(d.r==null)d={...d,r:6};const lv=(P&&P.lvl||1)-1,sc=(1+Math.max(0,S.t-60)/170+(S.endless?S.t/300:0))*(1+0.03*lv);
  if(x===undefined){const a=rnd(TAU),r=Math.hypot(VW,VH)/2+20;x=P.x+Math.cos(a)*r;y=P.y+Math.sin(a)*r}
  const spr=enemySprite(type);
  const e={type,x,y,hp:d.hp*(d.boss?1:sc),maxhp:0,spd:d.spd*(d.boss?1:rnd(0.9,1.1)),dmg:d.dmg*(1+S.t/500)*(1+0.02*lv)*(S.t<180?0.6+0.4*S.t/180:1),xp:d.xp,r:d.r,boss:!!d.boss,final:!!d.final,ai:d.ai,
    kx:0,ky:0,flash:0,anim:rnd(4),spr,h:spr.h*(spr.big?1:d.boss?2:1),shootT:d.shoot?rnd(1,d.shoot):0,aiT:2,aiS:0,pc:(PAL[type]||{}).g||(PAL[type]||{}).p||(PAL[type]||{}).s,aura:d.aura};
  if(d.boss)e.hp*=1+0.03*lv;if(d.boss&&S.endless)e.hp*=1+S.t/600;
  {const D=DIFF[S.diff||0];e.hp*=D.hp;e.dmg*=D.dmg;if(!d.boss)e.spd*=Math.min(1.25,1+(D.hp-1)*0.05)}
  e.maxhp=e.hp;e.sc=d.boss?2:1;solidPlace(e,e.r);enemies.push(e);return e}
function pickType(t){
  const pool=MAPS[S.map].pool.filter(p=>t>=p[0]).map(p=>[p[1],p[2]+(p[0]>200&&!ET[p[1]].elite?t/200:0)]);
  let sum=pool.reduce((a,b)=>a+b[1],0),r=rnd(sum);for(const [k,w] of pool){if((r-=w)<=0)return k}return pool[0][0]}
// ---------- eventos aleatorios: cada partida cambia (sesión 9) ----------
const EVENTOS=['kaio','meteoros','karin','horda','zeni','furia','esfera','elite','gravedad','genkidama','tiempo','fusion'];
function eventos(dt){if(S.boss||S.isl)return;const E=S.ev;
  if(E){E.t-=dt;
    if(E.k==='kaio'){if(S.kills-E.k0>=E.need){S.ev=null;S.pending++;S.zeni+=50;S.banner={t:2.2,text:'¡RETO SUPERADO!',sub:'Kaio te premia: mejora extra y 50 zeni'};sfx('level')}
      else if(E.t<=0){S.ev=null;S.banner={t:2,text:'RETO FALLIDO',sub:'Kaio no se ríe de tus chistes'}}}
    else if(E.k==='meteoros'){E.m=(E.m||0)-dt;if(E.t>0&&E.m<=0){E.m=0.4;E.list.push({x:P.x+rnd(-150,150),y:P.y+rnd(-110,110),t:1})}
      for(let i=E.list.length-1;i>=0;i--){const m=E.list[i];if((m.t-=dt)<=0){explode(m.x,m.y,30,40+P.lvl*4,['#8a2a10','#ff7a3a','#ffd08a','#ffffff']);if(Math.hypot(P.x-m.x,P.y-m.y)<30)hitPlayer(12,true);E.list.splice(i,1)}}
      if(E.t<=0&&!E.list.length)S.ev=null}
    else if(E.k==='furia'){if(E.t<=0){S.ev=null}}
    else if(E.k==='elite'){if(!E.e||E.e.dead){S.ev=null;if(E.e&&E.e.dead){S.banner={t:2,text:'¡ÉLITE DERROTADO!',sub:'Ha soltado un cofre'}}}else if(E.t<=0){E.e.evChest=0;S.ev=null;S.banner={t:2,text:'EL ÉLITE HUYE',sub:'Demasiado lento'}}}
    else if(E.k==='genkidama'){if(E.t<=0){S.ev=null;let n=0;for(const e of enemies)if(!e.dead&&!e.boss&&Math.abs(e.x-P.x)<VW/2+20&&Math.abs(e.y-P.y)<VH/2+20){hurt(e,99999);n++}
        explode(P.x,P.y-10,90,0,['#2a7ad8','#6ab8ff','#bfe6ff','#ffffff']);S.flash=0.6;cam.shake=10;S.banner={t:2.2,text:'¡GENKIDAMA!',sub:n+' enemigos barridos'};sfx('boom')}}
    else if(E.k==='tiempo'){for(const e of enemies)if(!e.boss&&!e.dead)e.stun=Math.max(e.stun||0,0.1);if(E.t<=0)S.ev=null}
    else if(E.t<=0)S.ev=null;return}
  S.evT=(S.evT===undefined?140:S.evT)-dt;if(S.evT>0)return;S.evT=rnd(65,95);let k=EVENTOS[(Math.random()*EVENTOS.length)|0];if(k===S.lastEv)k=EVENTOS[(EVENTOS.indexOf(k)+1)%EVENTOS.length];S.lastEv=k;
  if(k==='kaio'){S.ev={k,t:25,need:20+Math.floor(S.t/25),k0:S.kills};S.banner={t:2.5,text:'¡RETO DE KAIO!',sub:`Derrota a ${S.ev.need} enemigos en 25 segundos`}}
  else if(k==='meteoros'){S.ev={k,t:12,list:[]};S.banner={t:2.5,text:'¡LLUVIA DE METEORITOS!',sub:'Esquiva las marcas rojas: también dañan a los enemigos',boss:1}}
  else if(k==='karin'){for(let i=0;i<3;i++){const a=i/3*TAU+rnd(0,1);putPickup({k:'senzu',x:P.x+Math.cos(a)*80,y:P.y+Math.sin(a)*80})}S.banner={t:2.5,text:'¡SEMILLAS DE KARIN!',sub:'Han caído tres senzus cerca de ti'}}
  else if(k==='horda'){const typ=pickType(S.t),r=Math.max(VW,VH)/2+10,side=Math.random()<.5?0:Math.PI;for(let i=0;i<26&&enemies.length<MAXE;i++){const a=side+rnd(-0.6,0.6);spawn(typ,P.x+Math.cos(a)*r,P.y+Math.sin(a)*r)}S.banner={t:2.2,text:'¡ESTAMPIDA!',sub:'Una horda carga por un lado'}}
  else if(k==='zeni'){for(let i=0;i<10;i++)putPickup({k:'zeni',x:P.x+rnd(-110,110),y:P.y+rnd(-80,80)});S.banner={t:2.2,text:'¡LLUVIA DE ZENI!',sub:'Recógelo antes de que se acerquen'}}
  else if(k==='esfera'){if(S.balls>=7){S.evT=1;return}const a=rnd(TAU);putPickup({k:'dball',n:(S.ballN++%7)+1,x:P.x+Math.cos(a)*320,y:P.y+Math.sin(a)*320});S.banner={t:2.5,text:'¡UNA ESFERA HA CAÍDO!',sub:'Sigue el radar antes de que te alcancen'}}
  else if(k==='elite'){const a=rnd(TAU),e=spawn(pickType(S.t),P.x+Math.cos(a)*170,P.y+Math.sin(a)*170);if(!e){S.evT=1;return}e.hp=Math.max(e.hp*14,350+S.t*4+P.lvl*25);e.maxhp=e.hp;e.spd*=1.25;e.dmg*=1.6;e.aura='red';e.evChest=1;S.ev={k,t:35,e};S.banner={t:2.5,text:'¡GUERRERO DE ÉLITE!',sub:'Derrótalo en 35 s y suelta un cofre',boss:1};sfx('boss')}
  else if(k==='gravedad'){S.ev={k,t:20};S.banner={t:2.5,text:'¡GRAVEDAD x100!',sub:'Te mueves más lento, pero ganas el doble de experiencia'}}
  else if(k==='genkidama'){S.ev={k,t:10};S.banner={t:2.5,text:'¡LEVANTAD LAS MANOS!',sub:'La Genkidama estará lista en 10 segundos'};P.powT=1}
  else if(k==='tiempo'){S.ev={k,t:6};S.banner={t:2.2,text:'¡TIEMPO DETENIDO!',sub:'Los enemigos no se mueven durante 6 segundos'};S.flash=0.4;sfx('trans')}
  else if(k==='fusion'){S.ev={k,t:15};S.banner={t:2.5,text:'¡FUSIÓN!',sub:'15 segundos: más velocidad y ataques más rápidos'};P.powT=1.2;sfx('trans')}
  else if(k==='furia'){S.ev={k,t:15};S.banner={t:2.5,text:'¡FURIA SAIYAN!',sub:'15 segundos con el doble de daño'};P.powT=1.2;sfx('trans')}}
function director(dt){
  S.spawnT-=dt;
  if(S.spawnT<=0){S.spawnT=Math.max(0.12,1.3-S.t/300)/DIFF[S.diff||0].sp;const n=1+Math.floor(S.t/80)+Math.floor((P.lvl||1)/8);
    for(let i=0;i<n&&enemies.length<MAXE;i++)spawn(pickType(S.t))}
  if(S.ringIdx<RINGS.length&&S.t>=RINGS[S.ringIdx]){S.ringIdx++;const n=S.t<200?18:36,r=Math.max(VW,VH)/2+10,typ=MAPS[S.map].ring[S.t>400?1:0];
    const bi=(Math.random()*n)|0;for(let i=0;i<n;i++){const a=i/n*TAU,e=spawn(typ,P.x+Math.cos(a)*r,P.y+Math.sin(a)*r);if(e&&i===bi)e.ball=1}
    S.banner={t:2,text:'¡EMBOSCADA!',sub:'Te están rodeando'}}
  {const Q=MAPS[S.map].squad;if(Q&&!S.squadDone&&S.t>=Q[0]){S.squadDone=1;Q[1].forEach((id,i)=>{const a=i/Q[1].length*TAU,e=spawn(id,P.x+Math.cos(a)*140,P.y+Math.sin(a)*140);if(e&&i===0)e.ball=1});
    S.banner={t:2.5,text:Q[2],sub:'¡Cuidado, vienen a por ti!',boss:1};sfx('boss');cam.shake=5}}
  {S.waveIdx=S.waveIdx||0;if(S.waveIdx<WAVE_T.length&&S.t>=WAVE_T[S.waveIdx]){const L=WAVES[WSAGA[S.map]||'tierra'],w=L[S.waveIdx%L.length];S.waveIdx++;
    const [typ,cnt]=w,a0=rnd(TAU),r=Math.max(VW,VH)/2+16;for(let i=0;i<cnt&&enemies.length<MAXE;i++){const a=a0+(cnt>1?(i/(cnt-1)-0.5)*1.3:0),e=spawn(typ,P.x+Math.cos(a)*(r+rnd(0,24)),P.y+Math.sin(a)*(r+rnd(0,24)));if(e&&ET[typ].elite&&cnt===1)e.ball=1}
    S.banner={t:2,text:'¡OLEADA!',sub:ET[typ].n,boss:ET[typ].elite?1:0}}}
  {const mi=Math.floor(S.t/60);if(mi>(S.minute||0)){S.minute=mi;const L=MAPS[S.map].pool.filter(p=>S.t>=p[0]&&!ET[p[1]].elite).map(p=>p[1]),typ=L[(Math.random()*L.length)|0]||'saiba',
      n=Math.min(64,mi<3?4+mi*5:12+mi*5),kind=mi%3,r=Math.max(VW,VH)/2+14,a0=rnd(TAU);
      for(let i=0;i<n&&enemies.length<MAXE;i++){const a=kind===1?i/n*TAU:a0+(kind===2&&i%2?Math.PI:0)+rnd(-0.35,0.35),rr=r+(kind===1?0:rnd(0,60)),e=spawn(typ,P.x+Math.cos(a)*rr,P.y+Math.sin(a)*rr);if(e&&kind!==1&&mi>=3)e.spd*=1.25}
      S.banner={t:2,text:'MINUTO '+mi,sub:['¡ESTAMPIDA!','¡TE RODEAN!','¡ATAQUE EN PINZA!'][kind]}}}
  if(S.bossIdx<BOSS_T.length&&S.t>=BOSS_T[S.bossIdx]){const id=MAPS[S.map].bosses[S.bossIdx];S.bossIdx++;spawnBoss(id,S.bossIdx===5)}
  if(S.endless&&S.t>=S.nextEndless){S.nextEndless=S.t+90;const b=MAPS[S.map].bosses;spawnBoss(b[(Math.random()*b.length)|0])}}
function spawnBoss(id,final){islandStart();const a=rnd(TAU);S.bossN=S.bossIdx-1;if(S.endless)S.bossN=4;const e=spawn(id,P.x+Math.cos(a)*90,P.y+Math.sin(a)*90);e.final=!!final;S.boss=e;e.powT=1.8;
  S.banner={t:3,text:'¡'+ET[id].n+'!',sub:'Ha aparecido un villano',boss:1};sfx('boss');cam.shake=6}

// ---------- boss AI ----------
function eshot(x,y,a,sp,dmg,r=3,col='#ff5aa0'){eshots.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r,dmg,life:4,col})}
// boss special beams: a blinking aim line, then a real pixel beam that hurts on contact
const BBEAM={frieza:['RAYO MORTAL',['#a0207a','#ff6ad0','#ffffff'],8],golden:['RAYO MORTAL',['#a0207a','#ff6ad0','#ffffff'],10],frieza100:['RAYO MORTAL',['#a0207a','#ff6ad0','#ffffff'],9],
  cell:['¡KAMEHAMEHA!',['#1a6ad8','#7ac8ff','#ffffff'],18],black:['¡KAMEHAMEHA NEGRO!',['#5a1a6a','#c060d0','#ffffff'],16],rose:['¡KAMEHAMEHA ROSÉ!',['#a02a78','#ff7ac8','#ffffff'],20],
  majinv:['¡FINAL FLASH!',['#c89a10','#ffe066','#ffffff'],22],brolyB:['¡GIGANTIC METEOR!',['#2a8a2a','#8af06a','#ffffff'],24],mecha:['RAYO MORTAL',['#a0207a','#ff6ad0','#ffffff'],8],
  vegeta:['¡GALICK HO!',['#5a2a9a','#b07aff','#ffffff'],16],vegetaSB:['¡GALICK HO!',['#5a2a9a','#b07aff','#ffffff'],16],turles:['¡KILL DRIVER!',['#8a1a1a','#ff7a3a','#ffffff'],14],frost:['RAYO MORTAL',['#2a3aa0','#7ab0ff','#ffffff'],9],coolerB:['¡SUPERNOVA!',['#a0207a','#ff6ad0','#ffffff'],18],freezaF:['RAYO MORTAL',['#a0207a','#ff6ad0','#ffffff'],10],a16B:['¡HELL’S FLASH!',['#c89a10','#ffe066','#ffffff'],18],janemba:['¡RAKSHASA!',['#8a1a2a','#ff5a6a','#ffffff'],16],jiren:['¡POWER IMPACT!',['#a01a1a','#ff6a4a','#ffffff'],20],hitB:['¡SALTO TEMPORAL!',['#5a2a9a','#c08aff','#ffffff'],12],superbuuB:['¡KAMEHAMEHA DE BUU!',['#a02a78','#ff8ad0','#ffffff'],18],zamasuB:['¡ESPADA DIVINA!',['#5a2aa0','#a07aff','#ffffff'],12],billsB:['¡HAKAI!',['#6a2aa0','#c890ff','#ffffff'],24],a19:['ABSORCIÓN',['#c83030','#ff9a5a','#ffffff'],12],buu:['¡VANISH BALL!',['#a02a78','#ff8ad0','#ffffff'],16]};
function bossBeam(e,dt){const B=BBEAM[e.type];if(!B)return false;e.bT=(e.bT===undefined?5:e.bT)-dt;
  if(e.bT<=0){e.bT=7+rnd(0,2);ebeams.push({e,x:e.x,y:e.y-14,a:Math.atan2(P.y-10-(e.y-14),P.x-e.x),t:-1.1,T:1.1,dur:0.8,len:460,wid:B[2],col:B[1],name:B[0],big:B[2]>14,dmg:e.dmg*1.6})}
  return ebeams.some(b=>b.e===e&&b.t<0.8)}
function bossAI(e,dt){
  e.aiT-=dt;const a=Math.atan2(P.y-e.y,P.x-e.x);if(bossBeam(e,dt))return true;
  switch(e.ai){
   case 'dash':if(e.aiS>0){e.aiS-=dt;if(solidMove(e,e.dx*dt,e.dy*dt,e.r))e.aiS=0;return true}
     if(e.aiT<=0){e.aiT=3.6;e.aiS=0.5;e.dx=Math.cos(a)*170;e.dy=Math.sin(a)*170;burst(e.x,e.y-10,10,['#c58af0','#ffffff']);
       const c=ET[e.type].col;if(c)for(let i=-1;i<=1;i++)eshot(e.x,e.y-14,a+i*0.25,150,e.dmg*0.6,3,c)}break;
   case 'frieza':if(e.aiT<=0){e.aiT=2.2;e.cnt=(e.cnt||0)+1;
       if(e.cnt%3===0){for(let i=0;i<14;i++)eshot(e.x,e.y-14,i/14*TAU,70,e.dmg*0.6,3,ET[e.type].col2||'#ff5aa0')}
       else for(let i=0;i<3;i++)setTimeout(()=>{if(!e.dead)eshot(e.x,e.y-14,Math.atan2(P.y-8-e.y+14,P.x-e.x),190,e.dmg*0.7,2,ET[e.type].col||'#ff3a6a')},i*120)}break;
   case 'spiral':e.sp=(e.sp||0)+dt*2.4;if(e.aiT<=0){e.aiT=0.16;eshot(e.x,e.y-14,e.sp,80,e.dmg*0.5,3,ET[e.type].col||'#ff7a4a');eshot(e.x,e.y-14,e.sp+Math.PI,80,e.dmg*0.5,3,ET[e.type].col||'#ff7a4a')}break;
   case 'cell':if(e.aiT<=0){e.aiT=3.5;e.cnt=(e.cnt||0)+1;
       eshot(e.x,e.y-14,a,95,e.dmg*1.2,7,'#5ab0ff');
       // La invocación de Cell Jr. volverá cuando tenga secuencias revisadas.
       }break;
   case 'buu':if(e.aiS>0){e.aiS-=dt;if(solidMove(e,e.dx*dt,e.dy*dt,e.r))e.aiS=0;return true}
     if(e.aiT<=0){e.aiT=2.6;e.cnt=(e.cnt||0)+1;
       if(e.cnt%2){e.aiS=0.5;e.dx=Math.cos(a)*260;e.dy=Math.sin(a)*260}
       else for(let i=0;i<18;i++)eshot(e.x,e.y-14,i/18*TAU+e.cnt,85,e.dmg*0.6,3,ET[e.type].col||'#ff8ad0')}break;
  }
  return false}

// ---------- level up / cards ----------
function gainXP(v){if(S.ev&&S.ev.k==='gravedad')v*=2;P.xp+=v*stats().xp;while(P.xp>=P.need){P.xp-=P.need;P.lvl++;P.need=need(P.lvl);S.pending++}}
function options(){
  const o=[],hid=S.hid;
  for(const id of P.order){const m=P.moves[id];
    if(m.lv<5)o.push({t:'move',id,w:3});
    else if(!m.evo&&P.cards[MV[id].req])o.push({t:'evo',id,w:100})}
  if(P.order.length<4)for(const id in MV){if(P.moves[id])continue;const W=MV[id];if(W.only&&!W.only.includes(hid))continue;if(W.sig||sigList().includes(id))continue;o.push({t:'new',id,w:W.only?3:2})}
  for(const id in CARDS){if((P.cards[id]||0)<5)o.push({t:'card',id,w:2})}
  {const L=sigList(),u=P.sigU||2;if(u<L.length&&P.lvl>=UNLOCK_LV[u])o.push({t:'sig',id:L[u]});sigOpen().forEach((id,i)=>{if(sigLv(i)<5)o.push({t:'sigup',i,id,w:4})})}
  const pick=[];const evo=o.filter(x=>x.t==='evo'||x.t==='sig');pick.push(...evo.slice(0,3));
  let rest=o.filter(x=>x.t!=='evo'&&x.t!=='sig');
  while(pick.length<3&&rest.length){let s=rest.reduce((a,b)=>a+b.w,0),r=rnd(s),i=0;for(;i<rest.length;i++){if((r-=rest[i].w)<=0)break}
    i=Math.min(i,rest.length-1);pick.push(rest[i]);rest.splice(i,1)}
  if(!pick.length)pick.push({t:'heal'},{t:'zeni'});
  return pick}
function applyOpt(op){
  switch(op.t){
   case 'move':case 'new':addMove(op.id);break;
   case 'evo':P.moves[op.id].evo=true;S.evos++;S.banner={t:2,text:MV[op.id].evo.toUpperCase(),sub:'¡Técnica evolucionada!'};break;
   case 'card':P.cards[op.id]=(P.cards[op.id]||0)+1;if(op.id==='hp')P.hp+=20;break;
   case 'heal':P.hp=stats().maxhp;break;
   case 'sig':P.sigU=(P.sigU||2)+1;break;
   case 'sigup':P.sigB[op.i]=(P.sigB[op.i]||0)+1;break;
   case 'zeni':S.zeni+=50;break;
  }
  P.hp=Math.min(P.hp,stats().maxhp)}
function optInfo(op){
  if(op.t==='move'||op.t==='new'){const W=MV[op.id],lv=P.moves[op.id]?P.moves[op.id].lv+1:1;return{ic:op.id,nm:W.name,lv:op.t==='new'?'¡NUEVA TÉCNICA!':'NIVEL '+lv,ds:W.ds[lv-1]+(lv===5?' · Evoluciona con '+CARDS[W.req].name:''),cls:op.t==='new'?'new':''}}
  if(op.t==='evo'){const W=MV[op.id];return{ic:op.id,nm:W.evo,lv:'CARTA DORADA',ds:'Evoluciona '+W.name+': mucho más daño y tamaño.',cls:'evo'}}
  if(op.t==='card'){const C=CARDS[op.id],lv=(P.cards[op.id]||0)+1;return{ic:op.id,nm:C.name,lv:'NIVEL '+lv,ds:C.ds,cls:''}}
  if(op.t==='sig'||op.t==='sigup'){const W=MV[op.id],cv=mk(16,16),KD={beam:'Onda de energía gigante',big:'Esfera de energía que estalla',shot:'Ráfaga de bolas de ki',melee:'Golpes cuerpo a cuerpo',sword:'Corte en arco',nova:'Onda de choque a tu alrededor',disc:'Disco cortante',bomb:'Esfera gigante que cae del cielo'};cv.getContext('2d').drawImage(sigIcon(op.id),0,0);
    if(op.t==='sig')return{cv,nm:W.name,lv:'¡NUEVO ATAQUE!',ds:KD[W.kind]+'. Se usa con la tecla '+((P.sigU||2)+1)+'.',cls:'evo'};
    return{cv,nm:W.name,lv:'NIVEL '+(sigLv(op.i)+1),ds:'Más daño y alcance. Tecla '+(op.i+1)+'.',cls:''}}
  if(op.t==='heal')return{ic:'senzu',nm:'Semilla Senzu',lv:'CURA',ds:'Recupera toda la vida.',cls:''};
  return{ic:'xp',nm:'Zeni',lv:'+50',ds:'Monedas para la tienda.',cls:''}}
function openLevelUp(title){
  state='levelup';const box=$('#ups');box.innerHTML='';$('#luTitle').textContent=title||'¡Nivel '+P.lvl+'!';
  options().forEach((op,i)=>{const inf=optInfo(op),b=document.createElement('button');b.type='button';b.className='up '+inf.cls;
    const ic=inf.cv||icon(inf.ic);ic.setAttribute('aria-hidden','true');b.appendChild(ic);
    b.insertAdjacentHTML('beforeend',`<span class="tx"><span class="hd"><span class="nm">${inf.nm}</span><span class="lv">${inf.lv}</span></span><span class="ds">${inf.ds}</span></span><span class="key">${i+1}</span>`);
    b.onclick=()=>{applyOpt(op);sfx('gem');$('#levelup').hidden=true;S.pending=Math.max(0,S.pending-1);state='play';last=performance.now()};
    box.appendChild(b)});
  $('#levelup').hidden=false;setTimeout(()=>{const f=box.querySelector('button');f&&f.focus({preventScroll:true})},30);sfx('level')}
// ---------- deseo de transformación ----------
// las formas se piden a Shenron en el menú (guardado: formas[héroe] = cuántas hay despertadas); cuesta FORMA_TK × número de la forma
const FORMA_TK=5;
function formasAbiertas(hid){const H=HEROES[hid];return H?clamp(((loadSave().formas||{})[hid])||0,0,H.forms.length-1):0}
function costeForma(hid){return FORMA_TK*(formasAbiertas(hid)+1)}
function pedirForma(hid){const s=loadSave(),H=HEROES[hid],n=formasAbiertas(hid)+1;if(!H||n>=H.forms.length)return 'todas';
  const c=FORMA_TK*n;if((s.tickets||0)<c)return 'faltan';s.tickets-=c;(s.formas||(s.formas={}))[hid]=n;writeSave();return 'ok'}
function formaUI(){const b=$('#gForma');if(!b)return;const hid=companion(),H=HEROES[hid];if(!H||H.forms.length<2){b.hidden=true;return}
  const n=formasAbiertas(hid)+1;b.hidden=false;b.disabled=n>=H.forms.length;
  if(b.disabled){b.textContent=`${H.name}: TODAS SUS FORMAS DESPERTADAS`;return}
  b.textContent=`DESEO: DESPERTAR ${H.forms[n]} DE ${H.name} · ${FORMA_TK*n} TICKETS`;
  b.onclick=()=>{const r=pedirForma(hid);gachaInfo();formaUI();
    $('#gInfo').textContent=r==='ok'?`¡Deseo cumplido! ${H.name} ya puede transformarse en ${H.forms[n]} al subir de nivel.`:`Te faltan tickets: necesitas ${FORMA_TK*n}. Gana más jugando partidas.`;if(r==='ok')sfx('trans')}}
// ---------- fin del deseo de transformación
function checkForm(){const lv=FORM_LV.filter(l=>P.lvl>=l).length-1,f=Math.min(HEROES[S.hid].forms.length-1,formasAbiertas(S.hid),lv);
  if(lv>f&&f<HEROES[S.hid].forms.length-1&&!S.formAviso){S.formAviso=1;S.banner={t:2.6,text:'FORMA BLOQUEADA',sub:'Pídesela a Shenron en el menú'}}
  if(f>P.form){S.forms+=f-P.form;P.form=f;P.hp=stats().maxhp;
  S.banner={t:2.6,text:HEROES[S.hid].forms[f]+'!',sub:'¡Transformación!',trans:1};S.flash=0.5;S.freeze=0.6;P.powT=1.6;cam.shake=8;sfx('trans');
  burst(P.x,P.y-10,60,['#ffd23f','#ffffff','#fff6a8'])}}

// ---------- tipos de enemigo ----------
// pegador: avisa y golpea en corto · embestidor: se carga y embiste recto · tirador: guarda distancia · élite: avisa menos y encadena golpes
// roce: daño por segundo de cada enemigo pegado (sin invulnerabilidad), así rodearte de muchos es peligroso y uno suelto no
const ROL_AJ={aviso:0.5,avisoE:0.3,golpe:0.18,encadena:0.45,golpesE:3,alcance:22,cdGolpe:1.1,cargaAviso:0.6,cargaVel:200,cargaDur:0.45,cargaMin:30,cargaMax:110,cdCarga:1.8,tiroMin:90,tiroMax:150,roce:0.5,maxBalas:6};
function rolE(e){if(e.rol)return e.rol;const T=ET[e.type]||{};return e.rol=T.boss?'jefe':T.kami?'kami':T.elite?'elite':T.shoot?'tirador':T.spd>=44?'embestidor':'pegador'}
function rolCancel(e){if(e.stun>0&&e.atk)e.atk=null}
// velocidad que pide el tipo, o null para perseguir como siempre
function rolAI(e,d,dx,dy,dt){const r=rolE(e),A=ROL_AJ;if(r==='jefe'||r==='kami')return null;
  if(e.atkCd>0)e.atkCd-=dt;const a=e.atk;
  if(a){a.t-=dt;
    if(a.f==='aviso'){if(a.t<=0){a.f='golpe';a.t=A.golpe;a.k=!a.k;if(d<A.alcance+e.r)hitPlayer(e.dmg,false)}return[0,0]}
    if(a.f==='golpe'){if(a.t<=0){if(--a.n>0){a.f='aviso';a.t=A.encadena}else{e.atk=null;e.atkCd=A.cdGolpe}}return[0,0]}
    if(a.f==='carga'){if(a.t<=0){a.f='embiste';a.t=A.cargaDur}return[0,0]}
    if(!a.hit&&d<e.r+8){a.hit=1;hitPlayer(e.dmg,false)}
    if(a.t<=0){e.atk=null;e.atkCd=A.cdCarga;return[0,0]}return[a.ux*A.cargaVel,a.uy*A.cargaVel]}
  const ux=dx/d,uy=dy/d,listo=!(e.atkCd>0);
  if(r==='tirador'){if(d<A.tiroMin)return[-ux*e.spd*1.1,-uy*e.spd*1.1];if(d<A.tiroMax){const q=e.avoid||1;return[-uy*e.spd*0.5*q,ux*e.spd*0.5*q]}return null}
  if(listo&&d<A.alcance+e.r){e.atk={f:'aviso',t:r==='elite'?A.avisoE:A.aviso,n:r==='elite'?A.golpesE:1};return[0,0]}
  if(r==='embestidor'&&listo&&d>A.cargaMin&&d<A.cargaMax){e.atk={f:'carga',t:A.cargaAviso,ux,uy};return[0,0]}
  return null}
// ---------- fin de los tipos de enemigo
// ---------- update ----------
function update(dt){
  if(S.freeze>0){S.freeze-=dt;updateFx(dt);return}
  S.t+=dt;const ps=stats();
  // move
  let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),my=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
  if(joy.on){const dx=joy.x-joy.ox,dy=joy.y-joy.oy,d=Math.hypot(dx,dy);if(d>3){mx=dx/Math.max(d,18);my=dy/Math.max(d,18)}}
  const ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml}
  P.moving=ml>0.05;if(!P.moving&&P.atkT>0&&P.atkFace)P.face=P.atkFace;else{P.atkFace=0;if(mx<-0.1)P.face=-1;else if(mx>0.1)P.face=1}
  if(P.cast){P.cast.t-=dt;if(P.cast.t<=0)P.cast=null}
  const inW=onWaterAt(P.x,P.y),slow=(P.cast?0.45:1)*(inW?0.85:1)*(S.ev&&S.ev.k==='gravedad'?0.65:S.ev&&S.ev.k==='fusion'?1.35:1);if(inW&&P.moving&&Math.random()<0.5)parts.push({x:P.x+rnd(-5,5),y:P.y-1,vx:rnd(-14,14),vy:-rnd(12,28),t:0.35,c:MAPK==='infierno'?'#ff8a9a':'#e0f6ff',s:1});
  if(P.moving){if(Math.abs(mx)>Math.abs(my)*1.1)P.dir='side';else P.dir=my<0?'up':'down'}
  solidMove(P,mx*ps.spd*dt*slow,my*ps.spd*dt*slow,5);islandTick();solidResolve(P,5);crateTick(dt);if(P.moving)P.anim+=dt*9;
  P.iframe-=dt;P.hitT-=dt;P.atkT=(P.atkT||0)-dt;if(P.mcd)for(let i=0;i<3;i++)P.mcd[i]-=dt;if(P.shout&&(P.shout.t-=dt)<=0)P.shout=null;
  if(P.moving&&Math.random()<0.25)parts.push({x:P.x+rnd(-3,3),y:P.y-1,vx:-mx*10,vy:-rnd(2,8),t:0.3,c:MAPK==='namek'?'#a6d8a0':MAPK==='tierra'||MAPK==='kame'?'#e6cfa0':MAPK==='musculo'?'#ffffff':'#d8d4c0',s:1});
  if(ps.regen)P.hp=Math.min(ps.maxhp,P.hp+ps.regen*dt);
  if(P.form>0&&Math.random()<0.5)parts.push({x:P.x+rnd(-7,7),y:P.y-rnd(0,18),vx:0,vy:-rnd(20,45),t:rnd(0.2,0.45),c:S.hid==='piccolo'?(P.form===3?'#ffb060':'#c8f0ff'):(Math.random()<.5?'#ffd23f':'#fff6a8'),s:1});
  director(dt);eventos(dt);gridBuild();updateMoves(dt,ps);sigUpdate(dt,ps);
  // enemies
  const far=Math.hypot(VW,VH)*0.75;
  for(const e of enemies){if(e.dead)continue;
    // Un enemigo que todavía no se puede ver no se mueve ni ataca.
    if(e.spr.pending){e.spr=enemySprite(e.type);if(e.spr.pending)continue;e.h=e.spr.h}
    e.flash-=dt;e.anim+=dt*6;if(e.powT>0)e.powT-=dt;if(e.crate)continue;
    let skip=false;if(e.boss)skip=bossAI(e,dt);
    const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
    let vx=0,vy=0;if(e.stun>0){rolCancel(e);e.stun-=dt}else if(!skip){const v=rolAI(e,d,dx,dy,dt);if(v){vx=v[0];vy=v[1]}else{vx=dx/d*e.spd;vy=dy/d*e.spd;if(e.avoidT>0){e.avoidT-=dt;const q=e.avoid||1,nx=-dy/d*q,ny=dx/d*q;vx=vx*0.3+nx*e.spd*0.95;vy=vy*0.3+ny*e.spd*0.95}}}
    if(!skip){vx+=e.kx;vy+=e.ky;const hit=solidMove(e,vx*dt,vy*dt,e.r);if(hit){e.avoidT=0.45;e.avoid=e.avoid||(((e.x*13+e.y*7)|0)&1?1:-1)}}else solidResolve(e,e.r);e.kx*=0.86;e.ky*=0.86;
    if(!e.boss){let pushed=0;near(e.x,e.y,10,o=>{if(o===e)return;const ox=e.x-o.x,oy=e.y-o.y,dd=ox*ox+oy*oy;if(dd<100&&dd>0.001){const f=(10-Math.sqrt(dd))*0.25,l=Math.sqrt(dd);e.x+=ox/l*f;e.y+=oy/l*f;pushed=1}});if(pushed)solidResolve(e,e.r)}
    e.stT=(e.stT||0)+dt;if(e.stT>0.7){const moved=e.stX===undefined?99:Math.hypot(e.x-e.stX,e.y-e.stY);e.stuck=moved<1.5&&d>24?(e.stuck||0)+e.stT:0;e.stX=e.x;e.stY=e.y;e.stT=0;if(e.stuck>1.4){solidPlace(e,e.r,1);e.avoidT=0.8;e.avoid=-(e.avoid||1);e.stuck=0}}
    if(e.shootT){e.shootT-=dt;if(e.shootT<=0){e.shootT=ET[e.type].shoot;if(d>=MELEE_AJ.sinDisparo&&d<170&&eshots.length<ROL_AJ.maxBalas)eshot(e.x+dx/d*6,e.y-12,Math.atan2(dy-6+12,dx),90,e.dmg*0.7,2,ET[e.type].col||'#ffe05a')}}
    if(ET[e.type].kami){if(e.fuse===undefined&&d<28){e.fuse=0.75;e.spd*=0.25;texts.push({x:e.x,y:e.y-22,v:'!',t:0.7,c:'#ff3030'})}
      if(e.fuse!==undefined){e.fuse-=dt;e.flash=((e.fuse*14)|0)%2?0.05:0;
        if(e.fuse<=0){e.dead=true;fx(e.x,e.y-6,'fire',22,0.5);smoke(e.x,e.y-6,8);burst(e.x,e.y-6,20,['#fff6a0','#ffd23f','#ff8a2a']);cam.shake=Math.max(cam.shake,5);sfx('boom');
          if(d<36)hitPlayer(e.dmg,true);near(e.x,e.y,40,o=>{if(o!==e&&!o.boss)hurt(o,40)})}}
      continue}
    if(d<e.r+6){if(e.boss)hitPlayer(e.dmg,true);else roce(e.dmg*ROL_AJ.roce*dt)}
    if(!e.boss&&d>far){const a=rnd(TAU),r=Math.hypot(VW,VH)/2+20;e.x=P.x+Math.cos(a)*r;e.y=P.y+Math.sin(a)*r;solidPlace(e,e.r)}}
  // player projectiles
  for(const p of projs){p.life-=dt;
    if(p.k==='disc'){p.age+=dt;if(p.age>p.out){const dx=P.x-p.x,dy=P.y-10-p.y,d=Math.hypot(dx,dy)||1;p.vx+=(dx/d*260-p.vx)*dt*6;p.vy+=(dy/d*260-p.vy)*dt*6;if(d<10&&p.age>p.out+0.1)p.life=0;if(!p.back){p.back=1;p.hit.clear()}}}
    // bolas teledirigidas: salen abiertas y luego giran hacia su enemigo
    if(p.home&&(p.age=(p.age||0)+dt)>0.12){if(p.home===true||p.home.dead)p.home=nearest(p.x,p.y,240)||true;if(p.home!==true){const sp=Math.hypot(p.vx,p.vy),a=Math.atan2(p.home.y-8-p.y,p.home.x-p.x),k=Math.min(1,dt*7);p.vx+=(Math.cos(a)*sp-p.vx)*k;p.vy+=(Math.sin(a)*sp-p.vy)*k}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0)continue;
    near(p.x,p.y+6,p.r+14,e=>{if(p.life<=0||p.hit.has(e))return;if(Math.hypot(e.x-p.x,e.y-6-p.y)<p.r+e.r){p.hit.add(e);
      if(p.k==='big'){explode(p.x,p.y,p.rad,p.dmg,p.col);p.life=0;return}
      const l=Math.hypot(p.vx,p.vy)||1;hurt(e,p.dmg,p.vx/l*70,p.vy/l*70);if(p.pierce--<=0)p.life=0}});
    if(p.k==='big'&&p.life<=0&&!p.boomed){p.boomed=1;explode(p.x,p.y,p.rad,p.dmg,p.col)}
    if(p.k==='ki'&&Math.random()<0.5)parts.push({x:p.x,y:p.y,vx:0,vy:0,t:0.15,c:p.col[1],s:1})}
  projs=projs.filter(p=>p.life>0);
  // beams
  for(const b of beams){b.t+=dt;const fx=Math.cos(b.a)<0?-1:1,hp=b.hero?heroHand(b.t<0?0:1,fx<0):null;if(hp){b.x=hp[0];b.y=hp[1]}else{b.x=P.x+fx*(b.t<0?-10:15);b.y=P.y-(b.t<0?14:19)}
    if(b.hero&&b.t>=0&&b.t<b.dur*0.8){cam.shake=Math.max(cam.shake||0,b.big?2.5:1.5);if(Math.random()<0.6)parts.push({x:b.x+rnd(-3,3),y:b.y+rnd(-3,3),vx:-fx*rnd(20,60),vy:rnd(-30,30),t:0.25,c:b.col[Math.random()<0.5?1:2],s:2})}
    if(b.t>=0){b.tick-=dt;if(b.tick<=0){b.tick=0.1;const ca=Math.cos(b.a),sa=Math.sin(b.a);
      for(const e of enemies){if(e.dead)continue;const ex=e.x-b.x,ey=e.y-6-b.y,along=ex*ca+ey*sa;if(along<0||along>b.len)continue;
        const perp=Math.abs(-ex*sa+ey*ca);if(perp<b.wid/2+e.r)hurt(e,b.dmg,ca*40,sa*40)}}}}
  beams=beams.filter(b=>b.t<b.dur);
  // bombs
  for(const b of bombs){b.t+=dt;if(b.t>=b.fall&&!b.done){b.done=1;explode(b.x,b.y,b.rad,b.dmg,b.col)}}
  bombs=bombs.filter(b=>!b.done);
  // enemy shots
  for(const s of eshots){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(Math.abs(s.x-P.x)<s.r+6&&s.y>P.y-30-s.r&&s.y<P.y+s.r){hitPlayer(s.dmg);s.life=0}}
  eshots=eshots.filter(s=>s.life>0);
  for(const b of ebeams){b.t+=dt;if(b.e.dead&&b.t<0)b.t=99;b.x=b.e.x;b.y=b.e.y-14;
    if(b.t>=0.08&&b.t<b.dur){const dx=P.x-b.x,dy=P.y-10-b.y,along=dx*Math.cos(b.a)+dy*Math.sin(b.a),perp=Math.abs(-dx*Math.sin(b.a)+dy*Math.cos(b.a));
      if(along>0&&along<b.len&&perp<b.wid/2+5)hitPlayer(b.dmg,true)}
    if(b.t>=0&&!b.fired){b.fired=1;sfx('boom');cam.shake=Math.max(cam.shake,5)}}
  ebeams=ebeams.filter(b=>b.t<b.dur);
  enemies=enemies.filter(e=>!e.dead);
  // gems & pickups
  for(const g of gems){const dx=P.x-g.x,dy=P.y-6-g.y,d=Math.hypot(dx,dy);
    if(d<ps.mag)g.mag=true;if(g.mag){const sp=Math.max(140,280-d);g.x+=dx/(d||1)*sp*dt;g.y+=dy/(d||1)*sp*dt}
    if(d<8){g.got=1;gainXP(g.v);sfx('gem')}}
  gems=gems.filter(g=>!g.got);
  for(const k of pickups){const d=Math.hypot(P.x-k.x,P.y-k.y);
    if(k.k==='magnet'||d<ps.mag*0.6){k.x+=(P.x-k.x)*dt*6;k.y+=(P.y-k.y)*dt*6}
    if(d<12){k.got=1;
      if(k.k==='senzu'||k.k==='capsulaVida'||k.k==='capsulaKi'||k.k==='radar')recogerObjeto(k.k,ps);
      if(k.k==='zeni'){S.zeni+=10;sfx('gem')}
      if(k.k==='dball'){S.balls++;sfx('level');S.banner={t:1.6,text:'¡BOLA DE '+k.n+' ESTRELLA'+(k.n>1?'S':'')+'!',sub:S.balls+' de 7'};if(S.balls>=7){S.balls=0;S.wish=true}}
      if(k.k==='chest'){S.zeni+=60;S.pending++;S.chest=true;for(const g of gems)g.mag=true}}}
  pickups=pickups.filter(k=>!k.got);
  updateFx(dt);
  checkForm();
  if(S.wish&&state==='play'){S.wish=false;S.wishes++;openWish()}
  if(S.pending>0&&state==='play'){openLevelUp(S.chest?'¡COFRE DEL VILLANO!':null);S.chest=false}
}
function recogerObjeto(id,ps){
  if(id==='senzu'||id==='capsulaVida'){const fraccion=id==='senzu'?0.5:0.25;P.hp=Math.min(ps.maxhp,P.hp+ps.maxhp*fraccion);
    S.banner={t:1.4,text:id==='senzu'?'¡SEMILLA SENZU!':'¡CÁPSULA DE VITALIDAD!',sub:'+'+(fraccion*100)+'% vida'}}
  else if(id==='capsulaKi'){P.sigT=0;S.banner={t:1.4,text:'¡CÁPSULA DE KI!',sub:'Tu técnica especial está lista'}}
  else if(id==='radar'){for(const g of gems)g.mag=true;S.radarHasta=S.t+4;
    S.banner={t:1.4,text:'¡RADAR DEL DRAGÓN!',sub:'Atrae toda la experiencia del suelo'}}
  sfx('level');
}
function updateFx(dt){
  for(const p of parts){p.t-=dt;if(!p.ring){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=0.92;p.vy*=0.92}}
  parts=parts.filter(p=>p.t>0);
  for(const f of fxs)f.t+=dt;fxs=fxs.filter(f=>f.t<f.T);
  for(const t of texts){t.t-=dt;t.y-=18*dt}texts=texts.filter(t=>t.t>0);
  if(S.banner){S.banner.t-=dt;if(S.banner.t<=0)S.banner=null}
  S.flash=Math.max(0,S.flash-dt);cam.shake=Math.max(0,cam.shake-dt*20)}

// ---------- render ----------
const DIG={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111'};
function digits(str,x,y,col){const w=str.length*4;x=Math.round(x-w/2);y=Math.round(y);
  for(const pass of [0,1])for(let i=0;i<str.length;i++){const d=DIG[str[i]];if(!d)continue;
    for(let j=0;j<15;j++)if(d[j]==='1'){const px=x+i*4+j%3,py=y+(j/3|0);
      if(pass===0){ctx.fillStyle=OUTL;ctx.fillRect(px-1,py-1,3,3)}else{ctx.fillStyle=col;ctx.fillRect(px,py,1,1)}}}}
function text(s,x,y,col,size=8,align='center'){s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');ctx.font=size+'px "Press Start 2P", monospace';ctx.textAlign=align;ctx.textBaseline='top';
  ctx.fillStyle=OUTL;for(const [a,b] of [[-1,0],[1,0],[0,-1],[0,1],[1,1]])ctx.fillText(s,x+a,y+b);ctx.fillStyle=col;ctx.fillText(s,x,y)}
function drawPkEnemy(e,x,y){const o=e.spr.pk,t=e.anim/6,left=e.x>P.x,d=Math.hypot(P.x-e.x,P.y-e.y),T=ET[e.type]||{};let A=o.Walk&&(o.Walk.R.length>1||(d>48&&!e.stun))?o.Walk:o.Idle,i=0,bob=0;
  const eb=e.boss&&o.Cast?ebeams.find(b=>b.e===e&&b.t<b.dur):null;
  if(e.powT>0&&o.Pow){A=o.Pow;i=(e.anim*1.4|0)%A.R.length}
  else if(eb){A=o.Cast;i=eb.t<0?0:Math.min(1,A.R.length-1)}
  else if(e.atk&&o.Attack){const f=e.atk.f;if(f==='aviso'){A=o.Attack;i=0}else if(f==='golpe'){A=e.atk.k&&o.Kick?o.Kick:o.Attack;i=A.R.length-1}else if(f==='carga'){A=o.Pow||o.Attack;i=0}else{A=o.Walk||o.Attack;i=scFrame(A,t)}}
  else if(e.flash>0&&o.Hurt){A=o.Hurt;i=1}
  else if(e.boss&&d<e.r+18&&o.Attack){A=o.Attack;i=scFrame(A,t)}
  else if(T.shoot&&o.Cast&&(e.shootT<0.35||e.shootT>T.shoot-0.25)){A=o.Cast;i=e.shootT<0.35?0:Math.min(1,A.R.length-1)}
  else if(A.R.length>1)i=scFrame(A,t);else bob=Math.round(Math.sin(t*6+e.x*0.07)*1);
  const im=(left?A.L:A.R)[i]||A.R[0],z=e.boss?0.62:(T.z||0.5),w=im.width*z,hh=im.height*z;e.dh=hh;ctx.drawImage(im,Math.round(x-w/2),Math.round(y-hh+bob),w,hh);
  if(e.flash>0){ctx.globalAlpha=0.55;const wi=e.spr.pkw||(e.spr.pkw={});const key=A===o.Hurt?'h'+left:'x';if(!wi[key])wi[key]=tintC(im,'#ffffff');ctx.drawImage(wi[key],Math.round(x-w/2),Math.round(y-hh+bob),w,hh);ctx.globalAlpha=1}
  // aviso de ataque: «!» parpadeando sobre la cabeza y, al cargar una embestida, la línea por donde va a pasar
  const k=e.atk;if(k&&(k.f==='aviso'||k.f==='carga')){const ax=Math.round(x),ay=Math.round(y-hh-15);
    if((e.anim*2|0)%2||k.t<0.15){ctx.fillStyle=OUTL;ctx.fillRect(ax-2,ay-1,4,8);ctx.fillStyle=ET[e.type].elite?'#ff3030':'#ffd23f';ctx.fillRect(ax-1,ay,2,4);ctx.fillRect(ax-1,ay+5,2,1)}
    if(k.f==='carga'){ctx.fillStyle='rgba(255,60,40,0.45)';for(let s=10;s<ROL_AJ.cargaVel*ROL_AJ.cargaDur;s+=8)ctx.fillRect(Math.round(x+k.ux*s)-1,Math.round(y-4+k.uy*s)-1,3,2)}}}
function drawSprite(spr,x,y,frame,flip,white,scale=1){
  const arr=white?(flip?spr.whf:spr.wh):(flip?spr.fl:spr.fr),c=arr[((frame*arr.length/4|0)%arr.length+arr.length)%arr.length]||arr[0];if(!c)return;if(spr.half)scale*=spr.half;const w=c.width*scale,h=c.height*scale;
  ctx.drawImage(c,Math.round(x-w/2),Math.round(y-h),w,h)}
function shadow(x,y,w){ctx.fillStyle='rgba(8,30,20,.35)';const hw=Math.round(w/2);ctx.fillRect(Math.round(x-hw+1),Math.round(y-1),hw*2-2,3);ctx.fillRect(Math.round(x-hw+2),Math.round(y-2),hw*2-4,5)}
let MAPK='namek';
function groundTile(set,tx,ty){const v=h2(tx,ty,5),n=set.length;return set[v<0.5?(v*(n-2)|0):Math.min(n-1,n-3+((v-0.5)*6|0))]}
const WORLD={
 namek:{
  special:isWater,
  tile(tx,ty,x,y,wf){
    if(isWater(tx,ty)){ctx.drawImage(TILES.water[(wf+((tx+ty)&1))%4],x,y);ctx.fillStyle='#a8f0e0';
      if(!isWater(tx,ty-1))ctx.fillRect(x,y,T,1);if(!isWater(tx,ty+1))ctx.fillRect(x,y+T-1,T,1);
      if(!isWater(tx-1,ty))ctx.fillRect(x,y,1,T);if(!isWater(tx+1,ty))ctx.fillRect(x+T-1,y,1,T);return}
    ctx.drawImage(groundTile(TILES.grass,tx,ty),x,y);edges(tx,ty,x,y,isWater,'#c9d98a','#a6c070')},
  decor(tx,ty,v){if(v<0.012)return DECOR['tree'+(v<0.005?1:0)];if(v<0.016)return DECOR.rock;if(v<0.0172&&!isWater(tx+1,ty)&&!isWater(tx,ty+1))return DECOR.house;if(v<0.0182&&tx*tx+ty*ty>100)return DECOR.mesa;return null}},
 tierra:{
  special:isCanyon,
  tile(tx,ty,x,y){
    if(isCanyon(tx,ty)){ctx.drawImage(groundTile(TILES.canyon,tx,ty),x,y);
      if(!isCanyon(tx,ty-1)){ctx.fillStyle='#5a3c22';ctx.fillRect(x,y,T,4);ctx.fillStyle='#7a5432';ctx.fillRect(x,y+4,T,1)}return}
    ctx.drawImage(groundTile(TILES.sand,tx,ty),x,y);edges(tx,ty,x,y,isCanyon,'#e2c48c','#d6b67a')},
  decor(tx,ty,v){if(v<0.006)return DECOR.spire;if(v<0.012)return DECOR.boulder;if(v<0.016)return DECOR.crater;if(v<0.0175)return DECOR.cactus;return null}},
 time:{
  special:()=>false,
  tile(tx,ty,x,y){ctx.drawImage(groundTile(TILES.time,tx,ty),x,y)},
  decor(tx,ty,v){if(tx===0&&ty===-5)return DECOR.temple;if(Math.abs(tx)<8&&Math.abs(ty)<8)return null;if(v<0.004)return DECOR.hourglass;return null}},
 vegetasei:{
  special:isLava,
  tile(tx,ty,x,y,wf){if(isLava(tx,ty)){ctx.drawImage(TILES.lava[(wf+((tx+ty)&1))%4],x,y);return}
    ctx.drawImage(groundTile(TILES.redrock,tx,ty),x,y);edges(tx,ty,x,y,isLava,'#ffb03a','#6a2a1e')},
  decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.008)return DECOR.redspire;if(v<0.012)return DECOR.pod;if(v<0.016)return DECOR.boulder;if(v<0.02)return DECOR.crater;return null}},
 futuro:{
  special:isRoad,
  tile(tx,ty,x,y){if(isRoad(tx,ty)){ctx.drawImage(groundTile(TILES.road,tx,ty),x,y);const m=((tx%26)+26)%26,n=((ty%22)+22)%22;ctx.fillStyle='#e8c040';
      if(m===1&&n>=3&&ty%2===0)ctx.fillRect(x+T-1,y+4,2,8);if(n===1&&m>=3&&tx%2===0)ctx.fillRect(x+4,y+T-1,8,2);return}
    ctx.drawImage(groundTile(TILES.ruin,tx,ty),x,y);edges(tx,ty,x,y,isRoad,'#8a8478','#6e695f')},
  decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.01)return DECOR['ruin'+(v<0.005?0:1)];if(v<0.014)return DECOR.car;if(v<0.022)return DECOR.rubble;return null}},
 arena:{
  special:onRing,
  tile(tx,ty,x,y){
    if(onRing(tx,ty)){ctx.drawImage(groundTile(TILES.stone,tx,ty),x,y);
      ctx.fillStyle='#7d796d';if(!onRing(tx,ty+1)){ctx.fillRect(x,y+T-4,T,4);ctx.fillStyle='#5d5a50';ctx.fillRect(x,y+T-1,T,1)}
      if(!onRing(tx-1,ty)){ctx.fillStyle='#8e8a7e';ctx.fillRect(x,y,2,T)}if(!onRing(tx+1,ty)){ctx.fillStyle='#8e8a7e';ctx.fillRect(x+T-2,y,2,T)}return}
    ctx.drawImage(groundTile(TILES.steppe,tx,ty),x,y)},
  decor(tx,ty,v){if(Math.abs(tx)<16&&Math.abs(ty)<16)return null;if(v<0.008)return DECOR.spire2;if(v<0.015)return DECOR.boulder;if(v<0.019)return DECOR.crater;return null}},
};
// ---------- more Dragon Ball stages (procedural pixel art) ----------
(function moreStages(){
  const mkS=(n,seed,fn)=>{const o=[];for(let v=0;v<n;v++){const c=mk(T,T),g=c.getContext('2d'),r=srand(seed+v*131);fn(g,r,v);o.push(c)}return o};
  const P=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  // noisy ground tile set: base colours, speck colours, optional extra painter
  const nt=(n,seed,base,sp,cnt,ex)=>mkS(n,seed,(g,r,v)=>{P(g,0,0,T,T,base[v%base.length]);for(let i=0;i<(cnt||18);i++)P(g,r()*T|0,r()*T|0,r()<.3?2:1,1,sp[r()*sp.length|0]);ex&&ex(g,r,v)});
  const tuft=(g,r,dk,lt,n)=>{for(let i=0;i<n;i++){const x=1+r()*12|0,y=2+r()*11|0;P(g,x,y,1,2,dk);P(g,x+2,y,1,2,dk);P(g,x+1,y+1,1,2,dk);P(g,x+1,y,1,1,lt)}};
  const flow=(g,r,c)=>{for(let i=0;i<4;i++)P(g,r()*13|0,r()*14|0,r()<.5?2:1,1,c[r()*c.length|0])};
  // animated liquid: 4 frames with drifting highlights
  const liq=(base,dk,hl,seed)=>[0,1,2,3].map(f=>{const c=mk(T,T),g=c.getContext('2d'),r=srand(seed);P(g,0,0,T,T,base);
    for(let i=0;i<14;i++)P(g,r()*T|0,r()*T|0,2,1,dk);for(let i=0;i<3;i++){const y=(i*5+3)%T,x=(i*7+f*2)%T;P(g,x,y,3,1,hl);P(g,(x+8)%T,(y+2)%T,2,1,hl)}return c});
  const field=(fn)=>{const m=new Map();return(tx,ty)=>{const k=tx*100003+ty;let v=m.get(k);if(v===undefined){v=fn(tx,ty);if(m.size>40000)m.clear();m.set(k,v)}return v}};
  const D=(w,h,fn,ol)=>{const c=mk(w,h),g=c.getContext('2d');fn(g,(x,y,ww,hh,col)=>P(g,x,y,ww,hh,col));return ol===0?c:addOutline(c,ol||'#141018')};
  const shd=(g,cx,cy,rx,ry)=>{g.fillStyle='rgba(10,20,20,.35)';for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx)+y*y/(ry*ry)<=1)g.fillRect(cx+x,cy+y,1,1)};
  const tri=(p,cx,top,h,w0,w1,col)=>{for(let y=0;y<h;y++){const w=Math.round(w0+(w1-w0)*y/h);p(cx-(w>>1),top+y,w,1,col)}};
  const Tl=TILES,Dc=DECOR;
  // generic decor pieces
  const palm=(fr)=>D(26,30,(g,p)=>{shd(g,13,27,8,2);for(let y=10;y<28;y++){const x=13+Math.round(Math.sin(y*0.18)*2);p(x-1,y,3,1,y%3?'#9a6a3a':'#6e4422')}
    for(let i=0;i<6;i++){const a=i/6*TAU+0.3;for(let k=2;k<11;k++){const x=13+Math.round(Math.cos(a)*k),y=9+Math.round(Math.sin(a)*k*0.6+k*k*0.04);p(x,y,2,2,k>7?fr[0]:fr[1])}}pball(g,13,9,3,['#3a7a2a',fr[1],fr[2]])},'#14200c');
  const tree=(c,trunk)=>D(22,26,(g,p)=>{shd(g,11,23,8,2);p(10,14,3,10,trunk||'#6e4422');pball(g,11,10,9,c);},'#10180c');
  const pine=(c,snow)=>D(18,28,(g,p)=>{shd(g,9,25,7,2);p(8,21,3,5,'#5a3a22');for(let t=0;t<3;t++)tri(p,9,2+t*6,9,1+t*2,13-t*0+t,c[t%c.length]);if(snow){p(8,2,3,2,'#ffffff');p(5,9,3,1,'#ffffff');p(11,14,3,1,'#ffffff');p(3,20,4,1,'#ffffff')}},'#0c1810');
  const rockD=(c,s)=>D(s+4,s,(g)=>{pball(g,(s+4)>>1,s>>1,(s>>1)-1,c,(s>>1)-2)});

  // ======= KAME HOUSE =======
  Tl.sea=liq('#2a8ad8','#2478c4','#9ad8ff',61);
  Tl.beach=nt(6,2100,['#f0d898','#ecd290','#f4dea2'],['#d8bc78','#fff0c0'],16,(g,r,v)=>{if(v===5)P(g,6,7,2,2,'#f0a0b0')});
  const isSea=field((tx,ty)=>!(tx*tx+ty*ty*1.6<=48||(tx*tx+ty*ty>200&&fbm(tx/6,ty/6,31)>0.72)));
  Dc.palm=palm(['#2e8a3a','#4ab04a','#7ad86a']);
  Dc.kamehouse=D(46,44,(g,p)=>{shd(g,23,40,20,4);p(6,20,34,18,'#f4a8b8');p(6,20,34,2,'#ffd0d8');p(6,36,34,2,'#c87888');
    for(const x of [10,30])p(x,25,6,6,'#7ac8f0'),p(x,25,6,1,'#ffffff');p(20,27,6,11,'#8a4a2a');p(21,28,4,1,'#b06a3a');
    tri(p,23,4,16,10,44,'#d83a3a');p(1,19,44,2,'#a02020');for(let x=6;x<40;x+=4)p(x,8+((x-6)>>3),1,10,'#b82a2a');
    p(15,9,16,6,'#fff0e0');const L=[[16,10],[17,10],[16,11],[16,12],[17,12],[16,13],[17,14],[19,10],[20,11],[19,12],[20,13],[21,10],[21,14],[23,10],[23,11],[23,12],[23,13],[25,10],[26,10],[25,12],[25,13],[26,12],[25,11],[26,14],[28,10],[29,10],[28,11],[28,12],[29,12],[28,13],[28,14],[29,14]];for(const [x,y] of L)p(x,y,1,1,'#d83a3a');
    p(39,6,3,8,'#c8c8c8');p(38,5,5,2,'#e8e8e8')},'#2a1018');
  WORLD.kame={special:isSea,
    tile(tx,ty,x,y,wf){if(isSea(tx,ty)){ctx.drawImage(Tl.sea[(wf+((tx+ty)&1))%4],x,y);ctx.fillStyle='#e8f8ff';
        if(!isSea(tx,ty-1))ctx.fillRect(x,y,T,2);if(!isSea(tx,ty+1))ctx.fillRect(x,y+T-2,T,2);if(!isSea(tx-1,ty))ctx.fillRect(x,y,2,T);if(!isSea(tx+1,ty))ctx.fillRect(x+T-2,y,2,T);return}
      ctx.drawImage(groundTile(Tl.beach,tx,ty),x,y)},
    decor(tx,ty,v){if(tx===0&&ty===-2)return Dc.kamehouse;if(Math.abs(tx)<3&&ty>-4&&ty<2)return null;if(v<0.05)return Dc.palm;if(v<0.07)return Dc.rubble;return null}};

  // ======= PLANETA DE KAIO + Camino de la Serpiente =======
  Tl.kgrass=nt(6,2300,['#7acc4a','#72c444','#82d452'],['#5aac36','#a0e870'],16,(g,r,v)=>{if(v<3)tuft(g,r,'#4a9a2e','#b0f080',2);if(v===4)P(g,7,7,2,2,'#ffe060')});
  Tl.kroad=nt(4,2350,['#d8b070','#d2aa68'],['#c09858','#e8c890'],12);
  Tl.ksky=nt(4,2400,['#e8c040','#e4bc3c','#ecc848'],['#f8e070','#d0a028'],20,(g,r)=>{for(let i=0;i<3;i++){const x=r()*12|0,y=r()*13|0;P(g,x,y,4,2,'#fff0a0');P(g,x+1,y-1,2,1,'#fff0a0')}});
  Tl.snake=nt(4,2450,['#c86a2a','#c0642a'],['#e08a40','#a04e1e'],10,(g)=>{for(let x=0;x<T;x+=4)P(g,x,7,2,2,'#7a3e18')});
  const onKaio=(tx,ty)=>tx*tx+ty*ty<=13*13;
  const onSnake=(tx,ty)=>tx<-10&&Math.abs(ty-Math.round(Math.sin(tx/5)*5))<=1;
  Dc.kaiohouse=D(40,40,(g,p)=>{shd(g,20,36,17,4);p(6,18,28,18,'#f4f0e0');p(6,34,28,2,'#c8c0a8');p(16,24,8,12,'#7a4a2a');p(9,22,5,5,'#5aa8e0');p(26,22,5,5,'#5aa8e0');
    pball(g,20,16,15,['#a82a1a','#d0402a','#e8603a','#ff8a5a'],9);p(28,2,4,9,'#f4f0e0');p(27,1,6,2,'#a82a1a');p(5,15,30,2,'#7a1a10')},'#2a1008');
  Dc.kaiocar=D(22,14,(g,p)=>{shd(g,11,12,10,2);p(2,5,18,6,'#e83a2a');p(5,2,10,4,'#9ad8f8');p(5,2,10,1,'#ffffff');p(2,5,18,1,'#ff7a6a');p(3,10,4,3,'#202020');p(15,10,4,3,'#202020')});
  Dc.ktree=tree(['#2a7a2a','#3a9a32','#56b840','#7ad458']);
  WORLD.kaio={special:(tx,ty)=>!onKaio(tx,ty)&&!onSnake(tx,ty),
    tile(tx,ty,x,y,wf){if(onKaio(tx,ty)){const d=Math.round(Math.sqrt(tx*tx+ty*ty));ctx.drawImage(groundTile(d===8?Tl.kroad:Tl.kgrass,tx,ty),x,y);
        if(!onKaio(tx,ty+1)){ctx.fillStyle='#4a8a2a';ctx.fillRect(x,y+T-4,T,4);ctx.fillStyle='#2a5a1a';ctx.fillRect(x,y+T-1,T,1)}return}
      if(onSnake(tx,ty)){ctx.drawImage(groundTile(Tl.snake,tx,ty),x,y);return}
      ctx.drawImage(groundTile(Tl.ksky,tx,ty),x,y);if(((tx*7+ty*3+wf)&15)===0){ctx.fillStyle='#fffbe0';ctx.fillRect(x+6,y+6,4,2)}},
    decor(tx,ty,v){if(tx===0&&ty===-3)return Dc.kaiohouse;if(tx===4&&ty===-1)return Dc.kaiocar;if(!onKaio(tx,ty)||tx*tx+ty*ty<16)return null;if(v<0.06)return Dc.ktree;return null}};

  // ======= TORNEO DEL PODER: plataforma circular flotando en el vacío del Mundo de la Nada =======
  Tl.tpfloor=mkS(6,2500,(g,r,v)=>{P(g,0,0,T,T,['#d4d2dc','#cecbd6','#dad8e2'][v%3]);P(g,0,T-1,T,1,'#a4a2b4');P(g,T-1,0,1,T,'#a4a2b4');P(g,0,0,T,1,'#eceaf2');P(g,0,0,1,T,'#e4e2ec');
    if(v===4){P(g,3,5,6,1,'#8a889c');P(g,8,6,1,4,'#8a889c');P(g,9,9,4,1,'#8a889c')}if(v===5){P(g,5,4,5,5,'#bab8c8');P(g,6,5,3,3,'#a8a6b8')}});
  Tl.tpband=mkS(2,2550,(g,r,v)=>{P(g,0,0,T,T,'#9a98ae');P(g,0,0,T,2,'#b8b6c8');P(g,0,T-2,T,2,'#7a788e');for(let x=v*4;x<T;x+=8)P(g,x,6,4,4,'#c8c6d8')});
  Tl.tpcore=mkS(2,2560,(g,r,v)=>{P(g,0,0,T,T,'#e8e6f0');P(g,0,T-1,T,1,'#c4c2d4');P(g,T-1,0,1,T,'#c4c2d4');if(v)P(g,7,7,2,2,'#f8d860')});
  Tl.void=[0,1,2,3].map(f=>{const c=mk(T,T),g=c.getContext('2d');P(g,0,0,T,T,'#120c2a');const r=srand(2600);for(let i=0;i<10;i++)P(g,r()*T|0,r()*T|0,2,1,r()<.5?'#1e1440':'#18103a');
    for(let i=0;i<3;i++){const x=r()*T|0,y=r()*T|0;P(g,x,y,1,1,((i+f)&3)===0?'#ffffff':'#8a7ad0')}return c});
  const tpR=(tx,ty)=>Math.sqrt(tx*tx+ty*ty);
  const tpHole=field((tx,ty)=>{const r=tpR(tx,ty);return r>7&&r<21&&fbm(tx/4,ty/4,121)>0.74});
  const onTP=(tx,ty)=>tpR(tx,ty)<=22&&!tpHole(tx,ty);
  const tpPil=new Set();for(let i=0;i<16;i++){const a=i/16*TAU;tpPil.add(Math.round(Math.cos(a)*20)+','+Math.round(Math.sin(a)*20))}
  Dc.pillar=D(16,34,(g,p)=>{shd(g,8,31,7,2);p(3,8,10,22,'#c8c6d8');p(3,8,3,22,'#ecebf4');p(10,8,3,22,'#94929e');for(let y=12;y<28;y+=5)p(3,y,10,1,'#a8a6b8');p(1,5,14,4,'#ecebf4');p(1,28,14,4,'#94929e');pball(g,8,3,3,['#c8a030','#f0c840','#fff0a0'])},'#100c24');
  Dc.tpcrater=D(30,18,(g)=>{for(let y=-8;y<=8;y++)for(let x=-14;x<=14;x++){const d=Math.sqrt(x*x/196+y*y/64);if(d>1)continue;g.fillStyle=d>0.75?(y<0?'#8a889c':'#f0eef6'):(y<0?'#9a98ac':'#b8b6c8');g.fillRect(15+x,9+y,1,1)}},0);
  Dc.zenobox=D(56,40,(g,p)=>{shd(g,28,37,22,3);p(6,14,44,20,'#e8e4f4');p(6,14,44,3,'#ffffff');p(6,31,44,3,'#a8a2c0');p(10,6,36,10,'#5a3aa8');p(10,6,36,2,'#8a6ad8');for(let x=12;x<46;x+=6)p(x,17,2,14,'#d0c8e8');
    pball(g,22,24,4,['#3a5ad8','#6a8af0','#b0c8ff']);pball(g,34,24,4,['#3a5ad8','#6a8af0','#b0c8ff']);p(26,0,4,7,'#f0c840')},'#0a0820');
  Dc.debris=D(20,14,(g,p)=>{pball(g,10,6,8,['#7a788e','#9a98ae','#c8c6d8'],4);p(4,9,12,4,'#5a5060')},'#0a0820');
  WORLD.poder={special:()=>false,
    tile(tx,ty,x,y,wf){if(onTP(tx,ty)){const r=tpR(tx,ty),rr=Math.round(r);ctx.drawImage(r<3.5?Tl.tpcore[(tx+ty)&1]:(rr===8||rr===15)?Tl.tpband[(tx+ty)&1]:groundTile(Tl.tpfloor,tx,ty),x,y);
        if(!onTP(tx,ty+1)){ctx.fillStyle='#6a6070';ctx.fillRect(x,y+T-6,T,6);ctx.fillStyle='#4a4050';ctx.fillRect(x+((tx*3)&7),y+T-4,6,1);ctx.fillStyle='#2a2030';ctx.fillRect(x,y+T-1,T,1)}return}
      ctx.drawImage(Tl.void[(wf+((tx*3+ty)&3))%4],x,y);const n=fbm(tx/12,ty/12,131);if(n>0.6){ctx.globalAlpha=(n-0.6)*1.6;ctx.fillStyle=n>0.7?'#6a3aa8':'#3a3a9a';ctx.fillRect(x,y,T,T);ctx.globalAlpha=1}},
    decor(tx,ty,v){if(tx===0&&ty===-30)return Dc.zenobox;if(!onTP(tx,ty))return tpR(tx,ty)>25&&v<0.006?Dc.debris:null;if(tpPil.has(tx+','+ty))return Dc.pillar;if(tpR(tx,ty)<5)return null;if(v<0.02)return Dc.tpcrater;return null}};

  // ======= PLANETA DE BILLS =======
  Tl.bgrass=nt(7,2700,['#5ab07a','#54a874','#62b882'],['#3a9060','#8ad8a0'],16,(g,r,v)=>{if(v<3)tuft(g,r,'#2e7a50','#9ae8b0',2);if(v===5)for(let i=0;i<3;i++)P(g,2+r()*11|0,2+r()*11|0,1,1,'#c87af0')});
  Tl.bwater=liq('#4a7ad8','#3e6ac4','#b0d0ff',71);
  const isBW=field((tx,ty)=>(tx*tx+ty*ty>64)&&fbm(tx/8,ty/8,41)>0.68);
  Dc.bpyramid=D(54,46,(g,p)=>{shd(g,27,42,25,4);tri(p,27,4,38,2,52,'#c8a060');for(let y=10;y<42;y+=6)p(27-((2+50*(y-4)/38)>>1),y,Math.round(2+50*(y-4)/38),1,'#8a6a38');
    tri(p,20,4,38,1,26,'#e0bc78');p(23,32,8,10,'#3a2a5a');p(24,33,6,1,'#7a5aa8');p(25,1,4,4,'#a060e0')},'#2a1a0a');
  Dc.bfloat=D(34,34,(g,p)=>{shd(g,17,32,11,2);tri(p,17,14,16,22,4,'#7a5a48');tri(p,15,14,12,12,2,'#9a7a62');pball(g,17,11,14,['#2e7a50','#4aa06a','#6ac088','#9ae8b0'],8)},'#141a10');
  Dc.btree=tree(['#5a2a8a','#7a3aaa','#a05ad0','#c890f0'],'#4a2a1a');
  WORLD.bills={special:isBW,
    tile(tx,ty,x,y,wf){if(isBW(tx,ty)){ctx.drawImage(Tl.bwater[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.bgrass,tx,ty),x,y);edges(tx,ty,x,y,isBW,'#a8d8c0','#6aa888')},
    decor(tx,ty,v){if(tx===0&&ty===-7)return Dc.bpyramid;if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.008)return Dc.bfloat;if(v<0.04)return Dc.btree;if(v<0.025)return Dc.rock;return null}};

  // ======= INFIERNO =======
  Tl.hell=nt(7,2800,['#c45a6a','#bc5464','#cc6272'],['#a8404e','#e07a88'],18,(g,r,v)=>{if(v===5){P(g,4,8,7,1,'#8a2a3a');P(g,10,9,1,3,'#8a2a3a')}});
  Tl.blood=liq('#a0142a','#8a0e22','#ff6a7a',81);
  const isBlood=field((tx,ty)=>(tx*tx+ty*ty>49)&&fbm(tx/9,ty/9,51)>0.67);
  Dc.needle=D(20,40,(g,p)=>{shd(g,10,37,8,2);for(let y=0;y<36;y++){const w=Math.max(1,Math.round(1+y*0.4));p(10-(w>>1),y+2,w,1,y<6?'#e0e0e8':'#8a8a98');p(10-(w>>1),y+2,1,1,'#c8c8d4')}},'#1a0a10');
  Dc.hbone=D(16,10,(g,p)=>{p(3,4,10,2,'#f0e8d8');p(1,2,3,3,'#f0e8d8');p(1,5,3,3,'#f0e8d8');p(12,2,3,3,'#f0e8d8');p(12,5,3,3,'#f0e8d8');p(3,6,10,1,'#c8bca8')},'#2a1010');
  Dc.htree=D(24,28,(g,p)=>{shd(g,12,25,9,2);p(11,10,3,16,'#4a2a2a');for(const [a,l] of [[-2.3,9],[-0.8,9],[-1.6,11],[-2.8,6],[-0.3,6]]){for(let k=0;k<l;k++)p(12+Math.round(Math.cos(a)*k),12+Math.round(Math.sin(a)*k),2,1,'#4a2a2a')}
    for(const [x,y] of [[3,5],[20,5],[12,1],[6,9],[18,9]])pball(g,x,y,2,['#5a1a6a','#8a3aa0','#c070e0'])},'#120810');
  WORLD.infierno={special:isBlood,
    tile(tx,ty,x,y,wf){if(isBlood(tx,ty)){ctx.drawImage(Tl.blood[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.hell,tx,ty),x,y);edges(tx,ty,x,y,isBlood,'#e88a98','#7a2030')},
    decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.014)return Dc.needle;if(v<0.03)return Dc.htree;if(v<0.04)return Dc.hbone;return null}};

  // ======= PLANETA YARDRAT (praderas turquesa, árboles azules de tronco naranja) =======
  Tl.yard=nt(7,2900,['#2ab4c4','#26acbc','#30bccc'],['#1a94a8','#7ae0e8'],18,(g,r,v)=>{if(v<4)tuft(g,r,'#14889c','#a0f0f4',2);if(v===5){P(g,6,6,2,1,'#d84a2a');P(g,7,7,1,1,'#f0e0d0')}});
  Tl.ylow=nt(5,2950,['#4cb848','#46b044','#52c04e'],['#3a9a3a','#8ae070'],14,(g,r,v)=>{for(let i=0;i<3;i++)P(g,r()*13|0,r()*14|0,2,1,'#a8f0a0')});
  const isYL=field((tx,ty)=>(tx*tx+ty*ty>36)&&fbm(tx/8,ty/8,61)<0.47);
  Dc.ybig=D(44,58,(g,p)=>{shd(g,22,55,12,3);for(let y=24;y<56;y++){p(20,y,5,1,'#d8602a');p(20,y,1,1,'#f08a4a');p(24,y,1,1,'#a03a1a')}p(17,53,11,3,'#d8602a');
    for(const [x,y] of [[15,24],[29,24],[22,26]])for(let k=0;k<6;k++)p(x+Math.round((22-x)*k/6),y-k,2,1,'#d8602a');
    const B=['#132a78','#1a3a9a','#2a5ac0','#3a7ad8','#6aa8f0'];for(const [x,y,r] of [[22,16,13],[11,18,8],[33,18,8],[16,8,8],[29,9,8],[22,22,8]])pball(g,x,y,r,B);
    const rr=srand(7);for(let i=0;i<14;i++)p(6+rr()*32|0,4+rr()*20|0,3,1,'#132a78')},'#0a1030');
  Dc.ypop=D(12,26,(g,p)=>{shd(g,6,24,4,1);p(5,9,2,15,'#c8582a');p(5,9,1,15,'#e88050');pball(g,6,6,5,['#1a3a9a','#2a5ac0','#4a8ae0','#8ac0f8'])},'#0a1030');
  Dc.ymush=D(16,10,(g,p)=>{for(const [x,y,w] of [[1,4,5],[7,2,6],[10,6,4]]){p(x+1,y+2,w-2,3,'#f4e8d8');p(x,y,w,2,'#d8402a');p(x+1,y,1,1,'#ff9a7a')}},'#2a0a08');
  Dc.ycliff=D(30,24,(g,p)=>{shd(g,15,21,13,2);tri(p,15,2,20,18,28,'#8a5a32');for(let y=4;y<22;y+=3)p(4+((y*5)%7),y,18,1,'#5a3618');pball(g,15,4,10,['#14889c','#2ab4c4','#7ae0e8'],3)},'#1a0a04');
  Dc.ypod=D(32,30,(g,p)=>{shd(g,16,27,12,2);for(const [x1,x2] of [[9,4],[13,11],[19,21],[23,28]])for(let y=16;y<28;y++)p(Math.round(x1+(x2-x1)*(y-16)/12),y,1,1,'#b8bcc4');
    pball(g,16,13,11,['#8a8e98','#b8bcc4','#e0e4ea','#ffffff'],9);for(const [x,y] of [[3,8],[29,8],[16,1]])p(x,y,2,3,'#d8dce4');
    pball(g,12,14,3,['#101018','#202030','#5a5a70']);p(11,13,1,1,'#ffffff');pball(g,19,16,2,['#101018','#202030']);p(18,8,6,1,'#9a9ea8');p(18,11,7,1,'#9a9ea8')},'#1a1c24');
  WORLD.yardrat={special:isYL,
    tile(tx,ty,x,y){if(isYL(tx,ty)){ctx.drawImage(groundTile(Tl.ylow,tx,ty),x,y);
        if(!isYL(tx,ty-1)){ctx.fillStyle='#8a5a32';ctx.fillRect(x,y,T,6);ctx.fillStyle='#5a3618';ctx.fillRect(x+((tx*5)&7),y+2,7,1);ctx.fillRect(x,y+4,T,1);ctx.fillStyle='#b07a4a';ctx.fillRect(x,y,T,1)}return}
      ctx.drawImage(groundTile(Tl.yard,tx,ty),x,y);edges(tx,ty,x,y,isYL,'#7ae0e8','#14889c')},
    decor(tx,ty,v){if(tx===3&&ty===1)return Dc.ypod;if(Math.abs(tx)<4&&Math.abs(ty)<4)return null;if(v<0.018)return Dc.ybig;if(v<0.05)return Dc.ypop;if(v<0.07)return Dc.ymush;if(v<0.077)return Dc.ycliff;return null}};

  // ======= MUNDO KAIOSHIN =======
  Tl.ksgrass=nt(7,3000,['#6ac85a','#62c054','#72d062'],['#4aa840','#9ae880'],16,(g,r,v)=>{if(v<3)tuft(g,r,'#3a9032','#b8f8a0',3);if(v===6)for(let i=0;i<3;i++){const x=2+r()*11|0,y=2+r()*11|0;P(g,x,y,1,1,'#ffffff');P(g,x+1,y,1,1,'#ffe060')}});
  Tl.kspond=liq('#3aa8d8','#3296c4','#c0f0ff',101);
  const isKP=field((tx,ty)=>(tx*tx+ty*ty>64)&&fbm(tx/8,ty/8,71)>0.69);
  Dc.zsword=D(18,30,(g,p)=>{pball(g,9,23,8,['#6a6e60','#8a8e7e','#a8ac9a','#c8ccb8'],5);p(8,3,3,18,'#d8e0e8');p(8,3,1,18,'#ffffff');p(5,15,9,2,'#c8a030');p(8,17,3,3,'#a02a2a');p(9,1,1,2,'#d8e0e8')},'#141814');
  Dc.kstemple=D(36,38,(g,p)=>{shd(g,18,34,15,3);p(7,18,22,16,'#f0e8d0');p(7,32,22,2,'#c8bc98');p(15,23,6,11,'#5a3a2a');tri(p,18,2,16,2,32,'#e86a2a');p(2,17,32,2,'#a84a1a');p(17,0,2,3,'#ffe060')},'#2a1a0a');
  Dc.kstree=tree(['#2a8a3a','#3aaa4a','#5ac860','#8ae880']);
  WORLD.kaioshin={special:isKP,
    tile(tx,ty,x,y,wf){if(isKP(tx,ty)){ctx.drawImage(Tl.kspond[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.ksgrass,tx,ty),x,y);edges(tx,ty,x,y,isKP,'#c8e8a0','#88b870')},
    decor(tx,ty,v){if(tx===0&&ty===-6)return Dc.kstemple;if(tx===6&&ty===2)return Dc.zsword;if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.05)return Dc.kstree;if(v<0.03)return Dc.rock;return null}};

  // ======= BASE RED RIBBON =======
  Tl.metal=mkS(6,3100,(g,r,v)=>{P(g,0,0,T,T,['#7a808a','#747a84','#80868f'][v%3]);P(g,0,0,T,1,'#9aa0aa');P(g,0,T-1,T,1,'#50565e');P(g,T-1,0,1,T,'#5a6068');P(g,0,0,1,T,'#8a9098');
    for(const [x,y] of [[2,2],[13,2],[2,13],[13,13]])P(g,x,y,1,1,'#3a4048');if(v===4)P(g,4,6,8,4,'#6a7078');if(v===5){P(g,5,5,3,1,'#5a3a2a');P(g,9,10,2,1,'#5a3a2a')}});
  Tl.hazard=mkS(2,3150,(g,r,v)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)P(g,x,y,1,1,(((x+y+v*4)>>2)&1)?'#e8c020':'#222228')});
  const isHaz=(tx,ty)=>{const m=((tx%20)+20)%20,n=((ty%18)+18)%18;return m===0||n===0};
  Dc.crate=D(16,16,(g,p)=>{p(1,2,14,13,'#a87a3a');p(1,2,14,1,'#d0a060');p(1,14,14,1,'#6a4a20');p(1,2,1,13,'#c89858');p(3,4,10,9,'#946a30');p(3,4,10,1,'#7a5422');p(7,4,2,9,'#c89858')},'#1a1008');
  Dc.barrel=D(12,16,(g,p)=>{p(1,2,10,13,'#c82a2a');p(1,2,3,13,'#e85a4a');p(8,2,3,13,'#902020');p(0,5,12,1,'#6a6e78');p(0,11,12,1,'#6a6e78');p(2,1,8,2,'#e86a5a')},'#1a0808');
  Dc.rrlogo=D(30,30,(g,p)=>{for(let y=-13;y<=13;y++)for(let x=-13;x<=13;x++){const d=x*x+y*y;if(d<=169)g.fillStyle=d>140?'#202024':'#f4f0e8',g.fillRect(15+x,15+y,1,1)}
    p(8,9,14,4,'#d82020');p(8,9,14,1,'#ff5a4a');p(13,13,4,9,'#d82020');p(9,13,4,7,'#b01818');p(17,13,4,7,'#b01818')},0);
  Dc.rrtower=D(30,52,(g,p)=>{shd(g,15,48,13,3);p(7,12,16,36,'#c8ccd4');p(7,12,4,36,'#e8ecf2');p(19,12,4,36,'#8a9098');for(let y=16;y<46;y+=7)p(9,y,12,3,'#3a4a6a');p(5,44,20,4,'#7a808a');
    p(4,6,22,7,'#d82020');p(4,6,22,1,'#ff5a4a');p(9,8,12,3,'#f4f0e8');p(14,0,2,7,'#5a6068');p(13,0,4,1,'#ff4040')},'#14161c');
  WORLD.redribbon={special:isHaz,
    tile(tx,ty,x,y){if(isHaz(tx,ty)){ctx.drawImage(Tl.hazard[(tx+ty)&1],x,y);return}ctx.drawImage(groundTile(Tl.metal,tx,ty),x,y)},
    decor(tx,ty,v){if(tx===0&&ty===0)return Dc.rrlogo;if(tx===3&&ty===-8)return Dc.rrtower;if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.012)return Dc.crate;if(v<0.02)return Dc.barrel;if(v<0.022)return Dc.car;return null}};

  // ======= TORRE MÚSCULO (nieve) =======
  Tl.snow=nt(7,3200,['#eef4fa','#e8eef6','#f4f8fc'],['#d0dcea','#ffffff'],14,(g,r,v)=>{if(v===5){P(g,4,9,6,1,'#c8d4e4');P(g,5,10,4,1,'#dce6f0')}if(v===6)P(g,8,4,3,2,'#b8c8da')});
  Tl.ice=mkS(4,3250,(g,r,v)=>{P(g,0,0,T,T,['#a8dcf0','#a0d6ec'][v&1]);for(let i=0;i<5;i++)P(g,r()*13|0,r()*14|0,3,1,'#d8f4ff');P(g,(v*5)%12,(v*7)%12,1,3,'#ffffff')});
  const isIce=field((tx,ty)=>(tx*tx+ty*ty>49)&&fbm(tx/9,ty/9,81)>0.67);
  Dc.spine=pine(['#1e5a3a','#2a7048','#3a8a58'],1);
  Dc.snowrock=D(18,14,(g,p)=>{pball(g,9,8,8,['#6a7480','#8a94a0','#a8b2be','#c8d0da'],5);p(4,2,10,3,'#ffffff');p(3,4,3,1,'#ffffff')},'#1a1e24');
  Dc.muscle=D(34,64,(g,p)=>{shd(g,17,60,15,3);for(let s=0;s<5;s++){const y=48-s*11,w=26-s*3,x=17-(w>>1);p(x,y,w,11,s%2?'#8a8e96':'#a8acb4');p(x,y,w,2,'#c8ccd4');p(x,y+9,w,2,'#6a6e76');p(x+2,y+4,3,3,'#3a4a6a');p(x+w-5,y+4,3,3,'#3a4a6a')}
    p(10,2,14,4,'#d82020');p(15,0,4,3,'#8a8e96');p(12,58,10,2,'#ffffff');p(6,14,4,1,'#ffffff');p(24,26,4,1,'#ffffff')},'#141820');
  Dc.jhouse=D(26,24,(g,p)=>{shd(g,13,21,11,2);p(4,11,18,10,'#a87a4a');p(4,11,18,1,'#c89a6a');p(11,14,4,7,'#5a3a1a');p(6,13,3,3,'#ffe080');p(17,13,3,3,'#ffe080');tri(p,13,2,9,4,24,'#6a3a2a');p(3,2,20,3,'#ffffff');p(1,10,24,1,'#ffffff')},'#1a1008');
  WORLD.musculo={special:isIce,
    tile(tx,ty,x,y){if(isIce(tx,ty)){ctx.drawImage(groundTile(Tl.ice,tx,ty),x,y);return}ctx.drawImage(groundTile(Tl.snow,tx,ty),x,y);edges(tx,ty,x,y,isIce,'#ffffff','#c0d0e0')},
    decor(tx,ty,v){if(tx===0&&ty===-8)return Dc.muscle;if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.03)return Dc.spine;if(v<0.036)return Dc.snowrock;if(v<0.039)return Dc.jhouse;return null}};

  // ======= TORNEO DE ARTES MARCIALES (Tenkaichi Budokai): tatami de piedra, plaza, gradas con público y el templo =======
  Tl.lawn=nt(7,3300,['#6ab84a','#62b044','#72c052'],['#4a9a36','#9ad870'],16,(g,r,v)=>{if(v<3)tuft(g,r,'#3a8a2a','#a8e880',2)});
  Tl.pave=mkS(4,3350,(g,r,v)=>{P(g,0,0,T,T,['#e0d4b8','#dccfb2'][v&1]);P(g,0,7,T,1,'#bcae90');P(g,0,15,T,1,'#bcae90');P(g,7,0,1,7,'#bcae90');P(g,(v&1)?3:12,8,1,7,'#bcae90')});
  Tl.ringst=mkS(4,3370,(g,r,v)=>{P(g,0,0,T,T,['#e4e0d4','#dedad0'][v&1]);P(g,0,T-1,T,1,'#aaa696');P(g,T-1,0,1,T,'#aaa696');P(g,0,0,T,1,'#f4f2ea');if(v===3){P(g,4,6,5,1,'#b4b0a2');P(g,8,7,1,3,'#b4b0a2')}});
  const PPL=['#2a2a2a','#5a3a1a','#e8c040','#c83a2a','#3a5ac8','#f0f0f0','#8a5ac8','#3a9a4a'];
  Tl.stand=mkS(6,3380,(g,r,v)=>{P(g,0,0,T,T,'#8a6a4a');P(g,0,0,T,2,'#a8886a');P(g,0,8,T,2,'#a8886a');for(let row=0;row<2;row++)for(let x=1;x<T;x+=3){if(r()<.85){P(g,x,row*8+3,2,2,'#f0c8a0');P(g,x,row*8+2,2,1,PPL[r()*PPL.length|0]);P(g,x,row*8+5,2,2,PPL[r()*PPL.length|0])}}});
  const onBR=(tx,ty)=>Math.abs(tx)<=6&&Math.abs(ty)<=6;
  const onPlaza=(tx,ty)=>!onBR(tx,ty)&&Math.abs(tx)<=10&&Math.abs(ty)<=10;
  const onStand=(tx,ty)=>{const ax=Math.abs(tx),ay=Math.abs(ty);return Math.max(ax,ay)>=13&&Math.max(ax,ay)<=15&&!(ax<=2&&ty<0)};
  const onPath=(tx,ty)=>Math.abs(tx)<=2&&ty<-10&&ty>-22;
  Dc.budokai=D(72,52,(g,p)=>{shd(g,36,48,34,4);p(6,26,60,22,'#f4ead0');p(6,46,60,2,'#c8b890');for(let x=10;x<64;x+=8)p(x,28,3,18,'#d0402a');p(30,32,12,16,'#4a2a1a');
    tri(p,36,6,18,12,72,'#e88a2a');p(0,23,72,3,'#a8501a');tri(p,36,0,8,4,20,'#e88a2a');p(34,0,4,2,'#ffe060');p(24,12,24,8,'#2a2a3a');for(let x=26;x<46;x+=3)p(x,14,2,4,'#ffe060')},'#1a1008');
  Dc.lantern=D(10,20,(g,p)=>{p(4,8,2,11,'#5a3a2a');p(1,2,8,7,'#e83a2a');p(1,2,8,1,'#ff8a6a');p(3,4,4,3,'#ffe080');p(2,1,6,1,'#2a1a10');p(2,9,6,1,'#2a1a10')},'#1a0808');
  Dc.flag=D(12,30,(g,p)=>{p(2,2,1,27,'#8a8a8a');p(3,3,8,6,'#e83a2a');p(3,9,8,1,'#a02020');p(5,5,4,2,'#ffffff')},'#1a1010');
  WORLD.budokai={special:(tx,ty)=>onBR(tx,ty)||onPlaza(tx,ty)||onStand(tx,ty)||onPath(tx,ty),
    tile(tx,ty,x,y){if(onBR(tx,ty)){ctx.drawImage(groundTile(Tl.ringst,tx,ty),x,y);if(!onBR(tx,ty+1)){ctx.fillStyle='#8e8a7e';ctx.fillRect(x,y+T-5,T,5);ctx.fillStyle='#5d5a50';ctx.fillRect(x,y+T-1,T,1)}
        if(!onBR(tx-1,ty)){ctx.fillStyle='#a8a496';ctx.fillRect(x,y,2,T)}if(!onBR(tx+1,ty)){ctx.fillStyle='#a8a496';ctx.fillRect(x+T-2,y,2,T)}return}
      if(onStand(tx,ty)){ctx.drawImage(groundTile(Tl.stand,tx,ty),x,y);return}
      if(onPlaza(tx,ty)||onPath(tx,ty)){ctx.drawImage(groundTile(Tl.pave,tx,ty),x,y);return}ctx.drawImage(groundTile(Tl.lawn,tx,ty),x,y)},
    decor(tx,ty,v){if(tx===0&&ty===-24)return Dc.budokai;if((tx===-3||tx===3)&&ty<-10&&ty>-20&&ty%3===0)return Dc.lantern;if((Math.abs(tx)===16||Math.abs(ty)===16)&&(tx+ty)%4===0&&Math.max(Math.abs(tx),Math.abs(ty))===16)return Dc.flag;
      if(Math.max(Math.abs(tx),Math.abs(ty))<17)return null;if(v<0.035)return Dc.palm;if(v<0.06)return Dc.ktree;return null}};

  // ======= TEMPLO SAGRADO DE KAMI: plataforma blanca sobre las nubes, jardines con palmeras y el palacio de cúpulas =======
  Tl.lookfl=mkS(4,3400,(g,r,v)=>{P(g,0,0,T,T,['#f4f0e2','#efeadc'][v&1]);P(g,0,T-1,T,1,'#d2ccb8');P(g,T-1,0,1,T,'#d2ccb8');P(g,0,0,T,1,'#fffcf0');if(v===3)P(g,3,9,5,1,'#dcd6c2')});
  Tl.lookpath=mkS(2,3420,(g,r,v)=>{P(g,0,0,T,T,'#d8ccae');P(g,0,7,T,1,'#b8ac8e');P(g,v?4:11,0,1,7,'#b8ac8e');P(g,v?11:4,8,1,8,'#b8ac8e')});
  Tl.lookgrass=nt(4,3430,['#5ab84a','#54b044'],['#3a9a36','#8ae070'],14,(g,r,v)=>{if(v<2)tuft(g,r,'#2a8a2a','#a8f080',2);if(v===3)P(g,7,7,2,2,'#ffe060')});
  Tl.cloudsky=[0,1,2,3].map(f=>{const c=mk(T,T),g=c.getContext('2d');P(g,0,0,T,T,'#7ac0f4');const r=srand(3450);for(let i=0;i<6;i++)P(g,r()*T|0,r()*T|0,3,1,'#8acaf6');
    for(let i=0;i<2;i++){const x=((r()*T|0)+f*2)%T,y=r()*12|0;P(g,x,y,5,2,'#ffffff');P(g,(x+1)%T,y-1,3,1,'#ffffff')}return c});
  const onLook=(tx,ty)=>tx*tx+ty*ty<=18*18;
  const lkGarden=(tx,ty)=>{const ax=Math.abs(tx);return ax>=5&&ax<=12&&((ty>=-12&&ty<=-6)||(ty>=4&&ty<=10))};
  const lkPath=(tx,ty)=>!lkGarden(tx,ty)&&(Math.abs(tx)<=1||Math.abs(ty+1)<=1);
  Dc.kamipalace=D(64,54,(g,p)=>{shd(g,32,50,30,4);p(6,30,52,20,'#f4f0e4');p(6,48,52,2,'#c8c0a8');for(let x=10;x<56;x+=6)p(x,32,3,16,'#e0d8c4');p(27,36,10,14,'#7a4a2a');p(28,37,8,1,'#a06a3a');
    pball(g,32,24,18,['#c8c0a8','#e4ddc8','#f8f4e8','#ffffff'],14);for(const x of [8,56]){p(x-5,22,10,26,'#f4f0e4');pball(g,x,20,6,['#c8c0a8','#e4ddc8','#ffffff'],7);p(x-1,9,2,6,'#e8b830')}
    p(31,3,2,8,'#e8b830');p(30,2,4,2,'#f8d860');for(const x of [20,44])p(x,26,4,6,'#5ab8e8')},'#2a2418');
  Dc.lpalm=palm(['#2e8a3a','#4ab04a','#7ad86a']);
  Dc.lpot=D(12,14,(g,p)=>{p(2,7,8,6,'#c8783a');p(2,7,8,1,'#e89a5a');pball(g,6,5,4,['#2a8a2a','#4ab04a','#8ae070']);p(4,3,1,1,'#ff6a8a');p(8,5,1,1,'#ffe060')},'#1a1008');
  WORLD.lookout={special:()=>false,
    tile(tx,ty,x,y,wf){if(onLook(tx,ty)){ctx.drawImage(lkGarden(tx,ty)?groundTile(Tl.lookgrass,tx,ty):lkPath(tx,ty)?Tl.lookpath[(tx+ty)&1]:groundTile(Tl.lookfl,tx,ty),x,y);
        if(!onLook(tx,ty+1)){ctx.fillStyle='#d8d0b8';ctx.fillRect(x,y+T-7,T,3);ctx.fillStyle='#a89e84';ctx.fillRect(x,y+T-4,T,4);ctx.fillStyle='#6a6250';ctx.fillRect(x,y+T-1,T,1)}return}
      ctx.drawImage(Tl.cloudsky[(wf+((tx+ty*2)&3))%4],x,y)},
    decor(tx,ty,v){if(tx===0&&ty===-15)return Dc.kamipalace;if(!onLook(tx,ty))return null;
      if(lkGarden(tx,ty)){const ax=Math.abs(tx);return (ax===6||ax===11)&&(ty%3===0)?Dc.lpalm:(ax===8||ax===9)&&ty%2===0&&v<0.4?Dc.lpot:null}
      if(Math.abs(tx)===3&&ty%4===0&&ty>-12&&ty<14)return Dc.lpot;return null}};

  // ======= CIUDAD DEL OESTE (Corporación Cápsula) =======
  Tl.cgrass=nt(6,3500,['#6ac05a','#62b854','#72c862'],['#4aa040','#9ae080'],14,(g,r,v)=>{if(v<2)tuft(g,r,'#3a9032','#b8f0a0',2)});
  Tl.croad=mkS(4,3550,(g,r,v)=>{P(g,0,0,T,T,['#5a5a62','#56565e'][v&1]);for(let i=0;i<10;i++)P(g,r()*T|0,r()*T|0,1,1,r()<.5?'#4a4a52':'#6a6a72')});
  const isCR=(tx,ty)=>{const m=((tx%18)+18)%18,n=((ty%16)+16)%16;return m<2||n<2};
  Dc.cdome=D(36,34,(g,p)=>{shd(g,18,30,16,3);pball(g,18,18,15,['#b8c0c8','#d8dee4','#f0f4f8','#ffffff'],12);p(4,26,28,4,'#c8ced6');p(14,22,8,8,'#3a5a8a');p(8,14,4,3,'#7ac8f0');p(24,14,4,3,'#7ac8f0')},'#1a2028');
  Dc.ccorp=D(62,50,(g,p)=>{shd(g,31,46,29,4);pball(g,31,26,26,['#c8ced6','#e0e6ec','#f4f8fc','#ffffff'],20);p(5,38,52,8,'#d8dee4');p(26,34,10,12,'#3a5a8a');
    p(18,10,26,10,'#ffffff');p(19,11,24,8,'#2a5ab0');p(21,13,20,4,'#ffe060');p(8,24,5,4,'#7ac8f0');p(49,24,5,4,'#7ac8f0')},'#1a2028');
  WORLD.capsule={special:isCR,
    tile(tx,ty,x,y){if(isCR(tx,ty)){ctx.drawImage(groundTile(Tl.croad,tx,ty),x,y);const m=((tx%18)+18)%18,n=((ty%16)+16)%16;ctx.fillStyle='#f0f0f0';
        if(m===1&&n>=2&&ty%2===0)ctx.fillRect(x+T-1,y+4,2,8);if(n===1&&m>=2&&tx%2===0)ctx.fillRect(x+4,y+T-1,8,2);return}
      ctx.drawImage(groundTile(Tl.cgrass,tx,ty),x,y);edges(tx,ty,x,y,isCR,'#c8c8c0','#a0a098')},
    decor(tx,ty,v){if(tx===8&&ty===-7)return Dc.ccorp;if(Math.abs(tx)<4&&Math.abs(ty)<4)return null;if(v<0.012)return Dc.cdome;if(v<0.03)return Dc.ktree;if(v<0.034)return Dc.car;return null}};

  // ======= MONTE PAOZ (casa de Goku) =======
  Tl.fgrass=nt(7,3600,['#4a9a3e','#44923a','#52a246'],['#367a2c','#78c060'],18,(g,r,v)=>{if(v<4)tuft(g,r,'#2a6a22','#8ad070',3);if(v===6)P(g,5,9,2,2,'#f0f080')});
  Tl.river=liq('#3a9ad0','#3288bc','#c0ecff',111);
  const isRiver=field((tx,ty)=>{const c=Math.sin(tx/7)*5+Math.sin(tx/17)*4+10;return Math.abs(ty-c)<1.6||(tx*tx+ty*ty>100&&fbm(tx/8,ty/8,91)>0.74)});
  Dc.fpine=pine(['#1e5a2a','#2a7034','#3a8a42']);
  Dc.ftree=tree(['#2a6a22','#3a8a2e','#56a840','#7ac860']);
  Dc.gokuhouse=D(40,38,(g,p)=>{shd(g,20,34,17,3);pball(g,20,24,13,['#c8c0b0','#e4ddd0','#f8f4ec'],10);p(14,26,8,9,'#7a4a2a');p(26,22,5,4,'#7ac8f0');
    tri(p,20,4,12,6,36,'#c83a2a');p(2,15,36,2,'#8a2018');tri(p,20,1,4,2,8,'#c83a2a');p(19,0,2,2,'#ffe060')},'#1a1008');
  WORLD.paoz={special:isRiver,
    tile(tx,ty,x,y,wf){if(isRiver(tx,ty)){ctx.drawImage(Tl.river[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.fgrass,tx,ty),x,y);edges(tx,ty,x,y,isRiver,'#a8c870','#6a9a50')},
    decor(tx,ty,v){if(tx===2&&ty===-4)return Dc.gokuhouse;if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.05)return Dc.fpine;if(v<0.08)return Dc.ftree;if(v<0.056)return Dc.rock;return null}};

  // ======= DESIERTO (dunas, cactus, oasis) =======
  Tl.dune=mkS(6,3700,(g,r,v)=>{P(g,0,0,T,T,['#e8b868','#e2b062','#eec070'][v%3]);for(let i=0;i<3;i++){const y=(i*6+v*2)%T;for(let x=0;x<T;x++)P(g,x,(y+Math.round(Math.sin((x+v*3)*0.5)*1.5)+T)%T,1,1,'#c8964a')}for(let i=0;i<8;i++)P(g,r()*T|0,r()*T|0,1,1,'#f8d890')});
  Tl.dunecrest=mkS(3,3750,(g,r,v)=>{P(g,0,0,T,T,'#f4d088');for(let i=0;i<10;i++)P(g,r()*T|0,r()*T|0,2,1,'#fce4a8');P(g,0,(v*5)%T,T,1,'#d8a85a')});
  Tl.oasis=liq('#3aa0c8','#3290b8','#c0f0ff',121);
  const isOasis=field((tx,ty)=>(tx*tx+ty*ty>100)&&fbm(tx/6,ty/6,141)>0.76);
  Dc.dskull=D(14,10,(g,p)=>{pball(g,7,4,4,['#c8bca8','#e8e0d0','#fffaf0']);p(4,4,2,2,'#2a1a10');p(8,4,2,2,'#2a1a10');p(5,8,5,2,'#e8e0d0')},'#3a2a14');
  Dc.dcactus=D(16,24,(g,p)=>{shd(g,8,22,6,2);p(6,4,4,18,'#3a8a3a');p(6,4,1,18,'#6ac05a');p(1,9,3,7,'#3a8a3a');p(1,15,6,2,'#3a8a3a');p(12,7,3,7,'#3a8a3a');p(9,13,6,2,'#3a8a3a');p(7,3,2,1,'#ff6a8a')},'#123012');
  Dc.drock=D(26,18,(g)=>{pball(g,13,9,11,['#9a6a3a','#b8834a','#d4a060','#ecc080'],7)},'#3a200a');
  WORLD.desierto={special:isOasis,
    tile(tx,ty,x,y,wf){if(isOasis(tx,ty)){ctx.drawImage(Tl.oasis[(wf+((tx+ty)&1))%4],x,y);return}const n=fbm(tx/10,ty/5,151);ctx.drawImage(n>0.62?Tl.dunecrest[(tx+ty*3)%3<0?0:(tx+ty*3)%3]:groundTile(Tl.dune,tx,ty),x,y);
      if(n>0.62&&fbm(tx/10,(ty+1)/5,151)<=0.62){ctx.fillStyle='#b8823e';ctx.fillRect(x,y+T-3,T,3)}edges(tx,ty,x,y,isOasis,'#8ac860','#5a9a40')},
    decor(tx,ty,v){if(Math.abs(tx)<4&&Math.abs(ty)<4)return null;const nearO=isOasis(tx+1,ty)||isOasis(tx-1,ty)||isOasis(tx,ty+1)||isOasis(tx,ty-1);if(nearO&&v<0.35)return Dc.palm;
      if(v<0.012)return Dc.dcactus;if(v<0.018)return Dc.drock;if(v<0.023)return Dc.dskull;return null}};

  // ======= TIERRA VOLCÁNICA (basalto, ríos de lava, volcanes) =======
  Tl.basalt=nt(7,3800,['#3a2a2a','#362626','#3e2e2c'],['#2a1c1c','#5a4440'],20,(g,r,v)=>{if(v>=5){const y=3+r()*10|0;for(let x=2;x<14;x++)P(g,x,y+((x>>2)&1),1,1,v===5?'#ff7a1a':'#c83a0a')}});
  Tl.lava2=liq('#ff5a10','#d83a08','#ffd040',131);
  const isLv=field((tx,ty)=>{const c=Math.sin(tx/9)*6+Math.sin(tx/23+1)*8;return (tx*tx+ty*ty>36)&&(Math.abs(((ty-c)%34+34)%34-17)<1.4||fbm(tx/8,ty/8,161)>0.75)});
  Dc.volcano=D(64,52,(g,p)=>{shd(g,32,48,30,4);for(let y=0;y<44;y++){const w=Math.round(14+y*1.1);p(32-(w>>1),y+4,w,1,y%5?'#4a3430':'#5a4240');p(32-(w>>1),y+4,3,1,'#6a5048');p(32+(w>>1)-3,y+4,3,1,'#2a1a18')}
    p(24,4,16,4,'#ff8a1a');p(26,5,12,2,'#ffe060');for(const [x,l] of [[28,14],[35,20],[31,9]])for(let y=8;y<8+l;y++)p(x+((y>>2)&1),y,2,1,y<12?'#ffd040':'#ff5a10');
    for(const [x,y,r] of [[30,0,3],[36,-1,2]])pball(g,x,y+2,r,['#5a5050','#7a7070','#9a9090'])},'#120808');
  Dc.lrock=D(18,14,(g,p)=>{pball(g,9,7,8,['#1e1414','#3a2a28','#5a4440'],6);p(5,6,6,1,'#ff7a1a');p(10,7,1,3,'#ff7a1a')},'#080404');
  WORLD.volcan={special:isLv,
    tile(tx,ty,x,y,wf){if(isLv(tx,ty)){ctx.drawImage(Tl.lava2[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.basalt,tx,ty),x,y);edges(tx,ty,x,y,isLv,'#ffb03a','#7a2a0a')},
    decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.005)return Dc.volcano;if(v<0.02)return Dc.lrock;if(v<0.026)return Dc.needle;return null}};

  // ======= YERMO DE GIZARD (mesetas escalonadas, arena naranja) =======
  Tl.osand=nt(7,3900,['#e0a060','#d8985a','#e6a868'],['#c08048','#f0c088'],18,(g,r,v)=>{if(v===5){P(g,3,8,8,1,'#b07040');P(g,10,9,1,3,'#b07040')}});
  Tl.ocrack=nt(3,3950,['#9a5a2e'],['#7a4220','#b06a3a'],12);
  const isOC=field((tx,ty)=>{const n=fbm(tx/6,ty/10,171);return (tx*tx+ty*ty>49)&&n>0.47&&n<0.51});
  const mesa=(s,seed)=>D(s+8,s+14,(g,p)=>{const r=srand(seed),cx=(s+8)>>1,h=12;shd(g,cx,s+10,(s>>1)+3,3);
    for(let y=0;y<h;y++)p(4,s/2+y,s,1,y%3===0?'#a85a2a':y%3===1?'#c06a32':'#8a4a22');
    pball(g,cx,s/2,s>>1,['#c8783a','#e09050','#f0b070','#f8cc90'],(s>>2)+2);for(let i=0;i<5;i++)p(cx-(s>>2)+(r()*(s>>1)|0),(s>>2)+2+(r()*(s>>2)|0),4,1,'#c8783a');
    if(s>30)pball(g,cx+3,(s>>2)+2,4,['#2e7a2e','#4aa040','#7ac860'])},'#2a1206');
  Dc.mesaS=mesa(22,1);Dc.mesaL=mesa(40,2);
  WORLD.gizard={special:isOC,
    tile(tx,ty,x,y){if(isOC(tx,ty)){ctx.drawImage(groundTile(Tl.ocrack,tx,ty),x,y);if(!isOC(tx,ty-1)){ctx.fillStyle='#6a3416';ctx.fillRect(x,y,T,4)}return}ctx.drawImage(groundTile(Tl.osand,tx,ty),x,y);edges(tx,ty,x,y,isOC,'#f0c088','#b07040')},
    decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;if(v<0.015)return Dc.mesaL;if(v<0.04)return Dc.mesaS;if(v<0.048)return Dc.drock;if(v<0.052)return Dc.dskull;return null}};

  // ======= PRADERAS (lagos, pilares de roca, árboles azulados: el campo de batalla de la saga Saiyan) =======
  Tl.mgrass=nt(7,4000,['#6ac850','#62c04a','#72d058'],['#4aa83a','#a0e880'],16,(g,r,v)=>{if(v<4)tuft(g,r,'#3a9a2e','#b8f890',3);if(v===6)P(g,6,6,2,2,'#ffffff')});
  Tl.lake=liq('#3a98e8','#3288d8','#d0f0ff',141);
  const isLake=field((tx,ty)=>(tx*tx+ty*ty>64)&&fbm(tx/10,ty/10,181)>0.66);
  Dc.rpillar=D(34,56,(g,p)=>{shd(g,17,53,14,3);for(let y=12;y<52;y++){const w=Math.round(22-Math.sin(y*0.15)*3);p(17-(w>>1),y,w,1,y%6<3?'#d89a7a':'#c8886a');p(17-(w>>1),y,3,1,'#f0b898');p(17+(w>>1)-3,y,3,1,'#a86a50')}
    pball(g,17,12,13,['#c8886a','#e0a888','#f0c0a0'],7);pball(g,15,8,10,['#2e8a2e','#4ab040','#7ad460','#a8f080'],5);pball(g,24,10,4,['#2e8a2e','#4ab040','#7ad460'])},'#2a1410');
  Dc.reed=D(10,16,(g,p)=>{for(const x of [2,5,7]){p(x,4,1,12,'#3a8a2a');p(x,3,1,4,'#8a5a2a')}},'#0a200a');
  Dc.btree2=tree(['#1e5a7a','#2a7a9a','#3a9ab8','#6ac0d8'],'#5a3a22');
  WORLD.pradera={special:isLake,
    tile(tx,ty,x,y,wf){if(isLake(tx,ty)){ctx.drawImage(Tl.lake[(wf+((tx+ty)&1))%4],x,y);return}ctx.drawImage(groundTile(Tl.mgrass,tx,ty),x,y);edges(tx,ty,x,y,isLake,'#d8c890','#a89860')},
    decor(tx,ty,v){if(Math.abs(tx)<5&&Math.abs(ty)<5)return null;const nearL=isLake(tx+1,ty)||isLake(tx-1,ty)||isLake(tx,ty+1);if(nearL&&v<0.12)return Dc.reed;
      if(v<0.02)return Dc.rpillar;if(v<0.04)return Dc.btree2;if(v<0.05)return Dc.ktree;if(v<0.034)return Dc.rock;return null}};

  // ======= BOSQUE PROFUNDO (árboles enormes, senderos de tierra, troncos) =======
  Tl.forest=nt(7,4100,['#3a7a32','#36722e','#3e8236'],['#2a5a22','#5aa048'],20,(g,r,v)=>{if(v<5)tuft(g,r,'#1e4a1a','#7ac060',3);if(v===6)for(let i=0;i<4;i++)P(g,r()*14|0,r()*14|0,2,1,'#6a4a2a')});
  Tl.dirt=nt(4,4150,['#8a6a42','#84643e'],['#6a4a2a','#a8885a'],16);
  const isTrail=field((tx,ty)=>{return Math.abs(ty-Math.round(Math.sin(tx/6)*4))<=1||Math.abs(tx-Math.round(Math.sin(ty/6)*4))<=1});
  Dc.bigtree=D(52,56,(g,p)=>{shd(g,26,52,20,4);p(22,34,8,20,'#5a3a22');p(22,34,2,20,'#7a5232');p(16,50,20,4,'#5a3a22');
    const C=['#1a4a1a','#256a22','#348a2e','#4aa83e','#78c860'];for(const [x,y,r] of [[26,20,18],[12,24,10],[40,24,10],[18,10,10],[34,10,10],[26,30,10]])pball(g,x,y,r,C);
    const rr=srand(3);for(let i=0;i<16;i++)p(8+rr()*36|0,4+rr()*28|0,3,1,'#1a4a1a')},'#0a1a08');
  Dc.log=D(30,12,(g,p)=>{p(2,3,24,7,'#7a5232');p(2,3,24,2,'#9a6a42');p(2,8,24,2,'#5a3a22');pball(g,26,6,4,['#8a6a42','#c8a070','#e8c890'],4);p(25,5,2,2,'#7a5232');p(8,2,3,2,'#4aa83e')},'#1a0e06');
  Dc.fern=D(16,12,(g,p)=>{for(let i=0;i<5;i++){const a=-Math.PI+i/4*Math.PI;for(let k=1;k<7;k++)p(8+Math.round(Math.cos(a)*k),10+Math.round(Math.sin(a)*k*0.7),1,1,k>4?'#7ac860':'#3a8a2e')}},0);
  WORLD.bosque={special:isTrail,
    tile(tx,ty,x,y){if(isTrail(tx,ty)){ctx.drawImage(groundTile(Tl.dirt,tx,ty),x,y);return}ctx.drawImage(groundTile(Tl.forest,tx,ty),x,y);edges(tx,ty,x,y,isTrail,'#5a8a3a','#6a5030')},
    decor(tx,ty,v){if(Math.abs(tx)<4&&Math.abs(ty)<4)return null;if(v<0.03)return Dc.bigtree;if(v<0.06)return Dc.fpine;if(v<0.075)return Dc.fern;if(v<0.08)return Dc.log;return null}};

  // casa de Goku: cúpula blanca con anexo, puerta roja y ventana azul
  Dc.gokuhouse=D(48,38,(g,p)=>{shd(g,24,34,21,3);p(4,18,18,16,'#e8b878');p(4,18,18,2,'#f8d8a0');p(4,32,18,2,'#b8884a');p(8,22,8,6,'#5ab8e8');p(8,22,8,1,'#ffffff');
    pball(g,30,22,14,['#c8c0b0','#e4ddd0','#f8f4ec','#ffffff'],12);p(30,22,8,12,'#d83a2a');p(31,23,6,1,'#ff7a6a');p(36,28,1,2,'#ffe060');pball(g,30,6,3,['#c8a040','#f0c850','#fff0a0']);p(26,14,4,3,'#5ab8e8')},'#1a1008');

  // water you wade through: slows the player on every map that has it
  WORLD.namek.wet=isWater;WORLD.kame.wet=isSea;WORLD.bills.wet=isBW;WORLD.kaioshin.wet=isKP;WORLD.paoz.wet=isRiver;WORLD.pradera.wet=isLake;WORLD.desierto.wet=isOasis;WORLD.infierno.wet=isBlood;WORLD.yardrat.wet=null;
  // music progressions for the new stages
  Object.assign(PROG,{kame:PROG.namek,kaio:PROG.time,poder:[[50,53,57],[52,55,59],[48,52,55],[53,57,60]],bills:[[51,55,58],[53,56,60],[50,53,57],[48,51,55]],infierno:PROG.arena,yardrat:[[57,61,64],[54,57,61],[52,56,59],[55,59,62]],
    kaioshin:PROG.namek,redribbon:PROG.tierra,musculo:[[55,59,62],[52,55,59],[50,54,57],[53,57,60]],budokai:PROG.time,lookout:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],capsule:PROG.futuro,paoz:PROG.tierra,desierto:PROG.tierra,volcan:PROG.vegetasei,gizard:PROG.tierra,pradera:PROG.namek,bosque:PROG.namek});
})();
function onWaterAt(x,y){const W=WORLD[MAPK];if(S&&S.isl)return false;return !!(W&&W.wet&&W.wet(Math.floor(x/T),Math.floor(y/T)))}
// ---------- boss island: each boss fight teleports you to a floating arena themed after the stage ----------
const ISLR=11;
function isTheme(){return ['volcan','vegetasei','infierno'].includes(MAPK)?'lava':['poder','kaio','time'].includes(MAPK)?'void':MAPK==='lookout'?'sky':'sea'}
function islandStart(){if(S.isl)return;const ax=Math.round((P.x+48000)/T)*T,ay=Math.round(P.y/T)*T;
  S.isl={x:ax,y:ay,bx:P.x,by:P.y,end:0};for(let i=0;i<14;i++)burst(P.x,P.y-8,1,['#ffffff','#bfe6ff','#ffd23f']);
  P.x=ax;P.y=ay+40;cam.x=P.x-VW/2;cam.y=P.y-VH/2;S.flash=0.6;enemies=enemies.filter(e=>e.boss);eshots.length=0;ebeams.length=0;sfx('boom')}
function islandTick(){const I=S.isl;if(!I)return;
  const d=Math.hypot(P.x-I.x,P.y-I.y),R=ISLR*T-10;if(d>R){P.x=I.x+(P.x-I.x)/d*R;P.y=I.y+(P.y-I.y)/d*R}
  if(!S.boss&&!I.end)I.end=S.t+2.5;
  if(I.end&&S.t>=I.end){const dx=I.bx-I.x,dy=I.by-I.y,near=o=>Math.hypot(o.x-I.x,o.y-I.y)<ISLR*T*3;
    S.isl=null;
    for(const g of gems)if(near(g)){g.x+=dx;g.y+=dy;solidPlace(g,3)}for(const p of pickups)if(near(p)){p.x+=dx;p.y+=dy;solidPlace(p,4)}
    enemies=enemies.filter(e=>!near(e));P.x=I.bx;P.y=I.by;solidResolve(P,5);cam.x=P.x-VW/2;cam.y=P.y-VH/2;S.flash=0.5}}
function drawIsland(time){const I=S.isl,W=WORLD[MAPK],cx=Math.floor(cam.x),cy=Math.floor(cam.y),wf=Math.floor(time*3)%4,th=isTheme();
  const tx0=Math.floor(cx/T)-1,ty0=Math.floor(cy/T)-1,tx1=Math.floor((cx+VW)/T)+1,ty1=Math.floor((cy+VH)/T)+1,ax=I.x/T,ay=I.y/T;
  const inI=(tx,ty)=>Math.hypot(tx+0.5-ax,ty+0.5-ay)<=ISLR;
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const x=tx*T-cx,y=ty*T-cy;
    if(inI(tx,ty)){const mx=tx-ax,my=ty-ay,r=Math.hypot(tx+0.5-ax,ty+0.5-ay);
      if(r<3.2||W.special(mx,my))ctx.drawImage(groundTile(TILES.stone,tx,ty),x,y);else W.tile(mx,my,x,y,wf);
      if(r>=2.6&&r<3.2){ctx.fillStyle='#8e8a7e';ctx.fillRect(x,y+T-2,T,2)}
      if(!inI(tx,ty+1)){ctx.fillStyle='#7a5a3a';ctx.fillRect(x,y+T-6,T,6);ctx.fillStyle='#5a3e26';ctx.fillRect(x+((tx*5)&7),y+T-4,7,1);ctx.fillStyle='#2a1c10';ctx.fillRect(x,y+T-1,T,1)}
      continue}
    if(inI(tx,ty-1)){ctx.fillStyle=th==='lava'?'#3a1a10':th==='sea'?'#1a5a8a':'#20183a';ctx.fillRect(x,y,T,T);ctx.fillStyle='#5a3e26';ctx.fillRect(x+2,y,T-4,5+((tx*3)&3));continue}
    if(th==='lava')ctx.drawImage((TILES.lava2||TILES.lava)[(wf+((tx+ty)&1))%4],x,y);
    else if(th==='void')ctx.drawImage(TILES.void[(wf+((tx*3+ty)&3))%4],x,y);
    else if(th==='sky')ctx.drawImage(TILES.cloudsky[(wf+((tx+ty*2)&3))%4],x,y);
    else ctx.drawImage(TILES.sea[(wf+((tx+ty)&1))%4],x,y)}
  for(let ty=ty0-3;ty<=ty1+1;ty++)for(let tx=tx0-3;tx<=tx1+1;tx++){if(!inI(tx,ty))continue;const r=Math.hypot(tx+0.5-ax,ty+0.5-ay),mx=tx-ax,my=ty-ay;let d=null;
    if(r>ISLR-2.2){for(let k=0;k<8;k++){const a=k/8*TAU;if(tx===Math.floor(ax+Math.cos(a)*(ISLR-1.5))&&ty===Math.floor(ay+Math.sin(a)*(ISLR-1.5)))d=DECOR.pillar}}
    else if(r>4.5&&r<ISLR-2.5&&!W.special(mx,my)&&h2(tx,ty,9)<0.45)d=W.decor(mx,my,h2(mx,my,3));
    if(d)ctx.drawImage(d,tx*T-cx-d.width/2+8,ty*T-cy-d.height/2+8)}}
// ---------- breakable crates + Dragon Balls lying around the map ----------
const CRATESPR=[];
(function(){const P=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  const wood=mk(18,18),g=wood.getContext('2d');P(g,1,3,16,14,'#b07a3a');P(g,1,3,16,2,'#d8a060');P(g,1,15,16,2,'#6a4620');P(g,3,6,12,8,'#9a6a30');P(g,3,6,12,1,'#7a5222');
    for(let i=0;i<12;i++)P(g,3+i,6+Math.round(i*8/12),1,1,'#d8a060');P(g,1,3,2,14,'#8a8e98');P(g,15,3,2,14,'#8a8e98');P(g,1,3,2,1,'#c8ccd4');P(g,15,3,2,1,'#c8ccd4');
  const cap=mk(18,18),h=cap.getContext('2d');P(h,2,4,14,13,'#e8ecf2');P(h,2,4,14,2,'#ffffff');P(h,2,15,14,2,'#a8b0bc');P(h,2,8,14,3,'#2a5ab0');P(h,4,9,10,1,'#ffe060');P(h,7,1,4,3,'#a8b0bc');P(h,8,0,2,1,'#e83a2a');
  for(const c of [wood,cap]){const o=addOutline(c,'#1a1008'),w=tintC(o,'#ffffff');CRATESPR.push({fr:[o],fl:[o],wh:[w],whf:[w],w:16,h:18})}})();
function spawnCrate(x,y){if(!SPR.crate)SPR.crate=CRATESPR[0];const e=spawn('crate',x,y);e.crate=1;e.spr=CRATESPR[Math.random()<0.7?0:1];e.h=18;e.hp=e.maxhp=20+S.t/8;e.spd=0;e.dmg=0;e.kx=e.ky=0;return e}
function crateLoot(e){burst(e.x,e.y-8,14,['#d8a060','#8a5a2a','#ffe060']);sfx('gem');const r=Math.random(),x=e.x,y=e.y;
  if(r<0.05&&S.balls<7)putPickup({k:'dball',n:(S.ballN++%7)+1,x,y});
  else if(r<0.15)putPickup({k:'chest',x,y});
  else if(r<0.30)putPickup({k:'senzu',x,y});
  else if(r<0.40)putPickup({k:'capsulaVida',x,y});
  else if(r<0.50)putPickup({k:'capsulaKi',x,y});
  else if(r<0.58)putPickup({k:'radar',x,y});
  else if(r<0.78){for(let i=0;i<6;i++)dropGem(x+rnd(-10,10),y+rnd(-10,10),3+(S.t/60|0))}
  else for(let i=0;i<3;i++)putPickup({k:'zeni',x:x+rnd(-8,8),y:y+rnd(-6,6)})}
function crateTick(dt){if(state==='play')progTick();if(S.isl||state!=='play')return;S.crateT=(S.crateT||3)-dt;S.dbT=(S.dbT===undefined?60:S.dbT)-dt;
  let n=0;for(const e of enemies)if(e.crate&&!e.dead){if(Math.hypot(e.x-P.x,e.y-P.y)>700)e.dead=true;else n++}
  if(S.crateT<=0){S.crateT=5;if(n<6){const a=rnd(TAU),d=rnd(150,300);spawnCrate(P.x+Math.cos(a)*d,P.y+Math.sin(a)*d)}}
  if(S.dbT<=0){S.dbT=80;if(S.balls<7&&!pickups.some(k=>k.k==='dball')){const a=rnd(TAU),d=rnd(260,420);putPickup({k:'dball',n:(S.ballN++%7)+1,x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,radar:1});S.banner={t:2,text:'¡EL RADAR DETECTA UNA BOLA!',sub:'Sigue la flecha amarilla'}}}}
function drawRadar(time){if(!S||S.isl)return;const k=pickups.find(p=>p.k==='dball'&&p.radar);if(!k)return;const dx=k.x-P.x,dy=k.y-P.y,d=Math.hypot(dx,dy);if(d<VH*0.45)return;
  const a=Math.atan2(dy,dx),cx=VW/2+Math.cos(a)*(VH/2-26),cy=VH/2+Math.sin(a)*(VH/2-26),b=(time*4|0)%2;
  ctx.save();ctx.translate(Math.round(cx),Math.round(cy));ctx.rotate(a);ctx.fillStyle=OUTL;ctx.fillRect(-6,-5,12,10);ctx.fillStyle=b?'#ffd23f':'#ff9a1a';for(let i=0;i<5;i++)ctx.fillRect(-4+i,-4+i,2,8-i*2);ctx.restore();
  drawDBall(Math.round(cx-Math.cos(a)*12),Math.round(cy-Math.sin(a)*12)+3,k.n)}
// ---------- series landmarks: Kame House sign, Umigame, Freezer's ship, Saiyan pods, Capsule Corp sign ----------
(function landmarks(){
  const D=(w,h,fn,ol)=>{const c=mk(w,h),g=c.getContext('2d');fn(g,(x,y,ww,hh,col)=>{g.fillStyle=col;g.fillRect(x,y,ww,hh)});return ol===0?c:addOutline(c,ol||'#141018')};
  const GL={K:'1.1/1.1/11./1.1/1.1',A:'.1./1.1/111/1.1/1.1',M:'1.1/111/111/1.1/1.1',E:'111/1../11./1../111',H:'1.1/1.1/111/1.1/1.1',O:'111/1.1/1.1/1.1/111',U:'1.1/1.1/1.1/1.1/111',
    S:'111/1../111/..1/111',C:'111/1../1../1../111',P:'111/1.1/111/1../1..',R:'11./1.1/11./1.1/1.1',L:'1../1../1../1../111','.':'.../.../.../.../.1.',' ':'.../.../.../.../...'};
  const txt=(p,s,x,y,col)=>{for(const ch of s){const r=(GL[ch]||GL[' ']).split('/');r.forEach((row,j)=>{for(let i=0;i<3;i++)if(row[i]==='1')p(x+i,y+j,1,1,col)});x+=4}};
  const shd=(g,cx,cy,rx,ry)=>{g.fillStyle='rgba(10,20,20,.35)';for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx)+y*y/(ry*ry)<=1)g.fillRect(cx+x,cy+y,1,1)};
  // Kame House: pink walls, red hip roof, white sign with KAME HOUSE over the door, round windows, antenna
  DECOR.kamehouse=D(72,66,(g,p)=>{shd(g,36,61,32,5);p(8,32,56,28,'#f6aebd');p(8,32,56,3,'#ffd4dc');p(8,57,56,3,'#c87a8a');for(let x=12;x<62;x+=8)p(x,46,1,11,'#e898a8');
    p(14,36,44,8,'#fffaf2');p(14,36,44,1,'#ffffff');p(14,43,44,1,'#d8ccc0');txt(p,'KAME HOUSE',16,38,'#d8282a');
    p(31,46,10,14,'#8a4a2a');p(32,47,8,1,'#b06a3a');p(38,53,1,2,'#ffe060');for(const x of [16,49]){p(x,47,8,8,'#6ac0f0');p(x,47,8,1,'#ffffff');p(x+3,47,1,8,'#3a7aa8');p(x,50,8,1,'#3a7aa8')}
    for(let y=0;y<24;y++){const w=Math.round(30+y*1.75);p(36-(w>>1),8+y,w,1,y%4===3?'#b02424':'#dc3a36')}p(2,31,68,3,'#8a1a1a');p(20,8,32,2,'#ff6a5a');
    p(58,0,2,14,'#9a9aa2');p(54,2,10,1,'#c8c8d0');p(56,5,6,1,'#c8c8d0');p(10,12,6,10,'#f6aebd');p(10,10,6,3,'#c83a36')},'#2a1018');
  DECOR.turtle=D(26,18,(g,p)=>{shd(g,13,15,11,2);pball(g,12,8,9,['#2a6a2a','#3a8a32','#5aaa44','#8ad070'],6);for(const [x,y] of [[8,6],[13,5],[16,9],[10,10]])p(x,y,3,2,'#2a6a2a');
    pball(g,22,9,3,['#a8a070','#d0c890','#f0e8b0']);p(23,8,1,1,'#101010');p(2,12,3,2,'#c8c090');p(17,13,3,2,'#c8c090')},'#10200c');
  // Freezer's spaceship: round white saucer with a ring of portholes, yellow lights and landing legs
  DECOR.fship=D(84,56,(g,p)=>{shd(g,42,50,38,5);for(const x of [14,42,70])p(x-1,38,3,12,'#8a8e98');
    pball(g,42,30,38,['#9a9eaa','#c4c8d2','#e2e6ee','#ffffff'],17);p(6,32,72,3,'#8a8e98');for(let i=0;i<9;i++){const x=10+i*8;p(x,26,4,4,'#3a3e4a');p(x+1,26,2,1,'#7ab8f0')}
    for(let i=0;i<5;i++)p(14+i*14,36,3,2,'#ffd23f');pball(g,42,16,10,['#8a5ab0','#b07ad8','#e0b0ff'],6)},'#14161e');
  // Saiyan attack pod resting in its impact crater
  DECOR.podcrater=D(44,30,(g,p)=>{for(let y=-12;y<=12;y++)for(let x=-20;x<=20;x++){const d=Math.sqrt(x*x/400+y*y/144);if(d>1)continue;g.fillStyle=d>0.78?(y<0?'#7e5e36':'#d8bc88'):(y<0?'#6a4a2a':'#9a7a4e');g.fillRect(22+x,16+y,1,1)}
    pball(g,22,14,8,['#8a8e9a','#b8bcc8','#e0e4ec','#ffffff']);p(17,11,8,5,'#5a1a2a');p(18,12,6,3,'#d83a5a');p(19,12,2,1,'#ffa0b0');p(14,18,3,3,'#8a8e9a');p(27,18,3,3,'#8a8e9a')},'#1e140a');
  // Capsule Corp HQ with its logo
  DECOR.ccorp=D(66,52,(g,p)=>{shd(g,33,47,30,4);pball(g,33,27,27,['#c8ced6','#e0e6ec','#f4f8fc','#ffffff'],21);p(6,39,54,8,'#d8dee4');p(28,35,10,12,'#3a5a8a');
    p(5,14,56,9,'#ffffff');p(6,15,54,7,'#2a5ab0');txt(p,'CAPSULE CORP.',7,16,'#ffffff');for(const x of [9,52])p(x,26,5,4,'#7ac8f0')},'#1a2028');
  // place landmarks on solid ground, deterministically
  const spot=(W,x0,y0)=>{for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=x0+dx,y=y0+dy;if(!W.special(x,y)&&!W.special(x+1,y)&&!W.special(x,y+1)&&!W.special(x-1,y))return x+','+y}return ''};
  const pin=(id,list)=>{const W=WORLD[id];if(!W)return;const at={};for(const [x,y,d] of list)at[spot(W,x,y)]=d;const old=W.decor;
    W.decor=(tx,ty,v)=>{const k=at[tx+','+ty];if(k)return DECOR[k];for(const s in at){const [x,y]=s.split(',').map(Number);if(Math.abs(tx-x)<4&&Math.abs(ty-y)<3)return null}return old(tx,ty,v)}};
  pin('namek',[[14,-9,'fship']]);pin('tierra',[[-9,6,'podcrater'],[12,10,'podcrater']]);pin('gizard',[[-10,7,'podcrater']]);pin('pradera',[[9,7,'podcrater']]);pin('vegetasei',[[8,-7,'podcrater']]);
  {const W=WORLD.capsule,old=W.decor;W.decor=(tx,ty,v)=>tx===8&&ty===-7?DECOR.ccorp:Math.abs(tx-8)<4&&Math.abs(ty+7)<3?null:old(tx,ty,v)}
  {const W=WORLD.kame,old=W.decor;W.decor=(tx,ty,v)=>tx===3&&ty===2?DECOR.turtle:old(tx,ty,v)}
})();
// ---------- solid map objects, saga-ordered unlockable stages, Shenron wishes ----------
// [radio X, radio Y, margen desde el borde inferior]. 0 = dibujo plano y transitable.
const SOLID_DEF={
  tree0:[4,3,1],tree1:[4,3,1],rock:[6,4,1],house:[14,6,1],mesa:[20,7,1],temple:[31,7,1],hourglass:[5,3,1],pod:[8,4,0],redspire:[7,4,0],ruin0:[18,5,0],ruin1:[13,5,0],car:[10,4,0],rubble:0,
  spire:[15,6,1],spire2:[15,6,1],boulder:[8,5,0],crater:0,cactus:[4,4,0],palm:[4,3,1],kamehouse:[29,7,1],kaiohouse:[17,6,1],kaiocar:[10,4,0],ktree:[4,3,1],pillar:[7,4,1],tpcrater:0,zenobox:[23,6,1],debris:[8,4,0],
  bpyramid:[24,7,1],bfloat:[12,5,1],btree:[4,3,1],needle:[7,4,0],hbone:0,htree:[4,3,1],ybig:[6,4,1],ypop:[3,3,1],ymush:0,ycliff:[13,5,1],ypod:[12,5,1],zsword:[8,5,0],kstemple:[15,6,1],kstree:[4,3,1],crate:[7,5,0],barrel:[5,4,0],rrlogo:0,rrtower:[13,6,1],
  spine:[4,3,1],snowrock:[8,4,0],muscle:[15,7,1],jhouse:[11,5,1],budokai:[32,7,1],lantern:[3,3,0],flag:[3,3,0],kamipalace:[29,7,1],lpalm:[4,3,1],lpot:[4,3,0],cdome:[16,6,1],ccorp:[29,7,1],fpine:[4,3,1],ftree:[4,3,1],gokuhouse:[20,6,1],
  dskull:0,dcactus:[5,4,0],drock:[11,5,0],volcano:[29,8,1],lrock:[8,4,0],mesaS:[13,5,1],mesaL:[22,7,1],rpillar:[14,6,1],reed:0,btree2:[4,3,1],bigtree:[8,4,1],log:[13,4,0],fern:0,fship:[37,7,1],podcrater:[9,5,0],turtle:[10,4,0]
};
const SOLID_BY=new Map(),solidMemo=new Map(),solidNearM=new Map();let solidMap='',solidIX=0,solidIY=0,solidIsland=0;
function solidInit(){if(SOLID_BY.size)return;for(const k in SOLID_DEF)if(SOLID_DEF[k]&&DECOR[k])SOLID_BY.set(DECOR[k],SOLID_DEF[k])}
function solidReset(){solidMemo.clear();solidNearM.clear();solidMap='';solidIsland=0}
function solidSync(){const I=S&&S.isl,on=I?1:0,ix=I?I.x:0,iy=I?I.y:0;if(MAPK!==solidMap||on!==solidIsland||ix!==solidIX||iy!==solidIY){solidMemo.clear();solidNearM.clear();solidMap=MAPK;solidIsland=on;solidIX=ix;solidIY=iy}}
function solidAt(tx,ty){solidInit();const I=S&&S.isl,key=(tx+65536)*131072+(ty+65536);if(solidMemo.has(key))return solidMemo.get(key);
  const W=WORLD[MAPK];let d=null,jx=0,jy=0;if(!W)return 0;
  if(I){const ax=I.x/T,ay=I.y/T,r=Math.hypot(tx+0.5-ax,ty+0.5-ay),mx=tx-ax,my=ty-ay;if(r<=ISLR){if(r>ISLR-2.2){for(let k=0;k<8;k++){const a=k/8*TAU;if(tx===Math.floor(ax+Math.cos(a)*(ISLR-1.5))&&ty===Math.floor(ay+Math.sin(a)*(ISLR-1.5))){d=DECOR.pillar;break}}}else if(r>4.5&&r<ISLR-2.5&&!W.special(mx,my)&&h2(tx,ty,9)<0.45)d=W.decor(mx,my,h2(mx,my,3))}}
  else if(!W.special(tx,ty)){d=W.decor(tx,ty,h2(tx,ty,3));jx=(h2(tx,ty,4)*8)|0;jy=(h2(tx,ty,6)*8)|0}
  const f=d&&SOLID_BY.get(d);if(!f){solidMemo.set(key,0);return 0}const q={x:tx*T+jx+8,y:ty*T+jy+8+d.height/2-f[2]-f[1],rx:f[0],ry:f[1]};if(solidMemo.size>50000)solidMemo.clear();solidMemo.set(key,q);return q}
// footprints that can touch tile (px,py): cached so the hot loops only test real obstacles
function solidNear(px,py){const key=(px+65536)*131072+(py+65536);let a=solidNearM.get(key);if(a)return a;a=[];for(let ty=py-4;ty<=py+4;ty++)for(let tx=px-4;tx<=px+4;tx++){const q=solidAt(tx,ty);if(q)a.push(q)}if(solidNearM.size>20000)solidNearM.clear();solidNearM.set(key,a);return a}
function solidHit(x,y,r=0){solidSync();const a=solidNear(Math.floor(x/T),Math.floor(y/T));for(let i=0;i<a.length;i++){const q=a[i],rx=q.rx+r,ry=q.ry+r,dx=x-q.x,dy=y-q.y;if(dx*dx/(rx*rx)+dy*dy/(ry*ry)<1)return true}return false}
function solidResolve(o,r=0){solidSync();let hit=0;for(let pass=0;pass<3;pass++){let moved=0;const a=solidNear(Math.floor(o.x/T),Math.floor(o.y/T));for(let i=0;i<a.length;i++){const q=a[i],rx=q.rx+r,ry=q.ry+r,dx=o.x-q.x,dy=o.y-q.y,k=dx*dx/(rx*rx)+dy*dy/(ry*ry);if(k>=1)continue;hit=moved=1;if(k<0.000001){o.y=q.y+ry;continue}const m=1/Math.sqrt(k);o.x=q.x+dx*m;o.y=q.y+dy*m}if(!moved)break}return hit}
function solidMove(o,dx,dy,r=0){const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/3)),sx=dx/n,sy=dy/n;let hit=solidResolve(o,r);for(let i=0;i<n;i++){let z=o.x;o.x+=sx;if(solidHit(o.x,o.y,r)){o.x=z;hit|=1}z=o.y;o.y+=sy;if(solidHit(o.x,o.y,r)){o.y=z;hit|=2}}return hit}
function solidPlace(o,r=0,force=0){if(!force&&!solidHit(o.x,o.y,r))return true;const ox=o.x,oy=o.y;for(let n=1;n<=24;n++){const rr=n*6;for(let i=0;i<16;i++){const a=(i+n*5)*TAU/16;o.x=ox+Math.cos(a)*rr;o.y=oy+Math.sin(a)*rr;if(!solidHit(o.x,o.y,r))return true}}o.x=ox;o.y=oy;solidResolve(o,r);return !solidHit(o.x,o.y,r)}
function drawSolidDebug(){if(!debugSolid)return;solidSync();const x0=Math.floor(cam.x/T)-4,y0=Math.floor(cam.y/T)-4,x1=Math.floor((cam.x+VW)/T)+4,y1=Math.floor((cam.y+VH)/T)+4;ctx.save();ctx.strokeStyle='#ff35e8';ctx.lineWidth=1;for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const q=solidAt(tx,ty);if(!q)continue;ctx.beginPath();ctx.ellipse(q.x-cam.x,q.y-cam.y,q.rx,q.ry,0,0,TAU);ctx.stroke()}ctx.restore()}
// stages open one after another, in story order: beat 2 bosses (or win) on a stage to open the next
const MORDER=['kame','paoz','budokai','redribbon','musculo','desierto','bosque','tierra','pradera','gizard','kaio','namek','yardrat','vegetasei','capsule','futuro','arena','lookout','time','kaioshin','infierno','volcan','bills','poder'];
{const rest=Object.keys(MAPS).filter(k=>!MORDER.includes(k));for(const k of [...MORDER.filter(k=>MAPS[k]),...rest]){const v=MAPS[k];delete MAPS[k];MAPS[k]=v}}
// every stage is open from the start
function mapOpen(id){return true}
function mapLockMsg(id){const o=Object.keys(MAPS),p=o[o.indexOf(id)-1];return 'BLOQUEADO: derrota 2 jefes en '+(MAPS[p]?MAPS[p].name:'el escenario anterior')}
function progTick(){const k=S.bossKills||0,sv=loadSave();sv.mprog=sv.mprog||{};if(k<=(sv.mprog[S.map]||0))return;sv.mprog[S.map]=k;writeSave();
  if(k===2){const o=Object.keys(MAPS),n=o[o.indexOf(S.map)+1];if(n)setTimeout(()=>{if(state==='play')S.banner={t:3.2,text:'¡NUEVO ESCENARIO!',sub:MAPS[n].name+' desbloqueado'}},3200)}}
function heroMigrate(sv){if(sv.lockv)return;sv.lockv=1;const keep={goku:1,vegeta:1,piccolo:1};for(const k in sv.owned)if(CUSTOM.some(c=>c.id===k))keep[k]=sv.owned[k];
  try{localStorage.setItem('animesurvivor-owned-backup',JSON.stringify(sv.owned))}catch(e){}sv.owned=keep;sv.tickets=Math.max(sv.tickets||0,20);writeSave()}
// ---------- Shenron wish: the summoning plays out, the colour of the light tells the rarity ----------
(function wishUI(){const h=$('#gacha h2');if(h)h.textContent='PIDE UN DESEO A SHENRON';const hp=$('#gacha .help');if(hp)hp.textContent='Junta las 7 bolas y pide tu deseo. Luz azul: 3★ · luz morada: 4★ · luz dorada: 5★.';
  const L={gPull1:'1 DESEO · 1 TICKET',gPull10:'10 DESEOS · 10 TICKETS',gPull100:'100 DESEOS · 100 TICKETS'};setTimeout(()=>{for(const id in L){const b=$('#'+id);if(b){b.textContent=L[id];b.onclick=()=>wish(+id.slice(5))}}},0);
  const bg=$('#bGacha');if(bg)bg.textContent='SHENRON';
  const st=document.createElement('style');st.textContent='#wishFx{position:fixed;inset:0;z-index:50;width:100vw;height:100vh;image-rendering:pixelated;cursor:pointer;background:#04060e;object-fit:contain}';document.head.appendChild(st)})();
function wish(n,free){const s=loadSave();if(free?!freeReady():s.tickets<n){$('#gInfo').textContent=`Te faltan tickets: tienes ${s.tickets} y necesitas ${n}. Gana más jugando partidas.`;return}
  const m=muted;muted=true;doPull(n,free);muted=m;const box=$('#gRes'),top=box.querySelector('.r5')?5:box.querySelector('.r4')?4:3,news=box.querySelectorAll('.gcard').length;box.style.display='none';
  const W=320,H=180,c=mk(W,H);c.id='wishFx';const g=c.getContext('2d');g.imageSmoothingEnabled=false;document.body.appendChild(c);
  const COL={3:['#3a8aff','#bfe6ff'],4:['#b04aff','#f0c0ff'],5:['#ffb020','#fff6a0']}[top],shen=shenlong(),t0=performance.now(),dur=top===5?4.2:3.6,cf=[],sd=[];let done=false,ph=0;
  for(let i=0;i<60;i++)sd.push([Math.random()*W,Math.random()*H,Math.random()]);
  const end=()=>{if(done)return;done=true;c.remove();box.style.display='';if(top===5)sfx('trans');else sfx('level')};c.onclick=end;
  const fr=()=>{if(done)return;const t=(performance.now()-t0)/1000;if(t>dur){end();return}
    const sky=t<1?0:Math.min(1,(t-1)*2);g.fillStyle='#04060e';g.fillRect(0,0,W,H);
    for(const [x,y,k] of sd){g.fillStyle=((t*4+k*7)|0)%3?'#3a4060':'#c0c8ff';g.fillRect(x|0,y|0,1,1)}
    if(sky){g.globalAlpha=sky*0.35;g.fillStyle=top===5?'#3a2a00':top===4?'#2a0a3a':'#0a1a3a';g.fillRect(0,0,W,H);g.globalAlpha=1}
    // the seven balls spiral in and fuse
    if(t<1.5){const k=Math.min(1,t/1.2),r=90*(1-k)+6;for(let i=0;i<7;i++){const a=i/7*TAU+t*(2+k*6),x=W/2+Math.cos(a)*r,y=H*0.62+Math.sin(a)*r*0.5;pball(g,Math.round(x),Math.round(y),5,['#c85a10','#f2911a','#ffc44a','#fff0b0']);g.fillStyle='#d81e1e';g.fillRect(Math.round(x)-1,Math.round(y)-1,2,2)}
      if(ph<1&&t>0.05){ph=1;sfx('gem')}}
    // pillar of light
    if(t>1.1){if(ph<2){ph=2;sfx('boss')}const k=Math.min(1,(t-1.1)/0.4),w=Math.round(6+k*22+Math.sin(t*30)*2);g.fillStyle=COL[0];g.fillRect(W/2-w/2,0,w,H*0.66);g.fillStyle=COL[1];g.fillRect(W/2-w/4,0,w/2,H*0.66);
      for(let i=0;i<4;i++){g.fillStyle=COL[1];g.fillRect(W/2-w/2-4+((t*90+i*37)%(w+8)),(H*0.66-((t*160+i*41)%(H*0.66)))|0,2,6)}}
    // Shenron rises
    if(t>1.6){const k=Math.min(1,(t-1.6)/0.8),sx=1.6,sw=Math.round(shen.width*sx),y=Math.round(6+(1-k)*70);g.globalAlpha=k;g.drawImage(shen,Math.round(W/2-sw/2),y,sw,Math.round(shen.height*sx));g.globalAlpha=1;
      if(t>2.1&&t<2.9){text2(g,'¡DI TU DESEO!',W/2,H-22,'#ffffff')}}
    // reveal
    if(t>2.9){if(ph<3){ph=3;sfx(top>=4?'trans':'level');if(top>=4)for(let i=0;i<(top===5?120:50);i++)cf.push([W/2,H*0.5,(Math.random()-0.5)*260,-Math.random()*220,Math.random()])}
      const f=Math.max(0,1-(t-2.9)*2.2);if(f>0){g.globalAlpha=f;g.fillStyle=top===5?'#fff6c0':'#ffffff';g.fillRect(0,0,W,H);g.globalAlpha=1}
      text2(g,top===5?'¡DESEO LEGENDARIO!':top===4?'¡DESEO ÉPICO!':'DESEO CONCEDIDO',W/2,H-30,COL[1]);text2(g,top+' ESTRELLAS',W/2,H-16,COL[0]);
      for(const p of cf){const dt=1/60;p[0]+=p[2]*dt;p[1]+=p[3]*dt;p[3]+=300*dt;g.fillStyle=p[4]<0.33?'#ffd23f':p[4]<0.66?COL[1]:'#ff6ad0';g.fillRect(p[0]|0,p[1]|0,2,2)}}
    if(t>1.1&&t<2.2){const sh=top===5?3:2;c.style.transform=`translate(${(Math.random()-0.5)*sh*2}px,${(Math.random()-0.5)*sh*2}px)`}else c.style.transform='';
    requestAnimationFrame(fr)};fr()}
function text2(g,s,x,y,col){s=s.normalize('NFD').replace(/[̀-ͯ]/g,'');g.font='8px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='top';g.fillStyle='#000';for(const [a,b] of [[-1,0],[1,0],[0,-1],[0,1]])g.fillText(s,x+a,y+b);g.fillStyle=col;g.fillText(s,x,y)}
function edges(tx,ty,x,y,f,c1,c2){const n=f(tx,ty-1),s=f(tx,ty+1),w=f(tx-1,ty),e=f(tx+1,ty);if(!(n||s||w||e))return;
  ctx.fillStyle=c1;if(n)ctx.fillRect(x,y,T,3);if(s)ctx.fillRect(x,y+T-3,T,3);if(w)ctx.fillRect(x,y,3,T);if(e)ctx.fillRect(x+T-3,y,3,T);
  ctx.fillStyle=c2;if(n)ctx.fillRect(x,y+3,T,1);if(s)ctx.fillRect(x,y+T-4,T,1);if(w)ctx.fillRect(x+3,y,1,T);if(e)ctx.fillRect(x+T-4,y,1,T)}
function drawWorld(time){
  if(S&&S.isl&&!['title','maps','mine','gacha','credits','train','forge'].includes(state)){drawIsland(time);return}
  const W=WORLD[MAPK];if(!W)return;const cx=Math.floor(cam.x),cy=Math.floor(cam.y);
  const tx0=Math.floor(cx/T)-1,ty0=Math.floor(cy/T)-1,tx1=Math.floor((cx+VW)/T)+1,ty1=Math.floor((cy+VH)/T)+1;
  const wf=Math.floor(time*3)%4;
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++)W.tile(tx,ty,tx*T-cx,ty*T-cy,wf);
  for(let ty=ty0-3;ty<=ty1+1;ty++)for(let tx=tx0-3;tx<=tx1+1;tx++){if(W.special(tx,ty))continue;const d=W.decor(tx,ty,h2(tx,ty,3));
    if(d)ctx.drawImage(d,tx*T-cx+((h2(tx,ty,4)*8)|0)-d.width/2+8,ty*T-cy+((h2(tx,ty,6)*8)|0)-d.height/2+8)}}
// punto de las manos en el frame de cargar (0) o de lanzar (1) de la animación Cast del héroe (el héroe se dibuja a 0.5)
function heroHand(i,left){const pk=scHero(S.hid,P.form);if(!pk||!pk.Cast)return null;const c=pk.Cast.R[Math.min(i,pk.Cast.R.length-1)];
  if(!c._hand){const W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data;let y0=H,y1=0;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>40){if(y<y0)y0=y;if(y>y1)y1=y}
    if(i===0)c._hand=[W/2+W*0.12,H-(H-y0)*0.42];
    else{const ya=y0+(y1-y0)*0.25|0,yb=y0+(y1-y0)*0.7|0;let bx=-1,sy=0,n=0;
      for(let x=W-1;x>=0&&bx<0;x--)for(let y=ya;y<=yb;y++)if(d[(y*W+x)*4+3]>40){bx=x;sy+=y;n++}
      c._hand=bx<0?[W*0.75,H*0.6]:[bx,sy/n]}}
  return[P.x+(left?-1:1)*(c._hand[0]-c.width/2)*0.5,P.y+(c._hand[1]-c.height+1)*0.5]}
function drawBeam(b){
  const ox=Math.round(b.x-cam.x),oy=Math.round(b.y-cam.y),t=b.t;
  ctx.save();ctx.translate(ox,oy);ctx.rotate(b.a);
  const C=b.col; // [outer, mid, core]
  if(t<0){ // charging: growing orb with converging sparks
    const k=1-(-t)/b.T,r=Math.round(2+k*(b.big?9:5)),fl=(Math.random()*2)|0,orb=kiOrb(C);
    if(orb){const d=(r+1+fl)*2.2;ctx.drawImage(orb,Math.round(-d/2),Math.round(-d/2),Math.round(d),Math.round(d))}
    else{ctx.fillStyle=C[0];ctx.fillRect(-r-1-fl,-r-1-fl,(r+1+fl)*2,(r+1+fl)*2);ctx.fillStyle=C[1];ctx.fillRect(-r,-r,r*2,r*2);ctx.fillStyle=C[2];ctx.fillRect(-r/2,-r/2,r,r)}
    for(let i=0;i<6;i++){const a=i/6*TAU+t*9,d=8+((1-k)*24);ctx.fillStyle=i%2?C[2]:C[1];ctx.fillRect(Math.round(Math.cos(a)*d),Math.round(Math.sin(a)*d),2,2)}
    ctx.restore();return}
  const grow=Math.min(1,t/0.12),fade=1-Math.max(0,(t-b.dur*0.75)/(b.dur*0.25));
  const L=Math.round(b.len*grow),W=Math.max(2,b.wid*fade);
  if(b.spiral){ // thin core + two pink helices
    ctx.fillStyle=C[0];ctx.fillRect(0,-W/2-1,L,W+2);ctx.fillStyle=C[1];ctx.fillRect(0,-W/2,L,W);ctx.fillStyle=C[2];ctx.fillRect(0,-1,L,2);
    for(let x=0;x<L;x+=2){const s=Math.sin(x*0.25-t*30)*(W/2+5);ctx.fillStyle=s>0?'#ff6ad0':'#ffb0ea';ctx.fillRect(x,Math.round(s)-1,2,3);ctx.fillRect(x,Math.round(-s)-1,2,3)}
    ctx.restore();return}
  if((b.hero||b.e)&&FXI.kame&&FXI.galick){const sh=b.e?(/GALICK|FLASH|SUPERNOVA/.test(b.name)?'galick':'kame'):GALICK_SET.has(b.mv)?'galick':'kame',fi=(t*14|0)%FXI[sh].length,im=fxTint(FXI[sh][fi],C,sh+fi+C.join()),sw=im.width,shh=im.height,
      k=Math.max(0.3,W*1.9/shh),H=Math.round(shh*k),tx=Math.round(sw*0.14*k),back=-2,
      // el fogonazo de las manos va al 60 %: entero medía casi el doble de alto que el rayo y tapaba al personaje
      hm=Math.round(sw*0.3*k*0.6),Hm=Math.round(H*0.6),b0=hm>>1,bl=Math.max(0,L-tx-b0);
    ctx.globalAlpha=Math.max(0.2,fade);ctx.drawImage(im,Math.round(sw*0.5),0,2,shh,b0-1,-H>>1,bl+2,H);ctx.drawImage(im,sw-Math.round(sw*0.14),0,Math.round(sw*0.14),shh,b0+bl,-H>>1,tx,H);
    ctx.drawImage(im,0,0,Math.round(sw*0.3),shh,-back,-Hm>>1,hm,Hm);ctx.globalAlpha=1;ctx.restore();return}
  {ctx.globalAlpha=0.18+0.08*Math.sin(t*30);ctx.fillStyle=C[1];ctx.fillRect(0,-W-5,L,W*2+10);ctx.globalAlpha=0.12;ctx.fillRect(0,-W-10,L,W*2+20);ctx.globalAlpha=1}
  // jagged outer flame, layered like hama-bead pixel art
  for(let x=0;x<L;x+=2){const n=Math.sin(x*0.7+t*40)*0.5+Math.sin(x*0.23-t*25)*0.5,j=Math.round(n*W*0.12);
    const w0=W/2+2+j+(x%6===0?2:0),w1=W/2*0.78+j*0.5,w2=W/2*0.42;
    ctx.fillStyle=OUTL;ctx.fillRect(x,-w0-1,2,w0*2+2);
    ctx.fillStyle=C[0];ctx.fillRect(x,-w0,2,w0*2);
    ctx.fillStyle=C[1];ctx.fillRect(x,-w1,2,w1*2);
    ctx.fillStyle=C[2];ctx.fillRect(x,-w2,2,w2*2)}
  // streaks inside
  ctx.fillStyle='#ffffff';for(let i=0;i<5;i++){const sx=((t*400+i*53)%Math.max(1,L))|0,sy=Math.round(Math.sin(i*2.1)*W*0.25);ctx.fillRect(sx,sy,8,1)}
  // head: spiky ball
  const R=Math.round(W*0.75+3);
  for(let i=0;i<10;i++){const a=i/10*TAU+t*6,l=R+3+((i+((t*20)|0))%3)*2;ctx.fillStyle=C[0];ctx.fillRect(L+Math.round(Math.cos(a)*l)-2,Math.round(Math.sin(a)*l)-2,4,4)}
  ctx.restore();
  ctx.save();ctx.translate(ox,oy);ctx.rotate(b.a);
  const hx=L;circAt(hx,0,R+1,OUTL);circAt(hx,0,R,C[0]);circAt(hx,0,Math.round(R*0.75),C[1]);circAt(hx-1,-1,Math.round(R*0.4),C[2]);
  // muzzle flash at the hands
  const mr=Math.round(W*0.32+2);circAt(0,0,mr+1,C[0]);circAt(0,0,mr,C[1]);circAt(0,0,Math.round(mr*0.55),C[2]);
  ctx.restore()}
function circAt(x,y,r,col){ctx.fillStyle=col;for(let yy=-r;yy<=r;yy++){const w=Math.floor(Math.sqrt(r*r-yy*yy));ctx.fillRect(x-w,y+yy,w*2+1,1)}}
// pixel ki ball: dithered glow, dark rim, hot body, white core, rotating sparkles (2 frames)
const KIC={};
function kiSprite(r,col,f){r=Math.max(2,Math.min(16,Math.round(r)));const key=r+col.join('')+f;if(KIC[key])return KIC[key];
  const R=r+3,S=R*2+1,c=mk(S,S),g=c.getContext('2d');
  for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=Math.hypot(x,y);let k=null;
    if(d<=r*0.42)k=col[2];else if(d<=r-0.4)k=(x+y<-r*0.9&&d<r-1)?col[2]:col[1];else if(d<=r+0.6)k=col[0];
    else if(d<=r+2.4&&((x+y+f)&1)===0&&d<=r+1.6+((x*7+y*3+f)&1))k=col[1];
    if(k){g.fillStyle=k;g.globalAlpha=d>r+0.6?0.55:1;g.fillRect(x+R,y+R,1,1)}}
  g.globalAlpha=1;g.fillStyle='#ffffff';const hx=R-Math.round(r*0.35),hy=R-Math.round(r*0.35);g.fillRect(hx,hy,r>3?2:1,r>3?2:1);
  const sp=r+2,o=f?[[0,-sp],[0,sp],[-sp,0],[sp,0]]:[[-sp+1,-sp+1],[sp-1,sp-1],[-sp+1,sp-1],[sp-1,-sp+1]];
  for(const [x,y] of o){g.fillStyle='#ffffff';g.fillRect(R+x,R+y,1,1)}
  return KIC[key]=c}
// Kienzan: flat spinning saw disc seen in perspective, serrated rim that rotates (4 frames)
function discSprite(r,col,f){r=Math.max(4,Math.min(16,r));const key='d'+r+col.join('')+f;if(KIC[key])return KIC[key];
  const rx=r+2,ry=Math.max(3,Math.round(r*0.5)),W=rx*2+5,H=ry*2+5,c=mk(W,H),g=c.getContext('2d'),cx=W>>1,cy=H>>1;
  for(let y=-ry-2;y<=ry+2;y++)for(let x=-rx-2;x<=rx+2;x++){const d=Math.hypot(x/rx,y/ry);let k=null;
    if(d<=0.45)k='#ffffff';else if(d<=0.8)k=col[2];else if(d<=1)k=col[1];
    else if(d<=1.25){const a=Math.atan2(y/ry,x/rx),tooth=((a/TAU*12+f/4)%1+1)%1;if(tooth<0.45)k=col[0]}
    if(k){g.fillStyle=k;g.fillRect(cx+x,cy+y,1,1)}}
  g.fillStyle='rgba(255,255,255,.9)';const a=f/4*Math.PI;g.fillRect(Math.round(cx+Math.cos(a)*rx*0.65),Math.round(cy+Math.sin(a)*ry*0.65),2,1);
  return KIC[key]=c}
// bola redonda (orbe) y bola con estela de los packs, teñidas con los colores de la técnica
function kiOrb(C){const b=FXI['ki-buu-thin'];return b?fxTint(b[0],C,'orb'+C.join()):null}
function kiShot(C){const b=FXI['ki-goku'];return b?fxTint(b[0],C,'shot'+C.join()):null}
function drawKi(p,x,y,time){if(!p.spr&&p.col){const im=p.k==='big'?kiOrb(p.col):kiShot(p.col);if(im){const k=p.k==='big'?Math.max(1,p.r*2.4/im.height):Math.max(0.6,p.r/6.5),w=Math.round(im.width*k),h=Math.round(im.height*k);
    ctx.save();ctx.translate(x,y);if(p.k!=='big')ctx.rotate(Math.atan2(p.vy,p.vx));ctx.drawImage(im,p.k==='big'?-(w>>1):-Math.round(w*0.7),-(h>>1),w,h);ctx.restore();return}}
  if(p.spr){const im=p.spr,w=Math.round(im.width*0.6),h=Math.round(im.height*0.6);ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.drawImage(im,-Math.round(w*0.7),-(h>>1),w,h);ctx.restore();return}
  const sp=Math.hypot(p.vx,p.vy)||1,nx=p.vx/sp,ny=p.vy/sp,r=Math.round(p.r);
  for(let i=3;i>=1;i--){const rr=Math.max(1,r-i),tx=Math.round(x-nx*i*(r+1)*0.9),ty=Math.round(y-ny*i*(r+1)*0.9);ctx.globalAlpha=0.25+0.15*(3-i);circ(tx,ty,rr,p.col[i>1?0:1])}
  ctx.globalAlpha=1;const im=kiSprite(r,p.col,(time*16|0)%2);ctx.drawImage(im,x-(im.width>>1),y-(im.height>>1))}
// esferas del dragón dibujadas por el usuario (ui/esfera1..7.png, cargadas desde ui_imagenes.js); 18 px = 9 unidades
if(window.UI_IMG){document.querySelectorAll('[data-ui]').forEach(e=>e.src=UI_IMG[e.dataset.ui]);const fav=document.createElement('link');fav.rel='icon';fav.href=UI_IMG.logo;document.head.appendChild(fav)}
const radarAviso=$('#radarAviso');
function actualizarRadarAnimado(){if(!radarAviso)return;
  // El GIF de Lady-Pixel se muestra íntegro en DOM para conservar sus 44 fotogramas.
  radarAviso.hidden=!(state==='play'&&S&&!S.isl&&((S.radarHasta||0)>S.t||pickups.some(k=>k.k==='dball'&&k.radar)));
}
const DBIMG=[];if(window.UI_IMG)for(let k=1;k<=7;k++){const im=new Image();im.src=UI_IMG['esfera'+k];DBIMG[k]=im}
function drawDBall(x,y,n){const im=DBIMG[n];if(im&&im.complete&&im.naturalWidth){ctx.drawImage(im,Math.round(x*2-9)/2,Math.round(y*2-9)/2,9,9);return}
  circ(x,y,5,OUTL);circ(x,y,4,'#e0761a');circ(x-1,y-1,3,'#f2a02a')}
let SHEN=null;const SHENIMG=new Image();if(window.SHENRON_IMG)SHENIMG.src=SHENRON_IMG;
// Shenron: sprite de sprites/shenron (herramientas/montar_shenron.py), sin dibujos por código
function shenlong(){if(SHEN)return SHEN;const c=mk(170,96),g=c.getContext('2d');if(!(SHENIMG.complete&&SHENIMG.naturalWidth))return c;const k=96/SHENIMG.naturalHeight;g.imageSmoothingEnabled=false;g.drawImage(SHENIMG,Math.round(85-SHENIMG.naturalWidth*k/2),0,Math.round(SHENIMG.naturalWidth*k),96);return SHEN=c}
function openWish(){state='levelup';const box=$('#ups');box.innerHTML='';{const sc=document.createElement('canvas');sc.width=170;sc.height=96;sc.getContext('2d').drawImage(shenlong(),0,0);sc.style.cssText='max-width:510px;width:100%;image-rendering:pixelated';const wr=document.createElement('div');wr.style.cssText='flex-basis:100%;display:flex;justify-content:center';wr.appendChild(sc);box.appendChild(wr)}$('#luTitle').textContent='¡SHENLONG! PIDE UN DESEO';S.flash=0.6;cam.shake=6;sfx('trans');
  const W=[['wPow','PODER ILIMITADO','Todas tus técnicas suben 1 nivel.',()=>{for(const id of P.order){const m=P.moves[id];if(m.lv<5)m.lv++}}],
    ['wLife','VIDA ETERNA','Vida al máximo y una resurrección extra en esta partida.',()=>{S.revives++;P.hp=stats().maxhp}],
    ['wGold','RIQUEZA','+15 tickets y +500 zeni ahora mismo.',()=>{const s=loadSave();s.tickets+=15;s.zeni+=500;writeSave()}]];
  W.forEach(([ic,nm,ds,fn],i)=>{const b=document.createElement('button');b.type='button';b.className='up evo wish';const c=mk(16,16),g=c.getContext('2d');pball(g,8,8,6,['#c85a10','#f2911a','#ffc44a','#fff0b0']);g.fillStyle='#d81e1e';g.fillRect(7,7,2,2);c.style.width='48px';c.style.height='48px';c.style.imageRendering='pixelated';b.appendChild(c);
    b.insertAdjacentHTML('beforeend',`<span class="lv">DESEO</span><span class="nm">${nm}</span><span class="ds">${ds}</span><span class="key">[${i+1}]</span>`);
    b.onclick=()=>{fn();sfx('gem');$('#levelup').hidden=true;state='play';last=performance.now();S.banner={t:2,text:'¡TU DESEO SE HA CUMPLIDO!',sub:nm}};box.appendChild(b)});
  $('#levelup').hidden=false;setTimeout(()=>{const f=box.querySelector('button');f&&f.focus({preventScroll:true})},30)}
function circ(x,y,r,col){ctx.fillStyle=col;for(let yy=-r;yy<=r;yy++){const w=Math.floor(Math.sqrt(r*r-yy*yy));ctx.fillRect(Math.round(x-w),Math.round(y+yy),w*2+1,1)}}
function ring(x,y,r,col,th=1){ctx.fillStyle=col;const n=Math.max(16,r*4|0);for(let i=0;i<n;i++){const a=i/n*TAU;ctx.fillRect(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),th,th)}}
function render(time){
  const sx=cam.shake?rnd(-cam.shake,cam.shake):0,sy=cam.shake?rnd(-cam.shake,cam.shake):0;
  cam.x+=(P.x-VW/2-cam.x)*0.18;cam.y+=(P.y-10-VH/2-cam.y)*0.18;
  const ox=cam.x,oy=cam.y;cam.x+=sx;cam.y+=sy;
  drawWorld(time);
  drawSolidDebug();
  const X=v=>Math.round(v-cam.x),Y=v=>Math.round(v-cam.y);
  // gems
  for(const g of gems){const col=g.v>=20?['#ff4a5a','#ffb0b8']:g.v>=5?['#3ad870','#b0ffc8']:['#3a9aff','#c8ecff'];const x=X(g.x),y=Y(g.y)+((time*4+g.x)%2<1?0:-1);
    ctx.fillStyle=OUTL;ctx.fillRect(x-2,y-3,5,7);ctx.fillStyle=col[0];ctx.fillRect(x-1,y-2,3,5);ctx.fillStyle=col[1];ctx.fillRect(x-1,y-2,1,2)}
  for(const k of pickups){const x=X(k.x),y=Y(k.y);
    if(OBJ_IMG[k.k]){drawObjeto(k.k,x,y-3+Math.round(Math.sin(time*4)*1.5),k.k.startsWith('capsula')?8:14)}
    else if(k.k==='zeni'){ctx.fillStyle=OUTL;ctx.fillRect(x-3,y-7,7,7);ctx.fillStyle='#ffd23f';ctx.fillRect(x-2,y-6,5,5);ctx.fillStyle='#fff3a0';ctx.fillRect(x-1,y-5,2,2)}
    else if(k.k==='dball'){const b=Math.round(Math.sin(time*5)*2);ring(x,y-8+b,7+((time*8|0)%2),'rgba(255,200,80,.6)');drawDBall(x,y-8+b,k.n)}
    else if(k.k==='chest'){const b=(time*6|0)%2;ctx.fillStyle=OUTL;ctx.fillRect(x-8,y-12-b,16,12);ctx.fillStyle='#b8741a';ctx.fillRect(x-7,y-11-b,14,10);ctx.fillStyle='#ffd23f';ctx.fillRect(x-7,y-8-b,14,2);ctx.fillRect(x-1,y-9-b,3,4)}}
  // aura weapon
  if(P.moves.aura){const st=MV.aura.st(P.moves.aura.lv),r=Math.round(st.rad*stats().area*(P.moves.aura.evo?1.3:1));ring(X(P.x),Y(P.y-4),r+((time*10|0)%2),P.moves.aura.evo?'#ff2a2a':'#ff6a3a',1);ring(X(P.x),Y(P.y-4),r-3,'rgba(255,120,60,.5)',1)}
  // sort sprites
  const list=enemies.slice();list.push(P);list.sort((a,b)=>a.y-b.y);
  for(const e of list){
    if(e===P){const x=P.x-cam.x,y=P.y-cam.y;ctx.save();ctx.translate(x,y);ctx.scale(0.5,0.5);ctx.translate(-x,-y);shadow(x,y,16);
      if(P.form>0){const fl=auraFlames(heroAura(S.hid,P.form)),f=(time*14|0)%3;
        ctx.globalAlpha=0.8;ctx.drawImage(fl[f],Math.round(x-fl[f].width/2),Math.round(y-fl[f].height+3));ctx.globalAlpha=1;
        if(P.form>=2&&Math.random()<0.35){ctx.fillStyle='#bfe6ff';let lx=x+rnd(-10,10),ly=y-rnd(4,24);for(let i=0;i<5;i++){ctx.fillRect(Math.round(lx),Math.round(ly),1,2);lx+=rnd(-2,2)|0;ly+=2}}}
      if(P.iframe>0&&((time*20|0)%2)){ctx.restore();continue;}
      const HF=heroFrames(S.hid,P.form);let fr,flip=P.face<0;
      if(P.cast){const b=beams.find(q=>q.hero);fr=HF.cast[b&&b.t<0?0:1];flip=Math.cos(P.cast.a)<0}
      else if(P.hitT>0)fr=HF.hurt[0];
      else if(P.moving)fr=HF[P.dir+'walk'][(P.anim|0)%4];
      else fr=HF[P.dir+'idle'][(time*2.5|0)%2];
      if(P.dir!=='side'&&!P.cast)flip=false;
      const pk=scHero(S.hid,P.form);const my=pk?null:myHero(S.hid,P.form);
      if(S.hid==='gokuui' && !pk && P.moving && (P.dir==='down' || P.dir==='up') && GOKU_FRAMES.length===4 && GOKU_BACK.length===4 && !P.cast && !P.hitT){const im=(P.dir==='up'?GOKU_BACK:GOKU_FRAMES)[(P.anim|0)%4];ctx.drawImage(im,Math.round(x-im.width/2),Math.round(y-im.height+1))}
      else if(my){const fl=P.cast?Math.cos(P.cast.a)<0:P.face<0,im=P.hitT>0?(fl?my.wf:my.w):(P.moving&&my.walk?(fl?my.walkF:my.walk)[(P.anim|0)%my.walk.length]:(fl?my.f:my.c)),k=Math.max(1,Math.ceil(im.height/64)),w=Math.round(im.width/k),h=Math.round(im.height/k);
        const bobY=P.moving?((P.anim|0)%2):((time*2.5|0)%2),lean=P.moving?(((P.anim|0)%4)<2?1:-1):0;
        ctx.drawImage(im,0,0,im.width,Math.round(im.height*0.6),Math.round(x-w/2+lean),Math.round(y-h+bobY),w,Math.round(h*0.6));
        ctx.drawImage(im,0,Math.round(im.height*0.6),im.width,im.height-Math.round(im.height*0.6),Math.round(x-w/2),Math.round(y-h+bobY+h*0.6),w,h-Math.round(h*0.6))}
      else if(pk){// moverse y atacar a la vez (Josemi, 2 nov.): golpes, patadas, ki y preparación de técnicas se ven también en vuelo; el aura de poder solo quieto
        const mv=P.moving&&!P.cast&&!P.dead,pw=!mv&&P.powT>0,pd=P.pend,ak=P.atkT>0,
        left=pd&&!(P.moving&&P.pend.pose==='up')?Math.cos(P.pend.a)<0:P.cast?Math.cos(P.cast.a)<0:ak?Math.cos(P.atkA)<0:P.face<0,bm=P.cast?beams.find(q=>q.hero):null,chg=P.cast&&(!bm||bm.t<0),atk=!P.cast&&!(P.hitT>0)&&ak&&(P.atkK===2?(pk.Kick||pk.Attack):P.atkK?(pk.Cast||pk.Attack):(pk.Attack||pk.Cast)),A=P.dead?(pk.Faint||pk.Hurt):pw&&pk.Pow?pk.Pow:pd?(P.pend.pose==='up'&&pk.Pow?pk.Pow:pk.Cast):P.cast?pk.Cast:P.hitT>0?pk.Hurt:atk?atk:P.moving?pk.Walk:pk.Idle,i=P.dead?Math.min((pk.Faint||pk.Hurt).R.length-1,Math.floor(P.dead*3)):(pw||(pd&&P.pend.pose==='up'))&&pk.Pow?((time*8|0)%pk.Pow.R.length):pd?0:P.cast?(chg?0:1):P.hitT>0?1:atk?(A===pk.Cast?((1-P.atkT/P.atkD)<0.3?0:Math.min(1,A.R.length-1)):Math.min(A.R.length-1,Math.floor((1-P.atkT/P.atkD)*A.R.length))):P.moving?0:scFrame(A,time),im=(left?A.L:A.R)[Math.max(0,Math.min(A.R.length-1,i|0))],fly=P.moving&&!P.cast&&!(P.hitT>0)&&A===pk.Walk,
        // vuelo bajo al moverse: la pose de impulso se despega 3 px de la sombra y flota (0, 1, 2, 1 px) a 8 pasos por segundo;
        // sube y baja poco a poco al arrancar y al pararse, y la sombra se queda en el suelo
        bob=-Math.round(P.hov=(P.hov||0)+((fly?3+[0,1,2,1][(time*8|0)%4]:0)-(P.hov||0))*0.25);
        {const TR=P.tr||(P.tr=[]);if(P.moving&&!P.cast&&!(P.hitT>0)){if(!(time-TR.lt<0.045)){TR.lt=time;TR.unshift([P.x,P.y]);if(TR.length>4)TR.length=4}}else TR.length=0;
          for(let k=TR.length-1;k>=1;k--){ctx.globalAlpha=0.34-k*0.08;ctx.drawImage(im,Math.round(x+(TR[k][0]-P.x)*2-im.width/2),Math.round(y+(TR[k][1]-P.y)*2-im.height+1+bob))}ctx.globalAlpha=1}
        if(P.shieldT>0){ctx.globalAlpha=0.35+0.25*Math.sin(time*20);ctx.strokeStyle='#bfe6ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(Math.round(x),Math.round(y-im.height/2),Math.max(im.width,im.height)*0.62,0,TAU);ctx.stroke();ctx.globalAlpha=1}
        if(P.kaioT>0){const fl=auraFlames('red')[(time*14|0)%3];ctx.globalAlpha=0.85;ctx.drawImage(fl,Math.round(x-fl.width/2),Math.round(y-fl.height+3));ctx.globalAlpha=1}
        ctx.drawImage(im,Math.round(x-im.width/2),Math.round(y-im.height+1+bob));
        if(pd){const Q=P.pend,k=1-Q.t/Q.T,up=Q.pose==='up',r=Math.round(up?3+k*(Q.id==='genki'?14:8):2+k*3),kb=kiSprite(r,[Q.col[0],Q.col[1],'#ffffff'],(time*16|0)%2);ctx.globalAlpha=0.95;ctx.drawImage(kb,Math.round(x+(up?0:(left?-1:1)*im.width*0.3)-kb.width/2),Math.round(up?y-im.height-kb.height*0.6:y-im.height*0.5-kb.height/2));ctx.globalAlpha=1}
        if(chg&&!bm){const r=4+((time*14|0)%3),kb=kiSprite(r,['#1a5ad8','#6ac8ff','#ffffff'],(time*16|0)%2);ctx.globalAlpha=0.9;ctx.drawImage(kb,Math.round(x+(left?-1:1)*im.width*0.12-kb.width/2),Math.round(y-im.height*0.42-kb.height/2));ctx.globalAlpha=1}}
      // mientras carga su pack no se dibuja ningún muñeco hecho por código
      ctx.restore();continue}
    if(e.spr.pending){e.spr=enemySprite(e.type);if(e.spr.pending)continue;e.h=e.spr.h}
    const sc=e.spr.big?1:e.boss?2:1,x=e.x-cam.x,y=e.y-cam.y;shadow(x,y,e.spr.w*sc*0.6);
    if(e.aura){const fl=auraFlames(e.aura)[(time*10|0)%3];ctx.globalAlpha=0.75;ctx.drawImage(fl,Math.round(x-fl.width/2),Math.round(y-fl.height+2));ctx.globalAlpha=1}
    if(e.spr.pk)drawPkEnemy(e,x,y);else drawSprite(e.spr,x,y+(e.boss?0:0),e.anim,e.x>P.x,e.flash>0,sc);
    // vida sobre la cabeza de cada enemigo
    if(!e.crate&&e.maxhp>0){const top=Math.round(y-(e.spr.pk?(e.dh||e.h):e.h*sc)-5),el=ET[e.type].elite,bw=e.boss?34:el?20:14;bar(Math.round(x-bw/2),top,bw,e.boss?3:2,Math.max(0,e.hp/e.maxhp),e.boss?'#c83ad8':el?'#ffb020':'#ff4d5e')}
    if(e.ball)drawDBall(x,y-e.h*sc-6+Math.round(Math.sin(time*6)),4)}
  // eventos en el mundo: marcas de meteoritos y Genkidama sobre la cabeza
  if(S.ev){const E=S.ev;
    if(E.k==='meteoros')for(const m of E.list){const x=Math.round(m.x-cam.x),y=Math.round(m.y-cam.y);ctx.globalAlpha=0.35+0.4*((time*10|0)%2);ctx.strokeStyle='#ff4d5e';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,30,15,0,0,TAU);ctx.stroke();
      const fy=y-m.t*160;ctx.globalAlpha=1;const kb=kiSprite(5,['#8a2a10','#ff7a3a','#fff3c0'],(time*16|0)%2);ctx.drawImage(kb,x-kb.width/2,Math.round(fy-kb.height/2))}
    ctx.globalAlpha=1;
    if(E.k==='genkidama'){const r=Math.round(4+(10-E.t)*1.2),kb=kiSprite(r,['#2a7ad8','#6ab8ff','#ffffff'],(time*12|0)%2);ctx.drawImage(kb,Math.round(P.x-cam.x-kb.width/2),Math.round(P.y-cam.y-22-kb.height))}}
  // sword slashes and shock rings
  for(const f of fxSl){const k=f.t/f.dur,x=X(f.x),y=Y(f.y);ctx.globalAlpha=1-k;for(let j=0;j<3;j++){ctx.fillStyle=j?f.col[0]:'#ffffff';const rr=f.r*(0.55+0.15*j+0.3*k);for(let b=-f.arc/2;b<=f.arc/2;b+=0.06){const c=f.a+b,w=1+((f.arc/2-Math.abs(b))*3|0);ctx.fillRect(Math.round(x+Math.cos(c)*rr),Math.round(y+Math.sin(c)*rr*0.7),w>2?2:1,w>1?2:1)}}ctx.globalAlpha=1}
  for(const f of fxRg){const k=f.t/f.dur,x=X(f.x),y=Y(f.y);ctx.globalAlpha=1-k*0.8;ring(x,y,Math.round(f.rad*(0.25+0.75*k)),f.col[0],2);ring(x,y,Math.round(f.rad*(0.15+0.7*k)),f.col[1],1);ctx.globalAlpha=1}
  // projectiles
  for(const p of projs){const x=X(p.x),y=Y(p.y);
    if(p.k==='ki')drawKi(p,x,y,time)
    else if(p.k==='big'){drawKi(p,x,y,time);const r=Math.round(p.r)+4;for(let i=0;i<5;i++){const a=time*7+i*1.3,d=r+((time*30+i*7|0)%4);ctx.fillStyle=i%2?p.col[2]:p.col[1];ctx.fillRect(Math.round(x+Math.cos(a)*d),Math.round(y+Math.sin(a)*d),i%2?1:2,i%2?1:2)}
      ring(x,y,r+1+((time*12|0)%3),p.col[0],1)}
    else if(p.k==='disc'){const im=discSprite(Math.round(p.r)+2,p.col,(time*24|0)%4);ctx.globalAlpha=0.35;ctx.drawImage(im,x-(im.width>>1)-Math.round(p.vx*0.02),y-(im.height>>1)-Math.round(p.vy*0.02));ctx.globalAlpha=1;ctx.drawImage(im,x-(im.width>>1),y-(im.height>>1))}}
  for(const b of beams)drawBeam(b);
  for(const b of bombs){const k=b.t/b.fall,r=Math.round(b.rad*0.45),x=X(b.x),y=Y(b.y)-Math.round((1-k)*160);
    ring(X(b.x),Y(b.y),Math.round(b.rad*k),'rgba(150,210,255,.7)');const im=kiSprite(Math.min(16,r),[b.col[0],b.col[1],b.col[2]],(time*10|0)%2);ctx.drawImage(im,x-(im.width>>1),y-(im.height>>1));for(let i=0;i<6;i++){const q=time*3+i*1.05,d=r+6+((i*5+time*20|0)%5);ctx.fillStyle=b.col[3];ctx.fillRect(Math.round(x+Math.cos(q)*d),Math.round(y+Math.sin(q)*d*0.8),1,2)}}
  // orbs
  if(P.moves.orbs){const m=P.moves.orbs,st=MV.orbs.st(m.lv),n=st.count+(m.evo?2:0),rad=st.rad*stats().area;
    for(let i=0;i<n;i++){const a=P.orbA+i*TAU/n,x=X(P.x+Math.cos(a)*rad),y=Y(P.y-8+Math.sin(a)*rad);circ(x,y,4,OUTL);circ(x,y,3,m.evo?'#ffe066':'#f2911a');ctx.fillStyle='#d81e1e';ctx.fillRect(x-1,y-1,2,2);ctx.fillStyle='#fff0b0';ctx.fillRect(x-2,y-2,1,1)}}
  for(const p of parts){if(p.ring){ring(X(p.x),Y(p.y),Math.round(p.r*(1-p.t/p.T)),p.c,2);continue}ctx.fillStyle=p.c;ctx.fillRect(X(p.x),Y(p.y),p.s,p.s)}
  // las explosiones grandes, algo transparentes para que se vea lo que pasa debajo
  for(const f of fxs){const c=f.fr[Math.min(f.fr.length-1,f.t/f.T*f.fr.length|0)];if(c.width>40)ctx.globalAlpha=0.85;ctx.drawImage(c,X(f.x)-(c.width>>1),Y(f.y)-(c.height>>1));ctx.globalAlpha=1}
  // números de daño a la mitad: un píxel de la imagen por píxel del número, como el HUD (si la pantalla va a x1, como antes)
  {const hk=SC*DPR/2>1?1:2;ctx.save();ctx.scale(hk/2,hk/2);for(const t of texts)if(typeof t.v!=='string')digits(String(t.v),X(t.x)*2/hk,Y(t.y)*2/hk,t.c);ctx.restore()}
  for(const t of texts)if(typeof t.v==='string')text(t.v,X(t.x),Y(t.y),t.c,8);
  // lo peligroso va encima de los efectos propios, para que nunca quede tapado: rayos y balas de los enemigos
  for(const b of ebeams){if(b.t<0){const on=((b.t*12)|0)%2===0;if(on){ctx.save();ctx.translate(Math.round(b.x-cam.x),Math.round(b.y-cam.y));ctx.rotate(b.a);ctx.fillStyle='rgba(255,40,60,.75)';
      for(let x=10;x<b.len;x+=8)ctx.fillRect(x,-1,5,2);ctx.fillStyle='rgba(255,40,60,.25)';ctx.fillRect(10,-b.wid/2,b.len,b.wid);ctx.restore()}
      }
    drawBeam(b)}
  for(const s of eshots){const x=X(s.x),y=Y(s.y);circ(x,y,s.r+1,OUTL);circ(x,y,s.r,s.col);ctx.fillStyle='#fff';ctx.fillRect(x-1,y-1,1,1)}
  cam.x=ox;cam.y=oy;
  {const lo=P.hp/stats().maxhp;if(lo<0.3&&state==='play'){const a=(0.3-lo)/0.3*(0.35+0.25*Math.sin(time*8));ctx.fillStyle=`rgba(200,20,30,${a.toFixed(3)})`;ctx.fillRect(0,0,VW,4);ctx.fillRect(0,VH-4,VW,4);ctx.fillRect(0,0,4,VH);ctx.fillRect(VW-4,0,4,VH);ctx.fillStyle=`rgba(200,20,30,${(a*0.5).toFixed(3)})`;ctx.fillRect(4,4,VW-8,3);ctx.fillRect(4,VH-7,VW-8,3);ctx.fillRect(4,4,3,VH-8);ctx.fillRect(VW-7,4,3,VH-8)}}
  // destello de pantalla suave: antes llegaba a un blanco casi opaco (0,8) al transformarse o con la Genkidama
  if(S.flash>0){ctx.fillStyle=`rgba(255,255,230,${Math.min(0.35,S.flash*0.7)})`;ctx.fillRect(0,0,VW,VH)}
  hud(time)}
const FLAMES={};
function auraFlames(kind){if(FLAMES[kind])return FLAMES[kind];
  const C={gold:['#e8a010','#ffd23f','#fff6a8'],white:['#7ab8e8','#bfe6ff','#ffffff'],orange:['#d0501a','#ff9a3a','#ffe0a0'],red:['#a01030','#ff3a5a','#ffb0c0'],blue:['#1a7ad8','#3ad0f0','#c0f8ff'],green:['#5aa010','#b8f040','#f0ffc0'],purple:['#5a1a90','#a050ff','#e8c8ff']}[kind];
  const out=[];for(let f=0;f<3;f++){const W=46,H=62,c=mk(W,H),g=c.getContext('2d'),r=srand(77+f*31);
    const layer=(sc,col)=>{g.fillStyle=col;for(let x=-22;x<=22;x++){const k=Math.abs(x)/22;if(k>sc)continue;
      let h=(H-4)*sc*Math.pow(1-(k/sc)**2,0.55);if(x%5===((f*2)%5)-2||x%5===((f*2)%5)+2)h+=4+r()*6;h=Math.round(h*(0.9+r()*0.15));
      g.fillRect(W/2+x,H-h,1,h-Math.round(3*(1-k)))}};
    layer(1,C[0]);layer(0.78,C[1]);layer(0.45,C[2]);out.push(c)}
  return FLAMES[kind]=out}
const ICON_C={};
function ic(id){return ICON_C[id]||(ICON_C[id]=icon(id))}
ICON_C.senzu=icon('senzu');
function bar(x,y,w,h,f,col,bg='#1a1f38'){ctx.fillStyle=OUTL;ctx.fillRect(x-1,y-1,w+2,h+2);ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(f,0,1)),h)}
const TACTIL=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches);
function hud(time){
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
    text((HW>=560?MAPS[S.map].name+' · ':'')+S.kills+' derrotados · '+S.zeni+' zeni'+(S.diff?' · '+DIFF[S.diff].n:''),HW/2,44,'rgba(200,210,235,.75)',8)}
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
      ctx.drawImage(sigIcon(L[i]),x+4,y+4,16*t2,16*t2);if(on&&P.sigT>0){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x,y,w,Math.round(w*clamp(P.sigT/P.sigCD,0,1)))}
      ctx.fillStyle=on?'#ffd23f':'#3a4a7a';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+w-1,w,1);ctx.fillRect(x,y,1,w);ctx.fillRect(x+w-1,y,1,w);text(String(i+1),x+2,y+2,'#ffd23f',8,'left')}
    if(L[P.sel])text(MV[L[P.sel]].name,HW/2,y-11,'#ff9a3a',8);
    if(S.t<30)text('WASD moverse · 1-'+n+' cambiar técnica · Esc pausa',HW/2,HH-10,'rgba(200,210,235,.6)',8);
    if(!(S.boss&&!S.boss.dead)&&S.bossIdx<BOSS_T.length){const left=BOSS_T[S.bossIdx]-S.t;if(left<20)text('SE ACERCA '+ET[MAPS[S.map].bosses[S.bossIdx]].n+' '+Math.ceil(left),HW/2,y-32,(time*4|0)%2?'#ff4d5e':'#ffffff',16)}
    if(P.newSig){const id=L[P.newSig.i];if(id&&((P.newSig.t*4|0)%2||P.newSig.t<2.2)){text('¡NUEVO ATAQUE: '+MV[id].name.toUpperCase()+'!',HW/2,y-52,'#ffd23f',16);text('PULSA '+(P.newSig.i+1)+' PARA USARLO',HW/2,y-30,'#ffffff',8)}}}
  // aviso grande en el centro (jefe, oleada, emboscada…): una franja fina con el título y el subtítulo
  if(S.banner){const b=S.banner,y=Math.round(HH*0.3),big=b.text.length*16<=HW-24;ctx.fillStyle='rgba(5,8,18,.6)';ctx.fillRect(0,y-6,HW,b.sub?36:28);
    text(b.text,HW/2,y,b.boss?'#ff4d5e':'#ffd23f',big?16:8);if(b.sub)text(b.sub,HW/2,y+(big?20:12),'#ffffff',8)}
  ctx.restore();
  // en coordenadas del mundo: flecha del radar y joystick táctil
  drawRadar(time);
  if(joy.on){ring(Math.round(joy.ox),Math.round(joy.oy),18,'rgba(255,255,255,.5)',2);const dx=joy.x-joy.ox,dy=joy.y-joy.oy,d=Math.hypot(dx,dy),k=d>18?18/d:1;circ(Math.round(joy.ox+dx*k),Math.round(joy.oy+dy*k),6,'rgba(255,255,255,.6)')}
}
function present(){if(!view.width||!view.height)return;sctx.imageSmoothingEnabled=false;sctx.drawImage(view,0,0,VW*2,VH*2,0,0,VW*SC*DPR,VH*SC*DPR)}

// ---------- custom sprites (player's own images, stored only in this browser) ----------
const MY={heroes:{},enemies:{}};const MYC={};
function loadMine(){try{const d=JSON.parse(localStorage.getItem('animesurvivor-sprites')||'{}');MY.heroes=d.heroes||{};MY.enemies=d.enemies||{}}catch(e){}
  for(const k in MYC)delete MYC[k];
  const mkC=url=>{const im=new Image();const o={c:null};im.onload=()=>{const c=mk(im.width,im.height);c.getContext('2d').drawImage(im,0,0);o.c=c;o.f=flipC(c);o.w=tintC(c,'#ffffff');o.wf=flipC(o.w);for(const id in MY.enemies)delete SPR[id]};im.src=url;return o};
  for(const h in MY.heroes)for(const f in MY.heroes[h])MYC['h:'+h+':'+f]=mkC(MY.heroes[h][f]);
  for(const e in MY.enemies)MYC['e:'+e]=mkC(MY.enemies[e])}
function saveMine(){try{localStorage.setItem('animesurvivor-sprites',JSON.stringify(MY));return true}catch(e){return false}}

// ---------- animaciones SpriteCollab (Idle/Walk/Hurt, 8 direcciones; solo las filas Derecha e Izquierda) ----------
const SCPACK={"h":{"goku":{"0":"goku","1":"goku-ssj1","2":"goku-ssj2","3":"goku-ssj3","4":"goku-blue"},"vegeta":{"0":"vegeta","1":"vegeta-ssj","3":"majinv","4":"vegeta-blue"},"vegetaue":{"0":"vegeta","1":"vegeta-ssj","3":"24-vegeta-ultra-ego","2":"vegeta-blue"},"piccolo":{"0":"piccolo"},"krilin":{"0":"krilin"},"gohan":{"0":"21-gohan-nino","1":"gohan-ssj"},"trunks":{"0":"38-trunks-espada","1":"trunks-ssj"},"a18":{"0":"a18"},"a18npc":{"0":"a18"},"a17npc":{"0":"a17"},"bardock":{"0":"bardock"},"broly":{"0":"broly"},"vegetto":{"0":"vegetto"},"gogeta":{"0":"gogeta"},"black":{"0":"black","1":"rose"},"gokuui":{"0":"goku","1":"goku-ssj1","2":"goku-blue","3":"gokuui"}},"e":{"hitB":"hit","hitE":"hit","superbuuB":"superbuu","superbuuE":"superbuu","zamasuB":"zamasu","zamasuE":"zamasu","billsB":"bills","turles":"turles","frost":"frost","coolerB":"cooler","vegetaSB":"vegeta","vegetaE":"vegeta","freezaF":"freezaF","a16B":"a16","janemba":"janemba","jiren":"jiren","cellsemiE":"cellsemi","frostE":"frost","turlesE":"turles","saibaR":"saibaman","saibaB":"saibaman","saiba":"saibaman","saibaX":"saibaman","frieza":"freeza","frieza100":"freeza-fp","raditz":"raditz","a17e":"a17","a18e":"a18","cell":"cell","rose":"rose","black":"black","golden":"golden","fatbuu":"fatbuu","buu":"kidbuu","majinv":"majinv","coolerE":"cooler","a16E":"a16","cellimpE":"cellimp"},"s":{"hit":{"Idle":[80,56,[60],SPRITES_DATA[210]],"Walk":[80,56,[8],SPRITES_DATA[211]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[212]],"Cast":[80,56,[10,10],SPRITES_DATA[213]],"Hurt":[80,56,[6,10],SPRITES_DATA[214]]},"superbuu":{"Idle":[56,64,[60],SPRITES_DATA[215]],"Walk":[56,64,[8],SPRITES_DATA[216]],"Attack":[56,64,[5,4,8,5],SPRITES_DATA[217]],"Cast":[56,64,[10,10],SPRITES_DATA[218]],"Hurt":[56,64,[6,10],SPRITES_DATA[219]]},"zamasu":{"Idle":[64,64,[60],SPRITES_DATA[220]],"Walk":[64,64,[8],SPRITES_DATA[221]],"Attack":[64,64,[5,4,8,5],SPRITES_DATA[222]],"Cast":[64,64,[10,10],SPRITES_DATA[223]],"Hurt":[64,64,[6,10],SPRITES_DATA[224]]},"bills":{"Idle":[96,64,[60],SPRITES_DATA[225]],"Walk":[96,64,[8],SPRITES_DATA[226]],"Attack":[96,64,[5,4,8,5],SPRITES_DATA[227]],"Cast":[96,64,[10,10],SPRITES_DATA[228]],"Hurt":[96,64,[6,10],SPRITES_DATA[229]]},"turles":{"Idle":[80,64,[60],SPRITES_DATA[180]],"Walk":[80,64,[8],SPRITES_DATA[181]],"Attack":[80,64,[5,4,8,5],SPRITES_DATA[182]],"Cast":[80,64,[10,10],SPRITES_DATA[183]],"Hurt":[80,64,[6,10],SPRITES_DATA[184]]},"janemba":{"Idle":[96,72,[60],SPRITES_DATA[185]],"Walk":[96,72,[8],SPRITES_DATA[186]],"Attack":[96,72,[5,4,8,5],SPRITES_DATA[187]],"Cast":[96,72,[10,10],SPRITES_DATA[188]],"Hurt":[96,72,[6,10],SPRITES_DATA[189]]},"freezaF":{"Idle":[72,48,[60],SPRITES_DATA[190]],"Walk":[72,48,[8],SPRITES_DATA[191]],"Attack":[72,48,[5,4,8,5],SPRITES_DATA[192]],"Cast":[72,48,[10,10],SPRITES_DATA[193]],"Hurt":[72,48,[6,10],SPRITES_DATA[194]]},"frost":{"Idle":[64,56,[60],SPRITES_DATA[195]],"Walk":[64,56,[8],SPRITES_DATA[196]],"Attack":[64,56,[5,4,8,5],SPRITES_DATA[197]],"Cast":[64,56,[10,10],SPRITES_DATA[198]],"Hurt":[64,56,[6,10],SPRITES_DATA[199]]},"cellsemi":{"Idle":[72,64,[60],SPRITES_DATA[200]],"Walk":[72,64,[8],SPRITES_DATA[201]],"Attack":[72,64,[5,4,8,5],SPRITES_DATA[202]],"Cast":[72,64,[10,10],SPRITES_DATA[203]],"Hurt":[72,64,[6,10],SPRITES_DATA[204]]},"jiren":{"Idle":[56,56,[60],SPRITES_DATA[205]],"Walk":[56,56,[8],SPRITES_DATA[206]],"Attack":[56,56,[5,4,8,5],SPRITES_DATA[207]],"Cast":[56,56,[10,10],SPRITES_DATA[208]],"Hurt":[56,56,[6,10],SPRITES_DATA[209]]},"saibaman":{"Idle":[56,48,[60],SPRITES_DATA[0]],"Walk":[56,48,[8,8,8,8],SPRITES_DATA[1]],"Attack":[56,48,[5,4,8,5],SPRITES_DATA[2]],"Cast":[56,48,[10,10],SPRITES_DATA[3]],"Hurt":[56,48,[6,10],SPRITES_DATA[4]]},"goku":{"Idle":[80,56,[60],SPRITES_DATA[5]],"Walk":[80,56,[8],SPRITES_DATA[6]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[7]],"Cast":[80,56,[10,10],SPRITES_DATA[8]],"Hurt":[80,56,[6,10],SPRITES_DATA[9]]},"goku-ssj1":{"Idle":[80,56,[60],SPRITES_DATA[10]],"Walk":[80,56,[8],SPRITES_DATA[11]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[12]],"Cast":[80,56,[10,10],SPRITES_DATA[13]],"Hurt":[80,56,[6,10],SPRITES_DATA[14]]},"vegeta":{"Idle":[72,56,[60],SPRITES_DATA[15]],"Walk":[72,56,[8],SPRITES_DATA[16]],"Attack":[72,56,[5,4,8,5],SPRITES_DATA[17]],"Cast":[72,56,[10,10],SPRITES_DATA[18]],"Hurt":[72,56,[6,10],SPRITES_DATA[19]]},"cell":{"Idle":[80,64,[60],SPRITES_DATA[20]],"Walk":[80,64,[8],SPRITES_DATA[21]],"Attack":[80,64,[5,4,8,5],SPRITES_DATA[22]],"Cast":[80,64,[10,10],SPRITES_DATA[23]],"Hurt":[80,64,[6,10],SPRITES_DATA[24]]},"freeza":{"Idle":[56,48,[60],SPRITES_DATA[25]],"Walk":[56,48,[8,8,8,8],SPRITES_DATA[26]],"Attack":[56,48,[5,4,8,5],SPRITES_DATA[27]],"Cast":[56,48,[10,10],SPRITES_DATA[28]],"Hurt":[56,48,[6,10],SPRITES_DATA[29]]},"goku-ssj3":{"Idle":[80,64,[60],SPRITES_DATA[30]],"Walk":[80,64,[8],SPRITES_DATA[31]],"Attack":[80,64,[5,4,8,5],SPRITES_DATA[32]],"Cast":[80,64,[10,10],SPRITES_DATA[33]],"Hurt":[80,64,[6,10],SPRITES_DATA[34]]},"piccolo":{"Idle":[64,56,[60],SPRITES_DATA[35]],"Walk":[64,56,[8],SPRITES_DATA[36]],"Attack":[64,56,[5,4,8,5],SPRITES_DATA[37]],"Cast":[64,56,[10,10],SPRITES_DATA[38]],"Hurt":[64,56,[6,10],SPRITES_DATA[39]]},"goku-ssj2":{"Idle":[80,64,[60],SPRITES_DATA[40]],"Walk":[80,64,[8],SPRITES_DATA[41]],"Attack":[80,64,[5,4,8,5],SPRITES_DATA[42]],"Cast":[80,64,[10,10],SPRITES_DATA[43]],"Hurt":[80,64,[6,10],SPRITES_DATA[44]]},"vegeta-ssj":{"Idle":[72,64,[60],SPRITES_DATA[45]],"Walk":[72,64,[8],SPRITES_DATA[46]],"Attack":[72,64,[5,4,8,5],SPRITES_DATA[47]],"Cast":[72,64,[10,10],SPRITES_DATA[48]],"Hurt":[72,64,[6,10],SPRITES_DATA[49]]},"gohan-ssj":{"Idle":[72,56,[60],SPRITES_DATA[50]],"Walk":[72,56,[8],SPRITES_DATA[51]],"Attack":[72,56,[5,4,8,5],SPRITES_DATA[52]],"Cast":[72,56,[10,10],SPRITES_DATA[53]],"Hurt":[72,56,[6,10],SPRITES_DATA[54]]},"a18":{"Idle":[80,56,[60],SPRITES_DATA[55]],"Walk":[80,56,[8],SPRITES_DATA[56]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[57]],"Cast":[80,56,[10,10],SPRITES_DATA[58]],"Hurt":[80,56,[6,10],SPRITES_DATA[59]]},"bardock":{"Idle":[80,56,[60],SPRITES_DATA[60]],"Walk":[80,56,[8],SPRITES_DATA[61]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[62]],"Cast":[80,56,[10,10],SPRITES_DATA[63]],"Hurt":[80,56,[6,10],SPRITES_DATA[64]]},"broly":{"Idle":[104,80,[60],SPRITES_DATA[65]],"Walk":[104,80,[8],SPRITES_DATA[66]],"Attack":[104,80,[5,4,8,5],SPRITES_DATA[67]],"Cast":[104,80,[10,10],SPRITES_DATA[68]],"Hurt":[104,80,[6,10],SPRITES_DATA[69]]},"vegetto":{"Idle":[72,64,[60],SPRITES_DATA[70]],"Walk":[72,64,[8],SPRITES_DATA[71]],"Attack":[72,64,[5,4,8,5],SPRITES_DATA[72]],"Cast":[72,64,[10,10],SPRITES_DATA[73]],"Hurt":[72,64,[6,10],SPRITES_DATA[74]]},"gogeta":{"Idle":[88,64,[60],SPRITES_DATA[75]],"Walk":[88,64,[8],SPRITES_DATA[76]],"Attack":[88,64,[5,4,8,5],SPRITES_DATA[77]],"Cast":[88,64,[10,10],SPRITES_DATA[78]],"Hurt":[88,64,[6,10],SPRITES_DATA[79]]},"raditz":{"Idle":[64,64,[60],SPRITES_DATA[80]],"Walk":[64,64,[8],SPRITES_DATA[81]],"Attack":[64,64,[5,4,8,5],SPRITES_DATA[82]],"Cast":[64,64,[10,10],SPRITES_DATA[83]],"Hurt":[64,64,[6,10],SPRITES_DATA[84]]},"trunks-ssj":{"Idle":[72,72,[60],SPRITES_DATA[85]],"Walk":[72,72,[8],SPRITES_DATA[86]],"Attack":[72,72,[5,4,8,5],SPRITES_DATA[87]],"Cast":[72,72,[10,10],SPRITES_DATA[88]],"Hurt":[72,72,[6,10],SPRITES_DATA[89]]},"a17":{"Idle":[64,56,[60],SPRITES_DATA[90]],"Walk":[64,56,[8],SPRITES_DATA[91]],"Attack":[64,56,[5,4,8,5],SPRITES_DATA[92]],"Cast":[64,56,[10,10],SPRITES_DATA[93]],"Hurt":[64,56,[6,10],SPRITES_DATA[94]]},"black":{"Idle":[96,64,[60],SPRITES_DATA[95]],"Walk":[96,64,[8],SPRITES_DATA[96]],"Attack":[96,64,[5,4,8,5],SPRITES_DATA[97]],"Cast":[96,64,[10,10],SPRITES_DATA[98]],"Hurt":[96,64,[6,10],SPRITES_DATA[99]]},"krilin":{"Idle":[48,48,[60],SPRITES_DATA[100]],"Walk":[48,48,[8],SPRITES_DATA[101]],"Attack":[48,48,[5,4,8,5],SPRITES_DATA[102]],"Cast":[48,48,[10,10],SPRITES_DATA[103]],"Hurt":[48,48,[6,10],SPRITES_DATA[104]]},"rose":{"Idle":[56,64,[60],SPRITES_DATA[105]],"Walk":[56,64,[8],SPRITES_DATA[106]],"Attack":[56,64,[5,4,8,5],SPRITES_DATA[107]],"Cast":[56,64,[10,10],SPRITES_DATA[108]],"Hurt":[56,64,[6,10],SPRITES_DATA[109]]},"freeza-fp":{"Idle":[88,56,[14,14,14,14],SPRITES_DATA[110]],"Walk":[88,56,[8],SPRITES_DATA[111]],"Attack":[88,56,[5,4,8,5],SPRITES_DATA[112]],"Cast":[88,56,[10,10],SPRITES_DATA[113]],"Hurt":[88,56,[6,10],SPRITES_DATA[114]]},"goku-blue":{"Idle":[80,64,[60],SPRITES_DATA[115]],"Walk":[80,64,[8],SPRITES_DATA[116]],"Attack":[80,64,[5,4,8,5],SPRITES_DATA[117]],"Cast":[80,64,[10,10],SPRITES_DATA[118]],"Hurt":[80,64,[6,10],SPRITES_DATA[119]]},"golden":{"Idle":[80,56,[60],SPRITES_DATA[120]],"Walk":[80,56,[8],SPRITES_DATA[121]],"Attack":[80,56,[5,4,8,5],SPRITES_DATA[122]],"Cast":[80,56,[10,10],SPRITES_DATA[123]],"Hurt":[80,56,[6,10],SPRITES_DATA[124]]},"fatbuu":{"Idle":[104,64,[60],SPRITES_DATA[125]],"Walk":[104,64,[8],SPRITES_DATA[126]],"Attack":[104,64,[5,4,8,5],SPRITES_DATA[127]],"Cast":[104,64,[10,10],SPRITES_DATA[128]],"Hurt":[104,64,[6,10],SPRITES_DATA[129]]},"kidbuu":{"Idle":[72,56,[60],SPRITES_DATA[130]],"Walk":[72,56,[8],SPRITES_DATA[131]],"Attack":[72,56,[5,4,8,5],SPRITES_DATA[132]],"Cast":[72,56,[10,10],SPRITES_DATA[133]],"Hurt":[72,56,[6,10],SPRITES_DATA[134]]},"majinv":{"Idle":[72,64,[60],SPRITES_DATA[135]],"Walk":[72,64,[8],SPRITES_DATA[136]],"Attack":[72,64,[5,4,8,5],SPRITES_DATA[137]],"Cast":[72,64,[10,10],SPRITES_DATA[138]],"Hurt":[72,64,[6,10],SPRITES_DATA[139]]},"cooler":{"Idle":[88,64,[60],SPRITES_DATA[140]],"Walk":[88,64,[8],SPRITES_DATA[141]],"Attack":[88,64,[5,4,8,5],SPRITES_DATA[142]],"Cast":[88,64,[10,10],SPRITES_DATA[143]],"Hurt":[88,64,[6,10],SPRITES_DATA[144]]},"a16":{"Idle":[96,56,[60],SPRITES_DATA[145]],"Walk":[96,56,[8],SPRITES_DATA[146]],"Attack":[96,56,[5,4,8,5],SPRITES_DATA[147]],"Cast":[96,56,[10,10],SPRITES_DATA[148]],"Hurt":[96,56,[6,10],SPRITES_DATA[149]]},"cellimp":{"Idle":[64,64,[60],SPRITES_DATA[150]],"Walk":[64,64,[8],SPRITES_DATA[151]],"Attack":[64,64,[5,4,8,5],SPRITES_DATA[152]],"Cast":[64,64,[10,10],SPRITES_DATA[153]],"Hurt":[64,64,[6,10],SPRITES_DATA[154]]},"gokuui":{"Idle":[64,64,[60],SPRITES_DATA[155]],"Walk":[64,64,[8],SPRITES_DATA[156]],"Attack":[64,64,[5,4,8,5],SPRITES_DATA[157]],"Cast":[64,64,[10,10],SPRITES_DATA[158]],"Hurt":[64,64,[6,10],SPRITES_DATA[159]]},"vegeta-blue":{"Idle":[72,64,[60],SPRITES_DATA[160]],"Walk":[72,64,[8],SPRITES_DATA[161]],"Attack":[72,64,[5,4,8,5],SPRITES_DATA[162]],"Cast":[72,64,[10,10],SPRITES_DATA[163]],"Hurt":[72,64,[6,10],SPRITES_DATA[164]]},"21-gohan-nino":{"Idle":[40,48,[30,6,10,6],SPRITES_DATA[165]],"Walk":[48,48,[5,5,5,5,5,5,5,5],SPRITES_DATA[166]],"Hurt":[48,56,[2,8],SPRITES_DATA[167]],"Cast":[48,48,[10,10],SPRITES_DATA[168]]},"38-trunks-espada":{"Idle":[40,56,[30,6,10,6],SPRITES_DATA[169]],"Walk":[48,56,[5,5,5,5,5,5,5,5],SPRITES_DATA[170]],"Hurt":[48,64,[2,8],SPRITES_DATA[171]],"Cast":[48,56,[10,10],SPRITES_DATA[172]]},"24-vegeta-ultra-ego":{"Idle":[48,64,[30,6,10,6],SPRITES_DATA[173]],"Walk":[48,64,[5,5,5,5,5,5,5,5],SPRITES_DATA[174]],"Hurt":[56,64,[2,8],SPRITES_DATA[175]],"Cast":[48,64,[10,10],SPRITES_DATA[176]]}}};const SCC={};
// v13: one sheet per character from sprites/ and personajes/ (rows Idle,Walk,Attack,Cast,Hurt facing right; mirrored at load)
const SCNEW={"a17-x":[230,38,45,{"Kick":[4,6,8]}],"a18-x":[231,42,37,{"Kick":[4,6,8]}],"a21":[232,46,71,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"a21m":[233,50,71,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"bardock-ssj":[234,54,56,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"bardock-ssj4":[235,50,54,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"bardock-x":[236,42,50,{"Kick":[4,6,8]}],"black-ssj":[237,42,60,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"black-x":[238,48,47,{"Kick":[4,6,8]}],"black2":[239,48,57,{"Idle":[40,10,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"broly-2":[240,50,65,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"broly-3":[241,52,61,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"broly-ssj4":[242,78,82,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"broly-x":[243,78,60,{"Kick":[4,6,8]}],"buu-gohan":[244,56,61,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"buu-thin":[245,56,57,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"caulifla":[246,44,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"cell-perf2":[247,46,57,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"enemy1":[248,52,67,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"enemy2":[249,50,68,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"enemy3":[250,42,68,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"freeza-1":[251,46,54,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"freeza-2":[252,40,60,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"freeza-3":[253,74,78,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"freeza-final2":[254,48,45,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"frost-2":[255,56,47,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"gohan-adult":[256,36,53,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"gohan-kid":[257,50,53,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"gohan-mystic":[258,40,59,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"gohan-poss":[259,48,53,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"gohan-ssj-x":[260,38,48,{"Kick":[4,6,8]}],"gohan-ssj2":[261,38,55,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-blue-x":[262,48,47,{"Kick":[4,6,8]}],"goku-bluek":[263,48,58,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-fake":[264,56,62,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-god":[265,50,57,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-kaioken":[266,52,56,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-ssj1-x":[267,48,53,{"Kick":[4,6,8]}],"goku-ssj2-x":[268,46,52,{"Kick":[4,6,8]}],"goku-ssj3-x":[269,56,52,{"Kick":[4,6,8]}],"goku-ssj4":[270,58,57,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-ssjk":[271,48,58,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-ssjn":[272,36,58,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-uic":[273,50,68,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-whis":[274,50,57,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"goku-x":[275,48,52,{"Kick":[4,6,8]}],"gokuui-x":[276,56,52,{"Kick":[4,6,8]}],"gotenks":[277,42,49,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"hit2":[278,56,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kale":[279,42,50,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kale-ssj":[280,46,53,{"Idle":[40,10,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kefla":[281,64,62,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kingvegeta":[282,38,67,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kuririn2":[283,42,56,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kyabe":[284,42,50,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"kyabe-ssj":[285,42,50,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"majinv-x":[286,38,55,{"Kick":[4,6,8]}],"moro":[287,54,102,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"mtrunks":[288,74,57,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"ozaru":[289,116,114,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"ozaru-gold":[290,84,107,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"piccolo-x":[291,52,47,{"Kick":[4,6,8]}],"raditz-ssj":[292,58,55,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"rose-x":[293,78,50,{"Kick":[4,6,8]}],"roshi":[294,62,80,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"smtrunks":[295,66,69,{"Idle":[40,10,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"toppo":[296,60,58,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"trunks-armor":[297,38,49,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"trunks-ssj-x":[298,48,50,{"Kick":[4,6,8]}],"vegeta-blue-x":[299,44,52,{"Kick":[4,6,8]}],"vegeta-bluefp":[300,48,61,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-buu":[301,50,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-buussj":[302,50,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-god":[303,48,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-grade":[304,52,56,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-saiyan":[305,48,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-ssj-x":[306,44,51,{"Kick":[4,6,8]}],"vegeta-ssj4":[307,46,56,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegeta-x":[308,44,51,{"Kick":[4,6,8]}],"vegetto-x":[309,46,53,{"Kick":[4,6,8]}],"vegito":[310,48,61,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegito-blue":[311,46,58,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"vegito-ssj2":[312,40,61,{"Idle":[40,10,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"whis":[313,38,85,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"zamasu-fused":[314,50,62,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"zamasu-half":[315,58,63,{"Idle":[40,10,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"zeno":[316,56,88,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}]};
for(const k in SCNEW){const [n,fw,fh,du]=SCNEW[k],x=k.endsWith('-x'),o=x?SCPACK.s[k.slice(0,-2)]:(SCPACK.s[k]={});if(o)Object.keys(du).forEach((a,r)=>o[a]=[fw,fh,du[a],SPRITES_DATA[n],r])}
// v15: villains taken from personajes/ (Ginyu, Jeice, Freezer soldiers, Garlic Jr., demons...) and recoloured bodies (Cell Jr., Meca Freezer, Baby Vegeta)
const SCNEW15={"babyvegeta":[317,50,55,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"celljr":[318,33,41,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"demon":[319,60,88,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"demon2":[320,48,66,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"demon3":[321,48,66,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"garlic":[322,36,54,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"garlic_h1":[323,50,74,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"garlic_h2":[324,50,74,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"garlicsuper":[325,58,86,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"ginyu":[326,46,70,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"jeice":[327,42,68,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"makyan":[328,46,66,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"mechafreeza":[329,48,45,{"Idle":[60],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"saiyanw":[330,48,78,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"shenron":[331,48,64,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"soldier1":[332,46,64,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"soldier2":[333,42,54,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"soldier3":[334,40,66,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}],"soldier4":[335,40,54,{"Idle":[40,10],"Walk":[7,7,7,7],"Attack":[4,5,8,5],"Cast":[10,10],"Hurt":[6,10],"Kick":[4,6,8]}]};
for(const k in SCNEW15){const [n,fw,fh,du]=SCNEW15[k],o=SCPACK.s[k]={};Object.keys(du).forEach((a,r)=>o[a]=[fw,fh,du[a],SPRITES_DATA[n],r])}
// v16: power-up frames (aura / light pillar) for transformations and boss entrances, and real effect sprites (beams, ki, explosions)
const SCPOW={"bardock-ssj":[336,144,147,[6]],"black":[337,80,77,[6,6,6]],"black-ssj":[338,88,87,[6,6,6]],"black2":[339,80,77,[6,6,6]],"broly":[340,90,90,[6,6]],"buu-gohan":[341,80,77,[6,6,6]],"cell-perf2":[342,80,77,[6,6]],"frost-2":[343,80,77,[6,6,6]],"gohan-kid":[376,66,80,[6]],"gohan-ssj":[377,80,77,[6,6,6]],"goku-blue":[378,62,72,[6,6,6]],"goku-bluek":[379,72,91,[6,6]],"goku-fake":[380,66,83,[6]],"goku-god":[381,78,77,[6,6]],"goku-kaioken":[382,70,100,[6,6,6]],"goku-ssj1":[383,78,77,[6,6,6]],"goku-ssj2":[384,80,77,[6,6,6]],"goku-ssj3":[385,80,76,[6,6,6]],"goku-ssjk":[386,54,77,[6,6,6]],"goku-ssjn":[387,134,113,[6]],"goku-uic":[388,54,69,[6]],"gokuui":[389,54,69,[6]],"kale":[390,84,122,[6,6,6]],"kale-ssj":[391,72,100,[6,6,6]],"majinv":[392,80,77,[6,6,6]],"raditz-ssj":[393,80,77,[6,6,6]],"smtrunks":[394,84,129,[6,6,6]],"toppo":[395,84,88,[6,6,6]],"trunks-armor":[396,80,78,[6,6,6]],"trunks-ssj":[397,84,129,[6,6,6]],"vegeta-blue":[398,78,86,[6,6,6]],"vegeta-bluefp":[399,98,111,[6,6]],"vegeta-buussj":[400,78,77,[6,6,6]],"vegeta-god":[401,88,87,[6,6,6]],"vegeta-grade":[402,72,101,[6,6,6]],"vegeta":[403,80,78,[6,6,6]],"vegeta-saiyan":[404,80,78,[6,6,6]],"vegeta-ssj":[405,78,77,[6,6,6]],"vegetto":[406,80,77,[6,6,6]],"vegito-blue":[407,78,86,[6,6,6]],"vegito-ssj2":[408,80,77,[6,6,6]],"zamasu-fused":[409,54,73,[6,6]]};
for(const k in SCPOW){const [n,fw,fh,du]=SCPOW[k],o=SCPACK.s[k];if(o)o.Pow=[fw,fh,du,SPRITES_DATA[n],0]}
const FXS={"boom":[344,97,97,3],"galick":[345,209,83,3],"kame":[346,433,108,3],"ki-a17":[347,20,14,1],"ki-bardock":[348,20,16,1],"ki-bardock-ssj":[349,20,16,1],"ki-bardock-ssj4":[350,18,14,1],"ki-buu-gohan":[351,23,10,1],"ki-buu-thin":[352,11,11,1],"ki-frost-2":[353,23,11,1],"ki-gogeta":[354,20,16,1],"ki-gohan-kid":[355,8,15,1],"ki-gohan-mystic":[356,24,10,1],"ki-gohan-ssj":[357,16,12,1],"ki-gohan-ssj2":[358,16,12,1],"ki-goku":[359,20,16,1],"ki-goku-bluek":[360,20,13,1],"ki-goku-ssj1":[361,20,16,1],"ki-goku-ssj2":[362,19,16,1],"ki-goku-ssj3":[363,20,16,1],"ki-goku-ssjk":[364,23,10,1],"ki-goku-uic":[365,23,10,1],"ki-gotenks":[366,20,16,1],"ki-kefla":[367,12,12,1],"ki-piccolo":[368,28,13,1],"ki-raditz-ssj":[369,26,13,1],"ki-vegeta":[370,19,20,1],"ki-vegeta-buu":[371,20,16,1],"ki-vegeta-saiyan":[372,19,20,1],"ki-vegito":[373,23,10,1],"ki-vegito-blue":[374,23,10,1],"ki-vegito-ssj2":[375,23,10,1]},FXI={},FXT={};
for(const k in FXS){const [n,fw,fh,c]=FXS[k],im=new Image();im.onload=()=>{const L=[];for(let i=0;i<c;i++){const cv=mk(fw,fh),g=cv.getContext('2d');if(k==='kame'||k==='galick'){g.translate(fw,0);g.scale(-1,1)}g.drawImage(im,i*fw,0,fw,fh,0,0,fw,fh);L.push(cv)}FXI[k]=L};im.src=SPRITES_DATA[n]}
// recolour an effect sprite to an attack's colours: dark -> outer, mid -> middle, near-white stays white
function fxTint(c,C,key){if(FXT[key])return FXT[key];const n=mk(c.width,c.height),g=n.getContext('2d');g.drawImage(c,0,0);const d=g.getImageData(0,0,n.width,n.height),p=d.data,h=C.map(hex);
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const l=(p[i]*0.3+p[i+1]*0.59+p[i+2]*0.11)/255;if(l>0.86)continue;const q=l>0.62?h[1]:h[0],m=l>0.62?0.9+(l-0.62):0.55+0.7*l;p[i]=Math.min(255,q[0]*m);p[i+1]=Math.min(255,q[1]*m);p[i+2]=Math.min(255,q[2]*m)}
  g.putImageData(d,0,0);return FXT[key]=n}
function heroKi(){const H=SCPACK.h[S.hid];if(H)for(let f=P.form;f>=0;f--)if(H[f]&&FXI['ki-'+H[f]])return FXI['ki-'+H[f]][0];return FXI['ki-goku']?FXI['ki-goku'][0]:null}
// la explosión se dibuja a 1,5 veces su radio y como mucho a 64 (antes a 2,2 y sin tope: la de Broly tapaba media pantalla
// y al propio Broly); el daño no cambia y el anillo fino de explode() sigue marcando todo el alcance
function boomFrames(rad,C){const s=Math.max(12,Math.min(64,Math.round(rad*1.5/4)*4)),warm=fxKind(C[1])==='fire'||fxKind(C[1])==='gold',key='b'+s+(warm?'':C.join());if(FXT[key])return FXT[key];
  return FXT[key]=FXI.boom.map((c,i)=>{const n=mk(s,s),g=n.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(warm?c:fxTint(c,C,'bt'+i+C.join()),0,0,s,s);return n})}
const GALICK_SET=new Set(),KI_REAL=new Set(['kiblast','renzoku','gekiretsu','scatter']);
Object.assign(SCPACK.h,{trunks:{0:'mtrunks',1:'trunks-ssj',2:'smtrunks'},gohan:{0:'gohan-kid',1:'gohan-ssj',2:'gohan-ssj2',3:'gohan-mystic'},krilin:{0:'kuririn2'},
  bardock:{0:'bardock',1:'bardock-ssj',3:'bardock-ssj4'},vegetto:{0:'vegito',1:'vegetto',2:'vegito-ssj2',3:'vegito-blue'},black:{0:'black',1:'black-ssj',2:'rose'},
  gotenks:{0:'gotenks'},kefla:{0:'kefla'},caulifla:{0:'caulifla'},kale:{0:'kale',1:'kale-ssj'},kyabe:{0:'kyabe',1:'kyabe-ssj'},gohanadult:{0:'gohan-adult',1:'gohan-mystic'},
  gokugt:{0:'goku',1:'goku-ssj4'},vegetagt:{0:'vegeta',1:'vegeta-ssj4'},gokusuper:{0:'goku-whis',1:'goku-kaioken',2:'goku-ssjk',3:'goku-god',4:'goku-bluek'},
  vegetasuper:{0:'vegeta-buu',1:'vegeta-buussj',2:'vegeta-god',3:'vegeta-blue',4:'vegeta-bluefp'},trunkscell:{0:'trunks-armor'},roshi:{0:'roshi'}});
SCPACK.h.vegeta[2]='vegeta-grade';SCPACK.h.gokuui[4]='goku-uic';
// hand-picked animations (herramientas/animaciones.json -> animaciones_juego.js) replace the pack of that form
const PORTRAIT={},BUSTO={};
if(window.ANIM_SET)for(const id in ANIM_SET.h)for(const f in ANIM_SET.h[id]){const F=ANIM_SET.h[id][f],k='as-'+id+'-'+f;SCPACK.s[k]={};
  for(const a in F.anims){const A=F.anims[a];SCPACK.s[k][a]=[A.w,A.h,A.du,A.url,0]}(SCPACK.h[id]=SCPACK.h[id]||{})[f]=k;if(F.portrait)(PORTRAIT[id]=PORTRAIT[id]||{})[f]=F.portrait;if(F.busto)BUSTO[id+'/'+f]=1}
// only hand-picked forms stay: missing forms leave the transformation chain, characters with none leave the game
var FUERA=new Set(); // Roshi ya tiene sprites propios (3 nov.); antes se ocultaba aquí
for(const id in HDEF){const D=HDEF[id],A=window.ANIM_SET&&ANIM_SET.h[id];if(D.npc||D.custom)continue;
  if(!A){FUERA.add(id);continue}const keep=Object.keys(A).map(Number).sort((a,b)=>a-b);
  if(keep.length!==D.forms.length||keep.some((f,i)=>f!==i)){for(const k of ['forms','aura','hair','hc','formPal'])if(Array.isArray(D[k]))D[k]=keep.map(f=>D[k][Math.min(f,D[k].length-1)]);
    const H={},R={};const B={};keep.forEach((f,i)=>{H[i]='as-'+id+'-'+f;if(PORTRAIT[id]&&PORTRAIT[id][f])R[i]=PORTRAIT[id][f];if(BUSTO[id+'/'+f])B[id+'/'+i]=1});for(const k in BUSTO)if(k.startsWith(id+'/'))delete BUSTO[k];Object.assign(BUSTO,B);SCPACK.h[id]=H;if(PORTRAIT[id])PORTRAIT[id]=R}}
// big face of a form: that form, else the closest one of the same character
// cara exacta de una forma, sin pedir prestada la de otra (selección de personaje)
function faceExact(id,form=0){const P=PORTRAIT[id];return !BUSTO[id+'/'+form]&&P&&P[form]||null}
function faceOf(id,form=0){const P=PORTRAIT[id];if(!P)return null;if(P[form])return P[form];const k=Object.keys(P).map(Number).sort((a,b)=>Math.abs(a-form)-Math.abs(b-form));return k.length?P[k[0]]:null}
Object.assign(SCPACK.e,{frieza:'freeza-final2',gokuB:'goku-ssjn',vegetaB:'vegeta-buussj',rose:'rose',
  renegA:'enemy1',renegB:'enemy2',renegC:'enemy3',kingvegE:'kingvegeta',raditzssjE:'raditz-ssj',vegsaiE:'vegeta-saiyan',freeza2E:'freeza-2',cellperfE:'cell-perf2',a21E:'a21',
  buuthinE:'buu-thin',gohanpossE:'gohan-poss',frost2E:'frost-2',black2E:'black2',hit2E:'hit2',zamasuhE:'zamasu-half',kalessjE:'kale-ssj',fakegokuE:'goku-fake',
  freeza1B:'freeza-1',freeza2B:'freeza-2',freeza3B:'freeza-3',ozaruB:'ozaru',ozarugB:'ozaru-gold',a21B:'a21',a21mB:'a21m',blackssjB:'black-ssj',zamasufB:'zamasu-fused',
  buuthinB:'buu-thin',buugohanB:'buu-gohan',soldier:'soldier1',soldierE:'soldier3',majin:'makyan',celljr:'celljr',celljrE:'celljr',jeice:'jeice',ginyu:'ginyu',mecha:'mechafreeza',
  frzS2:'soldier2',frzS4:'soldier4',saiyanLow:'saiyanw',garlicH1:'garlic_h1',garlicH2:'garlic_h2',demonS:'demon2',demonS2:'demon3',garlicE:'garlic',demonE:'demon',garlicB:'garlicsuper',babyB:'babyvegeta',shenronB:'shenron',toppoB:'toppo',whisB:'whis',zenoB:'zeno',moroB:'moro',broly2B:'broly-2',broly3B:'broly-3',brolyssj4B:'broly-ssj4',kalessjB:'kale-ssj'});

function scLoad(k){if(SCC[k])return SCC[k];const o=SCC[k]={ok:0};let n=0;
  for(const a in SCPACK.s[k]){const [fw,fh,du,url,row]=SCPACK.s[k][a],im=new Image();
    im.onload=()=>{const cut=r=>{const L=[];for(let i=0;i<(row===undefined?im.width/fw:du.length);i++){const c=mk(fw,fh-4);c.getContext('2d').drawImage(im,i*fw,r*fh,fw,fh-4,0,0,fw,fh-4);L.push(c)}return L};
      const R=cut(row===undefined?0:row);o[a]={R,L:row===undefined?cut(1):R.map(flipC),du,tot:du.reduce((p,q)=>p+q,0)};if(++n===Object.keys(SCPACK.s[k]).length){o.ok=1;for(const id in ET)if(id!=='shadow'&&scKeyE(id)===k)delete SPR[id]}};im.src=url}
  return o}
function scFrame(A,t){let x=(t*60)%A.tot;for(let i=0;i<A.du.length;i++){x-=A.du[i];if(x<0)return i}return 0}
function scHero(id,form){const H=SCPACK.h[id];if(!H)return null;for(let f=form;f>=0;f--)if(H[f]){const o=scLoad(H[f]);return o.ok?o:null}return null}
function scKeyE(id){if(SCPACK.e[id])return SCPACK.e[id];const t=ET[id];if(!t)return null;if(t.alias)return scKeyE(t.alias);
  if(t.hero){const H=SCPACK.h[t.hero[0]];if(H)for(let f=t.hero[1];f>=0;f--)if(H[f])return H[f]}return null}
// enemigos que ya son personajes jugables: usan sus fotogramas elegidos a mano (las tiras viejas de sprites.js
// tenían huecos donde el recorte borró el blanco y andaban con una sola pose)
const ENEMIGO_HEROE={hitB:['hit',0],hitE:['hit',0],hit2E:['hit',0],superbuuB:['buu',2],superbuuE:['buu',2],zamasuB:['zamasu',0],zamasuE:['zamasu',0],
  zamasufB:['zamasu',1],billsB:['bills',0],turles:['turles',0],turlesE:['turles',0],frost:['frost',1],frostE:['frost',1],coolerB:['cooler',0],coolerE:['cooler',0],
  freezaF:['freezer',2],frieza:['freezer',2],frieza100:['freezer',3],golden:['freezer',4],freeza1B:['freezer',0],freeza3B:['freezer',1],
  a16B:['a16',0],a16E:['a16',0],a17e:['a17',0],a18e:['a18',0],janemba:['janemba',0],jiren:['jiren',0],
  cellimpE:['cell',0],cellsemiE:['cell',1],cell:['cell',2],cellperfE:['cell',2],saiba:['saibaman',0],saibaR:['saibaman',0],saibaB:['saibaman',0],saibaX:['saibaman',0],
  raditz:['raditz',0],raditzssjE:['raditz',1],fatbuu:['buu',0],buuthinE:['buu',1],buuthinB:['buu',1],buugohanB:['buu',3],buu:['buu',4],
  gohanpossE:['gohanposeido',0],babyB:['babyvegeta',0],toppoB:['toppo',0],moroB:['moro',0],brolyssj4B:['broly',3],
  vegetaSB:['vegeta',0],vegetaE:['vegeta',0],vegsaiE:['vegeta',0],majinv:['vegeta',3],
  frost2E:['frost',1],black2E:['black',0],blackssjB:['black',1],
  broly2B:['broly',0],broly3B:['broly',1],brolyB:['broly',2],kalessjE:['kale',1],kalessjB:['kale',1],a17B:['a17',0]};
// sesión 9: más variedad de enemigos normales con packs ya revisados (antes solo quedaban saibamen)
Object.assign(ET,{zombi:{n:'Saiyan zombi',hp:26,spd:26,dmg:9,xp:2,r:7},zombiR:{n:'Saiyan zombi furioso',hp:44,spd:46,dmg:12,xp:4,r:7},
  zamasuC:{n:'Clon de Zamasu',hp:30,spd:38,dmg:11,xp:3,r:7,shoot:3.2}});
Object.assign(ENEMIGO_HEROE,{soldier:['e_soldado',0],soldierE:['e_soldado',0],frzS2:['e_soldado',0],frzS4:['e_soldado',0],ginyu:['e_ginyu',0],jeice:['e_jeice',0],celljr:['cell',2],celljrE:['cell',2],majin:['buu',4],zombi:['zombies',0],zombiR:['zombies',1],zamasuC:['zamasu',0]});
// 3 nov.: enemigos retirados que vuelven con animaciones ya revisadas de personajes jugables
Object.assign(ENEMIGO_HEROE,{nappa:['nappa',0],nappaE:['nappa',0],guldo:['guldo',0],a21E:['a21',0],a21B:['a21',0],a21mB:['a21',0],zamasuhE:['zamasufusion',0]});
// 3 nov.: enemigos de hojas de DeviantArt (créditos en CREDITOS_RECURSOS.md), cada uno con el color de su técnica
Object.assign(ENEMIGO_HEROE,{dodoria:['e_dodoria',0],zarbon:['e_zarbon',0],mecha:['e_mecha',0],garlicE:['e_garlic',0],garlicB:['e_garlic',0],kingvegE:['e_kingveg',0]});
if(ET.dodoria)Object.assign(ET.dodoria,{col:'#ff5aa0'}); // embiste y escupe el rayo de la boca
if(ET.zarbon)Object.assign(ET.zarbon,{col:'#7af0e0',col2:'#c8fff6'}); // ráfagas de ki verdes
if(ET.mecha)Object.assign(ET.mecha,{ai:'frieza',col:'#c58af0',col2:'#ff5aa0'}); // rayo mortal y Death Ball
if(ET.garlicE)Object.assign(ET.garlicE,{col:'#5ab0ff'});if(ET.garlicB)Object.assign(ET.garlicB,{col:'#5ab0ff'}); // ki azul de la Zona Muerta
if(ET.kingvegE)Object.assign(ET.kingvegE,{col:'#b48aff'}); // esferas moradas del Rey Vegeta
Object.assign(ENEMIGO_HEROE,{burter:['e_burter',0],whisB:['e_whis',0],a19:['e_a19',0],dabura:['e_dabura',0]});
if(ET.burter)Object.assign(ET.burter,{shoot:1.8,col:'#4a7ad8'}); // el más rápido del universo; Space Mach Attack azul
if(ET.whisB)Object.assign(ET.whisB,{col:'#7ad8ff'}); // ráfagas del bastón
if(ET.a19)Object.assign(ET.a19,{col:'#ff7ad0'}); // rayos de los ojos y absorción de energía
if(ET.dabura)Object.assign(ET.dabura,{col:'#ff5a2a',col2:'#ffb02a'}); // aliento de fuego y saliva de piedra
Object.assign(ENEMIGO_HEROE,{rrsoldier:['e_rrsoldier',0],renegB:['e_fasha',0],ozaruB:['e_ozaru',0]});
if(ET.rrsoldier)Object.assign(ET.rrsoldier,{col:'#ffd23f'}); // balas del fusil
if(ET.renegB)Object.assign(ET.renegB,{n:'FASHA',col:'#ff5ad8'}); // compañera de Bardock, ki rosa
if(ET.ozaruB)Object.assign(ET.ozaruB,{n:'OZARU VEGETA',col:'#ff9a3a'}); // rayo por la boca
for(const k of ['redribbon','musculo','capsule'])if(MAPS[k])MAPS[k].pool.push([0,'rrsoldier',6],[200,'rrsoldier',6]);
Object.assign(ENEMIGO_HEROE,{freeza2E:['e_freeza2',0],freeza2B:['e_freeza2',0],demonS:['e_puipui',0],demonS2:['e_yamu',0]});
for(const id of ['freeza2E','freeza2B'])if(ET[id])Object.assign(ET[id],{col:'#ff5aa0',col2:'#ff9ad0'}); // rayos rosas y Death Ball
if(ET.demonS)Object.assign(ET.demonS,{n:'PUI PUI',col:'#5af0c8'}); // guerrero de Babidi, ki turquesa
if(ET.demonS2)Object.assign(ET.demonS2,{n:'YAMU',col:'#b06aff'}); // esbirro de Babidi, ki morado
Object.assign(ENEMIGO_HEROE,{geroE:['e_gero',0]});
// 3 nov.: plan «sprites para casa» (tanda 3)
Object.assign(ENEMIGO_HEROE,{appuleE:['e_appule',0],cuiE:['cui',0],blueE:['e_blue',0],murasakiE:['e_murasaki',0],reycoldB:['reycold',0]});
Object.assign(ET.appuleE,{col:'#5aa0ff'});Object.assign(ET.cuiE,{col:'#b06aff'});Object.assign(ET.murasakiE,{col:'#d0d0e0'});Object.assign(ET.reycoldB,{col:'#ff5aa0',col2:'#ffd23f'});
for(const k of ['namek','freezer','yardrat','vegetasei'])if(MAPS[k])MAPS[k].pool.push([150,'appuleE',2],[300,'cuiE',2]);
for(const k of ['redribbon','musculo','capsule'])if(MAPS[k])MAPS[k].pool.push([120,'murasakiE',2],[280,'blueE',2]);
Object.assign(ENEMIGO_HEROE,{slugB:['slug',0],zangyaE:['e_zangya',0],bujinE:['e_bujin',0]});
Object.assign(ET.slugB,{col:'#ffd23f'});Object.assign(ET.zangyaE,{col:'#7af04a'});Object.assign(ET.bujinE,{col:'#7af04a'});
for(const k of ['pradera','desierto','bosque','lookout'])if(MAPS[k])MAPS[k].pool.push([180,'zangyaE',2],[260,'bujinE',2]);
Object.assign(ENEMIGO_HEROE,{myuuB:['e_myuu',0],super17B:['super17',0],omegaB:['omega',0]});
Object.assign(ET.myuuB,{col:'#7af04a'});Object.assign(ENEMIGO_HEROE,{gasB:['gas',0]});Object.assign(ET.gasB,{col:'#ff6aff'});Object.assign(ET.super17B,{col:'#ffd23f'});Object.assign(ET.omegaB,{col:'#ff5aa0',col2:'#ffb040'});if(ET.geroE)ET.geroE.col='#ff5a8a'; // Androide 20: rayo de los ojos
if(ET.majin)ET.majin.n='Fragmento de Buu';for(const [id,z] of [['celljr',0.45],['celljrE',0.47]])if(ET[id])ET[id].z=z;
for(const k in MAPS){const M=MAPS[k],saga=WSAGA[k]||'tierra';M.pool.push([90,'zombi',3],[300,'zombiR',2]);
  if(saga==='super'||k==='futuro')M.pool.push([60,'zamasuC',4],[360,'zamasuC',3]);
  if(saga==='tierra'&&!M.pool.some(p=>p[1]==='celljr'))M.pool.push([150,'celljr',3]);
  if(saga==='buu'&&!M.pool.some(p=>p[1]==='majin'))M.pool.push([30,'majin',5])}
for(const id in ENEMIGO_HEROE){const [h,f]=ENEMIGO_HEROE[id];if(ET[id]&&SCPACK.h[h]&&SCPACK.h[h][f]){ET[id].hero=[h,f];delete SCPACK.e[id]}}
// También los jefes que ya declaraban hero deben saltarse la tira antigua.
for(const id in ET){const h=ET[id].hero;if(h&&window.ANIM_SET&&ANIM_SET.h[h[0]]&&ANIM_SET.h[h[0]][h[1]])delete SCPACK.e[id]}
const FUERA_ENEMIGOS={};
(function depurarEnemigos(){
  for(const id in ET){if(id==='crate'||id==='shadow')continue;
    const k=scKeyE(id);if(!k||!k.startsWith('as-'))FUERA_ENEMIGOS[id]=ET[id].n}
  for(const id in FUERA_ENEMIGOS){delete ET[id];delete SCPACK.e[id];delete SPR[id]}
  // Kale tiene aquí el pack SSJ, no una forma berserker distinta.
  for(const id of ['kalessjE','kalessjB'])if(ET[id])ET[id].n='KALE SUPER SAIYAN';
  const refuerzos={freezer:['raditz','turles','coolerB','frieza','golden'],tierra:['raditz','turles','a16B','cell','frieza'],
    buu:['janemba','majinv','fatbuu','superbuuB','buu'],super:['hitB','zamasuB','toppoB','billsB','jiren']};
  for(const k in MAPS){const M=MAPS[k],saga=WSAGA[k]||'tierra';
    M.pool=M.pool.filter(p=>ET[p[1]]);
    if(!M.pool.some(p=>p[0]===0))M.pool.unshift([0,'saiba',10]);
    M.ring=(M.ring||[]).filter(id=>ET[id]);if(!M.ring.length)M.ring=['saiba','saiba'];if(M.ring.length===1)M.ring.push(M.ring[0]);
    if(M.squad){M.squad[1]=M.squad[1].filter(id=>ET[id]);if(!M.squad[1].length)delete M.squad}
    // Se conservan cinco encuentros y la escala de dificultad por posición.
    // Los suplentes salen con su nombre y su sprite, sin hacerse pasar por otro.
    const usados=new Set(M.bosses.filter(id=>ET[id]));
    M.bosses=M.bosses.map(id=>{if(ET[id])return id;const nuevo=refuerzos[saga].find(t=>!usados.has(t))||refuerzos[saga][0];usados.add(nuevo);return nuevo});
  }
  for(const saga in WAVES){WAVES[saga]=WAVES[saga].filter(w=>ET[w[0]]);if(!WAVES[saga].length)WAVES[saga]=[['saiba',14]]}
})();
const SCTINT={frzS2:'hue-rotate(95deg) saturate(1.2)',frzS4:'hue-rotate(200deg)',soldierE:'hue-rotate(300deg) saturate(1.3)',celljr:'hue-rotate(150deg) saturate(1.15)',celljrE:'hue-rotate(150deg) saturate(1.3)',saibaR:'hue-rotate(-70deg) saturate(1.6)',saibaB:'hue-rotate(140deg) saturate(1.2)',saibaX:'hue-rotate(200deg) brightness(1.1)'},SCTC={};
function scTintPk(o,f){const r={ok:1};for(const a in o){if(a==='ok')continue;const A=o[a],tc=c=>{const n=mk(c.width,c.height),g=n.getContext('2d');g.filter=f;g.drawImage(c,0,0);return n};r[a]={...A,R:A.R.map(tc),L:A.L.map(tc)}}return r}
function scEnemy(id){const k=scKeyE(id);if(!k)return null;const o0=scLoad(k);if(!o0.ok)return null;const o=SCTINT[id]?(SCTC[id]||(SCTC[id]=scTintPk(o0,SCTINT[id]))):o0;
  const an=o.Walk&&o.Walk.R.length>1?'Walk':'Idle',W=o[an],wh=W.R.map(c=>tintC(c,'#ffffff')),whf=W.L.map(c=>tintC(c,'#ffffff')),src=SCPACK.s[k][an];
  const hf=0.5;return{pk:o,fr:W.R,fl:W.L,wh,whf,w:Math.round(src[0]*0.6*hf),h:Math.round((W.R[0].height-6)*hf),big:1,half:hf}}
// carga perezosa: al arrancar no se decodifica nada; cada partida carga solo su héroe y los enemigos de su mapa
// (antes se decodificaban todas las tiras de golpe y en PCs modestos el menú tardaba y se comía la memoria)
function precarga(hid,mk){const H=SCPACK.h[hid];if(H)for(const f in H)scLoad(H[f]);const M=MAPS[mk];if(!M)return;
  const ids=new Set([...M.pool.map(p=>p[1]),...M.bosses,...(M.ring||[]),...(M.squad?M.squad[1]:[])]);
  for(const w in WAVES)WAVES[w].forEach(x=>ids.add(x[0]));for(const id of ids){const k=scKeyE(id);if(k&&SCPACK.s[k])scLoad(k)}}
function myHero(id,form){if(id==='gokuui' && DBZ_GOKU.c)return DBZ_GOKU;for(let f=form;f>=0;f--){const o=MYC['h:'+id+':'+f];if(o&&o.c){if(!o.walk){o.walk=autoWalk(o.c);o.walkF=o.walk.map(flipC)}return o}}return null}
// a single still PNG gets a 4-frame walk: the bottom of the sprite is split in two legs that lift in turn
function autoWalk(c){const W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data;let x0=W,x1=0,y0=H,y1=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<=x0)return[c];const lh=Math.max(3,Math.round((y1-y0+1)*0.22)),ly=y1+1-lh,mid=(x0+x1+1)>>1,lift=Math.max(1,Math.round(lh/5));
  const fr=(side)=>{const o=mk(W,H),g=o.getContext('2d');g.drawImage(c,0,0,W,ly,0,1,W,ly);
    const lx=side<0?0:mid,lw=side<0?mid:W-mid,rx=side<0?mid:0,rw=side<0?W-mid:mid;
    g.drawImage(c,rx,ly,rw,lh-1,rx,ly+1,rw,lh-1);g.drawImage(c,lx,ly,lw,lh,lx,ly+1-lift,lw,lh);return o};
  return[c,fr(-1),c,fr(1)]}
function myEnemy(id){const o=MYC['e:'+id];if(!o||!o.c)return null;
  const k=Math.max(1,Math.ceil(o.c.height/(ET[id]&&ET[id].boss?64:30)));const c=k>1?(()=>{const n=mk(Math.round(o.c.width/k),Math.round(o.c.height/k)),g=n.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(o.c,0,0,n.width,n.height);return n})():o.c;
  const fl=flipC(c),wh=tintC(c,'#ffffff');return{fr:[c,c,c,c],fl:[fl,fl,fl,fl],wh:[wh,wh,wh,wh],whf:[flipC(wh),flipC(wh),flipC(wh),flipC(wh)],w:c.width,h:c.height,big:1,mine:1}}
// split a sheet into separate sprites: key out the background, then group nearby opaque pixels
function splitSheet(img){
  let W=img.width,H=img.height;const k=Math.max(1,Math.ceil(Math.max(W,H)/1400));W=Math.round(W/k);H=Math.round(H/k);
  const c=mk(W,H),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,0,0,W,H);
  const id=g.getImageData(0,0,W,H),d=id.data;
  const corner=[0,(W-1)*4,(H-1)*W*4,((H-1)*W+W-1)*4].map(i=>[d[i],d[i+1],d[i+2],d[i+3]]);
  const bg=corner[0];if(bg[3]>200){const tol=70,near=i=>d[i+3]&&Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])<tol;
    // flood the background in from the edges so white or light areas inside a sprite survive
    const seen=new Uint8Array(W*H),st=[];for(let x=0;x<W;x++){st.push(x,(H-1)*W+x)}for(let y=0;y<H;y++){st.push(y*W,y*W+W-1)}
    while(st.length){const j=st.pop();if(seen[j])continue;seen[j]=1;if(!near(j*4))continue;d[j*4+3]=0;const x=j%W,y=(j/W)|0;
      if(x>0)st.push(j-1);if(x<W-1)st.push(j+1);if(y>0)st.push(j-W);if(y<H-1)st.push(j+W)}}
  for(let i=3;i<d.length;i+=4)if(d[i]<40)d[i]=0;
  g.putImageData(id,0,0);
  const lab=new Int32Array(W*H),boxes=[];let n=0;const R=2;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(lab[i]||!d[i*4+3])continue;n++;const st=[i];lab[i]=n;let x0=x,x1=x,y0=y,y1=y,cnt=0;
    while(st.length){const j=st.pop(),jx=j%W,jy=(j/W)|0;cnt++;if(jx<x0)x0=jx;if(jx>x1)x1=jx;if(jy<y0)y0=jy;if(jy>y1)y1=jy;
      for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){const nx=jx+dx,ny=jy+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const q=ny*W+nx;if(!lab[q]&&d[q*4+3]){lab[q]=n;st.push(q)}}}
    if(cnt>60)boxes.push({x0,y0,x1,y1})}
  boxes.sort((a,b)=>(Math.round(a.y0/20)-Math.round(b.y0/20))||a.x0-b.x0);
  return boxes.slice(0,120).map(b=>{const w=b.x1-b.x0+1,h=b.y1-b.y0+1,o=mk(w,h);o.getContext('2d').drawImage(c,b.x0,b.y0,w,h,0,0,w,h);return o})}
function mineWhoList(){const L=[];for(const id in HEROES)if(!HEROES[id].npc)L.push(['h:'+id,HEROES[id].name]);for(const id in ET)L.push(['e:'+id,(ET[id].boss?'Jefe: ':'Enemigo: ')+ET[id].n]);return L}
function openMine(){state='mine';hideMenus();$('#mine').hidden=false;
  const who=$('#mWho');if(!who.options.length){for(const [v,t] of mineWhoList()){const o=document.createElement('option');o.value=v;o.textContent=t;who.appendChild(o)}}
  refreshMineForm();renderMineCurrent()}
function refreshMineForm(){const v=$('#mWho').value,sel=$('#mForm');sel.innerHTML='';
  if(v.startsWith('h:')){HEROES[v.slice(2)].forms.forEach((n,i)=>{const o=document.createElement('option');o.value=i;o.textContent=n;sel.appendChild(o)});sel.disabled=false}
  else{const o=document.createElement('option');o.value=0;o.textContent='-';sel.appendChild(o);sel.disabled=true}}
function renderMineCurrent(){const box=$('#mCurrent');box.innerHTML='';
  const add=(label,url,del)=>{const b=document.createElement('button');b.type='button';b.title='Quitar';const im=new Image();im.src=url;b.appendChild(im);b.insertAdjacentHTML('beforeend',`<span>${label} ✕</span>`);b.onclick=()=>{del();saveMine();loadMine();renderMineCurrent()};box.appendChild(b)};
  for(const h in MY.heroes)for(const f in MY.heroes[h])add(HEROES[h]?HEROES[h].name+' · '+HEROES[h].forms[f]:h,MY.heroes[h][f],()=>{delete MY.heroes[h][f]});
  for(const e in MY.enemies)add(ET[e]?ET[e].n:e,MY.enemies[e],()=>{delete MY.enemies[e];delete SPR[e]});
  $('#mInfo').textContent=box.children.length?'Sprites en uso (toca uno para quitarlo):':''}
$('#mWho').onchange=refreshMineForm;
$('#mFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f),im=new Image();
  im.onload=()=>{const parts=splitSheet(im),box=$('#mPicks');box.innerHTML='';
    $('#mInfo').textContent=parts.length?`He encontrado ${parts.length} sprites. Toca el que quieres usar.`:'No he encontrado sprites. Prueba con un PNG de fondo transparente o liso.';
    parts.forEach(c=>{const b=document.createElement('button');b.type='button';b.appendChild(c);b.onclick=()=>{
      const v=$('#mWho').value,url=c.toDataURL('image/png');
      if(v.startsWith('h:')){const h=v.slice(2);(MY.heroes[h]=MY.heroes[h]||{})[$('#mForm').value]=url}else{MY.enemies[v.slice(2)]=url;delete SPR[v.slice(2)]}
      if(!saveMine())$('#mInfo').textContent='No se ha podido guardar: el navegador no deja más espacio.';
      loadMine();renderMineCurrent();b.style.borderColor='var(--ki)'};box.appendChild(b)});URL.revokeObjectURL(url)};
  im.src=url;e.target.value=''};
$('#mClear').onclick=()=>{MY.heroes={};MY.enemies={};for(const id in ET)delete SPR[id];saveMine();loadMine();renderMineCurrent()};
$('#mBack').onclick=()=>{$('#mine').hidden=true;showTitle()};
loadMine();
// Built-in character art. The original game and browser saves remain intact.
const DBZ_GOKU={c:null};
const dbzGokuImage=new Image();
dbzGokuImage.onload=()=>{const c=mk(43,64),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(dbzGokuImage,0,0,43,64);DBZ_GOKU.c=c;DBZ_GOKU.f=flipC(c);DBZ_GOKU.w=tintC(c,'#ffffff');DBZ_GOKU.wf=flipC(DBZ_GOKU.w);DBZ_GOKU.walk=autoWalk(c);DBZ_GOKU.walkF=DBZ_GOKU.walk.map(flipC)};
dbzGokuImage.src=SPRITES_DATA[177];
// Four authored frames for the front-facing Goku UI run.
const GOKU_FRAMES=[];const gokuRunSheet=new Image();
gokuRunSheet.onload=()=>{const cell=gokuRunSheet.naturalWidth/4;for(let i=0;i<4;i++){const c=mk(43,64),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(gokuRunSheet,i*cell,0,cell,gokuRunSheet.naturalHeight,0,0,43,64);GOKU_FRAMES.push(c)}};
gokuRunSheet.src=SPRITES_DATA[178];
const GOKU_BACK=[];const gokuBackSheet=new Image();gokuBackSheet.onload=()=>{const cell=gokuBackSheet.naturalWidth/4;for(let i=0;i<4;i++){const c=mk(43,64),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(gokuBackSheet,i*cell,0,cell,gokuBackSheet.naturalHeight,0,0,43,64);GOKU_BACK.push(c)}};gokuBackSheet.src=SPRITES_DATA[179];
// ---------- flow ----------
let last=performance.now(),demoT=0;
function loop(now){
  const dt=Math.min(1/30,(now-last)/1000);last=now;
  try{
  if(state==='play')update(dt);
  if(state==='dying'){P.dead+=dt;cam.shake=Math.max(cam.shake||0,P.dead<0.3?3:0);if(P.dead>1.8){P.dead=0;endGame(false)}}
  if(state==='title'||state==='maps'||state==='mine'||state==='gacha'||state==='credits'||state==='train'||state==='forge'){demoT+=dt||0;if(!isFinite(demoT))demoT=0;MAPK=Object.keys(WORLD)[Math.floor(demoT/12)%Object.keys(WORLD).length];cam.x=Math.sin(demoT*0.05)*400+demoT*12;cam.y=Math.cos(demoT*0.04)*300;ctx.fillStyle='#000';ctx.fillRect(0,0,VW,VH);drawWorld(now/1000);drawTitleDemo(now/1000)}
  else if(S)render(now/1000);
  actualizarRadarAnimado();present()}catch(err){console.error(err)}
  requestAnimationFrame(loop)}
const demo=[];
function drawTitleDemo(time){
  if(!demo.length){const ids=Object.keys(SCPACK.h).filter(k=>HEROES[k]);for(let i=0;i<11&&ids.length;i++){const id=ids[(Math.random()*ids.length)|0],f=Object.keys(SCPACK.h[id]);demo.push({id,form:+f[(Math.random()*f.length)|0],x:rnd(VW),y:rnd(VH),vx:rnd(-14,14),vy:rnd(-6,6),k:Math.random()})}}
  demo.sort((a,b)=>a.y-b.y);
  for(const d of demo){d.x+=d.vx/60;d.y+=d.vy/60;if(d.x<-30)d.x=VW+30;if(d.x>VW+30)d.x=-30;if(d.y<10)d.y=VH+30;if(d.y>VH+40)d.y=10;
    const A=heroAnim(d.id,d.form,'Walk');if(!A)continue;const fr=(d.vx<0?A.L:A.R)[scFrame(A,time+d.k*3)];shadow(d.x,d.y,fr.width*0.6);ctx.drawImage(fr,Math.round(d.x-fr.width/2),Math.round(d.y-fr.height))}}
let pickedHero='goku';
function drawDiffs(){const box=$('#diffs'),top=DIFF.length;box.innerHTML='';
  DIFF.forEach((D,i)=>{const b=document.createElement('button');b.type='button';b.className='btn '+(i===pickedDiff?'':'alt');b.textContent=i>top?'???':D.n;b.disabled=i>top;if(i>top)b.style.opacity=.45;
    b.onclick=()=>{pickedDiff=i;drawDiffs()};box.appendChild(b)});const D=DIFF[pickedDiff];
  $('#diffInfo').innerHTML=`Enemigos x${D.hp} de vida · Premios <b style="color:${D.c}">x${D.rw}</b>. Derrota 2 jefes en un escenario para abrir el siguiente.`;
  $('#mapCards').querySelectorAll('button').forEach(b=>{const id=b.dataset.map,c=mapClear(id),ok=mapOpen(id);b.classList.toggle('locked',!ok);
    b.querySelector('.clr').textContent=c>=0?'Superado: '+DIFF[c].n:ok?'Sin superar':mapLockMsg(id);b.title=ok?'':mapLockMsg(id)})}
function chooseMap(hid){initAudio();pickedHero=hid;hideMenus();$('#maps').hidden=false;buildMapCards();drawDiffs();setTimeout(()=>{const b=$('#mapCards button');b&&b.focus()},20)}
let mapCardsBuilt=false;
function buildMapCards(){if(mapCardsBuilt)return;mapCardsBuilt=true;const box=$('#mapCards'),keep=MAPK,cx=cam.x,cy=cam.y;
  for(const id in MAPS){const M=MAPS[id],b=document.createElement('button');b.type='button';b.className='card';
    // portada del escenario (sprites/06_Escenarios, generada con herramientas/montar_portadas.py)
    if(window.MAP_COVER&&MAP_COVER[id]){const im=new Image();im.className='map';im.alt='';im.src=MAP_COVER[id];b.appendChild(im)}else{
    const c=mk(88,55);c.className='map';MAPK=id;cam.x=-44+(id==='arena'?-140:0);cam.y=-28+(id==='arena'?-150:id==='time'?-60:0);if(id==='futuro'){cam.x=-130;cam.y=-60}if(id==='vegetasei'){cam.x=-120;cam.y=-120}if(M.cam){cam.x=M.cam[0];cam.y=M.cam[1]}drawWorld(0);c.getContext('2d').drawImage(view,0,0,88,55,0,0,88,55);
    b.appendChild(c)}b.insertAdjacentHTML('beforeend',`<h3>${M.name}</h3><p>${M.sub}</p><span class="bosses">${M.bosses.map(x=>ET[x].n).join(' · ')}</span>`);
    b.dataset.map=id;b.insertAdjacentHTML('beforeend','<span class="stats clr"></span>');
    b.onclick=()=>{if(!mapOpen(id)){$('#diffInfo').textContent=mapLockMsg(id);return}if(false){$('#diffInfo').textContent=`Para jugar ${M.name} en ${DIFF[pickedDiff].n} primero gánalo en ${DIFF[pickedDiff-1].n}.`;return}$('#maps').hidden=true;startGame(pickedHero,id)};box.appendChild(b)}
  MAPK=keep;cam.x=cx;cam.y=cy}
function startGame(hid,map){initAudio();newGame(hid,map);state='play';hideMenus();$('#maps').hidden=true;$('#end').hidden=true;$('#hudBtns').hidden=false;last=performance.now()}
function pauseGame(){state='pause';$('#pause').hidden=false;
  $('#pauseMoves').innerHTML=P.order.map(id=>`<span>${P.moves[id].evo?MV[id].evo:MV[id].name} · NV ${P.moves[id].lv}</span>`).join('')+Object.keys(P.cards).map(id=>`<span>${CARDS[id].name} · ${P.cards[id]}</span>`).join('');
  setTimeout(()=>$('#bResume').focus(),20)}
function resume(){state='play';$('#pause').hidden=true;last=performance.now()}
// ---------- save (tickets, zeni, owned heroes, pity, records) ----------
let SAVE=null;
function loadSave(){if(SAVE)return SAVE;let d={};try{d=JSON.parse(localStorage.getItem('animesurvivor-save')||'{}')}catch(e){}
  SAVE={tickets:d.tickets??10,zeni:d.zeni||0,pity:d.pity||0,pulls:d.pulls||0,owned:d.owned||{goku:1,vegeta:1,piccolo:1},best:d.best||{},up:d.up||{},mis:d.mis||{},st:d.st||{},mast:d.mast||{},daily:d.daily||'',streak:d.streak||0,clear:d.clear||{},bes:d.bes||{},mprog:d.mprog||{},lockv:d.lockv||0};return SAVE}
function writeSave(){try{localStorage.setItem('animesurvivor-save',JSON.stringify(SAVE))}catch(e){}}
function loadBest(){return loadSave().best}
function saveBest(b){loadSave().best=b;writeSave()}
// difficulty tiers: win a map to unlock the next tier there; harder tiers pay more
const DIFF=[{n:'NORMAL',hp:1,dmg:1,sp:1,rw:1,c:'#6ac83a'},{n:'DIFICIL',hp:1.8,dmg:1.35,sp:1.15,rw:1.6,c:'#ffd23f'},{n:'PESADILLA',hp:3,dmg:1.8,sp:1.3,rw:2.4,c:'#ff8a2a'},
  {n:'INFIERNO',hp:5,dmg:2.4,sp:1.45,rw:3.5,c:'#e0244a'},{n:'ULTRA INSTINTO',hp:8,dmg:3.2,sp:1.6,rw:5,c:'#c8d8ff'}];
let pickedDiff=0;
function mapClear(id){const c=loadSave().clear[id];return c===undefined?-1:c}
// ---------- meta progression: training room, missions, mastery, daily gift ----------
const UPG=[
 {id:'power',name:'Fuerza',ds:'+4% de daño',max:50,cost:60,g:1.18},
 {id:'hp',name:'Resistencia',ds:'+6 de vida máxima',max:50,cost:50,g:1.17},
 {id:'armor',name:'Armadura Saiyan',ds:'+0.4 de armadura',max:15,cost:120,g:1.3},
 {id:'speed',name:'Velocidad',ds:'+2% de velocidad',max:15,cost:80,g:1.25},
 {id:'cd',name:'Concentración',ds:'-2% de recarga',max:15,cost:120,g:1.28},
 {id:'magnet',name:'Radar del Dragón',ds:'+8% de radio de recogida',max:15,cost:60,g:1.22},
 {id:'regen',name:'Meditación',ds:'+0.1 vida por segundo',max:20,cost:90,g:1.24},
 {id:'xp',name:'Sabiduría Kaio',ds:'+4% de experiencia',max:25,cost:100,g:1.22},
 {id:'greed',name:'Codicia de Bulma',ds:'+8% de zeni',max:25,cost:80,g:1.2},
 {id:'tick',name:'Bolas de Dragón',ds:'+1 ticket al acabar cada partida',max:10,cost:400,g:1.45},
 {id:'revive',name:'Semilla Senzu extra',ds:'Revives una vez por partida',max:2,cost:2500,g:3}];
const upCost=(u,lv)=>Math.floor(u.cost*Math.pow(u.g,lv));
function upLv(id){return(loadSave().up[id]||0)}
function metaBonus(){const L=upLv;return{dmg:1+0.04*L('power'),hp:6*L('hp'),armor:0.4*L('armor'),spd:1+0.02*L('speed'),cd:Math.pow(0.98,L('cd')),
  mag:1+0.08*L('magnet'),regen:0.1*L('regen'),xp:1+0.04*L('xp'),greed:1+0.08*L('greed'),tick:L('tick'),revive:L('revive')}}
// mastery: every hero ranks up by playing (kills + seconds survived); +1% damage per rank
const mastXP=r=>Math.floor(120*r*r+200*r);
function mastRank(id){const x=loadSave().mast[id]||0;let r=0;while(r<30&&x>=mastXP(r+1))r++;return r}
// missions: counters live in SAVE.st, every mission has escalating tiers that pay tickets
const MIS=[
 {id:'kills',name:'Elimina enemigos',tiers:[100,500,2000,5000,15000,40000,100000],rw:[2,3,5,8,12,18,25]},
 {id:'saiba',name:'Elimina Saibaman',tiers:[50,300,1000,4000,12000],rw:[2,3,5,8,12]},
 {id:'boss',name:'Derrota jefes',tiers:[1,5,15,40,100,250],rw:[3,4,6,10,15,25]},
 {id:'wins',name:'Sobrevive 15 minutos',tiers:[1,3,10,25,60],rw:[5,8,12,20,30]},
 {id:'runs',name:'Juega partidas',tiers:[3,10,30,80,200],rw:[2,3,5,8,12]},
 {id:'mins',name:'Minutos de combate',tiers:[30,120,400,1000,3000],rw:[3,5,8,12,20]},
 {id:'forms',name:'Transfórmate',tiers:[5,30,100,300],rw:[2,4,6,10]},
 {id:'evo',name:'Evoluciona técnicas',tiers:[1,10,40,120],rw:[3,5,8,12]},
 {id:'heroes',name:'Colecciona guerreros',tiers:[5,8,11,13],rw:[5,8,12,20]},
 {id:'pulls',name:'Tiradas de gachapón',tiers:[10,50,150,400],rw:[2,4,6,10]},
 {id:'cellG',name:'Gana los Juegos de Cell',tiers:[1,5,20],rw:[8,12,20]},
 {id:'namekW',name:'Salva Namek',tiers:[1,5,20],rw:[8,12,20]},
 {id:'bes',name:'Completa el bestiario',tiers:[8,16,24,32],rw:[5,8,12,25]},
 {id:'elite',name:'Derrota guerreros de élite',tiers:[3,15,50,150,400],rw:[4,6,10,15,25]},
 {id:'inf',name:'Minutos extra en modo infinito',tiers:[2,5,10,20,40],rw:[5,8,12,20,35]},
 {id:'wish',name:'Invoca a Shenlong',tiers:[1,5,20,60],rw:[6,10,15,25]},
 {id:'hard',name:'Gana en Pesadilla o más',tiers:[1,3,10,30],rw:[15,20,30,50]}];
function misVal(m){const s=loadSave();if(m.id==='bes')return Object.keys(s.bes||{}).filter(k=>ET[k]).length;if(m.id==='heroes')return Object.keys(s.owned).length;if(m.id==='pulls')return s.pulls;if(m.id==='mins')return Math.floor((s.st.secs||0)/60);return s.st[m.id]||0}
function misReady(){return MIS.filter(m=>{const k=loadSave().mis[m.id]||0;return k<m.tiers.length&&misVal(m)>=m.tiers[k]}).length}
function stat(k,v=1){const s=loadSave();s.st[k]=(s.st[k]||0)+v}
function dailyGift(){const s=loadSave(),d=new Date().toISOString().slice(0,10);if(s.daily===d)return 0;
  const y=new Date(Date.now()-864e5).toISOString().slice(0,10);s.streak=s.daily===y?Math.min(7,(s.streak||0)+1):1;s.daily=d;
  const n=2+s.streak;s.tickets+=n;writeSave();return n}
function openTrain(){state='train';hideMenus();$('#train').hidden=false;drawTrain()}
function drawTrain(){const s=loadSave();$('#tInfo').innerHTML=`Zeni <b>${s.zeni}</b> · Tickets <b>${s.tickets}</b>`;
  const box=$('#tList');box.innerHTML='';
  UPG.forEach(u=>{const lv=s.up[u.id]||0,max=lv>=u.max,c=upCost(u,lv),b=document.createElement('button');b.type='button';b.className='up train';
    b.disabled=max||s.zeni<c;
    b.innerHTML=`<span class="nm">${u.name} <i>${lv}/${u.max}</i></span><span class="ds">${u.ds}</span><span class="pr">${max?'MÁXIMO':'Z '+c}</span><span class="bar"><b style="width:${lv/u.max*100}%"></b></span>`;
    b.onclick=()=>{if(s.zeni<c||max)return;s.zeni-=c;s.up[u.id]=lv+1;writeSave();sfx('level');drawTrain()};box.appendChild(b)});
  const mb=$('#tMis');mb.innerHTML='';
  MIS.forEach(m=>{const k=s.mis[m.id]||0,done=k>=m.tiers.length,v=misVal(m),goal=done?m.tiers[m.tiers.length-1]:m.tiers[k],ok=!done&&v>=goal;
    const d=document.createElement('div');d.className='mis'+(ok?' ok':'')+(done?' done':'');
    d.innerHTML=`<span class="nm">${m.name} <i>${'★'.repeat(k)}${'☆'.repeat(m.tiers.length-k)}</i></span><span class="ds">${Math.min(v,goal)} / ${goal}</span><span class="bar"><b style="width:${Math.min(1,v/goal)*100}%"></b></span>`;
    if(ok){const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=`+${m.rw[k]} TICKETS`;b.onclick=()=>{s.mis[m.id]=k+1;s.tickets+=m.rw[k];writeSave();sfx('trans');drawTrain()};d.appendChild(b)}
    else d.insertAdjacentHTML('beforeend',`<span class="pr">${done?'COMPLETA':'+'+m.rw[k]+' tickets'}</span>`);
    mb.appendChild(d)});
  {const box=$('#tBes'),bes=s.bes||{},ids=Object.keys(ET).filter(id=>!['shadow','crate'].includes(id));box.innerHTML='';let got=0;
    ids.forEach(id=>{const n=bes[id]||0;if(n)got++;const d=document.createElement('div');d.className=n?'':'no';const c=mk(36,48),g=c.getContext('2d');
      try{const sp=enemySprite(id),im=sp.fr[0],k=Math.min(1,36/im.width,48/im.height);g.imageSmoothingEnabled=false;g.drawImage(im,(36-im.width*k)/2,48-im.height*k,im.width*k,im.height*k)}catch(e){}
      d.appendChild(c);d.insertAdjacentHTML('beforeend',n?`<span>${ET[id].n}</span><span>${n}</span>`:'<span>???</span>');box.appendChild(d)});
    $('#tBesInfo').textContent=`Has derrotado ${got} de ${ids.length} tipos de enemigo.`}
  const hb=$('#tMast');hb.innerHTML=Object.keys(HDEF).filter(id=>s.owned[id]).map(id=>{const r=mastRank(id),x=s.mast[id]||0,a=mastXP(r),b2=mastXP(r+1);
    return `<span class="mast"><b>${HDEF[id].name}</b> Rango ${r} · +${r}% daño · próximo premio ${(r+1)%5===0?10:2} tickets<span class="bar"><b style="width:${r>=30?100:Math.min(100,(x-a)/(b2-a)*100)}%"></b></span></span>`}).join('')}
const GPOOL={3:[],4:[],5:[]};for(const id in HDEF){const r=HDEF[id].rar;if(r&&spriteHero(id))GPOOL[r].push(id)}if(!GPOOL[3].length)GPOOL[3]=GPOOL[4].slice();
// ---------- wishes: featured banner (rotates every 3 days, 50/50 with guarantee), soft pity, awakening from duplicates ----------
const G5=0.04,G4=0.20,SOFT5=50,PITY5=70,PITY4=10,AWMAX=5;
function gBanners(){const per=Math.floor(Date.now()/864e5/3),p5=GPOOL[5],p4=GPOOL[4];
  const f5=p5.length?p5[per%p5.length]:null,f4=[...new Set([p4[per%p4.length],p4[(per+3)%p4.length]])].filter(Boolean);
  return[{id:'feat',name:'DESEO DESTACADO',f5,f4,ends:(per+1)*3*864e5},{id:'perm',name:'DESEO PERMANENTE',f4:[]}]}
let gSel='feat';
const gBanner=()=>gBanners().find(b=>b.id===gSel)||gBanners()[0];
function awaken(id){return clamp(((loadSave().owned||{})[id]||0)-1,0,AWMAX)}
function pick(a){return a[(Math.random()*a.length)|0]}
function pullOne(bn=gBanner()){const s=loadSave(),k=s.pity+1,k4=(s.pity4||0)+1;s.pulls++;
  let rar=Math.random()<(k>=PITY5?1:G5+Math.max(0,k-SOFT5)*0.06)?5:(k4>=PITY4||Math.random()<G4)?4:3,id,feat=false;
  s.pity=rar===5?0:k;s.pity4=rar>=4?0:k4;
  if(rar===5&&bn.f5){if(s.guar||Math.random()<0.5){id=bn.f5;feat=true;s.guar=0}else{const o=GPOOL[5].filter(x=>x!==bn.f5);id=o.length?pick(o):bn.f5;s.guar=1}}
  else if(rar===4&&bn.f4.length&&Math.random()<0.5){id=pick(bn.f4);feat=true}
  else id=pick(GPOOL[rar]);
  const before=s.owned[id]||0,isNew=!before;s.owned[id]=before+1;let aw=0,zeni=0;
  if(!isNew){if(before<=AWMAX)aw=before;else{zeni=rar===5?300:rar===4?80:25;s.zeni+=zeni}}
  (s.hist=s.hist||[]).unshift({id,rar,t:Date.now(),b:bn.id});if(s.hist.length>80)s.hist.length=80;
  return{id,rar,isNew,aw,zeni,feat}}
const today=()=>new Date().toISOString().slice(0,10);
const freeReady=()=>loadSave().freeD!==today();
function portrait(id,form){const f=faceOf(id,form||0);if(f)return f;const my=myHero(id,form||0);if(my&&my.c)return my.c.toDataURL();const F=heroFrames(id,form||0).downidle[0].c;return F.toDataURL()}
function doPull(n,free){const s=loadSave();if(free){if(!freeReady())return;s.freeD=today()}else if(s.tickets<n){$('#gInfo').textContent=`Te faltan tickets: tienes ${s.tickets} y necesitas ${n}. Gana más jugando partidas.`;return}
  if(!free)s.tickets-=n;const bn=gBanner(),res=[];for(let i=0;i<n;i++)res.push(pullOne(bn));writeSave();
  const box=$('#gRes');box.innerHTML='';
  const show=n>10?res.filter(r=>r.isNew||r.rar>=4||r.aw).slice(0,30):res;
  show.sort((a,b)=>b.rar-a.rar).forEach((r,i)=>{const d=document.createElement('div');d.className='gcard r'+r.rar;d.style.animationDelay=(i*0.12)+'s';
    const img=document.createElement('img');img.className='gFace';img.src=portrait(r.id,0);img.alt=HDEF[r.id].name;d.appendChild(img);
    d.insertAdjacentHTML('beforeend',`<span class="st">${'★'.repeat(r.rar)}</span><span class="nm">${HDEF[r.id].name}</span><span class="tag">${r.isNew?'¡NUEVO!':r.aw?'DESPERTAR +'+r.aw:'+'+r.zeni+' ZENI'}</span>${r.feat?'<span class="st">DESTACADO</span>':''}`);box.appendChild(d)});
  if(n>10)box.insertAdjacentHTML('beforeend',`<p class="help" style="grid-column:1/-1">Mostrando lo nuevo y los 4★ y 5★ de ${n} tiradas.</p>`);
  if(res.some(r=>r.rar===5)){sfx('trans')}else sfx('level');
  gachaInfo();buildCards()}
function gachaInfo(){const s=loadSave(),bn=gBanner(),hr=Math.max(0,Math.ceil(((bn.ends||0)-Date.now())/36e5)),nm=id=>HDEF[id]?HDEF[id].name:id;
  $('#gTabs').innerHTML=gBanners().map(b=>`<button class="btn${b.id===gSel?'':' alt'}" type="button" data-b="${b.id}">${b.name}</button>`).join('');
  $('#gTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{gSel=b.dataset.b;gachaInfo()});
  $('#gInfo').innerHTML=`Tickets <b>${s.tickets}</b> · Zeni <b>${s.zeni}</b> · 5★ seguro en <b>${PITY5-s.pity}</b> · 4★ seguro en <b>${PITY4-(s.pity4||0)}</b>`;
  $('#gRates').innerHTML=(bn.id==='feat'&&bn.f5?`5★ destacado: <b>${nm(bn.f5)}</b> · 4★ destacados: <b>${bn.f4.map(nm).join(', ')}</b> · cambia en ${hr} h<br>${s.guar?'<b style="color:var(--ki)">¡Tu próximo 5★ será el destacado!</b>':'Si tu 5★ no es el destacado, el siguiente lo será seguro.'}`
    :'Todos los personajes con la misma probabilidad.')+`<br>5★ ${G5*100}% (sube a partir del deseo ${SOFT5}) · 4★ ${G4*100}%. Cada repetido despierta al personaje (+8% daño y vida, hasta +${AWMAX}).`;
  $('#gFree').hidden=!freeReady();
  $('#gHistBox').innerHTML=(s.hist||[]).slice(0,40).map(h=>`<span class="h r${h.rar}">${'★'.repeat(h.rar)} ${nm(h.id)}</span>`).join('')||'Aún no has pedido deseos.'}
let bannerT=0;
function drawBanner(){const c=$('#gBanner'),g=c.getContext('2d'),bn=gBanner();g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.fillStyle=bn.id==='feat'?'#22143a':'#0c1630';g.fillRect(0,0,c.width,60);
  bannerT++;
  // Shenron pixelado (sprites/shenron) detrás y las 7 esferas del usuario girando a su alrededor
  if(SHENIMG.complete&&SHENIMG.naturalWidth){const k=56/SHENIMG.naturalHeight,fl=Math.round(Math.sin(bannerT*0.05)*2);g.drawImage(SHENIMG,4,2+fl,Math.round(SHENIMG.naturalWidth*k),56)}g.setTransform(1,0,0,1,c.width-160,0);
  for(let i=0;i<7;i++){const a=i/7*TAU+bannerT*0.02,x=80+Math.cos(a)*64,y=30+Math.sin(a)*22,im=DBIMG[i+1];
    if(im&&im.complete&&im.naturalWidth)g.drawImage(im,Math.round(x-5),Math.round(y-5),10,10);else{pball(g,Math.round(x),Math.round(y),5,['#c85a10','#f2911a','#ffc44a','#fff0b0'])}}
  // héroes con sus sprites reales (guardia del pack); mientras cargan no se dibuja nada
  const fr=(id,f)=>{const o=scHero(id,f),A=o&&(o.Idle||o.Walk);return A&&A.R.length?A.R[(bannerT>>4)%A.R.length]:null};
  const put=(im,cx,hh)=>{if(!im)return;const k=Math.min(1,hh/im.height);g.drawImage(im,Math.round(cx-im.width*k/2),Math.round(60-im.height*k),Math.round(im.width*k),Math.round(im.height*k))};
  if(bn.id==='feat'&&bn.f5){bn.f4.forEach((id,i)=>put(fr(id,0),i?136:24,42));
    const fl=auraFlames(heroAura(bn.f5,1))[(bannerT>>2)%3];g.globalAlpha=0.8;g.drawImage(fl,80-fl.width/2,60-fl.height);g.globalAlpha=1;put(fr(bn.f5,Math.min(1,HDEF[bn.f5].forms.length-1)),80,56);return}
  const ids=GPOOL[5];ids.forEach((id,i)=>put(fr(id,1),14+i*Math.min(26,132/Math.max(1,ids.length-1)),40))}
function openGacha(){initAudio();state='gacha';$('#gFree').onclick=()=>wish(1,true);$('#gHist').onclick=()=>{const h=$('#gHistBox');h.hidden=!h.hidden};hideMenus();$('#gacha').hidden=false;$('#gRes').innerHTML='';gachaInfo();formaUI();
  const tick=()=>{if(state!=='gacha')return;drawBanner();requestAnimationFrame(tick)};tick()}
// Manifest opcional incrustado por quien personalice el juego; nunca se pide JSON por red.
let PACK_CREDITS=window.RECURSOS_CREDITOS||[];
// hojas de DeviantArt usadas para enemigos (sesión 9); los coautores son los que cita cada ficha
PACK_CREDITS=PACK_CREDITS.concat([
 {what:'Soldado de Freezer (enemigo)',name:'TheWarriorFF2 / Spir1tSolo; con Que, qsab101, DyanDisel, Izanagi797, Orumaitoobeso, Reeck495, MV95, MANIKDX y Papuro Tenkikujimo',url:'https://www.deviantart.com/thewarriorff2/art/Frieza-s-Soldier-1-Sprite-Sheet-856331851'},
 {what:'Capitán Ginyu (jefe y jugable)',name:'Strice12; con azazel300, JustOruma, MrDryy, Godkuuxfy, MAST3RK1LL3R171, GZ52, arisrad, AlanBrito962 y MatheusAnimaa',url:'https://www.deviantart.com/strice12/art/Sheet-Sprite-Ginyu-Ulsw-1161968207'},
 {what:'Suelos, árboles y rocas de los escenarios (CC0)',name:'Pixel-Boy y AAA, Ninja Adventure Asset Pack',url:'https://pixel-boy.itch.io/ninja-adventure-asset-pack'},
 {what:'Jeice (enemigo de élite y jugable)',name:'MrDryy; faceset de MAST3RK1LL3R171; con Qsab101, ErickJCrack507, Scarlettdancer2627, JustOruma, Arisrad y Yasertheblack',url:'https://www.deviantart.com/mrdryy/art/Jeice-Sprite-Sheet-ULSW-1145996714'},
 // personajes jugables de DeviantArt (sesión 10, traídos de la rama claude/quizzical-gates-9cf9c0); Ginyu y Jeice usan las hojas de arriba
 {what:'Nappa (jugable)',name:'Strice12; con AlquimistaSK, GABY361, SheriffSyler, AThePro013, MrDryy, JCO2003, Scarlettdancer2627 y Diego Tesfaye',url:'https://www.deviantart.com/strice12/art/Nappa-sheet-sprite-ulsw-1107877711'},
 {what:'Guldo (jugable)',name:'Strice12; con JCO2003, BrolyGamer096, Marcowwwww, JustOruma, Pedrocarlos877, MrDryy y AlquimistaSK',url:'https://www.deviantart.com/strice12/art/Guldo-Sheet-Sprite-Ulsw-1154137000'},
 {what:'Uub (jugable)',name:'Strice12; con ErickJCrack507, MrDryy, Godkuufy, JustOruma, Scarlettdancer2627, AS02X y pedrocarlos8772',url:'https://www.deviantart.com/strice12/art/Uub-Sheet-Sprite-Ulsw-1157141190'},
 {what:'Mr. Satán (jugable)',name:'JayHyperStarX',url:'https://www.deviantart.com/jayhyperstarx/art/Hercule-Satan---Sprite-Sheet-1039720310'},
 {what:'Androide 21 (jugable)',name:'arisrad; combinada con hojas de GMInazuma y ErickJCrack507; con Mattfv y LUISFCX12; banner de R0N1N60',url:'https://www.deviantart.com/arisrad/art/android-21-swl-sprite-sheet-by-ARIS-RAD-1131494602'}]);
(()=>{const m=window.SPRITE_MANIFEST;if(!m)return;PACK_CREDITS=PACK_CREDITS.concat(m.credits||[]);
  const load=(url,cb)=>{const im=new Image();im.onload=()=>{const c=mk(im.width,im.height);c.getContext('2d').drawImage(im,0,0);cb(c);if(state==='title')buildCards()};im.src='sprites/'+url};
  const strip=(c,n)=>{const w=Math.floor(c.width/n),out=[];for(let i=0;i<n;i++){const o=mk(w,c.height);o.getContext('2d').drawImage(c,i*w,0,w,c.height,0,0,w,c.height);out.push(o)}return out};
  for(const h in m.heroes||{})for(const f in m.heroes[h]){const e=m.heroes[h][f],key='h:'+h+':'+f;if(MYC[key])continue;const o={};MYC[key]=o;
    const img=typeof e==='string'?e:e.img;load(img,c=>{o.c=c;o.f=flipC(c);o.w=tintC(c,'#ffffff');o.wf=flipC(o.w)});
    if(e.walk)load(e.walk,c=>{o.walk=strip(c,e.walkFrames||4);o.walkF=o.walk.map(flipC)});
    else{const wi=new Image();wi.onload=()=>{if(!o.c)return;const c=mk(wi.width,wi.height);c.getContext('2d').drawImage(wi,0,0);o.walk=strip(c,Math.max(1,Math.round(wi.width/o.c.width)));o.walkF=o.walk.map(flipC)};wi.onerror=()=>{};setTimeout(()=>{wi.src='sprites/'+img.replace(/\.png$/i,'_walk.png')},300)}}
  for(const id in m.enemies||{}){if(MYC['e:'+id])continue;const o={};MYC['e:'+id]=o;load(m.enemies[id],c=>{o.c=c;delete SPR[id]})}
})();
function openCredits(){state='credits';hideMenus();$('#credits').hidden=false;
  const L=[{what:'Diseño y programación',name:'AnimeSurvivor'},{what:'Logo y siete esferas del dragón',name:'Josemi'},...PACK_CREDITS],box=$('#cList');box.replaceChildren();
  for(const c of L){const p=document.createElement('p');p.className='stat';p.append((c.what||'Sprites')+': ');
    const b=document.createElement('b');b.textContent=c.name;p.appendChild(b);
    if(/^https?:\/\//i.test(c.url||'')){const a=document.createElement('a');a.href=c.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Ver fuente';p.append(' · ',a)}box.appendChild(p)}}
function fmt(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}
function endGame(won){
  state='end';$('#hudBtns').hidden=true;
  const best=loadBest(),b=best[S.hid]||{t:0,k:0};if(S.t>b.t)b.t=S.t;if(S.kills>b.k)b.k=S.kills;best[S.hid]=b;
  const sv=loadSave(),B=S.bank,dt=S.t-B.t,dk=S.kills-B.kills,db=(S.bossKills||0)-B.boss,first=!B.paid;
  const RW=DIFF[S.diff||0].rw,tk=Math.round((Math.floor(dt/60)+3*db+(won?15:0))*RW)+(first?S.meta.tick:0),zn=Math.round((S.zeni-B.zeni+dk*0.5+db*120+dt/2)*S.meta.greed*RW);sv.tickets+=tk;sv.zeni+=zn;
  if(S.endless){const m=Math.floor((S.t-900)/60);if(m>(sv.st.inf||0))sv.st.inf=m}{sv.bes=sv.bes||{};const K=S.kt||{},BK=B.kt||{};for(const t in K)sv.bes[t]=(sv.bes[t]||0)+K[t]-(BK[t]||0)}stat('kills',dk);stat('boss',db);stat('secs',dt);stat('saiba',S.saiba-B.saiba);stat('forms',S.forms-B.forms);stat('evo',S.evos-B.evos);stat('wish',S.wishes-(B.wishes||0));stat('elite',(S.elites||0)-(B.elites||0));
  if(first){stat('runs');if(won){stat('wins');const unl=S.diff>mapClear(S.map);if(unl){sv.clear[S.map]=S.diff;S.unl=1}if(S.diff>=2)stat('hard');if(S.map==='arena')stat('cellG');if(S.map==='namek')stat('namekW')}}
  const r0=mastRank(S.hid);sv.mast[S.hid]=(sv.mast[S.hid]||0)+dk+Math.floor(dt);const r1=mastRank(S.hid);let mrw=0;for(let r=r0+1;r<=r1;r++)mrw+=r%5===0?10:2;sv.tickets+=mrw;
  S.bank={t:S.t,kills:S.kills,boss:S.bossKills||0,saiba:S.saiba,forms:S.forms,evos:S.evos,zeni:S.zeni,wishes:S.wishes,elites:S.elites||0,kt:{...(S.kt||{})},paid:1};saveBest(best);
  $('#endTitle').textContent=won?'¡VICTORIA!':'HAS CAIDO';
  $('#endStats').innerHTML=`<p class="stat">Tiempo <b>${fmt(S.t)}</b> · Nivel <b>${P.lvl}</b> · KO <b>${S.kills}</b></p><p class="stat">Forma: <b>${HEROES[S.hid].forms[P.form]}</b> · Zeni <b>+${zn}</b> · Tickets <b>+${tk}</b></p>${S.unl&&S.diff+1<DIFF.length?`<p class="stat">¡Desbloqueada la dificultad <b>${DIFF[S.diff+1].n}</b> en ${MAPS[S.map].name}!</p>`:''}${S.diff?`<p class="stat">Dificultad ${DIFF[S.diff].n}: premios x${DIFF[S.diff].rw}</p>`:''}${r1>r0?`<p class="stat">¡${HEROES[S.hid].name} sube a <b>RANGO ${r1}</b>! +${mrw} tickets</p>`:''}${misReady()?`<p class="stat">Tienes <b>${misReady()}</b> misiones listas para cobrar en ENTRENAMIENTO</p>`:''}<div class="moves">${P.order.map(id=>`<span>${P.moves[id].evo?MV[id].evo:MV[id].name} NV ${P.moves[id].lv}</span>`).join('')}</div>`;
  const btns=$('#endBtns');btns.innerHTML='';
  const add=(t,cls,fn)=>{const b=document.createElement('button');b.type='button';b.className='btn '+cls;b.textContent=t;b.onclick=fn;btns.appendChild(b)};
  if(won)add('MODO INFINITO','',()=>{S.endless=true;S.nextEndless=S.t+60;$('#end').hidden=true;$('#hudBtns').hidden=false;state='play';last=performance.now()});
  add('REINTENTAR',won?'alt':'',()=>startGame(S.hid,S.map));
  add('PERSONAJES','alt',()=>{$('#end').hidden=true;showTitle()});
  $('#end').hidden=false;setTimeout(()=>btns.querySelector('button').focus(),20)}
function showTitle(){state='title';if(started)openHub();else{hideMenus();$('#start').hidden=false}$('#hudBtns').hidden=true;buildCards();
  const best=loadBest();const parts=Object.keys(HEROES).filter(k=>best[k]).map(k=>`${HEROES[k].name} ${fmt(best[k].t)}`);
  $('#best').textContent=parts.length?'Récords: '+parts.join(' · '):'';
  const gift=dailyGift();if(gift)$('#best').insertAdjacentHTML('afterbegin',`<b style="color:var(--ki)">¡Regalo diario! +${gift} tickets (racha ${loadSave().streak} días)</b><br>`);
  const n=misReady();if(n)$('#bTrain').dataset.n=n;else delete $('#bTrain').dataset.n;buildCards()}
// character cards
const cardTimers=[];
// estadísticas con colores: vida verde, velocidad azul, ataque rojo; la barra compara con el resto de personajes
// forma que enseña la tarjeta: la más alta que tengas despertada con Shenron y que tenga cara propia
function topForm(id){const H=HEROES[id];if(!H||!H.forms)return 0;for(let f=formasAbiertas(id);f>0;f--)if(faceExact(id,f))return f;return 0}
let STAT_RANGE=null;
function statRange(){if(STAT_RANGE)return STAT_RANGE;const r={hp:[1e9,0],spd:[1e9,0],atk:[1e9,0]};
  for(const id in HEROES){const H=HEROES[id];if(H.npc||H.custom||!spriteHero(id))continue;for(const k in r){r[k][0]=Math.min(r[k][0],H[k]);r[k][1]=Math.max(r[k][1],H[k])}}return STAT_RANGE=r}
function statBars(H){const r=statRange(),row=(k,cl,lb,v)=>{const[a,b]=r[k],f=b>a?(H[k]-a)/(b-a):1,pc=Math.round(15+85*clamp(f,0,1));
    return `<span class="sb ${cl}"><b>${lb}</b><i><em style="width:${pc}%"></em></i><span>${v}</span></span>`};
  return `<span class="sBars">${row('hp','hp','VIDA',H.hp)}${row('spd','spd','VEL',H.spd)}${row('atk','atk','ATQ','x'+H.atk)}</span>`}
// el personaje como en partida dentro de cada tarjeta (guardia de la forma base); solo se dibujan las tarjetas visibles
function drawCardSprites(t){const vh=innerHeight;document.querySelectorAll('#chars .cardSpr').forEach(c=>{const r=c.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
  const id=c.dataset.id,g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;let im=null;
  const o=scHero(id,+c.dataset.f||0);if(o){const A=o.Idle||o.Attack;if(A&&A.R.length)im=A.R[Math.floor(t*6)%A.R.length]}else if(MYC['h:'+id+':0'])im=MYC['h:'+id+':0'].c;
  if(!im)return;const fit=Math.min((c.height-6)/im.height,(c.width-6)/im.width),k=fit>=2?2:fit>=1.5?1.5:Math.min(1,fit);
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(c.width/2,c.height-4,28,5,0,0,TAU);g.fill();
  g.drawImage(im,Math.round(c.width/2-im.width*k/2),Math.round(c.height-2-im.height*k),Math.round(im.width*k),Math.round(im.height*k))})}
function buildCards(){const box=$('#chars');box.innerHTML='';cardTimers.forEach(clearInterval);cardTimers.length=0;const sv=loadSave();heroMigrate(sv);unlockAll(sv);
  const ids=Object.keys(HEROES).filter(spriteHero).sort((a,b)=>(!sv.owned[a])-(!sv.owned[b]));
  for(const id of ids){const H=HEROES[id],own=!!sv.owned[id]||id==='gokuui',b=document.createElement('button');b.type='button';b.className='card'+(own?'':' locked');
    const img=document.createElement('img');img.className='cardFace';
    const fTop=topForm(id),f0=faceExact(id,fTop)||(MYC['h:'+id+':0']?MYC['h:'+id+':0'].c.toDataURL():'');
    img.src=f0||'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=';img.alt=f0?H.name:'';if(!f0)img.classList.add('noFace');
    b.appendChild(img);const spr=mk(150,170);spr.className='cardSpr';spr.dataset.id=id;spr.dataset.f=fTop;b.appendChild(spr);const stars=H.rar?`<span class="rar">${'★'.repeat(H.rar)}</span>`:'';
    b.insertAdjacentHTML('beforeend',own?`${stars}<h3>${H.name}</h3><p>${H.desc}</p>${statBars(H)}${mastRank(id)?`<span class="rar">MAESTRIA ${mastRank(id)}</span>`:''}${awaken(id)?`<span class="rar">DESPERTAR +${awaken(id)}</span>`:''}`:`${stars}<h3>${H.name}</h3><p>Pídeselo a Shenron.</p>`);
    b.dataset.id=id;b.onclick=()=>own?pickHero(id):openGacha();box.appendChild(b);
    }
  $('#wallet').textContent=`Tickets: ${sv.tickets} · Zeni: ${sv.zeni} · Personajes: ${Object.keys(HEROES).filter(k=>spriteHero(k)&&sv.owned[k]).length}/${Object.keys(HEROES).filter(spriteHero).length}`}
// ---------- Crea tu guerrero: player-made heroes from any PNG, stored only in this browser ----------
const CTYPES={bal:{n:'Equilibrado',hp:115,spd:62,atk:1},str:{n:'Fuerza bruta',hp:105,spd:57,atk:1.15},fast:{n:'Velocidad',hp:95,spd:72,atk:0.95},tank:{n:'Tanque',hp:150,spd:54,atk:0.9,regen:0.4}};
const CMOVES=['kame','galick','makanko','masenko','kienzan','genki','bigbang','burning','riot','eraser','finalkame','stardust','aura','orbs'];
const CAURAS={gold:'Dorada',white:'Blanca',orange:'Naranja',red:'Roja',blue:'Azul',green:'Verde'};
let CUSTOM=[];try{CUSTOM=JSON.parse(localStorage.getItem('animesurvivor-custom')||'[]')}catch(e){}
function saveCustom(){try{localStorage.setItem('animesurvivor-custom',JSON.stringify(CUSTOM));return true}catch(e){return false}}
function fitCanvas(im,maxW,maxH){const k=Math.min(1,maxW/im.width,maxH/im.height),w=Math.max(1,Math.round(im.width*k)),h=Math.max(1,Math.round(im.height*k)),c=mk(w,h),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0,w,h);return c}
function regCustom(d,cb){const im=new Image();im.onload=()=>{const c=fitCanvas(im,40,56),T=CTYPES[d.type]||CTYPES.bal,id=d.id,w=tintC(c,'#ffffff');
  HDEF[id]={name:d.name.toUpperCase().slice(0,14),rar:0,hp:T.hp,spd:T.spd,atk:T.atk,regen:T.regen||0,start:MV[d.move]?d.move:'kame',custom:1,
    desc:`Creado por ti. ${T.n}. Empieza con ${(MV[d.move]||MV.kame).name}.`,forms:['BASE','POTENCIADO','MÁXIMO PODER','LÍMITE ROTO','DIVINO'],aura:['gold',d.aura,d.aura,d.aura,d.aura]};
  MYC['h:'+id+':0']={c,f:flipC(c),w,wf:flipC(w)};for(const k in HCACHE)if(k.startsWith(id))delete HCACHE[k];
  const s=loadSave();if(!s.owned[id]){s.owned[id]=1;writeSave()}cb&&cb()};im.src=d.img}
function unregCustom(id){delete HDEF[id];delete MYC['h:'+id+':0'];const s=loadSave();delete s.owned[id];writeSave()}
let forgeImg=null,forgeT=0;
function openForge(){state='forge';hideMenus();$('#forge').hidden=false;forgeImg=null;$('#fName').value='';$('#fInfo').textContent='Sube un PNG o JPG de tu personaje, mirando de frente.';
  const sel=(el,o)=>{el.innerHTML=Object.entries(o).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')};
  sel($('#fType'),Object.fromEntries(Object.entries(CTYPES).map(([k,v])=>[k,v.n])));sel($('#fMove'),Object.fromEntries(CMOVES.map(k=>[k,MV[k].name])));sel($('#fAura'),CAURAS);
  listForge();const tick=()=>{if(state!=='forge')return;drawForge();requestAnimationFrame(tick)};tick()}
function drawForge(){const c=$('#fPrev'),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#58b468';g.fillRect(0,0,c.width,c.height);forgeT++;
  if(!forgeImg){g.fillStyle='#2f7a3a';g.font='16px monospace';g.textAlign='center';g.fillText('?',c.width/2,c.height/2);return}
  const s=fitCanvas(forgeImg,40,56),W=autoWalk(s),z=3,fl=auraFlames($('#fAura').value)[(forgeT>>3)%3];
  g.globalAlpha=0.75;g.drawImage(fl,(c.width-fl.width*z)/2,c.height-8-fl.height*z,fl.width*z,fl.height*z);g.globalAlpha=1;
  const im=W[(forgeT>>3)%W.length];g.drawImage(im,(c.width-im.width*z)/2,c.height-8-im.height*z,im.width*z,im.height*z)}
function listForge(){const box=$('#fList');box.innerHTML='';
  if(!CUSTOM.length){box.innerHTML='<p class="help">Aún no has creado ningún guerrero.</p>';return}
  CUSTOM.forEach(d=>{const row=document.createElement('div');row.className='mis';row.innerHTML=`<span class="nm">${d.name.replace(/</g,'&lt;')}</span><span class="ds">${(CTYPES[d.type]||CTYPES.bal).n} · ${(MV[d.move]||MV.kame).name}</span>`;
    const bx=document.createElement('div');bx.className='btns';
    const ex=document.createElement('button');ex.type='button';ex.className='btn alt';ex.textContent='EXPORTAR';ex.onclick=async()=>{const data=JSON.stringify({animesurvivor:1,hero:d}),filename=d.name.replace(/[^\w-]+/g,'_')+'.guerrero.json';
      const dl=window.claude&&claude.use?await claude.use('downloads').catch(()=>null):null;
      if(dl){dl.save({filename,data}).catch(()=>{});return}
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=filename;a.click()};
    const del=document.createElement('button');del.type='button';del.className='btn alt';del.textContent='BORRAR';del.onclick=()=>{CUSTOM=CUSTOM.filter(x=>x!==d);saveCustom();unregCustom(d.id);listForge()};
    bx.append(ex,del);row.appendChild(bx);box.appendChild(row)})}
function addCustom(d){CUSTOM.push(d);if(!saveCustom()){CUSTOM.pop();$('#fInfo').textContent='No cabe en el almacenamiento del navegador. Prueba con una imagen más pequeña.';return}
  regCustom(d,()=>{listForge();$('#fInfo').textContent=`¡${d.name} está listo! Lo tienes en la pantalla de personajes.`;sfx('trans')})}
function forgeLoad(file){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const parts=splitSheet(im);
    let best=parts.sort((a,b)=>b.width*b.height-a.width*a.height)[0];const src=best&&best.width*best.height>im.width*im.height*0.08?best:im;
    forgeImg=fitCanvas(src,96,128);$('#fInfo').textContent='Así se verá. Ponle nombre y elige su ataque.'};im.src=r.result};r.readAsDataURL(file)}
CUSTOM.forEach(d=>regCustom(d,()=>{if(state==='title')buildCards()}));
buildCards();
$('#bPause').onclick=()=>{if(state==='play')pauseGame();else if(state==='pause')resume()};
$('#bResume').onclick=resume;
$('#bQuit').onclick=()=>{$('#pause').hidden=true;endGame(false)};
function toggleMute(){muted=!muted;$('#bMute').textContent=muted?'MUDO':'SON'}
$('#bMute').onclick=toggleMute;
$('#bBack').onclick=()=>{$('#maps').hidden=true;showTitle()};
$('#bMine').onclick=openMine;
$('#bGacha').onclick=openGacha;$('#bTrain').onclick=openTrain;
$('#bkSave').onclick=async()=>{const data=JSON.stringify({animesurvivorSave:1,save:loadSave(),custom:CUSTOM}),filename='animesurvivor-copia.json';
  const dl=window.claude&&claude.use?await claude.use('downloads').catch(()=>null):null;if(dl){dl.save({filename,data}).catch(()=>{});return}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=filename;a.click()};
$('#bkLoad').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;f.text().then(t=>{const j=JSON.parse(t);if(!j||!j.animesurvivorSave||typeof j.save!=='object')throw 0;
  $('#tInfo').innerHTML='Esto sustituye tu progreso actual por el de la copia. ';const ok=document.createElement('button');ok.type='button';ok.className='btn';ok.textContent='SÍ, CARGAR';$('#tInfo').appendChild(ok);$('#tInfo').scrollIntoView({block:'center'});
  ok.onclick=()=>{try{localStorage.setItem('animesurvivor-save',JSON.stringify(j.save));if(Array.isArray(j.custom))localStorage.setItem('animesurvivor-custom',JSON.stringify(j.custom.filter(d=>d&&typeof d.img==='string'&&d.img.startsWith('data:image/'))))}catch(err){}
  location.reload()}}).catch(()=>{$('#tInfo').textContent='Ese archivo no es una copia de AnimeSurvivor.'})};$('#bForge').onclick=openForge;$('#fBack').onclick=()=>{$('#forge').hidden=true;showTitle()};
$('#fFile').onchange=e=>{const f=e.target.files[0];if(f)forgeLoad(f)};
$('#fMake').onclick=()=>{const name=$('#fName').value.trim();if(!forgeImg){$('#fInfo').textContent='Primero sube una imagen.';return}if(!name){$('#fInfo').textContent='Ponle un nombre.';$('#fName').focus();return}
  addCustom({id:'c'+Date.now().toString(36),name,img:forgeImg.toDataURL(),type:$('#fType').value,move:$('#fMove').value,aura:$('#fAura').value});forgeImg=null;$('#fFile').value='';$('#fName').value=''};
$('#fImport').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{const j=JSON.parse(t),d=j&&j.hero;if(!d||typeof d.img!=='string'||!d.img.startsWith('data:image/'))throw 0;
  addCustom({id:'c'+Date.now().toString(36),name:String(d.name||'Guerrero').slice(0,14),img:d.img,type:CTYPES[d.type]?d.type:'bal',move:CMOVES.includes(d.move)?d.move:'kame',aura:CAURAS[d.aura]?d.aura:'gold'})}).catch(()=>{$('#fInfo').textContent='Ese archivo no es un guerrero válido.'});e.target.value=''};$('#trBack').onclick=()=>{$('#train').hidden=true;showTitle()};$('#gBack').onclick=()=>{$('#gacha').hidden=true;showTitle()};$('#gPull1').onclick=()=>doPull(1);$('#gPull10').onclick=()=>doPull(10);$('#gPull100').onclick=()=>doPull(100);
$('#bCredits').onclick=openCredits;$('#cBack').onclick=()=>{$('#credits').hidden=true;showTitle()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pauseGame()});
// test hook
// ---------- DragonBall Survivor menu: start screen, side menu hub, companion, event, roster, shop, ranking, settings ----------
let started=false,hubTimer=0;
// characters without good sprites are out of the game until they arrive (see SPRITES_PENDIENTES.md)
function spriteHero(id){return !!(HEROES[id]&&!HEROES[id].npc&&!FUERA.has(id)&&(SCPACK.h[id]||HEROES[id].custom))}
function hideMenus(){for(const k of ['#title','#hub','#start','#roster','#shop','#rank','#settings']){const e=$(k);if(e)e.hidden=true}clearInterval(hubTimer)}
function heroAnim(id,form,anim){const pk=scHero(id,form);return pk&&(pk[anim]||pk.Idle)}
// visible box of a frame (sprite-pack cells carry a lot of empty margin), cached per frame
const BBOX=new WeakMap();
function bbox(im){let b=BBOX.get(im);if(b)return b;const d=im.getContext('2d').getImageData(0,0,im.width,im.height).data;let x0=im.width,y0=im.height,x1=-1,y1=-1;
  for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(d[(y*im.width+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  b=x1<0?{x:0,y:0,w:im.width,h:im.height}:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};BBOX.set(im,b);return b}
function drawHeroInto(c,id,form,t,anim){const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);
  const A=heroAnim(id,form,anim||'Idle');if(!A)return false;const im=A.R[scFrame(A,t)],b=bbox(A.R[0]),k=Math.max(1,Math.floor(Math.min((c.width-8)/b.w,(c.height-6)/b.h)));
  g.drawImage(im,b.x,0,b.w,b.y+b.h,(c.width-b.w*k)/2|0,c.height-(b.y+b.h)*k+b.y*k-2,b.w*k,(b.y+b.h)*k);return true}
function companion(){const s=loadSave();if(s.sel&&s.owned[s.sel]&&spriteHero(s.sel))return s.sel;return Object.keys(HEROES).find(k=>s.owned[k]&&spriteHero(k))||'goku'}
// every character with sprites is playable from the start (the gacha now only awakens them)
function unlockAll(sv){let n=0;for(const k in HEROES)if(spriteHero(k)&&!sv.owned[k]){sv.owned[k]=1;n++}if(n)writeSave()}
function pickHero(id){const s=loadSave();s.sel=id;writeSave();showTitle()}
function countdown(ms){ms=Math.max(0,ms);const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60,p=n=>String(n).padStart(2,'0');return(d?d+'d ':'')+p(h)+':'+p(m)+':'+p(s)}
const HUB_ITEMS=[
  ['play','kame','JUGAR','Elige escenario y lucha',()=>chooseMap(companion())],
  ['roster','aura','PERSONAJES',()=>{const s=loadSave(),all=Object.keys(HEROES).filter(spriteHero);return `${all.filter(k=>s.owned[k]).length} / ${all.length} guerreros`},openRoster],
  ['train','power','MEJORAS','Hazte más fuerte en cada partida',()=>openTrain()],
  ['shop','senzu','TIENDA','Cambia zeni por tickets',openShop],
  ['wish','orbs','SHENRON',()=>{const b=gBanners()[0];return b.f5&&HEROES[b.f5]?'Destacado: '+HEROES[b.f5].name:'Pide tus deseos'},()=>openGacha()],
  ['mis','xp','MISIONES',()=>{const n=misReady();return n?`¡${n} recompensa${n>1?'s':''} lista${n>1?'s':''}!`:'Misiones, logros y bestiario'},()=>{openTrain();setTimeout(()=>$('#tMis').scrollIntoView({block:'start'}),30)}],
  ['rank','stardust','RANKING','Tus mejores marcas',openRank],
  ['set','cd','AJUSTES','Sonido, pantalla y copia de seguridad',openSettings]];
function buildHub(){const nav=$('#hubMenu');nav.innerHTML='';
  for(const [k,ic,t,sub,fn] of HUB_ITEMS){const b=document.createElement('button');b.type='button';b.className='hitem';b.dataset.k=k;
    const c=icon(ic),z=mk(32,32),g=z.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(c,0,0,32,32);b.appendChild(z);
    b.insertAdjacentHTML('beforeend',`<span><b>${t}</b><small>${typeof sub==='function'?sub():sub}</small></span>`);b.onclick=()=>{initAudio();sfx('shot');fn()};nav.appendChild(b)}}
function hubRefresh(){const s=loadSave(),best=loadBest(),id=companion(),H=HEROES[id],all=Object.keys(HEROES).filter(spriteHero);
  $('#cZeni').textContent='ZENI '+s.zeni;$('#cTix').textContent='TICKETS '+s.tickets;$('#cHeroes').textContent='GUERREROS '+all.filter(k=>s.owned[k]).length+'/'+all.length;
  $('#hCompName').textContent=H.name;{const f=faceOf(id,0);$('#hFace').src=f||'';$('#hFace').hidden=!f}const aw=awaken(id),mr=mastRank(id);
  $('#hCompTags').innerHTML=(H.rar?`<span class="pill r${H.rar}">${'★'.repeat(H.rar)}</span>`:'')+(aw?`<span class="pill">DESPERTAR +${aw}</span>`:'')+(mr?`<span class="pill">MAESTRÍA ${mr}</span>`:'');
  const bt=Object.values(best).reduce((m,b)=>Math.max(m,b.t||0),0),st=s.st||{};
  $('#hubStats').innerHTML=`Tiempo jugado <b>${fmt(st.secs||0)}</b> · Mejor tiempo <b>${fmt(bt)}</b><br>Derrotados <b>${st.kills||0}</b> · Jefes <b>${st.boss||0}</b> · Deseos <b>${s.pulls||0}</b>`;
  buildHub();evTick()}
function evTick(){const b=gBanners()[0];if(!b.f5||!HEROES[b.f5]){$('#hEvent').hidden=true;return}$('#hEvent').hidden=false;$('#hEvent').innerHTML=`<b>¡DESEO DESTACADO: ${HEROES[b.f5].name}!</b> Termina en ${countdown(b.ends-Date.now())}`}
function openHub(){hideMenus();state='title';$('#hub').hidden=false;hubRefresh();
  let n=0;hubTimer=setInterval(()=>{if($('#hub').hidden)return;drawHubComp();if(++n%8===0)evTick()},120)}
// compañero del menú de lado, como en partida (igual que la selección)
function drawHubComp(){const c=$('#hCompC');if(!c)return;const id=companion(),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
  const o=scHero(id,topForm(id));let im=null;if(o){const A=o.Idle||o.Attack;if(A&&A.R.length)im=A.R[Math.floor(performance.now()/160)%A.R.length]}else if(MYC['h:'+id+':0'])im=MYC['h:'+id+':0'].c;
  if(!im)return;const fit=Math.min((c.height-8)/im.height,(c.width-8)/im.width),k=fit>=2?2:fit>=1.5?1.5:Math.min(1,fit);
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(c.width/2,c.height-5,30,5,0,0,TAU);g.fill();g.drawImage(im,Math.round(c.width/2-im.width*k/2),Math.round(c.height-3-im.height*k),Math.round(im.width*k),Math.round(im.height*k))}
function enterGame(){if(started)return;started=true;initAudio();sfx('level');openHub()}
// ficha del personaje: recorre sus formas mostrando guardia, combo, patada y ki con los sprites reales
const rosterAnim={id:null,t0:0,on:0};
function drawRosterAnim(){const c=$('#rPrevC'),g=c.getContext('2d'),id=rosterAnim.id,H=HEROES[id];g.clearRect(0,0,c.width,c.height);if(!H)return;
  const t=(performance.now()-rosterAnim.t0)/1000,form=rosterAnim.form||0,seq=['Idle','Attack','Idle','Kick','Cast','Pow'],an=seq[Math.floor(t/0.67)%seq.length];
  const o=scHero(id,form);if(!o)return;const A=o[an]||o.Idle;if(!A||!A.R.length)return;const im=A.R[Math.floor(t*8)%A.R.length],k=Math.min(2,(c.height-6)/im.height,(c.width-4)/im.width);
  g.imageSmoothingEnabled=false;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(c.width/2,c.height-4,22,4,0,0,TAU);g.fill();
  g.drawImage(im,Math.round(c.width/2-im.width*k/2),Math.round(c.height-2-im.height*k),Math.round(im.width*k),Math.round(im.height*k));}
// forma que se ve en la ficha: la cara es la de esa forma; si no tiene retrato propio no se pone ninguno
function rosterForm(d){const id=rosterAnim.id,H=HEROES[id];if(!H)return;const n=(H.forms||[0]).length;rosterAnim.form=((rosterAnim.form||0)+d+n)%n;const f=rosterAnim.form;
  const face=faceExact(id,f)||(f===0&&MYC['h:'+id+':0']?MYC['h:'+id+':0'].c.toDataURL():null);$('#rPrevImg').src=face||'';$('#rPrevImg').hidden=!face;$('#rNoFace').hidden=!!face;
  $('#rFormN').textContent=(H.forms||[])[f]||'BASE';$('#rFormL').disabled=$('#rFormR').disabled=n<2;$('#rForm').classList.toggle('one',n<2);
  const own=!!loadSave().owned[id];$('#rFormLock').hidden=!(own&&f>formasAbiertas(id));if(d)rosterAnim.t0=performance.now()}
function openRoster(){hideMenus();state='title';$('#roster').hidden=false;buildCards();const s=loadSave(),all=Object.keys(HEROES).filter(spriteHero);
  const prev=id=>{const H=HEROES[id];if(rosterAnim.id!==id)rosterAnim.form=topForm(id);$('#rPrevName').textContent=H.name;$('#rPrev').dataset.id=id;$('#rPrevStats').innerHTML=statBars(H);
    // sus técnicas de la serie y el nivel en que se aprenden
    $('#rPrevMoves').innerHTML=sigList(id).map((m,i)=>MV[m]?`<li><b>Nv ${UNLOCK_LV[i]||1}</b> ${MV[m].name}</li>`:'').join('');rosterAnim.id=id;rosterAnim.t0=performance.now();rosterForm(0)};
  if(!rosterAnim.on){rosterAnim.on=1;const loop=()=>{if($('#roster').hidden){rosterAnim.on=0;return}drawRosterAnim();drawCardSprites(performance.now()/1000);requestAnimationFrame(loop)};loop()}
  $('#chars').querySelectorAll('.card').forEach(b=>{b.onmouseenter=b.onfocus=()=>prev(b.dataset.id)});prev(companion());
  $('#rInfo').innerHTML=`Tienes <b>${all.filter(k=>s.owned[k]).length}</b> de <b>${all.length}</b>. Toca uno tuyo para llevarlo de compañero; los que te faltan se consiguen pidiendo deseos a Shenron.`}
const SHOP=[{n:'1 TICKET',d:'Un deseo a Shenron',c:120,t:1},{n:'10 TICKETS',d:'Diez deseos con descuento',c:1100,t:10},{n:'50 TICKETS',d:'El pack del guerrero',c:5000,t:50}];
function openShop(){hideMenus();state='title';$('#shop').hidden=false;drawShop()}
function drawShop(){const s=loadSave();$('#shInfo').innerHTML=`Tienes <b>${s.zeni}</b> zeni y <b>${s.tickets}</b> tickets. El zeni se gana jugando partidas y con los repetidos al máximo despertar.`;
  const box=$('#shList');box.innerHTML='';SHOP.forEach(it=>{const b=document.createElement('button');b.type='button';b.className='card';const ok=s.zeni>=it.c;if(!ok)b.classList.add('locked');
    const z=mk(48,48),g=z.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(icon('orbs'),0,0,48,48);b.appendChild(z);
    b.insertAdjacentHTML('beforeend',`<h3>${it.n}</h3><p>${it.d}</p><span class="stats">${it.c} ZENI</span>`);
    b.onclick=()=>{const s=loadSave();if(s.zeni<it.c){sfx('hurt');return}s.zeni-=it.c;s.tickets+=it.t;writeSave();sfx('gem');drawShop()};box.appendChild(b)})}
function openRank(){hideMenus();state='title';$('#rank').hidden=false;const best=loadBest(),rows=Object.keys(best).filter(k=>HEROES[k]).sort((a,b)=>best[b].t-best[a].t);
  $('#rkList').innerHTML=(rows.length?rows.map((k,i)=>`<p class="stat">${i+1}. <b>${HEROES[k].name}</b> · ${fmt(best[k].t)} · ${best[k].k} derrotados</p>`).join(''):'<p class="help">Juega una partida para entrar en el ranking.</p>')
    +'<h3 class="sub">ESCENARIOS SUPERADOS</h3>'+Object.keys(MAPS).map(k=>{const c=mapClear(k);return `<p class="stat">${MAPS[k].name} · <b style="color:${c>=0?DIFF[c].c:'var(--dim)'}">${c>=0?DIFF[c].n:'—'}</b></p>`}).join('')}
function openSettings(){hideMenus();state='title';$('#settings').hidden=false;setLabels()}
function setLabels(){$('#sMute').textContent='SONIDO: '+($('#bMute').textContent==='MUDO'?'NO':'SÍ');$('#sCol').textContent='VER COLISIONES: '+(debugSolid?'SÍ':'NO')}
function toggleFull(){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{})}
(function hubWire(){
  $('#start').onclick=enterGame;addEventListener('keydown',e=>{if(!started&&state==='title'&&!$('#start').hidden)enterGame()});
  $('#hComp').onclick=openRoster;$('#hEvent').onclick=()=>openGacha();
  $('#hSave').onclick=()=>$('#bkSave').click();$('#hMute').onclick=()=>{$('#bMute').click();$('#hMute').textContent=$('#bMute').textContent==='MUDO'?'MUDO':'SONIDO'};$('#hFull').onclick=toggleFull;$('#hSet').onclick=openSettings;
  $('#rBack').onclick=showTitle;$('#rFormL').onclick=()=>rosterForm(-1);$('#rFormR').onclick=()=>rosterForm(1);$('#shBack').onclick=showTitle;$('#rkBack').onclick=showTitle;$('#sBack').onclick=showTitle;
  $('#sMute').onclick=()=>{$('#bMute').click();setLabels()};$('#sFull').onclick=toggleFull;$('#sCol').onclick=()=>{debugSolid=!debugSolid;setLabels()};
  $('#sSave').onclick=()=>$('#bkSave').click();$('#sLoad').onclick=()=>$('#bkLoad').click();$('#sForge').onclick=()=>openForge();$('#sMine').onclick=()=>$('#bMine').click();$('#sCred').onclick=()=>openCredits();
  $('#rosterBox').appendChild($('#chars'))})();
window.AS={SCPACK,scHero,scLoad,heroAnim,spawnAt:(t,dx,dy)=>spawn(t,P.x+dx,P.y+dy),spawnBoss,spawnCrate,putPickup,dropGem,addMove:id=>{addMove(id);const m=P.moves[id];m.lv=5},ebeamT:()=>ebeams.length?ebeams[0].t:null,setDiff:d=>{pickedDiff=d},kiSprite,autoWalk,ET,fxFrames,sparkFrames,fxN:()=>fxs.length,HDEF,loadSave,doPull,heroFrames,enemySprite,beamT:()=>{const b=beams.find(q=>q.hero);return b?b.t:-1},beamsN:()=>beams.length,enemies:()=>enemies,eshots:()=>eshots,gems:()=>gems,pickups:()=>pickups,spd:()=>stats().spd,maps:()=>Object.keys(WORLD),decorAudit:()=>Object.keys(DECOR).filter(k=>!(k in SOLID_DEF)),obstacle:(tx,ty)=>{solidSync();return solidAt(tx,ty)},solid:(x,y,r)=>solidHit(x,y,r),move:(o,dx,dy,r)=>solidMove(o,dx,dy,r),place:(o,r,f)=>solidPlace(o,r,f),setMap:id=>{MAPK=id;S.map=id;S.isl=null;solidReset()},get state(){return state},get S(){return S},get P(){return P},aj:MELEE_AJ,rol:ROL_AJ,start:startGame,tick:(sec)=>{for(let i=0;i<sec*30;i++){if(state==='play')update(1/30)}},pick:i=>{const b=$('#ups').querySelectorAll('button')[i||0];b&&b.click()}};
newGame('goku');showTitle();
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(loop));
})();
