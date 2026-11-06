# Animaciones para Piskel — GOHANADULT (Forma 1)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/gohanadult_1/origen.json --heroe gohanadult --forma 1 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py gohanadult` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 60x60 | [`gohanadult_Idle.piskel`](Idle/gohanadult_Idle.piskel) | [`gohanadult_Idle.gif`](Idle/gohanadult_Idle.gif) | [`gohanadult_Idle_sheet.png`](Idle/gohanadult_Idle_sheet.png) |
| **Walk** | 1 | 48x48 | [`gohanadult_Walk.piskel`](Walk/gohanadult_Walk.piskel) | [`gohanadult_Walk.gif`](Walk/gohanadult_Walk.gif) | [`gohanadult_Walk_sheet.png`](Walk/gohanadult_Walk_sheet.png) |
| **Attack** | 4 | 58x58 | [`gohanadult_Attack.piskel`](Attack/gohanadult_Attack.piskel) | [`gohanadult_Attack.gif`](Attack/gohanadult_Attack.gif) | [`gohanadult_Attack_sheet.png`](Attack/gohanadult_Attack_sheet.png) |
| **Kick** | 3 | 58x58 | [`gohanadult_Kick.piskel`](Kick/gohanadult_Kick.piskel) | [`gohanadult_Kick.gif`](Kick/gohanadult_Kick.gif) | [`gohanadult_Kick_sheet.png`](Kick/gohanadult_Kick_sheet.png) |
| **Cast** | 2 | 60x60 | [`gohanadult_Cast.piskel`](Cast/gohanadult_Cast.piskel) | [`gohanadult_Cast.gif`](Cast/gohanadult_Cast.gif) | [`gohanadult_Cast_sheet.png`](Cast/gohanadult_Cast_sheet.png) |
| **Pow** | 3 | 86x86 | [`gohanadult_Pow.piskel`](Pow/gohanadult_Pow.piskel) | [`gohanadult_Pow.gif`](Pow/gohanadult_Pow.gif) | [`gohanadult_Pow_sheet.png`](Pow/gohanadult_Pow_sheet.png) |
| **Hurt** | 2 | 60x60 | [`gohanadult_Hurt.piskel`](Hurt/gohanadult_Hurt.piskel) | [`gohanadult_Hurt.gif`](Hurt/gohanadult_Hurt.gif) | [`gohanadult_Hurt_sheet.png`](Hurt/gohanadult_Hurt_sheet.png) |
| **Faint** | 1 | 60x60 | [`gohanadult_Faint.piskel`](Faint/gohanadult_Faint.piskel) | [`gohanadult_Faint.gif`](Faint/gohanadult_Faint.gif) | [`gohanadult_Faint_sheet.png`](Faint/gohanadult_Faint_sheet.png) |
| **Kick2** | 2 | 58x58 | [`gohanadult_Kick2.piskel`](Kick2/gohanadult_Kick2.piskel) | [`gohanadult_Kick2.gif`](Kick2/gohanadult_Kick2.gif) | [`gohanadult_Kick2_sheet.png`](Kick2/gohanadult_Kick2_sheet.png) |
| **Beam** | 2 | 54x54 | [`gohanadult_Beam.piskel`](Beam/gohanadult_Beam.piskel) | [`gohanadult_Beam.gif`](Beam/gohanadult_Beam.gif) | [`gohanadult_Beam_sheet.png`](Beam/gohanadult_Beam_sheet.png) |
| **Up** | 1 | 64x64 | [`gohanadult_Up.piskel`](Up/gohanadult_Up.piskel) | [`gohanadult_Up.gif`](Up/gohanadult_Up.gif) | [`gohanadult_Up_sheet.png`](Up/gohanadult_Up_sheet.png) |