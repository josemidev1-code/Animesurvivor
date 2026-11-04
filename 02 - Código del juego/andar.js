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
 // tanda 2: línea de Vegeta (la cintura se sube cuando la mano o la cola cuelgan a la altura de la cadera)
 'vegeta/1':{cadera:0.68},     // SSJ: manos en la cintura
 'vegeta/2':{cadera:0.7},      // SSJ2: mano colgando junto a la cadera
 'vegeta/3':{cadera:0.7},      // Super Vegeta: puño en la cintura
 'vegeta/4':{cadera:0.68},     // Blue: puño en la cintura
 'vegetaue/2':{cadera:0.66},
 'vegetagt/0':{cadera:0.66},   // GT: guantes a la altura de la cadera
 'vegetagt/1':{cadera:0.66},
 'vegetagt/2':{cadera:0.76},   // SSJ4: la cola cuelga a la altura de la cadera
 'vegetasuper/0':{cadera:0.7}, // guante colgando
 'vegetasuper/1':{cadera:0.7},
 'vegetasuper/2':{cadera:0.68},
 'vegetasuper/3':{cadera:0.68},
 'vegetto/1':{cadera:0.68},
 'vegetto/2':{cadera:0.68},
 'vegetto/3':{cadera:0.7},     // Blue: piernas juntas
 'vegetabroly/0':{cadera:0.66},
 'vegetamanga/0':{cadera:0.7}, // guardia agachada
 'vegetamanga/1':{cadera:0.66},
 'vegettofan/0':{cadera:0.68},
 'vegettofan/2':{cadera:0.74}, // SSJ4: cola
 'vegettofan/3':{cadera:0.68},
 // tanda 3: villanos (flotar = sin pasos, flota a ras de suelo)
 'a16/0':{cadera:0.7},
 'a17/0':{cadera:0.68},
 'a18/0':{cadera:0.66},
 'bills/0':{cadera:0.68},
 'black/0':{cadera:0.66},
 'black/1':{cadera:0.66},
 'black/2':{cadera:0.66},
 'broly/0':{cadera:0.7},
 'broly/1':{cadera:0.7},
 'broly/2':{cadera:0.7},
 'broly/3':{cadera:0.72},
 'buu/0':{cadera:0.8},         // Buu gordo: piernas cortas bajo la barriga
 'buu/1':{modo:'flotar'},      // Super Buu: la capa llega al suelo
 'buu/2':{cadera:0.66},
 'buu/3':{cadera:0.66},
 'cell/1':{cadera:0.66},
 'cell/2':{cadera:0.66},
 'cell/3':{cadera:0.68},
 'cell/4':{cadera:0.66},
 'cooler/0':{modo:'flotar'},
 'freezer/0':{modo:'flotar'},  // raza de Freezer: la cola llega al suelo y flotan, como en la serie
 'freezer/1':{modo:'flotar'},
 'freezer/2':{modo:'flotar'},
 'freezer/3':{cadera:0.66},
 'freezer/4':{modo:'flotar'},
 'freezer/5':{modo:'flotar'},
 'frost/0':{modo:'flotar'},
 'frost/1':{cadera:0.66},
 'ginyu/0':{cadera:0.68},
 'hit/0':{cadera:0.7},
 'janemba/0':{cadera:0.68},
 'jiren/1':{cadera:0.66},
 'moro/0':{cadera:0.66},
 'nappa/0':{cadera:0.68},
 'raditz/0':{cadera:0.72},     // pelo largo hasta la cadera
 'raditz/1':{cadera:0.72},
 'toppo/0':{cadera:0.72},      // manos a la altura de la cadera
 'turles/0':{cadera:0.66},
 'turles/1':{cadera:0.72},
 'zamasu/0':{cadera:0.7},
 'zamasu/1':{modo:'flotar'},   // Zamasu fusionado: flota
};
