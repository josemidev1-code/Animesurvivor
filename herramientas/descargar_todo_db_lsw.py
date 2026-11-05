import os
import sys
import json
import re
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from PIL import Image

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}

QUERIES = [
    # General LSW & ULSW
    'lsw dragon ball sheet',
    'ulsw dragon ball sheet',
    'lsw sprite sheet',
    'ulsw sprite sheet',
    'dragon ball lsw sheet',
    'dragon ball ulsw sheet',
    'swl dragon ball sheet',
    'lsw spritesheet',
    'ulsw spritesheet',
    
    # DB Clásico
    'lsw kid goku',
    'lsw master roshi',
    'lsw tao pai pai',
    'lsw king piccolo',
    'lsw yamcha',
    'lsw krillin',
    'lsw tien shinhan',
    'lsw chiaotzu',
    'lsw yajirobe',
    
    # Saiyans
    'lsw raditz',
    'lsw nappa',
    'lsw bardock sheet',
    'lsw king vegeta',
    'lsw cumber',
    'lsw shallot',
    
    # Namek & Frieza
    'lsw zarbon',
    'lsw dodoria',
    'lsw captain ginyu',
    'lsw recoome',
    'lsw burter',
    'lsw jeice',
    'lsw guldo',
    'lsw frieza sheet',
    'lsw freezer sheet',
    'lsw mecha frieza',
    'lsw golden frieza',
    'lsw black frieza',
    
    # Androides & Cell
    'lsw android 16',
    'lsw android 17 sheet',
    'lsw android 18 sheet',
    'lsw android 19',
    'lsw android 20 gero',
    'lsw android 21',
    'lsw cell sheet',
    'lsw perfect cell',
    'lsw cell jr',
    
    # Buu Saga
    'lsw majin buu sheet',
    'lsw super buu',
    'lsw kid buu sheet',
    'lsw dabura',
    'lsw babidi',
    'lsw videl',
    'lsw great saiyaman',
    'lsw mr satan',
    'lsw gotenks sheet',
    'lsw vegito sheet',
    'lsw majin vegeta sheet',
    
    # Películas & OVAs
    'lsw garlic jr',
    'lsw turles sheet',
    'lsw lord slug',
    'lsw cooler sheet',
    'lsw metal cooler',
    'lsw android 13',
    'lsw broly sheet',
    'lsw bojack',
    'lsw janemba sheet',
    'lsw hirudegarn',
    'lsw tapion',
    'lsw gogeta sheet',
    
    # GT
    'lsw goku gt sheet',
    'lsw vegeta gt',
    'lsw trunks gt',
    'lsw pan gt',
    'lsw uub sheet',
    'lsw baby vegeta',
    'lsw super 17',
    'lsw omega shenron',
    'lsw ssj4 goku sheet',
    'lsw ssj4 vegeta sheet',
    'lsw ssj4 gogeta sheet',
    
    # Super
    'lsw beerus sheet',
    'lsw whis sheet',
    'lsw champa',
    'lsw hit sheet',
    'lsw frost',
    'lsw cabba',
    'lsw caulifla sheet',
    'lsw kale sheet',
    'lsw kefla sheet',
    'lsw toppo sheet',
    'lsw dyspo',
    'lsw jiren sheet',
    'lsw goku black sheet',
    'lsw zamasu sheet',
    'lsw fused zamasu',
    'lsw ultra instinct sheet',
    'lsw ultra ego sheet',
    'lsw beast gohan sheet',
    'lsw orange piccolo',
    'lsw moro sheet',
    'lsw granolah',
    
    # Daima
    'lsw daima sheet',
    'lsw goku daima',
    'lsw vegeta daima',
    'lsw glorio daima',
    
    # Top Creadores
    'by:qsab101 lsw',
    'by:mrdryy lsw',
    'by:strice12 lsw',
    'by:songoku0911 lsw',
    'by:blacksanyt lsw',
    'by:erickjcrack507 lsw',
    'by:justoruma lsw',
    'by:thekrillmaster lsw',
    'by:bite035 lsw',
    'by:mast3rk1ll3r171 lsw',
    'by:cenket lsw',
    'by:chrisreinervv lsw',
    'by:said971 lsw',
    'by:gz52 lsw',
    'by:jayhyperstarx lsw'
]

