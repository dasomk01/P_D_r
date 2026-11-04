# 학습지 쪽 이미지에서 그림 잘라내기: python3 crop.py 원본.jpg out.jpg x0 y0 x1 y1 [x0 y0 x1 y1 ...] (여러 칸이면 세로로 이어 붙임)
import sys
from PIL import Image
src,out=sys.argv[1],sys.argv[2]; b=list(map(int,sys.argv[3:]))
im=Image.open(src).convert('RGB'); parts=[im.crop(tuple(b[i:i+4])) for i in range(0,len(b),4)]
W=max(p.width for p in parts); H=sum(p.height for p in parts)
c=Image.new('RGB',(W,H),'white'); y=0
for p in parts: c.paste(p,(0,y)); y+=p.height
c.save(out,quality=82); print(out,c.size)
