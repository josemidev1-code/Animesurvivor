// Utilidades generales del juego; cargar antes de script.js.
window.AS_UTILS=(()=>{
'use strict';
const rnd=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const TAU=Math.PI*2;
function h2(x,y,s=0){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,982451653))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=h2(xi,yi,s),b=h2(xi+1,yi,s),c=h2(xi,yi+1,s),d=h2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const fbm=(x,y,s)=>vnoise(x,y,s)*0.65+vnoise(x*2.3,y*2.3,s+7)*0.35;
function hex(c){const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function srand(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296}}

return {rnd,clamp,TAU,h2,vnoise,fbm,hex,mk,srand};
})();
