import json
import re

with open('herramientas/candidatos_deviantart.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

print(f"Total initial candidates: {len(candidates)}")

# Dragon Ball keywords
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
    'fu', 'demigra', 'mira', 'towa', 'hatchiyack', 'hirudegarn', 'tarble', 'king cold', 'king vegeta'
]

# Sheet / sprite keywords
SHEET_KEYWORDS = ['sheet', 'sprite', 'sprites', 'spritesheet', 'ulsw', 'lsw', 'swl']

# Negative keywords
EXCLUDE = ['sonic', 'naruto', 'bleach', 'one piece', 'mario', 'pokemon', 'roblox', 'minecraft', 'undertale', 'fnf', 'friday night']

filtered = []

for url, data in candidates.items():
    title = data.get('title', '').lower()
    desc = data.get('desc', '').lower()
    text = title + " " + desc
    
    # Check LSW / ULSW
    is_lsw = any(k in text for k in ['lsw', 'ulsw', 'swl', 'legendary super warrior'])
    if not is_lsw:
        continue
        
    # Check Dragon Ball
    is_db = any(k in text for k in DB_KEYWORDS)
    if not is_db:
        continue
        
    # Check sheet / sprite
    is_sheet = any(k in text for k in SHEET_KEYWORDS)
    if not is_sheet:
        continue
        
    # Check exclusions (unless it also has DB)
    has_exclude = any(ex in text for ex in EXCLUDE)
    if has_exclude and not any(k in title for k in ['goku', 'vegeta', 'dbz', 'dragon ball']):
        continue
        
    filtered.append({
        'url': url,
        'title': data.get('title', ''),
        'query': data.get('query', '')
    })

print(f"Filtered promising Dragon Ball LSW sheets: {len(filtered)}")

# Group by character/theme
categories = {}
for item in filtered:
    title_lower = item['title'].lower()
    matched_char = "Otros"
    for k in DB_KEYWORDS:
        if k in title_lower:
            matched_char = k.capitalize()
            break
    categories.setdefault(matched_char, []).append(item)

print(f"\nBreakdown by character ({len(categories)} categories):")
for cat, items in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"  {cat}: {len(items)} items")

with open('herramientas/prometedores_lsw.json', 'w', encoding='utf-8') as f:
    json.dump(filtered, f, indent=2, ensure_ascii=False)
