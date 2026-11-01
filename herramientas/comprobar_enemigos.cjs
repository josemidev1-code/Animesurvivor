// Auditoría sin navegador: ejecuta las tablas y el director reales, con dibujo/sonido simulados.
// Uso: node herramientas/comprobar_enemigos.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'02 - Código del juego/script.js'),'utf8');
function tramo(desde,hasta){const a=src.indexOf(desde),b=src.indexOf(hasta,a);assert(a>=0&&b>a,`No se encuentra ${desde}`);return src.slice(a,b)}
const c=vm.createContext({window:{},SPRITES_DATA:[],SPR:{},console,Set,Math});
vm.runInContext(fs.readFileSync(path.join(raiz,'02 - Código del juego/animaciones_juego.js'),'utf8'),c);
vm.runInContext(`var ANIM_SET=window.ANIM_SET,HDEF={};
  for(const id in ANIM_SET.h){const f=Object.keys(ANIM_SET.h[id]).map(Number);HDEF[id]={forms:Array(Math.max(...f)+1)}}`,c);
vm.runInContext(tramo('const ET={','// ---------- audio ----------'),c);
vm.runInContext(tramo('const SCPACK=','// v13:'),c);
vm.runInContext(tramo('// hand-picked animations','// big face of a form'),c);
vm.runInContext(tramo("Object.assign(SCPACK.e,{frieza:",'function scLoad'),c);
vm.runInContext(tramo('function scKeyE','// enemigos que ya son'),c);
vm.runInContext(tramo('const ENEMIGO_HEROE=','const SCTINT='),c);
const datos=vm.runInContext('({ET,MAPS,WAVES,FUERA_ENEMIGOS,scKeyE,SCPACK,ANIM_SET})',c);
for(const [id,t] of Object.entries(datos.ET)){
  if(id==='crate'||id==='shadow')continue;
  const key=datos.scKeyE(id);assert(key.startsWith('as-'),`${id}: tira vieja ${key}`);
  const a=datos.SCPACK.s[key];
  for(const n of ['Idle','Walk','Attack','Kick','Cast','Pow','Hurt']){
    assert(a[n],`${id}: falta ${n}`);assert(a[n][2].length>0);assert(a[n][3].startsWith('data:image/png;base64,'));
  }
}
for(const [id,m] of Object.entries(datos.MAPS)){
  assert.equal(m.bosses.length,5,id);assert.equal(m.ring.length,2,id);
  assert(m.pool.some(p=>p[0]===0&&!datos.ET[p[1]].elite),`${id}: inicio sin enemigos normales`);
  for(const p of m.pool)assert(datos.ET[p[1]],`${id}: ${p[1]}`);
  for(const b of m.bosses)assert(datos.ET[b]?.boss,`${id}: jefe ${b}`);
  for(const e of [...m.ring,...(m.squad?.[1]||[])])assert(datos.ET[e],`${id}: ${e}`);
}
for(const w of Object.values(datos.WAVES)){assert(w.length);for(const [id] of w)assert(datos.ET[id])}
// Recorre 16 minutos de cada mapa: población, anillos, escuadrones, oleadas y cinco jefes.
let apariciones=0,jefes=0;
Object.assign(c,{
  rnd:(a,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),TAU:Math.PI*2,VW:480,VH:270,
  P:{x:0,y:0,lvl:1},DIFF:[{sp:1}],enemies:[],cam:{},sfx:()=>{},
  spawn:(id)=>{assert(datos.ET[id],`Invocación retirada: ${id}`);apariciones++;return{}},
  spawnBoss:(id)=>{assert(datos.ET[id]?.boss,id);jefes++},
});
vm.runInContext(tramo('function pickType','function spawnBoss'),c);
for(const map of Object.keys(datos.MAPS)){
  c.S={map,t:0,spawnT:0,diff:0,bossIdx:0,ringIdx:0,waveIdx:0,squadDone:0};
  for(let t=0;t<=960;t++){c.S.t=t;vm.runInContext('director(1)',c)}
  assert.equal(c.S.bossIdx,5,map);
}
assert.equal(jefes,Object.keys(datos.MAPS).length*5);
// Sin PNG listo, no se llama a las antiguas rutinas que dibujaban cuerpos por código.
let listo=false;const real={fr:[{}],h:26};
Object.assign(c,{mk:()=>({}),myEnemy:()=>null,scEnemy:()=>listo?real:null});
vm.runInContext(tramo('function enemySprite','// ---------- Namek tiles'),c);
assert.equal(vm.runInContext("enemySprite('saiba').pending",c),1);
assert.equal(vm.runInContext("enemySprite('kidbuuE').pending",c),1);
listo=true;
assert.equal(vm.runInContext("enemySprite('kidbuuE')",c),real);
assert.equal(vm.runInContext("enemySprite('saiba')",c),real);
// Lejos del jugador se impulsa hacia él (vuelo); cerca, con un solo frame de vuelo, guarda la guardia.
let dibujado;
Object.assign(c,{ctx:{drawImage:im=>{dibujado=im}},ebeams:[],scFrame:()=>0});
vm.runInContext(tramo('function drawPkEnemy','function drawSprite'),c);
for(const frames of [1,2])for(const x of [200,20]){
  const idle={width:30,height:50,tipo:'guardia'},vuelo={...idle,tipo:'vuelo'};
  c.e={type:'saiba',x,y:0,r:6,anim:0,flash:0,spr:{pk:{Walk:{R:Array(frames).fill(vuelo),L:Array(frames).fill(vuelo)},Idle:{R:[idle],L:[idle]}}}};
  vm.runInContext('drawPkEnemy(e,0,0)',c);assert.equal(dibujado.tipo,frames===1&&x<48?'guardia':'vuelo');
}
console.log(`${Object.keys(datos.MAPS).length} mapas · ${jefes} jefes · ${apariciones} apariciones simuladas sin tipos retirados.`);
console.log(`${Object.keys(datos.ET).length-2} tipos de enemigo con animaciones seleccionadas; ${Object.keys(datos.FUERA_ENEMIGOS).length} retirados.`);
console.log('Carga diferida, recuperación de alias y selección de guardia: correctas. No sustituye una partida visual.');
console.log('Retirados:',JSON.stringify(datos.FUERA_ENEMIGOS));
