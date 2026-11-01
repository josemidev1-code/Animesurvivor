# Tareas para Codex (en este orden)

Antes: lee `AGENTS.md` y `herramientas/GUIA_ANIMACIONES.md`. Apunta todo en `BITACORA.md` y haz commit tras cada tarea.
Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` con `PYTHONIOENCODING=utf-8`.
Tras cambiar `script.js` o `animaciones_juego.js`, sube el `?v=N` de los recursos de `index.html` (ahora `?v=63`).

## Empieza aquí (relevo del 01/11/2026, fin de la sesión 9 de Claude)

- main está limpio y subido (ebc1b50). Lo último: escenarios con tiles reales del pack Ninja Adventure.
- **Pendiente de decisión del usuario:** la rama `refs/heads/claude/quizzical-gates-9cf9c0` (commit ae765b9) trae 7 jugables
  nuevos de DeviantArt (Nappa, Ginyu, Jeice, Guldo, Uub, Mr. Satán, Androide 21). No está en main. Pregunta antes de fusionar;
  si dice que sí, mira el cierre de la sesión 9 en `BITACORA.md` (conflictos esperados y pasos).
- Probar en el navegador: `python -m http.server 8765` en la carpeta (en `.claude/launch.json` como «animesurvivor») y en la
  consola `AS.start(idPersonaje, idMapa)` (mapas con `AS.maps()`), `AS.tick(5)`, `AS.spawnBoss()`, `AS.enemies()`. Elegir carta de nivel:
  `#levelup:not([hidden]) #ups button`.
- Sprites de fuera: DeviantArt sí (descargar el original de la ficha y poner autor y enlace en `PACK_CREDITS` de script.js
  y en `CREDITOS_RECURSOS.md`). Spriters Resource tiene verificación anti-bots: no forzarla.
- En bash de Windows, `python3` se cuelga: usa la ruta completa de Python de arriba.

**Prioridad actual (usuario, sesión 7): seguir animando todos los personajes.** Integrados 6 nuevos jugables con
17 formas (62 en total). Continuar la lista B real de `SPRITES_PENDIENTES.md`; el apartado C explica por qué se
aparcan ciertos packs incompletos. Las selecciones nuevas están en `variantes.json` y sus altas en `NUEVOS`.

**Sesión 9 (Claude):** arreglados los jefes invulnerables (no tenían radio `r`), vida sobre la cabeza de los enemigos,
bolas teledirigidas (opción `home` de `SHOT`), pose de brazos arriba si el enemigo está encima, portadas de mapas
(`portadas_mapas.js`), Shenron real en el gachapón (`shenron_imagen.js`) y panel de subida de nivel azul.
Pendiente de esa petición: repasar a ojo caminar/atacar de TODOS los personajes (formas con `move` de 1 fotograma
flotan; `attack`/`ki` deben mirar hacia el enemigo), más variedad de enemigos (recuperar los 44 retirados) y el resto
de cosas dibujadas por código de `PIXEL_ART_POR_CODIGO.md` (suelos, rayos, auras, iconos).

**Sesión 9, segunda parte:** cuerpo orientado al moverse/atacar, 11 formas corregidas, 26 ataques de la serie
(`SIGS_SERIE`, barrera y absorción en `NOVA`), ficha animada en PERSONAJES y 6 eventos aleatorios (`eventos()` en script.js).
Todos los personajes tienen lista propia. Hay 12 eventos (`EVENTOS`). Rayos y bolas ya salen de los packs (`kiOrb`, `kiShot`). Quedan por código: Makankosappo, disparos enemigos, auras.

**Petición de sesión 8:** buscar sprites y pixel art animado en DeviantArt, especialmente objetos, con créditos.
Primer lote integrado: senzu real, cápsulas de vida/ki y radar; fuentes en `CREDITOS_RECURSOS.md`.
El radar animado de Lady-Pixel se conserva íntegro. `node herramientas/comprobar_objetos.cjs` pasa;
falta revisar los objetos en una partida real. Catálogo de personajes, efectos y escenarios revisados en ese documento.
El tileset de LorisC93 está descargado en `recursos_pendientes/escenarios/`, todavía sin usar.
No usar los avatares de SailorTrekkie92 sin su permiso: su biografía lo exige.

## 1. Rehacer los ~45 enemigos con recorte viejo (prioridad del usuario)

**Estado tras Codex, sesión 6:** 13 IDs más enlazados a formas ya revisadas, corregida la guardia en el dibujado,
44 tipos retirados temporalmente de todo el catálogo activo. Lista exacta en `SPRITES_PENDIENTES.md`, A.1.
Los 24 mapas conservan cinco jefes; hay menos variedad de enemigos normales. `node herramientas/comprobar_enemigos.cjs`
comprueba las tablas y simula 16 minutos por mapa. Falta ver una partida: la política del navegador impidió abrir
el archivo local. También siguen pendientes el lanzamiento de Ráfaga de Ki y una transformación en pantalla.

