# Auditoría de animaciones (2026-11-06)

Generada con `python herramientas/auditar_animaciones.py`. Compara `sprites/` con las selecciones montadas en el juego. Un fotograma sin usar puede ser un efecto o un duplicado: la cifra indica material sin aprovechar, no ataques exactos.

## Resumen

- Carpetas con imágenes: **405** (37468 imágenes). En el juego: **302**. Sin usar: **103**.
- De las 103 sin usar, 10 son escenarios, referencias o Shenron; quedan **93** con personajes (6655 imágenes).
- En los packs usados hay 30590 imágenes y el juego usa **5926** (19 %).
- Formas de personajes jugables: 273. Con los 5 ataques extra completos: **80**. Sin ninguno: **113**.
- Formas solo de enemigo u otras: 40.

Ataques extra contados: `attack2`, `attack3`, `kick2`, `beam` y `up`. `dash` no cuenta porque reutiliza el cuerpo del vuelo.

## Personajes jugables, de menos a más completos

| Personaje | Formas | Fotogramas en sus packs | Usados | Ataques extra que faltan |
|---|---:|---:|---:|---:|
| blackfan | 4 | 522 | 74 | 20 |
| gokumoro | 5 | 445 | 80 | 19 |
| blacktime | 3 | 514 | 55 | 15 |
| trunkscell | 3 | 177 | 48 | 15 |
| vegetagt | 3 | 236 | 55 | 15 |
| gokuui | 5 | 357 | 107 | 11 |
| gohanadult | 3 | 341 | 60 | 10 |
| gokubroly | 4 | 286 | 86 | 10 |
| kale | 2 | 100 | 31 | 10 |
| kefla | 2 | 253 | 35 | 10 |
| kyabe | 2 | 162 | 30 | 10 |
| trunksnino | 2 | 346 | 29 | 10 |
| vegetamanga | 2 | 250 | 36 | 10 |
| gokualt | 3 | 302 | 67 | 7 |
| gokusuper | 5 | 371 | 118 | 7 |
| a13 | 1 | 142 | 14 | 5 |
| a14 | 1 | 57 | 14 | 5 |
| blackfalso | 1 | 41 | 16 | 5 |
| blackkaioshin | 1 | 45 | 14 | 5 |
| blackmajin | 1 | 37 | 14 | 5 |
| blackrose290 | 1 | 300 | 15 | 5 |
| blackrosen | 1 | 48 | 14 | 5 |
| bramajin | 1 | 315 | 15 | 5 |
| bulma | 1 | 16 | 12 | 5 |
| caulifla | 1 | 103 | 16 | 5 |
| cui | 1 | 46 | 15 | 5 |
| daishinkan | 1 | 86 | 15 | 5 |
| dyspo | 1 | 128 | 18 | 5 |
| gas | 1 | 44 | 15 | 5 |
| glorio | 1 | 90 | 16 | 5 |
| gohanfut | 1 | 123 | 17 | 5 |
| gohanmanga | 1 | 87 | 16 | 5 |
| gohanposeido | 1 | 68 | 16 | 5 |
| goku045 | 1 | 133 | 15 | 5 |
| gokubluedbfz | 1 | 682 | 15 | 5 |
| gokubluemoro | 1 | 173 | 15 | 5 |
| gokuevilssj2 | 1 | 119 | 15 | 5 |
| gokumuiblue | 1 | 113 | 12 | 5 |
| gokumuiblueevo | 1 | 149 | 15 | 5 |
| gokumuidios | 1 | 173 | 14 | 5 |
| gokumuifp | 1 | 151 | 15 | 5 |
| gokumuimanga | 1 | 273 | 15 | 5 |
| gokunino | 1 | 133 | 15 | 5 |
| gokureymono | 1 | 114 | 15 | 5 |
| gokussj2buu | 1 | 641 | 14 | 5 |
| gokussj4daima | 1 | 281 | 14 | 5 |
| gokussjfp | 1 | 174 | 15 | 5 |
| gokussjkaioken2 | 1 | 139 | 14 | 5 |
| gokussjlegend | 1 | 147 | 15 | 5 |
| gokussjsupremo | 1 | 123 | 15 | 5 |
| gokuuimanga | 1 | 270 | 14 | 5 |
| gokuuiverdadero | 1 | 140 | 15 | 5 |
| gomah | 1 | 38 | 18 | 5 |
| gotenks | 1 | 108 | 17 | 5 |
| granola | 1 | 137 | 15 | 5 |
| hatchiyack | 1 | 56 | 15 | 5 |
| jirengray | 1 | 73 | 15 | 5 |
| kibito | 1 | 85 | 16 | 5 |
| kibitoshin | 1 | 22 | 15 | 5 |
| magetta | 1 | 84 | 14 | 5 |
| majinduu | 1 | 79 | 15 | 5 |
| majinkuu | 1 | 50 | 14 | 5 |
| merus | 1 | 48 | 15 | 5 |
| metalcooler | 1 | 56 | 14 | 5 |
| nuova | 1 | 14 | 13 | 5 |
| omega | 1 | 56 | 14 | 5 |
| pangt | 1 | 99 | 15 | 5 |
| paragus | 1 | 99 | 15 | 5 |
| reycold | 1 | 59 | 15 | 5 |
| roshi | 1 | 82 | 14 | 5 |
| shin | 1 | 51 | 15 | 5 |
| slug | 1 | 46 | 15 | 5 |
| super17 | 1 | 51 | 15 | 5 |
| taopaipai | 1 | 78 | 14 | 5 |
| tarble | 1 | 31 | 15 | 5 |
| tenshinhan | 1 | 77 | 15 | 5 |
| trunksarmor | 1 | 74 | 14 | 5 |
| trunksgt | 1 | 39 | 14 | 5 |
| vegetabaseulsw | 1 | 121 | 14 | 5 |
| vegetablue092 | 1 | 107 | 16 | 5 |
| vegetablueevo | 1 | 159 | 15 | 5 |
| vegetabluefp | 1 | 99 | 15 | 5 |
| vegetabluemal | 1 | 89 | 14 | 5 |
| vegetablueulsw | 1 | 124 | 15 | 5 |
| vegetabluewhis | 1 | 114 | 15 | 5 |
| vegetabroly | 1 | 101 | 18 | 5 |
| vegetaego | 1 | 84 | 15 | 5 |
| vegetamui | 1 | 115 | 15 | 5 |
| vegetassj4gt | 1 | 116 | 15 | 5 |
| vegetassjhd | 1 | 115 | 15 | 5 |
| vegetassjwhis | 1 | 108 | 15 | 5 |
| vegetauihd | 1 | 111 | 15 | 5 |
| vegetaxeno | 1 | 185 | 15 | 5 |
| vegetayardrat | 1 | 90 | 14 | 5 |
| vegettofalso | 1 | 124 | 15 | 5 |
| vegitoblue254 | 1 | 546 | 14 | 5 |
| videl | 1 | 83 | 15 | 5 |
| zamasufusion | 1 | 136 | 12 | 5 |
| freezer | 6 | 443 | 127 | 4 |
| broly | 4 | 234 | 82 | 3 |
| buu | 5 | 379 | 106 | 3 |
| cell | 5 | 461 | 107 | 3 |
| gogeta | 3 | 565 | 65 | 3 |
| goku | 5 | 393 | 117 | 3 |
| gokudiosberserk | 1 | 46 | 16 | 3 |
| gokugt | 4 | 422 | 106 | 3 |
| jiren | 3 | 295 | 62 | 3 |
| moro | 1 | 52 | 20 | 3 |
| vegetaue | 4 | 406 | 107 | 3 |
| a17 | 1 | 41 | 21 | 2 |
| bardock | 3 | 271 | 70 | 2 |
| black | 3 | 359 | 68 | 2 |
| cumber | 1 | 26 | 15 | 2 |
| gokumuigranola | 1 | 91 | 20 | 2 |
| gokupatrulla | 1 | 53 | 21 | 2 |
| gokussj3swl | 1 | 238 | 22 | 2 |
| gokuyardratswl | 1 | 169 | 20 | 2 |
| piccolo | 2 | 179 | 46 | 2 |
| raditz | 2 | 92 | 48 | 2 |
| vegeta | 5 | 421 | 130 | 2 |
| vegetto | 4 | 446 | 97 | 2 |
| a16 | 1 | 64 | 24 | 1 |
| a18 | 1 | 47 | 21 | 1 |
| bra | 2 | 217 | 50 | 1 |
| dlrx | 1 | 86 | 25 | 1 |
| gohan | 4 | 278 | 96 | 1 |
| gokussj053 | 1 | 55 | 21 | 1 |
| gokussj3mais | 1 | 74 | 22 | 1 |
| gokussj4dios | 1 | 102 | 24 | 1 |
| gokussj4gt | 1 | 63 | 22 | 1 |
| gokussjchaqueta | 1 | 76 | 23 | 1 |
| gokussjkaioken | 1 | 76 | 22 | 1 |
| gokuultradios | 1 | 55 | 21 | 1 |
| gokuxeno | 3 | 355 | 70 | 1 |
| gokuyardrat | 1 | 113 | 23 | 1 |
| gokuyardratssj | 1 | 96 | 23 | 1 |
| hit | 1 | 98 | 26 | 1 |
| janemba | 1 | 72 | 25 | 1 |
| nappa | 1 | 104 | 27 | 1 |
| saibaman | 1 | 46 | 22 | 1 |
| trunks | 3 | 312 | 72 | 1 |
| zamasu | 2 | 168 | 51 | 1 |
| a21 | 1 | 195 | 29 | 0 |
| babyvegeta | 1 | 57 | 22 | 0 |
| bardockalt | 4 | 329 | 97 | 0 |
| bills | 1 | 78 | 27 | 0 |
| brolyfan | 2 | 241 | 50 | 0 |
| cooler | 1 | 81 | 27 | 0 |
| frost | 2 | 106 | 48 | 0 |
| ginyu | 1 | 111 | 26 | 0 |
| gogetafan | 3 | 573 | 79 | 0 |
| gohandbs | 5 | 603 | 128 | 0 |
| goku044 | 1 | 71 | 23 | 0 |
| gokubluewhis | 1 | 70 | 21 | 0 |
| gokuuisign | 1 | 114 | 23 | 0 |
| goten | 1 | 89 | 20 | 0 |
| guldo | 1 | 103 | 28 | 0 |
| jeice | 1 | 79 | 26 | 0 |
| krilin | 1 | 81 | 20 | 0 |
| mrsatan | 1 | 371 | 31 | 0 |
| toppo | 1 | 77 | 27 | 0 |
| turles | 2 | 166 | 51 | 0 |
| uub | 1 | 93 | 28 | 0 |
| vegetasuper | 5 | 459 | 133 | 0 |
| vegettofan | 4 | 691 | 98 | 0 |
| yamcha | 1 | 79 | 22 | 0 |
| zombies | 3 | 396 | 74 | 0 |

