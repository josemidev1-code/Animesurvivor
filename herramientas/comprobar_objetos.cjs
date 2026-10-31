// Comprueba recursos incrustados y la lógica real de recogida y botín, sin navegador.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'script.js'),'utf8');
const c=vm.createContext({window:{},console});
vm.runInContext(fs.readFileSync(path.join(raiz,'ui_imagenes.js'),'utf8'),c);
for(const id of ['senzu','capsulaVida','capsulaKi','radar']){
  const bytes=Buffer.from(c.window.UI_IMG[id].split(',')[1],'base64');
  assert(bytes.equals(fs.readFileSync(path.join(raiz,'ui/objetos',id+'.png'))),id);
  assert(bytes.readUInt32BE(16)>0&&bytes.readUInt32BE(20)>0,id);
}
const gif=Buffer.from(c.window.UI_IMG.radarAnimado.split(',')[1],'base64');
assert(gif.equals(fs.readFileSync(path.join(raiz,'ui/objetos/originales/radar_lady_pixel.gif'))),'El GIF debe conservarse íntegro');
assert(c.window.RECURSOS_CREDITOS.some(x=>x.name==='Lady-Pixel'));
assert(c.window.RECURSOS_CREDITOS.some(x=>x.name.includes('Ragengow')));
function tramo(inicio,fin){const a=src.indexOf(inicio),b=src.indexOf(fin,a);assert(a>=0&&b>a);return src.slice(a,b)}
Object.assign(c,{P:{hp:10,sigT:8},S:{t:12},gems:[{mag:false},{mag:false}],sfx:()=>{}});
vm.runInContext(tramo('function recogerObjeto','function updateFx'),c);
vm.runInContext("recogerObjeto('senzu',{maxhp:100})",c);assert.equal(c.P.hp,60);
vm.runInContext("recogerObjeto('capsulaVida',{maxhp:100})",c);assert.equal(c.P.hp,85);
vm.runInContext("recogerObjeto('senzu',{maxhp:100})",c);assert.equal(c.P.hp,100);
vm.runInContext("recogerObjeto('capsulaKi',{maxhp:100})",c);assert.equal(c.P.sigT,0);
vm.runInContext("recogerObjeto('radar',{maxhp:100})",c);assert(c.gems.every(x=>x.mag));assert.equal(c.S.radarHasta,16);
// Todas las ramas del botín siguen siendo alcanzables (incluidos los tres nuevos objetos).
let r=0,botin=[];
Object.assign(c,{Math:{random:()=>r},burst:()=>{},putPickup:o=>botin.push(o.k),dropGem:()=>botin.push('xp'),rnd:()=>0});
vm.runInContext(tramo('function crateLoot','function crateTick'),c);
for(const [azar,tipo,cantidad] of [[.01,'dball',1],[.10,'chest',1],[.20,'senzu',1],[.35,'capsulaVida',1],[.45,'capsulaKi',1],[.55,'radar',1],[.65,'xp',6],[.9,'zeni',3]]){
  r=azar;botin=[];c.S.balls=0;c.S.ballN=0;vm.runInContext('crateLoot({x:0,y:0})',c);
  assert.equal(botin.length,cantidad,tipo);assert(botin.every(x=>x===tipo),tipo);
}
const aviso={hidden:true};Object.assign(c,{radarAviso:aviso,state:'play',pickups:[]});
vm.runInContext(tramo('function actualizarRadarAnimado','const DBIMG'),c);
vm.runInContext('actualizarRadarAnimado()',c);assert.equal(aviso.hidden,false);
c.S.t=17;vm.runInContext('actualizarRadarAnimado()',c);assert.equal(aviso.hidden,true);
c.pickups.push({k:'dball',radar:1});vm.runInContext('actualizarRadarAnimado()',c);assert.equal(aviso.hidden,false);
c.state='pause';vm.runInContext('actualizarRadarAnimado()',c);assert.equal(aviso.hidden,true);
assert(!src.includes("fetch('sprites/manifest.json')"),'Los créditos deben funcionar con doble clic');
console.log('OK: 5 imágenes sin red, 2 créditos, curación limitada, ki listo, radar, 8 ramas de botín y visibilidad en pausa.');
