# Análisis de PokéSurvivor para Dragon Ball Survivor

4 nov. 2026. Pedido por Josemi: «analiza a fondo todo el juego, las mecánicas de los personajes y todo, porque quiero hacer lo mismo en Dragon Ball Survivor».

**Cómo se ha hecho:** 9 partidas como invitado con navegador automático (compañero Scorbunny), lectura de los menús (mejoras, ficha, pausa, cartas) y de sus páginas públicas (guía, movimientos, objetos, legendarios, tipos, logros, novedades).
**Lo que no:** su código publicado está ofuscado a propósito y su repositorio ya no es público, así que no se ha mirado ni se copia nada de código. Se copian **ideas y mecánicas** y las programamos nosotros a la manera de Dragon Ball. Ellos usan licencia no comercial: nuestro juego tampoco debe venderse.
**Límite:** el bot moría en 1-1,5 min (se mueve a ciegas), así que jefes, grietas y Sentencia de Arceus se conocen por sus textos, no jugados.

## 1. Cómo se juega una partida (lo que se ve jugando)

- Mapa infinito con árboles, hierba alta y agua; cámara cenital. HUD mínimo: nombre, nivel y vida arriba a la izquierda; reloj, zona, derrotados y monedas arriba en el centro; ataques abajo en el centro.
- **Solo dispara el ataque ACTIVO.** Llevas hasta 4 ataques pero solo hace daño el elegido (teclas 1-4, Q/E o tocar su icono). Los demás valen 0 de daño hasta que cambias a ellos: la clave es cambiar según la situación. Hay ataques que **no hacen daño** y acumulan una estadística mientras están activos (Danza Espada = ataque, Agilidad = velocidad, Fortaleza = defensa, Maquinación = ataque especial): se activa uno un rato y se vuelve al de daño.
- **Empieza duro:** pocos enemigos pero fuertes y muchos disparan. En 40-90 s caes si no esquivas. Subir de nivel es lento (nivel 5 en 1:24).
- **Cartas al subir de nivel:** 3 cartas (teclas 1-3) y botón «Cambiar opciones (1) · R» (1 cambio gratis por partida). Las cartas salen apagadas un instante para no elegir sin querer. Tipos de carta:
  - **Nuevo ataque** (con tipo y físico/especial) — los de «tu lado bueno» salen el doble.
  - **Subir ataque** Nv.1>2… hasta 5: +1 proyectil, +40-50 % daño…
  - **Mejora** (pasiva con tope de veces): Potencia +10 % daño, Reflejos −8 % recarga, Carrera +7 % velocidad, Coraza +6 % reducción de daño, Vigor +20 vida, Síntesis +0,9 vida/s, Imán +30 % recogida, Aprendizaje +12 % experiencia.
  - **Curación puntual:** Baya Zidra (cura el 45 %).
  - **Evolución (carta dorada):** ataque al nivel 5 + su mejora pareja (p. ej. Ascuas + Potencia → Llamarada: ×1,8 daño, +2 proyectiles, +2 perforación).
- **Pausa = resumen:** daño total y por segundo de cada ataque, todas tus estadísticas (vida, ataque, at. esp., defensa, def. esp., velocidad, crítico, reducción, recarga, regeneración), objeto, cartas y esferas.
- **Fin de partida:** tiempo, nivel, derrotados, jefes, monedas ganadas desglosadas (por tiempo, derrotados, recogidas), ataques usados y su daño.

## 2. Personajes (cada Pokémon)

- Ficha con **Vida, Ataque (×), At. Esp. (×), Defensa, Def. Esp., Velocidad** y la frase «Pega mejor con ataques físicos/especiales».
- **Ataques físicos y especiales:** los físicos pegan con Ataque y los frena la Defensa; los especiales con At. Esp. y Def. Esp.
- **Naturaleza** (±10 % a dos estadísticas) y **habilidad** con efecto real (Mar Llamas: +35 % daño de fuego con menos de 1/3 de vida). **Monotipo:** +20 % a sus ataques de su tipo.
- Empieza con un ataque propio (Scorbunny: Ascuas). Las MT de la tienda enseñan ataques de otros tipos para siempre (solo los que podría aprender).
- **Mejoras permanentes POR PERSONAJE** (solo cuentan jugando con él): Vitalidad +8 vida, Fuerza +4 % daño, Zancada +3 % velocidad, Reflejos −3 % recarga, Coraza +2 % defensa, Síntesis +0,2 vida/s, Imán +12 %, Sabiduría +5 % exp., Fortuna +8 % monedas, Golpe Crítico +3 % (×1,5), Cambio de cartas +1, Veto (bloquea un ataque en las cartas), Repertorio (empiezas con 2 ataques), Movimiento inicial / Segundo movimiento inicial (eliges con cuál empiezas), Atajos (qué ataque va en cada tecla).

