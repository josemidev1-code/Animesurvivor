# Estado actual — AnimeSurvivor

Actualizado: 5 de noviembre de 2026.

## Últimas novedades implementadas (Sesión 19 - Antigravity)
1. **Accesibilidad total de menús para niños de 5 años y navegación intuitiva**:
   - **Barra universal de navegación superior (`.menuTopBar`)**: Implementada en todos los 10 menús y modales del juego (`#roster`, `#shop`, `#rank`, `#settings`, `#mine`, `#gacha`, `#forge`, `#train`, `#credits`, `#maps`). Cuenta con un botón grande, táctil y evidente `◀ VOLVER` a la izquierda, título nítido en el centro y botón de cierre `✕` en rojo de alto contraste a la derecha. La barra es fija (`position: sticky`), garantizando que aunque haya scroll siempre esté visible y al alcance de un clic o toque con el dedo.
   - **Salida universal por teclado (`Escape` y `Backspace`)**: Cualquier modal o menú abierto se cierra de inmediato regresando al menú principal sin posibilidad de atascarse o perderse.
   - **Botón de jugar pulsante estilo PokéSurvivor**: Botón principal del Hub con la Nube Kinton dorada (`¡A LUCHAR! / JUGAR`), tamaño aumentado y halo de luz vibrante para atracción visual inmediata.
2. **Integración completa de Pixel Arts de Dragon Ball en menús y mejoras**:
   - **Menú Principal (Hub)**: Sustitución de iconos genéricos o emojis por pixel arts oficiales cargados desde `OBJ_IMG`: Nube Kinton (`kinton`), Scouter (`scouter`), Pesas de Kaio (`pesas`), Cápsula Hoi-Poi (`capsulacorp`), Esfera de 4 estrellas (`esfera4`), Radar del Dragón (`radar`), Bastón Nyoibo (`bastongoku`) y Scouter Rojo (`scouterRojo`).
   - **Mejoras permanentes (`drawTrain`)**: Las 10 mejoras de entrenamiento ahora muestran sus sprites de Dragon Ball a 36x36px: Pesas de Kaio (Daño), Cápsula Médica (Salud), Armadura Saiyan (Defensa), Nube Kinton (Velocidad), Cápsula de Ki (Recarga), Radar del Dragón (Atracción), Bolsa de Senzus (Regeneración), Cápsula Dorada (Sabiduría/XP), Corporación Cápsula (Fortuna/Zeni) y Esfera de 4 estrellas (Poder Crítico).
   - **Tienda Hoi-Poi (`drawShop`)**: Iconos de Cápsulas Hoi-Poi (`capsulacorp`), Cápsulas Doradas (`capsulaDorada`) y Esferas (`esfera7`) para adquisición de tickets de deseo.
3. **Cinemática de Shenron limpia y deseos exclusivos de personajes**:
   - **Shenron como protagonista exclusivo**: Se eliminaron elementos recargados (nubes de tormenta, bolas giratorias y destellos cegadores). Ahora se muestra únicamente la silueta imponente de Shenron flotando sobre un cielo nocturno estrellado con sus ojos carmesí iluminados.
   - **Deseos centrados 100% en personajes**: Eliminada cualquier recompensa de monedas Zeni del dragón sagrado. Shenron ahora otorga recompensas directas de guerreros: Desbloqueo de nuevo personaje, Despertar de atributos (+8%), Maestría de combate o Tickets sagrados de deseos.
4. **Caché actualizada**: `script.js?v=155` y `style.css?v=83`.

