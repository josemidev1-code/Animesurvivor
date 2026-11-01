# Instrucciones para cualquier IA que trabaje en este proyecto

Este proyecto lo continúan varias IAs (Claude, Codex…) por turnos: cuando una llega a su límite, sigue otra.
Para que nadie pierda el hilo, **todas las IAs deben cumplir estas reglas**.

## Al empezar

1. Lee `01 - Guía y documentación/ESTADO_ACTUAL.md` y consulta las últimas entradas de `01 - Guía y documentación/BITACORA.md` si necesitas el relevo. Consulta `01 - Guía y documentación/TAREAS_CODEX.md` para prioridades, `01 - Guía y documentación/INDICE_SPRITES.md` para localizar packs y `01 - Guía y documentación/PRUEBAS_RAPIDAS.md` según la tarea. Consulta `README.md` y `01 - Guía y documentación/TAREAS_CODEX_HISTORICO.md` cuando necesites más contexto; pueden contener información histórica.
2. Si vas a tocar animaciones, lee `herramientas/GUIA_ANIMACIONES.md`.
3. Si no queda claro qué hacer, comprueba el estado actual y consulta la lista «Lo que falta» de `README.md`,
   salvo que el usuario pida otra cosa.

## Uso eficiente del contexto

- Busca archivos y fragmentos concretos; evita leer o imprimir completos `02 - Código del juego/sprites.js` y `02 - Código del juego/animaciones_juego.js` salvo necesidad. Son recursos grandes; consulta las herramientas y los datos de origen cuando corresponda.
- No recorras todos los packs de `sprites/` si la tarea afecta a un personaje o recurso concreto.
- Actualiza `01 - Guía y documentación/ESTADO_ACTUAL.md` al cambiar el estado o el relevo; conserva la bitácora como historial. Regenera `01 - Guía y documentación/INDICE_SPRITES.md` si cambian las selecciones de animación.

## Mientras trabajas

- **Apunta en `01 - Guía y documentación/BITACORA.md` cada cosa que te pida el usuario**, con sus palabras (resumidas si son largas),
  en cuanto te la pida. No esperes al final: el límite puede llegar en cualquier momento.
- **Apunta lo que vas haciendo** en tu entrada de la bitácora a medida que terminas cada parte (no al final de todo).
- **Haz commits pequeños y frecuentes** en git con mensajes claros en español, para que lo hecho no se pierda.
- Si dejas algo a medias, escríbelo en la bitácora («a medias: …, falta: …») antes de seguir con otra cosa.

## Antes de acabar (o si notas que se acerca tu límite)

1. Cierra tu entrada de `01 - Guía y documentación/BITACORA.md` con: qué quedó hecho, qué quedó a medias y qué debería hacer la siguiente IA.
2. Actualiza `README.md` («Cómo está ahora» y «Lo que falta») si ha cambiado algo.
3. Haz commit de todo. Si puedes, `git push` (el repositorio es `josemidev1-code/Animesurvivor`, rama `main`).

## Formato de cada entrada de la bitácora

Añade las entradas **al final** de `01 - Guía y documentación/BITACORA.md`, sin borrar las anteriores:

```markdown
## AAAA-MM-DD — <nombre de la IA> (sesión N)

### Lo que pidió el usuario
- …

### Lo que hice
- … (commit abc1234)

### A medias / problemas
- …

### Siguiente paso recomendado
- …
```

## Reglas del proyecto (decididas por el usuario)

- Personajes y enemigos **solo con sprites de la carpeta `sprites/`**, nada dibujado por código. Lo que no tenga sprites
  buenos se quita del juego y se apunta en `01 - Guía y documentación/SPRITES_PENDIENTES.md`.
- Animaciones coherentes: moverse = volar/impulsarse; cada forma con guardia, impulso, puñetazos, patadas, ki, aura,
  daño, muerte y retrato. Revisar siempre a ojo (`previsualizar.py`, `revisar_todo.py`) antes de darla por buena.
- Estilo de menú, HUD y subida de nivel como PokéSurvivor (capturas que mandó el usuario), pero sin copiar su código.
- El juego tiene que funcionar abriendo `index.html` con doble clic (nada de cargar JSON con fetch en tiempo de ejecución).
- Todo en español para el usuario.