## Packs de personajes sin usar

| Imágenes | Pack |
|---:|---|
| 1 | `00_Dragon_Ball_Z/00_Saiyans/DeviantArt` |
| 4 | `00_Dragon_Ball_Z/01_Namek_y_Freezer/DeviantArt` |
| 72 | `00_Dragon_Ball_Z/01_Namek_y_Freezer/DeviantArt/421_FREEZER FORMAS (qsab101)` |
| 80 | `00_Dragon_Ball_Z/01_Namek_y_Freezer/Goku/060_Goku Ssj (Saga Freeza)` |
| 1 | `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/DeviantArt` |
| 41 | `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/DeviantArt/407_ANDROIDE 19 (ChrisReinerVV)` |
| 2 | `00_Dragon_Ball_Z/03_Majin_Buu/DeviantArt` |
| 55 | `00_Dragon_Ball_Z/03_Majin_Buu/Goku/056_Goku SSJ 3` |
| 130 | `00_Dragon_Ball_Z/03_Majin_Buu/Goku/278_GOKU SSJ3 ULSW DBZ` |
| 17 | `00_Dragon_Ball_Z/03_Majin_Buu/Vegeta/300_Vegeta ssj3` |
| 30 | `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Broly/008_Broly ssj restringido,remake, Andrés Gamen` |
| 21 | `00_Dragon_Ball_Z/04_Peliculas_y_especiales/DeviantArt/447_BUJIN (Morai)` |
| 181 | `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/001_(Goku Genkidama absorbida) Andrés` |
| 106 | `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/061_Goku Ssj Falso` |
| 90 | `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/145_GOKU SSJ FALSO,DBZ,BY ANDRÉS GAMEN ANIMATIONS` |
| 54 | `01_Dragon_Ball_Super/00_Dioses_y_Super_Saiyan_God/Vegeta/098_Vegeta Ssj God` |
| 86 | `01_Dragon_Ball_Super/02_Universo_6/Hit/067_Hitto 2` |
| 95 | `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/039_Goku Black` |
| 94 | `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/268_GOKU BLACK (ZAMASU) ULSW` |
| 50 | `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/269_GOKU BLACK PITIKOS` |
| 10 | `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/107_Zamasu e Black Fusão Desmanchando - Damage` |
| 143 | `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/108_Zamasu e Black fusion Robotica` |
| 59 | `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/052_Goku Instinto Superior Completo` |
| 24 | `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/152_GOKU,MUI,EXTRA ,ANDRES GAMEN ANIMATIONS` |
| 24 | `01_Dragon_Ball_Super/05_Broly/Goku/217_GOKU, TRAJE DE INVIERNO,DBS BROLY ,ANDRÉS GAMEN ANIMATIONS` |
| 56 | `01_Dragon_Ball_Super/05_Broly/Goku/222_GOKU,SSJ BLUE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS` |
| 21 | `01_Dragon_Ball_Super/05_Broly/Vegeta/225_VEGETA,BASE,DBS, BROLY,DAMAGED, ANDRÉS GAMEN ANIMATIONS` |
| 26 | `01_Dragon_Ball_Super/05_Broly/Vegeta/304_Vegeta com capote HD` |
| 85 | `01_Dragon_Ball_Super/06_Moro/Vegeta/250_Vegeta ssj Dios patrullero galáctico.Andres Gamen` |
| 81 | `01_Dragon_Ball_Super/08_Super_Hero/Piccolo/227_PICCOLO ORANGE (FORMA GIGANTE)` |
| 10 | `01_Dragon_Ball_Super/08_Super_Hero/Piccolo/228_PICCOLO ORANGE DAMAGED` |
| 53 | `01_Dragon_Ball_Super/09_Generales_y_manga/Bardock/224_BARDOCK,BASE,DBS` |
| 14 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/110_GOHAN SSJ 1 DBS ANDRÉS GAMEN ANIMATIONS` |
| 12 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/111_GOHAN SSJ 2 DBS ANDRÉS GAMEN ANIMATIONS` |
| 1 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/157_Gohan (Manga)` |
| 17 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/158_Gohan (Manga) - Ataque` |
| 3 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/159_Gohan (Manga) - Daño` |
| 7 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/160_Extra - Cabeza` |
| 4 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/161_Extra - Ki` |
| 11 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/162_Aros de Ki` |
| 3 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/163_Escudo de Ki` |
| 5 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/164_Kamehameha` |
| 7 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/165_Efectos Kamehameha` |
| 8 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/166_Masenko` |
| 7 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/167_Efectos Masenko` |
| 4 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/168_Gohan (Manga) - Ki` |
| 3 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/169_Ki - si ki` |
| 3 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/170_Gohan (Manga) - Pose` |
| 2 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/171_Gohan (Manga) - Volador` |
| 2 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/172_Volador - Dash` |
| 4 | `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/173_Volador - Dash 2` |
| 115 | `01_Dragon_Ball_Super/09_Generales_y_manga/Goku Black/042_Goku Black SSJ` |
| 124 | `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/046_Goku Blue` |
| 120 | `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/047_Goku Blue 2` |
| 121 | `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/143_GOKU SSJ BLUE PERFECTO,MEJORADO , ANDRÉS GAMEN ANIMATIONS` |
| 65 | `02_GT/Vegeta/308_VEGETA SSJ4 HD` |
| 433 | `03_Daima/Goku/279_GOKU SSJ4 ULSW DBZ DAIMA` |
| 1 | `04_Heroes_y_videojuegos/DeviantArt` |
| 46 | `04_Heroes_y_videojuegos/Vegetto/294_veggeto xeno.ssj2.ssj3.ssj5.mini pack.andres Gamen` |
| 32 | `05_Fanmade_y_alternativos/Broly/007_BROLY SSJ DIOS,DBZ,BY ANDRÉS GAMEN ANIMATIONS` |
| 27 | `05_Fanmade_y_alternativos/Broly/194_Broly ssj legendario, perfecto, Andrés Gamen` |
| 52 | `05_Fanmade_y_alternativos/Gogeta/155_Gogeta black.Andres Gamen` |
| 25 | `05_Fanmade_y_alternativos/Gohan/195_Gohan del futuro,ssj3, Andrés Gamen` |
| 42 | `05_Fanmade_y_alternativos/Goku Black/005_BLACKKU SSJ ROSE,BLUE, EVOLUTION,BY ANDRÉS GAMEN ANIMATIONS` |
| 54 | `05_Fanmade_y_alternativos/Goku Black/175_Goku black Ultra instito dominado.Andres Gamen` |
| 49 | `05_Fanmade_y_alternativos/Goku Black/183_Majin Goku black Ultra instito.Andres Gamen` |
| 53 | `05_Fanmade_y_alternativos/Goku Black/185_Majin Goku black ssj Rosen.Andres Gamen` |
| 41 | `05_Fanmade_y_alternativos/Goku Black/186_Majin Goku black ssj blue.Andres Gamen` |
| 58 | `05_Fanmade_y_alternativos/Goku Black/187_Majin Goku black ssj1.Andres Gamen` |
| 58 | `05_Fanmade_y_alternativos/Goku/137_GOKU MUI TRAJE WHISS BY ANDRÉS GAMEN ANIMATIONS` |
| 28 | `05_Fanmade_y_alternativos/Goku/139_GOKU SSJ 100, ANDRÉS GAMEN ANIMATIONS, SPRITE HD` |
| 62 | `05_Fanmade_y_alternativos/Goku/142_GOKU SSJ BLUE 3 ( traje wis ) ANDRÉS GAMEN ANIMATIONS` |
| 48 | `05_Fanmade_y_alternativos/Goku/146_GOKU SSJ PRIMARIO, ANDRÉS GAMEN ANIMATIONS` |
| 229 | `05_Fanmade_y_alternativos/Goku/179_Goku ultra ego` |
| 464 | `05_Fanmade_y_alternativos/Goku/272_GOKU SSJ BLUE UNIVERSAL ULSW` |
| 35 | `05_Fanmade_y_alternativos/Goku/318_GOKU .EXE ,ANDRÉS GAMEN ANIMATIONS` |
| 55 | `05_Fanmade_y_alternativos/Varios/316_ANDRÉS GAMEN ANIMATIONS(.EXE) 🎃 SPRITE HD 🎃` |
| 58 | `05_Fanmade_y_alternativos/Varios/317_EXTRA PACK DE SPRITES DE HELLOWEEN BY ANDRÉS GAMEN ANIMATIONS 🎃` |
| 39 | `05_Fanmade_y_alternativos/Vegeta/197_Majin Vegeta ssj blue evolution, Damaged, Andrés Gamen` |
| 31 | `05_Fanmade_y_alternativos/Vegeta/198_Vegeta ssj Blue1,Ultra ssjb, Damaged, Andrés Gamen` |
| 50 | `05_Fanmade_y_alternativos/Vegeta/249_Vegeta Omni God,Damaged.Andres Gamen` |
| 60 | `05_Fanmade_y_alternativos/Vegeta/310_vegeta ssj3 Blu` |
| 112 | `07_Personajes_sin_saga_concreta/Goku/054_Goku SSJ 1(versión 2)` |
| 15 | `07_Personajes_sin_saga_concreta/Goku/287_GOKU` |
| 22 | `07_Personajes_sin_saga_concreta/Trunks/288_TRUNKS DEL FUTURO` |
| 55 | `07_Personajes_sin_saga_concreta/Vegeta/091_Vegeta` |
| 14 | `07_Personajes_sin_saga_concreta/Vegeta/289_VEGETA` |
| 212 | `09_Packs_mixtos_por_revisar/Varios/109_EXTRA PACK DE SPRITES #3 ESPECIAL 5K ANDRÉS GAMEN ANIMATIONS` |
| 260 | `09_Packs_mixtos_por_revisar/Varios/116_EXTRA PACK DE SPRITES PARTE 2 , BY ANDRÉS GAMEN ANIMATIONS ✓` |
| 39 | `09_Packs_mixtos_por_revisar/Varios/203_MINI EXTRA PACK DE SPRITES, ANDRÉS GAMEN ANIMATIONS` |
| 359 | `09_Packs_mixtos_por_revisar/Varios/229_SUPER EXTRA PACK DE SPRITES #2 (POR LOS 33KSUBS) DE ANDRÉS GAMEN ANIMATIONS 👍` |
| 273 | `09_Packs_mixtos_por_revisar/Varios/230_SUPER EXTRA PACK DE SPRITES (ESPECIAL DE 24K DE SUBS) ANDRÉS GAMEN ANIMATIONS` |
| 700 | `09_Packs_mixtos_por_revisar/Varios/291_SUPER EXTRA PACK DE SPRITES #3 (ESPECIAL 38K) ANDRÉS GAMEN ANIMATIONS 👍` |
