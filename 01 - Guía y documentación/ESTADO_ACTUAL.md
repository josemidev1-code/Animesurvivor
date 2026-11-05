# Estado actual — AnimeSurvivor

Actualizado: 5 de noviembre de 2026.

## Últimas novedades implementadas (Sesión 13 - Antigravity)
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
   - Cinemática de deseos del Gachapón (`wish`) totalmente renovada:
     - Cielo nocturno místico con estrellas centelleantes y relámpagos que iluminan la pantalla con sacudida (`cam.shake`).
     - Nubes oscuras de tormenta rodando en el horizonte.
     - Las 7 Dragon Balls luminosas girando en vórtice concéntrico antes de converger.
     - Columna sagrada de luz divina y ascenso majestuoso de Shenron con ondulación, alternancia de poses y ojos carmesí brillantes.
     - Texto místico: «¡CONCEDERÉ CUALQUIER DESEO! ¡DI TU DESEO AHORA!» y lluvia de confeti de estrellas al conceder el deseo.
   - Pantalla de deseos en partida (`openWish`) actualizada con el nuevo sprite a tamaño proporcional (170×120 px).
3. **Recordatorio especial de lanzamiento — Escuadrón Ginyu**:
   - Comprometido e inmortalizado en `CREDITOS_RECURSOS.md` y `BITACORA.md`: al publicar el juego, todas las IAs del desarrollo colaborativo (Claude, Codex, Antigravity...) serán homenajeadas y caracterizadas como el mítico **Escuadrón Ginyu (Tokusentai!)** en pose heroica especial.

## Novedades anteriores (Sesión 11 - Antigravity)
1. **Ataques seleccionables y activos**:
   - Cada personaje inicia la partida con solo **2 ataques** (`P.sigU = 2`, ranuras 1 y 2).
   - Los ataques son **seleccionables**: el jugador elige cuál usar (teclas 1, 2, 3... o clic/touch en las casillas del HUD).
   - Desbloqueo progresivo por nivel: `UNLOCK_LV = [1, 1, 4, 8, 12, 16]`.
2. **Fusión de técnicas al derrotar jefes**:
   - Al derrotar a un jefe y recoger su cofre (`S.mastery`), se abre la pantalla especial donde se ofrece la **FUSIÓN DE TÉCNICAS** (Kamehameha + Galick Gun -> Final Kamehameha; Puño del Dragón Dorado; Super Kamehameha Rápido; etc.).
3. **Panel de selección de mejora cuadrado**:
   - `#levelup .lupanel` con formato cuadrado con diseño Dragon Ball naranja/dorado oscuro.
4. **Unificación de personajes ("vienen de una")**:
   - Todas las transformaciones consolidadas en sus personajes canónicos (Goku 10 formas, Vegeta 9 formas, Gohan 5 formas, Trunks 4 formas), elegibles con flechas antes de empezar.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic (sin servidores ni fetch runtime).
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. Todo en español para el usuario.
