# Cuerpo a cuerpo (parte A) — plan de implementación

> **Para agentes:** SUB-SKILL: superpowers:executing-plans (nativo) o superpowers:subagent-driven-development. Pasos con casillas `- [ ]`.

**Objetivo:** que acercarse a pegar no sea un suicidio, con cuatro ajustes de combate.

**Arquitectura:** los cuatro valores se agrupan en una constante `MELEE_AJ` en `script.js`, junto a `MELEE` (~línea 1067), y el código existente la usa. Una comprobación en Node lee esa constante y las líneas afectadas. La medición se hace en el navegador con un jugador automático que va a por los enemigos.

**Tecnología:** JavaScript sin dependencias; Node para comprobaciones (`vm`, como `herramientas/comprobar_enemigos.cjs`).

**Diseño:** `Planes y diseños/superpowers/specs/2026-11-02-cuerpo-a-cuerpo-design.md`

## Restricciones globales
- El juego debe seguir abriéndose con doble clic en `index.html` (nada de `fetch`).
- No cambiar daño, alcance ni enfriamiento de las técnicas.
- Textos para el usuario en español. Subir `script.js?v=` en `index.html`.
- Bitácora y commits pequeños en español (AGENTS.md).

## Foco de revisión
1. Jefes: el aturdimiento por golpe no debe dejar a un jefe bloqueado (si `bossAI` ya lo gestiona, respetarlo).
2. Teletransporte (`W.tp`): debe usar la misma distancia de parada de 20 px que el impulso.
3. Kaioken (6 golpes) y Puño del Dragón (1 golpe): la protección debe escalar con el número de golpes.
4. Enemigos kamikaze (`ET.kami`): no disparan; el cambio de distancia no les afecta.
5. Sin enemigos cerca, nada cambia (los combos solo salen con objetivo).

---

### Tarea 1: valores agrupados y comprobación

**Archivos:**
- Crear: `herramientas/comprobar_combate.cjs`
- Modificar: `02 - Código del juego/script.js` (~1067)

**Interfaces:**
- Produce: `const MELEE_AJ={sinDisparo:60,guardaExtra:0.25,empuje:0.6,aturde:0.2,parada:20}` antes de `const MELEE=`.

- [ ] **Paso 1:** escribir `comprobar_combate.cjs`: extrae `MELEE_AJ` con `tramo('const MELEE_AJ=','\n')` en un contexto `vm` y comprueba `sinDisparo===60`, `guardaExtra===0.25`, `empuje===0.6`, `aturde===0.2`, `parada===20`. Comprueba además con búsquedas en el texto que `script.js` contiene `MELEE_AJ.sinDisparo`, `MELEE_AJ.guardaExtra`, `MELEE_AJ.empuje`, `MELEE_AJ.aturde` y `MELEE_AJ.parada` (cada uno usado al menos una vez).
- [ ] **Paso 2:** `node herramientas/comprobar_combate.cjs` → FALLA («No se encuentra const MELEE_AJ=»).
- [ ] **Paso 3:** añadir la constante (las búsquedas del paso 1 seguirán fallando hasta la tarea 2).

### Tarea 2: los cuatro ajustes

**Archivos:** `02 - Código del juego/script.js`

- [ ] **Paso 1 (disparo):** línea ~1830, `if(d<170)` → `if(d>=MELEE_AJ.sinDisparo&&d<170)`.
- [ ] **Paso 2 (protección):** línea ~1222, `P.iframe=Math.max(P.iframe,0.3)` → `Math.max(P.iframe,st.hits*0.09+MELEE_AJ.guardaExtra)` (0,09 s es el paso del combo, línea ~1199).
- [ ] **Paso 3 (empuje y aturdimiento):** línea ~1200, empuje `last?1:0.25` → `last?1:MELEE_AJ.empuje`; tras `hurt`, `if(!e.boss)e.stun=Math.max(e.stun||0,MELEE_AJ.aturde)`.
- [ ] **Paso 4 (parada):** línea ~1219, `tx=t.x-d*14` → `tx=t.x-d*MELEE_AJ.parada` (lo usan impulso y teletransporte).
- [ ] **Paso 5:** `node herramientas/comprobar_combate.cjs` → PASA; `node --check "02 - Código del juego/script.js"`, `node herramientas/comprobar_enemigos.cjs`, `node herramientas/comprobar_personajes.cjs` → sin errores.
- [ ] **Paso 6:** subir `script.js?v=` en `index.html`; commit «Cuerpo a cuerpo: de cerca no disparan, el combo protege, los golpes apartan».

### Tarea 3: medir y documentar

- [ ] **Paso 1:** en el navegador (servidor local solo para depurar), jugador automático por JavaScript: cada fotograma se mueve hacia el enemigo más cercano; Goku, Kame House, dificultad normal; registra segundos vividos y daño recibido por minuto. 6 partidas con el código anterior (`git stash`) y 6 con el nuevo, mismas condiciones.
- [ ] **Paso 2:** si el resultado no mejora o se vuelve demasiado fácil, ajustar solo `MELEE_AJ` y repetir.
- [ ] **Paso 3:** partida corta sin errores en consola; captura.
- [ ] **Paso 4:** bitácora (cifras antes/después, qué no se probó), `ESTADO_ACTUAL.md`; commit.
