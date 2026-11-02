# Personajes por meter (petición «todos los personajes», 2 nov. 2026)

Decisión de Josemi: **cada pack completo es un personaje jugable propio**; los incompletos se quedan fuera.
Completo = guardia, vuelo, puñetazos, patada, ki, aura (o pose de carga) y daño. Muerte y cara no son obligatorias (sin cara no se pone ninguna).

## Cómo meter uno

1. `python herramientas/ver_pack.py "<pack>"` y mirar `herramientas/_revisar/pack_<nombre>.png`. La propuesta de `herramientas/propuestas/` sirve de pista, pero falla mucho (auras como ki, ataques como daño, caras como puñetazos): **elegir a mano**.
2. Añadir el personaje a `herramientas/animaciones/todos.json` (id nuevo, forma "0") con idle, move, attack, kick, ki, pow, hurt y faint.
3. `python herramientas/montar_animaciones.py <id>` y `python herramientas/previsualizar.py <id> 0`; mirar el PNG y corregir hasta que cumpla `GUIA_ANIMACIONES.md`.
4. Darlo de alta en `script.js`: entrada en `NUEVOS` (bajo «todos los personajes») y en `SIGS_SERIE`, con técnicas de la serie que ya existan en `MV`.
5. Subir `animaciones_juego.js?v=` y `script.js?v=` en `index.html`, pasar `node herramientas/comprobar_*.cjs` y probar una partida.

## Hechos

- Tanda 1: Nappa, Capitán Ginyu, Jeice, Guldo, Uub, Mr. Satán, Androide 21 (de la rama `claude/quizzical-gates-9cf9c0`).
- Tanda 2: Jiren (Torneo, pack 069), Vegetto SSJ falso (247), Trunks con armadura (088).
- Tanda 3: Goku Black Kaioshin (178), Black SSJ falso (177), Black Rosé Evolution (176), Majin Black Dios (184). Atajo nuevo: `herramientas/meter.py` (ver, poner, alta, quitar).
- Tanda 4: Goku Yardrat (281), Goku Yardrat SSJ (282), Goku Yardrat SSJ SWL (283), Vegeta Yardrat (312). Ojo: en el 312 los fotogramas vienen a tamaños distintos; elegir los que midan parecido.
- Tanda 5: Goku SSJ4 GT (058), Vegeta SSJ4 GT (264).
- Tanda 6: Vegeta SSJ (Whis, 315), Vegeta Blue (Whis, 314), Vegeta Blue (Super, 092).
- Tanda 7: Vegeta Blue HD (296), Vegeta Blue Full Power (093), Vegeta Blue Evolution (299), Vegeta base HD (295). Ojo: en el 296 el fotograma 47 no mide su zoom; se fija con `escalaFrames`.
- Tanda 8: Vegeta Ultra Ego (240), Vegeta Xeno (267), Vegeta SSJ HD (297), Vegeta Ultra Instinto HD (302). En el 297 el fotograma 33 se fija con `escalaFrames`.
- Tanda 9: Vegeta Blue Maligno (241), Goku SSJ3 clásico (057), Goku SSJ3 HD (277).
- Tanda 10: Goku Blue con gi (049), Goku UI señal (051), Goku UI dominado (148).
- Tanda 11: Goku patrullero (174), Goku SSJ chaqueta (205), Goku UI Granola (132; sin aura ni muerte: usa pose de carga).
- Tanda 12: Goku UI verdadero (149), Goku Blue Moro manga (144), Goku Blue FighterZ (271; pack de 682 fotogramas, revisado por tramos). En 149 y 144 el aura se fija con `escalaFrames`.
- Tanda 13: Goku UI dominado manga (270), Goku UI señal manga (280; la patada es un rodillazo, no hay otra), Goku SSJ2 Buu (276; sin muerte propia, la del pack es en base).

## A medias

- Goku SSJ4 Daima (140): 281 fotogramas, la hoja numerada no se lee; ampliar por tramos con `ver_pack.py "<pack>" 4 <índices>` y elegir a mano.

- Bra Majin (189): la propuesta mezcla caras y otros personajes; hay que elegir todos los fotogramas a mano (pack de casi 300).
- Fusión de Zamasu deshaciéndose (106): pocos golpes; comprobar si de verdad está completo.
- Vegeta MUI (303): el pack viene reescalado y borroso; cada fotograma a otra escala y no se puede medir el píxel. Haría falta fijar la escala a mano fotograma a fotograma (`escalaFrames`) o buscar el pack original.

## Completos por meter (22)

- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/290_Mega Pack de Sprites Goku Black Ssj Rose`
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/106_Zamasu e Black Fusão Desmanchando`
- `03_Daima/Goku/140_GOKU SSJ 4 DB DAIMA(ANDRÉS GAMEN ANIMATIONS)👍`
- `05_Fanmade_y_alternativos/Bra/189_Majin bra,sprite(db multiverse) Andrés`
- `05_Fanmade_y_alternativos/Goku/059_Goku SSJ Kaioken`
- `05_Fanmade_y_alternativos/Goku/127_GOKU EVIL SSJ 2 , ANDRÉS GAMEN ANIMATIONS , SPRITE HD,`
- `05_Fanmade_y_alternativos/Goku/133_GOKU MUI BLUE EVOLUTION, ANDRÉS GAMEN ANIMATIONS ( SPRITE HD )`
- `05_Fanmade_y_alternativos/Goku/134_GOKU MUI BLUE, ANDRÉS GAMEN ANIMATIONS ✓ SPRITE HD`
- `05_Fanmade_y_alternativos/Goku/135_GOKU MUI DIOS, ANDRÉS GAMEN ANIMATIONS ( SPRITE HD )`
- `05_Fanmade_y_alternativos/Goku/138_GOKU REY MONO,DB TALE, HECHO POR ANDRÉSITO GAMEN ANIMATIONS`
- `05_Fanmade_y_alternativos/Goku/150_GOKU ULTRA SSJ DIOS, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/151_GOKU,SSJ, SUPREMO,DBS BROLY, ANDRÉS GAMEN ANIMATIONS, SPRITE HD ✓`
- `05_Fanmade_y_alternativos/Goku/206_GOKU SSJ 4 DIOS,DBS BROLY, ANDRÉS GAMEN ANIMATIONS  ✓`
- `05_Fanmade_y_alternativos/Goku/207_GOKU SSJ DIOS,BERSERKER,DBS BROLY, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/208_GOKU SSJ LEGENDARIO,DBS BROLY, ANDRÉS GAMEN ANIMATIONS ✓`
- `05_Fanmade_y_alternativos/Goku/274_GOKU SSJ KAIO KEN`
- `07_Personajes_sin_saga_concreta/Goku/044_Goku`
- `07_Personajes_sin_saga_concreta/Goku/045_Goku (versión2)`
- `07_Personajes_sin_saga_concreta/Goku/053_Goku SSJ 1`
- `07_Personajes_sin_saga_concreta/Goku/273_GOKU SSJ FULL POWER SWL+`
- `09_Packs_mixtos_por_revisar/Varios/254_SPRITESEXTRA`
- `09_Packs_mixtos_por_revisar/Varios/291_SUPER EXTRA PACK DE SPRITES #3 (ESPECIAL 38K) ANDRÉS GAMEN ANIMATIONS 👍`

## Incompletos, fuera del juego (87)

Lo que les falta según la herramienta (puede equivocarse: si al mirarlo resulta completo, se mete).

