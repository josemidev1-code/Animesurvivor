# Estado actual — AnimeSurvivor

> **Relevo para la próxima sesión (2 nov. 2026, tarde):** empieza por `00 - EMPIEZA AQUÍ - RELEVO CLAUDE.md` (actualizado) y `Cambios propuestos por Josemi.md`. Todo está en `main` y subido a GitHub con todas las ramas; `sprites/` ya se versiona. Prioridad de Josemi: los puntos de «Cambios propuestos» primero y la jugabilidad después.

Actualizado: 1 de noviembre de 2026. Organización: índice de selecciones (170 entradas, una ruta no localizada al generarlo), pruebas rápidas y extracción inicial de utilidades. Comprueba el estado real de Git y los archivos antes de trabajar; este resumen puede quedar desfasado.

> **Siguiente (Josemi, 2 nov.):** ataques personalizados por personaje, usar sus animaciones propias en partida y cuadrar los ataques con las animaciones.
> **2 nov., noche:** 132 personajes jugables; meter el resto de packs completos siguiendo `PERSONAJES_POR_METER.md`. Selección con personajes de lado y letra Press Start 2P en todo.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic.
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. La petición actual del usuario tiene prioridad sobre planes antiguos.

## Último relevo documentado
- Rama de trabajo: `main` (el bloque 1 y la reorganización se fusionaron y se subieron a GitHub el 1 de noviembre). La rama `claude/quizzical-gates-9cf9c0` con 7 personajes nuevos sigue sin fusionar.
- La bitácora indica que se usa una pose fija para moverse y que se cambió la guardia de Trunks con armadura. Falta que el usuario valore el movimiento jugando y decida qué otras guardias revisar.
- `trunks/2` conserva polvo junto al pie, pendiente de revisión.
- 1 nov.: corregido el error de dibujo del jugador (fotograma inexistente) y suavizados los primeros 3 minutos de partida. Con un jugador automático, la supervivencia media pasa de 1:42 a 2:40 en 20 partidas iguales. Detalle y cifras en la bitácora. Falta que el usuario lo valore jugando.
- 1 nov.: HUD más pequeño y nítido (se dibuja a 1 píxel de imagen por unidad, letra a 8/16 px) y escala de pantalla entera. Casillas de técnicas al doble en pantallas táctiles. Falta la valoración del usuario.
- 1 nov.: al moverse, el jugador va en vuelo bajo (pose de impulso flotando sobre su sombra). Falta la valoración del usuario.
- 1 nov.: efectos de técnicas más pequeños (explosiones a 1,5 veces su radio y como mucho 64 unidades, fogonazo de los rayos al 60 %, números de daño a la mitad, destello de pantalla suave) y balas enemigas por encima de los efectos propios. Daño y alcance iguales. Falta la valoración del usuario.
- 2 nov.: rama `claude/cuerpo-a-cuerpo`: parte A (`MELEE_AJ`) y parte B, tipos de enemigo (`ROL_AJ`: pegador, embestidor, tirador, élite con avisos «!», roce por enemigo, tope de 6 balas). Bot: cuerpo a cuerpo 100 → ~151 s, distancia 123 → ~130 s. Falta que Josemi lo juegue y decidir si se fusiona en `main`. Transformaciones: se despiertan con un deseo a Shenron en el menú (5 tickets × nº de forma, `formas[héroe]`); noticias y enlace al rap en el menú principal. Rap de Porta: https://www.youtube.com/watch?v=HunKXh1ikes
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

- 3 nov.: estadísticas de las tarjetas de selección coloreadas: vida verde, velocidad azul y ataque rojo; sintaxis comprobada, revisión visual y doble clic pendientes. La rama de siete personajes sigue separada.

- 4 nov.: revisadas a ojo las 171 formas. Quitadas muertes que eran rayos/efectos, corregidas SSJ Kaioken (Goku Super), aura de Gohan Místico DBS y daño de Goku Moro UI. Técnicas de villanos sin ataques de otros personajes (Disco Mortal, Puño Invisible, Autodestrucción). `animaciones_juego.js?v=67`, `script.js?v=88`. Pendiente: halo de goku/3 y aura de dlrx/0. Detalle en la bitácora.
- 4 nov. (tarde): 31 muertes nuevas, SSJ3 con halo, DLRX con su aura, fuera Goku Moro MUI (incompleto). 22 formas sin muerte (su pack no la tiene) se quedan: lo decidió Josemi. `animaciones_juego.js?v=68`, `script.js?v=90`.

