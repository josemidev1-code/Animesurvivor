"""Genera los iconos pixel art faltantes en resolución nativa 32x32 con estilo Dragon Ball retro.
"""
from PIL import Image, ImageDraw
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
OBJETOS = RAIZ / "ui" / "objetos"
OBJETOS.mkdir(parents=True, exist_ok=True)

def nuevo():
    return Image.new("RGBA", (32, 32), (0, 0, 0, 0))

# 1. crit.png: Destello de impacto critico Super Saiyan
def gen_crit():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Ráfaga estelar en forma de cruz/estrella afilada
    star = [(16, 1), (19, 11), (30, 9), (21, 17), (29, 27), (18, 22), (16, 31), (13, 22), (3, 27), (10, 17), (2, 9), (13, 11)]
    d.polygon(star, fill=(234, 88, 12, 255), outline=(124, 45, 18, 255))
    star_mid = [(16, 5), (18, 12), (25, 11), (19, 16), (24, 23), (17, 20), (16, 27), (14, 20), (7, 23), (12, 16), (6, 11), (14, 12)]
    d.polygon(star_mid, fill=(251, 191, 36, 255), outline=(217, 119, 6, 255))
    star_core = [(16, 9), (17, 14), (21, 13), (18, 16), (20, 20), (17, 18), (16, 23), (14, 18), (11, 20), (13, 16), (10, 13), (14, 14)]
    d.polygon(star_core, fill=(254, 240, 138, 255))
    d.ellipse([14, 14, 17, 17], fill=(255, 255, 255, 255))
    return im

# 2. knockback.png: Kiai de choque (ondas de viento sónico en semicírculo blanco/cian)
def gen_knockback():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Ondas de choque en arco con dirección hacia la derecha
    for r, col, wid in [(12, (56, 189, 248, 255), 2), (8, (186, 230, 253, 255), 2), (4, (255, 255, 255, 255), 2)]:
        d.arc([8-r, 16-r, 8+r, 16+r], start=290, end=70, fill=col, width=wid)
        d.arc([16-r, 16-r, 16+r, 16+r], start=300, end=60, fill=col, width=wid)
    # Destellos de viento cinético
    d.line([(4, 16), (28, 16)], fill=(255, 255, 255, 255), width=2)
    d.polygon([(26, 13), (31, 16), (26, 19)], fill=(56, 189, 248, 255))
    d.polygon([(27, 14), (30, 16), (27, 18)], fill=(255, 255, 255, 255))
    return im

# 3. zenkai.png: Poder Zenkai (Llamas de furia saiyan con núcleo de ki carmesí/dorado)
def gen_zenkai():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Silueta de llama exterior
    flame_out = [
        (16, 2), (20, 8), (25, 6), (23, 14), (28, 17), (25, 25), (19, 29), (16, 30),
        (12, 29), (6, 25), (4, 17), (8, 14), (6, 6), (11, 8)
    ]
    d.polygon(flame_out, fill=(220, 38, 38, 255), outline=(127, 29, 29, 255))
    # Capa intermedia ámbar fuego
    flame_mid = [
        (16, 6), (19, 11), (22, 10), (20, 16), (24, 19), (21, 25), (16, 27),
        (10, 25), (8, 19), (11, 16), (9, 10), (13, 11)
    ]
    d.polygon(flame_mid, fill=(245, 158, 11, 255))
    # Núcleo blanco y dorado ardiente
    d.ellipse([12, 14, 19, 23], fill=(254, 240, 138, 255))
    d.ellipse([14, 16, 17, 21], fill=(255, 255, 255, 255))
    return im

# 4. area.png: Concentración / Área de ki (Cúpula de barrera esférica con anillos y brillo)
def gen_area():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Anillo exterior
    d.ellipse([3, 3, 28, 28], outline=(202, 138, 4, 255), width=2)
    # Campo translúcido interior simulado en pixel art
    d.ellipse([5, 5, 26, 26], outline=(250, 204, 21, 255), width=1)
    d.ellipse([7, 7, 24, 24], outline=(254, 240, 138, 255), width=1)
    # Núcleo resplandeciente central
    d.ellipse([13, 13, 18, 18], fill=(255, 255, 255, 255), outline=(234, 179, 8, 255))
    # 4 estrellas cardinales de dispersión de onda
    for x, y in [(16, 1), (16, 29), (1, 16), (29, 16)]:
        d.rectangle([x-1, y-1, x+1, y+1], fill=(254, 240, 138, 255))
    return im

