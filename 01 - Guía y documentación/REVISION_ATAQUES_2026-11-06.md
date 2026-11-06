# Coherencia de ataques — 6 de noviembre de 2026

## Cambios

- Un selector común relaciona el tipo de técnica con su fila: puños, patadas, rayo, energía sobre la cabeza o poder. La postura se conserva en el lanzamiento, también para discos y bombardeos.
- Las variantes de puños ya no reutilizan tiras idénticas a las de patadas. Janemba usa sus secuencias de espada únicamente en técnicas de espada. Se corrigieron los efectos sueltos de Gohan y Buu que sustituían al cuerpo.
- `tecnica_ID` permite elegir una secuencia propia para un ataque sin alterar el resto del personaje; los JSON de selección siguen siendo la fuente. `tecnica_IDOrigen` señala el punto de emisión en cada fase.
- Se respetan los tiempos de los fotogramas. El primer daño del combo espera a la preparación y el reloj continúa entre impactos. El tajo conserva su animación al impactar.
- 24 selecciones de forma corregidas en 17 IDs (incluidos aliases del mismo pack); 27 secuencias específicas. Las transformaciones que comparten ese pack reciben la corrección.
- Piskel exporta tiempos mediante repetición de celdas e importa de vuelta secuencias de sprites originales. Un manifiesto vincula cada fotograma a su pack; un dibujo ajeno se rechaza. Se conservan las carpetas históricas, aunque ya no se usen en el juego.

## Validación

- Sintaxis de JavaScript, `comprobar_combate.cjs`, `comprobar_personajes.cjs`, `comprobar_catalogo_sprites.cjs` y `comprobar_animaciones_ataques.cjs`: correctos.
- Catálogo montado: 313 formas, 3.353 animaciones y 6.536 fotogramas. Son cifras de todos los recursos, incluidas formas de enemigos y personajes ocultos.
- Navegador: 270 formas visibles y 1.522 combinaciones forma/técnica ejecutadas en combate simulado (0,65 segundos por combinación) y renderizadas sin errores ni coordenadas inválidas. También se verificó la carga de sus secuencias. 13 técnicas específicas verificadas en preparación y lanzamiento.
- Piskel web: importación del Kamehameha nativo comprobada en el editor (2 fotogramas, 52×52, 5 FPS).
- Piskel: 322 animaciones exportadas de las formas corregidas pasan la validación de vuelta. Ocho pruebas unitarias cubren orden, duración, procedencia, layout y poses duplicadas.
- La línea base de mediciones ya fallaba en `fe3baa0d`: 1 forma con sueltos, 33 agachadas y 10 desiguales; el test espera 0/16/4. Los resultados actuales son los mismos. La ejecución general se interrumpió durante el recálculo de cachés de plantillas; no se presenta como una suite completa aprobada.

## Límites y trabajo que falta

No se ha hecho una revisión visual individual de todas las animaciones del catálogo. Las pruebas de carga no demuestran que cada pose de reserva sea fiel a la serie; quedan técnicas sin selección específica. No se rellenan esos huecos con propuestas automáticas sin revisar.

La prueba con `file://` está bloqueada por la política del navegador de este entorno. Se ha probado con servidor local; el juego sigue usando imágenes incrustadas y no incorpora `fetch` en ejecución.

Los cambios de Piskel deben revisarse visualmente antes de montarse. La importación valida procedencia y tiempos, pero no puede reconocer por sí sola si una pose es un puñetazo, una patada u otra transformación.
