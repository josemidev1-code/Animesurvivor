// Comprueba los ajustes del cuerpo a cuerpo (MELEE_AJ) y que el juego los usa.
// Uso: node herramientas/comprobar_combate.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'02 - Código del juego/script.js'),'utf8');
function tramo(desde,hasta){const a=src.indexOf(desde),b=src.indexOf(hasta,a);assert(a>=0&&b>a,`No se encuentra ${desde}`);return src.slice(a,b)}
const c=vm.createContext({});
vm.runInContext(tramo('const MELEE_AJ=','\n')+';this.AJ=MELEE_AJ',c);
assert.deepEqual({...c.AJ},{sinDisparo:60,guardaExtra:0.25,empuje:0.6,aturde:0.2,parada:20});
// Cada valor se usa en el juego y los números antiguos ya no están.
for(const k of Object.keys(c.AJ))assert(src.includes('MELEE_AJ.'+k),`script.js no usa MELEE_AJ.${k}`);
for(const viejo of ['P.iframe=Math.max(P.iframe,0.3)','last?1:0.25','tx=t.x-d*14','if(d<170)eshot'])
  assert(!src.includes(viejo),`Sigue el valor antiguo: ${viejo}`);
console.log('Combate: ajustes del cuerpo a cuerpo correctos');
