import os, sys, unittest

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import validar_propuestas as vp


class Validar(unittest.TestCase):
    def test_acierta_dentro_del_grupo(self):
        self.assertTrue(vp.acierta([22], [18, 21, 22, 23]))
        self.assertTrue(vp.acierta([16], [18, 21]))

    def test_acierta_fuera_del_grupo(self):
        self.assertFalse(vp.acierta([30], [18, 21, 22, 23]))

    def test_acierta_vacio(self):
        self.assertFalse(vp.acierta([], [3, 4]))


if __name__ == '__main__':
    unittest.main()
