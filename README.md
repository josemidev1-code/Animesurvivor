# DragonBall Survivor

Juego de supervivencia (estilo PokéSurvivor / Vampire Survivors) con personajes de Dragon Ball en pixel art.
**Para jugar: doble clic en `index.html`** o en la web: https://josemidev1-code.github.io/Animesurvivor/ (GitHub Pages, se actualiza al subir a `main`).

## Qué hay en la carpeta

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | El juego (ábrelo con doble clic) |
| `02 - Código del juego/script.js` | Lógica principal del juego |
| `02 - Código del juego/utilidades.js` | Utilidades generales compartidas; se carga antes de `02 - Código del juego/script.js` |
| `02 - Código del juego/style.css` | El aspecto de menús y pantallas |
| `02 - Código del juego/animaciones_juego.js` | Las animaciones de los personajes (se genera solo con `herramientas/montar_animaciones.py`) |
| `02 - Código del juego/sprites.js` | Enemigos, escenarios y efectos ya metidos en el juego |
| `02 - Código del juego/ui_imagenes.js` | Tu logo y tus 7 esferas, metidos en el juego |
| `02 - Código del juego/portadas_mapas.js`, `02 - Código del juego/shenron_imagen.js` | Portadas de los mapas y Shenron del gachapón (se generan con `herramientas/montar_portadas.py` y `montar_shenron.py`) |
| `ui/` | Tu logo y tus esferas en PNG (si los cambias, hay que volver a meterlos) |
| `ui/objetos/` | Senzu, cápsulas, radares, originales y procedencia de cada recurso |
| `01 - Guía y documentación/CREDITOS_RECURSOS.md` | Autores de los recursos incorporados y catálogo de fuentes revisadas |
| `sprites/` | Los packs de sprites originales de donde salen los personajes |
| `antigravity sprites/` | Biblioteca de 770 hojas completas de sprites 2D estilo LSW/ULSW descargadas desde DeviantArt con su índice |
| `herramientas/` | Programas para elegir fotogramas y montar las animaciones (ver `herramientas/GUIA_ANIMACIONES.md`) |
| `01 - Guía y documentación/BITACORA.md` | Diario: lo que pediste y lo que se hizo en cada sesión |
| `01 - Guía y documentación/TAREAS_CODEX.md` | Prioridades actuales para la siguiente IA |
| `01 - Guía y documentación/TAREAS_CODEX_HISTORICO.md` | Relevos y procedimientos anteriores |
| `01 - Guía y documentación/ESTADO_ACTUAL.md` | Resumen breve y mapa del proyecto |
| `01 - Guía y documentación/INDICE_SPRITES.md` | Índice regenerable de selecciones de packs de animación |
| `01 - Guía y documentación/PRUEBAS_RAPIDAS.md` | Pruebas recomendadas según el cambio |
| `01 - Guía y documentación/PIXEL_ART_POR_CODIGO.md` | Lista de lo que está dibujado por código, para que lo sustituyas por tus dibujos |
| `01 - Guía y documentación/SPRITES_PENDIENTES.md` | Packs que faltan por meter y personajes que no tienen sprites buenos |
| `AGENTS.md`, `CLAUDE.md` | Instrucciones para las IAs que trabajan en el proyecto |

Lo viejo que no usa el juego (copias antiguas, capturas, fondos sueltos, la importación de Gemini/Codex y la
carpeta de referencia de 3,6 GB) está en `Desktop/AnimeSurvivor_archivo/`, por si algún día hace falta.

## Cómo está ahora (05/11/2026)

- Biblioteca `antigravity sprites/`: 770 hojas de sprites completas en tamaño original de Dragon Ball en estilo LSW (Legendary Super Warriors / ULSW) descargadas desde DeviantArt, estructuradas en 10 categorías y con índice detallado de créditos y fuentes en `antigravity sprites/INDICE_SPRITES.md`.
- Actualización Codex: técnicas automáticas con recargas individuales, arenas emblemáticas, legados de jefe, combo ki/patada, más cofres y vegetación animada. Detalle, pruebas y límites en `01 - Guía y documentación/CAMBIOS_COMBATE_2026-11-04.md`.
- Pendiente principal: revisar y seleccionar los ataques extra de cada pack; todavía no se ha hecho para todo el catálogo.