## 3. Ataques: 103, organizados por «forma de atacar»

Cada ataque tiene tipo, físico/especial, una **clase** y una evolución:

| Clase | Qué hace | Equivalente Dragon Ball |
|---|---|---|
| Proyectil | bola al más cercano | Ráfaga de Ki, Kiai |
| Ráfaga | proyectiles en todas direcciones | Explosión de ki, Ráfaga Infinita |
| Abanico | chorro corto en cono | Renzoku Energy Dan |
| Rayo / carga | se carga y atraviesa todo | Kamehameha, Galick Gun, Makankosappo |
| Cuerpo a cuerpo | arco de golpe delante | puñetazos, Dragon Fist |
| Embestida | cruzas hacia el enemigo golpeando el camino | Embestida, Wolf Fang Fist |
| Giro (spin) | golpeas alrededor varias veces | patada giratoria |
| Órbita | orbes que giran a tu alrededor | Esferas del Dragón, discos de Krilin |
| Aura | daño alrededor constante | Aura de ki, Kaioken |
| Torreta | algo que se queda disparando | Saibaman aliado, clon de Tien |
| Rastro | dejas daño por donde pasas | estela de ki |
| Persigue (homing) / Rebota | proyectiles teledirigidos o que saltan | Bolas de Piccolo (Hellzone), Kienzan teledirigido |
| Bumerán, Cadena, Minas, Meteoros, Remolino, Onda que empuja, Zona que aturde, Terremoto | variantes | Taiyoken (aturde), Genkidama (meteoro), Big Bang (mina) |
| Mejora (sin daño) | sube una estadística mientras está activo | Kaioken, cargar ki, concentración |

- **Tabla de tipos suavizada** (×1,6 / ×0,6 / ×0,3) en ambos sentidos y **clima** (lluvia, sol, arena, nieve, niebla) que potencia tipos.

## 4. Enemigos

- Muchos disparan; cada uno pega con su lado fuerte (físico o especial).
- **Con personalidad:** curanderos, escuderos (escudo como mucho cada 6 s), invocadores, los que explotan y los que **lanzan rayos avisados en el suelo** (círculos y rayas que se llenan). Tope: 3 curanderos, 3 escuderos, 3 invocadores a la vez.
- Rodean obstáculos; los rezagados reaparecen fuera de la vista.
- **Jefes:** 4 ataques avisados y se **enfurecen a media vida**.
- **Eventos a mitad de partida:** hordas de un tipo, hora dorada, Pokémon perdidos, y enemigos que **huyen cargados de monedas** (Meowth, Gholdengo).
- **Grietas:** cada pocos minutos se abre un portal (más probable cuanto más tarda, máx. 2,5 min sin una). Dentro, un legendario en una arena de su tipo con terreno (lava quema, hielo resbala, agua frena). Premio: tickets, monedas, 2 esferas y un **vínculo** (fusionar dos ataques en un solo hueco que se lanzan a la vez, hasta 4). No se abren desde el min. 28.
- **Minuto 30 — Sentencia de Arceus:** jefe invencible que te persigue cada vez más rápido; cada 5 s llega un legendario con el doble de vida y daño. Ranking por tiempo aguantado y daño hecho. Min. 35: rompe tu objeto.

## 5. Objetos y esferas

- **Objeto equipable (solo uno, dura la partida):** sale de cofres y jefes. Restos (+1,5 % vida/s), Cinta Elección (+40 % daño pero no cambias de ataque), Garra Rápida (−20 % recarga), Banda Focus (sobrevives a 1 de vida cada 60 s), Cascabel Concha (robo de vida), Moneda Amuleto (+50 % monedas), Huevo Suerte (+30 % exp.), Vidasfera (+30 % daño, cada ataque te quita vida), Pañuelo Elección (+35 % velocidad), Casco Dentado (daño al que te pega de cerca), Chaleco Asalto (−20 % daño recibido).
- **Esferas de un solo uso** (teclas 5-8, hasta 4 distintas, 3 de cada): dormir la pantalla 4 s, ralentizar 50 % 8 s, lanzar lejos a los de cerca, +25 % crítico 15 s, cámara más lejos 15 s, +40 % velocidad 10 s. A los jefes les afectan menos.

## 6. Fuera de la partida

