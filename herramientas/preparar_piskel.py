import os
import sys
import json
import base64
import io
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from montar_animaciones import leer_config, cargar_forma, tira, CLAVES, DUR, RAIZ

def export_to_piskel(heroe, forma, out_dir="piskel_animaciones"):
    config = leer_config()
    if heroe not in config or forma not in config[heroe]:
        print(f"Error: {heroe}/{forma} not found in configs")
        return False
        
    f = config[heroe][forma]
    anims, portrait, scale = cargar_forma(f)
    
    char_dir = os.path.join(RAIZ, out_dir, f"{heroe}_{forma}")
    os.makedirs(char_dir, exist_ok=True)
    
    print(f"\n--- Preparando animaciones para Piskel: {heroe} (forma {forma}) ---")
    print(f"Guardando en: {char_dir}")
    
    exported = []
    
    for anim_name, frames in anims.items():
        if not frames:
            continue
            
        anim_dir = os.path.join(char_dir, anim_name)
        os.makedirs(anim_dir, exist_ok=True)
        
        # Determine cell size
        max_w = max(fr.width for fr in frames)
        max_h = max(fr.height for fr in frames)
        # Pad slightly to standard pixel box
        box_size = max(32, max(max_w, max_h))
        # Ensure even box
        if box_size % 2 != 0:
            box_size += 1
            
        # 1. Save individual PNG frames
        aligned_frames = []
        for idx, fr in enumerate(frames):
            frame_img = Image.new('RGBA', (box_size, box_size), (0, 0, 0, 0))
            # Align bottom-center (feet on ground)
            x = (box_size - fr.width) // 2
            y = box_size - fr.height
            frame_img.paste(fr, (x, y), fr)
            frame_path = os.path.join(anim_dir, f"frame_{idx:02d}.png")
            frame_img.save(frame_path)
            aligned_frames.append(frame_img)
            
        # 2. Save Animated GIF (Drag & drop into Piskel)
        gif_path = os.path.join(anim_dir, f"{heroe}_{anim_name}.gif")
        durations = [120] * len(aligned_frames)
        # Check specific durations from config
        clave = [k for k, v in CLAVES.items() if v == anim_name]
        if clave:
            du_key = clave[0] + 'Du'
            if du_key in f:
                durations = [int(ticks / 60.0 * 1000) for ticks in f[du_key]]
                
        aligned_frames[0].save(
            gif_path,
            save_all=True,
            append_images=aligned_frames[1:],
            duration=durations,
            loop=0,
            disposal=2
        )
        
        # 3. Save Spritesheet strip PNG
        strip = Image.new('RGBA', (box_size * len(aligned_frames), box_size), (0, 0, 0, 0))
        for idx, afr in enumerate(aligned_frames):
            strip.paste(afr, (idx * box_size, 0), afr)
        strip_path = os.path.join(anim_dir, f"{heroe}_{anim_name}_sheet.png")
        strip.save(strip_path)
        
        # 4. Generate native .piskel file
        buf = io.BytesIO()
        strip.save(buf, format='PNG')
        b64_png = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode('ascii')
        
        layer_dict = {
            "name": f"{anim_name} Layer",
            "opacity": 1,
            "frameCount": len(aligned_frames),
            "chunks": [
                {
                    # Piskel divide el ancho entre len(layout): una entrada por fotograma de la tira
                    "layout": [[i] for i in range(len(aligned_frames))],
                    "base64PNG": b64_png
                }
            ]
        }
        
        piskel_data = {
            "modelVersion": 2,
            "piskel": {
                "name": f"{heroe}_{anim_name}",
                "description": f"Animación {anim_name} de {heroe} para AnimeSurvivor",
                "fps": 8,
                "height": box_size,
                "width": box_size,
                "layers": [
                    json.dumps(layer_dict)
                ]
            }
        }
        
        piskel_file_path = os.path.join(anim_dir, f"{heroe}_{anim_name}.piskel")
        with open(piskel_file_path, 'w', encoding='utf-8') as pf:
            json.dump(piskel_data, pf)
            
        exported.append({
            'anim': anim_name,
            'frames': len(frames),
            'box_size': f"{box_size}x{box_size}",
            'gif': gif_path,
            'sheet': strip_path,
            'piskel': piskel_file_path
        })
        print(f"  [{anim_name}]: {len(frames)} frames -> GIF, Sheet PNG y .piskel generados ({box_size}x{box_size})")
        
    # Generate README for this character in piskel_animaciones
    readme_path = os.path.join(char_dir, "LEEME_PISKEL.md")
    lines = [
        f"# Animaciones para Piskel — {heroe.upper()} (Forma {forma})",
        "",
        "Esta carpeta contiene las animaciones listas para abrir y editar en **Piskel** (https://www.piskelapp.com/).",
        "",
        "## Cómo abrir en Piskel:",
        "1. Entra a **https://www.piskelapp.com/p/create** en tu navegador.",
        "2. Haz clic en el icono de carpeta de la barra derecha (**Import**).",
        "3. Elige cualquiera de estas opciones:",
        "   - **Import .piskel file**: selecciona el archivo `.piskel` de cualquier animación.",
        "   - **Import animated GIF**: selecciona el archivo `.gif` (Piskel importa todos los fotogramas y la velocidad al instante).",
        "   - **Import from picture**: selecciona el `_sheet.png` (pon el Frame size que se indica abajo).",
        "",
        "## Animaciones disponibles:",
        "",
        "| Animación | Fotogramas | Tamaño de celda | Archivo .piskel | GIF animado | Hoja Strip |",
        "|---|---|---|---|---|---|"
    ]
    for ex in exported:
        rel_piskel = os.path.basename(ex['piskel'])
        rel_gif = os.path.basename(ex['gif'])
        rel_sheet = os.path.basename(ex['sheet'])
        anim = ex['anim']
        lines.append(f"| **{anim}** | {ex['frames']} | {ex['box_size']} | [`{rel_piskel}`]({anim}/{rel_piskel}) | [`{rel_gif}`]({anim}/{rel_gif}) | [`{rel_sheet}`]({anim}/{rel_sheet}) |")
        
    with open(readme_path, 'w', encoding='utf-8') as rf:
        rf.write("\n".join(lines))
        
    print(f"\nGuía creada: {readme_path}")
    return True

if __name__ == '__main__':
    hero = sys.argv[1] if len(sys.argv) > 1 else 'vegeta'
    form = sys.argv[2] if len(sys.argv) > 2 else '0'
    export_to_piskel(hero, form)
