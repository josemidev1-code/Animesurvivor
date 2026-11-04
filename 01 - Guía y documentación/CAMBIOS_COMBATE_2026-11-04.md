# DragonBall Survivor — cambios del 4 de noviembre de 2026

## Implementado

- Las técnicas desbloqueadas se alternan automáticamente, cada una con su propia recarga. Las teclas 1–6 dan prioridad. Tres técnicas disponibles al empezar (o las que tenga el personaje).
- Conectadas técnicas existentes que no se utilizaban en las listas de Rey Cold, Slug, Super 17, Omega, Gas, Granola, Paragus, Daishinkan, Majin Duu, Magetta, Bulma, A13, A14, Metal Cooler, Majin Kuu y Merus. Ajustadas Videl, Pan GT y Tarble. Freezer usa un rayo rojo.
- Las variantes del mismo luchador conservan técnicas compartidas: no se han inventado ataques exclusivos para cada transformación.
- Caminar con ciclos importados cuando existen; en su ausencia, movimiento completo del pack. Eliminada del dibujo en partida la separación artificial entre piernas y tronco. El ciclo importado de Goku se conserva; aún requiere tu valoración.
- Enemigos aparecen más cerca del borde visible y en grupos desde el comienzo. No aparecen oleadas normales durante el duelo con un jefe.
- Arenas: Kame House, Torneo de Artes Marciales, Namek con la nave de Freezer, Palacio de Kami y Planeta de Kaio. Se reutilizan los escenarios y decorados existentes; dibujo y colisiones comparten la misma distribución.
- Cofre de jefe: Dojo de la Tortuga (ki + patada cercana), Motor de ki Capsule Corp. (recarga) o Bolsa de Karin (vida y regeneración). La victoria final espera a elegir la recompensa.
- Más cajas y un suministro de cofre cada 35 segundos, con límite de tres sin recoger. El primero llega a los 22 segundos.
- Vegetación con movimiento suave de copa; agua animada ya existente conservada.

## Comprobaciones

- Siete comprobaciones automáticas aprobadas y sintaxis correcta.
- Registro de 140 personajes y 193 formas; simulación del director en 24 mapas y 120 encuentros de jefe.
- Chrome por HTTP local: rotación de seis técnicas de Goku; pruebas de Freezer, Vegeta, Piccolo, Bulma, Granola y Magetta; elección de legado, activación de ki + patada, regreso al mapa y victoria final.
- Cinco arenas sin colisión en el punto inicial. Sin errores de JavaScript en las pruebas realizadas.
- Las simulaciones usan estados controlados: no acreditan equilibrio de dificultad, una partida completa ni revisión visual de las 193 formas. No se pudo verificar la apertura mediante doble clic porque la automatización del navegador bloquea file://.

## Animaciones: trabajo pendiente real

El archivo de ataques extra solo tenía selecciones específicas para Goku base. No se han añadido fotogramas nuevos ni se ha revisado visualmente todo el catálogo en esta sesión. Aprovechar todos los combos, patadas, cargas y efectos de cada pack sigue pendiente.

Orden propuesto: Vegeta, Freezer, Piccolo, Gohan y Trunks; después los demás. Por forma: revisar hoja original, identificar preparación/impacto/recuperación, anclar pies y manos, comprobar escala y probar en partida. No mezclar formas ni reemplazar un cuerpo por un efecto.

## Fuentes y uso mínimo de Sprite Fusion

- [The Spriters Resource — Legendary Super Warriors](https://www.spriters-resource.com/game_boy_gbc/dbzlegend/): catálogo de personajes, fondos y recursos del juego original.
- [Sprite Database — Legendary Super Warriors](https://spritedatabase.net/game/666): segunda fuente para localizar hojas concretas.
- [PMD Sprite Repository, referencia del usuario](https://sprites.pmdcollab.org/#/0775?form=0): referencia para organizar acciones; su vista interactiva no pudo inspeccionarse con la extracción web. No se han importado sprites Pokémon.
- [Sprite Fusion — Animation Tips](https://www.spritefusion.com/docs/pixel-art-generator/animation-tips): partir de una pose adecuada al movimiento, limpiar el sprite y dejar margen para que no se corte. Si falla, corregir la pose antes de repetir.

No se descargaron nuevas hojas ni se consumieron créditos. Primero revisar los packs locales; buscar fuera solo movimientos realmente ausentes. Para Sprite Fusion, probar una única forma con pose de paso y comprobar perfil, pies, silueta, escala y bucle antes de generar otras. Conservar autores y procedencia de cualquier recurso que se incorpore.
