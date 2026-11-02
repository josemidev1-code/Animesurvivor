# Cuerpo a cuerpo que compense — diseño breve

Fecha: 2 nov. 2026. Pedido por Josemi: «los enemigos me matan demasiado rápido cuando me acerco».

## Intención
Que luchar de cerca sea un estilo viable y divertido, igual que el de distancia, sin quitar el desafío. Ahora acercarse es casi un suicidio.

## Causas encontradas (`02 - Código del juego/script.js`)
1. Los enemigos solo disparan si estás a menos de 170 px (línea ~1830): acercarse activa las balas de todo el grupo.
2. El impulso del combo te deja a 14 px del objetivo (~1219), dentro del contacto de los demás (~13 px).
3. El combo protege solo 0,3 s (~1222); al acabar sigues pegado al grupo.
4. Solo el último golpe empuja, y poco (~1200).
5. Todos los enemigos persiguen igual y disparan la misma bola.

## Enfoques
- **A. Ajustes concretos** (elegido primero): rápido, sin mecánicas nuevas.
- **B. Papeles de enemigo** (elegido después de A): enemigos que pegan con aviso y tiradores que mantienen distancia y huyen.
- C. Mecánica nueva (bloqueo/esquiva): descartada por ahora; añade controles.

Josemi eligió **A y luego B**. Este documento detalla A; B tendrá su propio diseño breve cuando A esté valorado.

## Parte A — cambios
1. **De cerca no disparan:** un enemigo a menos de 60 px no dispara (su ataque es el contacto). Entre 60 y 170 px, igual que ahora.
2. **El combo protege mientras dura:** invulnerable durante todo el combo y 0,25 s más (antes 0,3 s fijos).
3. **Golpes que apartan:** cada golpe empuja al 60 % de la fuerza (antes 25 %) y aturde 0,2 s; el último, al 100 % como ahora.
4. **El impulso no te mete dentro:** te detiene a unos 20 px del objetivo (lo justo para acertar), no a 14.

Daño, alcance y enfriamiento de las técnicas no cambian. Los jefes no se ven afectados por el aturdimiento si ya lo ignoran hoy (a comprobar).

## Cómo se comprueba
- Medir antes y después con un jugador automático que **va a por el enemigo más cercano** usando técnicas de golpe (el de la sesión del 1 nov. huía; no se encontró su script en `herramientas/`, hay que rehacerlo o recuperarlo). Comparar supervivencia y daño recibido por minuto con varias partidas iguales.
- Comprobaciones habituales (`node --check`, `comprobar_*`) y partida en el navegador sin errores.
- Josemi lo juega y valora. Las cifras automáticas solo sirven para comparar.

## Decisiones mías (revisables)
- Los números (60 px, 0,25 s, 60 %, 0,2 s, 20 px) son un punto de partida; se ajustan según la medición.
- Subir la versión de `script.js` en `index.html`.
