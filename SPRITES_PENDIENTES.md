# Sprites pendientes

Última revisión de personajes: 31/10/2026 (Codex, sesión 7).
Última revisión de enemigos: 31/10/2026 (Codex, sesión 6).

El juego solo usa las formas de `herramientas/animaciones.json` y `herramientas/animaciones/*.json`, elegidas a mano
y revisadas con `revisar_todo.py`. Cómo meter una forma: ver `herramientas/GUIA_ANIMACIONES.md` y `herramientas/poner.py`.

## A) Sin sprites en `sprites/`

- Maestro Roshi; Dodoria, Zarbon, Nappa, A19, Dabura, Burter, Guldo, soldado Red Ribbon y bolita de Buu
  (Gemini los había puesto con sprites de otros personajes recoloreados; se quitaron).

### A.1) Enemigos retirados del juego por animaciones sin revisar (44 tipos)

No se borraron sus fuentes ni sus tiras antiguas. Se quitaron del catálogo activo, los mapas, los escuadrones y las
oleadas; Cell tampoco invoca Cell Jr. Los huecos de jefes los ocupan otros villanos con su nombre real y la misma
escala de dificultad por posición. Se usa Saibaman en los mapas que se quedaban sin enemigos iniciales.

| Personaje / grupo | IDs retirados |
|---|---|
| Soldados de Freezer | `soldier`, `soldierE`, `frzS2`, `frzS4` |
| Red Ribbon y esbirro de Babidi | `rrsoldier`, `majin` |
| Bolita de Buu y Cell Jr. | `blob`, `celljr`, `celljrE` |
| Nappa, Dodoria, Zarbon, A19, Dabura | `nappa`, `nappaE`, `dodoria`, `zarbon`, `a19`, `dabura` |
| Fuerzas especiales | `ginyu`, `jeice`, `burter`, `guldo` |
| Meca Freezer | `mecha` |
| Saiyans y Rey Vegeta | `renegA`, `renegB`, `renegC`, `saiyanLow`, `kingvegE` |
| Freezer segunda forma | `freeza2E`, `freeza2B` |
| Androide 21 | `a21E`, `a21B`, `a21mB` |
| Zamasu corrupto y Goku falso | `zamasuhE`, `fakegokuE` |
| Ozaru | `ozaruB`, `ozarugB` |
| Whis y Zeno | `whisB`, `zenoB` |
| Garlic Jr. y esbirros | `garlicE`, `garlicB`, `garlicH1`, `garlicH2` |
| Demonios | `demonS`, `demonS2`, `demonE` |
| Shenron oscuro | `shenronB` |

Revisadas visualmente 19 hojas de los siete packs mixtos (2.396 PNG). Hay poses aisladas de varios personajes de
esta tabla, pero no se encontraron secuencias completas que cumplan la guía. No confundir esas poses con un pack
completo. Zamasu corrupto sí tiene los packs 106/107: revisado el 106, la selección inicial no superó la revisión
de daño y carga/disparo y se descartó. Es el primer candidato para continuar la recuperación.

Recuperados con formas ya revisadas: Vegeta Saiyan/base, Majin Vegeta, Frost final, Black base/SSJ, Broly
contenido/SSJ/legendario, Kale SSJ y A17 jefe (13 IDs). Kale se llama **Kale Super Saiyan** porque ese es su pack.
No se han añadido personajes jugables en esta revisión.

## B) Packs de `sprites/` que aún no están en el juego (124)

Casi todos son **versiones alternativas** de personajes que ya son jugables (otro artista, otra ropa, formas fanmade:
Goku MUI, Black Rosé 3, Vegeta Mega Instinto...). Siguiente paso: añadirlos como formas o personajes nuevos
(p. ej. "GOKU XENO", "GOKU FANMADE", "BLACK FANMADE") eligiendo fotogramas con `ver_pack.py`.