## Novedades anteriores (Sesión 18 - Antigravity)
1. **Rediseño integral de HUD, pixel art de mejoras y menú de subida de nivel estilo PokéSurvivor**:
   - **Sustitución de todas las mejoras pasivas (`CARDS`) por sprites oficiales en pixel art auténtico**: Eliminados por completo los dibujos procedimentales rudimentarios con `px()` y `pball()` (corazón de 8 bits, cubo rojo plano, reloj azul). Ahora cada mejora tiene un sprite oficial de 32x32 de Dragon Ball:
     - `power` («Entrenamiento»): Pesas pesadas de combate de Kaio (`pesas`).
     - `hp` («Gravedad x100»): Cápsula médica Hoi-Poi de salud vital (`capsulaVida`).
     - `armor` («Armadura Saiyan»): Pechera oficial Saiyan de Vegeta (`armaduraSaiyan`).
     - `speed` («Sin pesas»): Nube Kinton mágica voladora (`kinton`).
     - `cd` («Control del Ki»): Cápsula azul de ki concentrado (`capsulaKi`).
     - `magnet` («Rastreador»): Scouter de rastreo de combate (`scouter`).
     - `regen` («Semillas Senzu»): Bolsa de alubias de Karin (`senzuBolsa`).
     - `xp` («Sabiduría de Kaio»): Cápsula dorada legendaria (`capsulaDorada`).
     - `crit` («Espíritu Saiyan»): Destello de impacto Super Saiyan dorado/rojo (`crit`).
     - `knockback` («Kiai de Choque»): Ondas de choque sónicas concéntricas (`knockback`).
     - `zenkai` («Poder Zenkai»): Llama Kaio-ken / Zenkai ardiente saiyan (`zenkai`).
     - `area` («Concentración»): Cúpula esférica de barrera de energía dorada (`area`).
     - `aura_burst` («Aura Destructora»): Llamas de aura Super Saiyan viva con relámpagos (`aura_burst`).
   - **Iconos de técnicas de combate (`MV`) a resolución nativa 32x32**: Ataques físicos y cuerpo a cuerpo (`punch`, `kick`, `lariat`, etc.) renderizados con el guantelete Saiyan de impacto y chispas (`melee`), espadas con la espada mágica Z de Trunks (`sword`), y ondas de energía con núcleos blancos radiantes y auras de plasma.
   - **Rediseño del modal de subir de nivel (`#levelup` y `.up`)**: Cuadro ergonómico y equilibrado, casillas cuadradas (44x44px) con sprites de 32x32 pixel-perfect, píldoras de tipo estilizadas con esquinas redondeadas (`NUEVA TÉCNICA`, `NIVEL X`, `EVOLUCIÓN`, `FUSIÓN`, `CURA TOTAL`), tipografía retro jerárquica y tecla de atajo cuadrada.
   - **HUD en partida limpio y despejado**: Retiradas las dos filas de iconos flotantes de técnicas y cartas pasivas que saturaban la pantalla superior izquierda (las pasivas se consultan organizadamente en la pausa). Barra de vida esbelta estilo PokéSurvivor (nombre y nivel integrados, barra de HP esmeralda/ámbar/roja con brillo y barra de EXP dorada). Arriba centro con tiempo, 7 esferas sutiles y K.O. Abajo centro con el dock de ranuras de ataque estilizado.
   - **Caché actualizada**: `script.js?v=154` y `style.css?v=82`.

## Novedades anteriores (Sesión 17 - Antigravity)
1. **Control manual exclusivo de ataques por teclado numérico para todos los personajes**:
   - **Disparo exclusivo por ranura**: Eliminado el bucle de fallback automático de `sigUpdate` que disparaba técnicas secundarias al entrar en cooldown la seleccionada.
   - **Desactivado el disparo simultáneo automático en `updateMoves`**: Restringido exclusivamente a pasivas orbitales de soporte continuo (`orbs`).
   - **Control reactivo por teclado numérico (`1` a `6`)**: Captura universal para teclas superiores (`Digit1`..`Digit6`), teclado numérico (`Numpad1`..`Numpad6`) y `e.key`.

## Novedades anteriores (Sesión 15 - Antigravity)
1. **Rediseño y tipografía legible del panel de subida de nivel (`#levelup`)**:
   - Eliminadas las fuentes microscópicas (7px, 7.5px y 8px) que volvían el texto casi ilegible.
   - **Título `#levelup h2` / `#luTitle`**: aumentado a **16px** en `Press Start 2P` con sombra épica naranja/negra.
   - **Subtítulo `.lusub` y `<kbd>`**: aumentados a **10px** con teclas doradas nítidas.
   - **Nombres de técnica / reliquia (`.up .nm`)**: aumentados a **12px** en negrita con sombra y contraste total.
   - **Etiqueta de nivel (`.up .lv`)**: aumentada a **9px** con borde dorado y fondo naranja intenso.
   - **Descripción de la técnica (`.up .ds`)**: aumentada a **16px** usando la tipografía retro arcade `VT323` en tono dorado suave (`#fef3c7`), logrando lectura cómoda e instantánea.
   - **Teclas de acceso rápido (`.up .key`)**: aumentadas a **12px** en recuadro dorado de 30×30 px.
   - **Iconos (`.up canvas`)**: aumentados a **48×48 px** con marco dorado pulido.
   - **Cuadro contenedor (`#levelup .lupanel`)**: ajustado a `width: min(520px, 94vw); min-height: min(480px, 90vh); aspect-ratio: 1 / 1.05;` con padding de 18px 20px, llenando el espacio armónicamente sin vacíos ni apretujones.

## Novedades anteriores (Sesión 14 - Antigravity)
1. **Rediseño estético y limpieza del fondo de la pantalla de inicio**:
   - Eliminado el desfile desordenado de personajes y sus sombras rectangulares oscuras (`drawTitleDemo`), que ensuciaban la hierba y entorpecían la visión del menú.
   - Sustituido por una presentación limpia, cinematográfica y elegante con viñeta suave y partículas doradas de ki.

## Novedades anteriores (Sesión 13 - Antigravity)
1. **Colección de Sprites Pixel Art de Objetos de Dragon Ball**:
   - Integrados 11 objetos y reliquias en pixel art auténtico (eliminando los dibujos por código): Nube Kinton, Bastón Nyoibo, Scouter verde y rojo, Bolsa de Senzu, Pesas Kaio, Vasija Mafuba, Cápsulas Hoi-Poi (azul, dorada y roja), y Armadura Saiyan.
2. **Animación y Cinemática Épica de Shenron (Supersonic Warriors 2 - NDS)**:
   - Sprites oficiales de Shenron de Nintendo DS (128×127 px), pose rugiendo (80×128 px), nubes oscuras de tormenta y relámpagos dorados.
   - Cinemática de deseos del Gachapón (`wish`) totalmente renovada con ojos carmesí brillantes y lluvia de confeti de estrellas.
