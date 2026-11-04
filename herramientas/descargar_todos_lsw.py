import os
import sys
import json
import re
import time
import urllib.request
from PIL import Image

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}

def sanitize_filename(name):
    name = re.sub(r'[\\/*?:"<>|]', '_', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name[:100]

def categorize(title, desc=""):
    t = (title + " " + desc).lower()
    
    # Daima or GT
    if any(k in t for k in ['daima', 'mini goku', 'goku daima', 'vegeta daima', 'glorio']):
        return "09_Dragon_Ball_GT_y_Daima"
    if any(k in t for k in ['dbgt', 'gt ', 'ssj4', 'super saiyan 4', 'baby', 'omega shenron', 'syn shenron', 'uub', 'majuub', 'pan', 'gira']):
        return "09_Dragon_Ball_GT_y_Daima"
        
    # Fusiones
    if any(k in t for k in ['gogeta', 'vegito', 'vegetto', 'gotenks', 'kefla']):
        return "06_Fusiones"
        
    # Super
    if any(k in t for k in ['dbs', 'super', 'goku black', 'black goku', 'zamasu', 'jiren', 'hit', 'beerus', 'bills', 'whis', 'champa', 'moro', 'granolah', 'dyspo', 'toppo', 'caulifla', 'kale', 'cabba', 'ultra ego', 'beast gohan', 'gohan beast']):
        return "08_Dragon_Ball_Super"
        
    # Villanos DBZ & Movies
    if any(k in t for k in ['frieza', 'freezer', 'cell', 'buu', 'majin', 'broly', 'cooler', 'kula', 'janemba', 'raditz', 'nappa', 'ginyu', 'guldo', 'jeice', 'burter', 'recoome', 'zarbon', 'dodoria', 'turles', 'slug', 'garlic', 'bojack', 'hatchiyack', 'hirudegarn', 'cumber']):
        return "07_Villanos_DBZ"
        
    # Main Saiyans
    if 'goku' in t:
        return "01_Goku"
    if 'vegeta' in t:
        return "02_Vegeta"
    if 'gohan' in t:
        return "03_Gohan"
    if 'trunks' in t:
        return "04_Trunks"
        
    # Z Warriors
    if any(k in t for k in ['piccolo', 'krillin', 'krilin', 'yamcha', 'tien', 'tenshinhan', 'roshi', 'bardock', 'chaoz', 'chiaotzu', 'videl', 'hercule', 'satan', 'yajirobe', 'dende']):
        return "05_Guerreros_Z_y_Aliados"
        
    # Collections / Packs
    if any(k in t for k in ['collection', 'pack', 'sheet', 'lsw', 'ulsw']):
        return "10_Colecciones_y_Packs"
        
    return "10_Colecciones_y_Packs"

def download_sheet(item, base_dir="antigravity sprites"):
    url = item['url']
    req = urllib.request.Request(url, headers=UA)
    try:
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
    except Exception as e:
        return None, f"HTTP error: {e}"
        
    m = re.search(r'window\.__INITIAL_STATE__ = JSON\.parse\("((?:[^"\\]|\\.)*)"\)', html)
    if not m:
        return None, "No __INITIAL_STATE__"
        
    txt = re.sub(
        r'\\(u[0-9a-fA-F]{4}|.)',
        lambda g: chr(int(g.group(1)[1:], 16)) if g.group(1)[0] == 'u' and len(g.group(1)) == 5 else {'n': '\n', 't': '\t', 'r': '\r'}.get(g.group(1), g.group(1)),
        m.group(1)
    )
    
    try:
        data = json.loads(txt)
    except Exception as e:
        return None, f"JSON parse error: {e}"
        
    ent = data.get('@@entities', {})
    id_match = re.search(r'-(\d+)/?$', url)
    if not id_match:
        return None, "No deviation ID"
    did = id_match.group(1)
    
    dv = ent.get('deviation', {}).get(did)
    if not dv:
        return None, "Deviation not found"
        
    title = dv.get('title', 'Unknown')
    author = ent.get('user', {}).get(str(dv.get('author')), {}).get('username', dv.get('author', 'Unknown'))
    media = dv.get('media', {})
    base_uri = media.get('baseUri', '')
    pretty_name = media.get('prettyName', 'image')
    
    ex = ent.get('deviationExtended', {}).get(did, {})
    desc = ex.get('descriptionText', {}).get('excerpt') or ''
    if not desc:
        def extract_text(node):
            if isinstance(node, dict):
                if node.get('type') == 'text': yield node.get('text', '')
                for v in node.values(): yield from extract_text(v)
            elif isinstance(node, list):
                for v in node: yield from extract_text(v)
        desc = ' '.join(extract_text(ex.get('descriptionText', {})))
        
    types = media.get('types', [])
    fv = [t for t in types if t.get('t') == 'fullview']
    
    img_url = base_uri
    if fv:
        t = fv[-1]
        if t.get('c'):
            img_url += '/' + t['c'].replace('<prettyName>', pretty_name).lstrip('/')
    elif types:
        t = types[-1]
        if t.get('c'):
            img_url += '/' + t['c'].replace('<prettyName>', pretty_name).lstrip('/')
            
    if media.get('token'):
        img_url += '?token=' + media['token'][0]
        
    cat = categorize(title, desc)
    cat_dir = os.path.join(base_dir, cat)
    os.makedirs(cat_dir, exist_ok=True)
    
    safe_title = sanitize_filename(title)
    safe_author = sanitize_filename(author)
    filename = f"{safe_title} [{safe_author}].png"
    filepath = os.path.join(cat_dir, filename)
    
    if os.path.exists(filepath):
        try:
            im = Image.open(filepath)
            w, h = im.size
            im.close()
            return {
                'title': title,
                'author': author,
                'url': url,
                'path': filepath,
                'category': cat,
                'dimensions': f"{w}x{h}",
                'desc': desc[:300].strip(),
                'status': 'already_exists'
            }, "Already exists"
        except Exception:
            pass
            
    try:
        img_req = urllib.request.Request(img_url, headers=UA)
        img_bytes = urllib.request.urlopen(img_req, timeout=25).read()
    except Exception as e:
        return None, f"Image download error: {e}"
        
    temp_path = filepath + ".tmp"
    with open(temp_path, 'wb') as f:
        f.write(img_bytes)
        
    try:
        im = Image.open(temp_path)
        w, h = im.size
        # Minimum size checks for sprite sheets
        if w < 160 or h < 160 or (w * h < 45000):
            im.close()
            os.remove(temp_path)
            return None, f"Skipped: too small ({w}x{h})"
            
        im.close()
        os.replace(temp_path, filepath)
        return {
            'title': title,
            'author': author,
            'url': url,
            'path': filepath,
            'category': cat,
            'dimensions': f"{w}x{h}",
            'desc': desc[:300].strip(),
            'status': 'downloaded'
        }, f"Saved ({w}x{h})"
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return None, f"Image error: {e}"

def generate_index(saved_items, index_path="antigravity sprites/INDICE_SPRITES.md"):
    categories = {}
    for item in saved_items:
        categories.setdefault(item['category'], []).append(item)
        
    lines = [
        "# Índice de Sprites 2D LSW — DeviantArt",
        "",
        "> Colección de hojas de sprites 2D de Dragon Ball en estilo LSW (Legendary Super Warriors / ULSW) descargadas desde DeviantArt.",
        f"> Total de hojas de sprites: **{len(saved_items)}**",
        "",
        "## Categorías",
        ""
    ]
    
    for cat in sorted(categories.keys()):
        count = len(categories[cat])
        lines.append(f"- [{cat}](#{cat.lower()}) ({count} hojas)")
    lines.append("")
    
    for cat in sorted(categories.keys()):
        lines.append(f"## {cat}")
        lines.append("")
        lines.append("| Título | Autor | Dimensiones | Archivo | Fuente Original |")
        lines.append("|---|---|---|---|---|")
        for item in sorted(categories[cat], key=lambda x: x['title']):
            title = item['title'].replace('|', '/')
            author = item['author'].replace('|', '/')
            dims = item['dimensions']
            rel_path = os.path.relpath(item['path'], os.path.dirname(index_path)).replace('\\', '/')
            url = item['url']
            lines.append(f"| {title} | **{author}** | {dims} | [`{os.path.basename(rel_path)}`]({rel_path}) | [DeviantArt]({url}) |")
        lines.append("")
        
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"Generated index: {index_path}")

