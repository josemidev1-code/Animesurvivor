import os
import json
import re

INDEX_PATH = "antigravity sprites/INDICE_SPRITES.md"
CACHE_PATH = "herramientas/descargados_cache.json"

NON_DB = ['spider-man', 'spiderman', 'miles morales', 'sonic', 'mario', 'naruto', 'cinder', 'ruby spears', 'doropie']

with open(CACHE_PATH, 'r', encoding='utf-8') as f:
    items = json.load(f)

cleaned_items = []
removed = []

for item in items:
    title_lower = item['title'].lower()
    desc_lower = item.get('desc', '').lower()
    text = title_lower + " " + desc_lower
    
    is_non_db = any(nd in text for nd in NON_DB)
    if is_non_db:
        # Check if file exists and remove it
        if os.path.exists(item['path']):
            os.remove(item['path'])
            print(f"Removed non-DB file: {item['path']}")
        removed.append(item['title'])
    else:
        cleaned_items.append(item)

print(f"Removed {len(removed)} non-Dragon Ball files.")
print(f"Remaining Dragon Ball sheets: {len(cleaned_items)}")

with open(CACHE_PATH, 'w', encoding='utf-8') as f:
    json.dump(cleaned_items, f, indent=2, ensure_ascii=False)

# Re-generate index
import sys
sys.path.append('herramientas')
from descargar_todos_lsw import generate_index

generate_index(cleaned_items, INDEX_PATH)
print("Index updated cleanly.")
