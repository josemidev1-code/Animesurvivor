// Comprueba los tipos de enemigo (pegador, embestidor, tirador, élite) con la lógica real de script.js.
// Uso: node herramientas/comprobar_roles.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'02 - Código del juego/script.js'),'utf8');
function tramo(desde,hasta){const a=src.indexOf(desde),b=src.indexOf(hasta,a);assert(a>=0&&b>a,`No se encuentra ${desde}`);return src.slice(a,b)}
let golpes=[];
const c=vm.createContext({Math,ET:{saiba:{spd:32},celljr:{spd:50},soldier:{spd:28,shoot:3.6},vegetaE:{elite:1,shoot:1.8,spd:56},sb:{kami:1,spd:40},cell:{boss:1,spd:50}},
  hitPlayer:(d,big)=>golpes.push(d),parts:[],texts:[],sfx:()=>{},cam:{shake:0}});
vm.runInContext(tramo('const ROL_AJ=','// ---------- fin de los tipos de enemigo')+';this.ROL_AJ=ROL_AJ',c);
const A=c.ROL_AJ,dt=1/30;
const en=(type,x=0)=>({type,x,y:0,r:7,dmg:10,spd:c.ET[type].spd});
// paso: el jugador está en (px,0); devuelve la velocidad que pide el tipo (o null = perseguir como siempre)
const paso=(e,px)=>{const dx=px-e.x,dy=0,d=Math.hypot(dx,dy)||1;return c.rolAI(e,d,dx,dy,dt)};
const durante=(e,px,seg)=>{let v;for(let i=0;i<Math.round(seg/dt);i++)v=paso(e,px);return v};

// Tipos
assert.equal(c.rolE(en('saiba')),'pegador');assert.equal(c.rolE(en('celljr')),'embestidor');
assert.equal(c.rolE(en('soldier')),'tirador');assert.equal(c.rolE(en('vegetaE')),'elite');
assert.equal(c.rolE(en('sb')),'kami');assert.equal(c.rolE(en('cell')),'jefe');

// Pegador: lejos persigue; cerca se para, avisa y golpea una vez al acabar el aviso
{const e=en('saiba');assert.equal(paso(e,100),null);
  golpes=[];assert.deepEqual([...paso(e,20)],[0,0]);assert.equal(e.atk.f,'aviso');
  durante(e,20,A.aviso-0.1);assert.equal(golpes.length,0,'golpea antes de acabar el aviso');
  durante(e,20,0.2);assert.deepEqual(golpes,[10],'no golpea al acabar el aviso');
  durante(e,20,0.3);assert.equal(golpes.length,1,'golpea más de una vez seguida');}
// Pegador: si te apartas durante el aviso, falla
{const e=en('saiba');golpes=[];paso(e,20);durante(e,80,A.aviso+0.2);assert.equal(golpes.length,0,'acierta aunque te hayas apartado');}
// Aturdido: cancela el aviso
{const e=en('saiba');paso(e,20);e.stun=0.2;c.rolCancel(e);assert.equal(e.atk,null);}

// Élite: avisa menos y encadena golpes separados lo bastante para que cada uno cuente
{const e=en('vegetaE');golpes=[];paso(e,20);assert.equal(e.atk.t,A.avisoE);durante(e,20,3);assert.equal(golpes.length,A.golpesE);
  assert(A.encadena+A.golpe>=0.6,'los golpes encadenados caen dentro de la invulnerabilidad del jugador');}

// Embestidor: se carga sin moverse y luego embiste en la dirección fijada al empezar
{const e=en('celljr');golpes=[];assert.deepEqual([...paso(e,80)],[0,0]);assert.equal(e.atk.f,'carga');
  durante(e,80,A.cargaAviso-0.05);const v=durante(e,-80,0.1);assert.equal(e.atk.f,'embiste');
  assert(v[0]>0&&Math.abs(Math.hypot(v[0],v[1])-A.cargaVel)<1e-6,'no embiste recto hacia donde apuntó');}
// Embestidor: acierta una sola vez si te pilla
{const e=en('celljr');golpes=[];paso(e,80);durante(e,80,A.cargaAviso+0.01);e.x=75;durante(e,80,0.2);assert.deepEqual(golpes,[10]);}

// Tirador: demasiado cerca retrocede; a media distancia no se acerca más; lejos persigue
{const e=en('soldier');const v=paso(e,50);assert(v[0]<0,'no retrocede');
  const m=paso(e,120);assert(m&&m[0]<=0,'se acerca a media distancia');assert.equal(paso(e,300),null);}

// Kamikaze y jefes conservan su lógica
assert.equal(paso(en('sb'),20),null);assert.equal(paso(en('cell'),20),null);
// Roce: quita vida continua sin dar invulnerabilidad; con invulnerabilidad no quita nada; si te deja a 0 pasa por hitPlayer (muerte o semilla)
{const r=vm.createContext({P:{hp:50,iframe:0,hitT:0},state:'play',hitPlayer:()=>{r.muerto=1}});
  vm.runInContext(tramo('function roce(','\n'),r);
  r.roce(5);assert.equal(r.P.hp,45);assert.equal(r.P.iframe,0,'el roce da invulnerabilidad');
  r.P.iframe=0.3;r.roce(5);assert.equal(r.P.hp,45,'el roce atraviesa la invulnerabilidad');
  r.P.iframe=0;r.roce(100);assert.equal(r.muerto,1,'el roce mortal no pasa por hitPlayer');}
// El bucle de enemigos usa los tipos, el aturdimiento cancela su ataque y el contacto normal es roce
for(const s of ['rolCancel(e);e.stun-=dt','const v=rolAI(e,d,dx,dy,dt)','roce(e.dmg*ROL_AJ.roce*dt)'])assert(src.includes(s),`script.js no contiene ${s}`);
// Tope de balas enemigas en pantalla (la lluvia de bolas era imposible de esquivar)
assert(Number.isFinite(A.maxBalas)&&A.maxBalas>0,'falta ROL_AJ.maxBalas');
assert(src.includes('eshots.length<ROL_AJ.maxBalas'),'los enemigos disparan sin tope de balas');
// El dibujo del enemigo solo usa variables que existen dentro de drawPkEnemy (time es local de render)
assert(!/\btime\b/.test(tramo('function drawPkEnemy','function drawSprite')),'drawPkEnemy usa time, que no existe ahí');
console.log('Tipos de enemigo correctos');
