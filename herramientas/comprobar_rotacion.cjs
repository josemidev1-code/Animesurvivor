// Regresión del planificador: usa las definiciones y funciones reales del juego.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'02 - Código del juego/script.js'),'utf8');
function section(a,b){const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i,a);return src.slice(i,j)}
const fired=[],c=vm.createContext({window:{},Math,Set,console});
vm.runInContext(section('const NUEVOS={','// formas añadidas'),c);
vm.runInContext(section('const MV={','const UNLOCK_LV='),c);
Object.assign(c,{S:{hid:'goku'},P:{x:0,y:0,sel:0,sigU:6,sigB:[],lvl:1,sigN:6,sigT:0},
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),fxSl:[],fxRg:[],FO:null,
 nearest:()=>({x:90,y:0}),fire:(id,m,st)=>{assert(Number.isFinite(st.dmg));fired.push(id)},
 sfx:()=>{},state:'play'});
vm.runInContext(section('function sigList','function fireSig'),c);
for(let i=0;i<1200;i++)vm.runInContext('sigUpdate(1/60,{cd:1,dmg:1,area:1})',c);
assert.deepEqual([...new Set(fired)].sort(),['kiblast','kame','punch','kaioken','instant','genki'].sort());
assert(fired.filter(x=>x==='kiblast').length>3,'El ataque base debe repetirse');
// Ninguna técnica se emite mientras una animación de rayo está ocupada.
c.P.pend=null;const n=fired.length;c.P.cast={};for(let i=0;i<120;i++)vm.runInContext('sigUpdate(1/60,{cd:1,dmg:1,area:1})',c);
assert.equal(fired.length,n);assert.equal(c.P.sigTimers.kiblast,0,'La recarga debe avanzar durante el rayo');
c.P.cast=null;c.P.sigTimers.genki=0;vm.runInContext('sigSelect(5);sigUpdate(1/60,{cd:1,dmg:1,area:1})',c);
assert.equal(c.P.pend.id,'genki','La selección prioriza la técnica sin eliminar las otras');
const {MV,SIGS}=vm.runInContext('({MV,SIGS})',c);
for(const [id,L] of Object.entries(SIGS))for(const move of L){assert(MV[move],id+': '+move);for(let l=1;l<=5;l++)assert(Number.isFinite(MV[move].st(l).dmg),id+': daño no finito')}
assert.equal(SIGS.bulma[0],'bulmagun');assert(!SIGS.videl.includes('kame'));assert(SIGS.granola.includes('granolasnipe'));
console.log('Rotación: seis técnicas, recargas durante animaciones, prioridad y daño finito correctos.');
