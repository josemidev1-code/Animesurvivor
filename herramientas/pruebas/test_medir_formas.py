import os, sys, unittest
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import medir_formas


class MedirFormas(unittest.TestCase):
    def test_mancha_sintetica(self):
        im = Image.new('RGBA', (20, 20))
        for x in range(10):
            for y in range(10): im.putpixel((x, y), (255, 0, 0, 255))
        for x in (15, 16):
            for y in (15, 16): im.putpixel((x, y), (255, 0, 0, 255))
        self.assertAlmostEqual(medir_formas.manchas(im), 4 / 104)

    def test_linea_base(self):
        p = medir_formas.problemas(medir_formas.medir(os.path.join(RAIZ, 'animaciones_juego.js')))
        # antes de quitar el polvo al montar (tarea 2) había 21 formas con manchas sueltas
        self.assertEqual(p['sueltos'], [])
        self.assertEqual(len(p['agachadas']), 16)
        self.assertEqual(len(p['desiguales']), 4)
        self.assertIn('goku/1', p['agachadas'])
        self.assertIn('vegetasuper/2', p['desiguales'])


if __name__ == '__main__':
    unittest.main()
