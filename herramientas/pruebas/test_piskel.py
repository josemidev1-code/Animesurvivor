import base64
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from PIL import Image
from herramientas import importar_piskel as P


class Piskel(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name)
        self.a = Image.new('RGBA', (2, 2), 'red')
        self.b = Image.new('RGBA', (2, 2), 'blue')
        self.manifest = self.path/'origen.json'
        self.manifest.write_text(json.dumps({'heroe':'goku','forma':'0','pack':'pack',
            'frames':[{'sha256':P.huella(self.a),'indice':17},{'sha256':P.huella(self.b),'indice':20}]}))
        self.patch = patch.object(P, 'leer_config', return_value={'goku':{'0':{'pack':'pack'}}})
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def archivo(self, images, layout=None):
        strip = Image.new('RGBA', (2*len(images), 2))
        for i, im in enumerate(images): strip.paste(im,(2*i,0))
        buf=io.BytesIO();strip.save(buf,format='PNG')
        layer={'frameCount':len(images),'opacity':1,'chunks':[{'layout':layout or [[i] for i in range(len(images))],
             'base64PNG':'data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()}]}
        path=self.path/'clip.piskel'
        path.write_text(json.dumps({'piskel':{'width':2,'height':2,'fps':12,'layers':[json.dumps(layer)]}}))
        return path

    def test_reordenar_y_conservar_duracion(self):
        p=self.archivo([self.b,self.b,self.a])
        self.assertEqual(P.seleccion(p,self.manifest,'goku','0','attack'),{'attack':[20,17],'attackDu':[10,5]})

    def test_acepta_tecnica_propia(self):
        p=self.archivo([self.a,self.b])
        self.assertEqual(P.seleccion(p,self.manifest,'goku','0','tecnica_kame')['tecnica_kame'],[17,20])

    def test_rechaza_dibujos_ajenos(self):
        p=self.archivo([Image.new('RGBA',(2,2),'green')])
        with self.assertRaisesRegex(ValueError,'sprite original'): P.seleccion(p,self.manifest,'goku','0','attack')

    def test_rechaza_indice_duplicado(self):
        p=self.archivo([self.a,self.b],[[0],[0]])
        with self.assertRaisesRegex(ValueError,'duplicado'): P.leer_piskel(p)

    def test_rechaza_otro_personaje(self):
        p=self.archivo([self.a,self.b])
        with patch.object(P,'leer_config',return_value={'vegeta':{'0':{'pack':'pack'}}}):
            with self.assertRaisesRegex(ValueError,'personaje'): P.seleccion(p,self.manifest,'vegeta','0','attack')

    def test_dos_poses_identicas_conservan_sus_dos_fases(self):
        p=self.archivo([self.a,self.a])
        result=P.seleccion(p,self.manifest,'goku','0','beam')
        self.assertEqual(result,{'beam':[17,17],'beamDu':[5,5]})

    def test_rechaza_rayo_incompleto(self):
        p=self.archivo([self.a])
        with self.assertRaisesRegex(ValueError,'dos fotogramas'): P.seleccion(p,self.manifest,'goku','0','beam')

    def test_huella_ignora_margen_transparente(self):
        image=Image.new('RGBA',(8,8));image.paste(self.a,(3,3))
        self.assertEqual(P.huella(image),P.huella(self.a))
