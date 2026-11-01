# Bloque 1 · Herramienta que propone los fotogramas de cada pack

Fecha: 01/11/2026 · Proyecto: DragonBall Survivor (fanmade, sin ánimo de lucro, se publicará en una web).

## Por qué

El usuario quiere meter el máximo de personajes jugables, mejores enemigos y técnicas de la serie sacadas de los
propios sprites. Hoy cada forma se elige a mano mirando la hoja del pack (ver `herramientas/GUIA_ANIMACIONES.md`),
lo que hace caro cada pack nuevo. En `sprites/` hay 333 packs y el juego usa 165; de los packs usados solo se
aprovecha 1 de cada 6 fotogramas (2.661 de 15.419), y 150 de ellos traen rayos, bolas y auras dibujados que el
juego no usa.

Este bloque es el primero de seis acordados con el usuario, en este orden:
1. **Esta herramienta** (y con ella, el movimiento corregido de todos los personajes actuales).
2. Técnicas de la serie usando el efecto de su propio pack.
3. Más personajes jugables con los packs que faltan.
4. Enemigos (recuperar los 35 retirados, con ataques propios).
5. Experiencia y HUD nuevos.
6. Mecánicas nuevas.

Entre bloque y bloque se juega una partida para comprobar que el juego sigue siendo divertido.

## Qué ha decidido el usuario

- **Movimiento:** la propuesta «A corregida» que vio animada en el navegador: al moverse, el personaje usa la pose
  de impulso de su pack (inclinado hacia delante), al mismo tamaño que la guardia y **sin polvo ni chispas pegados**.
  Arriba y abajo se usa la misma pose de perfil. Se mantiene el balanceo suave que ya hace el juego cuando la
  animación de moverse tiene un solo fotograma.
- **Efectos de las técnicas:** solo los del propio pack de cada personaje, nada genérico (afecta al bloque 2, pero
  esta herramienta debe dejarlos localizados).
- **Revisión:** el usuario solo revisa los packs que sigan dudosos; no quiere aprobar uno a uno.
- **Forma de construirla:** la mixta (C): reglas automáticas con nota de confianza → la IA de turno revisa los
  dudosos → lo que siga dudoso pasa al usuario.

## Alcance de este bloque

Termina con: la herramienta, la página de revisión, las 171 formas actuales arregladas y la validación contra lo
hecho a mano. **Pasarla por los 168 packs que faltan es el bloque 3** (más personajes), no este.

## Objetivos

1. Para cualquier pack de `sprites/`, proponer qué fotogramas forman cada animación del formato actual
   (`idle`, `move`, `attack`, `kick`, `ki`, `pow`, `hurt`, `faint`, `portrait`) y, además, **etiquetar los
   fotogramas de efecto** (rayo, bola, aura/barrera, estela) para el bloque 2.
2. Dar a cada propuesta una **nota de confianza** y clasificar el pack en «seguro» o «dudoso».
3. Arreglar en el montaje (`montar_animaciones.py`) lo que hoy está mal en el juego, medido el 01/11/2026 sobre
   las 171 formas de `animaciones_juego.js`:
   - polvo o chispas sueltas en la pose de moverse: 21 formas (goku/0, goku/1, gokuui/0,1,3,4, gokumoro/0,1,2,
     gokubroly/0,1,2,3, vegeta/1, vegetaue/2, black/2, cell/4, kefla/1, trunks/0, e_ginyu/0, e_jeice/0);
   - pose de moverse muy agachada (menos del 70 % del alto de la guardia): 16 formas (goku/1, gokuui/1,3,4,
     vegetaue/2, vegetto/2, cell/3, bra/1, gohanadult/1, a18/0, gohan/3, bardock/0, bardockalt/1, brolyfan/0,
     vegettofan/0, gokubroly/1);
   - tamaño de píxel desigual: vegetasuper/2 (forma entera), gohanmanga/0 (patada), blackfan/0 (puñetazos),
     e_ginyu/0 (poder).
4. Una **página de revisión** para los dudosos, con cada animación en movimiento, donde el usuario aprueba o cambia
   fotogramas sin tocar JSON.

## No objetivos (son de otros bloques)

- Meter técnicas nuevas en el juego o cambiar cómo se dibujan los rayos (bloque 2).
- Dar de alta personajes nuevos en `script.js` (bloque 3). Este bloque solo deja las propuestas listas.
- Enemigos, experiencia, HUD y mecánicas (bloques 4-6).
- Animación de andar: los packs son de juegos de lucha y no la tienen; no se dibuja por código.

## Lo que sería un fracaso aunque funcione

- Que la herramienta **empeore** formas que hoy están bien elegidas a mano.
- Que el usuario reciba tantos «dudosos» que acabe revisando casi todo (entonces no ha servido para nada).
- Que se cuele algo dibujado por código (regla del proyecto).
- Que el juego deje de funcionar con doble clic en `index.html`.

