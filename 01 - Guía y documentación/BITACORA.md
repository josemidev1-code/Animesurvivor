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
- Rehechas a mano las 16 formas que montó Gemini (Gotenks usaba a Goku/Goten/Trunks, Trunks SSJ pateaba tumbado...). (b80176c)
- `montar_animaciones.py`: todas las formas se llevan a la misma altura (`ALTO_BASE`=52 o `"altura"`), así Trunks y
  los demás ya no encogen al transformarse; `"retrato": [pack, n]` usa la cara de otro pack; caras grandes reducidas.
- Fuera los enemigos falsos de Gemini (sprites de otros personajes con filtro de color): cambiados por villanos reales.
- Personajes nuevos jugables (tabla `NUEVOS` en `script.js`, animaciones en `herramientas/animaciones/nuevos.json`):
  Raditz, Saibaman, A16, A17, Freezer (6 formas), Cooler, Janemba, Cell (4), Majin Buu (5), Turles (2), Bills,
  Frost (2), Hit, Zamasu (2), Jiren (3), Toppo, Moro, Baby Vegeta, Bra (2).
- Más formas para personajes que ya estaban: Goku GT SSJ/SSJ3, Vegeta GT SSJ, Gogeta SSJ4/Blue, Broly (4), Gohan Bestia,
  Trunks armadura SSJ, Piccolo naranja, Kefla Blue. Corregidos Trunks armadura base, Kefla SSJ y la muerte de Goku SSJ4.
- Optimización: los sprites ya no se decodifican todos al abrir la página (antes, además, cada uno reconstruía las
  tarjetas); cada partida precarga su héroe y los enemigos de su mapa. Menú listo en ~0,6 s. `index.html` con `?v=20`.
- Probado en el navegador: 44/44 personajes en el menú, partida sin errores de consola.

### A medias / problemas
- Quedan 174 packs de `sprites/` sin meter (casi todos variantes de Goku, Vegeta y Goku Black): lista en
  `SPRITES_PENDIENTES.md`. Para cada uno: `ver_pack.py`, elegir fotogramas, `poner.py nuevos.json <id> <forma> '{...}'`,
  añadir nombre/formas en la tabla `NUEVOS` de `script.js` y revisar con `revisar_todo.py`.
- Los nuevos personajes usan ataques ya existentes (tabla `sig` en `NUEVOS`); no tienen ataques propios aún.

### Siguiente paso recomendado
- Seguir metiendo los packs pendientes (apartado B de `SPRITES_PENDIENTES.md`), luego ataques con efectos reales.

## 2026-10-31 — Claude (sesión 4)

### Lo que pidió el usuario
- «Sí, sigue»: seguir metiendo los 174 packs pendientes de `sprites/` como jugables.

### Lo que hice
- El usuario mandó dos imágenes en pixel art: un pergamino rojo con una bola de dragón («ese va a ser el logo del menú»)
  y las 7 esferas del dragón («estas las esferas»). Guardadas en `ui/` y puestas en el juego.
- Logo: el dibujo en papel cuadriculado se convirtió en sprite real (1 cuadro = 1 píxel) → `ui/logo.png` (22×17).
  Sale en la portada, en el menú principal y como icono de la pestaña.
- Esferas: recortadas las 7 de la imagen, reducidas a su píxel real (18×18) y numeradas contando las estrellas rojas
  → `ui/esfera1..7.png`. Las usa `drawDBall` (bolas en el suelo, radar y marcador de arriba).
- Todo va embebido en `ui_imagenes.js` (base64) para que funcione con doble clic. Originales en `ui/*_original.png`.
- Personajes nuevos de esta sesión (`herramientas/animaciones/variantes.json` + tabla `NUEVOS`): Gohan DBS (5 formas),
  Gohan poseído, Gohan manga, Bardock Leyendas (4), Majin Cell, Trunks SSJ2 manga, Trunks armadura Ultra SSJ, Cumber,
  DLRX, Saiyans zombis (3), Broly fanmade (2), Gogeta fanmade (3), Vegetto fanmade (4). Total: 55 jugables.

### A medias / problemas
- Faltan las variantes de Goku (72 packs), Vegeta (34) y Goku Black (23). Iba a empezar por Goku Xeno (266, 253, 180).
- Mini-packs incompletos que no se pueden usar (sin daño ni patadas): Broly 007, 008, 194; Gogeta black 155.

### Siguiente paso recomendado
- Seguir con Goku (Xeno, UI, fanmade, Z, Moro), luego Vegeta y Goku Black.

## 2026-10-31 — Claude (sesión 5)

### Lo que pidió el usuario
- «seguimos» (con cuidado por el límite de contexto).
- «apunta cambios que has hecho y simplifica la carpeta de animesurvivor con solo las cosas útiles, lo demás quítalo»,
  para poder leerla sin perder tiempo con cosas que no sirven.

### Lo que hice
- Goku Xeno: saqué las hojas de sus 3 packs (266 base, 253 SSJ Dios, 180 SSJ4) pero aún no están en el juego.
- Carpeta simplificada. Lo que no usa el juego se movió (no se borró) a `Desktop/AnimeSurvivor_archivo/`:
  `copias/` (index viejos), `fotos/` (capturas), `personajes/` y `animaciones/` (importación vieja de Gemini/Codex),
  `_organizacion_sprites/`, `ESCENARIOS/` (fondos sueltos, los del juego ya van en `sprites.js`),
  `tomarreferencia/` (3,6 GB) y en `herramientas_viejas/` los scripts que ya no se usan
  (`importar_sprites.py`, `ajustes.json`, `informe_importacion.json`, `revision.html`, `buscar_extras.py`).
- Borrados los temporales (`herramientas/_revisar`, `__pycache__`, `_debug_raditz.png`): se regeneran solos.
- `ESTADO_DEL_PROYECTO.md` se junta con `README.md`: ahora el README dice qué es cada archivo, cómo está el juego
  y lo que falta. `AGENTS.md` y la guía de animaciones apuntan al README.

### Siguiente paso recomendado
- Goku Xeno (gokuxeno: BASE, SSJ DIOS, SSJ4) en `herramientas/animaciones/variantes.json` y en `NUEVOS` de `script.js`;
  después el resto de variantes de Goku, Vegeta y Goku Black (lista en `SPRITES_PENDIENTES.md`).

### Más (sesión 5) — «Sí, sigue»
- Goku Xeno jugable (`gokuxeno`): BASE (pack 266), SSJ DIOS (253) y SSJ4 limit breaker (180), revisado a ojo.
- **Arreglo importante:** los 10 personajes de variantes de la sesión 4 (Gohan DBS, Gohan poseído, Gohan manga,
  Bardock Leyendas, Cumber, DLRX, Saiyans zombi, Broly/Gogeta/Vegetto fanmade) tenían animaciones pero nunca se
  dieron de alta en `NUEVOS` de `script.js`, así que no salían en el juego. Ya están. Ahora sí hay 55 jugables
  (antes eran 44, no 55 como se dijo). Scripts a `?v=22`.
- Comprobado: el menú de personajes muestra los 55 y no hay errores. Falta jugar una partida con los nuevos.
- Recordatorio para la siguiente IA: cada personaje nuevo necesita **dos cosas**: sus formas en
  `herramientas/animaciones/*.json` **y** su entrada en `NUEVOS` de `script.js` (nombre, formas, auras, ataques).
- Partidas de prueba (usuario: «Probar partida antes»): Goku Xeno y Cumber entran en partida y juegan sin errores.
  Las 41 formas de los personajes nuevos o cambiados cargan sus 7 animaciones, con la misma altura entre formas.
  Para probar por código: `window.AS` (`AS.scLoad`, `AS.scHero(id,forma)`) y en el menú: carta del personaje → `#start` → JUGAR → `#mapCards button`.
- Goku saga de Moro jugable (`gokumoro`, 6 formas): BASE (pack 201), SSJ (199), SSJ DIOS (200) y SSJ BLUE, UI y MUI
  del pack 251 «fases». Entra en partida sin errores, alturas 53-55. Ya hay **56 jugables**. Scripts a `?v=23`.
- Siguiente grupo recomendado: Goku película Broly (216 SSJ Dios, 222 Blue, 221 Blue perfecto, 217 traje de invierno).

### Petición (sesión 5): jugabilidad
- «vamos a centrarnos en jugabilidad»: los enemigos que atacan están mal (la forma de caminar no tiene sentido y
  tienen huecos transparentes); Goku al lanzar bolas de ki hace cosas sin sentido con el cuerpo y no se entiende a
  dónde lo lanza; y quiere **una lista de todo el pixel art hecho por la IA (dibujado por código)** porque no tiene
  el máximo detalle: el usuario los pasará bien hechos.
- Hecho: 47 enemigos que ya existen como personajes (Turles, Frost, Cooler, Hit, Zamasu, Jiren, Janemba, Cell, Buu,
  Freezer, A16-18, Raditz, Saibaman, Bills, Moro, Toppo, Baby, Broly SSJ4, Gohan poseído…) usan ahora sus fotogramas
  elegidos a mano (tabla `ENEMIGO_HEROE` en `script.js`): sin huecos y con su tamaño. Los enemigos que solo tenían
  una pose de vuelo ahora flotan en guardia (Idle) en vez de deslizarse tumbados.
- Hecho: Ráfaga de Ki: el personaje se gira hacia el enemigo mientras lanza y la bola sale de la mano (antes podía
  lanzarla por la espalda desde el pecho). Comprobado que gira hacia el enemigo; el lanzamiento no lo vi en pantalla.
- Hecho: `PIXEL_ART_POR_CODIGO.md`, la lista de lo dibujado por código para que el usuario pase sus dibujos.
- Falta: rehacer desde `sprites/` los ~45 enemigos con recorte viejo (Jeice, Ginyu, soldados, Garlic…) metiéndolos
  en `herramientas/animaciones/enemigos.json` y enlazándolos con `ENEMIGO_HEROE`. Scripts a `?v=25`.

### Cierre de Claude (sesión 5)
- El usuario pide dejarlo todo commiteado y pasar la tarea a Codex con instrucciones concisas.
- Instrucciones en `TAREAS_CODEX.md` (enlazado desde `AGENTS.md` y `README.md`). Orden: 1) rehacer los ~45 enemigos
  con recorte viejo, 2) packs pendientes como jugables, 3) sustituir el pixel art por código con los dibujos del
  usuario, 4) HUD como PokéSurvivor.

## 2026-10-31 — Codex (sesión 6)

### Lo que pidió el usuario
- «Seguimos con el trabajo, mira toda la carpeta y sigue con lo que te ha dicho Claude».

