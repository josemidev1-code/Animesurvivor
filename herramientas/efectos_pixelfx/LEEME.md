# Efectos de pixelfx

`efectos.js` es el puente entre [pixelfx](https://github.com/patch-gg/pixelfx) (MIT, por Patch; método de Hugo Duprez)
y el juego. Se empaqueta en un solo archivo, `02 - Código del juego/efectos_pixelfx.js`, que define `window.PFX`.
Así el juego sigue funcionando con doble clic (sin módulos ni fetch).

Qué hace ahora (prueba del 4 nov. 2026):

| Momento del juego | Efecto de pixelfx | Dónde se llama en `script.js` |
|---|---|---|
| Explosiones de ki (`explode`: Big Bang, Masenko, Genkidama, Death Ball…) | `explosions/plasma-explosion`, con los colores de la técnica | `explode()` |
| Hakai | `explosions/implosion` | `fireSig()`, rama `nova` |
| Final Explosion y Autodestrucción | `explosions/plasma-explosion` | `fireSig()`, rama `nova` |
| Otras técnicas de área (Gigantic Roar, Kill Driver…) | `arcane/mana-burst` | `fireSig()`, rama `nova` |
| Cada golpe del combo que toca | `impacts/hit-spark`; el último, `impacts/crit-hit` | `update`, bloque `P.combo` |

Hay un tope de efectos vivos por tipo (`CAP`) y una duración máxima (`MAX_T`). Si `efectos_pixelfx.js` no carga,
el juego usa sus efectos de siempre.

## Volver a generarlo (después de cambiar `efectos.js`)

Dentro de esta carpeta, con Node instalado:

```
npm i github:patch-gg/pixelfx esbuild
npx esbuild efectos.js --bundle --minify --format=iife --legal-comments=none --outfile="../../02 - Código del juego/efectos_pixelfx.js"
```

Después sube `efectos_pixelfx.js?v=` en `index.html`. Generado con pixelfx `a841596` (31 oct. 2026); la librería
tiene pocos días y puede cambiar.