Gacha tragaperras de 10 en 10 o de 100 en 100 con tickets que se ganan jugando (jefes: a veces ×10), shinies 1/4096, tienda diaria (Kecleon: Mentas, Cápsulas, 8 MT al día), mochila, misiones diarias y semanales, 130 logros con medallas y títulos, ranking, cooperativo hasta 4, mando y móvil.

## 7. Qué tiene ya Dragon Ball Survivor y qué falta

| Sistema de PokéSurvivor | En nuestro juego hoy | Propuesta |
|---|---|---|
| Solo dispara el ataque activo (1-4) | **Disparan todos a la vez** + técnicas propias con tecla | **Decisión de Josemi** (ver abajo) |
| Cartas: nuevo / subir / mejora / evolución dorada | Sí (técnicas a Nv.5, cartas, evolución) | Añadir «Cambiar opciones (R)», cartas apagadas 0,4 s, Semilla Senzu como Baya Zidra |
| Físico / especial (Ataque, Ki, Defensa, Def. Ki) | Un solo daño | Golpes = físico, ki = especial; ficha con 6 estadísticas |
| Clases de ataque (16) | 9 tipos (shot, beam, big, disc, bomb, aura, orbit, melee, nova) | Añadir embestida, giro, torreta, rastro, teledirigido, rebote, remolino, aturdir, «mejora sin daño» (Kaioken, cargar ki) |
| Mejoras permanentes por personaje + crítico, veto, repertorio, ataque inicial | Mejoras globales (UPG) y maestría | Pasar a mejoras por guerrero y añadir crítico, veto, cambio de cartas, técnica inicial |
| Naturaleza y habilidad | No | Habilidad propia por guerrero (Saiyan: más daño con poca vida; Namek: regeneración; androide: ki infinito…) |
| Enemigos curan, escudan, invocan, explotan, rayos avisados | Pegador, embestidor, tirador, élite, kamikaze | Añadir curandero (Dende enemigo / Babidi), escudero, invocador (Cell → Cell Jr., Babidi), rayos avisados en el suelo |
| Jefes con 4 ataques avisados y furia a media vida | Jefes sin avisos ni furia | Hacerlo (Freezer, Cell, Buu, Broly…) |
| Eventos | 8 eventos propios (Reto de Kaio, meteoritos, gravedad, tiempo detenido…) | Mantener y añadir enemigo que huye con zeni |
| Grietas con legendario + vínculo | Islas / Juegos de Cell | Grietas = Torneo / Planeta de Kaio con un villano; premio: **fusión de técnicas** |
| Sentencia de Arceus (min. 30) | Final a los 15 min | Min. 30: **Zeno / Jiren / Bills** invencible + villanos cada vez más fuertes |
| Objetos equipables (11) | No | 11 objetos DB: Semilla Senzu, Pendientes Pothala, Radar, Armadura Saiyan, Pesas de Piccolo, Rastreador… |
| Esferas de un solo uso (6) | No | Cápsulas Hoipoi: Taiyoken (dormir), Tiempo detenido, Kiai (lanzar lejos), Kaioken (crítico), Rastreador (ver más), Nube Kinton (velocidad) |
| Tabla de tipos y clima | No | Opcional; quizá más adelante (afinidades: ki / físico / divino) |
| HUD mínimo, ventanas azules | Ventanas azules 16 bits | **HUD naranja** (lo pidió Josemi): marcos y barras naranja Dragon Ball |

## 8. Decisiones que tiene que tomar Josemi

1. **¿Un solo ataque activo (como PokéSurvivor) o que disparen todos (como ahora)?** El activo da más estrategia (cambiar Kamehameha ↔ golpes ↔ Kaioken); disparar todos es más relajado.
2. **Orden de trabajo.** Propuesta:
   1. HUD naranja + pausa con resumen y estadísticas.
   2. Cartas: cambiar opciones, cartas apagadas, mejoras con tope, Senzu.
   3. Enemigos con personalidad y rayos avisados; jefes con 4 ataques y furia.
   4. Objetos equipables y cápsulas de un solo uso.
   5. Físico / ki y estadísticas por guerrero, habilidades.
   6. Grietas (torneo) con fusión de técnicas y el final del minuto 30.
   7. Mejoras permanentes por guerrero.
3. **Animaciones con Sprite Fusion (1095 créditos ≈ 73 acciones de 15):** según su guía, para andar o atacar hay que **editar primero la pose** (15) y **después animar** (15) = 30 por animación buena → unas 36 animaciones. Propuesta: probar con 3 personajes (Goku, Vegeta, Freezer), enseñar el resultado y, si convence, gastar el resto en los principales.
