# 학습지 페이지 이미지(read_material_pages 결과)에서 그림을 잘라 img/에 저장: python3 crop.py 원본.jpg 출력이름 x0 y0 x1 y1 (원본 픽셀 좌표)
import sys
from PIL import Image
src,out,*b=sys.argv[1:]
im=Image.open(src).convert('RGB');W,H=im.size
x0,y0,x1,y1=[float(v) for v in b]
c=im.crop((int(x0),int(y0),int(x1),int(y1)))
if c.width>900: c=c.resize((900,int(c.height*900/c.width)))
c.save('img/'+out+'.jpg',quality=72,optimize=True);print(out,c.size)