### Lo que hice
- Leídos el relevo de Claude, README, instrucciones y bitácora. El primer trabajo pendiente son los enemigos con recorte viejo; se mantiene ese orden.
- Revisadas visualmente 19 hojas de los siete packs mixtos (2.396 PNG): abundan las poses aisladas, sin secuencias completas para los soldados, Ginyu o Jeice. La carpeta PIXELARTSCLAUDEYOTELOSPASO está vacía.
- Revisadas a ojo las hojas de Vegeta, Black, A17, Frost, Broly y Kale. Enlazados 13 tipos más a sus formas elegidas a mano; Broly Legendario usa ahora la forma legendaria (antes usaba SSJ4).
- Corregido drawPkEnemy: ignoraba la selección de guardia hecha por scEnemy y seguía dibujando el único fotograma de vuelo. Ahora la guardia se aplica también al dibujar. Recursos a v26.
- Intento de recuperar Zamasu corrupto desde el pack 106: revisadas hoja completa, selecciones ampliadas y previsualización. La primera selección mezclaba carga/disparo con orientaciones distintas y los supuestos daños eran patadas; se descartó antes de integrarla. A medias: encontrar daño y ki coherentes en un único pack (106/107), sin darlo por bueno por tener muchos PNG.
- Retirados temporalmente 44 tipos sin secuencias revisadas; conservados 70 tipos con sus animaciones y la sombra del jugador. Quitada la invocación de Cell Jr. de Cell. Los 24 mapas conservan cinco jefes con nombres reales; los mapas sin población inicial reciben Saibaman como enemigo explícito.
- Quitadas las rutas que dibujaban enemigos por código durante la carga y añadida recuperación del sprite al terminar de cargar (incluidos los alias). Se mantiene la importación manual de sprites del usuario.
- Auditoría reproducible en herramientas/comprobar_enemigos.cjs: 16 minutos por cada uno de los 24 mapas, 120 jefes, más de 170.000 apariciones simuladas sin tipos retirados; comprobados inicio, anillos, oleadas, guardia y carga diferida. Es una simulación de lógica con dibujo/sonido sustituidos, no una partida visual.
- La política del navegador impidió abrir file:///.../index.html. No se ha verificado visualmente una partida en esta sesión.
- Verificados los 56 conjuntos y sus 1.163 tiras PNG embebidas (dimensiones, fotogramas no vacíos y coincidencia con la configuración), los cinco recursos locales en v27 y la sintaxis de JavaScript. Los enemigos pendientes de decodificar no se mueven ni atacan hasta tener sprite visible.

### A medias / problemas
- La recuperación de los 44 tipos retirados sigue pendiente de secuencias buenas. En especial, revisar el pack 107 de Zamasu corrupto y los daños/ki del 106; no quedó ninguna selección provisional integrada.
- Falta comprobar visualmente una partida, Ráfaga de Ki y transformación; las comprobaciones automáticas no certifican el aspecto o el equilibrio de las partidas.
- No se han empezado las variantes jugables, los efectos ni el HUD: se ha trabajado en la prioridad de enemigos del relevo.

### Siguiente paso recomendado
- Jugar una partida con los enemigos corregidos y revisar ki/transformación; recuperar Zamasu corrupto solo si pasa la guía. Después, seguir con Goku película Broly (216, 222, 221 y 217).

## 2026-10-31 — Codex (sesión 7)

### Lo que pidió el usuario
- «SEGUIMOS ANIMANDO A TODOS LOS PERSONAJES».

### Lo que hice
- Se retoma la incorporación de personajes y formas pendientes, priorizando ahora las animaciones por petición del usuario. Primer grupo: Goku de la película Broly; después Vegeta y Goku Black.
- Goku película Broly integrado como nuevo jugable: BASE, SSJ, SSJ DIOS y BLUE PERFECTO. Reutilizadas las selecciones revisadas de base/SSJ (con muerte propia añadida) y elegidas a mano las formas 216 y 221. Revisadas hojas completas, selecciones y previsualizaciones de ambas formas nuevas. Registro en NUEVOS y recursos a v28.
- Packs 217 y 222 revisados: invierno no tiene acciones de combate completas; Blue carece de patada completa. Se mantienen pendientes y anotados en el apartado C, sin mezclarles sprites de otro pack.
- Corregida la lista B: todavía incluía muchos packs ya integrados por Claude. Se eliminan los usados según la configuración real y se recalculan los totales por grupo.
- Vegeta Blue manga integrado (243 Blue dañado y 245 Blue perfecto), y Vegeta Dios de Broly (305). En 243 y 305 se corrigió el zoom de fotogramas individuales: la detección automática daba puñetazos al doble de tamaño o cargas diminutas. Revisados de nuevo tras corregirlos.
- Vegeta 225/304 incompletos; la selección de 250 se descartó porque solo se había encontrado un daño y lo repetía. No se integra esa forma provisional.
- Black Time Breaker: Dios (124), Rosé (126), Rosé 3 (125). Black fanmade: Rage (123), Rosé Kaioken (212), Rosé Ultra Instinto (213), MUI (122). Siete formas seleccionadas a mano, con muerte propia; retrato de reserva de la cabeza para Rosé 3 porque su pack no trae cara grande.
- Revisados todos los PNG de los packs, revisar_todo y generadas previsualizaciones PNG/GIF de cada forma nueva. En Black Kaioken se sustituyeron dos poses quietas que entraron por error en move por los impulsos 93/94 y se corrigió la escala desigual entre los dos fotogramas de aura.
- Majin Black 183–187 revisados, pero sin selección completa que cumpla daño y patadas: quedan pendientes y anotados, no se inventan acciones.
- Herramienta comprobar_personajes.cjs: detecta animaciones sin alta en NUEVOS, discrepancias de formas, retratos o ataques inexistentes y tiras PNG con medidas/duraciones incorrectas. Con IDs aplica además las cantidades de la guía y exige muerte. Las cinco incorporaciones (14 formas) y todo NUEVOS (36 personajes, 87 formas) pasan.
- El usuario comenta: «me está gustando el trabajo [...] falta pulir algunos escenarios [...] por lo general está muy bien». Se anota el pulido de escenarios como pendiente posterior, manteniendo ahora el foco en animar personajes.
- Goku alternativo integrado con Místico (131), Ikari (130) y Bestia (129): impulso, guardia, combo, patadas, ki, aura, dos reacciones de daño, muerte y retrato. Revisadas las tres previsualizaciones completas tras corregir escala en auras, muerte de Ikari y carga de Bestia; el disparo Místico usa ahora carga 51 y lanzamiento 50, y Bestia lanza con palma extendida (58).
- Goku 139 (SSJ 100) revisado pero sin selección legible completa; se mantiene pendiente por su cabello que oculta las acciones.
- Estado: seis jugables nuevos, 17 formas, 62 personajes en total. Primeros lotes guardados en 3a2b8af y 1ebaa99; recursos finales a v30. Pendientes reales en la lista B: 124 packs (incluye incompletos), de los cuales Goku 59, Vegeta 30 y Black 16.
- Verificación final: decodificadas las 1.299 tiras PNG de los 62 conjuntos, sin celdas vacías ni dimensiones incorrectas; índices de las 17 formas nuevas válidos y cinco recursos locales en v30. Pasan la comprobación estricta de los seis nuevos personajes, el registro completo de NUEVOS (37 personajes, 90 formas), sintaxis y diff. La auditoría de enemigos conserva 24 mapas y 120 jefes.

### A medias / problemas
- Todavía quedan variantes por animar: no se han dado por completados los 124 packs pendientes ni los enemigos retirados. Los incompletos revisados se explican en SPRITES_PENDIENTES.md, apartado C.
- Revisión visual hecha sobre las hojas y previsualizaciones PNG; quedan partidas reales con los personajes nuevos, Ráfaga de Ki y transformaciones. No se ha probado el juego en navegador en esta sesión (la apertura local ya quedó bloqueada por su política en la sesión 6).
- El pulido de escenarios queda anotado para después de las animaciones; no se han cambiado escenarios.

### Siguiente paso recomendado
- Continuar con Goku Granola (132, 136 y 149), revisando los packs antes de seleccionar fotogramas. Mantener NUEVOS, el paquete generado y la lista de pendientes sincronizados; verificar con comprobar_personajes.cjs. Probar también las nuevas cadenas de transformación en partida.

## 2026-10-31 — Codex (sesión 8)

### Lo que pidió el usuario
- «BUSCA todo tipo de pixel arts animados y pack de sprites de devianart y seguimos desarrollando, y del que cojas menciona créditos, me hace falta objetos de la serie rollo semillas senzu y todo».

### Lo que hice
- Se prioriza buscar objetos de Dragon Ball y recursos animados en DeviantArt, comprobar condiciones y autoría, e integrar los aprovechables con créditos visibles.
- Integrados recortes reales de senzu, cápsulas de vitalidad y ki y radar de Legacy of Goku II (hoja de Ragengow; Webfoot Technologies / Atari). Original y coordenadas conservados en ui/objetos/; no se han usado dibujos nuevos por código.
- GIF Dragon Radar de Lady-Pixel incorporado íntegro (44 fotogramas, con transparencia) como indicador de detección/recogida; su ficha permite usarlo sin editar. Las senzu y cápsulas de SailorTrekkie92 quedan fuera: su biografía exige permiso previo.
- Cápsula de vitalidad: +25% de vida sin superar el máximo; cápsula de ki: técnica especial lista; radar: atrae toda la experiencia del suelo. Salen al romper cajas. La senzu conserva +50% de vida.
- Créditos con autores y enlaces integrados en ui_imagenes.js; eliminado el fetch del manifest inexistente. El manifest opcional de personalización ahora puede incrustarse como window.SPRITE_MANIFEST.
- Generador montar_objetos.py y comprobación de objetos: imágenes incrustadas, GIF idéntico al original, límites de curación, recarga, atracción, ocho ramas del botín y ocultación del indicador al pausar. También pasan las comprobaciones de personajes y enemigos.
- Primer lote guardado en el commit b2ff745: objetos reales, radar animado, créditos locales, generador y comprobaciones.
- Catálogo de 10 recursos/fichas de DeviantArt documentado con autores y condiciones. Incluye hojas de qsab101, efecto de impulso de LyanCv505, objetos, avatares y escenarios. Se han diferenciado los recursos incorporados, las referencias y los que requieren permiso.
- Tileset Dragon Ball RMXP de LorisC93 descargado (256×928), revisado y acreditado en recursos_pendientes/escenarios/FUENTE.md. No está integrado: requiere comprobar coherencia visual con el juego y colisiones. El efecto de LyanCv505 permite uso con crédito, pero la descarga original exige registro; no se ha creado cuenta ni incorporado la previsualización JPEG.
- README, TAREAS_CODEX y PIXEL_ART_POR_CODIGO actualizados. Los cinco recursos de index.html están en v31.

### A medias / problemas
- La lógica de los nuevos objetos pasa las comprobaciones automáticas y sus recortes se han revisado a ojo. Falta verlos en una partida real; no se ha vuelto a intentar la apertura local que quedó bloqueada por la política del navegador en la sesión 6.
- No se han dado por terminados los escenarios ni importadas las hojas de personajes/efectos del catálogo. Los packs de personajes pendientes de la sesión 7 siguen pendientes.
- Los avatares de senzu y cápsula de SailorTrekkie92 no están en el proyecto: requieren permiso explícito de su autora. Las fuentes que se usan realmente están identificadas en CREDITOS_RECURSOS.md y ui/objetos/fuentes.json.