- `00_Dragon_Ball_Z/01_Namek_y_Freezer/Goku/060_Goku Ssj (Saga Freeza)`: falta vuelo, puñetazos, patada, daño
- `00_Dragon_Ball_Z/01_Namek_y_Freezer/Goku/128_GOKU GINYU, ANDRÉS GAMEN ANIMATIONS ✓ SPRITE HD`: falta aura
- `00_Dragon_Ball_Z/02_Androides_Cell_y_Trunks/DeviantArt/407_ANDROIDE 19 (ChrisReinerVV)`: falta ki
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/056_Goku SSJ 3`: falta daño
- `00_Dragon_Ball_Z/03_Majin_Buu/Goku/278_GOKU SSJ3 ULSW DBZ`: falta vuelo, puñetazos, patada, daño
- `00_Dragon_Ball_Z/03_Majin_Buu/Vegeta/300_Vegeta ssj3`: falta ki, aura, daño
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/001_(Goku Genkidama absorbida) Andrés`: falta puñetazos, patada
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/061_Goku Ssj Falso`: falta vuelo, patada, daño
- `00_Dragon_Ball_Z/04_Peliculas_y_especiales/Goku/145_GOKU SSJ FALSO,DBZ,BY ANDRÉS GAMEN ANIMATIONS`: falta daño
- `01_Dragon_Ball_Super/00_Dioses_y_Super_Saiyan_God/Vegeta/098_Vegeta Ssj God`: falta vuelo, daño
- `01_Dragon_Ball_Super/02_Universo_6/Hit/067_Hitto 2`: falta aura
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/039_Goku Black`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/268_GOKU BLACK (ZAMASU) ULSW`: falta daño
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Goku Black/269_GOKU BLACK PITIKOS`: falta puñetazos, patada, ki, daño
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/107_Zamasu e Black Fusão Desmanchando - Damage`: falta puñetazos, patada, ki, aura
- `01_Dragon_Ball_Super/03_Trunks_del_futuro/Zamasu/108_Zamasu e Black fusion Robotica`: falta puñetazos, patada, daño
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/052_Goku Instinto Superior Completo`: falta patada
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/152_GOKU,MUI,EXTRA ,ANDRES GAMEN ANIMATIONS`: falta vuelo, patada, ki
- `01_Dragon_Ball_Super/04_Torneo_del_Poder/Goku/153_GOKU,MUI,TORNEO DEL PODER (ANIME) ANDRES GAMEN ANIMATIONS`: falta daño
- `01_Dragon_Ball_Super/05_Broly/Goku/217_GOKU, TRAJE DE INVIERNO,DBS BROLY ,ANDRÉS GAMEN ANIMATIONS`: falta ki, aura, daño
- `01_Dragon_Ball_Super/05_Broly/Goku/222_GOKU,SSJ BLUE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS`: falta daño
- `01_Dragon_Ball_Super/05_Broly/Vegeta/225_VEGETA,BASE,DBS, BROLY,DAMAGED, ANDRÉS GAMEN ANIMATIONS`: falta aura
- `01_Dragon_Ball_Super/05_Broly/Vegeta/304_Vegeta com capote HD`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/06_Moro/Vegeta/250_Vegeta ssj Dios patrullero galáctico.Andres Gamen`: falta daño
- `01_Dragon_Ball_Super/07_Granola/Goku/136_GOKU MUI SAGA GRANOLA,V2,BY ANDRÉS GAMEN ANIMATIONS`: falta ki, daño
- `01_Dragon_Ball_Super/08_Super_Hero/Piccolo/227_PICCOLO ORANGE (FORMA GIGANTE)`: falta vuelo, patada, daño
- `01_Dragon_Ball_Super/08_Super_Hero/Piccolo/228_PICCOLO ORANGE DAMAGED`: falta vuelo, puñetazos, patada, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Bardock/224_BARDOCK,BASE,DBS`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/110_GOHAN SSJ 1 DBS ANDRÉS GAMEN ANIMATIONS`: falta vuelo, puñetazos, patada, ki, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/111_GOHAN SSJ 2 DBS ANDRÉS GAMEN ANIMATIONS`: falta vuelo, puñetazos, patada, ki, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/157_Gohan (Manga)`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/158_Gohan (Manga) - Ataque`: falta ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/159_Gohan (Manga) - Daño`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/160_Extra - Cabeza`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/161_Extra - Ki`: falta vuelo, puñetazos, patada, ki, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/162_Aros de Ki`: falta vuelo, puñetazos, patada, aura
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/163_Escudo de Ki`: falta vuelo, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/164_Kamehameha`: falta puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/165_Efectos Kamehameha`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/166_Masenko`: falta vuelo, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/167_Efectos Masenko`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/168_Gohan (Manga) - Ki`: falta vuelo, puñetazos, patada, ki, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/169_Ki - si ki`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/170_Gohan (Manga) - Pose`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/171_Gohan (Manga) - Volador`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/172_Volador - Dash`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Gohan/173_Volador - Dash 2`: falta vuelo, puñetazos, patada, ki, aura, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku Black/042_Goku Black SSJ`: falta vuelo, patada, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/046_Goku Blue`: falta vuelo, puñetazos, patada, daño
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/047_Goku Blue 2`: falta patada
- `01_Dragon_Ball_Super/09_Generales_y_manga/Goku/143_GOKU SSJ BLUE PERFECTO,MEJORADO , ANDRÉS GAMEN ANIMATIONS`: falta patada
- `02_GT/Vegeta/308_VEGETA SSJ4 HD`: falta ki, aura
- `03_Daima/Goku/279_GOKU SSJ4 ULSW DBZ DAIMA`: falta daño
- `03_Daima/Vegeta/238_VEGETA ADULTO SSJ3 (DAIMA) ANDRÉS GAMEN ANIMATION`: falta patada
- `04_Heroes_y_videojuegos/Vegeta/311_vegeta xeno ssj4`: falta vuelo, puñetazos, patada, daño
- `04_Heroes_y_videojuegos/Vegetto/294_veggeto xeno.ssj2.ssj3.ssj5.mini pack.andres Gamen`: falta vuelo
- `05_Fanmade_y_alternativos/Broly/007_BROLY SSJ DIOS,DBZ,BY ANDRÉS GAMEN ANIMATIONS`: falta patada, daño
- `05_Fanmade_y_alternativos/Broly/194_Broly ssj legendario, perfecto, Andrés Gamen`: falta puñetazos, patada, daño
- `05_Fanmade_y_alternativos/Gogeta/155_Gogeta black.Andres Gamen`: falta patada, daño
- `05_Fanmade_y_alternativos/Gohan/195_Gohan del futuro,ssj3, Andrés Gamen`: falta ki, daño
- `05_Fanmade_y_alternativos/Goku Black/005_BLACKKU SSJ ROSE,BLUE, EVOLUTION,BY ANDRÉS GAMEN ANIMATIONS`: falta daño
- `05_Fanmade_y_alternativos/Goku Black/175_Goku black Ultra instito dominado.Andres Gamen`: falta patada, daño
- `05_Fanmade_y_alternativos/Goku Black/183_Majin Goku black Ultra instito.Andres Gamen`: falta ki, daño
- `05_Fanmade_y_alternativos/Goku Black/185_Majin Goku black ssj Rosen.Andres Gamen`: falta patada, daño
- `05_Fanmade_y_alternativos/Goku Black/186_Majin Goku black ssj blue.Andres Gamen`: falta ki, daño
- `05_Fanmade_y_alternativos/Goku Black/187_Majin Goku black ssj1.Andres Gamen`: falta daño
- `05_Fanmade_y_alternativos/Goku/137_GOKU MUI TRAJE WHISS BY ANDRÉS GAMEN ANIMATIONS`: falta patada, ki
- `05_Fanmade_y_alternativos/Goku/139_GOKU SSJ 100, ANDRÉS GAMEN ANIMATIONS, SPRITE HD`: falta patada, aura, daño
- `05_Fanmade_y_alternativos/Goku/142_GOKU SSJ BLUE 3 ( traje wis ) ANDRÉS GAMEN ANIMATIONS`: falta aura
- `05_Fanmade_y_alternativos/Goku/146_GOKU SSJ PRIMARIO, ANDRÉS GAMEN ANIMATIONS`: falta vuelo, ki
- `05_Fanmade_y_alternativos/Goku/179_Goku ultra ego`: falta puñetazos, patada, daño
- `05_Fanmade_y_alternativos/Goku/272_GOKU SSJ BLUE UNIVERSAL ULSW`: falta puñetazos, patada, daño
- `05_Fanmade_y_alternativos/Goku/318_GOKU .EXE ,ANDRÉS GAMEN ANIMATIONS`: falta patada, ki
- `05_Fanmade_y_alternativos/Varios/316_ANDRÉS GAMEN ANIMATIONS(.EXE) 🎃 SPRITE HD 🎃`: falta ki
- `05_Fanmade_y_alternativos/Varios/317_EXTRA PACK DE SPRITES DE HELLOWEEN BY ANDRÉS GAMEN ANIMATIONS 🎃`: falta patada, daño
- `05_Fanmade_y_alternativos/Vegeta/197_Majin Vegeta ssj blue evolution, Damaged, Andrés Gamen`: falta vuelo, puñetazos, patada, daño
- `05_Fanmade_y_alternativos/Vegeta/198_Vegeta ssj Blue1,Ultra ssjb, Damaged, Andrés Gamen`: falta vuelo, puñetazos, patada, daño
- `05_Fanmade_y_alternativos/Vegeta/310_vegeta ssj3 Blu`: falta daño
- `07_Personajes_sin_saga_concreta/Goku/054_Goku SSJ 1(versión 2)`: falta vuelo
- `07_Personajes_sin_saga_concreta/Goku/287_GOKU`: falta puñetazos, patada, ki, aura, daño
- `07_Personajes_sin_saga_concreta/Trunks/288_TRUNKS DEL FUTURO`: falta vuelo, puñetazos, patada, aura, daño
- `07_Personajes_sin_saga_concreta/Vegeta/091_Vegeta`: falta daño
- `07_Personajes_sin_saga_concreta/Vegeta/289_VEGETA`: falta puñetazos, patada, ki, daño
- `07_Personajes_sin_saga_concreta/Vegeta/301_Vegeta Sem Camisa HD`: falta aura
- `09_Packs_mixtos_por_revisar/Varios/116_EXTRA PACK DE SPRITES PARTE 2 , BY ANDRÉS GAMEN ANIMATIONS ✓`: falta patada
- `09_Packs_mixtos_por_revisar/Varios/203_MINI EXTRA PACK DE SPRITES, ANDRÉS GAMEN ANIMATIONS`: falta puñetazos, patada
- `09_Packs_mixtos_por_revisar/Varios/230_SUPER EXTRA PACK DE SPRITES (ESPECIAL DE 24K DE SUBS) ANDRÉS GAMEN ANIMATIONS`: falta patada, daño
- `05_Fanmade_y_alternativos/Vegeta/249_Vegeta Omni God,Damaged.Andres Gamen`: falta patada, daño (revisado a mano, 2 nov.)