No des por hecho que hay un pack propio de todos ellos: revisados los siete packs mixtos (2.396 PNG), muchos solo
tienen una pose aislada. Zamasu corrupto (106/107) es el primer candidato para recuperar; la selección de prueba
del 106 se descartó al confundir patadas con daño y mezclar orientaciones en ki. No quedó integrada.
Los demás retirados necesitan secuencias completas antes de volver a añadirlos.

Problema: sus tiras salen de `sprites.js` (importación vieja): tienen **huecos transparentes** (se borró el blanco)
y muchos andan con una sola pose. Lista: última sección de `PIXEL_ART_POR_CODIGO.md`
(Jeice, Ginyu, soldados de Freezer, Esbirro de Babidi, Cell Jr., Meca Freezer, Garlic Jr., Ozaru, A21, Whis, Zeno…).

Cómo (igual que los héroes):
1. Busca su pack en `sprites/` y míralo: `herramientas/ver_pack.py "<pack>" 1`.
2. Elige fotogramas con `herramientas/poner.py enemigos.json <id> 0 '{"pack":"...","idle":[..],"move":[..],"attack":[..],"kick":[..],"ki":[..],"pow":[..],"hurt":[..]}'`
   (id nuevo, p. ej. `e_jeice`). `move` con **2 o más** fotogramas o el enemigo flotará en guardia (Idle).
3. `montar_animaciones.py` y revisa a ojo con `revisar_todo.py <id>` (`herramientas/_revisar/todo_N.png`).
4. En `script.js`, añade cada enemigo a la tabla `ENEMIGO_HEROE` (busca ese nombre): clave = id de `ET`
   (los que usa el enemigo, ver `AS.SCPACK.e` en consola), valor = `['e_jeice',0]`. Con eso deja de usar la tira vieja.
5. Si un enemigo no tiene pack bueno: quítalo de `MAPS`/`WAVES` y apúntalo en `SPRITES_PENDIENTES.md`.

## 2. Meter los packs pendientes como jugables

Lista en `SPRITES_PENDIENTES.md` (apartado B): 59 de Goku, 30 de Vegeta, 16 de Goku Black. Agrupa 3-6 packs por personaje.
Cada personaje necesita **dos cosas** (si falta la segunda, no sale en el juego):
- sus formas en `herramientas/animaciones/variantes.json` (con `poner.py`), y
- su entrada en la tabla `NUEVOS` de `script.js` (copia el formato de `gokumoro`: name, rar, hp, spd, atk, start, desc,
  forms, aura, sig). Auras válidas: white, gold, red, blue, green, purple, orange, silver.
Siguiente grupo propuesto: Goku de Granola (132, 136 y 149), siempre después de mirar sus hojas.
Goku alternativo (129 Bestia, 130 Ikari y 131 Místico) ya está integrado; 139 SSJ 100 queda pendiente.
Goku Broly 216/221 ya están; 217/222 quedan incompletos (ver apartado C).
Quita de `SPRITES_PENDIENTES.md` los packs usados y actualiza el número de jugables en `README.md` (ahora 62).

## 3. Sustituir el pixel art dibujado por código

`PIXEL_ART_POR_CODIGO.md` lista lo dibujado por código. El usuario pasará dibujos; se meten como el logo y las esferas:
PNG en `ui/`, en base64 dentro de `ui_imagenes.js` (`window.UI_IMG`), y se dibujan desde `script.js`
(ejemplo: `drawDBall`). Los rayos (Kamehameha…) se pueden sacar de los propios packs, que los traen.

## 4. HUD y subida de nivel como las capturas de PokéSurvivor

Detalle en la entrada antigua de `BITACORA.md` («HUD y subida de nivel»): cámara más cerca, vida/nivel arriba a la
izquierda, casillas de ataque abajo, panel azul con cartas al subir de nivel, barras de vida y números de daño.

## Cómo probar

Servidor: `python -m http.server 8765` en la raíz y abre `http://localhost:8765/index.html`.
En la consola, `window.AS` da acceso al juego: `AS.spawnAt('blackssjB',60,0)`, `AS.addMove('kiblast')`,
`AS.scLoad(clave)`, `AS.scHero(id,forma)`. Para entrar en partida: carta del personaje → `#start` → JUGAR → `#mapCards button`.
Pendiente de ver en pantalla: un lanzamiento de Ráfaga de Ki (el personaje debe girarse hacia el enemigo)
y una transformación al subir de nivel.
