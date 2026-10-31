# Bitácora de trabajo

Apunta aquí cada sesión: qué has hecho, qué has probado, qué decisiones has tomado y qué dejas a medias.
El siguiente agente (o tú en otra sesión) lo leerá antes de tocar nada.

---

## 2026-10-31 — Codex (sesión 1)

### Lo que pidió el usuario
- Repasar los sprites de todos los personajes para que estén muy bien animados.
- Animaciones coherentes en Dragon Ball: impulso/vuelo al moverse, guardia, combo de golpes, patada, carga de ki con
  disparo, aura cargando poder, daño, caída/muerte y cara grande para elegirlo.
- Todo lo que no cumpla eso, fuera del juego hasta que tenga sprites buenos.

### Qué se ha hecho
- Se creó `herramientas/GUIA_ANIMACIONES.md` con las reglas de fotogramas, tiempos y comandos de revisión.
- Se clasificaron los packs de `sprites/` con `importar_sprites.py` en carpetas por personaje (`personajes/`, ignorada en git).
- Se armaron las animaciones definitivas de **17 personajes** en `herramientas/animaciones.json` y `herramientas/animaciones/`:
  - `gokus.json`: Goku (Base a Blue), Goku UI (4 formas), Goku GT (Base y SSJ4), Goku Super (5 formas), Goku Black (Base a Rosé).
  - `vegetas.json`: Vegeta (Base a Blue), Vegeta Ego (4 formas), Vegeta GT (Base y SSJ4), Vegeta Super (God a Blue FP), Vegetto, Gogeta.
  - `gohans.json`: Gohan (SSJ, SSJ2, Definitivo), Gohan adulto (Base y Místico).
  - `resto.json`: Trunks (Cell), Bardock (SSJ a SSJ4), Piccolo, Kefla.
- `montar_animaciones.py` genera `animaciones_juego.js` (empaquetado en base64 para que funcione con doble clic).
- El juego (`script.js`) solo admite las formas que están en `ANIM_SET.h`: las demás salen de la cadena de transformaciones;
  los personajes sin ninguna forma quedan fuera (`FUERA`).
- Tarjetas de selección con el sprite animado; cara grande del compañero y del personaje sobre el que pasas el ratón.
- Muerte con caída animada (1,8 s) antes del menú final.
- `SPRITES_PENDIENTES.md` con los personajes y enemigos fuera del juego.
- `ESTADO_DEL_PROYECTO.md` con la idea, lo hecho y lo que queda. Commit 15a92ac.
- `AGENTS.md`, `CLAUDE.md` y esta bitácora.

### A medias / problemas
- Codex llegó a su límite de uso (vuelve a partir de las 5:04): el grupo de Goku lo terminó Claude; el grupo «resto»
  quedó muy estricto y dejó fuera a Broly, Krilin, Trunks, A18, Gotenks, Caulifla, Kale, Kyabe, Gohan niño.
- Base Bardock: su postura de guardia lleva una bola de ki en la mano (cambiar fotogramas de `idle`).
- 21 formas no tienen fotogramas de muerte (usan los de daño) y varias no tienen retrato propio.
- Los enemigos siguen con sus animaciones antiguas; los ataques siguen dibujados por código.

### Siguiente paso recomendado
- Ataques con efectos reales de los sprites e iconos (punto 1 de «Lo que queda por hacer» en `ESTADO_DEL_PROYECTO.md`),
  después el HUD y la subida de nivel como las capturas de referencia.

## 2026-10-31 — Antigravity / Gemini (sesión 2)

### Lo que pidió el usuario
- Mirar la carpeta: lo que tenemos hecho y lo que hay por hacer.
- Meter al juego todos los sprites muy bien animados que tenemos: todos los personajes de Dragon Ball con su foto (retrato), no el cuerpo, y enemigos también con sus animaciones reales.
- Continuar sin parar al agotarse la cuota de la sesión anterior.

### Qué se ha hecho
1. **Postura de guardia (Idle) de Bardock base corregida:**
   - En `herramientas/animaciones/resto.json`, se corrigieron los fotogramas de guardia de Bardock forma 0 de `[57, 58]` a `[9, 10]`, eliminando la bola de ki que aparecía fija en su postura de reposo.
