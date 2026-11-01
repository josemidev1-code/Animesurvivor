# Pruebas rápidas

Todas las tareas: revisa los cambios concretos y ejecuta `node --check "02 - Código del juego/script.js"`. Si se cambia otro JavaScript, comprueba también su sintaxis. Comprueba que `index.html` carga los archivos en orden y funciona con doble clic; usar servidor local para depurar no sustituye esta última prueba.

- **Movimiento y colisiones:** juega con varios personajes, comprueba las cuatro direcciones, obstáculos, ataques y pausa. Si cambian sprites, revisa también sus poses visualmente.
- **Personajes y animaciones:** `node herramientas/comprobar_personajes.cjs`; consulta `herramientas/GUIA_ANIMACIONES.md` y revisa los sprites de la forma afectada en movimiento. Para formas nuevas usa los IDs como argumentos cuando corresponda.
- **Enemigos y mapas:** `node herramientas/comprobar_enemigos.cjs` y juega una partida del mapa afectado. La simulación no sustituye la prueba visual.
- **Objetos:** `node herramientas/comprobar_objetos.cjs` y comprueba recogida y efectos en partida.
- **Menús y HUD:** abre el juego, recorre las pantallas afectadas y comprueba botones, teclado y tamaños de ventana.
- **Herramientas de animación:** `python -m unittest discover -s herramientas/pruebas -t .`; revisar además los resultados visuales afectados.

Anota qué se probó y qué no. Si cambian archivos cargados desde `index.html`, actualiza sus versiones de caché cuando corresponda.
