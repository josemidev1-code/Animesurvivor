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
| Gachapón | Banner destacado que rota cada 3 días + permanente, 5★ con probabilidad creciente desde el deseo 50 y seguro en el 70, 4★ cada 10, 50/50 con garantía, repetidos = **despertar** (+8% daño y vida, hasta +5), deseo gratis diario, historial. |
| Menú | Portada con sprites caminando; menú principal (barra de zeni/tickets, logo, evento destacado, compañero animado con su cara, panel Jugar/Personajes/Mejoras/Tienda/Shenron/Misiones/Ranking/Ajustes, estadísticas); pantallas de Personajes (con cara grande del que señalas), Tienda de Bulma, Ranking y Ajustes. |
| Desbloqueos | Todos los personajes con sprites y todos los escenarios abiertos desde el principio. |
| Animaciones | **17 personajes** con fotogramas elegidos a mano y revisados a ojo: Goku, Goku UI, Goku GT, Goku Super, Goku Black, Vegeta, Vegeta Ego, Vegeta GT, Vegeta Super, Vegetto, Gogeta, Gohan, Gohan adulto, Trunks (Cell), Bardock, Piccolo, Kefla. Las formas sin sprites buenos salen de la cadena de transformaciones. |
| Muerte | El personaje cae con su animación (1,8 s) antes de la pantalla final (27 formas con fotogramas de muerte; el resto usa los de daño). |
| Retratos | Cara grande en Personajes y en la tarjeta del compañero (si una forma no tiene, se usa la de otra del mismo personaje). |

## Cómo funcionan las animaciones (herramientas/)

Lee `herramientas/GUIA_ANIMACIONES.md`: reglas y comandos.

- `herramientas/animaciones.json` y `herramientas/animaciones/*.json`: qué pack y qué fotogramas usa cada forma.
- `ver_pack.py` (ver un pack numerado), `previsualizar.py` (revisar una forma), `revisar_todo.py` (hoja de muchas formas),
  `buscar_extras.py` (propone muerte y retrato), `montar_animaciones.py` (genera `animaciones_juego.js`, que carga el juego).
- `importar_sprites.py` (Codex) generó `personajes/` y `revision.html`; su clasificación automática no sirve para animar,
  pero sí para encontrar packs (`personajes/roster.js`, campo `packDir`). `personajes/` no se sube a git (se regenera).
- Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` con `PYTHONIOENCODING=utf-8`.

## Lo que queda por hacer (en este orden)

1. **Ataques**: usar efectos reales de los sprites (rayos del Kamehameha, bolas de ki con estela, auras) en vez de los dibujados
   por código; iconos de ataques con sprites para la barra de abajo.
2. **HUD y subida de nivel como las capturas de referencia**: cámara más cerca; arriba a la izquierda nombre, nivel y vida;
   arriba al centro tiempo y una línea de info (mapa, derrotados, monedas); abajo al centro las casillas de ataque;
   panel azul «¡Nivel N! Elige una recompensa · 1 2 3» con cartas (icono, nombre, etiquetas Nuevo·Tipo y Físico/Especial,
   descripción, tecla) y «Cambiar opciones (1) · R»; barras de vida sobre los enemigos y números de daño.
3. **Recuperar personajes** que tienen sprites pero no pasaron la revisión: Broly, Krilin, Trunks del futuro, A18, Gotenks,
   Caulifla, Kale, Kyabe, Gohan niño, Majin Vegeta, Vegeta saga Buu, Vegetto Blue (ver `SPRITES_PENDIENTES.md`, apartado B).
   Base Bardock: quitar la bola de ki de su postura de guardia.
4. **Enemigos**: quitar los dibujados por código (lista A de `SPRITES_PENDIENTES.md`) y dar a los demás animaciones
   coherentes con las mismas herramientas (muchos enemigos y jefes usan los packs de héroes).
5. **Mapas**: quedarse solo con los mapas buenos; el agua no debe bloquear tanto; Kame House como **arena de jefe**;
   mapas más detallados (mesetas, charcas, hierba alta) y recrear lugares de la serie a partir de las fotos de `ESCENARIOS/`.
6. Más variedad de ataques por personaje y evoluciones; pulir el bucle adictivo (misiones diarias, cofres, logros).

## Notas

- Codex (ChatGPT) llegó a su límite de uso; vuelve a estar disponible a partir de las 5:04. Su cuenta en este equipo es
  `brianjacksoncv8n5bhv@hotmail.com`. Se quitó la línea `model = "gpt-6.1-sol"` de `~/.codex/config.toml` (copia en `config.toml.bak`).
- En git no se suben las bibliotecas grandes (`sprites/`, `ESCENARIOS/`, `animaciones/`, `copias/`, …): ver `.gitignore`.
- Juego de fans sin ánimo de lucro. Dragon Ball pertenece a Bird Studio, Shueisha y Toei Animation; los sprites, a sus autores.