def main():
    with open('herramientas/prometedores_lsw.json', 'r', encoding='utf-8') as f:
        candidates = json.load(f)
        
    # Move earlier test downloads into new categories if needed
    base_dir = "antigravity sprites"
    
    # We want a rich collection of top sheets across characters
    # Target: 150 highest quality unique sheets
    max_to_download = 150
    
    saved_items = []
    index_cache_file = "herramientas/descargados_cache.json"
    if os.path.exists(index_cache_file):
        try:
            with open(index_cache_file, 'r', encoding='utf-8') as f:
                saved_items = json.load(f)
        except Exception:
            saved_items = []
            
    downloaded_urls = {item['url'] for item in saved_items}
    
    print(f"Total candidates available: {len(candidates)}")
    print(f"Already in cache: {len(saved_items)}")
    
    success_count = 0
    consecutive_errors = 0
    
    for idx, item in enumerate(candidates):
        if len(saved_items) >= max_to_download:
            print(f"Reached target of {max_to_download} sheets!")
            break
            
        url = item['url']
        if url in downloaded_urls:
            continue
            
        print(f"[{idx+1}/{len(candidates)}] {item['title'][:40]}...", end=" ", flush=True)
        res, msg = download_sheet(item, base_dir)
        print(msg)
        
        if res:
            saved_items.append(res)
            downloaded_urls.add(url)
            success_count += 1
            consecutive_errors = 0
            # Periodically save cache and index
            if success_count % 5 == 0:
                with open(index_cache_file, 'w', encoding='utf-8') as f:
                    json.dump(saved_items, f, indent=2, ensure_ascii=False)
                generate_index(saved_items)
        else:
            if "HTTP error" in msg and "403" in msg:
                consecutive_errors += 1
                if consecutive_errors >= 3:
                    print("Received multiple 403 Forbidden. Pausing 10s...")
                    time.sleep(10)
            else:
                consecutive_errors = 0
                
        time.sleep(0.4)
        
    with open(index_cache_file, 'w', encoding='utf-8') as f:
        json.dump(saved_items, f, indent=2, ensure_ascii=False)
    generate_index(saved_items)
    print(f"\nDownload finished! Total saved sheets: {len(saved_items)}")

if __name__ == '__main__':
    main()