DB_KEYWORDS = [
    'goku', 'vegeta', 'gohan', 'trunks', 'piccolo', 'frieza', 'freezer', 'cell', 'buu',
    'broly', 'bardock', 'gogeta', 'vegito', 'vegetto', 'jiren', 'black', 'rose', 'daima',
    'moro', 'granolah', 'beast', 'ego', 'gotenks', 'goten', 'raditz', 'nappa', 'ginyu',
    'zarbon', 'dodoria', 'cooler', 'janemba', 'bojack', 'tapion', 'beerus', 'whis',
    'champa', 'hit', 'cabba', 'caulifla', 'kale', 'kefla', 'toppo', 'dyspo', 'pan',
    'uub', 'baby', 'omega', 'shenron', 'turles', 'slug', 'androide', 'android', 'saiyan',
    'super saiyan', 'ssj', 'ssg', 'ssb', 'ssj4', 'ui', 'mui', 'dbz', 'dbs', 'dbgt', 'dragon ball',
    'krilin', 'krillin', 'yamcha', 'tenshinhan', 'tien', 'roshi', 'chaoz', 'chiaotzu', 'videl',
    'hercule', 'satan', 'dabra', 'dabura', 'majin', 'garlic', 'cumber', 'shallot', 'giblet',
    'fu', 'demigra', 'mira', 'towa', 'hatchiyack', 'hirudegarn', 'tarble', 'king cold', 'king vegeta',
    'glorio', 'gomah', 'degesu', 'frost', 'vados', 'saibaman', 'cui', 'nail', 'dende'
]

EXCLUDE = [
    'spider-man', 'spiderman', 'miles morales', 'sonic', 'mario', 'naruto', 'bleach',
    'one piece', 'pokemon', 'roblox', 'minecraft', 'undertale', 'fnf', 'friday night',
    'cinder', 'ruby spears', 'doropie', 'yu-gi-oh', 'yugioh'
]

