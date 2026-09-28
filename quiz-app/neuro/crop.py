import sys,glob
from PIL import Image,ImageDraw
T='/root/.claude/projects/-home-user-P-D-r/561b9438-f541-5374-9f36-ce0f5db3fe50/tool-results'
D='/home/user/P_D_r/quiz-app/neuro/img'
def crop(tag,box,out,masks=()):
  src=glob.glob(f'{T}/*{tag}.jpg')[0]
  im=Image.open(src).convert('RGB'); dr=ImageDraw.Draw(im)
  for m in masks: dr.rectangle(m,fill=(20,20,20))
  im.crop(box).save(f'{D}/{out}','JPEG',quality=72,optimize=True)
if __name__=='__main__':
  for a in sys.argv[1:]:
    tag,box,out,*mk=a.split(';'); crop(tag,tuple(map(int,box.split(','))),out,[tuple(map(int,m.split(','))) for m in mk])
