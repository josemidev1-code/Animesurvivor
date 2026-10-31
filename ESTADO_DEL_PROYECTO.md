# DragonBall Survivor — estado del proyecto

Última actualización: 31/10/2026.

> Si eres una IA: lee primero `AGENTS.md` y apunta todo en `BITACORA.md`.

## La idea

Un juego de supervivencia estilo PokéSurvivor / Vampire Survivors con personajes de Dragon Ball, en **pixel art**,
que funciona abriendo `index.html` con doble clic (sin instalar nada).

- **Solo sprites de verdad**: personajes y enemigos salen de la carpeta `sprites/` (packs de fans), nunca dibujados
  por código. Lo que no tenga sprites bien hechos se quita del juego y se apunta en `SPRITES_PENDIENTES.md`.
- **Animaciones coherentes**: en Dragon Ball no se camina: al moverse el personaje **vuela o se impulsa**. Cada forma
  tiene guardia, impulso, combo de puñetazos, patadas, carga de ki, aura, daño, muerte y cara grande (retrato).
- **Estilo de menú y HUD** como PokéSurvivor (capturas de referencia que mandó el usuario): portada «Pulsa para empezar»,
  menú lateral azul, tarjeta del compañero, evento con cuenta atrás, HUD mínimo, subida de nivel en panel azul con cartas.
- **Adictivo**: gachapón de Shenron con banners, garantías y despertar; misiones, mejoras permanentes, ranking.

## Hecho

| Parte | Qué hay |
|---|---|
| Colisiones | Árboles, rocas, casas… bloquean al jugador y a los enemigos (rodean obstáculos); nada aparece dentro de un objeto. **F2** muestra las colisiones. |
| Gachapón | Banner destacado que rota cada 3 días + permanente, 5★ con probabilidad creciente desde el deseo 50 y seguro en el 70, 4★ cada 10, 50/50 con garantía, repetidos = **despertar** (+8% daño y vida, hasta +5), deseo gratis diario, historial. Tarjetas con fotos de retratos pixel art. |
| Menú | Portada y selector de personajes con foto/retrato nítido ("con la foto, no el cuerpo"), tarjeta del compañero con retrato destacado, menú principal (barra de zeni/tickets, logo, evento destacado, panel Jugar/Personajes/Mejoras/Tienda/Shenron/Misiones/Ranking/Ajustes, estadísticas); pantallas de Personajes, Tienda de Bulma, Ranking y Ajustes. |
| Desbloqueos | Todos los personajes con sprites y todos los escenarios abiertos desde el principio. |
| Animaciones | **44 personajes jugables**, fotogramas elegidos a mano y revisados a ojo, todos a la misma altura (nadie encoge al transformarse): Goku (5 formas), Goku UI, Goku GT (4), Goku Super, Goku Black, Vegeta, Vegeta Ego, Vegeta GT (3), Vegeta Super, Vegetto, Gogeta (3), Gohan, Gohan adulto (base, místico, bestia), Trunks, Trunks armadura (2), Krilin, A16, A17, A18, Broly (4), Gotenks, Caulifla, Kale, Kyabe, Kefla (2), Bardock, Piccolo (2), Raditz (2), Saibaman, Freezer (6), Cooler, Janemba, Cell (4), Majin Buu (5), Turles (2), Bills, Frost (2), Hit, Zamasu (2), Jiren (3), Toppo, Moro, Baby Vegeta, Bra (2). |
| Enemigos | Solo sprites reales. Los enemigos sin sprites propios (Dodoria, Zarbon, Nappa...) están fuera; los mapas usan otros villanos. |
| Carga | Los sprites se decodifican solo al empezar partida (héroe + enemigos del mapa); el menú abre en ~0,6 s. `index.html` pide los scripts con `?v=N` (súbelo al cambiar archivos). |
| Muerte | El personaje cae con su animación (1,8 s) antes de la pantalla final (27 formas con fotogramas de muerte; el resto usa los de daño). |
| Retratos | 100% de cobertura de caras/fotos en todos los héroes y formas. Generación automática desde `montar_animaciones.py` si el pack no incluye retrato grande. Las cartas de selección y el hub muestran las caras nítidas sin dibujar el cuerpo caminando. |

## Cómo funcionan las animaciones (herramientas/)

Lee `herramientas/GUIA_ANIMACIONES.md`: reglas y comandos.

- `herramientas/animaciones.json` y `herramientas/animaciones/*.json`: qué pack y qué fotogramas usa cada forma.
- `ver_pack.py` (ver un pack numerado), `previsualizar.py` (revisar una forma), `revisar_todo.py` (hoja de muchas formas),
  `buscar_extras.py` (propone muerte y retrato), `montar_animaciones.py` (genera `animaciones_juego.js`, que carga el juego).
- `importar_sprites.py` (Codex) generó `personajes/` y `revision.html`; su clasificación automática no sirve para animar,
  pero sí para encontrar packs (`personajes/roster.js`, campo `packDir`). `personajes/` no se sube a git (se regenera).
- Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` con `PYTHONIOENCODING=utf-8`.

## Lo que queda por hacer (en este orden)

0. **Meter los packs que faltan** (lista en `SPRITES_PENDIENTES.md`, apartado B): sobre todo variantes de Goku, Vegeta y Black.
1. **Ataques**: usar efectos reales de los sprites (rayos del Kamehameha, bolas de ki con estela, auras) en vez de los dibujados
   por código; iconos de ataques con sprites para la barra de abajo.
2. **HUD y subida de nivel como las capturas de referencia**: cámara más cerca; arriba a la izquierda nombre, nivel y vida;
   arriba al centro tiempo y una línea de info (mapa, derrotados, monedas); abajo al centro las casillas de ataque;
   panel azul «¡Nivel N! Elige una recompensa · 1 2 3» con cartas (icono, nombre, etiquetas Nuevo·Tipo y Físico/Especial,
   descripción, tecla) y «Cambiar opciones (1) · R»; barras de vida sobre los enemigos y números de daño.
