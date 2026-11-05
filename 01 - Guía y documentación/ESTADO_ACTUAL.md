# Estado actual — AnimeSurvivor

Actualizado: 5 de noviembre de 2026.

## Últimas novedades implementadas (Sesión 11 - Antigravity)
1. **Ataques seleccionables y activos**:
   - Cada personaje inicia la partida con solo **2 ataques** (`P.sigU = 2`, ranuras 1 y 2).
   - Los ataques son **seleccionables**: el jugador elige cuál usar (teclas 1, 2, 3... o clic/touch en las casillas del HUD); al pulsar la tecla o clic se activa y dispara inmediatamente si está listo.
   - En `sigUpdate`, el ataque seleccionado (`P.sel`) tiene prioridad total para ejecutarse, eliminando la rotación automática descontrolada.
   - Desbloqueo progresivo por nivel: `UNLOCK_LV = [1, 1, 4, 8, 12, 16]`. Al matar enemigos y subir de nivel se van desbloqueando nuevas ranuras y ataques.
2. **Fusión de técnicas al derrotar jefes**:
   - Al derrotar a un jefe y recoger su cofre (`S.mastery`), se abre la pantalla especial donde se ofrece la **FUSIÓN DE TÉCNICAS**: juntar 2 ataques que el jugador tenga desbloqueados (ej. Kamehameha + Galick Gun -> Final Kamehameha; Kamehameha + Golpe -> Puño del Dragón Dorado; Kamehameha + Ráfaga de Ki -> Super Kamehameha Rápido; etc.).
   - La fusión desata un estallido visual en 360°, sacudida de pantalla, sonido de transformación y equipa la técnica combinada superior en la ranura activa.
3. **Panel de selección de mejora cuadrado**:
   - `#levelup .lupanel` rediseñado con formato estrictamente cuadrado (`aspect-ratio: 1 / 1; width: min(440px, 90vw); height: min(440px, 90vw); max-width: 440px;`) con diseño Dragon Ball naranja/dorado oscuro, sin expandirse horizontalmente hacia los lados.
4. **Unificación de personajes ("vienen de una")**:
   - Tras revisar la carpeta de escritorio `ANIMESURVIVOR-CLAUDE`, se retiraron las tarjetas redundantes y desmembradas creadas por ChatGPT/Codex (`gokugt`, `gokusuper`, `gokuui`, `vegetagt`, `vegetasuper`, `vegetaue`, `vegetaego`, `gohanadult`, `trunkscell`).
   - Se consolidaron todas las transformaciones dentro de sus héroes canónicos:
     - **Goku**: 10 transformaciones (Base, Super Saiyan, SSJ2, SSJ3, SSJ Blue, UI Señal, UI Dominado, SSJ4 GT, Kaioken, SSJ Dios) con sus animaciones completas y fotos de perfil fijas.
     - **Vegeta**: 9 transformaciones (Base, Super Saiyan, Super Vegeta, Majin Vegeta, SSJ Blue, Ultra Ego, SSJ4 GT, SSJ Dios, Blue Evolution) con sus animaciones y fotos de perfil.
     - **Gohan**: 5 transformaciones (Base Joven, SSJ, SSJ2, Adulto Místico, Bestia).
     - **Trunks**: 4 transformaciones (Espada, SSJ, Armadura Cell, Ultra SSJ).
   - En el menú de personajes cada guerrero aparece una sola vez ("de una"), y con las flechas `◀` `▶` se elige la forma y se entra a jugar directamente con ella.

## Proyecto y reglas
- Juego de supervivencia Dragon Ball para navegador. Debe funcionar abriendo `index.html` con doble clic.
- Personajes y enemigos: usar sprites de `sprites/`, no dibujarlos por código. Revisar animaciones visualmente; anotar recursos pendientes en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Lee `AGENTS.md` para las reglas completas. Todo en español para el usuario.
