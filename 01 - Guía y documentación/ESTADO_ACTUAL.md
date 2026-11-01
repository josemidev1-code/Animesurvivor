# Estado actual — AnimeSurvivor

Actualizado: 1 de noviembre de 2026. Organización: índice de selecciones (170 entradas, una ruta no localizada al generarlo), pruebas rápidas y extracción inicial de utilidades. Comprueba el estado real de Git y los archivos antes de trabajar; este resumen puede quedar desfasado.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic.
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. La petición actual del usuario tiene prioridad sobre planes antiguos.

## Último relevo documentado
- Rama de trabajo: `main` (el bloque 1 y la reorganización se fusionaron y se subieron a GitHub el 1 de noviembre). La rama `claude/quizzical-gates-9cf9c0` con 7 personajes nuevos sigue sin fusionar.
- La bitácora indica que se usa una pose fija para moverse y que se cambió la guardia de Trunks con armadura. Falta que el usuario valore el movimiento jugando y decida qué otras guardias revisar.
- `trunks/2` conserva polvo junto al pie, pendiente de revisión. La rama del bloque 1 estaba pendiente de decisión de fusión; no la fusiones sin verificar el estado y la decisión del usuario.
- Existe una rama separada con siete personajes nuevos; no des por fusionados esos cambios. `README.md` y `01 - Guía y documentación/TAREAS_CODEX.md` incluyen contexto histórico que puede estar desfasado.

## Mapa rápido
- `index.html`: interfaz y carga; `02 - Código del juego/style.css`: estilos; `02 - Código del juego/script.js`: lógica del juego; `02 - Código del juego/utilidades.js`: utilidades generales (se carga antes de script.js).
- `sprites/`: biblioteca original; `herramientas/`: selección, montaje y comprobaciones; `herramientas/GUIA_ANIMACIONES.md`: guía para animaciones.
- `02 - Código del juego/animaciones_juego.js` y `02 - Código del juego/sprites.js`: archivos grandes de recursos. No los leas ni imprimas completos salvo necesidad; busca fragmentos concretos y modifica el origen cuando corresponda.
- `01 - Guía y documentación/BITACORA.md`: historial y relevo; consulta las últimas entradas o busca un tema concreto. `README.md` y `01 - Guía y documentación/TAREAS_CODEX.md`: documentación y tareas con información histórica.
- `01 - Guía y documentación/INDICE_SPRITES.md`: índice regenerable de selecciones; `01 - Guía y documentación/PRUEBAS_RAPIDAS.md`: pruebas por tarea. `01 - Guía y documentación/SPRITES_PENDIENTES.md`, `01 - Guía y documentación/PIXEL_ART_POR_CODIGO.md` y `01 - Guía y documentación/CREDITOS_RECURSOS.md`: consulta según la tarea. `01 - Guía y documentación/TAREAS_CODEX_HISTORICO.md` conserva el historial anterior.

## Comprobación
- Sintaxis: `node --check "02 - Código del juego/script.js"`. Para animaciones o personajes: consulta la guía y usa las comprobaciones específicas de `herramientas/`.
- La sintaxis no sustituye una prueba de partida ni la revisión visual de sprites.
- Si cambian recursos cargados por `index.html`, revisa el parámetro de versión. Deja al terminar un relevo breve con hechos, pruebas y pendientes; actualiza este resumen si cambia el estado.
