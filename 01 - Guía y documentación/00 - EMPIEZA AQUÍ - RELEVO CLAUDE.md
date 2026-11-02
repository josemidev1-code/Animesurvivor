# Empieza aquí — Relevo para Claude

Actualizado el 2 de noviembre de 2026 (tarde). Usuario: Josemi. Proyecto: `C:\Users\soyjo\Desktop\ANIMESURVIVOR`.

## Qué quiere Josemi

Lee `Cambios propuestos por Josemi.md` en esta misma carpeta: es el documento completo de sus ideas y requisitos. Quiere un colaborador que aporte ideas concretas, explique sus motivos, respete sus decisiones visuales y trabaje por bloques, sin ejecutar todo de golpe. Habla en español, claro, sin hacerle esperar con preguntas repetidas. **Usa Claude Pro: ahorra contexto** (busca fragmentos, no leas los JS grandes enteros, evita subagentes salvo que los pida).

**Prioridad actual (2 nov.):** resolver primero los puntos de `Cambios propuestos por Josemi.md` y **después** volver a la jugabilidad. La última pregunta que quedó abierta fue por qué bloque empezar: «Selección y estadísticas» (puntos 4 y 5) o «Inventario de sprites» (punto 1).


## Estado (2 nov., noche)

- Selección: personajes de lado (sin retratos), ventanas azules 16 bits, estadísticas con colores. Letra Press Start 2P en todo. **No volver a proponer la recreativa ni el efecto CRT** (Josemi los rechazó).
- Josemi quiere **todos los packs completos como personajes jugables propios**; los incompletos fuera. En marcha: 117 personajes (2 nov., noche; tandas 7-16 de esta sesión); lista, procedimiento y atajo `herramientas/meter.py` en `PERSONAJES_POR_METER.md`. Vegeta terminado (salvo MUI 303, a medias). Siguiente: el resto de versiones de Goku.
- Pendiente de Josemi: permiso para incluir la letra en el proyecto (ahora se carga de Google Fonts y sin internet no se ve).

## Estado de Git

- **`main` tiene todo lo del 2 nov.** (avance directo desde `claude/cuerpo-a-cuerpo`) y está **subido a GitHub** (`josemidev1-code/Animesurvivor`, privado), junto con todas las ramas locales.
- Desde el 2 nov. **`sprites/` también está en el repositorio** (420 MB, lo pidió Josemi). Siguen fuera `herramientas/_revisar/` y las cachés, que se regeneran.
- `claude/quizzical-gates-9cf9c0`: 7 personajes nuevos (Nappa, Ginyu, Jeice, Guldo, Uub, Mr. Satán, Androide 21), separada de `main` antes del HUD nuevo; fusionarla tendrá conflictos. Consultar antes.
- No borres ni fusiones ramas por tu cuenta.

## Lo que se hizo el 2 nov. (rama `claude/cuerpo-a-cuerpo`)

1. **Cuerpo a cuerpo (parte A):** `MELEE_AJ` en `script.js` (de cerca no disparan, el combo protege mientras dura, cada golpe empuja y aturde, el impulso para a 20 px). Por sí sola no mejoró: el 95 % del daño de cerca era por contacto.
2. **Tipos de enemigo (parte B):** `ROL_AJ`, `rolE`/`rolAI` antes de `update`. Pegador (avisa «!» 0,5 s y golpea), embestidor (se carga con línea roja y embiste), tirador (guarda 90-150 px y retrocede), élite («!» roja, 3 golpes, aguanta un golpe). Roce = daño continuo por enemigo pegado. Tope de 6 balas enemigas. Bot: cuerpo a cuerpo 100 → ~151 s, distancia 123 → ~130 s.
3. **Menú:** recuadro de noticias arriba a la izquierda y enlace al rap de Porta (https://www.youtube.com/watch?v=HunKXh1ikes).
4. **Transformaciones con un deseo a Shenron** (menú, permanente): botón `#gForma`, 5 tickets × número de forma, guardado `formas[héroe]`. Se bloquean **todas** las transformaciones (confirmado). En partida, aviso «FORMA BLOQUEADA».
5. Pruebas nuevas: `herramientas/comprobar_combate.cjs`, `comprobar_roles.cjs`, `comprobar_formas.cjs`. Depuración: `window.AS.aj` y `window.AS.rol` permiten cambiar los ajustes en marcha.
6. Diseño y plan en `Planes y diseños/superpowers/` (specs y plans del 2 nov.).

## Valoración de Josemi tras jugar (para el bloque de jugabilidad, después)

- «Lo que mola es que los enemigos te vengan ya de primeras y que no se esperen»: quitar o acortar mucho las esperas (avisos que paran al enemigo, tiradores que guardan distancia).
- «Los ataques cuerpo a cuerpo deben ser útiles, pero solo en algunas situaciones».
- **Kaioken:** que se consiga si duras X tiempo en la partida y aumente todas las estadísticas (fuerza y todo), como en la serie.

## Puntos de «Cambios propuestos» y su estado

| Punto | Estado | Falta de Josemi |
|---|---|---|
| 1. Todos los personajes y formas de `sprites/` | Sin empezar (≈168 packs sin usar; rama de 7) | Cómo tratar packs incompletos (les faltan animaciones: ki, daño, muerte, retrato…) |
| 2. Ataques fieles a la serie | Sin empezar | Confirmar nombres dudosos; no inventar |
| 3. Combate | Primera tanda hecha; seguir tras los demás puntos | Ver valoración arriba |
| 4. HUD, nitidez, efectos | HUD más pequeño y efectos reducidos (1 nov.), sin valorar. Faltan estadísticas con **vida verde, velocidad azul, ataque rojo** | Opinión sobre el HUD |
| 5. Selección: retrato fijo de la cara + personaje como en partida debajo | Sin empezar | ¿El retrato cambia con la transformación? |
| 6. Iconos del menú | Esperando | Los aporta él |
| 7. Noticias y música | Noticias y enlace hechos | Elegir música (no usar el rap como música de fondo sin permiso) |

## Mapa y forma de trabajar

- `index.html`: abrir con doble clic. `02 - Código del juego/script.js` (lógica; está dentro de una función, lo accesible desde fuera es `window.AS`), `style.css`, `utilidades.js`. `sprites.js` y `animaciones_juego.js` son recursos grandes generados.
- `sprites/`: originales. `herramientas/`: montaje y pruebas (`GUIA_ANIMACIONES.md` para animaciones). `INDICE_SPRITES.md` y `PRUEBAS_RAPIDAS.md` en esta carpeta.
- Comprobaciones: `node --check "02 - Código del juego/script.js"` y `node herramientas/comprobar_*.cjs` (formas, roles, combate, enemigos, personajes, objetos); `python -m unittest discover -s herramientas/pruebas -t .`.
- Servidor de pruebas: `.claude/launch.json` («animesurvivor», puerto 8765). El panel del navegador no ejecuta archivos locales (`file://`): **la apertura con doble clic no se ha podido comprobar** desde ahí. Si el panel queda oculto, el juego no se redibuja (usa `AS.tick`).
- Sube `script.js?v=` / `style.css?v=` en `index.html` al cambiarlos (ahora `v=86` y `v=69`).
- Anota cada petición y avance en `BITACORA.md`; actualiza este relevo y `ESTADO_ACTUAL.md` cuando cambie el estado.
