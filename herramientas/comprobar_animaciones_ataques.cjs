// Regresiones de selección de técnica y momento de lanzamiento; no necesita navegador.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../02 - Código del juego/script.js'),'utf8');
const start=source.indexOf('function attackPose('),end=source.indexOf('function sigOrigin(',start);
const c=vm.createContext({clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),P:{},MV:{}});
const variants=source.slice(source.indexOf('function varAnim('),source.indexOf('function heroHand('));
vm.runInContext(variants+source.slice(start,end),c);
const clip=n=>({R:Array(n).fill({}),du:Array(n).fill(5)});
c.pk={Idle:clip(2),Attack:clip(3),Kick:clip(2),Cast:clip(2),Beam:clip(2),Up:clip(3),Pow:clip(4),Tecnica_masenko:clip(2)};
assert.equal(vm.runInContext("attackClip(pk,'up',0,'masenko')===pk.Tecnica_masenko",c),true);
assert.equal(vm.runInContext("attackClip(pk,'up')===pk.Up",c),true);
assert.equal(vm.runInContext("attackPose({kind:'nova',pose:'cast'})",c),'pow');
assert.equal(vm.runInContext("attackPose({kind:'nova',pose:'kick'})",c),'kick');
assert.equal(vm.runInContext("attackPose({kind:'big',pose:'up'})",c),'up');
assert.equal(vm.runInContext("attackClip(pk,'kick')===pk.Kick",c),true);
assert.equal(vm.runInContext("attackClip(pk,'beam')===pk.Beam",c),true);
c.weighted={R:[{},{},{}],du:[20,5,5]};
assert.equal(vm.runInContext('attackFrame(weighted,.5)',c),0,'La preparación larga no se acelera');
assert.equal(vm.runInContext('attackFrame(weighted,.7)',c),1);
assert.equal(vm.runInContext('attackFrame(weighted,1)',c),2,'No se sale del último fotograma');
vm.runInContext("MV.genki={kind:'big',pose:'up'};attackRelease(MV.genki,0)",c);
assert.equal(c.P.atkPose,'up');assert.equal(c.P.atkId,'genki');assert.equal(c.P.atkT,c.P.atkD);
const originals=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../02 - Código del juego/animaciones_juego.js'),'utf8'),originals);
for(const [h,forms] of Object.entries(originals.window.ANIM_SET.h))for(const [f,entry] of Object.entries(forms)){
 for(const a of ['Attack2','Attack3'])if(entry.anims[a])for(const k of ['Kick','Kick2'])if(entry.anims[k])
  assert.notEqual(entry.anims[a].url,entry.anims[k].url,`${h}/${f}: ${a} no puede ser la misma patada que ${k}`);
}
console.log('Técnicas: postura propia, lanzamiento sobre la cabeza, aura, patadas, tiempos y variantes coherentes.');

// Un combo no causa daño mientras el clip está en su preparación.
const comboStart=source.indexOf('if(P.combo&&!P.dash){'),comboEnd=source.indexOf('  if(P.swing',comboStart);
let impacts=0;
const actor={x:0,y:0,combo:{id:'punch',v:0,n:3,i:0,t:0,d:1,rad:20,dmg:12,kb:20,col:['#fff','#ff0']}};
const timing=vm.createContext({P:actor,S:{hid:'goku'},dt:.05,scHero:()=>({}),attackClip:()=>({R:[{},{},{}],du:[12,6,6]}),near:()=>{impacts++},parts:[],rnd:()=>0,window:{},fxRg:[],cam:{},MELEE_AJ:{empuje:.6,aturde:.2}});
vm.runInContext(source.slice(comboStart,comboEnd),timing);
assert.equal(impacts,0);
vm.runInContext(source.slice(comboStart,comboEnd),timing);
assert.equal(impacts,0);
timing.dt=.11;
vm.runInContext(source.slice(comboStart,comboEnd),timing);
assert.equal(impacts,1);
assert(actor.atkT/actor.atkD<.5,'El daño empieza cuando ya terminó la pose de preparación');
console.log('Impactos: el daño espera al fotograma de ataque.');