### Goku (59)
- `00_Dragon_Ball_Z/01_Namek_y_Freezer/Goku/060_Goku Ssj (Saga Freeza)`
- `00_Dragon_Ball_Z/01_Namek_y_Freezer/Goku/128_GOKU GINYU, ANDRÉS GAMEN ANIMATIONS ✓ SPRITE HD`
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/Goku/281_GOKU YADRAT BASE`
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/Goku/282_GOKU YADRAT SSJ`
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/Goku/283_GOKU YADRAT SSJ SWL +`
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/056_Goku SSJ 3`
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/057_Goku SSJ 3 Mais Sprites`
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/277_GOKU SSJ3 SWL+`
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/278_GOKU SSJ3 ULSW DBZ`
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/001_(Goku Genkidama absorbida) Andrés`
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/061_Goku Ssj Falso`
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/145_GOKU SSJ FALSO,DBZ,BY ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/01_Resurreccion_de_Freezer_y_Whis/Goku/049_Goku Blue Whis Gi`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/051_Goku Instinto Superior`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/052_Goku Instinto Superior Completo`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/148_GOKU ULTRA INSTINTO FULL POWER,NEW VERSIÓN BY ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/152_GOKU,MUI,EXTRA ,ANDRES GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/153_GOKU,MUI,TORNEO DEL PODER (ANIME) ANDRES GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/270_GOKU MUI TDP MANGA`
- `01_Dragon_Ball_Super/05_Broly/Goku/217_GOKU, TRAJE DE INVIERNO,DBS BROLY ,ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/05_Broly/Goku/222_GOKU,SSJ BLUE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/06_Moro/Goku/144_GOKU SSJ BLUE SAGA,MORO,MANGA,(ANDRÉS GAMEN ANIMACIÓNS)`
- `01_Dragon_Ball_Super/06_Moro/Goku/174_Goku base.patrullero galáctico.dbs moro.andres Gamen`
- `01_Dragon_Ball_Super/07_Granola/Goku/132_GOKU MUI ( SAGA GRANOLA ) Andrés Gamen ANIMATIONS ( SPRITE HD )`
- `01_Dragon_Ball_Super/07_Granola/Goku/136_GOKU MUI SAGA GRANOLA,V2,BY ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/07_Granola/Goku/149_GOKU ULTRA INSTINTO VERDADERO,MANGA,BY ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/08_Super_Hero/Goku/205_GOKU SSJ 1,ROPA,ORANGE JACKET, ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/046_Goku Blue`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/047_Goku Blue 2`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/143_GOKU SSJ BLUE PERFECTO,MEJORADO , ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/271_GOKU SSJ BLUE DBFZ V3`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/280_GOKU UI SEÑAL DEL MANGA V1 SWL+ DBS MANGA`
- `02_GT/Goku/058_Goku SSJ 4`
- `03_Daima/Goku/140_GOKU SSJ 4 DB DAIMA(ANDRÉS GAMEN ANIMATIONS)👍`
- `03_Daima/Goku/279_GOKU SSJ4 ULSW DBZ DAIMA`
- `05_Fanmade_y_alternativos/Goku/059_Goku SSJ Kaioken`
- `05_Fanmade_y_alternativos/Goku/127_GOKU EVIL SSJ 2 , ANDRÉS GAMEN ANIMATIONS , SPRITE HD,`
- `05_Fanmade_y_alternativos/Goku/133_GOKU MUI BLUE EVOLUTION, ANDRÉS GAMEN ANIMATIONS ( SPRITE HD )`
- `05_Fanmade_y_alternativos/Goku/134_GOKU MUI BLUE, ANDRÉS GAMEN ANIMATIONS ✓ SPRITE HD`
- `05_Fanmade_y_alternativos/Goku/135_GOKU MUI DIOS, ANDRÉS GAMEN ANIMATIONS ( SPRITE HD )`
- `05_Fanmade_y_alternativos/Goku/137_GOKU MUI TRAJE WHISS BY ANDRÉS GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku/138_GOKU REY MONO,DB TALE, HECHO POR ANDRÉSITO GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku/139_GOKU SSJ 100, ANDRÉS GAMEN ANIMATIONS, SPRITE HD`
- `05_Fanmade_y_alternativos/Goku/142_GOKU SSJ BLUE 3 ( traje wis ) ANDRÉS GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku/146_GOKU SSJ PRIMARIO, ANDRÉS GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku/150_GOKU ULTRA SSJ DIOS, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/151_GOKU,SSJ, SUPREMO,DBS BROLY, ANDRÉS GAMEN ANIMATIONS, SPRITE HD ✓`
- `05_Fanmade_y_alternativos/Goku/179_Goku ultra ego`
- `05_Fanmade_y_alternativos/Goku/206_GOKU SSJ 4 DIOS,DBS BROLY, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/207_GOKU SSJ DIOS,BERSERKER,DBS BROLY, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/208_GOKU SSJ LEGENDARIO,DBS BROLY, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/272_GOKU SSJ BLUE UNIVERSAL ULSW`
- `05_Fanmade_y_alternativos/Goku/274_GOKU SSJ KAIO KEN`
- `05_Fanmade_y_alternativos/Goku/318_GOKU .EXE ,ANDRÉS GAMEN ANIMATIONS`
- `07_Personajes_sin_saga_concreta/Goku/044_Goku`
- `07_Personajes_sin_saga_concreta/Goku/045_Goku (versión2)`
- `07_Personajes_sin_saga_concreta/Goku/053_Goku SSJ 1`
- `07_Personajes_sin_saga_concreta/Goku/054_Goku SSJ 1(versión 2)`
- `07_Personajes_sin_saga_concreta/Goku/273_GOKU SSJ FULL POWER SWL+`

