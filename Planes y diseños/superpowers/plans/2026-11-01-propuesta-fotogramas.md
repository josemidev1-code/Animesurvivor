# Bloque 1 · Herramienta que propone fotogramas — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una herramienta que propone, con nota de confianza, los fotogramas de cada pack de `sprites/` (y sus efectos de técnica), una página para que el usuario revise solo los dudosos, y el movimiento de las 171 formas actuales arreglado.

**Architecture:** Scripts Python sueltos en `herramientas/`, como los que ya hay, que reutilizan `montar_animaciones.py` (`frames_del_pack`, `limpiar`, `escala_pixel`, `ALTO_BASE`). Flujo: medir rasgos de cada fotograma (con caché) → reglas y plantillas por autor proponen una selección con confianza → se marca «dudoso» con motivos → hoja para la IA → página HTML para el usuario → `decisiones.json` → se aplica a las selecciones. El quitado de polvo vive en el montaje.

**Tech Stack:** Python 3.14 + Pillow 13 (sin numpy ni pytest: pruebas con `unittest` de la biblioteca estándar), HTML/JS sin dependencias para la página de revisión, Node para las comprobaciones existentes.

**Spec:** `Planes y diseños/superpowers/specs/2026-11-01-propuesta-fotogramas-design.md`

## Global Constraints

- Python: `C:\Users\soyjo\AppData\Local\Programs\Python\Python314\python.exe` con `PYTHONIOENCODING=utf-8` (en bash, `python3` se cuelga). En los comandos de abajo, `$PY` es esa ruta.
- Pruebas: `"$PY" -m unittest discover -s herramientas/pruebas -v` desde la raíz del proyecto. Las que necesitan `sprites/` (no está en git) se saltan con `unittest.skipUnless(os.path.isdir(SPRITES), ...)`.
- Sin dependencias nuevas. Nada dibujado por código en el juego.
- El juego tiene que seguir funcionando con doble clic en `index.html`; no cambiar el formato que lee `script.js` (`window.ANIM_SET`).
- Animaciones obligatorias: `idle`, `move`, `attack`, `kick`, `ki`, `hurt`. No obligatorias: `pow`, `faint`, `portrait`.
- Umbrales del spec: mancha suelta > 5 % de los píxeles opacos; agachada si alto de `Walk` < 70 % del alto del primer `Idle`; tamaño desigual si `escala_pixel` difiere > 15 % de la del primer `Idle`; efecto puro si < ~15 % de colores en común con la guardia; rayo si ancho > 2,2 × alto.
- Objetivo de la validación: ≥ 80 % de aciertos en las obligatorias; tras la revisión de la IA, como mucho 1 de cada 5 packs llega al usuario.
- Goku base (`goku/0`, `gokuui/0`) conserva `move: [7]`; solo se le quita el polvo.
- Nunca se reescribe una selección hecha a mano sin pasar por revisión; al cambiarla se guarda la anterior en `"<anim>Antes"`.
- Propuestas en `herramientas/propuestas/` (fuera de `herramientas/animaciones/`, que `leer_config()` monta entero).
- `herramientas/_revisar/` ya está en `.gitignore`: hojas, caché y página van ahí.
- Todo texto para el usuario, en español. Tras cada tarea: entrada en `BITACORA.md` y commit con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Cuerpo partido (espada de Trunks, cola de Cell, aura separada):** quitar el polvo no debe borrar partes del cuerpo. Solo se quitan manchas sueltas pequeñas (cada una < 25 % de la mancha principal); prueba en la Tarea 2.
2. **Packs que miran a la izquierda (`"espejo": true`) o sin espejo declarado:** la regla de «salto hacia atrás» debe usar el sentido real del pack; prueba en la Tarea 4.
3. **Packs raros:** con menos de 8 fotogramas, con fotogramas vacíos tras limpiar o con nombres con tildes mal codificadas, la herramienta marca el pack como dudoso con motivo y no se rompe; prueba en la Tarea 4.
4. **Caché vieja:** si cambian los archivos de un pack, las medidas se recalculan; prueba en la Tarea 3.
5. **`decisiones.json` de una página antigua:** packs o formas que ya no existen se ignoran con un aviso, sin escribir nada; prueba en la Tarea 8.

---

### Task 1: Medición de las formas del juego en el proyecto

