// Comprueba el deseo de transformación: las formas se desbloquean pidiéndoselas a Shenron en el menú.
// Uso: node herramientas/comprobar_formas.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'02 - Código del juego/script.js'),'utf8');
function tramo(desde,hasta){const a=src.indexOf(desde),b=src.indexOf(hasta,a);assert(a>=0&&b>a,`No se encuentra ${desde}`);return src.slice(a,b)}
let save={},escrito=0;
const c=vm.createContext({Math,HEROES:{goku:{name:'GOKU',forms:['BASE','SUPER SAIYAN','SSJ2','SSJ3']},a16:{name:'ANDROIDE 16',forms:['BASE']}},
  FORM_LV:[0,10,20,30,40],loadSave:()=>save,writeSave:()=>escrito++,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
  stats:()=>({maxhp:100}),cam:{shake:0},sfx:()=>{},burst:()=>{}});
vm.runInContext(tramo('const FORMA_TK=','// ---------- fin del deseo de transformación')+';this.FORMA_TK=FORMA_TK',c);
{const a=src.indexOf('function checkForm('),fin="'#fff6a8'])}}",b=src.indexOf(fin,a);assert(a>=0&&b>a,'No se encuentra checkForm');vm.runInContext(src.slice(a,b+fin.length),c)}

// Sin deseo pedido, solo la forma base
assert.equal(c.formasAbiertas('goku'),0);
save={formas:{goku:9}};assert.equal(c.formasAbiertas('goku'),3,'no se limita a las formas que existen');
// Pedir el deseo: cuesta FORMA_TK por la 1ª forma, el doble por la 2ª…; sin tickets no hace nada
save={tickets:4};escrito=0;assert.equal(c.pedirForma('goku'),'faltan');assert.equal(save.tickets,4);assert.equal(escrito,0);
save={tickets:20};assert.equal(c.costeForma('goku'),c.FORMA_TK);
assert.equal(c.pedirForma('goku'),'ok');assert.equal(save.tickets,20-c.FORMA_TK);assert.equal(save.formas.goku,1);assert.equal(escrito,1);
assert.equal(c.costeForma('goku'),2*c.FORMA_TK);
save={tickets:999,formas:{goku:3}};assert.equal(c.pedirForma('goku'),'todas');assert.equal(save.tickets,999);
assert.equal(c.pedirForma('a16'),'todas','un personaje sin transformaciones no gasta tickets');
// En partida: el nivel solo transforma hasta las formas despertadas, y avisa una vez de que falta el deseo
const partida=(formas)=>{save={formas};c.S={hid:'goku',forms:0};c.P={lvl:25,form:0,hp:1};c.checkForm();return{form:c.P.form,banner:c.S.banner}};
{const r=partida({});assert.equal(r.form,0,'se transforma sin haber pedido el deseo');assert.match(r.banner.sub,/SHENRON/i);
  c.S.banner=null;c.checkForm();assert.equal(c.S.banner,null,'repite el aviso');}
assert.equal(partida({goku:1}).form,1);
assert.equal(partida({goku:3}).form,2,'el nivel 25 no debe dar más de la 2ª forma');
// La pantalla de Shenron tiene el botón y lo prepara al abrirse
assert(fs.readFileSync(path.join(raiz,'index.html'),'utf8').includes('id="gForma"'),'falta el botón #gForma');
assert(tramo('function openGacha(','\n').includes('formaUI()'),'openGacha no prepara el botón');
assert(tramo('function formaUI(','\n').includes('companion()'),'formaUI no usa el compañero del menú (sel puede no existir)');
console.log('Deseo de transformación correcto');
