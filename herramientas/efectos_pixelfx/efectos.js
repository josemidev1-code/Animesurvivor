// Puente entre pixelfx (github.com/patch-gg/pixelfx, MIT) y AnimeSurvivor.
// Se empaqueta con esbuild en "02 - Código del juego/efectos_pixelfx.js" (un solo archivo, sin módulos ni fetch,
// para que el juego siga abriéndose con doble clic). Expone window.PFX.
import { createFrame, clearFrame, createFx, composite } from "pixelfx";
import * as plasma from "pixelfx/fx/explosions/plasma-explosion";
import * as implosion from "pixelfx/fx/explosions/implosion";
import * as mana from "pixelfx/fx/arcane/mana-burst";
import * as spark from "pixelfx/fx/impacts/hit-spark";
import * as crit from "pixelfx/fx/impacts/crit-hit";

const LIB = { plasma, implosion, mana, spark, crit };
// tope de efectos vivos por tipo: en plena horda no se acumulan cientos
const CAP = { plasma: 10, implosion: 4, mana: 6, spark: 14, crit: 6 };
const MAX_T = { plasma: 1.2, implosion: 1.7, mana: 1.3, spark: 0.5, crit: 0.8 };

// rampa oscuro→claro a partir de los colores de la técnica del juego (que ya van de oscuro a claro)
const hexN = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return parseInt(h, 16); };
const toHex = (n) => "#" + n.toString(16).padStart(6, "0");
const mixHex = (a, b, k) => {
  const A = hexN(a), B = hexN(b);
  const ch = (s) => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k) << s;
  return toHex(ch(16) | ch(8) | ch(0));
};
function ramp(cols) {
  const c = (cols || []).filter((x) => typeof x === "string" && /^#[0-9a-f]{3,6}$/i.test(x));
  if (!c.length) return undefined;
  // sin tonos casi negros: pixelfx está pensado para fondos oscuros y en la hierba se verían como manchas
  return [mixHex(c[0], "#000000", 0.3), ...c, "#ffffff"];
}

let live = [], seed = 1;
function spawn(id, x, y, o = {}) {
  const mod = LIB[id]; if (!mod) return null;
  if (live.filter((e) => e.id === id).length >= CAP[id]) return null;
  const [w, h] = mod.meta.size, [ox, oy] = mod.meta.origin;
  const opts = { x: ox, y: oy, seed: seed++ };
  if (o.flip) opts.flip = true;
  if (o.cols) { const r = ramp(o.cols); if (r) { opts.palette = r; if (mod.meta.options && mod.meta.options.accent) opts.accent = r.slice(1); } }
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const e = { id, x, y, ox, oy, t: 0, fx: createFx(mod, opts), frame: createFrame(w, h), cv, g: cv.getContext("2d"), img: new ImageData(w, h), max: MAX_T[id] };
  live.push(e);
  return e;
}

window.PFX = {
  // explosión de ki (Big Bang, Masenko, Genkidama, Death Ball...): rad = radio de daño del juego
  boom(x, y, rad, cols) { return !!spawn("plasma", x, y, { cols }); },
  // técnicas de área alrededor del personaje
  nova(x, y, rad, cols, tipo) { return !!spawn(tipo === "hakai" ? "implosion" : tipo === "final" ? "plasma" : "mana", x, y, { cols: tipo === "hakai" ? null : cols }); },
  // golpe cuerpo a cuerpo: chispa en cada golpe, golpe crítico en el último del combo
  hit(x, y, dir, last) { return !!spawn(last ? "crit" : "spark", x, y, { flip: dir < 0 }); },
  update(dt) {
    for (const e of live) { e.t += dt; e.fx.update(dt); if (e.t > e.max - 0.3) e.fx.stop(); }
    live = live.filter((e) => e.t < e.max && !e.fx.done());
  },
  draw(ctx, X, Y) {
    for (const e of live) {
      clearFrame(e.frame); e.fx.draw(e.frame); composite(e.frame, e.img.data, null);
      e.g.putImageData(e.img, 0, 0);
      ctx.drawImage(e.cv, Math.round(X(e.x) - e.ox), Math.round(Y(e.y) - e.oy));
    }
  },
  clear() { live = []; },
  get n() { return live.length; },
};