**Files:**
- Create: `herramientas/medir_formas.py` (a partir de `Planes y diseños/superpowers/specs/2026-11-01-medicion-formas.py`)
- Create: `herramientas/pruebas/__init__.py` (vacío), `herramientas/pruebas/test_medir_formas.py`

**Interfaces:**
- Produces: `medir(ruta_js: str) -> list[dict]`, una fila por forma: `{'id': 'goku/0', 'pack': str, 'Walk'|'Attack'|...: float (escala relativa a la guardia), 'suelto': float, 'altoWalk': int, 'altoIdle': int}`; `problemas(filas) -> dict[str, list[str]]` con claves `'sueltos'`, `'agachadas'`, `'desiguales'`. CLI: `"$PY" herramientas/medir_formas.py` imprime las tres listas y sus totales.

- [ ] **Step 1: Write the failing test** — `test_linea_base`: con el `animaciones_juego.js` actual, `len(problemas(medir(...))['sueltos']) == 21`, `'agachadas' == 16`, `'desiguales' == 4`, y `'goku/0' in sueltos`, `'vegetasuper/2' in desiguales`. `test_mancha_sintetica`: una imagen 20×20 con un bloque de 10×10 y un punto suelto de 2×2 da `suelto ≈ 4/104`.
- [ ] **Step 2:** Run `"$PY" -m unittest herramientas.pruebas.test_medir_formas -v` → FAIL (módulo no existe).
- [ ] **Step 3:** Copiar el script del spec a `herramientas/medir_formas.py`, convertir el cuerpo en `medir()` y `problemas()` (definiciones exactas del spec: vecindad 8, umbrales 5 %, 70 %, 15 %) y dejar la impresión en `if __name__ == '__main__'`. Borrar la copia de `Planes y diseños/superpowers/specs/` y cambiar la referencia del spec a `herramientas/medir_formas.py`.
- [ ] **Step 4:** Run the test → PASS (tarda unos minutos: decodifica las 171 formas).
- [ ] **Step 5: Commit** — `git add herramientas/medir_formas.py herramientas/pruebas Planes y diseños BITACORA.md && git commit -m "Medición de polvo, poses agachadas y tamaños de las formas del juego"`

### Task 2: Quitar polvo y chispas sueltas al montar

**Files:**
- Modify: `herramientas/montar_animaciones.py` (`cargar_forma`, nueva función junto a `ancla`)
- Modify: `herramientas/GUIA_ANIMACIONES.md` (opción `"conservarSueltos"`)
- Test: `herramientas/pruebas/test_sueltos.py`

**Interfaces:**
- Produces: `quitar_sueltos(im: Image.Image, max_parte: float = 0.25) -> Image.Image` — deja la mancha principal (vecindad 8) y borra cada mancha separada cuyo tamaño sea < `max_parte` × la principal; las mayores se conservan (cuerpo partido). En `cargar_forma`, se aplica a los fotogramas de `move` ya reducidos, salvo si la forma tiene `"conservarSueltos": true`.

- [ ] **Step 1: Write the failing tests** — `test_borra_polvo`: bloque 30×30 + mancha 5×5 separada → queda solo el bloque (píxeles opacos == 900). `test_conserva_parte_grande`: bloque 30×30 + bloque separado 16×16 (28 % de la principal) → se conservan los dos. `test_goku_base_sin_polvo` (requiere sprites): `cargar_forma` de `goku/0` → `anims['Walk'][0]` tiene una sola mancha.
- [ ] **Step 2:** Run `"$PY" -m unittest herramientas.pruebas.test_sueltos -v` → FAIL.
- [ ] **Step 3:** Implementar `quitar_sueltos` y engancharla en `cargar_forma` después de `peq` (antes del espejo); documentar `"conservarSueltos"` en la guía (sección de opcionales).
- [ ] **Step 4:** Run the tests → PASS. Run `"$PY" herramientas/montar_animaciones.py` y `"$PY" herramientas/medir_formas.py` → lista `sueltos` vacía (si queda alguna, mirarla con `previsualizar.py` y decidir si lleva `conservarSueltos`).
- [ ] **Step 5:** `node herramientas/comprobar_personajes.cjs` y `node herramientas/comprobar_enemigos.cjs` → sin errores. Subir `?v=63` a `?v=64` en todas las apariciones de `index.html`.
- [ ] **Step 6: Commit** — `git add herramientas index.html animaciones_juego.js BITACORA.md && git commit -m "Moverse sin polvo ni chispas pegadas en las 21 formas que lo tenían"`

### Task 3: Rasgos de cada fotograma, con caché

