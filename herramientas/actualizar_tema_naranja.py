import os

css_path = '02 - Código del juego/style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update :root variables
old_root = """/* Arcade look, single dark theme: full-bleed pixel canvas, menus styled like a scouter readout */
:root{
  --bg:#070a12; --panel:#10162a; --panel2:#18213d; --edge:#2c3a6e; --ink:#eef3ff; --dim:#8f9cc8;
  --ki:#ffd23f; --orange:#f2771a; --namek:#4fd1a5; --danger:#ff4d5e; --shadow:#000;
  --pix:'Press Start 2P',ui-monospace,monospace; --body:'Press Start 2P',ui-monospace,monospace;
  color-scheme:dark;
}"""

new_root = """/* Arcade look, Dragon Ball Orange theme: full-bleed pixel canvas, Gi orange and ki amber aesthetic */
:root{
  --bg:#0c0602; --panel:#1e0e04; --panel2:#2b1407; --edge:#c2410c; --edge-glow:#ea580c; --ink:#fff7ed; --dim:#fed7aa;
  --ki:#ffd23f; --orange:#f97316; --orange-deep:#c2410c; --namek:#34d399; --danger:#ef4444; --shadow:#000;
  --pix:'Press Start 2P',ui-monospace,monospace; --body:'Press Start 2P',ui-monospace,monospace;
  color-scheme:dark;
}"""

c = c.replace(old_root.replace('\r\n', '\n'), new_root.replace('\r\n', '\n'))
c = c.replace(old_root.replace('\n', '\r\n'), new_root.replace('\n', '\r\n'))

# 2. Update .hubMenu and .hubStats
c = c.replace('background:linear-gradient(#1d3aa8,#142a7a);border:4px solid #dfe8ff;', 'background:linear-gradient(180deg,#c2410c,#7c2d12);border:4px solid #fed7aa;')

# 3. Update .rPrev and canvas
c = c.replace('background:linear-gradient(#1d3aa8,#142a7a);border:4px solid #dfe8ff;', 'background:linear-gradient(180deg,#c2410c,#7c2d12);border:4px solid #fed7aa;')
c = c.replace('background:radial-gradient(ellipse at 50% 85%,#2a4ab8,#0a1240 70%);', 'background:radial-gradient(ellipse at 50% 85%,#ea580c,#1f0a02 75%);')

# 4. Update #hudBtns button
c = c.replace('background:rgba(16,22,42,.8);color:var(--ink);border:2px solid var(--edge);', 'background:rgba(194,65,12,.88);color:#fff7ed;border:2px solid #ffd23f;box-shadow:0 0 6px rgba(249,115,22,.5);')

# 5. Update cardFace background
c = c.replace('background:#0a0f22;', 'background:#140802;')
c = c.replace('background:#050711;', 'background:#140802;')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(c)

print('style.css actualizado a tema Dragon Ball Naranja con exito')
