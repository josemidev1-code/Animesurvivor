"""Fallos encontrados en la revisión final del bloque 1."""
import json, os, sys, tempfile, unittest
from unittest import mock
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
import montar_animaciones as m
import proponer_fotogramas as pf
import revision_html, aplicar_decisiones
from pruebas.test_proponer import fot, pack_sintetico
from pruebas.test_revision import pack_falso


def grupo_con(d, formas):
    ruta = os.path.join(d, 'grupo.json')
    with open(ruta, 'w', encoding='utf-8') as fh: json.dump({'heroes': formas}, fh)
    return ruta


class RevisionFinal(unittest.TestCase):
    def test_pagina_usa_el_nombre_de_archivo_de_la_propuesta(self):
        # dos formas del mismo pack no deben pisarse en la página
        with tempfile.TemporaryDirectory() as d:
            pack_falso(d, 'pa')
            props = [{'nombre': 'goku_1_pa', 'pack': 'pa', 'idle': [0]}, {'nombre': 'gokuui_1_pa', 'pack': 'pa', 'idle': [1]}]
            with mock.patch.object(m, 'SPRITES', d):
                t = open(revision_html.generar(props, os.path.join(d, 'r.html')), encoding='utf-8').read()
        self.assertIn('"goku_1_pa"', t); self.assertIn('"gokuui_1_pa"', t)

    def test_aplicar_forma_con_nombre_propio(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(pf, 'PROPUESTAS', d):
            grupo = grupo_con(d, {'gohan': {'3': {'pack': 'pa', 'move': [5]}}})
            json.dump({'nombre': 'gohan_3_pa', 'pack': 'pa', 'forma': 'gohan/3', 'grupo': grupo},
                      open(os.path.join(d, 'gohan_3_pa.json'), 'w', encoding='utf-8'))
            avisos = aplicar_decisiones.aplicar({'gohan_3_pa': {'vale': True, 'anims': {'move': [8]}}})
            self.assertEqual(avisos, [])
            self.assertEqual(json.load(open(grupo, encoding='utf-8'))['heroes']['gohan']['3']['move'], [8])

    def test_proponer_forma_guarda_su_nombre(self):
        p = {'pack': 'x/y', 'forma': 'gohan/3'}
        self.assertEqual(pf.nombre_propuesta(p), pf.nombre_pack('gohan/3_x/y'))
        self.assertEqual(pf.nombre_propuesta({'pack': 'x/y'}), pf.nombre_pack('x/y'))

    def test_forma_borrada_avisa_sin_romper(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(pf, 'PROPUESTAS', d):
            grupo = grupo_con(d, {'goku': {'1': {'pack': 'pa', 'move': [5]}}})
            for n, forma in (('a', 'goku/1'), ('b', 'borrado/0')):
                json.dump({'pack': 'pa', 'forma': forma, 'grupo': grupo}, open(os.path.join(d, n + '.json'), 'w', encoding='utf-8'))
            json.dump({'pack': 'pa', 'forma': 'goku/1', 'grupo': os.path.join(d, 'no_existe.json')},
                      open(os.path.join(d, 'c.json'), 'w', encoding='utf-8'))
            avisos = aplicar_decisiones.aplicar({k: {'vale': True, 'anims': {'move': [8]}} for k in 'abc'})
            self.assertEqual(len(avisos), 2)
            self.assertEqual(json.load(open(grupo, encoding='utf-8'))['heroes']['goku']['1']['move'], [8])

    def test_pack_solo_chispas_no_rompe(self):
        rs = [{'i': 0, 'vacio': True}, fot(1, alto=5, ancho=5), fot(2, alto=4, ancho=6)]
        p = pf.clasificar(rs)
        self.assertTrue(pf.motivos_dudoso(p, rs))

    def test_orientacion_sin_comprobar(self):
        rs = pack_sintetico(); p = pf.clasificar(rs, espejo=None)
        self.assertTrue(any('mira' in t for t in pf.motivos_dudoso(p, rs)))
        p = pf.clasificar(rs, espejo=False)
        self.assertFalse(any('mira' in t for t in pf.motivos_dudoso(p, rs)))


if __name__ == '__main__':
    unittest.main()
