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
 // tanda 4: resto de personajes y enemigos (184 formas). Casi todos con la mano a la altura de la cadera → cintura 0.66;
 // colas de saiyan, pelo largo, capas y túnicas más arriba; ángeles, demonios con alas, raza de Freezer y capas largas flotan
 'a13/0':{cadera:0.66}, 'a14/0':{cadera:0.66}, 'a21/0':{cadera:0.7}, 'babyvegeta/0':{cadera:0.66}, 'bardock/0':{cadera:0.66},
 'bardock/1':{cadera:0.66}, 'bardock/2':{cadera:0.72}, 'bardockalt/0':{cadera:0.66}, 'bardockalt/1':{cadera:0.66},
 'bardockalt/2':{cadera:0.66}, 'blackfalso/0':{cadera:0.66}, 'blackfan/1':{cadera:0.66}, 'blackfan/3':{cadera:0.66},
 'blackkaioshin/0':{cadera:0.7}, 'blackmajin/0':{cadera:0.66}, 'blackrose290/0':{cadera:0.66}, 'blackrosen/0':{cadera:0.66},
 'blacktime/0':{cadera:0.68}, 'blacktime/1':{cadera:0.66}, 'blacktime/2':{cadera:0.66}, 'bra/0':{cadera:0.66}, 'bramajin/0':{cadera:0.66},
 'brolyfan/0':{cadera:0.7}, 'brolyfan/1':{cadera:0.7}, 'bulma/0':{cadera:0.66}, 'caulifla/0':{cadera:0.66}, 'cui/0':{cadera:0.66},
 'cumber/0':{cadera:0.68}, 'daishinkan/0':{modo:'flotar'}, 'dlrx/0':{cadera:0.66}, 'dyspo/0':{cadera:0.66}, 'e_a19/0':{cadera:0.7},
 'e_appule/0':{cadera:0.66}, 'e_burter/0':{cadera:0.66}, 'e_dabura/0':{modo:'flotar'}, 'e_dodoria/0':{cadera:0.66},
 'e_drum/0':{cadera:0.66}, 'e_freeza2/0':{modo:'flotar'}, 'e_garlic/0':{modo:'flotar'}, 'e_gero/0':{cadera:0.66},
 'e_ginyu/0':{cadera:0.66}, 'e_kingveg/0':{cadera:0.72}, 'e_mecha/0':{modo:'flotar'}, 'e_murasaki/0':{cadera:0.66},
 'e_myuu/0':{cadera:0.66}, 'e_nam/0':{cadera:0.66}, 'e_ozaru/0':{cadera:0.7}, 'e_puipui/0':{cadera:0.66}, 'e_recoome/0':{cadera:0.66},
 'e_silver/0':{cadera:0.66}, 'e_soldado/0':{cadera:0.66}, 'e_tambourine/0':{modo:'flotar'}, 'e_whis/0':{modo:'flotar'},
 'e_zangya/0':{cadera:0.66}, 'e_zarbon/0':{cadera:0.68}, 'gas/0':{cadera:0.66}, 'glorio/0':{cadera:0.66}, 'gogeta/0':{cadera:0.66},
 'gogeta/1':{cadera:0.72}, 'gogeta/2':{cadera:0.66}, 'gogetafan/0':{cadera:0.68}, 'gogetafan/1':{cadera:0.66}, 'gogetafan/2':{cadera:0.66},
 'gohan/0':{cadera:0.66}, 'gohan/1':{cadera:0.66}, 'gohan/2':{cadera:0.66}, 'gohan/3':{cadera:0.66}, 'gohanadult/0':{cadera:0.66},
 'gohanadult/1':{cadera:0.66}, 'gohanadult/2':{cadera:0.66}, 'gohandbs/0':{cadera:0.66}, 'gohandbs/1':{cadera:0.66},
 'gohandbs/2':{cadera:0.66}, 'gohandbs/3':{cadera:0.66}, 'gohandbs/4':{cadera:0.66}, 'gohanfut/0':{cadera:0.66},
 'goku044/0':{cadera:0.66}, 'goku045/0':{cadera:0.66}, 'gokualt/0':{cadera:0.66}, 'gokualt/1':{cadera:0.66}, 'gokualt/2':{cadera:0.66},
 'gokubluedbfz/0':{cadera:0.66}, 'gokubluemoro/0':{cadera:0.66}, 'gokubluewhis/0':{cadera:0.66}, 'gokubroly/0':{cadera:0.66},
 'gokubroly/1':{cadera:0.66}, 'gokubroly/2':{cadera:0.66}, 'gokubroly/3':{cadera:0.66}, 'gokudiosberserk/0':{cadera:0.66},
 'gokuevilssj2/0':{cadera:0.66}, 'gokumoro/0':{cadera:0.66}, 'gokumoro/1':{cadera:0.66}, 'gokumoro/2':{cadera:0.66},
 'gokumoro/3':{cadera:0.66}, 'gokumoro/4':{cadera:0.66}, 'gokumuiblue/0':{cadera:0.68}, 'gokumuiblueevo/0':{cadera:0.66},
 'gokumuidios/0':{cadera:0.68}, 'gokumuifp/0':{cadera:0.66}, 'gokumuigranola/0':{cadera:0.66}, 'gokumuimanga/0':{cadera:0.66},
 'gokunino/0':{cadera:0.72}, 'gokupatrulla/0':{cadera:0.66}, 'gokureymono/0':{cadera:0.66}, 'gokussj053/0':{cadera:0.66},
 'gokussj2buu/0':{cadera:0.68}, 'gokussj3mais/0':{cadera:0.72}, 'gokussj3swl/0':{cadera:0.72}, 'gokussj4daima/0':{cadera:0.72},
 'gokussj4dios/0':{cadera:0.72}, 'gokussj4gt/0':{cadera:0.72}, 'gokussjfp/0':{cadera:0.66}, 'gokussjkaioken/0':{cadera:0.66},
 'gokussjkaioken2/0':{cadera:0.66}, 'gokussjlegend/0':{cadera:0.66}, 'gokussjsupremo/0':{cadera:0.66}, 'gokuui/0':{cadera:0.66},
 'gokuui/1':{cadera:0.66}, 'gokuui/2':{cadera:0.66}, 'gokuui/3':{cadera:0.66}, 'gokuui/4':{cadera:0.66}, 'gokuuimanga/0':{cadera:0.68},
 'gokuuisign/0':{cadera:0.66}, 'gokuultradios/0':{cadera:0.66}, 'gokuxeno/0':{cadera:0.66}, 'gokuxeno/1':{cadera:0.66},
 'gokuxeno/2':{cadera:0.72}, 'gokuyardrat/0':{cadera:0.66}, 'gokuyardratssj/0':{cadera:0.66}, 'gokuyardratswl/0':{cadera:0.66},
 'gomah/0':{modo:'flotar'}, 'goten/0':{cadera:0.66}, 'granola/0':{cadera:0.66}, 'guldo/0':{cadera:0.7}, 'hatchiyack/0':{cadera:0.66},
 'jirengray/0':{cadera:0.66}, 'kale/0':{cadera:0.66}, 'kale/1':{cadera:0.66}, 'kibito/0':{cadera:0.7}, 'kibitoshin/0':{cadera:0.7},
 'kyabe/0':{cadera:0.66}, 'kyabe/1':{cadera:0.66}, 'magetta/0':{cadera:0.7}, 'majinduu/0':{cadera:0.7}, 'majinkuu/0':{cadera:0.7},
 'merus/0':{modo:'flotar'}, 'metalcooler/0':{modo:'flotar'}, 'nuova/0':{modo:'flotar'}, 'omega/0':{cadera:0.66},
 'pangt/0':{cadera:0.66}, 'paragus/0':{cadera:0.7}, 'piccolo/0':{modo:'flotar'}, 'piccolo/1':{cadera:0.66}, 'reycold/0':{modo:'flotar'},
 'roshi/0':{cadera:0.66}, 'shin/0':{cadera:0.66}, 'slug/0':{cadera:0.68}, 'super17/0':{cadera:0.66}, 'taopaipai/0':{cadera:0.66},
 'tarble/0':{cadera:0.66}, 'trunks/2':{cadera:0.66}, 'trunksarmor/0':{cadera:0.66}, 'trunkscell/0':{cadera:0.66},
 'trunkscell/1':{cadera:0.66}, 'trunkscell/2':{cadera:0.7}, 'trunksgt/0':{cadera:0.66}, 'trunksnino/0':{cadera:0.66},
 'trunksnino/1':{cadera:0.66}, 'uub/0':{cadera:0.66}, 'vegetablueevo/0':{cadera:0.66}, 'vegetabluemal/0':{cadera:0.66},
 'vegetabluewhis/0':{cadera:0.66}, 'vegetamui/0':{cadera:0.66}, 'vegetassj4gt/0':{cadera:0.72}, 'vegetassjwhis/0':{cadera:0.66},
 'vegetauihd/0':{cadera:0.66}, 'vegetaxeno/0':{cadera:0.66}, 'vegetayardrat/0':{cadera:0.66}, 'vegettofalso/0':{cadera:0.66},
 'vegitoblue254/0':{cadera:0.66}, 'videl/0':{cadera:0.66}, 'zamasufusion/0':{modo:'flotar'}, 'zombies/0':{cadera:0.66},
 'zombies/1':{cadera:0.66}, 'zombies/2':{cadera:0.66},
};