# 5. aura_burst.png: Aura destructora (llamas super saiyan activas con destellos)
def gen_aura_burst():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Aura ascendente en abanico
    poly = [(16, 2), (22, 9), (28, 4), (27, 15), (31, 21), (26, 28), (16, 30), (6, 28), (1, 21), (5, 15), (3, 4), (10, 9)]
    d.polygon(poly, fill=(249, 115, 22, 255), outline=(154, 52, 18, 255))
    poly_in = [(16, 5), (20, 11), (25, 8), (23, 16), (27, 21), (23, 26), (16, 28), (8, 26), (4, 21), (8, 16), (6, 8), (12, 11)]
    d.polygon(poly_in, fill=(253, 224, 71, 255))
    d.polygon([(16, 9), (20, 17), (16, 25), (11, 17)], fill=(255, 255, 255, 255))
    # Relámpagos azules de SSJ2/SSJ Blue
    d.line([(6, 10), (10, 14), (8, 18)], fill=(56, 189, 248, 255), width=1)
    d.line([(25, 12), (21, 16), (24, 20)], fill=(56, 189, 248, 255), width=1)
    return im

# 6. melee.png: Ataque físico / Lariat / Puñetazo
def gen_melee():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Guantelete / puño de impacto cerrado Saiyan
    # Muñequera
    d.rectangle([4, 12, 10, 20], fill=(29, 78, 216, 255), outline=(15, 23, 42, 255))
    d.rectangle([5, 13, 9, 19], fill=(59, 130, 246, 255))
    # Puño
    d.rectangle([10, 10, 20, 22], fill=(244, 244, 245, 255), outline=(15, 23, 42, 255))
    d.rectangle([11, 11, 19, 15], fill=(228, 228, 231, 255))
    d.rectangle([11, 16, 19, 21], fill=(212, 212, 216, 255))
    # Destello de impacto radial delante del puño
    for r in [4, 7, 10]:
        d.arc([16-r, 16-r, 16+r, 16+r], start=300, end=60, fill=(250, 204, 21, 255), width=2)
    # Chispas de golpe
    d.line([(22, 12), (29, 8)], fill=(255, 255, 255, 255), width=2)
    d.line([(23, 16), (30, 16)], fill=(251, 191, 36, 255), width=2)
    d.line([(22, 20), (29, 24)], fill=(255, 255, 255, 255), width=2)
    return im

# 7. sword.png: Espada de Trunks / Ataque cortante
def gen_sword():
    im = nuevo()
    d = ImageDraw.Draw(im)
    # Hoja de la espada en diagonal de abajo izq a arriba der
    d.polygon([(6, 26), (24, 7), (26, 5), (28, 6), (26, 9), (8, 28)], fill=(228, 228, 231, 255), outline=(39, 39, 42, 255))
    # Filo brillante plateado
    d.line([(7, 26), (25, 7)], fill=(255, 255, 255, 255), width=1)
    # Guarda de la espada
    d.polygon([(4, 24), (7, 21), (11, 25), (8, 28)], fill=(202, 138, 4, 255), outline=(39, 39, 42, 255))
    # Empuñadura y pomo
    d.line([(5, 27), (2, 30)], fill=(37, 99, 235, 255), width=2)
    d.ellipse([0, 29, 3, 32], fill=(202, 138, 4, 255))
    # Estela de corte de ki
    d.arc([4, 4, 28, 28], start=220, end=340, fill=(147, 197, 253, 255), width=2)
    return im

def main():
    icons = {
        "crit": gen_crit(),
        "knockback": gen_knockback(),
        "zenkai": gen_zenkai(),
        "area": gen_area(),
        "aura_burst": gen_aura_burst(),
        "melee": gen_melee(),
        "sword": gen_sword()
    }
    for name, im in icons.items():
        salida = OBJETOS / f"{name}.png"
        im.save(salida)
        print(f"Guardado {salida.name} (32x32).")

if __name__ == "__main__":
    main()
