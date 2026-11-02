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

