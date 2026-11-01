import os, sys, tempfile, unittest
from unittest import mock
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import montar_animaciones as m
import hoja_dudosos


class Hoja(unittest.TestCase):
    def test_hoja_crea_archivos(self):
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, 'p'))
            for i in range(10):
                im = Image.new('RGBA', (20, 30), (255, 255, 255, 255))
                for x in range(5, 15):
                    for y in range(3, 28): im.putpixel((x, y), (200, 90, 20, 255))
                im.save(os.path.join(d, 'p', f'{i}.png'))
            prop = {'pack': 'p', 'idle': [0, 1], 'move': [4], 'attack': [5, 6], 'kick': [], 'ki': [8], 'hurt': [9],
                    'efectos': {'rayo': [7], 'bola': [], 'aura': [], 'estela': []},
                    'motivos': ['falta la animación de patada', 'poca confianza en ki']}
            with mock.patch.object(m, 'SPRITES', d):
                png, txt = hoja_dudosos.hoja(prop, os.path.join(d, 'salida'))
            self.assertTrue(os.path.exists(png))
            with open(txt, encoding='utf-8') as fh: t = fh.read()
            for motivo in prop['motivos']: self.assertIn(motivo, t)
            self.assertIn('puñetazos: [5, 6]', t)

    def test_letra_con_enes(self):
        # la letra por defecto de Pillow no dibuja la ñ («puñetazos», «daño»)
        self.assertEqual(type(hoja_dudosos.LETRA).__name__, 'FreeTypeFont')


if __name__ == '__main__':
    unittest.main()
