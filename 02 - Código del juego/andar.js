// Ajustes de andar de cada forma, revisados a ojo personaje a personaje (Josemi, 4 nov. 2026).
// Clave 'heroe/forma' (o 'heroe' para todas sus formas). Campos opcionales:
//   cadera: 0-1, altura de la cintura dentro del personaje (por defecto 0.6; también es donde gira el tronco al apuntar)
//   hueco: 0-1, columna entre los pies (por defecto se busca sola)
//   zancada: 0-1 de la altura (por defecto 0.1)   rodilla: px que sube el pie (por defecto 3)
//   base: ['Idle', 0], fotograma del que se genera el paso   modo: 'pasos' (por defecto) o 'flotar'
// Revisión: herramientas/_revisar/andar/<tanda>.png
window.ANDAR={
 // tanda 1: línea de Goku
 'goku/3':{cadera:0.7},        // SSJ3: el pelo largo cuelga hasta la cintura
 'goku/4':{cadera:0.66},       // Blue: la mano de atrás a la altura de la cintura
 'gokusuper/1':{cadera:0.66},  // Kaioken: puños en la cintura
 'gokugt/0':{cadera:0.68},     // Goku GT niño: piernas cortas
 'gokugt/1':{cadera:0.68},
 'gokugt/2':{cadera:0.7},      // SSJ3 GT: pelo largo y piernas cortas
 'gokugt/3':{cadera:0.66},     // SSJ4: la cola cuelga a la altura de la cadera
};
