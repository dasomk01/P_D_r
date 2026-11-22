# 순음청력도 그리기(PIL): 학습지에 원 그림이 없는 문항·차동뿌시기용 재구성 청력도
# python3 audg.py  → img/ 에 아래 SPEC 대로 생성
from PIL import Image, ImageDraw, ImageFont
F = [250, 500, 1000, 2000, 4000, 8000]
def font(n):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        try: return ImageFont.truetype(p, n)
        except Exception: pass
    return ImageFont.load_default()
def panel(d, ox, oy, W, H, title, series):
    f, fs = font(13), font(11)
    x = lambda i: ox + 40 + i * (W - 60) / (len(F) - 1)
    y = lambda db: oy + 28 + (db + 10) * (H - 50) / 130
    d.text((ox + W / 2 - len(title) * 3.5, oy + 4), title, fill='black', font=f)
    for db in range(-10, 121, 10):
        d.line([(x(0), y(db)), (x(len(F) - 1), y(db))], fill='#ccc' if db else '#666', width=1)
        d.text((ox + 4, y(db) - 6), str(db), fill='black', font=fs)
    for i, fr in enumerate(F):
        d.line([(x(i), y(-10)), (x(i), y(120))], fill='#ccc', width=1)
        d.text((x(i) - 12, y(120) + 4), (str(fr // 1000) + 'k') if fr >= 1000 else str(fr), fill='black', font=fs)
    for kind, vals in series:
        col = 'red' if kind[0] == 'R' else 'blue'
        pts = [(x(i), y(v)) for i, v in enumerate(vals) if v is not None]
        if kind[1:] == 'AC':
            d.line(pts, fill=col, width=2)
            for px, py in pts:
                if kind[0] == 'R': d.ellipse([px - 6, py - 6, px + 6, py + 6], outline=col, width=2)
                else: d.line([px - 6, py - 6, px + 6, py + 6], fill=col, width=2); d.line([px - 6, py + 6, px + 6, py - 6], fill=col, width=2)
        else:  # BC: 오른쪽 '[' 왼쪽 ']'
            for px, py in pts:
                if kind[0] == 'R': d.line([(px - 4, py - 7), (px - 9, py - 7), (px - 9, py + 7), (px - 4, py + 7)], fill=col, width=2)
                else: d.line([(px + 4, py - 7), (px + 9, py - 7), (px + 9, py + 7), (px + 4, py + 7)], fill=col, width=2)
def draw(out, series, two=False, note='reconstructed', label=True):
    W, H = 330, 300
    im = Image.new('RGB', (W * (2 if two else 1) + 10, H + 24), 'white'); d = ImageDraw.Draw(im)
    if two:
        panel(d, 0, 0, W, H, 'Right (O, [ )' if label else '', [s for s in series if s[0][0] == 'R'])
        panel(d, W + 10, 0, W, H, 'Left (X, ] )' if label else '', [s for s in series if s[0][0] == 'L'])
    else:
        panel(d, 0, 0, W, H, 'Hz / dB HL', series)
    d.text((6, H + 6), note, fill='#888', font=font(11))
    im.save(out, quality=90); print(out, im.size)
N = None
SPEC = {
 # 학습지에 원 그림이 없는 야마 – 학습지 해설 설명대로 재구성
 'presby-2016': [('RAC', [15, 20, 25, 40, 60, 70]), ('LAC', [15, 20, 25, 40, 60, 70]), ('RBC', [15, 20, 25, 40, 60, N]), ('LBC', [15, 20, 25, 40, 60, N])],
 'comhl-2019': [('RAC', [40, 40, 35, 45, 60, 50]), ('RBC', [5, 5, 10, 10, 10, N]), ('LAC', [5, 5, 10, 10, 10, 15]), ('LBC', [5, 5, 10, 10, 10, N])],
 'nihl-2013': [('RAC', [10, 10, 15, 25, 60, 30]), ('LAC', [10, 15, 15, 25, 65, 35]), ('RBC', [10, 10, 15, 25, 60, N]), ('LBC', [10, 15, 15, 25, 65, N])],
 # 차동뿌시기
 'cd-28': [('RAC', [55, 55, 55, 55, 55, 55]), ('RBC', [10, 10, 10, 10, 10, N]), ('LAC', [10, 10, 10, 10, 10, 10]), ('LBC', [10, 10, 10, 10, 10, N])],
 'cd-07': [('RAC', [45, 45, 40, 45, 35, 35]), ('RBC', [10, 10, 10, 30, 10, N]), ('LAC', [40, 40, 35, 45, 30, 30]), ('LBC', [5, 10, 10, 30, 10, N])],
 'cd-13': [('RAC', [10, 10, 10, 10, 15, 15]), ('LAC', [50, 45, 30, 20, 20, 20]), ('RBC', [10, 10, 10, 10, 15, N]), ('LBC', [50, 45, 30, 20, 20, N])],
 'cd-01': [('RAC', [70, 70, 75, 75, 70, 70]), ('RBC', [70, 70, 75, 75, 70, N]), ('LAC', [10, 10, 10, 15, 15, 15]), ('LBC', [10, 10, 10, 15, 15, N])],
 'cd-20': [('RAC', [10, 10, 15, 15, 20, 20]), ('LAC', [25, 25, 30, 35, 40, 40]), ('RBC', [10, 10, 15, 15, 20, N]), ('LBC', [25, 25, 30, 35, 40, N])],
}
if __name__ == '__main__':
    for k, s in SPEC.items():
        cd = k.startswith('cd')
        draw('img/aud-' + k + '.jpg', s, two=True, label=not cd, note='side not labeled (O / X / [ / ])' if cd else 'reconstructed from workbook commentary (no original figure)')
