import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import time
import re
import json

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}

QUERIES = [
    'lsw dragon ball sheet',
    'ulsw dragon ball sheet',
    'lsw sprite sheet',
    'ulsw sprite sheet',
    'dragon ball lsw',
    'dragon ball ulsw',
    'lsw goku sheet',
    'lsw vegeta sheet',
    'lsw gohan sheet',
    'lsw trunks sheet',
    'lsw piccolo sheet',
    'lsw frieza sheet',
    'lsw cell sheet',
    'lsw buu sheet',
    'lsw broly sheet',
    'lsw bardock sheet',
    'lsw gogeta sheet',
    'lsw vegito sheet',
    'lsw jiren sheet',
    'lsw black goku sheet',
    'lsw daima sheet',
    'lsw moro sheet',
    'lsw granolah sheet',
    'lsw beast sheet',
    'lsw ultra ego sheet',
    'by:strice12 lsw',
    'by:mrdryy lsw',
    'by:qsab101 lsw',
    'by:erickjcrack507 lsw',
    'by:songoku0911 lsw',
    'by:blacksanyt lsw',
    'by:arisrad lsw',
    'by:gz52 lsw',
    'by:jayhyperstarx lsw',
    'by:brolygamer096 lsw',
    'by:bite035 lsw',
]

def search_rss(query, max_pages=3):
    items = []
    for page in range(max_pages):
        offset = page * 60
        url = f"https://backend.deviantart.com/rss.xml?type=deviation&q={urllib.parse.quote(query)}&offset={offset}"
        try:
            req = urllib.request.Request(url, headers=UA)
            resp = urllib.request.urlopen(req, timeout=10)
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
            time.sleep(0.3)
        except Exception as e:
            print(f"Error querying '{query}' offset {offset}: {e}")
            break
    return items

def main():
    all_deviations = {}
    print(f"Starting discovery across {len(QUERIES)} queries...")
    for q in QUERIES:
        items = search_rss(q, max_pages=2)
        added = 0
        for it in items:
            link = it['link']
            # Only deviation art links
            if '/art/' in link:
                # normalize link
                clean_link = link.split('?')[0]
                if clean_link not in all_deviations:
                    all_deviations[clean_link] = it
                    added += 1
        print(f"Query '{q}': found {len(items)} items ({added} new). Total unique: {len(all_deviations)}")
        time.sleep(0.2)
        
    print(f"\nTotal unique deviations found: {len(all_deviations)}")
    with open('herramientas/candidatos_deviantart.json', 'w', encoding='utf-8') as f:
        json.dump(all_deviations, f, indent=2, ensure_ascii=False)
    print("Saved candidates to herramientas/candidatos_deviantart.json")

if __name__ == '__main__':
    main()
