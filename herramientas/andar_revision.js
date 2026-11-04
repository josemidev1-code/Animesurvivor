// Hoja de revisión del andar (4 nov. 2026). Se carga en la página del juego servida por HTTP local:
//   const s=document.createElement('script');s.src='herramientas/andar_revision.js';document.head.appendChild(s);
//   await hojaAndar([['goku',0],['goku',1]])  -> dataURL de la hoja
// Cada fila: guardia con la cintura (rojo) y el hueco entre pies (azul) | piernas reconocidas (rojo/azul) | pasos 0, 2, 4 y 6 |
// disparando andando (paso 2 recto y paso 6 apuntando -40°). Los ajustes salen de window.ANDAR (andar.js).
window.hojaAndar = async function (lista, k = 3) {
  const AS = window.AS, W = ms => new Promise(r => setTimeout(r, ms));
  const ld = lista.map(([h, f]) => AS.scLoad(AS.SCPACK.h[h][f]));
  for (let i = 0; i < 60 && ld.some(o => !o.ok); i++) await W(100);
  const CW = 80, CH = 80, COLS = 8;
  const out = document.createElement('canvas'); out.width = (COLS * CW + 110) * k; out.height = lista.length * CH * k;
  const g = out.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#46a37f'; g.fillRect(0, 0, out.width, out.height);
  const pon = (c, col, row, dy = 0) => g.drawImage(c, (110 + col * CW + CW / 2 - c.width / 2) * k, (row * CH + CH - 4 - c.height + dy) * k, c.width * k, c.height * k);
  lista.forEach(([h, f], row) => {
    const o = ld[row]; if (!o.ok) return; const cfg = AS.walkCfg(h, f), BA = o[(cfg.base || [])[0]] || o.Idle,
      base = BA.R[Math.min((cfg.base || [])[1] || 0, BA.R.length - 1)], wk = AS.walkCycle(base, cfg);
    g.fillStyle = '#000'; g.fillRect(0, row * CH * k, 110 * k, CH * k); g.fillStyle = '#fff'; g.font = (11 * k) + 'px monospace';
    g.fillText(h + '/' + f, 4 * k, (row * CH + 16) * k); g.font = (8 * k) + 'px monospace';
    g.fillText(JSON.stringify(cfg).slice(0, 22), 4 * k, (row * CH + 30) * k); g.fillText(JSON.stringify(cfg).slice(22, 44), 4 * k, (row * CH + 40) * k);
    // guardia con líneas
    pon(base, 0, row);
    const x0 = 110 + CW / 2 - base.width / 2, yTop = row * CH + CH - 4 - base.height;
    if (wk.hip != null) { g.fillStyle = 'rgba(255,0,0,.8)'; g.fillRect(x0 * k, (yTop + wk.hip) * k, base.width * k, k) }
    // piernas reconocidas: pierna 1 en rojo, pierna 2 en azul (tronco con sus colores)
    const d = base.getContext('2d').getImageData(0, 0, base.width, base.height).data, t = document.createElement('canvas');
    t.width = base.width; t.height = base.height; const tg = t.getContext('2d'), id = tg.createImageData(base.width, base.height);
    for (let p = 0; p < base.width * base.height; p++) { if (d[p * 4 + 3] < 40) continue; const L = wk.lab ? wk.lab[p] : 0, y = (p / base.width) | 0;
      const leg = wk.hip != null && y >= wk.hip ? (L || 0) : 0;
      id.data[p * 4] = leg === 1 ? 230 : leg === 2 ? 50 : d[p * 4]; id.data[p * 4 + 1] = leg ? 60 : d[p * 4 + 1]; id.data[p * 4 + 2] = leg === 1 ? 50 : leg === 2 ? 230 : d[p * 4 + 2]; id.data[p * 4 + 3] = 255 }
    tg.putImageData(id, 0, 0); pon(t, 1, row);
    [0, 2, 4, 6].forEach((i, j) => pon(wk[i], 2 + j, row));
    // disparando andando
    const cast = o.Beam || o.Cast; if (cast && wk.hip != null) [[2, 0], [6, -0.7]].forEach(([i, r], j) => {
      const wf = wk[i], L = AS.bodySplit(wf, cfg.cadera), U = AS.bodySplit(cast.R[Math.min(1, cast.R.length - 1)], cfg.cadera), up = AS.rotSpr(U.up, r);
      const cx = 110 + (6 + j) * CW + CW / 2, ly = row * CH + CH - 4 - wf.height;
      const lx = cx - wf.width / 2, hx = lx + L.cx, ofs = U.cx - cast.R[0].width / 2;
      g.drawImage(L.low, lx * k, ly * k, wf.width * k, wf.height * k);
      g.drawImage(up, (hx - up.width / 2 - ofs * Math.cos(r)) * k, (ly + L.hip - up.height / 2 - ofs * Math.sin(r)) * k, up.width * k, up.height * k);
    });
    g.fillStyle = 'rgba(255,0,0,.5)'; g.fillRect(110 * k, (row * CH + CH - 4) * k, COLS * CW * k, k);
  });
  return out.toDataURL();
};
