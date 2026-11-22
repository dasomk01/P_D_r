# 그림에 문항 번호·기호 라벨 붙이기(학습지 원 그림엔 라벨이 없을 때). python3 ann.py
from PIL import Image, ImageDraw, ImageFont
def f(n):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
        try: return ImageFont.truetype(p, n)
        except Exception: pass
    return ImageFont.load_default()
L = {  # 학습지 해설의 번호 붙임 그대로
 'cielec-2025': [('1',255,160),('2',258,228),('a',205,330),('b',268,388),('c',150,470)],   # 1 난원창, 2 정원창 / a 전정계, b 중간계, c 고실계
 'cielec-2023': [('1',176,186),('2',176,140),('A',190,400),('B',240,448),('C',125,535)],   # 1 정원창, 2 난원창
 'cielec-2022': [('1',205,212),('2',212,170),('A',225,470),('B',285,530),('C',150,630)],
}
for k, labs in L.items():
    im = Image.open('img/'+k+'.jpg').convert('RGB'); d = ImageDraw.Draw(im); ft = f(17)
    for t, x, y in labs:
        d.ellipse([x-13, y-13, x+13, y+13], fill='white', outline='red', width=3)
        w = d.textlength(t, font=ft); d.text((x-w/2, y-11), t, fill='red', font=ft)
    im.save('img/'+k+'-L.jpg', quality=90); print(k)