def sanitize_filename(name):
    name = re.sub(r'[\\/*?:"<>|]', '_', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name[:100]

def categorize(title, desc=""):
    t = (title + " " + desc).lower()
    
    # Daima or GT
    if any(k in t for k in ['daima', 'mini goku', 'goku daima', 'vegeta daima', 'glorio', 'gomah', 'degesu']):
        return "09_Dragon_Ball_GT_y_Daima"
    if any(k in t for k in ['dbgt', 'gt ', 'ssj4', 'super saiyan 4', 'baby', 'omega shenron', 'syn shenron', 'uub', 'majuub', 'pan', 'gira', 'nova shenron', 'nuova shenron']):
        return "09_Dragon_Ball_GT_y_Daima"
        
    # Fusiones
    if any(k in t for k in ['gogeta', 'vegito', 'vegetto', 'gotenks', 'kefla']):
        return "06_Fusiones"
        
    # Super
    if any(k in t for k in ['dbs', 'super', 'goku black', 'black goku', 'zamasu', 'jiren', 'hit', 'beerus', 'bills', 'whis', 'champa', 'moro', 'granolah', 'dyspo', 'toppo', 'caulifla', 'kale', 'cabba', 'ultra ego', 'beast gohan', 'gohan beast', 'orange piccolo', 'frost', 'vados']):
        return "08_Dragon_Ball_Super"
        
    # Villanos DBZ & Movies
    if any(k in t for k in ['frieza', 'freezer', 'cell', 'buu', 'majin', 'broly', 'cooler', 'kula', 'janemba', 'raditz', 'nappa', 'ginyu', 'guldo', 'jeice', 'burter', 'recoome', 'zarbon', 'dodoria', 'turles', 'slug', 'garlic', 'bojack', 'hatchiyack', 'hirudegarn', 'cumber', 'cui', 'babidi', 'dabura', 'dabra', 'saibaman']):
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
    if any(k in t for k in ['piccolo', 'krillin', 'krilin', 'yamcha', 'tien', 'tenshinhan', 'roshi', 'bardock', 'chaoz', 'chiaotzu', 'videl', 'hercule', 'satan', 'yajirobe', 'dende', 'nail', 'jackie chun', 'ox king', 'chi chi', 'chichi', 'tao pai pai']):
        return "05_Guerreros_Z_y_Aliados"
        
    # Collections / Packs
    if any(k in t for k in ['collection', 'pack', 'sheet', 'lsw', 'ulsw']):
        return "10_Colecciones_y_Packs"
        
    return "10_Colecciones_y_Packs"

def search_rss(query, max_pages=3):
    items = []
    for page in range(max_pages):
        offset = page * 60
        url = f"https://backend.deviantart.com/rss.xml?type=deviation&q={urllib.parse.quote(query)}&offset={offset}"
        try:
            req = urllib.request.Request(url, headers=UA)
            resp = urllib.request.urlopen(req, timeout=12)
            content = resp.read()
            root = ET.fromstring(content)
            page_items = root.findall('.//item')
            if not page_items:
                break
            for item in page_items:
                title_elem = item.find('title')
                link_elem = item.find('link')
                desc_elem = item.find('description')
                title = title_elem.text if title_elem is not None else ''
                link = link_elem.text if link_elem is not None else ''
                desc = desc_elem.text if desc_elem is not None else ''
                items.append({
                    'title': title,
                    'link': link,
                    'desc': desc,
                    'query': query
                })
            if len(page_items) < 60:
                break
            time.sleep(0.8)
        except urllib.error.HTTPError as e:
            if e.code == 403:
                print(f" [Rate-limit 403 on '{query}', pausing 8s...]")
                time.sleep(8)
            break
        except Exception:
            break
    return items

def download_sheet(url, base_dir="antigravity sprites"):
    req = urllib.request.Request(url, headers=UA)
    try:
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
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
        
    text_check = (title + " " + desc).lower()
    # Check exclude
    if any(ex in text_check for ex in EXCLUDE) and not any(db in text_check for db in ['dragon ball', 'goku', 'vegeta']):
        return None, "Excluded (non-DB)"
        
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
        # Minimum size checks for sprite sheets (must be >= 180x180 and area >= 45,000)
        if w < 180 or h < 180 or (w * h < 45000):
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
        "> Colección exhaustiva de hojas de sprites 2D de Dragon Ball en estilo LSW (Legendary Super Warriors / ULSW / SWL) descargadas desde DeviantArt a máxima resolución original.",
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

def main():
    base_dir = "antigravity sprites"
    index_cache_file = "herramientas/descargados_cache.json"
    
    # Load existing downloaded items from disk/cache
    saved_items = []
    if os.path.exists(index_cache_file):
        try:
            with open(index_cache_file, 'r', encoding='utf-8') as f:
                saved_items = json.load(f)
        except Exception:
            saved_items = []
            
    # Re-verify that existing items actually exist on disk
    valid_saved = []
    for it in saved_items:
        if os.path.exists(it['path']):
            valid_saved.append(it)
    saved_items = valid_saved
    downloaded_urls = {item['url'] for item in saved_items}
    print(f"Existing valid sheets on disk: {len(saved_items)}")
    
    # 1. Discovery stage
    print(f"\n--- Fase 1: Descubrimiento exhaustivo ({len(QUERIES)} consultas) ---")
    all_candidates = {}
    
    for q_idx, q in enumerate(QUERIES):
        print(f"[{q_idx+1}/{len(QUERIES)}] Consultando '{q}'...", end=" ", flush=True)
        items = search_rss(q, max_pages=3)
        added = 0
        for it in items:
            link = it['link']
            if '/art/' in link:
                clean_link = link.split('?')[0]
                if clean_link not in all_candidates and clean_link not in downloaded_urls:
                    # Filter basic text
                    text = (it['title'] + " " + it['desc']).lower()
                    is_db = any(k in text for k in DB_KEYWORDS)
                    is_lsw = any(k in text for k in ['lsw', 'ulsw', 'swl', 'legendary super warrior'])
                    is_sheet = any(k in text for k in ['sheet', 'sprite', 'sprites', 'spritesheet', 'ulsw', 'lsw', 'swl'])
                    is_ex = any(ex in text for ex in EXCLUDE) and not any(db in text for db in ['dragon ball', 'goku', 'vegeta'])
                    
                    if (is_db or is_lsw) and is_sheet and not is_ex:
                        all_candidates[clean_link] = it
                        added += 1
        print(f"encontrados {len(items)} ({added} nuevos candidatos). Total pendientes: {len(all_candidates)}")
        time.sleep(0.5)
        
    print(f"\nTotal nuevos candidatos descubiertos listos para procesar: {len(all_candidates)}")
    
    # 2. Download stage
    print(f"\n--- Fase 2: Descarga de todas las hojas válidas ---")
    consecutive_errors = 0
    new_downloads = 0
    
    for idx, (url, cand) in enumerate(all_candidates.items()):
        title = cand['title'][:38]
        print(f"[{idx+1}/{len(all_candidates)}] {title}...", end=" ", flush=True)
        res, msg = download_sheet(url, base_dir)
        print(msg)
        
        if res:
            saved_items.append(res)
            downloaded_urls.add(url)
            new_downloads += 1
            consecutive_errors = 0
            
            if new_downloads % 5 == 0:
                with open(index_cache_file, 'w', encoding='utf-8') as f:
                    json.dump(saved_items, f, indent=2, ensure_ascii=False)
                generate_index(saved_items)
        else:
            if "403" in msg or "429" in msg:
                consecutive_errors += 1
                pause_time = min(60, 10 * consecutive_errors)
                print(f"  [Aviso de servidor: esperando {pause_time}s...]")
                time.sleep(pause_time)
            else:
                consecutive_errors = 0
                
        time.sleep(0.4)
        
    # Final cleanup and indexing
    with open(index_cache_file, 'w', encoding='utf-8') as f:
        json.dump(saved_items, f, indent=2, ensure_ascii=False)
    generate_index(saved_items)
    print(f"\nProceso finalizado. Total acumulado de hojas descargadas: {len(saved_items)} (Nuevas descargadas: {new_downloads})")

if __name__ == '__main__':
    main()
