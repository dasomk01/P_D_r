# 여러 조각을 세로로 이어 붙여 한 장으로: python3 stack.py 출력이름 "원본.jpg|x0,y0,x1,y1" ...
import sys
from PIL import Image
out,*parts=sys.argv[1:]
ims=[Image.open(s).convert('RGB').crop(tuple(int(v) for v in b.split(','))) for s,b in (p.split('|') for p in parts)]
W=max(i.width for i in ims);g=Image.new('RGB',(W,sum(i.height for i in ims)+8*(len(ims)-1)),'white');y=0
for i in ims:g.paste(i,(0,y));y+=i.height+8
if g.width>900:g=g.resize((900,int(g.height*900/g.width)))
g.save('img/'+out+'.jpg',quality=72,optimize=True);print(out,g.size)