- **Ataques seleccionables y activos**: El jugador comienza cada partida con 2 ataques base. Los ataques son seleccionables (teclas 1, 2... o toque en el HUD) con prioridad absoluta al ataque elegido para decidir qué técnica ejecutar.
- **Fusión de técnicas al derrotar jefes**: Al vencer al jefe de mapa y abrir su cofre, se activa la opción estelar de fusionar dos ataques del jugador en una técnica legendaria superior con efectos expansivos y multiplicadores de daño.
- **Panel de subida de nivel cuadrado**: Interfaz de recompensas y nivel rediseñada en formato estrictamente cuadrado (aspect-ratio 1:1) con estética Dragon Ball, sin expandirse horizontalmente hacia los lados.
- **Plantel unificado ('vienen de una')**: Eliminadas las tarjetas redundantes sueltas (Goku GT, Goku UI, Goku Super, Vegeta Ego, Vegeta GT, etc.). Cada héroe aparece una sola vez con todas sus formas integradas y elegibles directamente (Goku con 10 transformaciones, Vegeta con 9, Gohan con 5, Trunks con 4).
- **Selección de personajes y transformaciones**: Foto de perfil fija en la cuadrícula del plantel y animación en movimiento dinámico al seleccionarlo. Se puede elegir cualquier transformación disponible para empezar a jugar directamente en esa forma con sus estadísticas y auras activas.
- **62 personajes jugables**, con sus formas, todos sacados de `sprites/` y revisados a ojo. Nadie encoge al transformarse.
- Nuevos de la sesión 7: Goku película Broly (4 formas), Vegeta Blue manga (2), Vegeta Dios de Broly (1),
  Black Time Breaker (3), Goku Black fanmade (4) y Goku alternativo (Místico, Ikari y Bestia). Las 17 formas tienen guardia, impulso, combo, patada, ki, aura, daño, muerte y retrato.
- Sesión 9: 31 técnicas nuevas (cada personaje tiene su lista propia), 12 eventos en partida, HUD y subida de nivel como
  PokéSurvivor, rayos y bolas de ki sacados de los packs, portadas de los mapas, y suelos, árboles y rocas reales
  (pack Ninja Adventure, CC0, generados con `herramientas/montar_escenarios.py` en `02 - Código del juego/escenarios_tiles.js`).
- 7 jugables más (Nappa, Ginyu, Jeice, Guldo, Uub, Mr. Satán, Androide 21) esperan en la rama
  `claude/quizzical-gates-9cf9c0`, sin fusionar todavía.
- **82 tipos de enemigo** con animaciones seleccionadas de sus propios personajes; además, la sombra del jugador.
- **35 tipos retirados temporalmente** por no tener secuencias completas revisadas (lista en `01 - Guía y documentación/SPRITES_PENDIENTES.md`).
  Los 24 mapas conservan cinco encuentros con jefes. Hay menos variedad de enemigos normales mientras se recuperan sus packs.
- Los enemigos con un único fotograma de vuelo flotan en guardia; durante la carga ya no se dibujan cuerpos por código.
- Logo del menú y esferas del dragón dibujados por ti.
- Senzu y radar con sprites de Legacy of Goku II; cápsulas de vitalidad (+25% vida), cápsulas de ki
  (técnica especial lista) y radar (atrae toda la experiencia), disponibles al romper cajas.
  El radar de Lady-Pixel aparece animado al atraer experiencia o detectar una esfera; créditos con enlaces y sin conexión.
- Ataques propios de la serie para cada villano (Death Ball, Esfera de Destrucción, Salto Temporal…), eventos aleatorios en partida (Reto de Kaio, meteoritos, Furia Saiyan…) y ficha animada de cada personaje.
- Jefes con daño corregido, vida sobre la cabeza de cada enemigo, bolas teledirigidas y panel de nivel azul (sesión 9).
- Gachapón de Shenron (con su sprite real), tienda, misiones, ranking, mejoras; todo desbloqueado de momento.
- El menú abre en menos de 1 segundo: los sprites se cargan al empezar la partida.
- Sesión 10, bloque 1: al moverse, ningún personaje lleva ya polvo ni chispas pegadas (21 formas arregladas al montar).
  Herramienta que propone los fotogramas de cada pack y localiza sus efectos (rayos, bolas, auras); como sus reglas
  solo aciertan un 25-35 %, la IA revisa todas las propuestas y el usuario solo lo que quede dudoso
  (ver «Proponer fotogramas» en `herramientas/GUIA_ANIMACIONES.md`). Pruebas: `python -m unittest discover -s herramientas/pruebas -t .`

