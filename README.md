# DragonBall Survivor

Juego de supervivencia (estilo PokéSurvivor / Vampire Survivors) con personajes de Dragon Ball en pixel art.
**Para jugar: doble clic en `index.html`.** No hace falta instalar nada.

## Qué hay en la carpeta

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | El juego (ábrelo con doble clic) |
| `script.js` | Todo el código del juego |
| `style.css` | El aspecto de menús y pantallas |
| `animaciones_juego.js` | Las animaciones de los personajes (se genera solo con `herramientas/montar_animaciones.py`) |
| `sprites.js` | Enemigos, escenarios y efectos ya metidos en el juego |
| `ui_imagenes.js` | Tu logo y tus 7 esferas, metidos en el juego |
| `ui/` | Tu logo y tus esferas en PNG (si los cambias, hay que volver a meterlos) |
| `ui/objetos/` | Senzu, cápsulas, radares, originales y procedencia de cada recurso |
| `CREDITOS_RECURSOS.md` | Autores de los recursos incorporados y catálogo de fuentes revisadas |
| `sprites/` | Los packs de sprites originales de donde salen los personajes |
| `herramientas/` | Programas para elegir fotogramas y montar las animaciones (ver `herramientas/GUIA_ANIMACIONES.md`) |
| `BITACORA.md` | Diario: lo que pediste y lo que se hizo en cada sesión |
| `TAREAS_CODEX.md` | Lo que queda por hacer, con instrucciones para la siguiente IA |
| `PIXEL_ART_POR_CODIGO.md` | Lista de lo que está dibujado por código, para que lo sustituyas por tus dibujos |
| `SPRITES_PENDIENTES.md` | Packs que faltan por meter y personajes que no tienen sprites buenos |
| `AGENTS.md`, `CLAUDE.md` | Instrucciones para las IAs que trabajan en el proyecto |

Lo viejo que no usa el juego (copias antiguas, capturas, fondos sueltos, la importación de Gemini/Codex y la
carpeta de referencia de 3,6 GB) está en `Desktop/AnimeSurvivor_archivo/`, por si algún día hace falta.

## Cómo está ahora (31/10/2026)

- **62 personajes jugables**, con sus formas, todos sacados de `sprites/` y revisados a ojo. Nadie encoge al transformarse.
- Nuevos de la sesión 7: Goku película Broly (4 formas), Vegeta Blue manga (2), Vegeta Dios de Broly (1),
  Black Time Breaker (3), Goku Black fanmade (4) y Goku alternativo (Místico, Ikari y Bestia). Las 17 formas tienen guardia, impulso, combo, patada, ki, aura, daño, muerte y retrato.
- **70 tipos de enemigo** con animaciones seleccionadas de sus propios personajes; además, la sombra del jugador.
- **44 tipos retirados temporalmente** por no tener secuencias completas revisadas (lista en `SPRITES_PENDIENTES.md`).
  Los 24 mapas conservan cinco encuentros con jefes. Hay menos variedad de enemigos normales mientras se recuperan sus packs.
- Los enemigos con un único fotograma de vuelo flotan en guardia; durante la carga ya no se dibujan cuerpos por código.
- Logo del menú y esferas del dragón dibujados por ti.
- Senzu y radar con sprites de Legacy of Goku II; cápsulas de vitalidad (+25% vida), cápsulas de ki
  (técnica especial lista) y radar (atrae toda la experiencia), disponibles al romper cajas.
  El radar de Lady-Pixel aparece animado al atraer experiencia o detectar una esfera; créditos con enlaces y sin conexión.
- Gachapón de Shenron, tienda, misiones, ranking, mejoras; todo desbloqueado de momento.
- El menú abre en menos de 1 segundo: los sprites se cargan al empezar la partida.

## Lo que falta (en este orden)

1. Seguir animando los packs pendientes: Goku (59), Vegeta (30) y Goku Black (16); 124 packs en total en la lista B de `SPRITES_PENDIENTES.md` (incluye incompletos).
2. Probar una partida con los personajes nuevos, los enemigos corregidos, Ráfaga de Ki y una transformación. Recuperar los enemigos retirados solo con secuencias buenas.
3. Ataques con efectos reales de los sprites (Kamehameha, bolas de ki, auras) en vez de dibujados por código.
   Fuentes nuevas revisadas en `CREDITOS_RECURSOS.md` (efecto de impulso de LyanCv505, hojas de qsab101).
4. HUD y subida de nivel como las capturas de PokéSurvivor que mandaste.
5. Pulir los escenarios, como señaló el usuario en la sesión 7. Tileset de LorisC93 descargado y acreditado
   en `recursos_pendientes/escenarios/`, pendiente de comprobar estilo y colisiones antes de usarlo.

Comprobación de personajes: `node herramientas/comprobar_personajes.cjs`. Para aplicar las reglas de fotogramas y muerte a las incorporaciones de esta sesión:
`node herramientas/comprobar_personajes.cjs gokubroly vegetamanga vegetabroly blacktime blackfan gokualt`.

Comprobación de enemigos sin navegador: `node herramientas/comprobar_enemigos.cjs`.
Ejecuta las tablas y el director del juego durante 16 minutos simulados en cada mapa, con dibujo y sonido simulados.
No sustituye jugar una partida: el navegador de pruebas no permitió abrir el archivo local en la sesión 6.

Objetos: `node herramientas/comprobar_objetos.cjs`. Para regenerar los recortes, imágenes incrustadas y créditos:
`python herramientas/montar_objetos.py` (Pillow). Las condiciones y fuentes están en `ui/objetos/fuentes.json`;
el GIF de Lady-Pixel se conserva íntegro. Falta revisar estos objetos en una partida real.

## Reglas

- Solo sprites de `sprites/`, nada dibujado por código. Lo que no tenga sprites buenos se quita y se apunta en `SPRITES_PENDIENTES.md`.
- Al moverse, los personajes vuelan o se impulsan (no caminan).
- Todo tiene que funcionar con doble clic en `index.html`.