- 4 nov. (noche): mezclado `main` local con GitHub (40 commits de otra sesión: 140 personajes jugables, selección 16 bits). Arreglos de modelos de hoy conservados. Versiones: `style.css?v=76`, `animaciones_juego.js?v=109`, `script.js?v=135`. Todo subido.
- 4 nov. (noche): el personaje se inclina hacia donde dispara (hasta 50°) y hacia donde vuela (hasta 36°), con giro RotSprite y rayos desde la mano girada. `script.js?v=137`. Falta que Josemi lo juegue.
- 4 nov. (noche): ataques extra por forma (`animaciones/ataques.json`: más combos, pose de rayo, brazos arriba, embestida). Hecho y revisado en Goku base; faltan las demás formas por tandas. `animaciones_juego.js?v=110`, `script.js?v=138`.
- 4 nov. (noche): todos andan con un ciclo de 8 pasos generado desde su guardia, sin inclinarse ni volar al moverse (`script.js?v=141`). Se mantiene la inclinación al disparar. Falta que Josemi lo juegue.
- 4 nov. (noche): al disparar arriba/abajo solo gira el tronco (hasta 40°); el paso tiene rodilla, balanceo, polvo y sombra (`script.js?v=142`).
- 4 nov. (noche): andar revisado personaje a personaje con `andar.js` + `herramientas/andar_revision.js`; disparan andando. Tanda 1 (línea de Goku, 14 formas) hecha; siguiente: línea de Vegeta.
- 4 nov. (noche): sin giro al disparar. Preparado Sprite Fusion: imágenes en `Recursos pendientes/sprite_fusion/entrada/`, importador `herramientas/importar_sprite_fusion.py` → `andar_frames.js`. Esperando los primeros ciclos de Josemi.

## 4 nov. — Codex: combate y legados
- Técnicas con recargas independientes, rotación automática y teclas de prioridad. Tres técnicas iniciales. Listas específicas conectadas para personajes que todavía usaban genéricas.
- Movimiento del pack o ciclo importado; sin separación artificial de tronco/piernas en partida.
- Cinco arenas emblemáticas, legados de jefe, combo ki/patada, suministros y vegetación animada. script.js?v=147.
- Siete comprobaciones y pruebas Chrome HTTP correctas; detalle en CAMBIOS_COMBATE_2026-11-04.md. No balance completo ni revisión visual de todas las formas. No créditos de Sprite Fusion gastados.
- Siguiente: selección visual de ataques extra por packs y valoración jugando. Los consejos antiguos de vuelo obligatorio se matizan por la elección actual: caminar cuando exista buen ciclo y vuelo en su ausencia.

## 5 nov. — Antigravity: biblioteca masiva de sprites LSW de DeviantArt y pipeline de animación Piskel
- Completada la descarga masiva exhaustiva en `antigravity sprites/`: **770 hojas de sprites completas** (~318 MB) en máxima resolución original de Dragon Ball (estilo LSW/ULSW/SWL).
- Estructurado en 10 categorías cubriendo todas las sagas: Goku (84), Vegeta (31), Gohan (16), Trunks (9), Guerreros Z y Aliados (13), Fusiones (40), Villanos DBZ (94), DBS (194), GT y Daima (60), Colecciones y FX de Ataques (229).
- Creada suite de herramientas de animación Piskel: `herramientas/preparar_piskel.py`, `herramientas/configurar_ataques_automatico.py` y `herramientas/exportar_piskel_lote.py`.
- **59 formularios de personajes** completamente configurados con secuencias de ataque (Attack2, Attack3, Kick2, Beam propio, pose Up de carga y Dash de vuelo frontal).
- Generados **59 paquetes listos para Piskel** en `piskel_animaciones/` conteniendo archivo nativo `.piskel` editable directamente en piskelapp.com, `.gif` sincronizado, tira spritesheet `.png`, fotogramas individuales y guía de uso `LEEME_PISKEL.md`.
- Compilado `02 - Código del juego/animaciones_juego.js` (10,3 MB) garantizando funcionamiento abriendo `index.html` con doble clic (sin `fetch`). Sintaxis verificada con `node --check`.

