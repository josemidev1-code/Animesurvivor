import os, sys, unittest
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import montar_animaciones as m
from medir_formas import manchas

SPRITES = os.path.join(RAIZ, 'sprites')


def bloques(*rects):
    im = Image.new('RGBA', (60, 60))
    for x0, y0, lado in rects:
        for x in range(x0, x0 + lado):
            for y in range(y0, y0 + lado): im.putpixel((x, y), (200, 100, 0, 255))
    return im


def opacos(im):
    return im.width * im.height - im.getchannel('A').histogram()[0]


class Sueltos(unittest.TestCase):
    def test_borra_polvo(self):
        self.assertEqual(opacos(m.quitar_sueltos(bloques((0, 0, 30), (45, 45, 5)))), 900)

    def test_conserva_parte_grande(self):
        self.assertEqual(opacos(m.quitar_sueltos(bloques((0, 0, 30), (40, 40, 16)))), 900 + 256)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_goku_base_sin_polvo(self):
        anims, _, _ = m.cargar_forma(m.leer_config()['goku']['0'])
        self.assertEqual(manchas(anims['Walk'][0]), 0)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_conservar_sueltos(self):
        f = dict(m.leer_config()['goku']['0'], conservarSueltos=True)
        anims, _, _ = m.cargar_forma(f)
        self.assertGreater(manchas(anims['Walk'][0]), 0.05)


if __name__ == '__main__':
    unittest.main()
