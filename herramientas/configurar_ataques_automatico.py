import sys
import os
import json
from collections import defaultdict
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import frames_del_pack, leer_config, limpiar, escala_pixel, CLAVES, DUR, RAIZ

def find_candidate_frames(rutas, f_def):
    """
    Analiza geométricamente los fotogramas del pack para detectar posturas de:
    - beam: pose de carga (manos al costado/frente) y disparo
    - up: brazos levantados al cielo
    - dash: vuelo horizontal rápido (ratio w/h alto o inclinación frontal)
    - attack2 / attack3: combos de golpes adicionales
    - kick2: patada alternativa
    """
    n = len(rutas)
    stats = {}
    
    # Conjunto de frames ya asignados a idle, move, hurt, faint, etc.
    asignados = set()
    for k in ['idle', 'move', 'attack', 'kick', 'ki', 'pow', 'hurt', 'faint']:
        asignados.update(f_def.get(k, []))
        
    for i, r in enumerate(rutas):
        try:
            im = limpiar(r)
            bb = im.getbbox()
            if not bb:
                continue
            w = bb[2] - bb[0]
            h = bb[3] - bb[1]
            ratio = w / max(1, h)
            stats[i] = {'w': w, 'h': h, 'ratio': ratio, 'im': im, 'bb': bb}
        except Exception:
            pass

    # 1. Detectar DASH (ratio w/h alto, horizontal, > 1.35)
    dash_candidates = [
        i for i, s in stats.items()
        if s['ratio'] >= 1.35 and i not in asignados and s['h'] >= 18
    ]
    # Si no hay libre, buscar en el entorno del fotograma de move
    if not dash_candidates and 'move' in f_def and f_def['move']:
        dash_frame = f_def['move'][0]
    elif dash_candidates:
        # Preferir el que tenga mayor ratio pero dimensiones razonables (no un efecto de rayo gigante)
        dash_candidates = [i for i in dash_candidates if stats[i]['w'] <= 160]
        if dash_candidates:
            dash_frame = max(dash_candidates, key=lambda i: stats[i]['ratio'])
        else:
            dash_frame = f_def.get('move', [0])[0]
    else:
        dash_frame = f_def.get('move', [0])[0]

    # 2. Detectar UP (brazos alzados, ratio estrecho < 0.65 o centro superior cargado)
    up_candidates = [
        i for i, s in stats.items()
        if s['ratio'] <= 0.68 and i not in asignados and s['h'] >= 38
    ]
    if up_candidates:
        up_frame = min(up_candidates, key=lambda i: stats[i]['ratio'])
    else:
        up_frame = f_def.get('pow', f_def.get('ki', [0]))[0]

    # 3. Detectar BEAM (2 frames: charge + blast)
    # Si 'ki' tiene 2 frames, usarlos o buscar poses ki
    ki_frames = f_def.get('ki', [])
    if len(ki_frames) >= 2:
        beam_frames = [ki_frames[0], ki_frames[-1]]
    elif len(ki_frames) == 1:
        beam_frames = [ki_frames[0], ki_frames[0]]
    else:
        beam_frames = [0, 0]

    # 4. Detectar ATTACK2 y ATTACK3 (secuencias contiguas de golpes)
    # Buscar fotogramas cercanos al grupo de 'attack'
    atk = f_def.get('attack', [])
    attack2_frames = []
    attack3_frames = []
    kick2_frames = []

    if atk:
        min_atk = min(atk)
        max_atk = max(atk)
        # Buscar frames justo después o antes que no estén asignados
        cand_after = [i for i in range(max_atk + 1, min(max_atk + 12, n)) if i in stats and i not in asignados]
        if len(cand_after) >= 2:
            attack2_frames = cand_after[:2]
        if len(cand_after) >= 4:
            attack3_frames = cand_after[2:4]

    # Si no se encontraron por proximidad, buscar por similitud de dimensiones a 'attack'
    if not attack2_frames and atk:
        ref_w = stats[atk[0]]['w'] if atk[0] in stats else 35
        similares = [
            i for i, s in stats.items()
            if abs(s['w'] - ref_w) <= 12 and i not in asignados and i != dash_frame and i != up_frame
        ]
        if len(similares) >= 2:
            attack2_frames = similares[:2]
        if len(similares) >= 4:
            attack3_frames = similares[2:4]

    # Si aún no hay attack2, clonar o ciclar attack
    if not attack2_frames:
        attack2_frames = atk[:max(1, len(atk)//2)] if atk else [0]
    if not attack3_frames:
        attack3_frames = atk[max(1, len(atk)//2):] if atk and len(atk) > 1 else attack2_frames

    # KICK2
    kicks = f_def.get('kick', [])
    if kicks:
        cand_kick = [i for i in range(max(kicks) + 1, min(max(kicks) + 6, n)) if i in stats and i not in asignados]
        if cand_kick:
            kick2_frames = cand_kick[:2]
        else:
            kick2_frames = kicks

    return {
        'attack2': attack2_frames,
        'attack3': attack3_frames,
        'kick2': kick2_frames,
        'beam': beam_frames,
        'up': [up_frame],
        'dash': [dash_frame]
    }

def process_hero_attacks(hero_name):
    cfg = leer_config()
    if hero_name not in cfg:
        print(f"Héroe {hero_name} no encontrado")
        return False

    ataques_path = os.path.join(RAIZ, 'herramientas', 'animaciones', 'ataques.json')
    with open(ataques_path, 'r', encoding='utf-8') as f:
        ataques_data = json.load(f)

    hero_ataques = ataques_data.setdefault('heroes', {}).setdefault(hero_name, {})

    forms = cfg[hero_name]
    for form_id, f_def in forms.items():
        if form_id in hero_ataques and len(hero_ataques[form_id]) >= 4:
            print(f"  {hero_name}/{form_id}: ya configurado en ataques.json")
            continue

        try:
            rutas = frames_del_pack(f_def['pack'])
            cand = find_candidate_frames(rutas, f_def)
            hero_ataques[form_id] = cand
            print(f"  {hero_name}/{form_id}: configurado -> beam={cand['beam']}, dash={cand['dash']}, up={cand['up']}, atk2={cand['attack2']}, atk3={cand['attack3']}")
        except Exception as ex:
            print(f"  {hero_name}/{form_id}: error al procesar pack ({ex})")

    with open(ataques_path, 'w', encoding='utf-8') as f:
        json.dump(ataques_data, f, indent=2, ensure_ascii=False)
        
    return True

if __name__ == '__main__':
    if len(sys.argv) > 1:
        process_hero_attacks(sys.argv[1])
    else:
        print("Uso: python herramientas/configurar_ataques_automatico.py <heroe>")