### Siguiente paso recomendado
- Probar las cajas y los cuatro objetos: vida con límite, técnica especial lista, atracción de gemas e indicador que se oculta al pausar. Revisar también la pantalla de créditos abriendo index.html con doble clic.
- Continuar las animaciones de Goku Granola (132, 136, 149) y usar el catálogo para sustituir efectos/escenarios después de comprobar sus condiciones y su estilo.

## 2026-10-31 — Claude (sesión 9)

### Lo que pidió el usuario
- Todos los personajes con sus propios ataques y cosas especiales; gachapón con los recursos de `sprites/shenron` para que no sea cutre.
- Eliminar todo lo que dibujé en el pasado sin sprites; buenas animaciones de caminar y atacar para todos, orientadas (si tira la bola arriba, animación hacia arriba; a la izquierda, hacia la izquierda).
- Ataques de muchas bolas (Broly) teledirigidos; enemigos variados con vida sobre la cabeza; más jugabilidad.
- Mapas con su portada original (carpeta de escenarios); meter todos los sprites; arreglar los jefes, que al aparecer no se les puede hacer daño.
- Adjuntó captura del panel de subida de nivel de PokéSurvivor como referencia.

### Lo que hice
- Jefes: ninguno tenía radio de colisión en `ET` (`r` indefinido), así que ni las bolas ni los golpes los tocaban, y ellos tampoco te dañaban por contacto. Ahora `spawn` les da `r:13` (y 6 a cualquier enemigo sin radio). Probado: Raditz baja de 900 a 779 en 10 s.
- Barra de vida encima de la cabeza de cada enemigo (roja normal, naranja élite, morada jefe).
- Lanzamientos orientados: si el enemigo está claramente encima, el personaje usa la pose de brazos arriba (fotogramas `pow`) y la bola sale por encima de la cabeza; si no, se gira a izquierda o derecha hacia él (ya estaba).
- Bolas teledirigidas: Blaster Meteor (Broly, Kale, Kefla), Hellzone Grenade, Renzoku, Ráfaga de Krilin, Gekiretsu Madan y Kamikaze Fantasma salen abiertas y giran hacia su enemigo. Probado con Broly: 16 KO en 12 s sin errores.
- Portadas de los 24 mapas: elegidas de `sprites/06_Escenarios` (no existe ya otra carpeta de portadas; el archivo antiguo no está en el escritorio). `herramientas/montar_portadas.py` las recorta a 264×165 y las incrusta en `portadas_mapas.js` (`window.MAP_COVER`, con la ruta de origen en `MAP_COVER_SRC`). Las tarjetas de «Elige escenario» las usan en vez del dibujo del suelo.
- Gachapón: Shenron pixelado de `sprites/shenron/shenron.jpg` recortado a su rejilla real (píxel de 14,15 px, fondo blanco quitado) con `herramientas/montar_shenron.py` → `ui/shenron.png` y `shenron_imagen.js`. Sale en el cartel (a la izquierda, con las 7 esferas del usuario girando en vez de bolas dibujadas) y en la animación de invocación. Eliminado el Shenron dibujado por código (`shenlong`), también en el deseo de las 7 esferas.
- Quitados los muñecos dibujados por código que seguían saliendo: el cartel del gachapón usa la guardia real de cada pack; «Tu sombra» usa el pack de tu personaje oscurecido (`SCTINT.shadow`); el jugador ya no se dibuja con el modelo por código mientras carga su pack.
- Subida de nivel como la captura de PokéSurvivor: panel azul centrado («¡Nivel N!», «Elige una recompensa · 1 2 3»), filas con icono, nombre, etiqueta, descripción y tecla; la elegida con borde amarillo.

### A medias / problemas
- No repasados uno a uno los 62 personajes: caminar y atacar siguen con la selección de fotogramas actual. Los sprites solo miran a izquierda/derecha; «arriba» usa la pose de poder.
- La variedad de enemigos sigue limitada: 44 tipos retirados hasta tener secuencias buenas.
- Siguen por código: suelos y decorados de los mapas, rayos, auras, iconos y chispas (`PIXEL_ART_POR_CODIGO.md`).
- La antigua carpeta de portadas ya no existe; se usaron fondos de `sprites/06_Escenarios`. Si tienes las portadas originales, cambia los números de `ELEGIDAS` en `herramientas/montar_portadas.py`.

### Sesión 9, segunda parte: «Sí, revísalos» (caminar y atacar de todos)
- Causa principal de que «moverse y atacar no tuviera sentido»: al huir con un enemigo detrás, cada Ráfaga de Ki daba la vuelta al cuerpo (andaba hacia atrás y se giraba varias veces por segundo). Ahora, si disparas hacia atrás mientras te mueves, el cuerpo sigue mirando hacia donde vas y la bola sale del pecho; parado, se gira hacia el enemigo.
- Quitada la pose de poder con aura al tirar hacia arriba (parecía cargar, no lanzar): ahora brazo estirado y la bola sale más alta o más baja según el enemigo.
- Enemigos: lejos usan su pose de impulso hacia ti; cerca, la guardia (antes se deslizaban en guardia).
- Revisadas a ojo las 168 formas (hojas a escala real) y medidas por tamaño/inclinación. Corregidas: Bardock base (guardia era SSJ Blue, moverse de frente, ki mirando atrás), SSJ3 (patada con imagen residual), UI señal (patada boca abajo), Goku Dios (ki era el aura), Vegeta SSJ y Vegeta Blue dañado (moverse de pie), Black Rosé (ki era solo el rayo), Bardock SSJ DBH (moverse y ki), Goku Ikari (ki fantasma).
- Petición añadida: «ataques personalizados para todos acorde a la serie, más variantes de cosas que hacer, cúrrate la portada de los personajes».
- 26 ataques nuevos de la serie: Rayo Mortal y Death Ball (Freezer), Supernova (Cooler), Esfera de Destrucción (Bills), Revenge Death Ball (Baby), Double Sunday y Saturday Crush (Raditz), Hell Flash y Puño Cohete (A16), Barrera (A17, te hace invulnerable), Kamehameha Solar (Cell), Rayo Chocolate y Bola Desvanecedora (Buu), Kill Driver y Calamity Blaster (Turles), Salto Temporal (Hit, paraliza), Ira Divina (Zamasu), Power Impact y Golpe del Orgullo (Jiren), Justice Flash (Toppo), Absorción de Energía (Moro, te cura), Espada Dimensional y Garra Rakshasa (Janemba), Kamehameha Maligno (Cumber, Gohan poseído), Ácido (Saibaman). Tabla `SIGS_SERIE` en script.js; 24 personajes con lista propia en vez de la genérica.
- Ficha de personaje (pantalla PERSONAJES): además de la cara, el personaje de cuerpo entero animado con sus sprites reales, recorriendo sus formas (guardia, combo, patada, ki, poder) y la lista de sus técnicas con el nivel en que se aprenden.
- Eventos aleatorios para que las partidas no sean iguales (cada 65-95 s, nunca durante un jefe y sin repetir el anterior): Reto de Kaio (derrota N enemigos en 25 s → mejora extra y 50 zeni), Lluvia de meteoritos (marcas rojas que explotan y dañan a todos), Semillas de Karin (3 senzus), Estampida (horda por un lado), Lluvia de zeni y Furia Saiyan (15 s con doble daño). Probados los seis sin errores.

### A medias / problemas (actualizado)
- Revisión de animaciones: corregidas las formas con fallos claros; los packs de pocas poses (p. ej. «fases» de Goku Moro) siguen con golpes que no son puñetazos porque el pack no los tiene.
- Los sprites solo miran a izquierda/derecha: no hay pose real de lanzar hacia arriba/abajo.
- Las monedas de zeni, auras, rayos y marcas de eventos siguen dibujados por código.

### Sesión 9, tercera parte: «Sí, sigue» (ataques propios para el resto)
- 5 técnicas nuevas: Soul Punisher (Gogeta fanmade), Kamehameha Ikari (Goku alternativo), Cañón Especial Bestia (Gohan manga), Ráfaga de Bra y Ruptura del Tiempo (Black Time Breaker y Black fanmade, paraliza).
- Listas propias para Gohan DBS, Gohan manga, Bra, DLRX, Gogeta y Vegetto fanmade, Goku Moro, Goku y Vegeta de la película Broly, Vegeta Blue manga, Black Time Breaker, Black fanmade y Goku alternativo. Además se diferenciaron las seis parejas que repetían lista (Gohan adulto, Broly fanmade, Black fanmade, Goku Xeno, Goku Broly y Vegeta Dios). Ahora ningún personaje de los 63 tiene la misma lista que otro.
- Probados 7 personajes: cada una de sus 6 técnicas derrota enemigos, sin errores. `comprobar_personajes.cjs` pasa.

### Sesión 9, cuarta parte: «Más eventos»
- Seis eventos nuevos (ya son 12, sin repetir el anterior): ¡Una esfera ha caído! (esfera del dragón lejos, a buscarla con el radar), Guerrero de élite (enemigo con aura roja y mucha vida; si lo derrotas en 35 s suelta un cofre), Gravedad x100 (20 s más lento pero el doble de experiencia), Genkidama (cuenta atrás de 10 s con la bola creciendo sobre la cabeza y luego barre la pantalla), Tiempo detenido (6 s los enemigos no se mueven) y Fusión (15 s más velocidad y técnicas más rápidas).
- Marcas de meteoritos y Genkidama se dibujan ahora en el mundo (antes iban en la capa del HUD y salían desplazadas).
- Probados los seis forzándolos en partida: sin errores; el élite tarda ~24 s con Goku de nivel bajo.

### Sesión 9, quinta parte: «Rayos de los packs»
- Los rayos de los héroes ya usaban el Kamehameha y el Galick Gun de los packs. Ahora también los de los jefes (Kamehameha de Cell, Final Flash de Vegeta, Supernova de Cooler…), teñidos con su color.
- La bola que se carga antes de cada rayo es la bola de ki real de los packs (antes cuadrados de colores).
- Todas las técnicas de bolas (Blaster Meteor, Hellzone, Rayo Chocolate, Justice Flash…) usan la bola de ki con estela del pack, y las bolas grandes (Masenko, Big Bang, Eraser Cannon, Death Ball…) la esfera del pack, teñidas con su color. Funciones `kiOrb` y `kiShot`; si el sprite no ha cargado se usa el dibujo anterior.
- Probado en partida: Broly (bolas y Eraser Cannon) y el Kamehameha de Cell, sin errores.

### Sesión 9, sexta parte: capturas de PokéSurvivor (menú y partida) sin texto
- Interpretado como «la partida debe verse así». HUD rehecho: arriba a la izquierda nombre (y forma), «Nv. N» y barra de vida roja con «vida / máximo»; la experiencia pasa a una línea fina azul bajo la vida. Arriba en el centro el tiempo grande y una línea gris con mapa, derrotados, zeni y dificultad (sin el mapa en pantallas estrechas); debajo las 7 esferas. Abajo el nombre de la técnica en naranja, las casillas y una línea de ayuda de controles. Quitados «KO» y «Z» de la esquina derecha.
- Probado en 800×600 y 1600×900. El menú ya seguía ese esquema (panel azul a la derecha y carta del personaje en el centro).