**Files:**
- Create: `herramientas/rasgos.py`
- Test: `herramientas/pruebas/test_rasgos.py`

**Interfaces:**
- Consumes: `frames_del_pack`, `limpiar`, `escala_pixel` de `montar_animaciones`.
- Produces:
  - `nombre_pack(pack: str) -> str` — nombre de archivo estable: `re.sub(r'[^0-9A-Za-z]+', '_', unicodedata.normalize('NFKD', pack).encode('ascii','ignore').decode())[:120]`.
  - `rasgos_pack(pack: str, cache_dir: str = 'herramientas/_revisar/medidas') -> list[dict]` — un dict por fotograma, en el orden de `frames_del_pack`: `{'i': int, 'vacio': bool, 'escala': float, 'alto': int, 'ancho': int, 'prop': float (ancho/alto), 'incl': float, 'sueltos': float, 'sueltoX': float|None, 'paleta': list[[r,g,b,n]], 'silueta': str}`. Medidas sobre el fotograma reducido a su píxel real (`escala`). `incl` = (x del centro de la mitad superior − x del centro de la mitad inferior) / alto; positivo = inclinado a la derecha. `sueltoX` = x media de las manchas sueltas respecto al centro del cuerpo, normalizada (positivo = delante si mira a la derecha). `paleta` cuantizada a 16 niveles por canal. `silueta` = máscara 16×16 en hex para comparar formas.
  - `comun(paleta_a, paleta_b) -> float` — fracción de píxeles de `a` cuyos colores están en `b`.
  - `parecido(sil_a: str, sil_b: str) -> float` — 1 − distancia de Hamming / 256.
  - Caché: `<cache_dir>/<nombre_pack>.json` con clave `firma` = lista de `[nombre, tamaño, mtime]` de los archivos; si no coincide, se recalcula.

- [ ] **Step 1: Write the failing tests** — `test_nombre_pack_estable`: `nombre_pack('01_x/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS')` no tiene espacios, comas ni tildes y es igual llamado dos veces. `test_inclinacion`: imagen sintética en diagonal hacia la derecha → `incl > 0`. `test_cache_se_invalida`: pack temporal (carpeta en `tempfile` dentro de un `SPRITES` parcheado) con 2 PNG; tras medir, se cambia uno → `rasgos_pack` vuelve a medir (contar llamadas a `limpiar` con `unittest.mock`). `test_goku_rayo` (requiere sprites): en el pack de Goku base, el fotograma 38 tiene `prop > 2.2`.
- [ ] **Step 2:** Run `"$PY" -m unittest herramientas.pruebas.test_rasgos -v` → FAIL.
- [ ] **Step 3:** Implementar en `herramientas/rasgos.py` con las firmas de arriba. Recorrer los fotogramas reducidos (no los HD) para las medidas de manchas y silueta.
- [ ] **Step 4:** Run the tests → PASS. Medir todos los packs una vez para llenar la caché: `"$PY" -c "import sys;sys.path.insert(0,'herramientas');import rasgos,montar_animaciones as m;[rasgos.rasgos_pack(f['pack']) for h in m.leer_config().values() for f in h.values()]"` (en segundo plano: tarda decenas de minutos).
- [ ] **Step 5: Commit** — `git add herramientas/rasgos.py herramientas/pruebas BITACORA.md && git commit -m "Rasgos de cada fotograma de un pack, con caché"`

### Task 4: Reglas, confianza y «dudoso»

**Files:**
- Create: `herramientas/proponer_fotogramas.py`
- Test: `herramientas/pruebas/test_proponer.py`

