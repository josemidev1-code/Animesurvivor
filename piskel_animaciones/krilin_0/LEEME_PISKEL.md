# Animaciones para Piskel — KRILIN (Forma 0)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/krilin_0/origen.json --heroe krilin --forma 0 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py krilin` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 52x52 | [`krilin_Idle.piskel`](Idle/krilin_Idle.piskel) | [`krilin_Idle.gif`](Idle/krilin_Idle.gif) | [`krilin_Idle_sheet.png`](Idle/krilin_Idle_sheet.png) |
| **Walk** | 1 | 58x58 | [`krilin_Walk.piskel`](Walk/krilin_Walk.piskel) | [`krilin_Walk.gif`](Walk/krilin_Walk.gif) | [`krilin_Walk_sheet.png`](Walk/krilin_Walk_sheet.png) |
| **Attack** | 3 | 58x58 | [`krilin_Attack.piskel`](Attack/krilin_Attack.piskel) | [`krilin_Attack.gif`](Attack/krilin_Attack.gif) | [`krilin_Attack_sheet.png`](Attack/krilin_Attack_sheet.png) |
| **Kick** | 2 | 62x62 | [`krilin_Kick.piskel`](Kick/krilin_Kick.piskel) | [`krilin_Kick.gif`](Kick/krilin_Kick.gif) | [`krilin_Kick_sheet.png`](Kick/krilin_Kick_sheet.png) |
| **Cast** | 2 | 50x50 | [`krilin_Cast.piskel`](Cast/krilin_Cast.piskel) | [`krilin_Cast.gif`](Cast/krilin_Cast.gif) | [`krilin_Cast_sheet.png`](Cast/krilin_Cast_sheet.png) |
| **Pow** | 3 | 128x128 | [`krilin_Pow.piskel`](Pow/krilin_Pow.piskel) | [`krilin_Pow.gif`](Pow/krilin_Pow.gif) | [`krilin_Pow_sheet.png`](Pow/krilin_Pow_sheet.png) |
| **Hurt** | 2 | 54x54 | [`krilin_Hurt.piskel`](Hurt/krilin_Hurt.piskel) | [`krilin_Hurt.gif`](Hurt/krilin_Hurt.gif) | [`krilin_Hurt_sheet.png`](Hurt/krilin_Hurt_sheet.png) |
| **Faint** | 1 | 62x62 | [`krilin_Faint.piskel`](Faint/krilin_Faint.piskel) | [`krilin_Faint.gif`](Faint/krilin_Faint.gif) | [`krilin_Faint_sheet.png`](Faint/krilin_Faint_sheet.png) |
| **Attack3** | 2 | 54x54 | [`krilin_Attack3.piskel`](Attack3/krilin_Attack3.piskel) | [`krilin_Attack3.gif`](Attack3/krilin_Attack3.gif) | [`krilin_Attack3_sheet.png`](Attack3/krilin_Attack3_sheet.png) |
| **Kick2** | 2 | 62x62 | [`krilin_Kick2.piskel`](Kick2/krilin_Kick2.piskel) | [`krilin_Kick2.gif`](Kick2/krilin_Kick2.gif) | [`krilin_Kick2_sheet.png`](Kick2/krilin_Kick2_sheet.png) |
| **Beam** | 2 | 50x50 | [`krilin_Beam.piskel`](Beam/krilin_Beam.piskel) | [`krilin_Beam.gif`](Beam/krilin_Beam.gif) | [`krilin_Beam_sheet.png`](Beam/krilin_Beam_sheet.png) |
| **Up** | 2 | 50x50 | [`krilin_Up.piskel`](Up/krilin_Up.piskel) | [`krilin_Up.gif`](Up/krilin_Up.gif) | [`krilin_Up_sheet.png`](Up/krilin_Up_sheet.png) |
| **Dash** | 1 | 58x58 | [`krilin_Dash.piskel`](Dash/krilin_Dash.piskel) | [`krilin_Dash.gif`](Dash/krilin_Dash.gif) | [`krilin_Dash_sheet.png`](Dash/krilin_Dash_sheet.png) |
| **Tecnica_kienzan** | 2 | 54x54 | [`krilin_Tecnica_kienzan.piskel`](Tecnica_kienzan/krilin_Tecnica_kienzan.piskel) | [`krilin_Tecnica_kienzan.gif`](Tecnica_kienzan/krilin_Tecnica_kienzan.gif) | [`krilin_Tecnica_kienzan_sheet.png`](Tecnica_kienzan/krilin_Tecnica_kienzan_sheet.png) |
| **Tecnica_taiyoken** | 1 | 62x62 | [`krilin_Tecnica_taiyoken.piskel`](Tecnica_taiyoken/krilin_Tecnica_taiyoken.piskel) | [`krilin_Tecnica_taiyoken.gif`](Tecnica_taiyoken/krilin_Tecnica_taiyoken.gif) | [`krilin_Tecnica_taiyoken_sheet.png`](Tecnica_taiyoken/krilin_Tecnica_taiyoken_sheet.png) |