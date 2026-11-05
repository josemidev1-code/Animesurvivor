# Análisis Exhaustivo de PokéSurvivor (pokesurvivor.com) y Adaptación a Dragon Ball Survivor

> Análisis técnico y de diseño basado en la inspección directa del código fuente, arquitectura HTML/CSS/Canvas 2D y mecánicas de **PokéSurvivor** (`pokesurvivor.com`), desarrollado por Jonathan Piera Torregrosa (*JPTER78*).

---

## 1. Arquitectura General y Filosofía de PokéSurvivor

PokéSurvivor combina la fórmula clásica de *Vampire Survivors* y *Survivor.io* con la estética retro de *Pokémon Mundo Misterioso (PMD)*:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CANVAS 2D (#game)                               │
│  - Gameplay en tiempo real: Héroe, hordas, proyectiles, orbes y mapa   │
│  - HUD integrado in-game: Barra de vida, timer, esferas y action bar   │
└────────────────────────────────────────────────────────────────────────┘
                                ▲
                                │ Superposición de capas modales (.scr)
┌───────────────────────────────┴────────────────────────────────────────┐
│                        HTML / CSS (DOM OVERLAYS)                       │
│  - Menú principal (#scr-menu) con panel lateral derecho                │
│  - Subida de nivel (#scr-levelup) con tarjetas .card                   │
│  - Sistema de Vínculo de ataques (#scr-bond) tras derrotar jefes       │
│  - Pantalla de pausa (#scr-pause) con desglose de DPS y cartas         │
│  - Tienda, Mochila, Gacha, Misiones, Ranking y Ajustes                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comparativa Detallada: PokéSurvivor vs. Dragon Ball Survivor

| Componente | PokéSurvivor (`pokesurvivor.com`) | Dragon Ball Survivor (Adaptación) |
| :--- | :--- | :--- |
| **Paleta y Ventanas** | Azul PMD (`--box1: #2c519f`, `--box2: #1a3170`) con triple borde blanco/azul profundo y sombra `rgba(0,0,0,.55)`. | Dragon Ball Naranja / Gi de combate (`--box1: #221106`, `--box2: #100602`) con borde doble dorado ki (`#ffd23f` y `#f59e0b`). |
| **HUD: Arriba Izquierda** | Placa compacta: Nombre de la especie, nivel y barra de vida delgada de 6px (verde/roja) con barra de EXP inferior. | Placa del guerrero: Nombre del Héroe + Forma activa (ej. `GOKU · SSJ`), nivel `NV. X`, vida fina con brillo y EXP dorada. |
| **HUD: Arriba Centro** | Tiempo transcurrido (`0:14`), enemigos derrotados y avisos sutiles de hordas temporales (`HORDA DE FUEGO · 20 s`). | Tiempo (`0:14`), 7 esferas del dragón de GBA coleccionadas, contador de K.O. y avisos (`RETO DE KAIO`, `GRAVEDAD x100`). |
| **HUD: Abajo Centro (Dock)** | 4 ranuras compactas (`1`-`4`) de ataques. Resplandor dorado en el activo. Selección manual y cambio reactivo. | Dock de técnicas (`1` a `4` slots). Resaltado dorado/blanco con flecha indicadora sobre la técnica activa manual. |
| **Sistema de Ataques** | Comienzas con 1 o 2 movimientos. Desbloqueas hasta 4 ranuras conforme subes de nivel. | Comienzas con 2 ataques (básico y especial). Desbloqueas hasta 4 ranuras al subir de nivel. |
| **Mecánica de Vínculo (`#scr-bond`)** | Al derrotar a un jefe, unes 2 ataques existentes en una sola ranura: se disparan al unísono y se libera un hueco libre. | **¡Vínculo de Técnicas!**: Al derrotar un jefe, fusionas 2 ataques en una ranura (se lanzan juntos y liberan hueco para una nueva técnica). |
| **Subida de Nivel (`#scr-levelup`)** | Cuadro `.box.center` con 3 `.card`. Icono de 46px, nombre en negrita, píldora de tipo (`Especial`/`Físico`/`Evolución`), stats y tecla rápida. | Cuadro `.lupanel` con 3 tarjetas `.up`. Icono pixel art 32px nativo, píldoras (`NUEVA TÉCNICA`, `NIVEL X`, `EVOLUCIÓN`), tecla `1`-`3`. |
| **Pantalla de Pausa (`#scr-pause`)** | Controles arriba, botones (`Continuar`, `Ajustes`, `Abandonar`), desglose de ataques con DPS y daño total, estadísticas y cartas pasivas. | Pausa completa: Técnicas con daño acumulado y DPS, estadísticas completas (Vida, Daño, Velocidad, Recarga, Crítico) y cartas pasivas. |
| **Pantalla de Menú (`#scr-menu`)** | Barra superior (monedas, tickets, rank), personaje animado en el centro, y dock vertical derecho de 10 botones. | Menú Dragon Ball: Barra superior (Zeni, Tickets, Shenron), Guerrero Z animado en el centro y barra lateral derecha de navegación. |
| **Gachapón** | Gacha regional para desbloquear Pokémon y variantes shiny. | Deseos de Shenron con animación oficial de NDS para desbloquear transformaciones y guerreros Z. |

---

## 3. Desglose del Código Maestro de PokéSurvivor

### A. El Sistema de Vínculo de Movimientos (`#scr-bond`)
En PokéSurvivor, el vínculo es una de las mecánicas más adictivas:
```javascript
// Estructura de vínculo en PokéSurvivor
// Cuando dos movimientos se unen:
moveA.bondedWith = moveB;
// Ambos se ejecutan juntos en el mismo cooldown o slot
// El slot que ocupaba moveB queda vacío, permitiendo aprender otro movimiento
```
* **En Dragon Ball:** Si juegas con Goku y unes `Ráfaga de Ki` + `Kamehameha`, al pulsar `1` lanzas la ráfaga seguida inmediatamente del rayo Kamehameha ocupando una sola ranura, ¡y el hueco `2` queda libre para aprender `Genkidama` o `Golpe del Dragón`!

### B. El Estilo de Tarjetas de Nivel (`.card`)
```css
.card {
  display: flex; align-items: center; gap: 14px; text-align: left; cursor: pointer;
  background: rgba(0,0,0,.2); border: 2px solid rgba(244,248,255,.3); border-radius: 12px;
  padding: 12px 14px; transition: transform .08s, background .12s, border-color .12s;
}
.card .ico { flex: 0 0 46px; height: 46px; border-radius: 10px; display: grid; place-items: center; font-size: 24px; }
.card .nm { font-weight: 700; font-size: 18px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.card .key { font-size: 13px; color: var(--muted); border: 2px solid rgba(244,248,255,.3); border-radius: 6px; padding: 2px 8px; }
```

### C. La Ventana de Pausa con Métricas (`#scr-pause`)
* **Tus ataques:** Muestra el icono pixel art, el nombre, la píldora de categoría, el daño acumulado en la partida y el promedio de daño por segundo (DPS).
* **Tus estadísticas:** Cuadrícula de 2 columnas con vida actual/máxima, porcentaje de ataque físico y ki, velocidad de movimiento, reducción de daño, recarga y radio de imán.
* **Tus cartas y mejoras:** Listado compacto con los niveles de cada pasiva obtenida.

---

## 4. Hoja de Ruta de Implementación para Dragon Ball Survivor

1. **Integración del Vínculo de Ataques (`#scr-bond`) al derrotar jefes**:
   - Cuando muere un jefe de mapa, en lugar de un drop automático, se despliega la pantalla modal de **¡Vínculo de Técnicas!**.
   - Te permite elegir dos de tus ataques actuales para fusionarlos en una sola ranura reactiva, liberando espacio para equipar otra técnica en el siguiente nivel.
2. **Pantalla de Pausa (`#scr-pause`) idéntica a PokéSurvivor**:
   - Al pulsar `Esc`: modal con marco retro doble, botones limpios (`Continuar`, `Ajustes`, `Abandonar run`), tabla de DPS de cada técnica, panel de estadísticas en 2 columnas y cartas pasivas coleccionadas.
3. **Mantenimiento estricto de la compatibilidad**:
   - Todo empaquetado en local, ejecutable con doble clic en `index.html` sin fetch ni servidores.
