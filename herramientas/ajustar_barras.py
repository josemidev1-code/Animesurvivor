path = '02 - Código del juego/script.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = "bg='#1a1f38'"
repl = "bg='#241005'"
text = text.replace(target, repl)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated bar background')
