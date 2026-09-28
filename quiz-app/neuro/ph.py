import re,sys
sys.path.insert(0,'/home/user/P_D_r/quiz-app/neuro')
from fixlib import parse,PLACEHOLDER
s=open('/home/user/P_D_r/quiz-app/neuro/work.html',encoding='utf-8').read()
for m in re.finditer(r'<article class="qcard[^"]*"[^>]*id="((topic-\d+)-area-yama-(q-\d+))">(.*?)</article>',s,re.S):
  if len(sys.argv)>1 and m.group(2) not in sys.argv[1:]: continue
  f=parse(m.group(4))
  if f['subj']: continue
  if any(PLACEHOLDER.search(x) for x in f['exps']): print(m.group(1),f['meta'][:60])