### Sesión 9, séptima parte: «Sí, sigue» → enemigos más variados
- Problema: de los enemigos normales solo quedaban saibamen (los soldados, Cell Jr. y esbirros se retiraron en la sesión 6 por tener tiras malas).
- Recuperados con packs ya revisados: Cell Jr. y CELL JR. élite (pack de Cell Perfecto, pequeño y teñido de azul) y el antiguo «majin», ahora «Fragmento de Buu» (Kid Buu pequeño).
- Nuevos: Saiyan zombi y Saiyan zombi furioso (pack de los Saiyans zombi) en todos los mapas, y Clon de Zamasu (dispara) en la saga Super y el Futuro de Trunks. Tamaño propio por tipo (`ET[id].z`).
- 76 tipos activos (antes 70), 41 retirados (antes 44). `comprobar_enemigos.cjs` actualizado a la regla nueva (lejos se impulsan, cerca guardia) y pasa: 24 mapas, 173.299 apariciones simuladas sin tipos retirados. Vistos en partida sin errores.

### Sesión 9, octava parte: «Sí, búscalos» + «están en mis sprites y si no en DeviantArt, con créditos; en la foto hay incoherencias en los tamaños»
- En `sprites/` no hay packs de soldados ni de las Fuerzas Especiales (confirmado por nombre en todas las carpetas y por la revisión previa de los packs mixtos).
- DeviantArt: descargadas a tamaño original tres hojas sin restricciones en su ficha: Soldado de Freezer (TheWarriorFF2), Capitán Ginyu (Strice12) y Jeice (MrDryy). Nueva herramienta `herramientas/recortar_hoja.py` que trocea una hoja en un PNG por fotograma (quita el fondo y salta retratos y textos). Packs 400-402 en `sprites/00_Dragon_Ball_Z/01_Namek_y_Freezer/DeviantArt/`.
- Formas elegidas a ojo en `herramientas/animaciones/enemigos.json` (`e_soldado`, `e_ginyu`, `e_jeice`) y enlazadas: soldado, soldado raso, soldado de Freezer y élite (con los colores alternativos de la hoja), Jeice (élite) y Capitán Ginyu (jefe, vuelve a Namek y al escuadrón de Fuerzas Especiales). 82 tipos activos, 35 retirados.
- Créditos con autor, coautores y enlace dentro del juego (pantalla de créditos) y en `CREDITOS_RECURSOS.md`. Burter y Recoome no dejan bajar el original sin cuenta: pendientes.
- Tamaños: medidos todos los enemigos normales frente a Goku (24-30 px). Desentonaban los que yo encogí: Fragmento de Buu (16) y Cell Jr. (19). Ahora el fragmento mide como Kid Buu y Cell Jr. algo menos que Cell. Probado en partida.

### Sesión 9, novena parte: escenarios («Usa tiles libres»)
- Búsqueda: en `sprites/` solo hay fondos laterales de juegos de lucha; en DeviantArt los tilesets de Dragon Ball son laterales (Dragon Ball Karma, Super Butouden, descartados y borrados) o pintados (LorisC93); Spriters Resource (Legacy of Goku II) pide verificación anti-bots y no se ha forzado. El usuario eligió tiles libres.
- Pack Ninja Adventure de Pixel-Boy y AAA (CC0), tilesets bajados de su GitHub a `sprites/06_Escenarios/Tiles/`. `herramientas/montar_escenarios.py` genera `escenarios_tiles.js` con 32 suelos (hierba, estepa, arena, tierra, nieve, ladrillo… con tintes por mapa) y 9 decorados (árboles grandes y pequeños, árboles de Namek teñidos, rocas). Se cargan al iniciar y sustituyen a los dibujados por código; si no cargan, queda el dibujo anterior.
- Probados Praderas, Desierto, Infierno y Budokai sin errores. Créditos en el juego y en `CREDITOS_RECURSOS.md`.
- Quedan por código: agua, lava, cielo, relieves (mesetas, cañones) y edificios propios de cada mapa.

### Sesión 9, décima parte: «Pon a todos los personajes de Dragon Ball, seguro que están en DeviantArt»
- Lanzada una sesión aparte («Personajes de Dragon Ball desde DeviantArt»). Su resultado: commit ae765b9 con 7 jugables
  nuevos (Nappa, Ginyu, Jeice, Guldo, Uub, Mr. Satán y Androide 21), 13 técnicas propias y créditos en el juego.
- **Está en la rama `refs/heads/claude/quizzical-gates-9cf9c0`, NO fusionada en main ni subida.** El usuario no ha
  decidido aún si fusionarla.

### Cierre de la sesión 9: «déjalo todo preparado, que sigo en un chat nuevo»
- Relevo escrito: este cierre, «Empieza aquí» al principio de `TAREAS_CODEX.md` y «Cómo está ahora» / «Lo que falta» del README.

### Qué quedó hecho (sesión 9 entera)
Jefes con daño, vida sobre los enemigos, bolas teledirigidas, cuerpo orientado al atacar, 31 técnicas nuevas y lista
propia para cada personaje, ficha animada, 12 eventos, gachapón con Shenron real, portadas de mapas, HUD y subida de
nivel como PokéSurvivor, rayos y bolas de ki de los packs, enemigos variados (82 activos, 35 retirados), soldados,
Ginyu y Jeice desde DeviantArt, y suelos/árboles/rocas reales (Ninja Adventure, CC0). Todo en main y subido (ebc1b50).

### A medias / pendiente
- Fusionar (o no) la rama de los 7 personajes nuevos: preguntar al usuario. Si dice que sí: `git merge` en main;
  conflictos probables en `script.js` (`NUEVOS`, `SIGS_SERIE`, `PACK_CREDITS`) y `animaciones_juego.js` → conservar las
  dos partes, regenerar con `montar_animaciones.py`, pasar `comprobar_personajes.cjs` y `comprobar_enemigos.cjs`, subir `?v`, probar y subir main.
- Siguen dibujados por código: agua, lava, cielo, relieves y edificios de cada mapa, auras, Makankosappo, disparos de
  enemigos y monedas de zeni (lista en `PIXEL_ART_POR_CODIGO.md`).
- Burter y Recoome: en DeviantArt piden cuenta para bajar el original. Spriters Resource tiene verificación anti-bots (no forzarla).

### Siguiente paso recomendado
1. Preguntar al usuario si fusionar la rama de los 7 personajes y hacerlo si dice que sí.
2. Seguir metiendo personajes de la serie desde `sprites/` o DeviantArt (con créditos), con `recortar_hoja.py`.
3. Sustituir lo que queda dibujado por código (agua, lava, auras…).

### Sesión 10: «instala esta skill https://github.com/obra/superpowers.git»
- Instalado el plugin Superpowers (obra) para Claude Code a nivel de usuario: `claude plugin marketplace add obra/superpowers-marketplace`
  y `claude plugin install superpowers@superpowers-marketplace`. No toca el código del juego; sus skills aparecen al abrir una sesión nueva.
- Petición: «mira este proyecto y dime qué opinas» (con la skill de brainstorming de Superpowers). Revisado README, AGENTS,
  TAREAS_CODEX y el código; opinión dada en el chat y pregunta abierta al usuario sobre el objetivo del juego. Sin cambios de código.
- Respuesta del usuario: «es un proyecto personal mío, fanmade sin ánimo de lucro, pero ¿se podría poner algún anuncio en el
  gachapón y un Ko-fi para donaciones, como PokéSurvivor?». Explicado en el chat: riesgos de derechos al ganar dinero con
  Dragon Ball, licencias de los sprites de terceros y que los anuncios exigen publicar el juego en una web. Sin cambios de código.
- Petición: «se jugará en una web publicada. Los sprites son de juegos tipo Street Fighter y la animación de caminar por
  el mapa a veces queda rara; quiero cambiar la experiencia y el HUD (me parece horroroso), poner a cada personaje su ataque
  de la serie y tener todos los sprites funcionando. ¿Me ayudas?». Investigando cómo funciona hoy antes de proponer orden.
- Hallazgo: de 171 formas, 159 tienen 1 solo fotograma de «move» y 12 tienen 2; al moverse se dibuja esa pose fija con un
  balanceo por código, y siempre de perfil (los packs de lucha solo miran a izquierda/derecha), también al ir arriba o abajo.
  Propuesto al usuario separar en proyectos (movimiento → experiencia → HUD → técnicas de la serie → sprites pendientes).
- Respuesta: «quiero ver una animación coherente, solo eso, en todos los personajes; la animación de los sprites pero metida
  de forma coherente, y que cada personaje tenga sus ataques de la serie, que también están en los sprites».
- Revisado el pack de Goku base (DBS Broly, 67 fotogramas): no tiene ciclo de caminar; sí impulso con polvo (7-8), estela de
  velocidad (9-10), golpes, carga y rayo del Kamehameha (35-39), aura, transformación y Genkidama. Ofrecido al usuario
  enseñarle propuestas de movimiento en el navegador.
- «Sí, enséñamelas»: abierto el acompañante visual de Superpowers (carpeta `.superpowers/`, añadida a `.gitignore`) con
  cuatro propuestas de movimiento de Goku animadas con fotogramas reales del pack: A lo actual, B impulso con polvo,
  C vuelo con postimágenes, D guardia en vuelo con destello de velocidad. Descubierto que Goku usa ahora el fotograma 7,
  que es un salto hacia atrás: avanza de espaldas a donde va. Esperando a que el usuario elija.
- Elección: «me parece mejor la A, pero cuando gira se hace más pequeño y el polvo que le sigue parece irreal».
- Causa de que encoja: en el pack, la guardia está exportada a 9 px por píxel de dibujo y la pose de moverse (fotograma 7)
  a 7 px; el 8 a 6 px. Se ve un 22 % más pequeño al moverse. El polvo es una mancha separada del cuerpo y se puede quitar
  sola. Enseñada al usuario la A corregida (tamaño de píxel igualado y sin polvo) junto a la original. Ninguna de las
  dos cosas está aún en el juego.
- «Sí, así»: aprobada la A corregida (pose de impulso del pack, mismo tamaño de píxel que la guardia, sin polvo).
- Técnicas hoy: la pose de lanzar sí sale del pack (`ki`), pero la bola de carga y el rayo son genéricos (`kiOrb`/`kiShot`
  a partir de `ki-goku`, teñidos con los colores de cada técnica), no el rayo propio que trae cada pack (Goku: 38-39).
  Preguntado al usuario si cada técnica debe usar el efecto de su propio pack.
- «Sí» (cada técnica con el efecto de su propio pack) y pregunta: «¿todos los sprites tienen animación de andar y de ataques?».
- Datos (formas jugables en `herramientas/animaciones/*.json`): todas tienen guardia, moverse, puñetazos (2-4 fotogramas),
  patada, ki (2: cargar y lanzar), poder y daño; la mayoría, muerte. Ninguna tiene ciclo de andar: los packs son de juegos
  de lucha y «moverse» es 1 fotograma (casi todas) o 2. No hay ninguna selección de fotogramas de efectos (rayos, bolas)
  del propio pack. Ofrecido revisar todos los packs para saber cuáles traen su técnica dibujada.
