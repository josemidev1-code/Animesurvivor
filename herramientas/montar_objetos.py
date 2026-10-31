"""Recorta los objetos elegidos y los incrusta junto al logo: funciona con file://.

Uso: python herramientas/montar_objetos.py
No genera dibujos. Conserva el GIF de Lady-Pixel sin ninguna modificación.
"""
import base64
import json
from collections import deque
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
OBJETOS = RAIZ / "ui" / "objetos"


def uri(archivo):
    tipo = "gif" if archivo.suffix.lower() == ".gif" else "png"
    return f"data:image/{tipo};base64," + base64.b64encode(archivo.read_bytes()).decode()


def recortar(imagen, caja):
    x, y, w, h = caja
    salida = imagen.crop((x, y, x + w, y + h)).convert("RGBA")
    # Solo el fondo azul conectado al borde; no borra detalles interiores azules.
    fondo = imagen.convert("RGBA").getpixel((0, imagen.height - 1))
    cola = deque([(i, j) for i in range(w) for j in (0, h - 1)] +
                 [(i, j) for j in range(h) for i in (0, w - 1)])
    vistos = set()
    while cola:
        i, j = cola.popleft()
        if (i, j) in vistos or not (0 <= i < w and 0 <= j < h):
            continue
        vistos.add((i, j))
        if salida.getpixel((i, j)) != fondo:
            continue
        salida.putpixel((i, j), (0, 0, 0, 0))
        cola.extend([(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)])
    limites = salida.getbbox()
    if not limites:
        raise ValueError(f"Recorte vacío: {caja}")
    return salida.crop(limites)


def main():
    fuentes = json.loads((OBJETOS / "fuentes.json").read_text(encoding="utf-8"))["fuentes"]
    imagenes = {k: uri(RAIZ / "ui" / f"{k}.png")
                for k in ["logo"] + [f"esfera{i}" for i in range(1, 8)]}
    creditos = []
    for fuente in fuentes:
        original = OBJETOS / fuente["archivo"]
        creditos.append({"what": fuente["nombre"], "name": fuente["autor"], "url": fuente["url"]})
        if "imagenIntegra" in fuente:
            imagenes[fuente["imagenIntegra"]] = uri(original)
        if "objetos" in fuente:
            with Image.open(original) as hoja:
                for clave, caja in fuente["objetos"].items():
                    salida = OBJETOS / f"{clave}.png"
                    recortar(hoja, caja).save(salida)
                    imagenes[clave] = uri(salida)
    texto = "// Generado por herramientas/montar_objetos.py; imágenes y créditos sin fetch.\n"
    texto += "window.UI_IMG=" + json.dumps(imagenes, ensure_ascii=False, separators=(",", ":")) + ";\n"
    texto += "window.RECURSOS_CREDITOS=" + json.dumps(creditos, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (RAIZ / "ui_imagenes.js").write_text(texto, encoding="utf-8")
    print(f"{len(imagenes)} imágenes incrustadas, {len(creditos)} fuentes acreditadas.")


if __name__ == "__main__":
    main()
