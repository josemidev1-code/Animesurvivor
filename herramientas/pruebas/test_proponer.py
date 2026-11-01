import os, sys, unittest

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import proponer_fotogramas as pf

SPRITES = os.path.join(RAIZ, 'sprites')
GOKU = '01_Dragon_Ball_Super/05_Broly/Goku/215_GOKU BASE,DBS BROLY, ANDRÉS GAMEN ANIMATIONS'
PIEL = [[15, 12, 9, 60], [2, 2, 3, 40]]


def fot(i, alto=50, ancho=30, incl=0.0, sueltos=0.0, sueltoX=None, paleta=PIEL, silueta='f' * 64, escala=8.0):
    return {'i': i, 'vacio': False, 'escala': escala, 'alto': alto, 'ancho': ancho, 'prop': ancho / alto,
            'incl': incl, 'sueltos': sueltos, 'sueltoX': sueltoX, 'paleta': paleta, 'silueta': silueta}


def pack_sintetico(n=12):
    return [fot(i) for i in range(n)]


class Proponer(unittest.TestCase):
    def propuesta(self, **anims):
        p = {'guardia': 0, 'espejo': False, 'confianza': {}}
        for k in pf.OBLIGATORIAS:
            p[k] = anims.get(k, [1]); p['confianza'][k] = 0.9
        return p

    def test_motivos_falta_obligatoria(self):
        p = self.propuesta(); p['kick'] = []
        self.assertTrue(any('patada' in t for t in pf.motivos_dudoso(p, pack_sintetico())))

    def test_seguro_sin_motivos(self):
        self.assertEqual(pf.motivos_dudoso(self.propuesta(), pack_sintetico()), [])

    def test_poca_confianza(self):
        p = self.propuesta(); p['confianza']['ki'] = 0.2
        self.assertTrue(any('ki' in t for t in pf.motivos_dudoso(p, pack_sintetico())))

    def test_agachada(self):
        rs = pack_sintetico(); rs[1] = fot(1, alto=30)
        self.assertTrue(any('agachada' in t for t in pf.motivos_dudoso(self.propuesta(), rs)))

    def test_salto_atras(self):
        rs = pack_sintetico(); rs[1] = fot(1, sueltos=0.1, sueltoX=0.5)
        self.assertTrue(any('hacia atrás' in t for t in pf.motivos_dudoso(self.propuesta(), rs)))
        p = self.propuesta(); p['espejo'] = True
        rs[1] = fot(1, sueltos=0.1, sueltoX=-0.5)
        self.assertTrue(any('hacia atrás' in t for t in pf.motivos_dudoso(p, rs)))

    def test_escala_desigual(self):
        rs = pack_sintetico(); rs[1] = fot(1, escala=5.0)
        self.assertTrue(any('píxel' in t for t in pf.motivos_dudoso(self.propuesta(), rs)))

    def test_guardia_ignora_arte_de_otro_tamano(self):
        # el fotograma 0 es arte oficial (otro tamaño de píxel y más alto): la guardia es el primer sprite de pie
        rs = pack_sintetico(12); rs[0] = fot(0, alto=90, escala=2.0)
        self.assertEqual(pf.elegir_guardia(rs), 1)

    def test_pack_corto(self):
        rs = pack_sintetico(5)
        p = pf.clasificar(rs)
        self.assertTrue(any('pocos fotogramas' in t for t in pf.motivos_dudoso(p, rs)))

    def test_vacios_no_rompen(self):
        rs = pack_sintetico(12); rs[0] = {'i': 0, 'vacio': True}; rs[5] = {'i': 5, 'vacio': True}
        p = pf.clasificar(rs)
        usados = {i for k in pf.OBLIGATORIAS for i in p[k]}
        self.assertNotIn(0, usados); self.assertNotIn(5, usados)

    @unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
    def test_goku_base(self):
        p = pf.proponer(GOKU, guardar=False)
        self.assertTrue(set(p['idle']) <= set(range(7)), p['idle'])
        self.assertTrue({38, 39} & set(p['efectos']['rayo']), p['efectos'])
        self.assertIn(53, p['efectos']['bola'])
        self.assertIn(p['portrait'], (59, 60))
        self.assertFalse({9, 10} & set(p['move']), p['move'])


if __name__ == '__main__':
    unittest.main()