- «Sí, revísalos»: revisando todos los packs de los jugables (tamaño de píxel por fotograma y fotogramas de técnicas).
- Medición de los fotogramas tal como están en el juego (171 formas): `montar_animaciones.py` ya iguala el tamaño del
  píxel de cada fotograma, así que en el juego Goku base NO encoge al moverse (la maqueta «A como estaba» no aplicaba esa
  corrección y lo exageró). Problemas reales: polvo o chispas sueltas en la pose de moverse en 21 formas (goku/0 y /1,
  gokuui, gokumoro, gokubroly, vegeta/1, vegetaue/2, black/2, cell/4, kefla/1, trunks/0, e_ginyu, e_jeice); pose de
  moverse muy agachada (menos del 70 % de la guardia) en 16; tamaño de píxel desigual en 4 (vegetasuper/2 entera,
  gohanmanga/0 patada, blackfan/0 puñetazos, e_ginyu/0 poder). Buscando ahora fotogramas de técnicas en todos los packs.
- Pregunta: «quiero usar todos los sprites del juego, ¿se podría?».
- Recuento: `sprites/` tiene 333 carpetas con imágenes (33.007 fotogramas). Las selecciones de animación usan 165; quedan
  168 sin usar (unos 17.000 fotogramas): 65 de Super, 44 fanmade, 27 de Z, 12 sin saga… En `SPRITES_PENDIENTES.md` (B) la
  mayoría son más versiones de Goku (59) y Vegeta (30). Preguntado al usuario si quiere decir más packs o más fotogramas
  de los packs que ya se usan.
- Objetivo del usuario: «meter el máximo de personajes jugables posibles, mejores enemigos, mecánicas y todo». Propuesto
  un orden: 1) herramienta que propone fotogramas sola (con movimiento A corregido), 2) técnicas desde el pack,
  3) packs que faltan, 4) enemigos, 5) experiencia y HUD, 6) mecánicas nuevas.
- «Sí, ese orden». Empieza el bloque 1: herramienta que propone los fotogramas de cada pack (con el movimiento corregido).
- Búsqueda de técnicas terminada (162 packs de los jugables, 15.419 fotogramas, el juego usa 2.661): 150 packs traen
  efectos dibujados sin usar (rayos, bolas, auras, barreras…) y 128 tienen algún rayo alargado. Sin efecto propio claro:
  goku/1, vegeta/2, vegetaue/1, babyvegeta/0, broly/3, trunkscell/1 y /2, a18/0, gokuxeno/1, gokumoro/0 y /1, e_soldado/0.
  (Herramientas de la revisión en el scratchpad de la sesión, no en el proyecto.)
- Revisión: «solo los dudosos» (el usuario aprueba solo los packs que la herramienta marque como dudosos).
  Presentadas tres formas de construir la herramienta (reglas automáticas, la IA mirando cada pack, o mixta).
- Elegida la forma mixta (C): reglas con nota de confianza, la IA mira los dudosos y el usuario solo lo que siga dudoso.
  Escribiendo el diseño del bloque 1 en `docs/superpowers/specs/`.
- Diseño del bloque 1 escrito: `docs/superpowers/specs/2026-11-01-propuesta-fotogramas-design.md`. Pendiente la
  revisión de un constructor y la aprobación del usuario.
- Revisión del diseño por un constructor (subagente): 6 preguntas, ninguna exclusiva del usuario. Añadido al diseño:
  alcance (los 168 packs nuevos son el bloque 3), Goku base mantiene `move: [7]` sin polvo, cambios en formas actuales
  pasan por revisión, propuestas en `herramientas/propuestas/` fuera del montaje, criterios de acierto y objetivo
  (80 %, como mucho 1 de cada 5 packs al usuario) y el script de medición junto al diseño. Esperando aprobación.
- «Sí, apruebo»: diseño del bloque 1 aprobado por el usuario. Siguiente: plan de trabajo (skill writing-plans).
- Plan del bloque 1 escrito: `docs/superpowers/plans/2026-11-01-propuesta-fotogramas.md` (9 tareas: medición, quitar
  polvo, rasgos con caché, reglas, plantillas por autor, validación, hojas para la IA, página de revisión, formas
  actuales). Pendiente que el usuario lo revise y elija cómo ejecutarlo.
- «Tú en esta sesión»: el plan del bloque 1 lo ejecuta Claude en esta misma sesión, con revisión final de todo.
- Ejecución del plan del bloque 1 en la rama `bloque1-fotogramas` (no en main: el plan pide rama propia; `sprites/`
  no está en git, por eso rama y no worktree). Pruebas: `python -m unittest discover -s herramientas/pruebas -v`.
- Tarea 1 hecha: `herramientas/medir_formas.py` (polvo, agachadas, tamaños desiguales) con sus pruebas.
- Tarea 2 hecha: `quitar_sueltos` en `montar_animaciones.py` (solo en `move`; opción `conservarSueltos`). Montado de
  nuevo: 0 formas con polvo (antes 21), revisadas a ojo sin perder partes del cuerpo. Comprobaciones de personajes y
  enemigos sin errores. `?v=64`.
- Tarea 3 hecha: `herramientas/rasgos.py` (alto, ancho, inclinación, polvo y su lado, paleta y silueta de cada
  fotograma, con caché en `_revisar/medidas/`). Confirmado con datos: en Goku base el polvo del fotograma 7 está
  delante (retroceso) y el del 8 detrás (impulso).
- Tarea 4 hecha: `herramientas/proponer_fotogramas.py` con las primeras reglas (guardia, impulso, golpes, ki, poder,
  daño, muerte, retrato y efectos) y los motivos de duda. Las reglas son aún bastos: se ajustan en la tarea 6.
- Tarea 5 hecha: plantillas por autor (`autor_de`, `manuales`, `plantilla`) y archivos en `herramientas/propuestas/`.
  Descubierto: los packs de Andrés Gamen no comparten orden ni número de fotogramas, así que la plantilla busca cada
  fotograma por silueta y por posición aproximada. Con Goku SSJ acierta guardia, impulso y ki exactos.
- Tarea 6 (validación) a medias: comparando con lo elegido a mano, las reglas aciertan un 25 % y un clasificador por
  vecinos entrenado con las 162 selecciones, un 35 %. Lejos del 80 %. Causa: cada pack mezcla arte oficial, caras,
  escenas con otros personajes y varias tandas de golpes parecidos; con medidas simples no se distingue cuál eligió
  la persona. Consecuencia: casi todos los packs serían dudosos y la IA tendría que revisarlos casi todos.
  Preguntado al usuario cómo seguir.
- Decisión del usuario: «La IA revisa todos». La herramienta prepara (efectos, polvo, avisos, hojas y página) y la IA
  revisa todos los packs; al usuario solo le llega lo que la IA no tenga claro. El 80 % deja de ser condición.
- Tarea 6 cerrada como informe: `herramientas/validar_propuestas.py` (escribe `_revisar/validacion.md`). Mejorada la
  elección de la guardia (descarta arte oficial, caras y versiones grandes por su tamaño de píxel): 76/162. Total 27 %.
  Spec actualizado con el cambio del usuario (la IA revisa todas las propuestas).
- Tarea 7 hecha: `herramientas/hoja_dudosos.py` (hoja por propuesta para la IA, con ñ y tildes) y sección nueva en la
  guía. Probada con Goku SSJ: la hoja deja ver de un vistazo qué falla (p. ej. la estela 12 propuesta como impulso).
- Tarea 8 hecha: `herramientas/revision_html.py` (página para el usuario, doble clic, con cada animación en movimiento
  sobre la hierba del juego) y `herramientas/aplicar_decisiones.py`. Probada en el navegador con Goku SSJ y el soldado.
- Tarea 9 hecha: `proponer_forma` y `--formas-actuales` proponen arreglos para las 16 formas «agachadas» y las 4 «de
  tamaño desigual». Revisión de la IA a ojo: **todas rechazadas**. Las «agachadas» son vuelos o impulsos horizontales,
  del mismo tipo que la A corregida (las propuestas eran poses de pie o disparando); los «desiguales» miden igual que
  su guardia en pantalla (las auras y estelas engañan a la medida del píxel). Quedan aceptadas a propósito; no hay nada
  dudoso para el usuario esta vez. Probado en el navegador: Goku vuela sin polvo y del tamaño de su guardia.

### Cierre del bloque 1 (sesión 10)
- Hecho: polvo quitado al moverse (21 formas), herramienta de propuestas con pruebas (41), página de revisión, guía,
  README y TAREAS_CODEX al día. Todo en la rama `bloque1-fotogramas`, sin fusionar en main ni subir.
- Aprendido: con medidas simples las reglas solo aciertan un 25-35 %; la revisión de la IA es la que decide.
- Siguiente: revisión final del bloque y preguntar al usuario si fusionar la rama en main; luego el bloque 2.
- Usuario, al cerrar el día: «mañana vemos lo que queda; lo de la animación de caminar queda pendiente porque no me
  acaba de convencer cómo se mueven, pero por lo demás muy bien hecho todo». **Pendiente:** el movimiento por el mapa
  (pose de impulso de un fotograma con balanceo) sigue sin convencerle; preguntarle qué le chirría antes de tocarlo.
  La revisión final del bloque 1 (revisor nuevo) estaba en marcha; la rama `bloque1-fotogramas` no está fusionada.
- Revisión final del bloque 1 (revisor nuevo): arreglados 1 fallo crítico (la página de revisión y `aplicar_decisiones`
  no coincidían en el nombre de las propuestas de formas del juego) y 3 importantes (forma borrada en decisiones viejas,
  pack de solo chispas, packs nuevos sin orientación comprobada). 47 pruebas en verde. **Queda con polvo trunks/2** al
  moverse (el polvo toca el pie); se verá con el movimiento. 7 detalles menores apuntados para más adelante.

### Sesión 11 (Claude, 01/11/2026) · Movimiento según la tecla
- Usuario: «quiero que todos los personajes se muevan igual al sprite... si aprietas la A para la izquierda el
  personaje se mueve hacia esa conforme a la animación que tiene, y a la derecha igual».
- Hecho en `script.js`: mientras se mueve, el personaje **mira hacia donde va** (A izquierda, D derecha; con W/S
  conserva el lado) y dibuja **siempre su animación de moverse**. Los ataques automáticos, las cargas de ki y las
  técnicas siguen saliendo hacia el enemigo, pero ya no le giran ni le cambian la pose mientras se mueve. Parado, se
  gira y ataca como antes. Los rayos largos (Kamehameha) sí mantienen su pose de disparo. `?v=65`.
- Probado en el navegador con Goku y enemigos a la derecha yendo a la izquierda: mira a la izquierda todo el rato
  mientras ataca. No se pudo ver en movimiento real (el panel de pruebas estaba en segundo plano): falta que el
  usuario lo vea jugando. Sigue pendiente decidir si se fusiona `bloque1-fotogramas` en main.
- Usuario: «falta hacerlo en todos los personajes, que la animación de moverse sea unidireccional, y en algunos la
  pose de estar quieto que se mueve queda mal, por ejemplo con el Trunks sin espada». Aclarado con preguntas:
  «unidireccional» = **sin cambiar de pose** al moverse; a Trunks le pasa que **la pose es fea**.
