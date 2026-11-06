# Animaciones para Piskel — GOKUBROLY (Forma 0)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/gokubroly_0/origen.json --heroe gokubroly --forma 0 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py gokubroly` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 56x56 | [`gokubroly_Idle.piskel`](Idle/gokubroly_Idle.piskel) | [`gokubroly_Idle.gif`](Idle/gokubroly_Idle.gif) | [`gokubroly_Idle_sheet.png`](Idle/gokubroly_Idle_sheet.png) |
| **Walk** | 1 | 66x66 | [`gokubroly_Walk.piskel`](Walk/gokubroly_Walk.piskel) | [`gokubroly_Walk.gif`](Walk/gokubroly_Walk.gif) | [`gokubroly_Walk_sheet.png`](Walk/gokubroly_Walk_sheet.png) |
| **Attack** | 4 | 58x58 | [`gokubroly_Attack.piskel`](Attack/gokubroly_Attack.piskel) | [`gokubroly_Attack.gif`](Attack/gokubroly_Attack.gif) | [`gokubroly_Attack_sheet.png`](Attack/gokubroly_Attack_sheet.png) |
| **Kick** | 3 | 54x54 | [`gokubroly_Kick.piskel`](Kick/gokubroly_Kick.piskel) | [`gokubroly_Kick.gif`](Kick/gokubroly_Kick.gif) | [`gokubroly_Kick_sheet.png`](Kick/gokubroly_Kick_sheet.png) |
| **Cast** | 2 | 60x60 | [`gokubroly_Cast.piskel`](Cast/gokubroly_Cast.piskel) | [`gokubroly_Cast.gif`](Cast/gokubroly_Cast.gif) | [`gokubroly_Cast_sheet.png`](Cast/gokubroly_Cast_sheet.png) |
| **Pow** | 2 | 86x86 | [`gokubroly_Pow.piskel`](Pow/gokubroly_Pow.piskel) | [`gokubroly_Pow.gif`](Pow/gokubroly_Pow.gif) | [`gokubroly_Pow_sheet.png`](Pow/gokubroly_Pow_sheet.png) |
| **Hurt** | 2 | 56x56 | [`gokubroly_Hurt.piskel`](Hurt/gokubroly_Hurt.piskel) | [`gokubroly_Hurt.gif`](Hurt/gokubroly_Hurt.gif) | [`gokubroly_Hurt_sheet.png`](Hurt/gokubroly_Hurt_sheet.png) |
| **Faint** | 1 | 54x54 | [`gokubroly_Faint.piskel`](Faint/gokubroly_Faint.piskel) | [`gokubroly_Faint.gif`](Faint/gokubroly_Faint.gif) | [`gokubroly_Faint_sheet.png`](Faint/gokubroly_Faint_sheet.png) |
| **Attack2** | 3 | 58x58 | [`gokubroly_Attack2.piskel`](Attack2/gokubroly_Attack2.piskel) | [`gokubroly_Attack2.gif`](Attack2/gokubroly_Attack2.gif) | [`gokubroly_Attack2_sheet.png`](Attack2/gokubroly_Attack2_sheet.png) |
| **Attack3** | 2 | 56x56 | [`gokubroly_Attack3.piskel`](Attack3/gokubroly_Attack3.piskel) | [`gokubroly_Attack3.gif`](Attack3/gokubroly_Attack3.gif) | [`gokubroly_Attack3_sheet.png`](Attack3/gokubroly_Attack3_sheet.png) |
| **Beam** | 2 | 52x52 | [`gokubroly_Beam.piskel`](Beam/gokubroly_Beam.piskel) | [`gokubroly_Beam.gif`](Beam/gokubroly_Beam.gif) | [`gokubroly_Beam_sheet.png`](Beam/gokubroly_Beam_sheet.png) |
| **Up** | 2 | 68x68 | [`gokubroly_Up.piskel`](Up/gokubroly_Up.piskel) | [`gokubroly_Up.gif`](Up/gokubroly_Up.gif) | [`gokubroly_Up_sheet.png`](Up/gokubroly_Up_sheet.png) |
| **Dash** | 1 | 66x66 | [`gokubroly_Dash.piskel`](Dash/gokubroly_Dash.piskel) | [`gokubroly_Dash.gif`](Dash/gokubroly_Dash.gif) | [`gokubroly_Dash_sheet.png`](Dash/gokubroly_Dash_sheet.png) |
| **Tecnica_kame** | 2 | 52x52 | [`gokubroly_Tecnica_kame.piskel`](Tecnica_kame/gokubroly_Tecnica_kame.piskel) | [`gokubroly_Tecnica_kame.gif`](Tecnica_kame/gokubroly_Tecnica_kame.gif) | [`gokubroly_Tecnica_kame_sheet.png`](Tecnica_kame/gokubroly_Tecnica_kame_sheet.png) |
| **Tecnica_genki** | 2 | 68x68 | [`gokubroly_Tecnica_genki.piskel`](Tecnica_genki/gokubroly_Tecnica_genki.piskel) | [`gokubroly_Tecnica_genki.gif`](Tecnica_genki/gokubroly_Tecnica_genki.gif) | [`gokubroly_Tecnica_genki_sheet.png`](Tecnica_genki/gokubroly_Tecnica_genki_sheet.png) |