### Vegeta (30)
- `00_Dragon_Ball_Z/00_Saiyans/Vegeta/309_Vegeta explorador HD`
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/Vegeta/312_vegeta yardrat`
- `00_Dragon_Ball_Z/03_Majin_Buu/Vegeta/298_Vegeta SSJ2 HD`
- `01_Dragon_Ball_Super/00_Dioses_y_Super_Saiyan_God/Vegeta/098_Vegeta Ssj God`
- `01_Dragon_Ball_Super/01_Resurreccion_de_Freezer_y_Whis/Vegeta/314_Vegeta blue`
- `01_Dragon_Ball_Super/01_Resurreccion_de_Freezer_y_Whis/Vegeta/315_Vegeta ssj`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Vegeta/093_Vegeta Blue Full Power`
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Vegeta/299_Vegeta blue evolution`
- `01_Dragon_Ball_Super/05_Broly/Vegeta/225_VEGETA,BASE,DBS, BROLY,DAMAGED, ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/05_Broly/Vegeta/304_Vegeta com capote HD`
- `01_Dragon_Ball_Super/06_Moro/Vegeta/250_Vegeta ssj Dios patrullero galáctico.Andres Gamen`
- `01_Dragon_Ball_Super/07_Granola/Vegeta/240_VEGETA MEGA INSTITO, ANDRÉS GAMEN ANIMATIONS`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Vegeta/092_Vegeta Blue`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Vegeta/296_Vegeta Blue Ulsw Hd`
- `02_GT/Vegeta/264_VEGETA SSJ4 GT`
- `02_GT/Vegeta/308_VEGETA SSJ4 HD`
- `03_Daima/Vegeta/238_VEGETA ADULTO SSJ3 (DAIMA) ANDRÉS GAMEN ANIMATION`
- `04_Heroes_y_videojuegos/Vegeta/267_VEGETA BASE XENO ULSW`
- `04_Heroes_y_videojuegos/Vegeta/311_vegeta xeno ssj4`
- `05_Fanmade_y_alternativos/Vegeta/197_Majin Vegeta ssj blue evolution, Damaged, Andrés Gamen`
- `05_Fanmade_y_alternativos/Vegeta/198_Vegeta ssj Blue1,Ultra ssjb, Damaged, Andrés Gamen`
- `05_Fanmade_y_alternativos/Vegeta/241_VEGETA SSJ BLUE MALIGNO,DBH, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Vegeta/249_Vegeta Omni God,Damaged.Andres Gamen`
- `05_Fanmade_y_alternativos/Vegeta/302_Vegeta UI HD`
- `05_Fanmade_y_alternativos/Vegeta/303_vegeta mui`
- `05_Fanmade_y_alternativos/Vegeta/310_vegeta ssj3 Blu`
- `07_Personajes_sin_saga_concreta/Vegeta/091_Vegeta`
- `07_Personajes_sin_saga_concreta/Vegeta/295_Vegeta Base Ulsw HD`
- `07_Personajes_sin_saga_concreta/Vegeta/297_Vegeta SSJ1`
- `07_Personajes_sin_saga_concreta/Vegeta/301_Vegeta Sem Camisa HD`

### Goku Black (16)
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/039_Goku Black`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/178_Goku black traje kaioshin.Andres Gamen`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/255_Black Goku Pack de sprites By GohanAnimations`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/268_GOKU BLACK (ZAMASU) ULSW`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/269_GOKU BLACK PITIKOS`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/290_Mega Pack de Sprites Goku Black Ssj Rose`
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku Black/042_Goku Black SSJ`
- `05_Fanmade_y_alternativos/Goku Black/005_BLACKKU SSJ ROSE,BLUE, EVOLUTION,BY ANDRÉS GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku Black/175_Goku black Ultra instito dominado.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/176_Goku black ssj Rosen evolution.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/177_Goku black ssj falso.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/183_Majin Goku black Ultra instito.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/184_Majin Goku black ssj Díos.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/185_Majin Goku black ssj Rosen.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/186_Majin Goku black ssj blue.Andres Gamen`
- `05_Fanmade_y_alternativos/Goku Black/187_Majin Goku black ssj1.Andres Gamen`

