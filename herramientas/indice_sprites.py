from pathlib import Path
import json
import sys

raiz = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
salida = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else raiz / '01 - Guía y documentación' / 'INDICE_SPRITES.md'
origen = raiz / 'herramientas' / 'animaciones'
filas = []
for archivo in sorted(origen.glob('*.json')):
    datos = json.loads(archivo.read_text(encoding='utf-8-sig'))
    for personaje, formas in datos.get('heroes', {}).items():
        for forma, datos_forma in formas.items():
            if not isinstance(datos_forma, dict):
                continue
            pack = datos_forma.get('pack')
            if pack:
                ruta = raiz / 'sprites' / pack
                filas.append((personaje, forma, pack, archivo.name, ruta.exists()))
filas.sort(key=lambda x: (x[0].casefold(), str(x[1]), x[3]))
lineas = ['# Índice de sprites seleccionados', '',
          'Generado desde `herramientas/animaciones/*.json`. Incluye entradas con un pack explícito; no es un catálogo completo de todos los sprites ni prueba que una forma esté activa en el juego.',
          'Regenerar: `python herramientas/indice_sprites.py`. Si un pack no aparece, buscarlo en `sprites/`.', '',
          '| Personaje / ID | Forma | Pack dentro de sprites/ | Archivo de selección | Ruta |',
          '|---|---|---|---|---|']
for personaje, forma, pack, archivo, existe in filas:
    limpiar = lambda x: str(x).replace('|', r'\|').replace('\n', ' ')
    lineas.append(f'| {limpiar(personaje)} | {limpiar(forma)} | `{limpiar(pack)}` | `{archivo}` | {"Existe" if existe else "No encontrada"} |')
salida.write_text('\n'.join(lineas) + '\n', encoding='utf-8')
print(f'{len(filas)} formas catalogadas; {sum(not f[4] for f in filas)} rutas no encontradas.')
