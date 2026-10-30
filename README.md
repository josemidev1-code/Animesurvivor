# Animesurvivor

Juego de supervivencia estilo PokeSurvivor con personajes de Dragon Ball, en pixel art. Funciona sin instalar nada: abre `index.html` con doble clic en el navegador.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | La página: pantallas, menús y botones |
| `style.css` | Los estilos |
| `script.js` | Todo el código del juego |
| `sprites.js` | Las imágenes (sprites animados y escenarios) en base64; `script.js` las usa como `SPRITES_DATA[n]` |

## Personajes

- 26 héroes jugables, con formas animadas (quieto, andar, ataque, ki con la mano abierta y daño).
- Más de 60 enemigos y jefes por sagas: los débiles salen primero y los fuertes al final de cada partida.
- Cada minuto llega una horda (estampida, cerco o ataque en pinza), con élites y un jefe cada 3 minutos.
- La cámara se acerca según el tamaño de la pantalla, para que los personajes se vean bien también en pantallas pequeñas.

## Controles

- Flechas / WASD (o arrastrar en móvil): moverse
- 1 a 6 (o tocar la barra de abajo): elegir qué ataque se lanza solo. El personaje ataca automáticamente al enemigo más cercano; tú solo te mueves y cambias de ataque
- Cada personaje tiene 4-6 ataques de la serie (Kamehameha, Final Flash, Makankosappo, Genkidama, espada de Trunks...). Los dos primeros están desde el principio; los demás aparecen como carta "¡NUEVO ATAQUE!" al subir de nivel (a partir de los niveles 3, 6, 10 y 15) y las cartas de nivel los mejoran
- P / Esc: pausa · M: silenciar

Juego de fans sin ánimo de lucro. Dragon Ball pertenece a sus autores. Sprites animados a partir de "Dragon Ball Sagas" (qsab101, LukasAhl1, thekrillmaster, Manikdx2000, gogeta68, MV95, PeculiarDoc, LICHT, YoloKing777, Mangal666 y otros autores de la colección).
