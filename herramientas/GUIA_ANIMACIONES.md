# Guía: animaciones elegidas a mano

Los personajes del juego usan fotogramas reales de los packs de `sprites/`, elegidos a mano.
En Dragon Ball no se camina: **al moverse, el personaje vuela o se impulsa** (pose inclinada hacia delante).

## Herramientas

Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` (pon `PYTHONIOENCODING=utf-8`).

| Paso | Comando | Resultado |
|---|---|---|
| Ver un pack entero, numerado | `python herramientas/ver_pack.py "<pack dentro de sprites/>"` | `herramientas/_revisar/pack_<nombre>.png` |
| Ver unos fotogramas en grande | `python herramientas/ver_pack.py "<pack>" 4 10,11,12` | `..._sel.png` |
| Revisar una forma elegida | `python herramientas/previsualizar.py <heroe> <forma>` | `herramientas/_revisar/<heroe>_<forma>.png` y `.gif` |
| Meterlo en el juego | `python herramientas/montar_animaciones.py [heroe ...]` | `animaciones_juego.js` |

Para encontrar packs: la carpeta `sprites/` (categoría/saga/personaje/pack).
Los números de fotograma son el orden natural de los nombres de archivo del pack (los que imprime `ver_pack.py`).

## Formato (`herramientas/animaciones.json` y `herramientas/animaciones/*.json`)

```json
{ "heroes": { "goku": { "0": {
  "pack": "01_Dragon_Ball_Super/05_Broly/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS",
  "idle": [1, 2], "idleDu": [26, 26],
  "move": [7],
  "attack": [18, 21, 22, 23],
  "kick": [25, 26, 27],
  "ki": [35, 37],
  "pow": [41, 42],
  "hurt": [31, 29],
  "portrait": 59
} } } }
```

Opcionales: `<anim>Du` (duración de cada fotograma, en ticks de 1/60 s), `"espejo": true` si el pack mira a la
izquierda, `"escala": 8.8` para forzar el zoom del pack, `"escalaFija": true` si el tamaño baila entre animaciones.

## Reglas (todas obligatorias)

1. **Un solo pack por forma.** Nunca mezcles fotogramas de packs distintos en la misma forma. Elige el pack más
   completo: postura de guardia, impulso/vuelo, puñetazos, patadas, carga de ki, daño y, si hay, cara grande.
   Los packs HD de "Andrés Gamen Animations" suelen ser los mejores.
2. **La forma tiene que ser la del nombre**: pelo negro en BASE, amarillo en SSJ, largo en SSJ3, azul en BLUE,
   rojo en GOD, plateado en UI, pelaje rojo en SSJ4… Ningún fotograma de otra forma (ni a mitad de transformación).
3. **Todos miran a la derecha.** Si el pack mira a la izquierda, `"espejo": true`.
4. **idle** (quieto): 1–3 fotogramas de la MISMA postura de guardia con cambios pequeños (respiración). Nada de saltos,
   golpes, caras grandes ni transformaciones.
5. **move** (moverse): 1–2 fotogramas de impulso/vuelo hacia delante (cuerpo inclinado a la derecha). Si hay polvo o estela
   detrás, mejor. Nada de saltos verticales ni posturas quietas.
6. **attack** (puñetazos): 3–5 fotogramas de UN combo coherente: preparación → brazo estirado. Nada de saltos ni de
   golpes de otro movimiento metidos en medio.
7. **kick** (patadas): 2–4 fotogramas de una patada (o patada giratoria) coherente.
8. **ki**: EXACTAMENTE 2 → `[cargando (manos juntas, bola de ki), disparando (brazos estirados)]`. El juego usa el 0 al cargar
   y el 1 mientras sale el rayo. Nunca fotogramas que sean solo el rayo.
9. **pow**: 2–4 fotogramas del personaje con su aura (cargando poder). Si no hay aura, la postura de carga.
10. **hurt**: EXACTAMENTE 2 → `[golpe recibido, retroceso]`. Nunca tumbado en el suelo.
11. **portrait**: el fotograma de la cara grande, si el pack lo tiene.
12. **Prohibido en cualquier animación**: fotogramas que son solo efecto (rayos, bolas, rayas de velocidad, chispas sueltas),
    caras grandes, otros personajes, fotogramas cortados, con fondo blanco sin quitar o con basura.

## Comprobación (obligatoria para cada forma)

Ejecuta `previsualizar.py` y **mira el PNG**. Corrige y repite hasta que se cumpla todo:

- El personaje tiene **el mismo tamaño** en todas las filas (la cabeza a la misma altura en idle, attack, ki, pow, hurt).
  Si una fila sale más pequeña o más grande, ese fotograma venía con otro zoom: cámbialo por otro o usa `escala`.
- Los pies apoyan en la línea roja de cada celda (salvo vuelo y daño).
- Todos miran a la derecha y se reconoce la forma correcta.
- Ningún fotograma desentona: si al poner la fila en bucle algo "salta", sobra.

Ejemplo de referencia ya revisado: `goku` forma `0` (míralo con `previsualizar.py goku 0`).
