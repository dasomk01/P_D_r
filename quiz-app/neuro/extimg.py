"""neuro-app.html 안의 base64 이미지를 yimg/ 폴더의 별도 파일로 빼서 페이지 용량을 줄인다(아티팩트 files로 함께 게시)."""
import re,base64,hashlib,os
D=os.path.dirname(os.path.abspath(__file__))
s=open(D+'/neuro-app.html',encoding='utf-8').read()
def f(m):
  ext=m.group(1).replace('jpeg','jpg'); b=base64.b64decode(m.group(2))
  fn='e_'+hashlib.md5(b).hexdigest()[:12]+'.'+ext
  p=D+'/yimg/'+fn
  if not os.path.exists(p): open(p,'wb').write(b)
  return 'src="yimg/'+fn+'"'
s2=re.sub(r'src="data:image/(\w+);base64,([A-Za-z0-9+/=]+)"',f,s)
open(D+'/neuro-app.html','w',encoding='utf-8').write(s2)
print(len(s.encode()),'->',len(s2.encode()))
