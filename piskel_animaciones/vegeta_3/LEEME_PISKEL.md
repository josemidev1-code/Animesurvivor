# Animaciones para Piskel — VEGETA (Forma 3)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/vegeta_3/origen.json --heroe vegeta --forma 3 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py vegeta` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 60x60 | [`vegeta_Idle.piskel`](Idle/vegeta_Idle.piskel) | [`vegeta_Idle.gif`](Idle/vegeta_Idle.gif) | [`vegeta_Idle_sheet.png`](Idle/vegeta_Idle_sheet.png) |
| **Walk** | 1 | 58x58 | [`vegeta_Walk.piskel`](Walk/vegeta_Walk.piskel) | [`vegeta_Walk.gif`](Walk/vegeta_Walk.gif) | [`vegeta_Walk_sheet.png`](Walk/vegeta_Walk_sheet.png) |
| **Attack** | 4 | 62x62 | [`vegeta_Attack.piskel`](Attack/vegeta_Attack.piskel) | [`vegeta_Attack.gif`](Attack/vegeta_Attack.gif) | [`vegeta_Attack_sheet.png`](Attack/vegeta_Attack_sheet.png) |
| **Kick** | 2 | 64x64 | [`vegeta_Kick.piskel`](Kick/vegeta_Kick.piskel) | [`vegeta_Kick.gif`](Kick/vegeta_Kick.gif) | [`vegeta_Kick_sheet.png`](Kick/vegeta_Kick_sheet.png) |
| **Cast** | 2 | 72x72 | [`vegeta_Cast.piskel`](Cast/vegeta_Cast.piskel) | [`vegeta_Cast.gif`](Cast/vegeta_Cast.gif) | [`vegeta_Cast_sheet.png`](Cast/vegeta_Cast_sheet.png) |
| **Pow** | 3 | 100x100 | [`vegeta_Pow.piskel`](Pow/vegeta_Pow.piskel) | [`vegeta_Pow.gif`](Pow/vegeta_Pow.gif) | [`vegeta_Pow_sheet.png`](Pow/vegeta_Pow_sheet.png) |
| **Hurt** | 2 | 56x56 | [`vegeta_Hurt.piskel`](Hurt/vegeta_Hurt.piskel) | [`vegeta_Hurt.gif`](Hurt/vegeta_Hurt.gif) | [`vegeta_Hurt_sheet.png`](Hurt/vegeta_Hurt_sheet.png) |
| **Faint** | 1 | 58x58 | [`vegeta_Faint.piskel`](Faint/vegeta_Faint.piskel) | [`vegeta_Faint.gif`](Faint/vegeta_Faint.gif) | [`vegeta_Faint_sheet.png`](Faint/vegeta_Faint_sheet.png) |
| **Attack2** | 2 | 56x56 | [`vegeta_Attack2.piskel`](Attack2/vegeta_Attack2.piskel) | [`vegeta_Attack2.gif`](Attack2/vegeta_Attack2.gif) | [`vegeta_Attack2_sheet.png`](Attack2/vegeta_Attack2_sheet.png) |
| **Kick2** | 2 | 64x64 | [`vegeta_Kick2.piskel`](Kick2/vegeta_Kick2.piskel) | [`vegeta_Kick2.gif`](Kick2/vegeta_Kick2.gif) | [`vegeta_Kick2_sheet.png`](Kick2/vegeta_Kick2_sheet.png) |
| **Beam** | 2 | 72x72 | [`vegeta_Beam.piskel`](Beam/vegeta_Beam.piskel) | [`vegeta_Beam.gif`](Beam/vegeta_Beam.gif) | [`vegeta_Beam_sheet.png`](Beam/vegeta_Beam_sheet.png) |
| **Up** | 1 | 56x56 | [`vegeta_Up.piskel`](Up/vegeta_Up.piskel) | [`vegeta_Up.gif`](Up/vegeta_Up.gif) | [`vegeta_Up_sheet.png`](Up/vegeta_Up_sheet.png) |
| **Dash** | 1 | 58x58 | [`vegeta_Dash.piskel`](Dash/vegeta_Dash.piskel) | [`vegeta_Dash.gif`](Dash/vegeta_Dash.gif) | [`vegeta_Dash_sheet.png`](Dash/vegeta_Dash_sheet.png) |
| **Tecnica_galick** | 2 | 72x72 | [`vegeta_Tecnica_galick.piskel`](Tecnica_galick/vegeta_Tecnica_galick.piskel) | [`vegeta_Tecnica_galick.gif`](Tecnica_galick/vegeta_Tecnica_galick.gif) | [`vegeta_Tecnica_galick_sheet.png`](Tecnica_galick/vegeta_Tecnica_galick_sheet.png) |
| **Tecnica_finalflash** | 2 | 72x72 | [`vegeta_Tecnica_finalflash.piskel`](Tecnica_finalflash/vegeta_Tecnica_finalflash.piskel) | [`vegeta_Tecnica_finalflash.gif`](Tecnica_finalflash/vegeta_Tecnica_finalflash.gif) | [`vegeta_Tecnica_finalflash_sheet.png`](Tecnica_finalflash/vegeta_Tecnica_finalflash_sheet.png) |