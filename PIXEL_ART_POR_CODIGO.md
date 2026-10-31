# Pixel art dibujado por código (para que lo sustituyas por el tuyo)

Todo lo de esta lista lo dibuja la IA con código (círculos, rectángulos, colores sueltos), **no son sprites de verdad**.
Cuando me pases un dibujo, dime a qué número de la lista corresponde y lo meto igual que el logo y las esferas
(van en la carpeta `ui/`). Mejor en **PNG con fondo transparente** (o fondo blanco liso, que lo quito yo).

Ya hechos por ti: ✅ logo del menú · ✅ las 7 esferas del dragón.

## 1. Escenarios (lo que más se ve)

Las tarjetas de «Elige escenario» ya usan portadas reales de `sprites/06_Escenarios` (`portadas_mapas.js`).
✅ Sesión 9: 32 suelos y los árboles/rocas genéricos ya son baldosas reales (Ninja Adventure, CC0). Quedan por código agua, lava, cielo, relieves y edificios propios de cada mapa.
Cada mapa tiene **suelo** (baldosa que se repite) y **decorado** (objetos que bloquean el paso). Todo por código.

| # | Mapa | Qué haría falta |
|---|---|---|
| 1.1 | Kame House | arena, mar, palmeras, la casa |
| 1.2 | Planeta Namek | suelo verde, agua, árboles de Namek, casas namekianas |
| 1.3 | Tierra · Yermo | tierra, rocas, mesetas |
| 1.4 | Juegos de Cell | ring de piedra, suelo alrededor |
| 1.5 | Sala del Tiempo | suelo blanco, columnas |
| 1.6 | Planeta Vegeta | suelo rojizo, rocas, edificios |
| 1.7 | Futuro de Trunks | ciudad en ruinas, escombros |
| 1.8 | Monte Paoz | hierba, árboles, casa de Goku |
| 1.9 | Planeta de Kaio | césped, casa y coche de Kaio, árbol |
| 1.10 | Templo de Kami | baldosas, palmeras, edificio |
| 1.11 | Tenkaichi Budokai | tatami/ring, gradas |
| 1.12 | Base Red Ribbon | suelo metálico, cajas, muros |
| 1.13 | Torre Músculo | nieve, la torre |
| 1.14 | Ciudad del Oeste | calles, edificios, Capsule Corp |
| 1.15 | Planeta Yardrat | suelo, plantas raras |
| 1.16 | Mundo Kaioshin | césped, árboles |
| 1.17 | Infierno | suelo, árboles de agujas, lava |
| 1.18 | Planeta de Bills | césped, árboles, pirámide |
| 1.19 | Torneo del Poder | suelo del ring, pilares |
| 1.20 | Praderas | hierba, flores, árboles |
| 1.21 | Bosque Profundo | hierba oscura, árboles grandes |
| 1.22 | Desierto | arena, cactus, rocas |
| 1.23 | Yermo de Gizard | tierra, rocas, cráteres |
| 1.24 | Tierra Volcánica | roca negra, ríos de lava |
| 1.25 | Agua e islas | agua y orillas (se usan en varios mapas) |

## 2. Ataques

| # | Qué | Notas |
|---|---|---|
| 2.1 | Rayos | ✅ héroes y jefes usan el rayo de los packs (teñido); solo el Makankosappo (espiral) sigue por código |
| 2.2 | Bolas de ki | ✅ las técnicas del jugador usan bolas de los packs; los disparos de los enemigos siguen por código |
| 2.3 | Kienzan (disco) | |
| 2.4 | Genkidama, esferas que giran, cortes de espada | |
| 2.5 | Auras de los personajes (blanca, dorada, roja, azul, verde, morada, naranja, plateada) | |
| 2.6 | Chispas de golpe, humo, polvo al frenar | las explosiones grandes ya son sprites reales |

## 3. Objetos del suelo

| # | Qué |
|---|---|
| 3.1 | Gemas de experiencia (las que sueltan los enemigos) |
| 3.2 | ✅ Semilla senzu: sprite de Legacy of Goku II, extraído por Ragengow (`ui/objetos/`) |
| 3.3 | Monedas de zeni |
| 3.4 | Cajas que se rompen y sueltan premios |

Ya incorporados también: cápsulas de vitalidad y ki y radar (sprites de Legacy of Goku II), e indicador
de radar animado de Lady-Pixel. Créditos y fuentes en `CREDITOS_RECURSOS.md`. El icono Rastreador usa el radar real.

## 4. Interfaz

| # | Qué |
|---|---|
| 4.1 | Iconos de los ataques (las casillas de abajo y las cartas al subir de nivel) |
| 4.2 | Radar del dragón (la flecha que apunta a la esfera) |
| 4.3 | ✅ Shenron: sprite de `sprites/shenron/shenron.jpg` (gachapón y deseo de las 7 esferas) |
| 4.4 | Barras de vida y experiencia, números de daño |

## Enemigos con recorte viejo (esto no hace falta que lo dibujes)

La importación vieja tenía huecos transparentes y tamaños incorrectos. En la sesión 6 se enlazaron 13 tipos más
a sus formas revisadas y se retiraron 44 tipos hasta tener secuencias buenas. El juego ya no usa sus tiras viejas.
La lista exacta y los candidatos para recuperarlos están en `SPRITES_PENDIENTES.md`, apartado A.1:
Jeice, Capitán Ginyu, soldados de Freezer, Esbirro de Babidi, Cell Jr., Meca Freezer, Saiyans renegados, Rey Vegeta,
Vegeta Saiyan, Freezer 2ª forma, Androide 21, Ozaru, Garlic Jr. y sus esbirros, demonios, Shenron oscuro, Whis, Zeno,
Goku Black SSJ, Kale Berserker, Broly (película), Goku falso.
