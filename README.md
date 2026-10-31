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
| `sprites/` | Los packs de sprites originales de donde salen los personajes |
| `herramientas/` | Programas para elegir fotogramas y montar las animaciones (ver `herramientas/GUIA_ANIMACIONES.md`) |
| `BITACORA.md` | Diario: lo que pediste y lo que se hizo en cada sesión |
| `SPRITES_PENDIENTES.md` | Packs que faltan por meter y personajes que no tienen sprites buenos |
| `AGENTS.md`, `CLAUDE.md` | Instrucciones para las IAs que trabajan en el proyecto |

Lo viejo que no usa el juego (copias antiguas, capturas, fondos sueltos, la importación de Gemini/Codex y la
carpeta de referencia de 3,6 GB) está en `Desktop/AnimeSurvivor_archivo/`, por si algún día hace falta.

## Cómo está ahora (31/10/2026)

- **55 personajes jugables**, con sus formas, todos sacados de `sprites/` y revisados a ojo. Nadie encoge al transformarse.
- Enemigos y jefes solo con sprites reales (los recoloreados falsos se quitaron).
- Logo del menú y esferas del dragón dibujados por ti.
- Gachapón de Shenron, tienda, misiones, ranking, mejoras; todo desbloqueado de momento.
- El menú abre en menos de 1 segundo: los sprites se cargan al empezar la partida.

## Lo que falta (en este orden)

1. Meter los packs que quedan: variantes de Goku (unos 72 packs), Vegeta (34) y Goku Black fanmade (23).
2. Ataques con efectos reales de los sprites (Kamehameha, bolas de ki, auras) en vez de dibujados por código.
3. HUD y subida de nivel como las capturas de PokéSurvivor que mandaste.

## Reglas

- Solo sprites de `sprites/`, nada dibujado por código. Lo que no tenga sprites buenos se quita y se apunta en `SPRITES_PENDIENTES.md`.
- Al moverse, los personajes vuelan o se impulsan (no caminan).
- Todo tiene que funcionar con doble clic en `index.html`.
