import os, sys, tempfile, time, unittest
from unittest import mock
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import montar_animaciones as m
import rasgos

SPRITES = os.path.join(RAIZ, 'sprites')
GOKU = '01_Dragon_Ball_Super/05_Broly/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS'


def figura(ruta, desplazar=0):
    """Figura en diagonal sobre fondo blanco: la parte de arriba más a la derecha si desplazar > 0."""
    im = Image.new('RGBA', (40, 40), (255, 255, 255, 255))
    for y in range(5, 35):
        x0 = 15 + round((35 - y) * desplazar / 30)
        for x in range(x0, x0 + 8): im.putpixel((x, y), (200, 90, 20, 255))
    im.save(ruta)


class Rasgos(unittest.TestCase):
    def test_nombre_pack_estable(self):
        n = rasgos.nombre_pack('01_x/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS')
        for c in ' ,É/':
            self.assertNotIn(c, n)
        self.assertEqual(n, rasgos.nombre_pack('01_x/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS'))

    def test_inclinacion(self):
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, 'p'))
            figura(os.path.join(d, 'p', '1.png'), desplazar=12)
            figura(os.path.join(d, 'p', '2.png'), desplazar=0)
            with mock.patch.object(m, 'SPRITES', d):
                rs = rasgos.rasgos_pack('p', cache_dir=os.path.join(d, 'cache'))
        self.assertGreater(rs[0]['incl'], 0.15)
        self.assertLess(abs(rs[1]['incl']), 0.05)

    def test_cache_se_invalida(self):
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, 'p'))
            figura(os.path.join(d, 'p', '1.png')); figura(os.path.join(d, 'p', '2.png'))
            cache = os.path.join(d, 'cache')
            with mock.patch.object(m, 'SPRITES', d):
                rasgos.rasgos_pack('p', cache_dir=cache)
                with mock.patch.object(m, 'limpiar', wraps=m.limpiar) as espia:
                    rasgos.rasgos_pack('p', cache_dir=cache)
                    self.assertEqual(espia.call_count, 0)
                    time.sleep(0.05); figura(os.path.join(d, 'p', '2.png'), desplazar=10)
                    os.utime(os.path.join(d, 'p', '2.png'), (time.time() + 5, time.time() + 5))
                    rasgos.rasgos_pack('p', cache_dir=cache)
                    self.assertEqual(espia.call_count, 2)

    def test_parecido(self):
        self.assertEqual(rasgos.parecido('f' * 64, 'f' * 64), 1.0)
        self.assertEqual(rasgos.parecido('f' * 64, '0' * 64), 0.0)

    def test_comun(self):
        self.assertEqual(rasgos.comun([[1, 2, 3, 10]], [[1, 2, 3, 5], [0, 0, 0, 1]]), 1.0)
        self.assertEqual(rasgos.comun([[1, 2, 3, 10], [4, 4, 4, 10]], [[1, 2, 3, 5]]), 0.5)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_goku_rayo(self):
        rs = rasgos.rasgos_pack(GOKU)
        # el Kamehameha de este pack lleva el destello de la carga: no es alargado, se distingue por sus colores
        self.assertLess(rasgos.comun(rs[38]['paleta'], rs[1]['paleta']), 0.15)
        self.assertLess(rs[1]['prop'], 0.9)
        self.assertGreater(rs[7]['sueltoX'], 0)   # polvo delante: retroceso
        self.assertLess(rs[8]['sueltoX'], 0)      # polvo detrás: impulso hacia delante


if __name__ == '__main__':
    unittest.main()