**Interfaces:**
- Consumes: `rasgos_pack`, `comun`, `parecido`, `nombre_pack` (Tarea 3).
- Produces:
  - `OBLIGATORIAS = ('idle','move','attack','kick','ki','hurt')`, `UMBRAL = 0.6` (ajustable en la Tarea 6).
  - `elegir_guardia(rs: list[dict]) -> int` — entre los 8 primeros fotogramas no vacíos, el más alto con `prop < 0.9` y `|incl|` pequeño.
  - `clasificar(rs: list[dict], espejo: bool = False) -> dict` — `{'idle': [int], 'move': [...], 'attack': [...], 'kick': [...], 'ki': [...], 'pow': [...], 'hurt': [...], 'faint': [...], 'portrait': int|None, 'confianza': {anim: float}, 'efectos': {'rayo': [...], 'bola': [...], 'aura': [...], 'estela': [...]}}`. Las reglas concretas y sus pesos son del implementador (spec, «Diseño» §2); deben respetar: efecto puro si `comun < 0.15` (rayo si `prop > 2.2`); `move` inclinado hacia donde mira el pack (`espejo` invierte el signo) y sin `sueltoX` delante; los grupos se buscan como fotogramas seguidos.
  - `motivos_dudoso(prop: dict, rs: list[dict]) -> list[str]` — textos en español: falta una obligatoria, confianza < `UMBRAL`, `move` < 70 % del alto de la guardia, escala > 15 % distinta de la guardia, `move` con polvo delante (salto hacia atrás), pack con < 8 fotogramas útiles. Lista vacía = seguro.
  - `proponer(pack: str, espejo: bool = False) -> dict` — `clasificar` + `{'pack': pack, 'motivos': [...], 'dudoso': bool}`.

- [ ] **Step 1: Write the failing tests** — Sintéticos (lista de dicts de rasgos fabricados): `test_motivos_falta_obligatoria` (sin candidatos de patada → motivo que contiene «patada»); `test_salto_atras` (move con `sueltoX > 0` y `espejo=False` → motivo «hacia atrás»; con `espejo=True` y `sueltoX < 0` → mismo motivo); `test_pack_corto` (5 fotogramas → dudoso, sin excepción); `test_vacios_no_rompen` (fotogramas con `vacio=True` se ignoran). Con sprites: `test_goku_base` → `idle` ⊂ 0..6, `38` o `39` en `efectos['rayo']`, `53` en `efectos['bola']`, `portrait` ∈ {59, 60}, `move` no contiene 9 ni 10.
- [ ] **Step 2:** Run `"$PY" -m unittest herramientas.pruebas.test_proponer -v` → FAIL.
- [ ] **Step 3:** Implementar las funciones con las firmas de arriba.
- [ ] **Step 4:** Run the tests → PASS.
- [ ] **Step 5: Commit** — `git add herramientas/proponer_fotogramas.py herramientas/pruebas BITACORA.md && git commit -m "Reglas que proponen fotogramas con confianza y motivos de duda"`

### Task 5: Plantillas por autor y archivos de propuesta

**Files:**
- Modify: `herramientas/proponer_fotogramas.py`
- Test: `herramientas/pruebas/test_plantillas.py`

**Interfaces:**
- Produces:
  - `autor_de(pack: str) -> str|None` — de la línea «Carpeta original» de `_ORIGEN_Y_CREDITOS.md` o del nombre de la carpeta; mayúsculas sin tildes; reconoce `ANDRES GAMEN` y el autor entre paréntesis al final (`(TheWarriorFF2)` → `THEWARRIORFF2`).
  - `manuales() -> dict[str, list[tuple[str, dict]]]` — selecciones a mano de `leer_config()` agrupadas por pack: `{pack: [('goku/0', forma), ...]}`.
  - `plantilla(pack: str, rs: list[dict], excluir: set[str] = frozenset()) -> dict|None` — entre packs a mano del mismo autor con el mismo número de fotogramas (y que no estén en `excluir`), el de mayor `parecido` medio en los índices elegidos; si ese parecido ≥ 0.8, devuelve su selección con confianza 0.9 en cada animación.
  - `proponer(pack: str, espejo: bool = False, guardar: bool = True, excluir: frozenset = frozenset()) -> dict` (firma definitiva; amplía la de la Tarea 4) usa la plantilla si existe y si no las reglas; si `guardar`, guarda en `herramientas/propuestas/<nombre_pack>.json` con `{'pack','autor','origen': 'plantilla'|'reglas', ...}`. CLI: `"$PY" herramientas/proponer_fotogramas.py <pack> [<pack> ...]` o `--todos` (todos los packs de `sprites/`).
- [ ] **Step 1: Write the failing tests** — `test_autor_andres`: el pack de Goku base → `'ANDRES GAMEN'`; `test_autor_parentesis`: `'.../400_SOLDADO DE FREEZER (TheWarriorFF2)'` → `'THEWARRIORFF2'`; con sprites: `test_plantilla_otro_goku`: para el pack de Goku SSJ (`goku/1`) con `excluir={'goku/1'}` devuelve una selección cuyo `idle` coincide en grupo con la hecha a mano; `test_sin_plantilla_autor_unico` → `None`.
- [ ] **Step 2:** Run `"$PY" -m unittest herramientas.pruebas.test_plantillas -v` → FAIL.
- [ ] **Step 3:** Implementar; `herramientas/propuestas/` se crea al escribir (sí va en git: son el trabajo de revisión).
- [ ] **Step 4:** Run the tests → PASS.
- [ ] **Step 5: Commit** — `git add herramientas BITACORA.md && git commit -m "Plantillas por autor y archivos de propuesta por pack"`