### Gohan (1)
- `05_Fanmade_y_alternativos/Gohan/195_Gohan del futuro,ssj3, Andrés Gamen`

### Vegetto (2)
- `04_Heroes_y_videojuegos/Vegetto/294_veggeto xeno.ssj2.ssj3.ssj5.mini pack.andres Gamen`
- `05_Fanmade_y_alternativos/Vegetto/247_VEGETTO SSJ FALSO, ANDRÉS GAMEN ANIMATIONS ✓`

### Bardock (1)
- `01_Dragon_Ball_Super/09_Generales_y_manga/Bardock/224_BARDOCK,BASE,DBS`

### Broly (3)
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Broly/008_Broly ssj restringido,remake, Andrés Gamen`
- `05_Fanmade_y_alternativos/Broly/007_BROLY SSJ DIOS,DBZ,BY ANDRÉS GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Broly/194_Broly ssj legendario, perfecto, Andrés Gamen`

### Trunks (2)
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/Trunks/088_Trunks Armadura`
- `07_Personajes_sin_saga_concreta/Trunks/288_TRUNKS DEL FUTURO`

### Gogeta (1)
- `05_Fanmade_y_alternativos/Gogeta/155_Gogeta black.Andres Gamen`

### Zamasu (2)
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/106_Zamasu e Black Fusão Desmanchando`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/108_Zamasu e Black fusion Robotica`

### Varios (2)
- `05_Fanmade_y_alternativos/Varios/316_ANDRÉS GAMEN ANIMATIONS(.EXE) 🎃 SPRITE HD 🎃`
- `05_Fanmade_y_alternativos/Varios/317_EXTRA PACK DE SPRITES DE HELLOWEEN BY ANDRÉS GAMEN ANIMATIONS 🎃`

### Majin Buu (1)
- `00_Dragon_Ball_Z/03_Majin_Buu/Majin Buu/276_GOKU SSJ2 SAGA BUU SWL+`

### Hit (1)
- `01_Dragon_Ball_Super/02_Universo_6/Hit/067_Hitto 2`

### Jiren (1)
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Jiren/069_Jiren`

### Piccolo (1)
- `01_Dragon_Ball_Super/08_Super_Hero/Piccolo/227_PICCOLO ORANGE (FORMA GIGANTE)`


### Bra (1)
- `05_Fanmade_y_alternativos/Bra/189_Majin bra,sprite(db multiverse) Andrés`

## C) Packs revisados pero incompletos

- Goku 217 (traje de invierno): sin combos, patadas, ki ni daño; no se integra como forma completa.
- Goku 222 (Blue de Broly): no se encontró patada completa; usar el pack 221 para la forma Blue perfecto.

- Vegeta 225 (base dañado de Broly): sin secuencia diferenciada de carga de poder; selección pendiente.
- Vegeta 304 (abrigo): no tiene todas las acciones de combate y daño.
- Vegeta 250 (Dios patrullero): solo se identificó un fotograma de daño; descartada la selección que repetía ese fotograma.
- Majin Black 183–187: no se localizaron todas las secuencias de patada y daño exigidas; no se integran aún.

- Goku 139 (SSJ 100): mini-pack de 28 imágenes con cabello que tapa casi todo el cuerpo; no se encontró una selección legible y completa de combate/daño. Se mantiene pendiente.
