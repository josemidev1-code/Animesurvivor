// Recorre todas las tiras de animación, incluidas formas de enemigos y variantes.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'02 - Código del juego/animaciones_juego.js'),'utf8'),context);
let forms=0,animations=0,frames=0;
for(const [hero,variants] of Object.entries(context.window.ANIM_SET.h)){
 for(const [form,entry] of Object.entries(variants)){
  forms++;
  for(const name of ['Idle','Walk','Attack','Kick','Cast','Pow','Hurt'])assert(entry.anims[name],`${hero}/${form}: falta ${name}`);
  for(const [name,animation] of Object.entries(entry.anims)){
   const label=`${hero}/${form}/${name}`;
   assert(animation.w>0&&animation.h>4,label+': tamaño');
   assert(animation.du.length&&animation.du.every(duration=>Number.isFinite(duration)&&duration>0),label+': duraciones');
   const png=Buffer.from(animation.url.split(',')[1],'base64');
   assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a',label+': PNG');
   assert.equal(png.readUInt32BE(16),animation.w*animation.du.length,label+': ancho de tira');
   assert.equal(png.readUInt32BE(20),animation.h,label+': alto de tira');
   animations++;frames+=animation.du.length;
  }
  if(entry.anims.Dash){
   assert.equal(entry.anims.Dash.url,entry.anims.Walk.url,`${hero}/${form}: Dash debe conservar el cuerpo del vuelo revisado`);
  }
 }
}
console.log(`${forms} formas, ${animations} animaciones y ${frames} fotogramas: integridad de tiras correcta.`);
// Reproduce varios impactos del mismo combo y comprueba que la animación no vuelve al principio.
const source=fs.readFileSync(path.join(root,'02 - Código del juego/script.js'),'utf8');
const begin=source.indexOf('if(P.combo&&!P.dash){'),end=source.indexOf('  if(P.swing',begin);
assert(begin>=0&&end>begin);
const actor={combo:{v:2,n:4,i:0,t:0,d:1,rad:20,dmg:12,kb:20,col:['#fff','#ff0']},x:0,y:0};
const sandbox=vm.createContext({P:actor,dt:.1,near:()=>{},parts:[],rnd:()=>0,window:{},fxRg:[],cam:{},MELEE_AJ:{empuje:.6,aturde:.2}});
vm.runInContext(source.slice(begin,end),sandbox);
const duration=actor.atkD;
actor.atkT-=.1;
vm.runInContext(source.slice(begin,end),sandbox);
assert.equal(actor.atkV,2);assert.equal(actor.atkD,duration);assert(actor.atkT<duration,'El segundo impacto no debe reiniciar el clip');
// Un disparo automático a mitad de combo (atkK=1) no debe pisar la animación del combo.
const antes=actor.atkT;actor.atkK=1;actor.atkT=actor.atkD=0.24;actor.atkA=Math.PI;
vm.runInContext(source.slice(begin,end),sandbox);
assert.equal(actor.atkK,0);assert.equal(actor.atkD,duration);assert(actor.atkT<antes,'El combo sigue su propio reloj');assert.equal(actor.atkA,0);
console.log('Combo: conserva variante y progreso entre impactos, aunque salte un disparo.');
