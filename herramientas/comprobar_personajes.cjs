// Comprueba que las animaciones nuevas tienen personaje, formas y ataques en el juego.
// Uso: node herramientas/comprobar_personajes.cjs gokubroly vegetamanga ...
// Sin argumentos revisa el registro de todos los personajes de NUEVOS.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'02 - Código del juego/script.js'),'utf8');
function tramo(a,b){const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i,a);return src.slice(i,j)}
const c=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(raiz,'02 - Código del juego/animaciones_juego.js'),'utf8'),c);
vm.runInContext(tramo('const NUEVOS={','// formas añadidas'),c);
vm.runInContext(tramo('const MV={','const UNLOCK_LV='),c);
const {NUEVOS,MV,SIGS,A}=vm.runInContext('({NUEVOS,MV,SIGS,A:window.ANIM_SET.h})',c);
const estricto=process.argv.slice(2),ids=estricto.length?estricto:Object.keys(NUEVOS);
let formas=0;
for(const id of ids){
  const n=NUEVOS[id];assert(n,`${id}: falta el registro en NUEVOS`);assert(A[id],`${id}: falta ANIM_SET`);
  assert.equal(Object.keys(A[id]).length,n.forms.length,`${id}: número de formas`);
  assert.equal(n.aura.length,n.forms.length,`${id}: auras`);
  for(const a of n.aura)assert(['white','gold','red','blue','green','purple','orange','silver'].includes(a),`${id}: aura ${a}`);
  for(const ataque of [n.start,...SIGS[id]])assert(MV[ataque],`${id}: ataque inexistente ${ataque}`);
  for(let f=0;f<n.forms.length;f++){
    const forma=A[id][f];assert(forma,`${id}: forma ${f} sin animaciones`);assert(forma.portrait,`${id}/${f}: retrato`);
    for(const nombre of ['Idle','Walk','Attack','Kick','Cast','Pow','Hurt',...(estricto.length?['Faint']:[])]){
      const a=forma.anims[nombre];assert(a,`${id}/${f}: ${nombre}`);
      assert(a.du.length&&a.du.every(d=>d>0),`${id}/${f}: duraciones ${nombre}`);
      const png=Buffer.from(a.url.split(',')[1],'base64');
      assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
      assert.equal(png.readUInt32BE(16),a.w*a.du.length,`${id}/${f}: ancho ${nombre}`);
      assert.equal(png.readUInt32BE(20),a.h,`${id}/${f}: alto ${nombre}`);
      if(estricto.length){
        const limites={Idle:[1,3],Walk:[1,2],Attack:[3,5],Kick:[2,4],Cast:[2,2],Pow:[2,4],Hurt:[2,2]};
        if(limites[nombre]){const [min,max]=limites[nombre];assert(a.du.length>=min&&a.du.length<=max,`${id}/${f}: cantidad de ${nombre}`)}
      }
    }
    formas++;
  }
}
console.log(`${ids.length} personajes y ${formas} formas: registro, retratos, ataques, duraciones y tiras correctos.`);
console.log('Esta comprobación no sustituye revisar los PNG ni jugar una partida.');
