# 선지마다 사진이 있는 문항: 여러 조각을 ①②③… 라벨을 붙여 한 장으로 합친다.
# python3 grid.py 출력이름 "라벨|원본.jpg|x0,y0,x1,y1" ...
import sys
from PIL import Image, ImageDraw, ImageFont
out, *parts = sys.argv[1:]
tiles = []
for p in parts:
  lab, src, box = p.split('|')
  im = Image.open(src).convert('RGB').crop(tuple(int(v) for v in box.split(',')))
  im.thumbnail((300, 300)); tiles.append((lab, im))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc', 28)
except Exception:
  import glob; fs = glob.glob('/usr/share/fonts/**/*CJK*', recursive=True) + glob.glob('/usr/share/fonts/**/*.ttf', recursive=True)
  font = ImageFont.truetype(fs[0], 28) if fs else ImageFont.load_default()
cols = 3 if len(tiles) > 4 else 2; W = 310; H = max(t.height for _, t in tiles) + 40
rows = (len(tiles) + cols - 1) // cols
g = Image.new('RGB', (cols * W, rows * H), 'white'); d = ImageDraw.Draw(g)
for i, (lab, t) in enumerate(tiles):
  x, y = (i % cols) * W, (i // cols) * H
  d.text((x + 6, y + 2), lab, fill='black', font=font); g.paste(t, (x + 5, y + 36))
g.save('img/' + out + '.jpg', quality=72, optimize=True); print(out, g.size)