- Hecho: al moverse, todos los personajes usan **una sola pose fija** (el primer fotograma de `move`; los 12 que
  tenían 2 ya no alternan). Trunks con armadura base (`trunkscell/0`): guardia de pie con las manos en la cintura
  (fotogramas 1 y 33 del pack 233; antes 26 y 27, postura agachada de pelea, guardada en `idleAntes`). `?v=66`.
- Hoja de todas las guardias y movimientos y medida de cuánto cambia cada guardia entre fotogramas: las que más
  cambian son bills/0, freezer/4, saibaman/0, freezer/5, trunks/2, zombies/1, vegettofan/1, brolyfan/0 y vegetaue/0.
  Pendiente: preguntar al usuario si alguna más le parece fea antes de tocarlas.

## 2026-11-01 — Codex · Organización del contexto

### Lo que pidió el usuario
- Organizar la carpeta para que las próximas sesiones de Claude utilicen el contexto de forma más eficiente.

### Lo que hice
- Preparé `ESTADO_ACTUAL.md` como relevo breve y mapa de archivos. Ajusté las instrucciones de entrada para consultar la documentación histórica y los archivos grandes según la tarea, conservando las reglas y el historial.
- No moví recursos ni modifiqué el juego. Comprobé previamente la sintaxis de `script.js`, `animaciones_juego.js` y `sprites.js`.

### A medias / problemas
- No se ha realizado una prueba de partida. El estado de cambios de Git no pudo consultarse en este entorno; verificarlo antes de hacer commits.

### Siguiente paso recomendado
- Confirmar el estado de Git y mantener actualizado el resumen al cambiar el proyecto. Revisar con el usuario el movimiento y las guardias pendientes.


## 2026-11-01 — Codex · Organización del proyecto

### Lo que pidió el usuario
- Aplicar las mejoras propuestas: relevo breve, separación gradual de código, índice de sprites, prioridades y guía de pruebas.

### Lo que hice
- Extraje las utilidades generales a `utilidades.js`, cargado antes de `script.js` desde `index.html`. Actualicé la versión de caché de `script.js` a 67.
- Creé `INDICE_SPRITES.md` y `herramientas/indice_sprites.py`, `PRUEBAS_RAPIDAS.md`, un archivo de prioridades corto y `TAREAS_CODEX_HISTORICO.md` conservando el documento anterior. Actualicé README, AGENTS y el resumen.
- Comprobé sintaxis, extracción idéntica del bloque y pruebas existentes de personajes, enemigos y objetos en una copia preparada.

### A medias / problemas
- El índice registra 170 formas con pack explícito, una ruta no encontrada (jiren/2). No implica que la forma no funcione: revisar la selección antes de modificarla.
- La prueba de navegador local no se pudo abrir desde el navegador de pruebas; falta comprobar el juego abriendo `index.html` y jugar una partida. La extracción es solo un primer paso, no una modularización completa.
- El estado de Git no pudo verificarse en este entorno; no se hizo commit.

### Siguiente paso recomendado
- Probar apertura y partida; investigar la ruta de Jiren y continuar separando sistemas solo cuando exista una tarea concreta y pruebas adecuadas.


## 2026-11-01 — Codex · Carpeta más fácil de recorrer

### Lo que pidió el usuario
- Organizar la carpeta con nombres claros y una guía visual.

### Lo que hice
- Reuní la documentación en `01 - GUIA Y DOCUMENTACION` y creé `ABREME - GUIA DEL PROYECTO.html`. Actualicé instrucciones, referencias y la salida del índice de sprites. Los recursos y código del juego mantienen sus rutas.

### A medias / problemas
- Falta la comprobación visual de una partida. Los documentos históricos conservan referencias originales, que pueden apuntar a rutas anteriores.

### Siguiente paso recomendado
- Abrir la guía y comprobar el juego; mantener actualizado el estado y el índice.

## 2026-11-01 — Codex · Nombres de carpetas

- El usuario pidió nombres más claros y una mejor organización visual.
- Renombradas las carpetas de guía, planes, recursos pendientes y dibujos propios; se actualizaron referencias activas y la guía visual. Las rutas antiguas en el historial se conservan como registro.
- Las carpetas técnicas `sprites`, `ui` y `herramientas` conservan sus nombres porque el juego y las herramientas dependen de ellas.

## 2026-11-01 — Codex · Organización visual de la carpeta

### Lo que pidió el usuario
- Organizar visualmente la carpeta principal, cambiar las rutas necesarias y documentarlo.

### Lo que hice
- Reuní los nueve archivos de código, estilos y recursos preparados en `02 - Código del juego`. Actualicé las rutas en `index.html`, las herramientas, las pruebas y la documentación activa. Los sprites originales y las herramientas conservan sus carpetas.
- Comprobé en una copia las rutas locales, sintaxis, pruebas de personajes, enemigos y objetos, y 18 pruebas de herramientas.

### Pendiente
- Abrir `index.html` con doble clic y jugar para comprobar visualmente. La política del navegador de pruebas impidió abrir archivos locales. No se comprobó ni modificó el estado de Git.

## 2026-11-01 — Codex · Ideas para Claude

- El usuario describió cambios deseados para personajes, ataques, equilibrio, interfaz, menús y música, y pidió reunirlos en un Markdown para Claude.
- Preparado `01 - Guía y documentación/Cambios propuestos por Josemi.md` con los objetivos, preguntas pendientes y recursos que aportará el usuario. Son propuestas; no se han implementado cambios en el juego.
- Siguiente paso: revisar el documento con el usuario y acordar con Claude las prioridades y decisiones creativas antes de implementar.

## 2026-11-01 — Claude · Revisión general y commit de la reorganización

### Lo que pidió el usuario
- «Vuelve a revisar todo el proyecto y dime»; después, «sí, haz el commit» de la reorganización de carpetas que estaba sin guardar.

### Lo que hice
- Revisión: sintaxis de los 9 JavaScript, `comprobar_personajes` (37 personajes, 90 formas), `comprobar_enemigos` (82 activos, 35 retirados), `comprobar_objetos` y 47 pruebas de herramientas: todo correcto.
- Juego servido en local tras la reorganización: menú, 62/62 guerreros y partida en Kame House sin errores de carga. Falta la prueba con doble clic.
- Commit de la reorganización en `bloque1-fotogramas` (git la registra como renombrados, se conserva el historial). `Recursos pendientes/escenarios` se añadió a la fuerza porque `.gitignore` tiene `ESCENARIOS/` y en Windows no distingue mayúsculas.

### A medias / problemas
- Nada subido a GitHub: `main` va 28 commits por delante de `origin/main` y `bloque1-fotogramas` 17 por delante de `main`.
- Los 7 personajes de DeviantArt (Nappa, Ginyu, Jeice, Guldo, Uub, Mr. Satán, A21) siguen en la rama `claude/quizzical-gates-9cf9c0`, que parte de 47 commits atrás: fusionarla tendrá conflictos (`script.js` cambió de carpeta).
- Quieto, Goku pasa de 103 a 0 de vida en ~14 s al minuto 1:14 (encaja con la queja del cuerpo a cuerpo).
- Letras borrosas: `resize()` ajusta la escala en medios pasos (x1,5, x2,5…), que dan píxeles desiguales.
- Con la ventana a tamaño 0, `present()` lanza un error de `drawImage` en cada fotograma.
- Gemas de experiencia dibujadas como rectángulos azules por código.

### Siguiente paso recomendado
- Decidir fusiones y `git push`; luego seguir el orden de «Cambios propuestos por Josemi»: HUD y nitidez, equilibrio de combate, personajes, menús.
- Arreglado `.gitignore` (`/ESCENARIOS/` solo en la raíz) y fusionado `bloque1-fotogramas` en `main` por avance rápido; subido a GitHub.

## 2026-11-01 — Claude · Error de dibujo y dificultad de los primeros minutos

### Lo que pidió el usuario
- «Sí, corrígelo»: corregir el error de dibujo visto en la prueba y bajar la dificultad del primer mapa.

### Lo que hice
- Error de dibujo (`render`, «Cannot read properties of undefined (reading 'width')»): el jugador pedía un fotograma que no existe. Caso
  confirmado en los datos: `gokumoro/5` (MUI) tiene un solo fotograma de daño y el juego pide el segundo. Ahora el índice se limita a los
  fotogramas que existen. Revisado el pack 251: no tiene ninguna pose de daño real, así que no se inventa un segundo fotograma (sigue pendiente).
  Además, `present()` ya no dibuja si la ventana mide 0 (error repetido al minimizar).
- Dificultad: medida con un jugador automático (huye de los enemigos, recoge gemas, elige siempre la primera mejora) en 20 partidas
  iguales (Kame House, Tierra y Desierto con Goku, Vegeta, Krilin y Piccolo). Causas encontradas: estampida del minuto 1 (17 enemigos
  un 25 % más rápidos), emboscada de 36 enemigos en anillo al segundo 90, primer evento al segundo 60, vida de los enemigos ×2,3 a los
  2 minutos y el agua frenando al jugador al 55 % (en la isla de Kame House huir te mete en el agua). El 72 % del daño era por contacto.
- Cambios (`02 - Código del juego/script.js`):
  - Estampidas de los minutos 1 y 2 con 9 y 14 enemigos (antes 17 y 22) y sin el +25 % de velocidad; desde el minuto 3, igual que antes.
  - Emboscadas con 18 enemigos antes del segundo 200 (antes 36).
  - El primer evento aleatorio llega al segundo 140 (antes 60).
  - Daño de los enemigos al 60 % al empezar, subiendo hasta el 100 % en el minuto 3.
  - La vida de los enemigos empieza a crecer con el tiempo a partir del minuto 1 y tu nivel pesa menos (+3 % por nivel en vez de +4,5 %).
  - El agua frena al 85 % (antes al 55 %).
  - Imán de gemas de 55 (antes 40).
  - Al recibir un golpe, los enemigos pegados (no los jefes) salen despedidos y dejan un hueco.
  - Probado y descartado: reducir los enemigos normales (daba menos experiencia y se moría antes).
- Resultado con las mismas 20 partidas: media 1:42 → 2:40, mediana 1:41 → 2:30, peor partida 0:42 → 1:49.
- Comprobado: sintaxis, `comprobar_personajes`, `comprobar_enemigos`, `comprobar_objetos` y 47 pruebas; partida en el navegador sin errores de consola. `script.js?v=74`.

### A medias / problemas
- El jugador automático juega peor que una persona: las cifras sirven para comparar, no como duración real. Falta que el usuario lo juegue.
- Siguen picos en 2:10-3:20: oleada de Cell Jr. (rápidos) al segundo 130, minuto 3 con estampida rápida a la vez que el primer jefe (3:00).
- El cuerpo a cuerpo sigue sin probarse a fondo.

### Siguiente paso recomendado
- Que el usuario juegue unos minutos y diga si el arranque se siente bien; después, HUD más pequeño y escala de píxel entera (nitidez).

## 2026-11-01 — Claude · HUD más pequeño y nítido

### Lo que pidió el usuario
- «Sí, sigue»: continuar con el HUD más pequeño y la imagen nítida (puntos de «Cambios propuestos por Josemi»).