## Restricciones

- Python con Pillow (`C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe`, `PYTHONIOENCODING=utf-8`;
  en bash de Windows `python3` se cuelga). Sin dependencias nuevas salvo que sea imprescindible.
- Reutilizar `herramientas/montar_animaciones.py` (`frames_del_pack`, `limpiar`, `escala_pixel`, `cargar_forma`,
  `tira`): ya limpia fondos, reduce los HD a su píxel real e iguala el tamaño de cada fotograma.
- El formato de selección es el actual (`herramientas/animaciones*.json`, ver la guía); el juego lee
  `animaciones_juego.js` generado. No cambiar el formato que consume `script.js` en este bloque.
- Todo en español para el usuario. Bitácora y commits frecuentes según `AGENTS.md`.
- Los packs de terceros (DeviantArt) mantienen sus créditos (`PACK_CREDITS`, `CREDITOS_RECURSOS.md`).

## Formas de construirlo que se consideraron

| | Cómo | A favor | En contra |
|---|---|---|---|
| A · Solo reglas | Un programa decide por forma, tamaño, colores y orden | Rápido, gratis, 330 packs en minutos | Cada autor ordena y dibuja distinto: muchos fallos y muchos dudosos |
| B · La IA mira cada pack | Como ahora: la IA de turno ve la hoja y elige | Lo que más acierta | Lento y caro; es el cuello de botella que se quiere quitar |
| **C · Mixta (elegida)** | Reglas con confianza → la IA revisa los dudosos → el usuario lo que siga dudoso | Solo se gasta IA y tiempo del usuario donde hace falta | Más piezas que construir |

El usuario eligió la C. Motivo: le deja revisar solo lo dudoso de verdad sin gastar sesiones enteras de IA por pack.

## Diseño

### 1. Medir cada fotograma (`herramientas/proponer_fotogramas.py`, nuevo)

Para cada fotograma de un pack, ya limpio y reducido a su píxel real, calcular rasgos baratos:
alto y ancho del cuerpo, proporción, centro de masa e inclinación, paleta frente a la de la guardia (porcentaje de
colores en común, como en la revisión del 01/11), número de manchas separadas, y parecido de silueta con los
fotogramas vecinos. Los HD tardan: guardar estas medidas en caché por pack
(`herramientas/_revisar/medidas/`, ya ignorado por git) para no recalcular.

### 2. Clasificar con reglas

Rasgos que ya se vieron fiables en la revisión del 01/11:
- **Efecto puro** (rayo, bola, aura sola): menos del ~15 % de colores en común con el personaje. Rayo si es más de
  2,2 veces más ancho que alto.
- **Guardia:** de pie, alto parecido al máximo del pack, poca inclinación, los primeros fotogramas del pack.
- **Impulso (`move`):** silueta inclinada hacia delante, mirando en el mismo sentido que la guardia; nunca el salto
  hacia atrás (en Goku base el actual `move: [7]` lleva el polvo delante de los pies: señal de retroceso).
  Si no hay ninguno claro, se usa la pose de flotar o la guardia. *Decisión de Claude:* esta regla solo vale para
  propuestas nuevas y, si salta, marca el pack como dudoso; nunca sustituye una selección hecha a mano. En Goku base
  (goku/0 y gokuui/0, mismo pack) **`move` sigue siendo el fotograma 7**: es el que el usuario vio y aprobó en la «A
  corregida»; solo se le quita el polvo.
- **Golpes, patada, ki, poder, daño, muerte, retrato:** por silueta (brazo o pierna extendida, manos juntas con
  bola, aura alrededor, cuerpo hacia atrás, tumbado, cara grande) y por orden en el pack (los autores agrupan cada
  animación en fotogramas seguidos).

**Plantillas por autor:** muchos packs son del mismo autor y siguen el mismo orden (Andrés Gamen tiene decenas; su
autor sale de `_ORIGEN_Y_CREDITOS.md` o del nombre de la carpeta). Las selecciones ya hechas a mano de ese autor
sirven de plantilla: si el pack nuevo tiene el mismo número de fotogramas y siluetas parecidas en las mismas
posiciones, se propone la misma selección con confianza alta.

### 3. Nota de confianza y «dudoso»

Cada animación propuesta lleva una nota de 0 a 1. Un pack es **dudoso** si le falta alguna animación obligatoria,
si alguna nota queda por debajo del umbral, si el impulso sale muy agachado (menos del 70 % de la guardia), si
quedan manchas sueltas tras la limpieza o si los tamaños de píxel no cuadran. El umbral se ajusta (ver
«Validación») para que los dudosos sean pocos sin colar errores.

### 4. Quitar polvo y chispas sueltas (en `montar_animaciones.py`)

