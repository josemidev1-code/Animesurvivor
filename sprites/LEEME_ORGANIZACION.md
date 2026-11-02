# Biblioteca de sprites organizada

De 32,350 archivos originales se conservan 32,193; se eliminaron 157 copias de imagenes identicas byte a byte.

Orden: categoria o saga / personaje / pack. Los packs mixtos con archivos numericos se mantienen juntos para evitar identificar personajes sin evidencia. Las sagas son orientativas segun nombres, no una revision visual de cada imagen.

## Carpetas

- `00_Dragon_Ball_Z/00_Saiyans`: 286 archivos originales conservados.
- `00_Dragon_Ball_Z/01_Namek_y_Freezer`: 432 archivos originales conservados.
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks`: 1,441 archivos originales conservados.
- `00_Dragon_Ball_Z/03_Majin_Buu`: 2,483 archivos originales conservados.
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales`: 1,052 archivos originales conservados.
- `01_Dragon_Ball_Super/00_Dioses_y_Super_Saiyan_God`: 339 archivos originales conservados.
- `01_Dragon_Ball_Super/01_Resurreccion_de_Freezer_y_Whis`: 627 archivos originales conservados.
- `01_Dragon_Ball_Super/02_Universo_6`: 407 archivos originales conservados.
- `01_Dragon_Ball_Super/03_Trunks_del_futuro`: 1,321 archivos originales conservados.
- `01_Dragon_Ball_Super/04_Torneo_del_Poder`: 1,769 archivos originales conservados.
- `01_Dragon_Ball_Super/05_Broly`: 939 archivos originales conservados.
- `01_Dragon_Ball_Super/06_Moro`: 673 archivos originales conservados.
- `01_Dragon_Ball_Super/07_Granola`: 693 archivos originales conservados.
- `01_Dragon_Ball_Super/08_Super_Hero`: 400 archivos originales conservados.
- `01_Dragon_Ball_Super/09_Generales_y_manga`: 3,098 archivos originales conservados.
- `02_GT`: 1,223 archivos originales conservados.
- `03_Daima`: 902 archivos originales conservados.
- `04_Heroes_y_videojuegos`: 1,416 archivos originales conservados.
- `05_Fanmade_y_alternativos`: 8,703 archivos originales conservados.
- `06_Escenarios`: 129 archivos originales conservados.
- `07_Personajes_sin_saga_concreta`: 1,406 archivos originales conservados.
- `08_Referencias`: 65 archivos originales conservados.
- `09_Packs_mixtos_por_revisar`: 2,389 archivos originales conservados.

## Trazabilidad y recuperacion

- `../_organizacion_sprites/inventario.csv`: cada ruta original, nueva ruta, huella SHA-256 y criterio de clasificacion. Incluye todos los origenes de los duplicados.
- `../_organizacion_sprites/duplicados_eliminados.csv`: las imagenes retiradas y la copia conservada.
- El respaldo ZIP del estado anterior fue eliminado por peticion del usuario.
- Se conservaron los 91 archivos TXT de creditos, aunque tengan contenido identico o esten vacios; el nombre del archivo tambien identifica al autor.
- Los archivos auxiliares de Windows se conservaron; solo se eliminaron imagenes duplicadas.
- La aplicacion actual usa sprites embebidos en sprites.js. No habia manifest.json dentro de sprites al iniciar.
- El respaldo ZIP ya no ocupa espacio en el proyecto.