### Lo que hice
- Causas de lo borroso: (1) la escala de pantalla iba en medios pasos (x1,5, x2,5 en 1080p), con píxeles desiguales; (2) el HUD usaba
  letra de 6 y 10 unidades (12 y 20 px), tamaños que no encajan con la rejilla de 8 px de «Press Start 2P» y salen suavizados.
- `resize()`: escala entera. Si la anterior ya era entera (720p, 768p) no cambia nada; si era media, baja al entero inferior
  (1080p: x2,5 → x2, se ve algo más de campo).
- `hud()` reescrito: se dibuja a 1 píxel de imagen por unidad (la mitad que el mundo; el doble si la pantalla va a x1), con letra
  de 8 o 16 e iconos a su tamaño real (16). Medido en un lienzo de prueba: la palabra del HUD pasa de 51 tonos a 22
  (los bordes ya no se emborronan). Cambios de colocación:
  - Arriba a la izquierda: nombre, «Nv.» y vida en dos líneas finas; el nombre se acorta solo si chocaría con el tiempo,
    y la barra de vida nunca llega a las esferas.
  - Arriba en el centro: tiempo, esferas e información; debajo, el evento en curso o la vida del jefe (antes la barra del jefe
    tapaba las casillas de técnicas).
  - Abajo: casillas de 24 (antes 52 px de imagen); la ayuda de controles solo los primeros 30 s (antes salía cortada).
  - Aviso central más fino.
  - En pantallas táctiles las casillas van al doble y por encima de los botones SON/II.
- `#radarAviso` más pequeño y arriba a la derecha. Versiones: `script.js?v=78`, `style.css?v=67`.
- Comprobado en el navegador a 1280×720, 1920×1080, 1024×768, 800×600 y móvil 375×812: sin solapes, clic y toque en las casillas
  seleccionan la técnica, menú de inicio correcto y consola sin errores. Sintaxis, comprobaciones de personajes, enemigos, objetos y 47 pruebas: bien.

### A medias / problemas
- La letra del navegador aún deja algún tono intermedio en los bordes (22 tonos frente a 51). Para que sea 100 % pura habría que
  cachear el texto en mapas de bits o usar una fuente de mapa de bits propia.
- «Press Start 2P» se carga de Google Fonts: sin internet cae a una letra del sistema (borrosa). Se podría incrustar (licencia OFL).
- En 1080p ahora se ve más campo y los personajes salen un 20 % más pequeños (x2 en vez de x2,5). Falta que el usuario lo valore.
- Los textos de menús y paneles (HTML) no se han tocado.

### Siguiente paso recomendado
- Que el usuario juegue y diga si el tamaño le gusta; después, las habilidades y efectos que tapan la pantalla, y el equilibrio del cuerpo a cuerpo.

## 2026-11-01 — Claude · Qué le queda al juego

### Lo que pidió el usuario
- «¿Qué le queda al juego?», mientras prueba el HUD y la dificultad nuevos.

### Lo que hice
- Repasé `ESTADO_ACTUAL`, «Cambios propuestos por Josemi», `SPRITES_PENDIENTES`, `PIXEL_ART_POR_CODIGO` y el código, sin tocar el juego.
  Pendientes por bloques:
  - Valoración del usuario: HUD, zoom en 1080p, primeros minutos, movimiento y guardias (`trunks/2` con polvo junto al pie).
  - Personajes: 37 jugables con 90 formas en `main`. La rama `claude/quizzical-gates-9cf9c0` (7 más) sigue sin fusionar.
    Tanda 2 de DeviantArt: Tenshinhan, Dabura, Videl, Burter, Recoome, Zarbon, Dodoria y A19. Quedan 124 packs de `sprites/` sin usar
    (sobre todo variantes de Goku, Vegeta y Goku Black); falta acordar con el usuario qué hacer con los incompletos.
  - Enemigos: 82 activos y 35 retirados por falta de sprites buenos; Nappa, Guldo y A21 pueden volver con los packs de la rama.
  - Combate: ataques y comportamientos distintos por enemigo y un cuerpo a cuerpo que compense. Picos de dificultad: la oleada
    de Cell Jr. (~2:10) y el minuto 3 (estampida y primer jefe).
  - Pantalla: efectos de técnicas demasiado grandes. «Press Start 2P» sin incrustar (sin internet se ve borrosa). La selección
    no colorea las estadísticas (vida verde, velocidad azul, ataque rojo) ni muestra el personaje entero bajo la cara.
  - Dibujado por código: suelos y decorados de los 24 mapas (los lleva otra sesión), disparos de enemigos, Kienzan, Genkidama,
    auras, chispas, gemas, zeni, cajas, iconos de ataques y flecha del radar.
  - Menú: iconos (los aporta el usuario), noticias, enlace al rap de Porta y música con aire de Dragon Ball (hoy es un chiptune
    generado por código). Todo esto necesita que el usuario elija antes.

### Siguiente paso recomendado
- Fusionar la rama de los siete personajes antes de que se separe más de `main`; después, efectos más pequeños y cuerpo a cuerpo.

## 2026-11-01 — Claude · Efectos de técnicas más pequeños

### Lo que pidió el usuario
- «Efectos más pequeños»: que las técnicas y sus efectos no tapen la pantalla y sigan leyéndose bien (punto de «Cambios propuestos por Josemi»).

### Lo que hice
- Medido en el navegador a 1280×720 (180 unidades de alto), con las técnicas al máximo y 36 enemigos alrededor:
  - La explosión del Eraser Cannon de Broly medía 187 unidades: más que la pantalla, y tapaba al propio Broly. La de la Genkidama, 169.
  - El fogonazo de las manos del Kamehameha medía unas 84×56 unidades y tapaba a Goku.
  - Las explosiones propias se pintaban encima de las balas enemigas, y los números de daño, con su recuadro negro, llenaban la zona.
- Cambios en `script.js`, solo de dibujo (daño, alcance y colisiones iguales):
  - `boomFrames()`: la explosión se dibuja a 1,5 veces su radio y como mucho a 64 unidades (antes a 2,2 y sin tope).
    El anillo fino de `explode()` sigue marcando todo el alcance.
  - `render()`: las explosiones de más de 40 unidades, al 85 % de opacidad.
  - `drawBeam()`: el fogonazo de las manos de los rayos, al 60 %; el cuerpo del rayo no cambia.
  - Números de daño a la mitad (un píxel de imagen por píxel del número, como el HUD); con la pantalla a x1, como antes.
    El «!» de aviso no cambia.
  - Rayos y balas enemigos se dibujan después de los efectos propios y de los números: nunca quedan tapados.
  - Destello de pantalla: como mucho 0,35 de opacidad (antes 0,8 al transformarse o con la Genkidama).
- `script.js?v=79`. Hecho en la rama `claude/efectos-pequenos`, sacada de `main` en el worktree, y llevado a `main` por avance rápido.

### Pruebas
- Capturas de antes y después de Eraser Cannon, Genkidama y Kamehameha a 1280×720, y rayo horizontal con balas enemigas
  sobre la explosión a 800×450. Consola sin errores.
- Sintaxis de todos los `.js`, comprobaciones de personajes, enemigos y objetos y 47 pruebas de herramientas: bien.
- No probado con doble clic: el panel del navegador abre el `index.html` local como página estática, sin scripts.
  El cambio no toca la carga de archivos (solo `?v=79`).

### A medias / pendiente
- El rayo enemigo de tipo Galick usa una hoja con una silueta de Vegeta dentro del círculo de salida. Es un aviso de peligro y no
  se ha tocado, pero conviene revisarlo.
- Falta que el usuario lo valore jugando. Cada valor (1,5, 64, 60 %, mitad, 0,35) está en un solo sitio y se cambia fácil.

### Siguiente paso recomendado
- Que el usuario lo pruebe; después, el cuerpo a cuerpo o fusionar la rama de los siete personajes.

## 2026-11-01 — Claude · Vuelo bajo al moverse

### Lo que pidió el usuario
- «Lo que le falta son animaciones de caminar bien hechas... ¿con Piskel?». Después: «busca hojas con andar, pero no creo
  que haya; tenemos que sacar nosotros un método que se vea bien con lo que tenemos». Eligió la **C: vuelo bajo**.

### Lo que hice
- Búsqueda web: no hay hojas de Dragon Ball con ciclo de andar en nuestro estilo. Lo más cercano son los sprites de
  Legacy of Goku II: vista cenital, unos 18×32 px y otro estilo.
- Datos: Goku base (pack 215) está ampliado ×9; el dibujo real mide unos 33×56 px con 24 colores.
- Maquetas animadas (GIF) con píxeles reales de Goku, Vegeta y Piccolo: pose fija, A piernas alternas (recortadas de la
  guardia), B rebote y C vuelo bajo.
- `script.js`: al moverse, la pose de impulso se despega 3 px de la sombra y flota 0, 1, 2 y 1 px a 8 pasos por segundo.
  Sube y baja poco a poco al arrancar y al pararse (`P.hov`); la sombra se queda en el suelo. Sustituye al balanceo
  anterior (seno de ±2 px). Solo el jugador; los enemigos no cambian. `script.js?v=80`.

### Pruebas
- En el navegador con Goku, Vegeta y Piccolo: moviéndose flota a 3-5 px y al pararse vuelve a 0. Consola sin errores.
- No probado con doble clic ni jugando de verdad: falta la valoración del usuario.

### Siguiente paso recomendado
- Que el usuario lo pruebe. Si gusta, valorar si los enemigos voladores deberían flotar igual.

## 2026-11-02 — Codex · Relevo para la siguiente sesión de Claude

### Lo que pidió el usuario
- Dejar la carpeta preparada para que el siguiente Claude entienda lo que quiere hacer en el juego.

### Lo que hice
- Añadido `00 - EMPIEZA AQUÍ - RELEVO CLAUDE.md`, con objetivos, instrucciones de entrada, cambios ya documentados, decisiones pendientes y mapa del proyecto.
- Enlazado el relevo y las propuestas desde `CLAUDE.md`; actualizadas las prioridades conservando las anteriores como historial y añadido un aviso al estado actual.

### A medias / problemas
- `git status` falló en este entorno: no se confirmó si había cambios sin guardar. `main` y su referencia local a `origin/main` apuntaban a `6506e25`; no se consultó el remoto. No se probó el juego.

### Siguiente paso recomendado
- El siguiente Claude debe verificar el estado real, leer las propuestas y coordinar con Josemi el primer bloque y la valoración del HUD, efectos y movimiento.

## 2026-11-02 — Claude (Opus) · Combate cuerpo a cuerpo

### Lo que pidió el usuario
- Empezar mejorando el cuerpo a cuerpo: «los enemigos me matan demasiado rápido cuando me acerco». Revisar cómo funciona, explicar los problemas y proponer un plan breve antes de cambiar nada. Trabajar por partes y ahorrar contexto (usa Claude Pro).
- Decisiones nuevas: **Super Saiyan debe ser desbloqueable**. Enlace del rap de Porta: https://www.youtube.com/watch?v=HunKXh1ikes
- Preguntó qué son los «packs incompletos» y qué es la rama de los 7 personajes.

