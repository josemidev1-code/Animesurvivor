# Animaciones para Piskel — PICCOLO (Forma 0)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/piccolo_0/origen.json --heroe piccolo --forma 0 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py piccolo` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 62x62 | [`piccolo_Idle.piskel`](Idle/piccolo_Idle.piskel) | [`piccolo_Idle.gif`](Idle/piccolo_Idle.gif) | [`piccolo_Idle_sheet.png`](Idle/piccolo_Idle_sheet.png) |
| **Walk** | 1 | 62x62 | [`piccolo_Walk.piskel`](Walk/piccolo_Walk.piskel) | [`piccolo_Walk.gif`](Walk/piccolo_Walk.gif) | [`piccolo_Walk_sheet.png`](Walk/piccolo_Walk_sheet.png) |
| **Attack** | 3 | 62x62 | [`piccolo_Attack.piskel`](Attack/piccolo_Attack.piskel) | [`piccolo_Attack.gif`](Attack/piccolo_Attack.gif) | [`piccolo_Attack_sheet.png`](Attack/piccolo_Attack_sheet.png) |
| **Kick** | 3 | 90x90 | [`piccolo_Kick.piskel`](Kick/piccolo_Kick.piskel) | [`piccolo_Kick.gif`](Kick/piccolo_Kick.gif) | [`piccolo_Kick_sheet.png`](Kick/piccolo_Kick_sheet.png) |
| **Cast** | 2 | 70x70 | [`piccolo_Cast.piskel`](Cast/piccolo_Cast.piskel) | [`piccolo_Cast.gif`](Cast/piccolo_Cast.gif) | [`piccolo_Cast_sheet.png`](Cast/piccolo_Cast_sheet.png) |
| **Pow** | 2 | 134x134 | [`piccolo_Pow.piskel`](Pow/piccolo_Pow.piskel) | [`piccolo_Pow.gif`](Pow/piccolo_Pow.gif) | [`piccolo_Pow_sheet.png`](Pow/piccolo_Pow_sheet.png) |
| **Hurt** | 2 | 68x68 | [`piccolo_Hurt.piskel`](Hurt/piccolo_Hurt.piskel) | [`piccolo_Hurt.gif`](Hurt/piccolo_Hurt.gif) | [`piccolo_Hurt_sheet.png`](Hurt/piccolo_Hurt_sheet.png) |
| **Attack2** | 2 | 62x62 | [`piccolo_Attack2.piskel`](Attack2/piccolo_Attack2.piskel) | [`piccolo_Attack2.gif`](Attack2/piccolo_Attack2.gif) | [`piccolo_Attack2_sheet.png`](Attack2/piccolo_Attack2_sheet.png) |
| **Attack3** | 3 | 96x96 | [`piccolo_Attack3.piskel`](Attack3/piccolo_Attack3.piskel) | [`piccolo_Attack3.gif`](Attack3/piccolo_Attack3.gif) | [`piccolo_Attack3_sheet.png`](Attack3/piccolo_Attack3_sheet.png) |
| **Kick2** | 3 | 60x60 | [`piccolo_Kick2.piskel`](Kick2/piccolo_Kick2.piskel) | [`piccolo_Kick2.gif`](Kick2/piccolo_Kick2.gif) | [`piccolo_Kick2_sheet.png`](Kick2/piccolo_Kick2_sheet.png) |
| **Beam** | 2 | 70x70 | [`piccolo_Beam.piskel`](Beam/piccolo_Beam.piskel) | [`piccolo_Beam.gif`](Beam/piccolo_Beam.gif) | [`piccolo_Beam_sheet.png`](Beam/piccolo_Beam_sheet.png) |
| **Dash** | 1 | 62x62 | [`piccolo_Dash.piskel`](Dash/piccolo_Dash.piskel) | [`piccolo_Dash.gif`](Dash/piccolo_Dash.gif) | [`piccolo_Dash_sheet.png`](Dash/piccolo_Dash_sheet.png) |
| **Tecnica_makanko** | 2 | 70x70 | [`piccolo_Tecnica_makanko.piskel`](Tecnica_makanko/piccolo_Tecnica_makanko.piskel) | [`piccolo_Tecnica_makanko.gif`](Tecnica_makanko/piccolo_Tecnica_makanko.gif) | [`piccolo_Tecnica_makanko_sheet.png`](Tecnica_makanko/piccolo_Tecnica_makanko_sheet.png) |
| **Tecnica_eyebeam** | 2 | 64x64 | [`piccolo_Tecnica_eyebeam.piskel`](Tecnica_eyebeam/piccolo_Tecnica_eyebeam.piskel) | [`piccolo_Tecnica_eyebeam.gif`](Tecnica_eyebeam/piccolo_Tecnica_eyebeam.gif) | [`piccolo_Tecnica_eyebeam_sheet.png`](Tecnica_eyebeam/piccolo_Tecnica_eyebeam_sheet.png) |
| **Tecnica_hellzone** | 2 | 58x58 | [`piccolo_Tecnica_hellzone.piskel`](Tecnica_hellzone/piccolo_Tecnica_hellzone.piskel) | [`piccolo_Tecnica_hellzone.gif`](Tecnica_hellzone/piccolo_Tecnica_hellzone.gif) | [`piccolo_Tecnica_hellzone_sheet.png`](Tecnica_hellzone/piccolo_Tecnica_hellzone_sheet.png) |
| **Tecnica_lightgren** | 2 | 76x76 | [`piccolo_Tecnica_lightgren.piskel`](Tecnica_lightgren/piccolo_Tecnica_lightgren.piskel) | [`piccolo_Tecnica_lightgren.gif`](Tecnica_lightgren/piccolo_Tecnica_lightgren.gif) | [`piccolo_Tecnica_lightgren_sheet.png`](Tecnica_lightgren/piccolo_Tecnica_lightgren_sheet.png) |
| **Tecnica_kiblast** | 2 | 70x70 | [`piccolo_Tecnica_kiblast.piskel`](Tecnica_kiblast/piccolo_Tecnica_kiblast.piskel) | [`piccolo_Tecnica_kiblast.gif`](Tecnica_kiblast/piccolo_Tecnica_kiblast.gif) | [`piccolo_Tecnica_kiblast_sheet.png`](Tecnica_kiblast/piccolo_Tecnica_kiblast_sheet.png) |