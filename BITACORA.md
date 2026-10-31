# Bitácora del proyecto

Registro de cada sesión de trabajo (de cualquier IA). Lee primero `AGENTS.md`. Las entradas nuevas van al final.

## 2026-10-30/31 — Claude (sesión 1, con ayuda de Codex)

### Lo que pidió el usuario
- Trabajar con Codex para seguir el juego: buen gachapón, mejor diseño, añadir todos los personajes de `sprites/`,
  más enemigos, ataques personalizados y variaciones, más escenarios, colisiones en los objetos del mapa, que sea adictivo.
- Poder ver lo que hace Codex (en vivo y con imágenes).
- Que Claude también trabaje en el juego, no solo coordine.
- Usar la cara grande de los packs al elegir personaje.
- Quitar todos los diseños hechos por la IA: solo pixel art de los sprites. Rehacer el menú como PokéSurvivor
  (mandó capturas). Que se llame DragonBall Survivor.
- Escenarios: recrear lugares de la serie en 2D a partir de las fotos de la carpeta. Menú con todas las secciones.
- Mejorar jugabilidad y mapas; quedarse solo con los mapas buenos; Kame House como pelea de jefe; el agua bloquea demasiado.
- MUY IMPORTANTE: arreglar las animaciones de todos los personajes (andar, atacar…) para que sean coherentes;
  enemigos igual. Mencionó Piskel y sprite-ai.art para animar.
- Aprobó el estilo «volar/impulsarse en vez de andar» y aplicarlo a todos.
- Desbloquear todos los personajes y escenarios. Delegar en Codex enseñándole a animar bien.
- Lo que no tenga sprites bien hechos, quitarlo y apuntarlo para conseguirlo en el futuro.
- Mejorar los ataques y sus imágenes (efectos e iconos).
- Mandó capturas de cómo quiere el HUD y la pantalla de subir de nivel (PokéSurvivor).
- Animaciones de muerte y retratos de selección para todos.
- Al acercarse el límite: guardarlo todo, subirlo a GitHub y dejar un archivo con lo hecho, la idea y lo que queda.
- Que cada IA documente lo que hace y lo que pide el usuario para poder seguir con otra IA (este sistema).

### Lo que hice
- Git en la carpeta (bibliotecas grandes fuera, ver `.gitignore`). El usuario lo unió a `josemidev1-code/Animesurvivor`.
- Codex: arreglada su config (quitado el modelo `gpt-6.1-sol`, copia en `~/.codex/config.toml.bak`).
- Colisiones sólidas para jugador y enemigos (Codex) + optimización (Claude). Commit 8cde818.
- Gachapón nuevo: banners, garantías, 50/50, despertar, deseo diario, historial. Commit d26889b.
- Menú nuevo estilo PokéSurvivor: portada, menú lateral, compañero, evento, Personajes, Tienda, Ranking, Ajustes. Commit 0b53d7c.
- Auditoría de animaciones: las antiguas andaban con 1 fotograma y las de `animaciones/` estaban generadas de una sola foto.
- Herramientas de animación (`herramientas/`): importador (Codex), `montar_animaciones.py`, `ver_pack.py`,
  `previsualizar.py`, `revisar_todo.py`, `buscar_extras.py` y la guía `GUIA_ANIMACIONES.md`.
- 17 personajes con animaciones elegidas a mano (Codex en 3 grupos + revisión y correcciones de Claude). Commit f2bb937.
- Todo desbloqueado; fuera del juego lo que no tiene sprites buenos (`SPRITES_PENDIENTES.md`).
- Animación de muerte y retratos (panel de Personajes y tarjeta del compañero). Commit 5522e48.
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
