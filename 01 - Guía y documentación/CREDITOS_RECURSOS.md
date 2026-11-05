# Créditos y procedencia de recursos

Revisión: 31/10/2026. Los créditos siguientes también aparecen dentro del juego, con enlaces a las fuentes,
y no necesitan conexión para cargarse. Dragon Ball pertenece a sus titulares; este es un juego de fans sin ánimo de lucro.

## Incorporados en esta sesión

| Recurso | Crédito | Fuente original | Uso en el juego |
|---|---|---|---|
| Senzu, cápsulas y radar | **Ragengow**, extracción; **Webfoot Technologies / Atari**, juego original | [Items — Dragon Ball Z: The Legacy of Goku II](https://www.spriters-resource.com/game_boy_advance/dbzlog2/asset/175858/) | Sprites del suelo e iconos de senzu/rastreador |
| Dragon Radar animado | **Lady-Pixel** | [Dragon Radar — DeviantArt](https://www.deviantart.com/lady-pixel/art/Dragon-Radar-891273130) | Indicador animado durante la detección de esferas y la atracción de experiencia |

La hoja de Ragengow incluye «No Credit Needed». Se acredita igualmente la extracción y el juego del que procede;
eso no convierte los gráficos originales del juego en recursos CC0.

Lady-Pixel permite usar su radar y pide no editarlo, calcarlo ni atribuírselo. Se conserva **el GIF original íntegro**,
con sus 44 fotogramas y transparencia; el navegador lo muestra como imagen animada. No se recorta ni recolorea.

Los originales, fuentes y coordenadas están en `ui/objetos/fuentes.json` y `ui/objetos/originales/`.
`herramientas/montar_objetos.py` genera los PNG recortados de la hoja y los incrusta en `ui_imagenes.js`.
La eliminación de fondo solo afecta al azul conectado al borde de cada recorte, conservando los detalles interiores.

## Enemigos de DeviantArt (sesión 9)

Descargadas las hojas originales (tamaño completo) y troceadas con `herramientas/recortar_hoja.py` en
`sprites/00_Dragon_Ball_Z/01_Namek_y_Freezer/DeviantArt/` (la hoja original se conserva junto a cada pack).
Ninguna de las tres fichas indica restricciones; se acredita al autor y a los coautores que cita cada una.

| Recurso | Crédito | Fuente | Uso en el juego |
|---|---|---|---|
| Soldado de Freezer | **TheWarriorFF2 / Spir1tSolo**; con Que, qsab101, DyanDisel, Izanagi797, Orumaitoobeso, Reeck495, MV95, MANIKDX, Papuro Tenkikujimo | [Frieza's Soldier 1 Sprite Sheet](https://www.deviantart.com/thewarriorff2/art/Frieza-s-Soldier-1-Sprite-Sheet-856331851) | Soldado, soldado raso, soldado de Freezer y élite (colores alternativos) |
| Capitán Ginyu | **Strice12**; con azazel300, JustOruma, MrDryy, Godkuuxfy, MAST3RK1LL3R171, GZ52, arisrad, AlanBrito962, MatheusAnimaa | [Sheet Sprite Ginyu Ulsw](https://www.deviantart.com/strice12/art/Sheet-Sprite-Ginyu-Ulsw-1161968207) | Jefe y escuadrón de Fuerzas Especiales |
| Jeice | **MrDryy**; faceset de MAST3RK1LL3R171; con Qsab101, ErickJCrack507, Scarlettdancer2627, JustOruma, Arisrad, Yasertheblack | [Jeice Sprite Sheet ULSW](https://www.deviantart.com/mrdryy/art/Jeice-Sprite-Sheet-ULSW-1145996714) | Enemigo de élite y escuadrón |

Burter (BrolyGamer096) y Recoome (Bite035) no permiten bajar el original a tamaño completo sin cuenta; pendientes.

## Escenarios (sesión 9)

| Recurso | Crédito | Fuente | Uso en el juego |
|---|---|---|---|
| Suelos (hierba, arena, tierra, nieve, ladrillo), árboles y rocas | **Pixel-Boy y AAA** — Ninja Adventure Asset Pack, licencia **CC0** (piden un enlace como agradecimiento) | [itch.io](https://pixel-boy.itch.io/ninja-adventure-asset-pack) · [GitHub](https://github.com/pixel-boy/NinjaAdventure) | 32 suelos de los mapas y árboles/rocas genéricos (`escenarios_tiles.js`, generado con `herramientas/montar_escenarios.py`) |

Tilesets originales en `sprites/06_Escenarios/Tiles/`. Agua, lava, cielo y suelos muy propios de Dragon Ball (camino de la
serpiente, Yardrat, Red Ribbon) siguen dibujados por código porque el pack no los trae.

## Recursos que ya tenía el proyecto

- **Josemi**: logo y siete esferas del dragón de `ui/`.
- Packs «Dragon Ball Sagas»: los créditos anteriores del juego mencionan a **qsab101, LukasAhl1, thekrillmaster,
  Manikdx2000, gogeta68, MV95, PeculiarDoc, LICHT y YoloKing777**. Esta sesión conserva esos créditos;
  no constituye una nueva auditoría de todas las hojas antiguas.
- **Bird Studio, Shueisha y Toei Animation**: titulares mencionados en los créditos de Dragon Ball.

## Catálogo de DeviantArt revisado para continuar

Estas filas son referencias para desarrollo; **no indican que sus recursos estén ya usados en partida**.
Se han leído las fichas originales y se distinguen sus condiciones. Las condiciones concretas de cada hoja
deben acompañar a cualquier incorporación posterior.

| Tipo | Recurso y autor | Condiciones observadas / estado |
|---|---|---|
| Objeto animado | [Dragon Radar — Lady-Pixel](https://www.deviantart.com/lady-pixel/art/Dragon-Radar-891273130) | Uso permitido sin editar; ya incorporado conservando el GIF |
| Personajes | [Ultimate LSW: Sprite Collection — qsab101 / Que](https://www.deviantart.com/qsab101/art/Ultimate-LSW-Sprite-Collection-695413641) | Colección de poses de distintas sagas; la ficha muestra CC BY-NC-ND 3.0. No se ha importado como nuevas animaciones completas |
| Hoja de personaje | [Goku — Ultimate LSW Sheet — qsab101 / Que](https://www.deviantart.com/qsab101/art/Goku---Ultimate-LSW-Sheet-700665466) | La descripción invita a descargar y usar con crédito a Que; también muestra CC BY-NC-ND 3.0. Condiciones a conservar y revisar antes de modificar |
| Impulso / efectos | [FighterZ Air Dash Impact effect — LyanCv505](https://www.deviantart.com/lyancv505/art/FighterZ-Air-Dash-Impact-effect-935279444) | La descripción pide crédito si se usa. Hay una previsualización pública; el botón del original lleva al registro. No integrado |
| Escenarios | [Dragon Ball RMXP Tiles — LorisC93](https://www.deviantart.com/lorisc93/art/Dragon-Ball-RMXP-Tiles-941755891) | Permite usar con créditos y sin atribuirse el trabajo. PNG 256×928 descargado y revisado en `Recursos pendientes/escenarios/`; casas, nave y otros elementos. No integrado: falta comprobar cómo encaja el estilo RPG con el juego y preparar las colisiones |
| Objetos / efectos mixtos | [Itens e efeitos para uso. — robimkazami](https://www.deviantart.com/robimkazami/art/Itens-e-efeitos-para-uso.-1379217280) | Material de Sonic para gráficos/ediciones; acredita a varios colaboradores y Sega/Sonic Team. Descartado para los objetos de Dragon Ball |
| Objetos de varias series | [Powerful items in sprites — firenamedBob](https://www.deviantart.com/firenamedbob/art/Powerful-items-in-sprites-744202789) | Atribuye las Dragon Balls a delvallejoel y otros elementos a sus fuentes. No se ha comprobado un permiso de reutilización; no incorporado |
| Senzu pixel art | [Senzu Beans Pixel Avatar — SailorTrekkie92](https://www.deviantart.com/sailortrekkie92/art/Senzu-Beans-Pixel-Avatar-1116731485) | No incorporado: [su biografía](https://www.deviantart.com/sailortrekkie92/about) exige permiso previo para usar su arte fuera de su plataforma |
| Cápsula animada | [Capsule Corp Pixel Avatar 2 — SailorTrekkie92](https://www.deviantart.com/sailortrekkie92/art/Capsule-Corp-Pixel-Avatar-2-938301224) | Mismo requisito de permiso previo; no incorporado |
| Iconos | [Senzu Icon — DragonBallDiscord](https://www.deviantart.com/dragonballdiscord/art/Senzu-Icon-512489263) | Referencia de 50×50; no encaja tan bien con el pixel art y no publica condiciones de reutilización. No incorporado |

La senzu y las cápsulas que finalmente usa el juego proceden de la hoja de Legacy of Goku II citada arriba,
**no** de los dos avatares de SailorTrekkie92. No se han enviado mensajes a artistas ni creado cuentas.
## Personajes jugables de DeviantArt (sesión 10)

Hojas originales bajadas con `herramientas/bajar_deviantart.py` (lee la ficha, muestra descripción y licencia y baja el
`fullview` original) y troceadas con `recortar_hoja.py`. Ninguna ficha indica restricciones de uso; se acredita al autor y a
los coautores que cita. Los retratos y el fotograma «tumbado» de cada pack son recortes de la misma hoja
(`retrato.png` y `tumbado.png`). Ginyu y Jeice reutilizan las hojas de la sesión 9 (packs 401 y 402).

| Recurso | Crédito | Fuente | Pack |
|---|---|---|---|
| Nappa | **Strice12**; con AlquimistaSK, GABY361, SheriffSyler, AThePro013, MrDryy, JCO2003, Scarlettdancer2627, Diego Tesfaye | [Nappa sheet sprite ulsw](https://www.deviantart.com/strice12/art/Nappa-sheet-sprite-ulsw-1107877711) | `00_Saiyans/DeviantArt/403_NAPPA (Strice12)` |
| Guldo | **Strice12**; con JCO2003, BrolyGamer096, Marcowwwww, JustOruma, Pedrocarlos877, MrDryy, AlquimistaSK | [Guldo Sheet Sprite Ulsw](https://www.deviantart.com/strice12/art/Guldo-Sheet-Sprite-Ulsw-1154137000) | `01_Namek_y_Freezer/DeviantArt/404_GULDO (Strice12)` |
| Uub | **Strice12**; con ErickJCrack507, MrDryy, Godkuufy, JustOruma, Scarlettdancer2627, AS02X, pedrocarlos8772 | [Uub Sheet Sprite Ulsw](https://www.deviantart.com/strice12/art/Uub-Sheet-Sprite-Ulsw-1157141190) | `03_Majin_Buu/DeviantArt/408_UUB (Strice12)` |
| Mr. Satán | **JayHyperStarX** (la ficha no cita coautores) | [Hercule Satan - Sprite Sheet](https://www.deviantart.com/jayhyperstarx/art/Hercule-Satan---Sprite-Sheet-1039720310) | `03_Majin_Buu/DeviantArt/409_MR SATAN (JayHyperStarX)` |
| Androide 21 (Majin) | **arisrad**; combinada con hojas de GMInazuma y ErickJCrack507; con Mattfv y LUISFCX12; banner de R0N1N60 | [android-21-swl-sprite-sheet](https://www.deviantart.com/arisrad/art/android-21-swl-sprite-sheet-by-ARIS-RAD-1131494602) | `04_Heroes_y_videojuegos/DeviantArt/410_ANDROIDE 21 (arisrad)` |

Revisadas y descartadas: Zarbon y Dodoria de FilipeSpriter (hoja en JPEG borrosa y con capturas del anime), Androide 19 de
ChrisReinerVV (comprimida en JPEG: bordes verdes sucios; su carpeta `02_Androides_Cell_y_Trunks/DeviantArt` quedó en
`sprites/` sin usar), Zarbon y Yajirobe de arisrad (se venden: «for sell»).


## Enemigos y personajes de DeviantArt (3 nov. 2026)

Hojas que Josemi ya tenía en Descargas; fichas leídas en DeviantArt. Todas piden crédito si se usan. Originales en
`Recursos pendientes/deviantart_originales/`, troceadas con `herramientas/recortar_hoja.py`.

| Personaje | Autor y créditos | Ficha | Uso / condiciones |
|---|---|---|---|
| Dodoria y Zarbon | **FilipeSpriter** (estilo Ultimate LSW) | [Sprite Sheet Zarbon e Dodoria Ulsw](https://www.deviantart.com/filipespriter/art/Sprite-Sheet-Zarbon-e-Dodoria-Ulsw-933343123) | Jefes de Namek. Hoja de baja resolución: se ven algo borrosos |
| Meca Freezer | **TheWarriorFF2 / Spir1tSolo**; con Arisrad, OmegaSuper, Chokito 8pixel, Nightmarex07, Que, Mosterjecth, Gougours, MestrePixelado, Contadodavid | [resubida de dragonballzfan200](https://www.deviantart.com/dragonballzfan200/art/Mecha-Freeza-Dbz-Sprite-Sheet-By-Thewarriorff2-D-952104916) (la hoja es de TheWarriorFF2) | Jefe (Red Ribbon, Tierra, Desierto, Torre Músculo) |
| Garlic Jr. | **ErickFl** | [Ulsw Garlic Jr. By ErickFl](https://www.deviantart.com/erickfl/art/Ulsw-Garlic-Jr.-By-ErickFl-840407281) | Élite y jefe (Super Garlic Jr.). «Siempre recuerde dar créditos a todos los spriters» |
| Rey Vegeta | **SonIsaki**; con qsab101 y agustin902 (Dragon Ball Rebirth) | [King Vegeta ULSW](https://www.deviantart.com/sonisaki/art/King-Vegeta-ULSW-873393815) | Élite. Ficha con CC BY-NC-ND; la descripción pide crédito si se usa |
| Dr. Gero | **SonIsaki** (Dragon Ball Rebirth) | [Dr. Gero ULSW](https://www.deviantart.com/sonisaki/art/Dr.-Gero-ULSW-862625720) | Troceado en `sprites/`, aún sin usar (no hay enemigo Dr. Gero). CC BY-NC-ND; pide crédito |
| Maestro Roshi | **Xxspartan1235xX**; créditos a orumaitoobeso, faceset de charlotteson | [Master roshi sprite sheet Swlplus](https://www.deviantart.com/xxspartan1235xx/art/Master-roshi-sprite-sheet-Swlplus-1001776947) | Personaje jugable. Pide sus créditos |
| Zeno | AnimaPivotersZ (sprite de Qsab101) | [Zeno Sprite Sheet](https://www.deviantart.com/animapivotersz/art/Zeno-Sprite-Sheet-744045955) | No usado: solo unas poses |

Bajadas de DeviantArt el 3 nov. (originales en `Recursos pendientes/deviantart_originales/`):

| Personaje | Autor y créditos | Ficha | Uso / condiciones |
|---|---|---|---|
| Burter | **marcowwwww**; créditos a AlexKX29, orumaitoobeso y Dryy7 | [Burter ULSW](https://www.deviantart.com/marcowwwww/art/Burter-ULSW-932429522) | Élite y escuadrón de las Fuerzas Especiales. Descargable; se acredita |
| Whis | **contadodavid**; créditos a qsab, DarkSheep123, kaivo2003, dyandisel, bite035, omegasuper | [Whis ulsw](https://www.deviantart.com/contadodavid/art/Whis-ulsw-836412178) | Jefe del Planeta de Bills. Descargable; se acredita |
| Androide 19 | **Pedrocarlos8772** (subida por johnarlspringting); la ficha acredita estilo, efectos, aura, faceta y banner a otros spriters | [Android_19_Ulsw_By_Pedrocarlos8772](https://www.deviantart.com/johnarlspringting/art/Android_19_Ulsw_By_Pedrocarlos8772-1251073180) | Jefe de la Base Red Ribbon |
| Dabura | **deviantarter1236** (ripeo de un juego de lucha, no es pixel art propio) | [Dabura Sprite Sheet](https://www.deviantart.com/deviantarter1236/art/Dabura-Sprite-Sheet-812167859) | Jefe del Mundo Kaioshin. JPEG: bordes algo sucios y aspecto menos nítido |
| Freezer (formas) | **qsab101 / Que** | [Frieza - Ultimate LSW Sheet](https://www.deviantart.com/qsab101/art/Frieza---Ultimate-LSW-Sheet-752959651) | «If used, please give credit to Que». Troceado; la 2ª forma solo trae la transformación y unas poses: no está completa, sin usar |

Descartados: Ozaru y Ozaru dorado de phyetro (marca de agua, sin original descargable); Dabura y Dr. Gero de arisrad (de pago).

Tercera tanda (3 nov.):

| Personaje | Autor y créditos | Ficha | Uso / condiciones |
|---|---|---|---|
| Fasha | **ErickFl**; gracias a qsab101 | [Fasha DBZ Sprites Sheet Ulsw](https://www.deviantart.com/erickfl/art/Fasha-DBZ-Sprites-Sheet-Ulsw-829798829) | Enemiga de élite (antes «Saiyan de élite»), con su nombre |
| Ozaru (Vegeta) | **AldetSkywalker** | [Oozaru Vegeta Sheet](https://www.deviantart.com/aldetskywalker/art/Oozaru-Vegeta-Sheet-805111160) | Jefe «OZARU VEGETA». JPEG y solo 11 poses: sin daño ni ki propios |
| Soldado Red Ribbon | **PaulGekko98** (créditos: Akira Toriyama) | [Red Ribbon Army JUS Sprite Sheet](https://www.deviantart.com/paulgekko98/art/Red-Ribbon-Army-JUS-Sprite-Sheet-1362631195) | Enemigo común en Red Ribbon, Torre Músculo y Ciudad del Oeste. Estilo JUS, sin daño propio |
| Tao Pai Pai | **ChrisReinerVV** | [Tao Pai Pai Sprite Sheet Ulsw](https://www.deviantart.com/chrisreinervv/art/Tao-Pai-Pai-Sprite-Sheet-Ulsw-By-ChrisReiner-VV-1248981253) | Personaje jugable con Dodonpa y Golpe de la Grulla |
| Efectos de ki y aura | **GMKirito** | [Ki Blast E Aura Sprite Sheet](https://www.deviantart.com/gmkirito/art/Ki-Blast-E-Aura-Sprite-Sheet-Dragon-Ball-876723464) | Bajada y guardada en `Recursos pendientes/deviantart_originales/`; sin integrar (bolas de ki de muchos colores para las técnicas) |

Cuarta tanda (3 nov.):

| Personaje | Autor y créditos | Ficha | Uso / condiciones |
|---|---|---|---|
| Freezer 2ª forma | **Strice12**; créditos a JustOruma, MrDryy, Azazel300, Qsab101, Arisrad, 310r4ngut4nit0123, ErickJCrack507, zenninsama | [Sheet Sprite Freezer Segunda forma Ulsw](https://www.deviantart.com/strice12/art/Sheet-Sprite-Freezer-Segunda-forma-Ulsw-1332749441) | Élite y jefe. JPEG: algo de ruido alrededor |
| Pui Pui | **MrDryy**; créditos a qsab101, m0v3537m4k3r, Scarlettdancer2627, 3lOr4ngut4nit0123, GZ52, AThePro013, Arisrad, ErickJCrack507, JustOruma | [Pui Pui Sprite Sheet ULSW](https://www.deviantart.com/mrdryy/art/Pui-Pui-Sprite-Sheet-ULSW-1333543307) | Enemigo de la saga de Buu (antes «Demonio») |
| Yamu | **MrDryy**; estilo de qsab101, faceset de 3lOr4ngut4nit0123, con GZ52, JustOruma, ErickJCrack507, TarloEgnaro | [Yamu Sprites Sheet ULSW](https://www.deviantart.com/mrdryy/art/Yamu-Sprites-Sheet-ULSW-1251547228) | Enemigo de la saga de Buu (antes «Demonio de élite») |
| Yamcha y Tenshinhan (saga de Cell) | **Dryy7** | [Yamcha & Ten Shin Han Cell Saga Sprite Sheet ULSW](https://www.deviantart.com/dryy7/art/Yamcha-Ten-Shin-Han-Cell-Saga-Sprite-Sheet-ULSW-948418024) | Jugables |
| Goten Super Saiyan | **ThatonePeepDA** | [ULSW Super Saiyan Goten Sprite Sheet](https://www.deviantart.com/thatonepeepda/art/ULSW-Super-Saiyan-Goten-Sprite-Sheet-843848290) | Jugable (antes oculto) |
| Trunks niño (base y SSJ) | **MrDryy** | [Kid Trunks Base/Ssj Mini Sheet ULSW](https://www.deviantart.com/mrdryy/art/Kid-Trunks-Base-Ssj-Mini-Sheet-ULSW-1084396050) | Jugable, 2 formas. JPEG: algo de ruido |
| Goku niño | **Strice12** | [Goku kid inicio sheet sprite ulsw](https://www.deviantart.com/strice12/art/Goku-kid-inicio-sheet-sprite-ulsw-1133163535) | Jugable |
| Videl (pelo corto) | **MrDryy** | [Videl Short Hair Mini Sheet ULSW](https://www.deviantart.com/mrdryy/art/Videl-Short-Hair-Mini-Sheet-ULSW-1092487887) | Jugable |
| Supremo Kaioshin | **ErickFl** (cara de AlexKX29) | [Supreme Kaio Shin Sprites Sheet Lsw](https://www.deviantart.com/erickfl/art/Supreme-Kaio-Shin-Sprites-Sheet-Lsw-822659018) | Jugable |
| Kibitoshin | **ErickFl** (cara de AlexKX29) | [Sprites Sheet Kibito Kai](https://www.deviantart.com/erickfl/art/Sprites-Sheet-Kibito-Kai-Majin-Buu-825257745) | Jugable; los paneles de supers no se pudieron recortar |
| Cui | **TheWarriorFF2**; créditos a Spir1tSolo, OrumaitoObeso, Luka, MestrePixelado, YolongKing777, Tansaki, LukaSahl1, Qsab101, PeculiarDoc, TheKrillMaster, MV95, ManikDX, Papuro Tekikujimo, Reek495 | [Cui Sprite Sheets (No scouter)](https://www.deviantart.com/thewarriorff2/art/Cui-Sprite-Sheets-No-scouter-855741054) | Jugable |
| Rey Cold (3ª forma) | **AlquimistaSK** | [King cold forma 3 Ulsw](https://www.deviantart.com/alquimistask/art/King-cold-forma-3-Ulsw-989365541) | Jugable y jefe de la Tierra |
| Appule | **Kopoloku** (base de GodofHell), subida por LSW-Sprite | [Appule sprite](https://www.deviantart.com/lsw-sprite/art/Appule-sprite-607390635) | Élite del ejército de Freezer |
| General Blue | **ChipsoDebik** | [general blue ULSW](https://www.deviantart.com/chipsodebik/art/general-blue-ULSW-1051138588) | Élite de la Red Ribbon |
| Ninja Murasaki | **LSW-Sprite** (base de Tortue Géniale de Fullpower, modificada por Trimss) | [DB ninja Murasaki sprite sheet](https://www.deviantart.com/lsw-sprite/art/DB-ninja-Murasaki-sprite-sheet-622397905) | Élite de la Red Ribbon |
| Tarble SSJ | **LSW-Sprite** | [Tarble ssj sprite 2](https://www.deviantart.com/lsw-sprite/art/Tarble-ssj-sprite-2-645589408) | Jugable |
| Lord Slug | **Adrianzin09** (edición); créditos a DB FighterZ, Extreme Butoden, Jump Ultimate Stars, Supersonic Warriors, qsab101, Luka, Angry Boy, Matheus Anima, OrumaitoObeso, Azazel300, Woothrad, Rud 390, ErickJCrack507 | [Lord Slug First Form ULSW](https://www.deviantart.com/adrianzin09/art/Lord-Slug-First-Form-ULSW-read-description-1278778424) | Jugable y jefe de la pradera. Halo de ruido alrededor |
| Zangya y Bujin | **Morai (devons)** | [Bujin et zangya sprites](https://www.deviantart.com/zitlezoan/art/Bujin-et-zangya-sprites-348811994) | Élites. Pide crédito («give credit if used») |
| Pan GT | **Saribs** | [Pan GT Spritesheet SWL](https://www.deviantart.com/saribs/art/Pan-GT-Spritesheet-SWL-957118927) | Jugable |
| Super 17 | **LSW-Sprite** (créditos a GodofHell) | [Super C17 Sprite Sheet](https://www.deviantart.com/lsw-sprite/art/Super-C17-Sprite-Sheet-614731779) | Jugable y jefe de la Sala del Tiempo |
| Dr. Myuu | **LSW-Sprite** (B_V) | [Dr Myuu 2](https://www.deviantart.com/lsw-sprite/art/Dr-Myuu-2-610598282) | Jefe de la Sala del Tiempo |
| Omega Shenron | **qsab101** (gracias a AngryBoy, Luka, Extreme Butoden, Jump Ultimate Stars, Supersonic Warriors, LSW) | [Omega Shenron Ultimate LSW Sheet PREVIEW](https://www.deviantart.com/xbae12/art/Omega-Shenron-Ultimate-LSW-Sheet-PREVIEW-806406165) | Jugable y jefe final de la Sala del Tiempo (sin animación de derrota) |
| Kyabe (Cabba) SSJ | **MrDryy** | [Cabba (Kyabe) Ssj Sprite Sheet ULSW](https://www.deviantart.com/mrdryy/art/Cabba-Kyabe-Ssj-Sprite-Sheet-ULSW-1185539236) | Jugable (antes oculto) |
| Gas (3ª fase) | **VairenMorningstar667**; créditos a AndresZ2021, qsab101, Gatitopri, ThibaultDeBoon, Endericaro | [Gas Forma 3 Sprites LSW](https://www.deviantart.com/vairenmorningstar667/art/Gas-Forma-3-Sprites-LSW-DBS-Saga-de-Granola-939682837) | Jugable y jefe de la arena de Bills |
| Granola | **AThePro013** | [Granola sprite Sheet Swl](https://www.deviantart.com/athepro013/art/Granola-sprite-Sheet-Swl-979282045) | Jugable |
| Paragus (película de 1993) | **Strice12** | [Paragus Dbz Sheet Sprite Ulsw](https://www.deviantart.com/strice12/art/Paragus-Dbz-Sheet-Sprite-Ulsw-1235958309) | Jugable |
| Gran Sacerdote | **YolokinG777** | [DBS Daishinkan Grand Priest ULSW Sprite Sheet](https://www.deviantart.com/yoloking777/art/DBS-Daishinkan-Grand-Priest-ULSW-Sprite-Sheet-948899992) | Jugable |
| Majin Duu | **AlquimistaSK** | [Majin duu Ulsw](https://www.deviantart.com/alquimistask/art/Majin-duu-Ulsw-By-AlquimistaSK-1147205569) | Jugable |
| Magetta | **AlquimistaSK** | [Magetta sheet ulsw](https://www.deviantart.com/alquimistask/art/Magetta-sheet-ulsw-by-AlquimistaSK-1126260363) | Jugable y élite (Torneo del Poder, Bills) |
| Bulma | **ChipsoDebik** | [ULSW bulma](https://www.deviantart.com/chipsodebik/art/ULSW-bulma-1050070932) | Jugable |
| Recoome | **Bite035** (encargo) | [LSW Recoome sprite sheet](https://www.deviantart.com/bite035/art/LSW-Recoome-sprite-sheet-724400887) | Élite de las Fuerzas Ginyu. JPEG limpiado |
| Androide 13 | **Strice12**; créditos a JCO200, ErickJCrack507, Theflearenton, ErickFl, JustOruma, azazel300, Arisrad | [Android 13 Sprite Sheet ulsw](https://www.deviantart.com/strice12/art/Android-13-Sprite-Sheet-ulsw-1155890307) | Jugable y élite |
| Androide 14 | **Arisrad**; créditos a orumaitoobeso, LukasAhl1, qsab101, azazel300, BlackSanYT, thekrillmaster | [Android 14 swl sprite sheet](https://www.deviantart.com/arisrad/art/Android-14-swl-sprite-sheet-By-ARISRADIKLIF-1041849066) | Jugable y élite |
| Metal Cooler | **Mast3rK1ll3r171** | [METAL COOLER ULSW SPRITE SHEET](https://www.deviantart.com/mast3rk1ll3r171/art/METAL-COOLER-ULSW-SPRITE-SHEET-1080649742) | Jugable y jefe del Infierno |
| Majin Kuu | **Strice12**; créditos a NatitoKun77, Scarlettdancer2627, Kiibo0, JustOruma, KauanPereba, AlquimistaSK, MrDryy | [Majin Kuu Sheet Sprite Ulsw](https://www.deviantart.com/strice12/art/Majin-Kuu-Sheet-Sprite-Ulsw-1137913302) | Jugable |
| Merus | **ErickJCrack507** (ULSW de qsab101, base de Orumaito) | [Merus ULSW Sprite Sheet](https://www.deviantart.com/erickjcrack507/art/Merus-ULSW%2C-Sprite-Sheet-854750971) | Jugable |
| Coronel Silver | **ChipsoDebik** | [colonel silver ULSW](https://www.deviantart.com/chipsodebik/art/colonel-silver-ULSW-1053165938) | Élite de la Red Ribbon |
| Tambourine y Drum | **KrystalDragonX546** (créditos a los autores originales) | [Lsw Tambourine and drum Sprite Sheet Pack](https://www.deviantart.com/krystaldragonx546/art/Lsw-Tambourine-and-drum-Sprite-Sheet-Pack-1364244605) | Élites en Kame House, Paoz, Budokai y Templo |
| Rey Gomah | **ChrisReinerVV** | [hoja en DeviantArt](https://www.deviantart.com/chrisreinervv/art/1261501464) | Jugable y jefe del Mundo Kaioshin |
| Nuova Shenron | **azazel300** (ULSW) | [nova shenrong](https://www.deviantart.com/azazel300/art/806976617) | Jugable y élite en la Sala del Tiempo y la Tierra Volcánica. JPEG limpiado |
| Trunks GT | **Breckhhh** | [hoja en DeviantArt](https://www.deviantart.com/breckhhh/art/1131247491) | Jugable |
| Hatchiyack | **BLZofOZ** (base de Freezer de Legendary Super Warriors; auras de Devons, rayos de Angryboy) | [hoja en DeviantArt](https://www.deviantart.com/blzofozz/art/208215858) | Jugable y élite en la Ciudad del Oeste, el Desierto y el Infierno |
| Nam | **LSW-Sprite** (autor original anónimo) | [DB Nam sprite sheet](https://www.deviantart.com/lsw-sprite/art/635413041) | Élite en el Budokai, Kame House y el Templo (sin ki ni aura: no es jugable) |
| Glorio | **ChrisReinerVV** | [Glorio Sprite Sheet Ulsw](https://www.deviantart.com/chrisreinervv/art/1267982920) | Jugable y élite en el Mundo Kaioshin y el Infierno |
| Gohan del futuro | **BlackSanYT** | [Gohan(Future) Sprite Sheet Ultimate Lsw](https://www.deviantart.com/blacksanyt/art/895673269) | Jugable |
| Kibito | **Dryy7** | [Kibito ULSW](https://www.deviantart.com/dryy7/art/923469276) | Jugable |
| Dyspo | **Omegasuper** (edición; créditos a Que) | [Dyspo ULSW](https://www.deviantart.com/omegasuper/art/807041424) | Jugable y élite en el Torneo del Poder |

Sin usar: la hoja de Bojack de sonictheminecrafthog pide permiso antes de usarla; los namekianos de ziglepaz y los hijos del Rey Piccolo de CaptainDutch son dibujos sueltos sin animación. Ribrianne (JPEG muy pequeño y con ruido) y Zeno (solo 3 poses) se descartan. «Yakon y otros» (suten94) y «DAIMA varios» (AS02X) son una pose por personaje: quedan para enemigos de una sola pose.

Descartados también: Bujin (animaciones demasiado pobres), Gine de SuperSaiyanPanda175 (JPEG con mucho ruido) y Launch de LavenderBlueDreams (pide permiso).

Descartada: «DBUL - Tora (Reformed)» de Yumejoki (el sprite se parece demasiado a Vegeta y confundiría en partida).

Descartados por ser sprites grandes o HD (Josemi, 4 nov.: «solo los pequeñitos»): Hildegarn y Cell Max de azazel300, Anilaza de Arisrad y Gohan del futuro (JUS) de Shubuster. También descartados: Tapion de SuperSaiyanPanda175 (JPEG con ruido, sin patada ni aura), Nail de VegetaBlack162 y Kaio-sama de MrRuben7 (solo poses de guardia), «Bubbles» de Alex2497 (es un personaje fanmade, no el mono de Kaio), Shugesh y Borgos de Karitz54 (una pose por personaje) y Dr. Wheelo de DeviantArter1236 (sprites grandes y solo guardia).


## Efectos de pixel art (pixelfx)

| Recurso | Fuente | Uso |
|---|---|---|
| Efectos de explosión, implosión, estallido arcano y golpes | [pixelfx — Patch (patch.gg)](https://github.com/patch-gg/pixelfx), licencia MIT; método de [Hugo Duprez](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude) | Incorporados por código en `02 - Código del juego/efectos_pixelfx.js` (origen en `herramientas/efectos_pixelfx/`). La fuente Patch Pixel de pixelfx no se usa |

## Biblioteca externa de hojas LSW (DeviantArt) — 05/11/2026

Recopilación exhaustiva de 770 hojas de sprites 2D en tamaño original completo (~318 MB) ubicadas en la carpeta `antigravity sprites/`. El listado completo de autores, obras, dimensiones y enlaces a sus fichas originales en DeviantArt se detalla en:
- `antigravity sprites/INDICE_SPRITES.md`