### Task 6: Validación contra lo hecho a mano y ajuste

**Files:**
- Create: `herramientas/validar_propuestas.py`
- Test: `herramientas/pruebas/test_validar.py`

**Interfaces:**
- Consumes: `manuales`, `proponer(pack, espejo, guardar=False, excluir=<ids de las formas de ese pack>)` (Tarea 5).
- Produces:
  - `acierta(propuesto: list[int], a_mano: list[int]) -> bool` — True si todos los propuestos están en `[min(a_mano) − 2, max(a_mano) + 2]`. (Definición de «mismo grupo de fotogramas seguidos».)
  - `validar() -> dict` — para cada pack a mano, `proponer(pack, guardar=False)` con la plantilla excluyendo **todas las formas de ese mismo pack**; devuelve `{'por_anim': {anim: (aciertos, total)}, 'global': float, 'dudosos': int, 'packs': int, 'fallos': [(forma, anim, propuesto, a_mano)]}`. CLI escribe `herramientas/_revisar/validacion.md` e imprime el resumen.
- [ ] **Step 1: Write the failing tests** — `test_acierta`: `acierta([22],[18,21,22,23])` True; `acierta([30],[18,21,22,23])` False; `acierta([16],[18,21])` True.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar. **Step 4:** Run → PASS.
- [ ] **Step 5: Ajustar hasta el objetivo.** Run `"$PY" herramientas/validar_propuestas.py`. Mientras `global < 0.80` en las obligatorias, mirar los fallos más repetidos en `validacion.md`, cambiar reglas/pesos/`UMBRAL` en `proponer_fotogramas.py` y volver a ejecutar (las pruebas de la Tarea 4 deben seguir pasando). Anotar en la bitácora cada vuelta con su porcentaje.
- [ ] **Step 6: Commit** — `git add herramientas BITACORA.md && git commit -m "Validación de las propuestas contra lo elegido a mano: <porcentaje> %"`

### Task 7: Hojas para que la IA revise los dudosos

**Files:**
- Create: `herramientas/hoja_dudosos.py`
- Modify: `herramientas/GUIA_ANIMACIONES.md` (sección «Revisión de dudosos»)
- Test: `herramientas/pruebas/test_hoja_dudosos.py`

**Interfaces:**
- Consumes: archivos de `herramientas/propuestas/`.
- Produces: `hoja(propuesta: dict, salida_dir: str = 'herramientas/_revisar/dudosos') -> tuple[str, str]` — PNG con una fila por animación (propuestos con marco amarillo y vecinos ±3 con su número) y una fila de efectos; TXT con motivos y selección. CLI sin argumentos: hoja de cada propuesta con `dudoso: true` y sin `revisadoIA`. La IA corrige editando la propuesta y pone `"revisadoIA": true` y `"sigueDudoso": true|false`.
- [ ] **Step 1:** `test_hoja_crea_archivos`: con una propuesta fabricada sobre un pack temporal de 10 PNG, `hoja()` crea los dos archivos y el TXT contiene cada motivo. **Step 2:** Run → FAIL. **Step 3:** Implementar y documentar el paso en la guía. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** — `git add herramientas BITACORA.md && git commit -m "Hojas de revisión de los packs dudosos para la IA"`

### Task 8: Página de revisión del usuario y aplicar sus decisiones

**Files:**
- Create: `herramientas/revision_html.py`, `herramientas/aplicar_decisiones.py`
- Test: `herramientas/pruebas/test_revision.py`

