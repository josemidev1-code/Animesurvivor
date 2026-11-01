import json, os, sys, tempfile, unittest
from unittest import mock
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import montar_animaciones as m
import proponer_fotogramas as pf
import revision_html, aplicar_decisiones
from rasgos import nombre_pack


def pack_falso(d, nombre, n=6):
    os.makedirs(os.path.join(d, nombre))
    for i in range(n):
        im = Image.new('RGBA', (20, 30), (255, 255, 255, 255))
        for x in range(5, 15):
            for y in range(3, 28): im.putpixel((x, y), (200, 90, 20, 255))
        im.save(os.path.join(d, nombre, f'{i}.png'))


class Revision(unittest.TestCase):
    def test_html_contiene_packs(self):
        with tempfile.TemporaryDirectory() as d:
            pack_falso(d, 'pa'); pack_falso(d, 'pb')
            props = [{'pack': p, 'idle': [0, 1], 'move': [2], 'motivos': ['poca confianza en ki']} for p in ('pa', 'pb')]
            with mock.patch.object(m, 'SPRITES', d):
                ruta = revision_html.generar(props, os.path.join(d, 'revision.html'))
            with open(ruta, encoding='utf-8') as fh: t = fh.read()
        self.assertIn('"pa"', t); self.assertIn('"pb"', t)
        self.assertIn('Descargar decisiones', t)
        self.assertIn('poca confianza en ki', t)

    def test_aplicar_forma_actual(self):
        with tempfile.TemporaryDirectory() as d:
            grupo = os.path.join(d, 'grupo.json')
            with open(grupo, 'w', encoding='utf-8') as fh:
                json.dump({'heroes': {'goku': {'1': {'pack': 'pa', 'idle': [0, 1], 'move': [5]}}}}, fh)
            with mock.patch.object(pf, 'PROPUESTAS', d):
                with open(os.path.join(d, nombre_pack('pa') + '.json'), 'w', encoding='utf-8') as fh:
                    json.dump({'pack': 'pa', 'forma': 'goku/1', 'grupo': grupo, 'move': [8]}, fh)
                avisos = aplicar_decisiones.aplicar({nombre_pack('pa'): {'vale': True, 'anims': {'idle': [0, 1], 'move': [8]}}})
            with open(grupo, encoding='utf-8') as fh: f = json.load(fh)['heroes']['goku']['1']
        self.assertEqual(avisos, [])
        self.assertEqual(f['move'], [8]); self.assertEqual(f['moveAntes'], [5])
        self.assertNotIn('idleAntes', f)

    def test_aplicar_pack_nuevo(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(pf, 'PROPUESTAS', d):
            ruta = os.path.join(d, nombre_pack('pn') + '.json')
            with open(ruta, 'w', encoding='utf-8') as fh: json.dump({'pack': 'pn', 'idle': [3]}, fh)
            aplicar_decisiones.aplicar({nombre_pack('pn'): {'vale': True, 'anims': {'idle': [1, 2]}}})
            with open(ruta, encoding='utf-8') as fh: p = json.load(fh)
        self.assertTrue(p['aprobada']); self.assertEqual(p['idle'], [1, 2])

    def test_aplicar_pack_inexistente(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(pf, 'PROPUESTAS', d):
            avisos = aplicar_decisiones.aplicar({'no_existe': {'vale': True, 'anims': {'idle': [1]}}})
            self.assertEqual(len(avisos), 1); self.assertEqual(os.listdir(d), [])

    def test_sin_vale_no_aplica(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(pf, 'PROPUESTAS', d):
            ruta = os.path.join(d, nombre_pack('pn') + '.json')
            with open(ruta, 'w', encoding='utf-8') as fh: json.dump({'pack': 'pn', 'idle': [3]}, fh)
            avisos = aplicar_decisiones.aplicar({nombre_pack('pn'): {'vale': False, 'anims': {'idle': [1]}}})
            with open(ruta, encoding='utf-8') as fh: p = json.load(fh)
        self.assertEqual(len(avisos), 1); self.assertEqual(p['idle'], [3])


if __name__ == '__main__':
    unittest.main()
