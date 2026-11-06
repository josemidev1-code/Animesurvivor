# Animaciones para Piskel — JANEMBA (Forma 0)

Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).

## Cómo abrir en Piskel:
1. Entra a **https://www.piskelapp.com/p/create/sprite** en tu navegador.
2. Haz clic en el icono de carpeta de la barra derecha (**Import**).
3. Elige cualquiera de estas opciones:
   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.
   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).
   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).

## Volver al juego:
`python herramientas/importar_piskel.py editado.piskel --manifiesto piskel_animaciones/janemba_0/origen.json --heroe janemba --forma 0 --anim attack --aplicar`
Después: `python herramientas/montar_animaciones.py janemba` y revisión visual. Solo se aceptan sprites originales exportados.

## Animaciones disponibles:

| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |
|---|---|---|---|---|---|
| **Idle** | 2 | 74x74 | [`janemba_Idle.piskel`](Idle/janemba_Idle.piskel) | [`janemba_Idle.gif`](Idle/janemba_Idle.gif) | [`janemba_Idle_sheet.png`](Idle/janemba_Idle_sheet.png) |
| **Walk** | 1 | 58x58 | [`janemba_Walk.piskel`](Walk/janemba_Walk.piskel) | [`janemba_Walk.gif`](Walk/janemba_Walk.gif) | [`janemba_Walk_sheet.png`](Walk/janemba_Walk_sheet.png) |
| **Attack** | 3 | 62x62 | [`janemba_Attack.piskel`](Attack/janemba_Attack.piskel) | [`janemba_Attack.gif`](Attack/janemba_Attack.gif) | [`janemba_Attack_sheet.png`](Attack/janemba_Attack_sheet.png) |
| **Kick** | 2 | 64x64 | [`janemba_Kick.piskel`](Kick/janemba_Kick.piskel) | [`janemba_Kick.gif`](Kick/janemba_Kick.gif) | [`janemba_Kick_sheet.png`](Kick/janemba_Kick_sheet.png) |
| **Cast** | 2 | 62x62 | [`janemba_Cast.piskel`](Cast/janemba_Cast.piskel) | [`janemba_Cast.gif`](Cast/janemba_Cast.gif) | [`janemba_Cast_sheet.png`](Cast/janemba_Cast_sheet.png) |
| **Pow** | 3 | 102x102 | [`janemba_Pow.piskel`](Pow/janemba_Pow.piskel) | [`janemba_Pow.gif`](Pow/janemba_Pow.gif) | [`janemba_Pow_sheet.png`](Pow/janemba_Pow_sheet.png) |
| **Hurt** | 2 | 62x62 | [`janemba_Hurt.piskel`](Hurt/janemba_Hurt.piskel) | [`janemba_Hurt.gif`](Hurt/janemba_Hurt.gif) | [`janemba_Hurt_sheet.png`](Hurt/janemba_Hurt_sheet.png) |
| **Faint** | 1 | 80x80 | [`janemba_Faint.piskel`](Faint/janemba_Faint.piskel) | [`janemba_Faint.gif`](Faint/janemba_Faint.gif) | [`janemba_Faint_sheet.png`](Faint/janemba_Faint_sheet.png) |
| **Kick2** | 2 | 66x66 | [`janemba_Kick2.piskel`](Kick2/janemba_Kick2.piskel) | [`janemba_Kick2.gif`](Kick2/janemba_Kick2.gif) | [`janemba_Kick2_sheet.png`](Kick2/janemba_Kick2_sheet.png) |
| **Beam** | 2 | 62x62 | [`janemba_Beam.piskel`](Beam/janemba_Beam.piskel) | [`janemba_Beam.gif`](Beam/janemba_Beam.gif) | [`janemba_Beam_sheet.png`](Beam/janemba_Beam_sheet.png) |
| **Tecnica_dimsword** | 4 | 82x82 | [`janemba_Tecnica_dimsword.piskel`](Tecnica_dimsword/janemba_Tecnica_dimsword.piskel) | [`janemba_Tecnica_dimsword.gif`](Tecnica_dimsword/janemba_Tecnica_dimsword.gif) | [`janemba_Tecnica_dimsword_sheet.png`](Tecnica_dimsword/janemba_Tecnica_dimsword_sheet.png) |
| **Tecnica_rakshasa** | 4 | 82x82 | [`janemba_Tecnica_rakshasa.piskel`](Tecnica_rakshasa/janemba_Tecnica_rakshasa.piskel) | [`janemba_Tecnica_rakshasa.gif`](Tecnica_rakshasa/janemba_Tecnica_rakshasa.gif) | [`janemba_Tecnica_rakshasa_sheet.png`](Tecnica_rakshasa/janemba_Tecnica_rakshasa_sheet.png) |