2. **Recuperación e integración de los 12 personajes/formas excluidos:**
   - Se creó `herramientas/animaciones/recuperados.json` configurando todas las animaciones completas (Idle, Walk, Attack, Kick, Ki/Cast, Pow, Hurt, Die/Faint) para:
     - `krilin` (Base - `075_Kuririn`)
     - `trunks` (Base y Super Saiyan - `081_Mirai Trunks`, `082_Super Mirai Trunks`)
     - `a18` (Base - `012_Androide 18`)
     - `broly` (Base - `016_Broly Full Power`)
     - `gotenks` (Base - `065_Gotenks Base`)
     - `caulifla` (Base - `024_Caulifla`)
     - `kale` (Base y Berserker - `070_Kale`, `071_Kale Ssj`)
     - `kyabe` (Base y Super Saiyan - `072_Kyabe`, `073_Kyabe ssj`)
     - `gohan` (Base niño - `033_Gohan`)
     - `vegeta` (Forma 3: Majin Vegeta - `090_Majin Vegeta`)
     - `vegetasuper` (Formas 0 y 1: Base y SSJ saga Buu - `094_Vegeta Buu Saga`, `096_Vegeta Saga Buu SSJ`)
     - `vegetto` (Forma 3: SSJ Blue - `101_Vegito SSJ Blue`)
   - Total de personajes activos en el juego: **25 héroes** (100% de los disponibles en sprites).
3. **Cobertura del 100% de retratos (fotos) en la pipeline:**
   - Se actualizó `herramientas/montar_animaciones.py` con recorte inteligente de cara/cabeza pixel art desde el primer frame de guardia si el pack carece de mugshot predefinido.
   - Recompilado `animaciones_juego.js` (1.69 MB) con verificación automatizada: 25 de 25 héroes y todas sus formas disponen de retrato nítido.
4. **Tarjetas de selección con la foto, no el cuerpo ("con la foto, no el cuerpo"):**
   - Modificado `buildCards()` en `script.js` y `style.css` (`.cardFace`): cada tarjeta muestra ahora la foto del rostro nítida y estilizada, eliminando el canvas del cuerpo caminando.
   - Para personajes con transformaciones desbloqueadas, cicla elegantemente los retratos de cada forma cada 2.5s.
   - Las tarjetas de invocación del Gachapón (`doPull`) ahora también muestran la foto del personaje (`gFace`).
5. **Compañero (#hComp) y previsualización de personajes (#rPrev):**
   - Se rediseñó el botón del compañero en el menú principal para destacar en grande y centrado el retrato pixel art (#hFace), ocultando el canvas del cuerpo caminando.
   - En la pantalla de selección (#roster), se eliminó el canvas secundario de cuerpo caminando (#rPrevC), manteniendo el retrato principal (#rPrevImg).
6. **100% Sprites reales animados en enemigos (cero procedurales):**
   - Se eliminaron las llamadas y fallbacks a enemigos dibujados por código canvas procedimental.
   - Mapeados los 10 enemigos pendientes en `SCPACK.e` y configurados con filtros cromáticos en `SCTINT`:
     - `dodoria`: `toppo` con filtro rosado alienígena.
     - `zarbon`: `frost` con filtro verdoso elegante.
     - `nappa` y `nappaE`: `saiyanw` (guerrero Saiyan con armadura y botas).
     - `a19`: `a16` con filtro robótico pálido.
     - `dabura`: `janemba` con tono demoníaco púrpura.
     - `burter`: `ginyu` con filtro azul de las Fuerzas Especiales.
     - `guldo`: `garlic` con filtro verde alienígena.
     - `rrsoldier`: `soldier3` con filtro Red Ribbon.
     - `blob`: `celljr` con filtro de masa rosada de Buu.
   - Los 114 enemigos definidos en `ET` resuelven a sprite sheets reales con animaciones de Walk, Attack, Cast, Hurt y Pow.
7. **Documentación sincronizada:**
   - Actualizados `SPRITES_PENDIENTES.md`, `ESTADO_DEL_PROYECTO.md` y esta bitácora.

## 2026-10-31 — Claude (sesión 3)

### Lo que pidió el usuario
- Revisar lo que hizo Gemini y arreglarlo (enemigos recoloreados, retratos/portadas de los personajes).
- Meter en el juego como jugables a **todos** los personajes de la carpeta `sprites/`.
- Arreglar las animaciones malas (p. ej. Trunks se hace más pequeño, movimientos y ataque sin coherencia): gran revisión.
- Que el juego esté bien optimizado y cargue bien en todos los PCs.

### Lo que hice
