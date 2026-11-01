import os, sys, unittest

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import proponer_fotogramas as pf
from rasgos import rasgos_pack

SPRITES = os.path.join(RAIZ, 'sprites')
GOKU = '01_Dragon_Ball_Super/05_Broly/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS'
SSJ = '01_Dragon_Ball_Super/05_Broly/Goku/220_GOKU,SSJ 1,DBS BROLY, ANDRÉS GAMEN ANIMATIONS'
SOLDADO = '00_Dragon_Ball_Z/01_Namek_y_Freezer/DeviantArt/400_SOLDADO DE FREEZER (TheWarriorFF2)'


class Plantillas(unittest.TestCase):
    def test_autor_andres(self):
        self.assertEqual(pf.autor_de(GOKU), 'ANDRES GAMEN')

    def test_autor_parentesis(self):
        self.assertEqual(pf.autor_de('x/y/401_ALGUIEN (TheWarriorFF2)'), 'THEWARRIORFF2')

    def test_sin_autor(self):
        self.assertIsNone(pf.autor_de('x/y/12_Goku sin nada'))

    def test_manuales_agrupa_por_pack(self):
        ids = [i for i, _ in pf.manuales()[GOKU]]
        self.assertIn('goku/0', ids)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_plantilla_otro_goku(self):
        excl = frozenset(i for i, _ in pf.manuales()[SSJ])
        t = pf.plantilla(SSJ, rasgos_pack(SSJ), excluir=excl)
        self.assertIsNotNone(t)
        a_mano = dict(pf.manuales()[SSJ])['goku/1']['idle']
        self.assertTrue(all(min(a_mano) - 2 <= i <= max(a_mano) + 2 for i in t['idle']), (t['idle'], a_mano))
        self.assertEqual(t['confianza']['idle'], 0.9)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_sin_plantilla_autor_unico(self):
        excl = frozenset(i for i, _ in pf.manuales()[SOLDADO])
        self.assertIsNone(pf.plantilla(SOLDADO, rasgos_pack(SOLDADO), excluir=excl))


if __name__ == '__main__':
    unittest.main()
