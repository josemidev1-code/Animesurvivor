"""Convierte el resultado guardado de un evaluate de Playwright (texto con un dataURL PNG) en un .png y borra el .txt.
Uso: python herramientas/dataurl_a_png.py <archivo.txt> [salida.png]"""
import base64, json, os, sys
src = sys.argv[1]; dst = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + '.png'
t = open(src, encoding='utf-8').read().strip()
if t.startswith('"'): t = json.loads(t)
open(dst, 'wb').write(base64.b64decode(t.split(',', 1)[1])); os.remove(src); print(dst)