3. **Recordatorio especial de lanzamiento — Escuadrón Ginyu**:
   - Comprometido e inmortalizado en `CREDITOS_RECURSOS.md` y `BITACORA.md`: al publicar el juego, todas las IAs del desarrollo colaborativo (Claude, Codex, Antigravity...) serán homenajeadas y caracterizadas como el mítico **Escuadrón Ginyu (Tokusentai!)** en pose heroica especial.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic (sin servidores ni fetch runtime).
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. Todo en español para el usuario.


## 6 nov. — El invento de Bulma
- Gachapón con máquina Hoi-Poi pixel art, cápsula que cae y rebota, humo y revelación del guerrero con su ataque/guardia. Apertura x1/x10, resumen de x100, salto, Escape, foco contenido y preferencia de movimiento reducido.
- Recompensas guardadas al tirar una sola vez. Pruebas navegador x1/x10/gratis, persistencia y saldo correctos. script.js?v=157, style.css?v=84. GitHub Pages no verificado en esta sesión.
- Revisión visual del gachapón: nuevo laboratorio y cápsula raster en ui/gacha, humo y trayectoria mejorados, personaje mayor sobre plataforma. script.js?v=158. Prueba visual correcta en móvil, sin errores de consola.


## 6 nov. — Auditoría e integración de sprites
- 125 selecciones corregidas en 91 formas. Combos continuos y enemigos con secuencias de ataque. Cinco incorporaciones desde packs locales completos.
- 307 formas montadas, índice sin rutas faltantes. Catálogo y pruebas de navegador sin errores de carga de sprites. Detalle y límites en REVISION_SPRITES_2026-11-06.md.
- Siete archivos vacíos sin extensión apartados con manifest recuperable. Créditos y fotogramas duplicados conservados para mantener procedencia e índices.
- script.js?v=160, animaciones_juego.js?v=112. Guardado local, publicación pendiente.


## 6 nov. — Rediseño de HUD, interfaz y mejoras
- Sistema visual común (azul marino, naranja y dorado) en HUD, subida de nivel, pausa, Sala de entrenamiento, menú principal, barras de menú y pantalla final. Pendiente de la valoración de Josemi.
- Corregido VOLVER/X en los menús que quedaban abiertos. Iconos de objetos erróneos redibujados con `herramientas/generar_iconos_objetos.py`.
- Cuatro comprobaciones (`enemigos`, `formas`, `objetos`, `rotacion`) ya fallaban antes de este trabajo y siguen pendientes.
- script.js?v=167, style.css?v=90, ui_imagenes.js?v=67.


## 6 nov. — Resto de menús
- Josemi aprobó el estilo de la interfaz. Tienda, Ranking, Elige escenario, Cápsulas y Ajustes ya lo siguen. Personajes conserva las ventanas azules por decisión suya.
- script.js?v=170, style.css?v=91.


## 6 nov. — Enemigos que vienen a por ti
- Sprint de llegada y sin paradas; los tiradores ya no huyen. Primer contacto a los 2,7-5,5 s (antes 7,5-11,5 s). Pendiente de que Josemi lo valore jugando. Sustituye la decisión del 2 nov. de tiradores a distancia y avisos que paran.
- script.js?v=172.

## 6 nov. — Auditoría de sprites y primera tanda de ataques

- Auditoría en `AUDITORIA_ANIMACIONES.md` (`python herramientas/auditar_animaciones.py`): 93 carpetas con personajes sin usar, 17 % de imágenes usadas en los packs montados, 173 de 273 formas jugables sin ataques extra.
- Montados 31 ataques en 10 formas (`zz_tanda_ataques_2026_11_06.json`). El combo ya no lo pisa el disparo automático. Exportador a Piskel corregido. Falta el camino de vuelta de Piskel al juego.

## 6 nov. — Tanda 2 de ataques

- 41 animaciones más en Nappa, Ginyu, A16, A17, Turles, Zamasu, Toppo, Moro, Janemba y Frost (`zz_tanda_ataques_2_2026_11_06.json`). Quedan 163 de 273 formas jugables sin ataques extra. Tanda 3 propuesta en la bitácora.

## 6 nov. — Tanda 3 de ataques

- 48 animaciones más en 10 formas (`zz_tanda_ataques_3_2026_11_06.json`). Quedan 153 de 273 formas jugables sin ataques extra. Tanda 4 propuesta en la bitácora.

## 6 nov. — Tanda 4 de ataques

- 46 animaciones más en 10 formas (`zz_tanda_ataques_4_2026_11_06.json`). Quedan 143 de 273 formas jugables sin ataques extra. Corregida la pantalla congelada al transformarse en formas de aura plateada. Tanda 5 propuesta en la bitácora.

## 6 nov. — Tanda 5 de ataques

- 50 animaciones más en 10 formas (`zz_tanda_ataques_5_2026_11_06.json`). Quedan 133 de 273 formas jugables sin ataques extra. Tanda 6 propuesta en la bitácora.