En la animación de moverse, quedarse solo con la mancha principal del cuerpo y las que la tocan; las manchas
separadas (polvo, chispas, estelas) se eliminan. Con la opción de forma `"conservarSueltos": true` se desactiva para
personajes cuyo cuerpo venga partido (por ejemplo, armas o colas sueltas). Se aplica solo a `move`, no al resto.

### 5. La IA revisa los dudosos

La herramienta genera, por cada pack dudoso, una hoja con los fotogramas propuestos por animación y las
alternativas cercanas (`herramientas/_revisar/dudosos/<pack>.png`) y un resumen en texto. La IA de turno (Claude,
Codex…) las mira, corrige lo que vea claro y deja marcado lo que siga dudoso. No se usa ninguna API de pago: lo hace
la IA que esté trabajando en la sesión, como hasta ahora.

### 6. Página de revisión para el usuario

Una página HTML generada (`herramientas/_revisar/revision.html`, abre con doble clic, imágenes incrustadas) con
solo los packs que siguen dudosos. Para cada uno: las animaciones en movimiento sobre la hierba del juego, a tamaño
real, y debajo los fotogramas del pack numerados. El usuario pulsa «Vale» o cambia fotogramas pinchándolos, y al
final pulsa un botón que descarga `decisiones.json`. La herramienta lee ese archivo y pasa las decisiones al JSON
de selección.

### 7. Dónde se escribe

- Propuestas: `herramientas/propuestas/<pack>.json`, **fuera** de `herramientas/animaciones/`, para que
  `leer_config()` no las meta en el juego. Una por pack, identificada por la ruta del pack (los packs nuevos aún no
  tienen nombre de personaje; se lo da el bloque 3). Mismos campos que una forma (`idle`, `move`…) más `"confianza"`
  por animación y `"efectos": {"rayo": [...], "bola": [...], "aura": [...], "estela": [...]}`.
- Formas actuales (*decisión de Claude*): **no se reescriben sus selecciones a mano**.
  - El polvo de las 21 formas se quita en el montaje, sin tocar su selección.
  - Para las 16 agachadas y los 4 tamaños desiguales la herramienta propone un cambio, que pasa por el mismo camino
    que un dudoso: la IA lo revisa y, si sigue dudoso, lo ve el usuario en la página. Solo después se escribe en el
    archivo de su grupo, guardando la selección anterior en `"moveAntes"` (o `"<anim>Antes"`).
  - En el resto de formas, si la herramienta no coincide con lo hecho a mano, solo lo apunta en el informe de
    validación; no cambia nada.

## Validación

- **Contra lo hecho a mano:** pasar la herramienta por los 162 packs ya elegidos y comparar con la selección
  actual. Así se ajustan reglas y umbral antes de tocar packs nuevos. *Decisiones de Claude* para medirlo:
  - Cuenta como acierto un fotograma del mismo grupo de fotogramas seguidos que el elegido a mano (no hace falta el
    mismo número exacto).
  - Obligatorias: `idle`, `move`, `attack`, `kick`, `ki`, `hurt`. `pow`, `faint` y `portrait` no lo son (el montaje
    ya tiene respaldo para el retrato).
  - Objetivo: al menos un 80 % de aciertos en las obligatorias, y que tras la revisión de la IA lleguen al usuario
    como mucho 1 de cada 5 packs. Si no se alcanza, se ajustan las reglas antes de seguir.
- **Las tres listas del objetivo 3** deben quedar a cero, salvo las formas que la IA o el usuario marquen como
  correctas a propósito. El script de medición es
  `herramientas/medir_formas.py`. Definiciones exactas:
  - *Mancha suelta:* píxeles opacos no unidos (vecindad de 8) a la mancha más grande; problema si son más del 5 %
    de los píxeles opacos de algún fotograma de `Walk`.
  - *Agachada:* el alto máximo (caja de píxeles opacos) de los fotogramas de `Walk` en `animaciones_juego.js` es
    menor que el 70 % del alto del primer fotograma de `Idle`.
  - *Tamaño desigual:* `escala_pixel` de algún fotograma de una animación difiere más de un 15 % de la del primer
    fotograma de `Idle`, medido sobre los fotogramas ya montados.
- `node herramientas/comprobar_personajes.cjs` y `node herramientas/comprobar_enemigos.cjs` siguen pasando.
- Jugar una partida corta con Goku base y dos formas de las listas en el navegador (`AS.start(id, mapa)`), y
  enseñar al usuario una captura o GIF del movimiento.
- Tras cambiar `animaciones_juego.js`, subir el `?v=N` de `index.html`.

## Lo que se deja al constructor

- Los rasgos exactos, pesos y umbrales de cada regla (se ajustan con la validación contra lo hecho a mano).
- Cómo detectar el autor de un pack cuando no hay `_ORIGEN_Y_CREDITOS.md`.
- La estructura interna del código y el aspecto de la página de revisión, mientras cumpla lo descrito.
- Si el cálculo es lento, paralelizarlo o reducir la resolución de medida.
