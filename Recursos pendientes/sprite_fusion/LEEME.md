# Ciclos de andar con Sprite Fusion

Para que los personajes anden con una animación dibujada de verdad (no generada por código).

1. Entra en https://www.spritefusion.com/ con tu cuenta y abre **AI Pixel Art Animator**. Antes de subir sprites de
   Dragon Ball, mira sus condiciones de uso.
2. Sube la imagen del personaje desde `entrada/` (una por forma: `goku_0.png` es Goku base, `goku_1.png` Goku SSJ…).
   Ya están limpias, sin fondo, mirando a la derecha y ampliadas x4.
3. Pide un ciclo de andar de lado, por ejemplo:
   `side view walk cycle facing right, 8 frames, keep exactly the same character, colors and pixel size, transparent background`
4. Descárgalo como **GIF** o como **tira PNG** (fotogramas en fila) y guárdalo en `salida/` **con el mismo nombre**
   (`goku_0.gif` o `goku_0.png`). Si es una tira sin huecos entre fotogramas, añade el número al final: `goku_0_8.png`.
5. Dile a Claude «importa los de Sprite Fusion». Ejecuta `python herramientas/importar_sprite_fusion.py`, que ajusta
   tamaño y pies al personaje del juego, y revisa el resultado a ojo antes de subirlo.

Consejo: prueba primero con uno o dos personajes y mira si respeta bien el sprite antes de hacer todos.
