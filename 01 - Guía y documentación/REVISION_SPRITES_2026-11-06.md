# Revisión de sprites — 6 de noviembre de 2026

## Resultado

- Analizados 37.888 archivos originales y comprobado el formato de sus 37.468 imágenes. Cero imágenes corruptas.
- Corregidas 125 selecciones en 91 formas. Incluyen 86 embestidas que ahora conservan el cuerpo del vuelo, 31 poses elevadas con efectos o forma incorrecta, seis variantes de combo y dos poses de rayo que usaban retratos.
- El jugador mantiene una misma variante durante todo el combo. Los enemigos recorren sus fotogramas de golpe/patada y usan sus poses de rayo y embestida cuando existen.
- Incorporados cinco packs completos revisados: Tora, Vegeta explorador HD, Vegeta SSJ2 HD, Kyabe clásico y Goku Black LSW. Las variantes conservan técnicas propias de su personaje.
- Catálogo final de 307 formas, 2.893 animaciones y 5.663 fotogramas. Índice actualizado con cero rutas sin localizar.

## Verificación

- Revisadas 38 hojas de fotogramas representativos del catálogo anterior y hojas completas de las cinco incorporaciones. Estas hojas permiten detectar poses incorrectas, pero no equivalen a inspeccionar manualmente las 37.468 imágenes originales una a una.
- Prueba de integridad de todas las tiras y regresión del combo aprobadas. Comprobaciones de personajes, cuerpo a cuerpo y roles aprobadas. Sintaxis de los JavaScript modificados correcta.
- Navegador integrado: decodificados y dibujados 5.873 fotogramas de 318 formas tras los alias que añade el juego, sin errores. Ejercitados ataques en 289 formas registradas de combate y cargados los 132 tipos de enemigo, sin excepciones ni estado no finito.
- Pruebas con estados controlados. No sustituyen una partida completa por personaje ni acreditan equilibrio de dificultad. Persisten las discrepancias de las pruebas históricas de oleadas, transformaciones, botín y rotación señaladas en el análisis anterior.

## Limpieza recuperable

- Siete archivos vacíos sin extensión retirados de sprites/ y guardados en Recursos pendientes/cuarentena_sprites_2026-11-06, con un manifest que conserva sus rutas originales.
- Conservados los archivos TXT vacíos: sus nombres identifican autores. Conservados los fotogramas duplicados: pueden marcar pausas de animación y eliminarlos cambiaría los índices de las selecciones.
- Los 221 grupos de archivos idénticos están listados en Inventario-sprites.json.

## Material que continúa fuera de los personajes

Quedan 108 carpetas sin selección como personaje. Incluyen escenarios, referencias, originales de hojas, efectos, recortes de Shenron, packs mixtos y packs incompletos ya documentados. El inventario las enumera. Sus imágenes siguen disponibles para recuperar movimientos y efectos concretos.

Los packs de Broly restringido y Bujin examinados no aportan todas las secuencias requeridas. La hoja de Freezer mezcla varias formas con movimientos parciales. No se han convertido en luchadores con animaciones prestadas de otros packs.

Guardado local. El gachapón de Bulma y su guardia fija se conservan. Publicación pendiente de autorización.
