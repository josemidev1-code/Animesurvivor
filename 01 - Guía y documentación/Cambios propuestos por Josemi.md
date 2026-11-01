# AnimeSurvivor — Cambios y dirección del juego

Documento preparado con las ideas del usuario para la siguiente IA. Antes de trabajar, lee `AGENTS.md` y el estado actual del proyecto. La petición actual del usuario tiene prioridad sobre planes antiguos. Este documento recoge objetivos; no significa que ya estén implementados.

## Cómo trabajar con el usuario

- Trabaja por etapas y mantén actualizados el estado y la bitácora con lo pedido, lo hecho, las pruebas y lo que queda pendiente.
- Actúa como colaborador creativo: identifica problemas y propón mejoras concretas de mecánicas, estructura, nombres, menús e iconos. Explica brevemente por qué pueden mejorar el juego.
- Antes de tomar decisiones creativas importantes, muestra opciones al usuario y deja que elija. No conviertas una sugerencia en una decisión aprobada.
- Aprovecha los recursos existentes y la organización del proyecto. Acota las búsquedas; no leas completos los archivos de recursos generados grandes salvo que sea necesario.
- El juego debe funcionar abriendo `index.html` con doble clic. Comprueba el funcionamiento y revisa visualmente los cambios; indica claramente lo que no hayas podido probar.

## 1. Personajes, formas y sprites

El usuario quiere que estén en el juego todos los personajes y formas que tiene en `sprites/`. Revisa los packs y su contenido de forma ordenada para identificar personajes, formas, animaciones, retratos y efectos; ten en cuenta duplicados, packs mixtos, sprites incompletos y recursos que sean solo efectos.

Busca aprovechar todos los recursos útiles, pero no inventes animaciones ni des por terminado un personaje sin comprobarlo. Si un pack está incompleto o hay dudas sobre qué contiene o a qué personaje pertenece, anótalo y consúltalo con el usuario. La propuesta de incluir solo packs suficientemente completos aún no ha sido confirmada por el usuario: acuerda con él cómo tratar los incompletos. Usa los sprites del proyecto para personajes y enemigos, siguiendo las reglas de `AGENTS.md`.

Para cada personaje y forma, revisa visualmente las animaciones disponibles y su coherencia dentro del juego. No presentes como revisado algo que solo haya pasado comprobaciones automáticas.

## 2. Ataques propios y fidelidad a la serie

- Revisa los sprites y efectos de cada personaje para identificar las técnicas y ataques que incluyen. Vincula cada técnica al personaje correspondiente y ponle su nombre conocido cuando puedas identificarla con seguridad, de acuerdo con la serie y el lore.
- Si no puedes identificar con seguridad un ataque o su nombre, documenta la duda y pregúntaselo al usuario; no inventes una identificación.
- Aprovecha los efectos y animaciones disponibles sin introducir ataques genéricos incoherentes. Documenta las limitaciones cuando falten recursos.

## 3. Combate, enemigos y progresión

El combate debe tener lógica y ser divertido y jugable, con una dificultad que aumente gradualmente:

- Los enemigos deben tener distintos ataques y comportamientos apropiados, en vez de que todos se limiten a disparar el mismo proyectil.
- Controla la cantidad y frecuencia de enemigos y proyectiles: actualmente, cuando se acumulan enemigos lanzan tantas bolas que resulta casi imposible aguantar o esquivarlas.
- Revisa aparición de enemigos, daño, defensa y progresión para ofrecer oportunidades reales de reaccionar, aprender y sobrevivir, sin eliminar el desafío.
- Haz viables dos estilos de juego: uno táctico a distancia con bolas de ki y técnicas como Kienzan o Kamehameha cuando correspondan al personaje, y otro centrado en disfrutar de los golpes y la lucha cuerpo a cuerpo.
- Ahora el cuerpo a cuerpo no compensa porque acercarse suele matar rápidamente al jugador. Investiga las causas y propone ajustes razonados de alcance, daño, defensa, movimiento y comportamiento enemigo. No te limites a aumentar cifras sin comprobar el resultado.
- Prueba partidas reales en distintas fases de progresión y con diferentes personajes y estilos; documenta resultados, problemas y pruebas visuales pendientes. Las pruebas automáticas no sustituyen jugar.

## 4. Diseño general, interfaz y menús

Mantén un estilo pixel art inspirado en PokéSurvivor, adaptado a Dragon Ball. El usuario quiere un juego visualmente bonito y coherente con la saga, con menús intuitivos. Revisa el conjunto: nombres, menús, HUD, pantallas, subidas de nivel, tienda y gachapón. Propón soluciones concretas y consulta las decisiones visuales importantes antes de aplicarlas.

Durante la partida:

- El HUD actual es demasiado grande: redúcelo para dejar más espacio visible para jugar.
- Las letras y los elementos se ven borrosos. Mejora la nitidez y la definición de textos, iconos y pixel art, y compruébala a diferentes tamaños de pantalla.
- Las habilidades y sus efectos ocupan demasiada pantalla. Reduce su tamaño o presencia visual de forma que no tapen innecesariamente la acción y sigan siendo legibles.
- Propón ideas de iconos y presentación para las subidas de nivel y otros elementos cuando el usuario no sepa cuál elegir.

Las estadísticas de los personajes deben poder consultarse claramente. Como guía visual pedida por el usuario: **vida en verde, velocidad en azul y ataque en rojo**. Mantén además etiquetas o símbolos legibles para distinguirlas.

## 5. Selección de personaje

El usuario quiere que la imagen usada para seleccionar un personaje sea un retrato **fijo de su cara en pixel art**, como el ejemplo de Cell aportado en la conversación. Debajo debe verse el personaje completo como aparece dentro de la partida. Usa los retratos existentes de los packs cuando corresponda y revisa que no se vean borrosos.

Aún queda por aclarar si el retrato de la cara debe permanecer igual al cambiar de transformación: no supongas una respuesta. Pregunta al usuario cuando la decisión sea necesaria.

## 6. Iconos del menú principal

El usuario considera feos los iconos actuales de Jugar, Personajes, Mejoras, Tienda, Shenron, Misiones, Ranking y Ajustes. **Él mismo buscará y aportará los recursos pixel art** para sustituirlos. No afirmes que ya están disponibles ni los des por elegidos. Cuando los aporte, intégralos con nitidez y coherencia visual; mientras tanto, puedes sugerir ideas para que él elija.

## 7. Noticias y música del menú

- Añadir una sección de noticias en la parte superior izquierda del menú. Proponer al usuario contenido y funcionamiento antes de asumir que deba conectarse a un servicio externo.
- Debajo de esa sección, incluir un enlace para abrir y escuchar el rap de Dragon Ball de Porta. Confirma con el usuario el enlace o la versión concreta antes de integrarlo; no inventes una URL.
- El usuario quiere que la música del juego tenga un aire de Dragon Ball. Propón opciones y consulta con él antes de seleccionar o incorporar una pista; no asumas que el enlace al rap sea la música de fondo ni que exista permiso para incluir una grabación.

## Orden de trabajo recomendado

Empieza revisando el estado real del proyecto y presenta al usuario un plan por bloques, con prioridades, dependencias y una muestra de los cambios visuales que requieran su decisión. No intentes implementar todo en una sola tanda. Una posible secuencia es: inventario de sprites y dudas; propuesta visual y HUD; equilibrio de combate y progresión; incorporación gradual de personajes y técnicas; menús, noticias y música. El usuario puede cambiar ese orden.

Tras cada bloque, documenta lo realizado y prueba las funciones afectadas; pide al usuario que valore los aspectos visuales o de jugabilidad que necesiten su criterio.
