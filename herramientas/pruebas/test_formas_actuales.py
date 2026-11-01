import json, os, sys, tempfile, unittest
from unittest import mock

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import proponer_fotogramas as pf
import aplicar_decisiones
from rasgos import rasgos_pack, nombre_pack

SPRITES = os.path.join(RAIZ, 'sprites')


@unittest.skipUnless(os.path.isdir(SPRITES), 'sin carpeta sprites/')
class FormasActuales(unittest.TestCase):
    def test_proponer_forma_agachada(self):
        p = pf.proponer_forma('goku/1', guardar=False)
        self.assertEqual(p['forma'], 'goku/1'); self.assertTrue(p['dudoso'])
        self.assertTrue(os.path.exists(os.path.join(RAIZ, p['grupo'])))
        rs = rasgos_pack(p['pack']); g = rs[dict(pf.manuales()[p['pack']])['goku/1']['idle'][0]]
        alto_ok = all(rs[i]['alto'] >= 0.7 * g['alto'] for i in p['move'])
        self.assertTrue(alto_ok or any('impulso más alto' in t for t in p['motivos']), p)

    def test_proponer_forma_desigual(self):
        p = pf.proponer_forma('e_ginyu/0', guardar=False)
        self.assertTrue(p['dudoso'])
        # en el juego solo el 53 mide el doble (el 54 está bien); la IA debe comprobar a ojo si es real
        self.assertEqual(sorted(p['escalaFrames']), ['53'])
        self.assertAlmostEqual(p['escalaFrames']['53'], 2.0, delta=0.3)


class AplicarEscala(unittest.TestCase):
    def test_aplicar_escala_frames(self):
        with tempfile.TemporaryDirectory() as d:
            grupo = os.path.join(d, 'grupo.json')
            with open(grupo, 'w', encoding='utf-8') as fh:
                json.dump({'heroes': {'e': {'0': {'pack': 'pa', 'pow': [53]}}}}, fh)
            with mock.patch.object(pf, 'PROPUESTAS', d):
                with open(os.path.join(d, nombre_pack('pa') + '.json'), 'w', encoding='utf-8') as fh:
                    json.dump({'pack': 'pa', 'forma': 'e/0', 'grupo': grupo, 'escalaFrames': {'53': 2.0}}, fh)
                aplicar_decisiones.aplicar({nombre_pack('pa'): {'vale': True, 'anims': {'pow': [53]}}})
            with open(grupo, encoding='utf-8') as fh: f = json.load(fh)['heroes']['e']['0']
        self.assertEqual(f['escalaFrames'], {'53': 2.0}); self.assertEqual(f['escalaFramesAntes'], {})


if __name__ == '__main__':
    unittest.main()