**Interfaces:**
- Produces:
  - `generar(propuestas: list[dict], salida: str = 'herramientas/_revisar/revision.html') -> str` — una sola página autónoma (imágenes en base64, hierba de `escenarios_tiles.js` clave `grass`), con cada pack `sigueDudoso`: motivos, cada animación en movimiento a tamaño de juego y la tira de fotogramas numerados; pinchar un fotograma lo añade o quita de la animación elegida; botón «Vale» por pack; botón «Descargar decisiones» que guarda `decisiones.json` = `{nombre_pack: {'vale': bool, 'anims': {anim: [int]}}}`. Textos en español.
  - `aplicar(decisiones: dict) -> list[str]` — devuelve avisos. Para cada entrada: si no existe `herramientas/propuestas/<nombre>.json`, aviso y nada más. Si la propuesta tiene `'forma'` (`'goku/1'`) y `'grupo'` (ruta de su JSON de selección), escribe las animaciones cambiadas en ese JSON guardando la anterior en `"<anim>Antes"`; si no, marca la propuesta `"aprobada": true` con las animaciones decididas. CLI: `"$PY" herramientas/aplicar_decisiones.py <ruta decisiones.json>`.
- [ ] **Step 1: Write the failing tests** — `test_html_contiene_packs`: `generar` con 2 propuestas fabricadas → el HTML contiene sus dos nombres y `Descargar decisiones`. `test_aplicar_forma_actual`: JSON de grupo temporal con `move: [5]` y decisión `move: [8]` → queda `move: [8]`, `moveAntes: [5]`. `test_aplicar_pack_inexistente`: devuelve un aviso y no crea archivos.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar ambos scripts. **Step 4:** Run → PASS.
- [ ] **Step 5:** Abrir la página generada con dos propuestas de prueba en el navegador integrado, cambiar un fotograma, pulsar «Vale» y descargar; comprobar que `decisiones.json` tiene el cambio.
- [ ] **Step 6: Commit** — `git add herramientas BITACORA.md && git commit -m "Página de revisión de dudosos y aplicación de las decisiones"`

### Task 9: Arreglar las formas actuales y cerrar

**Files:**
- Modify: `herramientas/proponer_fotogramas.py` (modo forma actual), JSON de grupo afectados en `herramientas/animaciones/`, `animaciones_juego.js` (generado), `index.html`, `README.md`, `TAREAS_CODEX.md`, `BITACORA.md`

**Interfaces:**
- Produces: `proponer_forma(id_forma: str) -> dict` — para una forma de `problemas()['agachadas']` propone otro `move` del mismo pack (impulso más alto, sin polvo delante; si no hay, la pose de flotar o la guardia); para `problemas()['desiguales']` propone `escalaFrames` con la escala de la guardia para los fotogramas que no cuadran. Siempre `dudoso: true` (pasa por revisión), con `'forma'` y `'grupo'`. CLI: `"$PY" herramientas/proponer_fotogramas.py --formas-actuales`.
- [ ] **Step 1:** `test_proponer_forma_agachada` (con sprites): para `goku/1` el `move` propuesto, montado, mide ≥ 70 % del alto de la guardia, o la propuesta lleva el motivo «no hay impulso más alto».
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar. **Step 4:** Run → PASS.
- [ ] **Step 5:** Run `--formas-actuales` y `hoja_dudosos.py`; revisar como IA las 20 hojas (16 agachadas + 4 desiguales), corregir y marcar `revisadoIA`/`sigueDudoso`.
- [ ] **Step 6:** Generar `revision.html` con las que sigan dudosas y **pedir al usuario que las revise** (enlace a la página y qué hacer). Esperar su `decisiones.json`; aplicarlo con `aplicar_decisiones.py`.
- [ ] **Step 7:** Run `"$PY" herramientas/montar_animaciones.py`, `"$PY" herramientas/medir_formas.py` → las tres listas vacías salvo las formas aceptadas a propósito (anotarlas en la bitácora). Run `node herramientas/comprobar_personajes.cjs` y `node herramientas/comprobar_enemigos.cjs` → sin errores. Subir `?v` en `index.html`.
- [ ] **Step 8:** Probar en el navegador (`.claude/launch.json` «animesurvivor»): `AS.start('goku', <mapa>)`, mover en las cuatro direcciones; repetir con `goku/1` (forma SSJ) y una forma de las desiguales. Captura para el usuario.
- [ ] **Step 9:** Actualizar «Cómo está ahora» y «Lo que falta» de `README.md`, «Empieza aquí» de `TAREAS_CODEX.md` y `herramientas/GUIA_ANIMACIONES.md` (flujo nuevo: proponer → validar → hoja → página → aplicar → montar). Cerrar la entrada de la bitácora.
- [ ] **Step 10: Commit** — `git add -A herramientas animaciones_juego.js index.html README.md TAREAS_CODEX.md BITACORA.md && git commit -m "Movimiento corregido en todas las formas y herramienta de propuestas lista"`
