# Tareas para Codex (en este orden)

Antes: lee `AGENTS.md` y `herramientas/GUIA_ANIMACIONES.md`. Apunta todo en `BITACORA.md` y haz commit tras cada tarea.
Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` con `PYTHONIOENCODING=utf-8`.
Tras cambiar `script.js` o `animaciones_juego.js`, sube el `?v=N` de los 5 recursos de `index.html` (ahora `?v=29`).

**Prioridad actual (usuario, sesión 7): seguir animando todos los personajes.** Integrados 5 nuevos jugables con
14 formas (61 en total). Continuar la lista B real de `SPRITES_PENDIENTES.md`; el apartado C explica por qué se
aparcan ciertos packs incompletos. Las selecciones nuevas están en `variantes.json` y sus altas en `NUEVOS`.

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

Lista en `SPRITES_PENDIENTES.md` (apartado B): 62 de Goku, 30 de Vegeta, 16 de Goku Black. Agrupa 3-6 packs por personaje.
Cada personaje necesita **dos cosas** (si falta la segunda, no sale en el juego):
- sus formas en `herramientas/animaciones/variantes.json` (con `poner.py`), y
- su entrada en la tabla `NUEVOS` de `script.js` (copia el formato de `gokumoro`: name, rar, hp, spd, atk, start, desc,
  forms, aura, sig). Auras válidas: white, gold, red, blue, green, purple, orange, silver.
Siguiente grupo propuesto: variantes fanmade de Goku (129 Bestia, 130 Ikari, 131 Místico, 139 SSJ 100), siempre después de mirar sus hojas.
Goku Broly 216/221 ya están; 217/222 quedan incompletos (ver apartado C).
Quita de `SPRITES_PENDIENTES.md` los packs usados y actualiza el número de jugables en `README.md` (ahora 61).

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