- Índice maestro navegable y verificado con autorías y enlaces en `antigravity sprites/INDICE_SPRITES.md`.
- Siguiente paso acordado con Josemi: animación sistemática en Piskel de cada personaje y sus técnicas especiales.
## 5 nov. — Antigravity: Ataques únicos de enemigos, vegetación viva, 7 jefes por mapa y nuevas reliquias
- **Ataques propios por enemigo (`enemyPerformAttack` en `script.js?v=149`):**
  - Fin de proyectiles genéricos: ácido con charcos corrosivos en el suelo para Saibamen, Double Sunday gemelo para Raditz, Bomber DX colosal para Nappa, Crusher Ball teledirigida para Jeice, agujas paralizantes para Guldo (-35% vel), Cañón bucal para Recoome y Dodoria, Huracán Azul para Burter, Mini-Kamehameha para Cell Jr., discos destructores y saetas para Androides 17/18, Death Beams y Death Saucers para Freezer/Cooler/Frost, rayos de caramelo zigzagueantes para Buu, cuchillas God Slicer para Black/Zamasu, y Omega Blaster expansivo para Broly/Kale.
  - Proyectiles con renderizado pixel art temático (`laser`, `disc`, `acid`, `missile`, `slicer`, `candy`, `omega`, `bomber`, `needle`) con físicas y partículas propias.
- **Entorno vivo y árboles que se mecen con el viento:**
  - `drawLivingDecor` mejorado: balanceo continuo en capas finas de 2 píxeles con amplitud de hasta 3,2 px en la copa y detección de toda la vegetación (`tree`, `palm`, `pine`, `fern`, `reed`, `cactus`, `bush`).
  - Partículas de viento ambientales (`drawEnvWind`): hojas verdes y pétalos de cerezo en bosques/praderas, esporas luminiscentes en Namek, ascuas en Volcán/Infierno, polvo en desiertos y destellos de ki divino en Sala del Tiempo/Bills.
- **7 Jefes de fase por escenario (`BOSS_T`, `BOSS_SLOT` y `BBEAM`):**
  - Jefes a los minutos 2, 4, 6, 8, 10, 12:30 y 15 con escala progresiva de vida y recompensas.
  - Mapeo de jefes completo para todos los mapas (King Cold, Metal Cooler, Bojack, Lord Slug, Garlic Jr., Janemba, Omega Shenron, Moro, etc.).
  - `BBEAM` configurado para todos los jefes con aviso visual, nombres canónicos y rayos colosales de daño masivo.
- **Nuevas cartas pasivas y reliquias icónicas:**
  - Cartas: *Espíritu Saiyan* (críticos x2.2), *Kiai de Choque* (+30% empuje), *Poder Zenkai* (+15% stats con poca vida), *Aura Destructora* (daño pasivo por contacto de aura).
  - Reliquias: *Radar de Bulma* (+70% alcance de recogida), *Nube Kinton* (+20% vel y estela de nubes ralentizante), *Scouter Saiyan* (+20% crítico), *Pesas de Entrenamiento Kaio* (+25% xp y +5% daño/nivel), *Bastón Mágico Nyoibo* (barrido circular cada 3,5 s), *Cápsula Hoi-Poi* (suministros frecuentes) y *Vasija del Mafuba* (vórtice que atrapa y daña jefes y élites).
  - Iconos pixel art dedicados en `icon(id)`.
  - Versión actualizada en `index.html` a `script.js?v=149`.
## 5 nov. — Antigravity: Mejoras de Accesibilidad y Estética Dragon Ball Carddass
- **Panel de Accesibilidad y Comodidad en Ajustes (`#settings`):**
  - Control de temblor de pantalla (100%, 50%, 0%), fotosensibilidad sin destellos intensos, modo alto contraste, números de daño configurables (normal/grandes/desactivados), auto-apuntado asistido y control escalonado de volumen (100%, 70%, 40%, mudo). Persistencia en `localStorage`.
- **Estética de subida de nivel (Dragon Ball Carddass / PokéSurvivor):**
  - Tarjetas de mejora `.up` rediseñadas como cartas coleccionables doradas con marcos pulidos, estrellas evolutivas, medallas de nivel y resplandor.
  - Sombras tridimensionales neutrales en el suelo para personajes y objetos flotantes.
  - HUD con avisos luminosos de recarga completa y atajos numéricos claros.
  - Versiones: `style.css?v=78`, `script.js?v=150`.
