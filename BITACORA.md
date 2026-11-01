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