### Lo que hice
- Revisado el código del cuerpo a cuerpo y de los enemigos (`script.js`: `fireSig`, combo, `hitPlayer`, bucle de enemigos, `director`).
- Diseño y plan (Superpowers): `Planes y diseños/superpowers/specs/2026-11-02-cuerpo-a-cuerpo-design.md` y `plans/2026-11-02-cuerpo-a-cuerpo.md`. Josemi eligió «A y luego B». Rama `claude/cuerpo-a-cuerpo`.
- Parte A aplicada (commit b9b063e): constante `MELEE_AJ` junto a `MELEE`. De cerca (<60 px) no disparan; el combo protege golpes×0,09 s + 0,25 s; cada golpe empuja al 60 % y aturde 0,2 s (no a jefes); el impulso para a 20 px. Nueva comprobación `herramientas/comprobar_combate.cjs`. `script.js?v=81`. `window.AS.aj` expone `MELEE_AJ` para medir.

### Pruebas y medición (jugador automático en el navegador, Goku, mapa Tierra)
- Bot que va a por el enemigo más cercano con el Combo de golpes. Antes (valores antiguos puestos en `AS.aj`) 99 s de media; después 101 s. Sin diferencia real.
- Origen del daño al ir cuerpo a cuerpo: **~95 % por contacto**, casi nada de balas. Los golpes llegan en el hueco entre combos y de enemigos a los lados y detrás.
- Probado y descartado (sin mejora fuera del ruido, revertido): protección del combo más larga (0,6 s extra), aturdimiento 0,4-0,6 s, enemigos aturdidos sin daño por contacto, combo que golpea alrededor y no solo al frente.
- Referencia: bot que se queda a distancia con bolas de ki, 123 s de media. Ir cuerpo a cuerpo penaliza (~100 frente a ~123 s), pero el bot embiste en línea recta y no es fiable para medir la sensación del cuerpo a cuerpo.
- Sintaxis, `comprobar_combate`, `comprobar_enemigos`, `comprobar_personajes` correctos; consola sin errores. No probado con doble clic ni jugando de verdad.

### A medias / problemas
- La parte A no demuestra mejora con el bot. Falta que Josemi lo juegue. La causa de fondo es el daño por contacto pasivo de la masa de enemigos: la parte B (enemigos que avisan antes de golpear) ataca justo eso.
- Revisión final hecha por mí mismo (sin revisor aparte) para ahorrar uso de Claude Pro.

### Siguiente paso recomendado
- Que Josemi juegue la rama y diga si nota diferencia; después, diseño breve de la parte B centrado en el contacto.

## 2026-11-02 — Claude (Opus) · Parte B: tipos de enemigo

### Lo que pidió el usuario
- «Aquí la cosa es que sepas cuándo utilizar el ataque cuerpo a cuerpo: si hay 20 mil enemigos no renta porque te matarán, pero tácticamente sí». Los élites también deben ser peligrosos de cerca.
- Eligió la opción 3 (varios tipos de enemigo) «y haz lo que queda pendiente también, no pares».

### Lo que hice
- Tipos con las poses que ya existen (Attack, Kick, Pow, Walk): pegador (avisa 0,5 s y golpea), embestidor (se carga y embiste en línea recta), tirador (mantiene distancia y retrocede), élite (avisa menos, encadena 3 golpes, un solo golpe tuyo no lo para). El roce pasa a ser daño continuo por enemigo, así que rodearte de muchos mata y uno suelto apenas hace daño. Escudos o agarres no: no hay animaciones.
- Código (`script.js`, commit 122dc67): `ROL_AJ` y `rolE`/`rolAI`/`rolCancel` antes de `update`; tipo deducido de `ET` (jefe, kami, élite, tirador si `shoot`, embestidor si `spd>=44`, si no pegador). Tu golpe aturde y cancela su ataque; a los élites solo cada segundo golpe. Roce `roce()` = 0,5×daño por segundo y por enemigo, sin invulnerabilidad (jefes igual que antes). Dibujo: pose Attack al avisar, Attack/Kick al golpear, Pow al cargar; «!» amarilla (roja en élites) y línea roja de la embestida. La pose de ataque «de adorno» al estar cerca queda solo para jefes.
- Tope de 6 balas enemigas en pantalla (`ROL_AJ.maxBalas`): con los tiradores guardando distancia, el 72 % del daño a distancia eran balas.
- Corregido durante la prueba: el aviso usaba `time`, que no existe en `drawPkEnemy`, y rompía el dibujo. Prueba añadida.
- `herramientas/comprobar_roles.cjs`: prueba la lógica real de cada tipo con `vm`. `AS.rol` expone `ROL_AJ`. `script.js?v=84`.

### Medición (bot, Goku, Tierra, 6-8 partidas)
- Cuerpo a cuerpo: 100 s → ~151 s. A distancia: 123 s → 124-136 s. Ruido grande entre partidas.
- Comprobaciones: sintaxis, roles, combate, enemigos, personajes, objetos y pruebas de Python correctas; consola sin errores en v=84; captura con los avisos vista.
- No probado: abrir con doble clic (el panel muestra los archivos locales como imagen fija) ni jugar una persona.

### Noticias y rap en el menú (lo decidido)
- Recuadro «NOTICIAS» arriba a la izquierda del menú principal (`#hub`, `index.html`) con tres novedades del combate y debajo el enlace al rap de Porta (https://www.youtube.com/watch?v=HunKXh1ikes, se abre en otra pestaña). Estilos `.hubNews`/`.hubRap` en `style.css?v=69`. En pantallas bajas (<700 px) solo título y enlace; en móvil va debajo de las estadísticas. Comprobado a 1366×768, 800×600 y 375×812 sin solaparse ni desbordar.
- El texto de las noticias es una propuesta mía: Josemi decide qué contar ahí y si se actualiza a mano.

### Transformaciones con un deseo a Shenron
- Josemi: Super Saiyan desbloqueable «con un deseo a Shenron», el del menú (permanente), no el de las bolas en partida.
- Hecho: en la pantalla de Shenron, botón «DESEO: DESPERTAR <forma> DE <compañero> · N TICKETS» (`#gForma`). Cada deseo despierta la siguiente forma del compañero del menú; cuesta 5 tickets × número de forma (5, 10, 15, 20…). Guardado en `formas[héroe]`. En partida el nivel solo transforma hasta las formas despertadas; si llegas al nivel sin el deseo sale una vez «FORMA BLOQUEADA · Pídesela a Shenron en el menú».
- Decisiones mías: se aplica a todas las transformaciones de todos los personajes (no solo Super Saiyan), de una en una; las partidas guardadas no conservan formas (todos empiezan en base); el coste es una propuesta.
- `herramientas/comprobar_formas.cjs` (lógica real con `vm`). `script.js?v=86`. Probado en el navegador: botón, cobro, siguiente forma, aviso en partida y transformación con el deseo; consola limpia.

### Pendiente que necesita a Josemi
- Jugar la rama y valorar el combate; decidir si se fusiona en `main`.
- Valorar el coste de las formas jugando. (Confirmado por Josemi: se bloquean **todas** las transformaciones, como está.)

### Valoración de Josemi tras jugar (2 nov.) — para el bloque de jugabilidad, más adelante
- «Está bien, pero lo que mola es que los enemigos te vengan ya de primeras y que no se esperen»: quitar las esperas (avisos que paran al enemigo, tiradores que guardan distancia) o reducirlas mucho.
- «Los ataques cuerpo a cuerpo deben ser útiles, pero solo en algunas situaciones».
- Kaioken: algo que se consigue si duras X tiempo y que aumente todas las estadísticas (fuerza y todo), como en la serie.
- Prioridad ahora: resolver primero los cambios de `Cambios propuestos por Josemi.md` y después volver a la jugabilidad. La rama `claude/cuerpo-a-cuerpo` sigue sin fusionar.
- Música del juego, iconos del menú (los aporta él), retrato fijo en la selección (¿cambia con la transformación?), packs incompletos, rama de los 7 personajes.

### Cierre de la sesión (2 nov.)
- Josemi va a crear un proyecto nuevo y pidió dejarlo todo escrito. Actualizados `00 - EMPIEZA AQUÍ - RELEVO CLAUDE.md` (estado completo, tabla de puntos pendientes y valoración tras jugar), `ESTADO_ACTUAL.md` y `README.md`.
- Hecho y guardado en `claude/cuerpo-a-cuerpo`: cuerpo a cuerpo (A), tipos de enemigo (B), noticias y rap en el menú, transformaciones con deseo a Shenron. Sin fusionar en `main` ni subir.
- A medias: nada en código. Sin comprobar: apertura con doble clic.

### Siguiente paso recomendado
- Preguntar a Josemi por qué punto de «Cambios propuestos» empezar (selección y estadísticas, o inventario de sprites) y si fusiona la rama en `main`. La jugabilidad (enemigos sin esperas, Kaioken por tiempo) va después.

- Subido a GitHub (2 nov.): `main` avanzada con todo el trabajo (a191a967) e incluida la carpeta `sprites/` (33.697 archivos, 420 MB; repo privado); subidas también las ramas `claude/cuerpo-a-cuerpo`, `claude/quizzical-gates-9cf9c0`, `bloque1-fotogramas`, `claude/efectos-pequenos` y `claude/vuelo-bajo`.

## 2026-11-02 — Claude (Opus) · Selección y estadísticas (puntos 4 y 5)

### Lo que pidió el usuario
- Trabajar desde GitHub (comprobado: su carpeta del escritorio y `main` en GitHub son idénticas).
- Empezar por el bloque «Selección y estadísticas»: retrato fijo de la cara en la selección con el personaje como en partida debajo, y estadísticas con colores (vida verde, velocidad azul, ataque rojo).

### Lo que hice
- Decisión de Josemi sobre el retrato: «si por ejemplo tienes la cara de goku super saiyan ponla, pero si no hay cara no se pone». Aplicado: la cara sigue a la forma que se muestra; si esa forma no tiene retrato propio no se pide prestado el de otra (`faceExact`), sale «SIN RETRATO». Hoy las 168 formas tienen retrato propio.
- Tarjetas (`buildCards`): cara de la forma base fija (se quitó el cambio automático cada 2,5 s), debajo el personaje como en partida (guardia animada, escala ×2 o ×1,5 sin suavizado; solo se dibujan las tarjetas visibles, `drawCardSprites`) y las estadísticas en barras: VIDA verde, VEL azul, ATQ rojo, con etiqueta y número (`statBars`; la barra compara con el resto del plantel).
- Ficha grande: ◀ ▶ para elegir la forma (cara y sprite cambian juntos, ya no rotan solos), aviso «Despiértala con un deseo a Shenron» si esa forma no está despertada, y las mismas barras. `script.js?v=87`, `style.css?v=70`.
- Comprobado: capturas a 1366×768 y 375×812, consola sin errores del juego, `comprobar_*.cjs` correctos. No probado: doble clic en Windows ni con la fuente Press Start 2P (en la nube no carga Google Fonts).
- Pendiente de Josemi: valorar el aspecto (tamaño de las barras, que las tarjetas sean más altas).
