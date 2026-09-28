import re,json,sys,html,subprocess
D='/home/user/P_D_r/quiz-app/neuro2'
sys.path.insert(0,D)
import dedup
from ai_est import AI
w=open(D+'/work.html',encoding='utf-8').read()
s,log,drop=dedup.apply(w)
dk=set()
for cid in drop:
  b=re.search(r'id="'+cid+r'">.*?<div class="qmeta">(.*?)</div>',w,re.S).group(1)
  y=re.search(r'야마 \d{4} (?:객|주)\d+',b); dk.add((cid.split('-area')[0],y.group(0)))
for m in list(re.finditer(r'<article class="qcard[^"]*"[^>]*id="((topic-\d+)-area-variants-q-\d+)">.*?<div class="qmeta">(.*?)</div>',s,re.S)):
  y=re.search(r'야마 \d{4} (?:객|주)\d+',m.group(3))
  if y and (m.group(2),y.group(0)) in dk:
    s=re.sub(r'<article class="qcard[^"]*"[^>]*id="'+m.group(1)+r'">.*?</article>','',s,1,flags=re.S)
n=0
for cid,txt in AI.items():
  i=s.find('id="'+cid+'"')
  if i<0: continue
  j=s.find('<div class="feedback">',i)+len('<div class="feedback">')
  s=s[:j]+f'<div class="ai-est"><b>🤖 AI 추정 답변 (수업 자료 기반 · 참고용)</b><br>{html.escape(txt)}</div>'+s[j:]; n+=1
print('dedup groups',len(log),'dropped',len(drop),'ai',n)
open(D+'/work2.html','w',encoding='utf-8').write(s)
json.dump(log,open(D+'/dedup_log.json','w'),ensure_ascii=False)
