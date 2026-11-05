# Estado actual — AnimeSurvivor

Actualizado: 5 de noviembre de 2026.

## Últimas novedades implementadas (Sesión 15 - Antigravity)
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
