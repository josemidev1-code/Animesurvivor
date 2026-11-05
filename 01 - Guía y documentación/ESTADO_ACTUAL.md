# Estado actual — AnimeSurvivor

Actualizado: 5 de noviembre de 2026.

## Últimas novedades implementadas (Sesión 14 - Antigravity)
1. **Rediseño estético y limpieza del fondo de la pantalla de inicio**:
   - Eliminado el desfile desordenado de personajes y sus sombras rectangulares oscuras (`drawTitleDemo`), que ensuciaban la hierba y entorpecían la visión del menú.
   - Sustituido por una presentación limpia, cinematográfica y elegante:
     - Paneo suave del escenario panorámico de Dragon Ball con vegetación ondeando al viento.
     - Viñeta y atenuación ambiental suave que proporciona contraste y legibilidad al logo dorado y al menú lateral naranja.
     - Partículas doradas de energía ki flotando con suavidad en el ambiente.
     - El recuadro del héroe seleccionado en el centro ahora destaca con nitidez absoluta y elegancia.

## Novedades anteriores (Sesión 13 - Antigravity)
1. **Colección de Sprites Pixel Art de Objetos de Dragon Ball**:
   - Integrados 11 objetos y reliquias en pixel art auténtico (eliminando los dibujos por código):
     - `kinton.png`: Nube Kinton auténtica de Goku Niño (Strice12).
     - `bastongoku.png`: Bastón Mágico Nyoibo en diagonal con puntas doradas (Strice12).
     - `scouter.png`: Scouter Saiyan verde de rastreo (Legacy of Goku II / Atari).
     - `scouterRojo.png`: Scouter Saiyan de combate rojo de élite.
     - `senzuBolsa.png`: Bolsa Sagrada de Karin de Semillas Senzu.
     - `pesas.png`: Pesas de entrenamiento Kaio / Piccolo.
     - `mafuba.png`: Vasija Sagrada del Mafuba.
     - `capsulacorp.png`: Cápsula Hoi-Poi multiusos Capsule Corp.
     - `capsulaDorada.png`: Cápsula Hoi-Poi Dorada (Súper drop legendario).
     - `capsulaRoja.png`: Cápsula Hoi-Poi de Furia Saiyan.
     - `armaduraSaiyan.png`: Armadura de combate Saiyan de Vegeta.
   - En `RELICS`, cada reliquia ahora luce su sprite pixel art oficial correspondiente.
   - Nuevos drops en cajas destructibles del mapa: Cápsula Hoi-Poi Dorada (+1 ticket gachapón y +80 zeni), Cápsula de Furia (+50% daño temporal con aura roja), y Bolsa de Senzu (+100% vida completa).
2. **Animación y Cinemática Épica de Shenron (Supersonic Warriors 2 - NDS)**:
   - Integrados los sprites oficiales de Shenron de Nintendo DS (Arc System Works / Grim):
     - `ui/shenron_pose1.png`: Pose majestuosa de Shenron en alta definición (128×127 px).
     - `ui/shenron_pose2.png`: Pose serpenteante / rugido con boca abierta (80×128 px).
     - `ui/shenron_nubes.png`: Nubes oscuras de tormenta rodando en el horizonte místico (83×42 px).
     - `ui/shenron_rayos.png`: Relámpagos dorados rasgando el firmamento (46×34 px).
   - Cinemática de deseos del Gachapón (`wish`) totalmente renovada.
   - Pantalla de deseos en partida (`openWish`) actualizada con el nuevo sprite a tamaño proporcional (170×120 px).
3. **Recordatorio especial de lanzamiento — Escuadrón Ginyu**:
   - Comprometido e inmortalizado en `CREDITOS_RECURSOS.md` y `BITACORA.md`: al publicar el juego, todas las IAs del desarrollo colaborativo (Claude, Codex, Antigravity...) serán homenajeadas y caracterizadas como el mítico **Escuadrón Ginyu (Tokusentai!)** en pose heroica especial.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic (sin servidores ni fetch runtime).
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. Todo en español para el usuario.