- **2 nov. (ya en `main` y en GitHub):** tipos de enemigo (pegador, embestidor, tirador, élite) con
  avisos «!», roce por enemigo y tope de 6 balas; ajustes del cuerpo a cuerpo; noticias y enlace al rap de Porta en el
  menú; las transformaciones se despiertan con un deseo a Shenron (5 tickets × nº de forma). Detalle en
  `01 - Guía y documentación/00 - EMPIEZA AQUÍ - RELEVO CLAUDE.md`.

## Lo que falta (en este orden)

**Pendiente pedido por Josemi (2 nov., 20:33):**
1. **Ataques personalizados para cada personaje**: hoy los nuevos usan las técnicas comunes de su familia (`FAMILIAS` en `herramientas/meter.py`); cada uno debe tener las suyas.
2. **Usar en partida las animaciones propias de cada personaje** (los ataques y efectos de su pack), no solo las poses comunes.
3. **Cuadrar los ataques estéticamente con las animaciones**: que el golpe, el ki y la técnica coincidan con el fotograma que se ve.


> **Prioridad actual (2 nov.):** los puntos de `01 - Guía y documentación/Cambios propuestos por Josemi.md` primero
> (selección con retrato fijo, estadísticas con colores, inventario de sprites, ataques fieles…) y después la
> jugabilidad (enemigos que vengan de primeras sin esperar, cuerpo a cuerpo útil solo en algunas situaciones, Kaioken
> que se consigue aguantando y sube todas las estadísticas). La lista de bloques de abajo es la anterior.


Plan acordado con el usuario en la sesión 10 (bloque 1 hecho; diseño en `Planes y diseños/superpowers/specs/`):

1. **Bloque 2 · Técnicas de la serie** con el efecto dibujado en su propio pack (150 de 162 packs traen rayos, bolas
   o auras sin usar; ninguno genérico).
2. **Bloque 3 · Más personajes jugables** con los 168 packs de `sprites/` que no se usan (incluye decidir la rama
   `claude/quizzical-gates-9cf9c0` con 7 personajes nuevos).
3. **Bloque 4 · Enemigos**: recuperar los 35 retirados (Burter, Recoome…) con ataques propios.
4. **Bloque 5 · Experiencia y HUD** nuevos (al usuario el HUD actual le parece horroroso).
5. **Bloque 6 · Mecánicas nuevas.**

Entre bloque y bloque, jugar una partida para comprobar que sigue siendo divertido. Sigue pendiente sustituir lo
dibujado por código (`01 - Guía y documentación/PIXEL_ART_POR_CODIGO.md`).

Comprobación de personajes: `node herramientas/comprobar_personajes.cjs`. Para aplicar las reglas de fotogramas y muerte a las incorporaciones de esta sesión:
`node herramientas/comprobar_personajes.cjs gokubroly vegetamanga vegetabroly blacktime blackfan gokualt`.

Comprobación de enemigos sin navegador: `node herramientas/comprobar_enemigos.cjs`.
Ejecuta las tablas y el director del juego durante 16 minutos simulados en cada mapa, con dibujo y sonido simulados.
No sustituye jugar una partida: el navegador de pruebas no permitió abrir el archivo local en la sesión 6.

Objetos: `node herramientas/comprobar_objetos.cjs`. Para regenerar los recortes, imágenes incrustadas y créditos:
`python herramientas/montar_objetos.py` (Pillow). Las condiciones y fuentes están en `ui/objetos/fuentes.json`;
el GIF de Lady-Pixel se conserva íntegro. Falta revisar estos objetos en una partida real.

## Reglas

- Solo sprites de `sprites/`, nada dibujado por código. Lo que no tenga sprites buenos se quita y se apunta en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Al moverse, los personajes vuelan o se impulsan (no caminan).
- Todo tiene que funcionar con doble clic en `index.html`.

> 3 nov.: las estadísticas de selección usan verde para vida, azul para velocidad y rojo para ataque. Pendiente revisión visual; siguen pendientes el retrato y el personaje completo en selección.
