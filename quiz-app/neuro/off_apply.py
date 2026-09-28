"""specs/off-topic-XXX.py 의 OFF 목록으로 work.html의 해당 주제 탈야 영역 전체를 교체한다.
OFF 항목: dict(src='강의록 12쪽', stem=..., choices=[5], ans=int|list, basis=..., exps=[5], visual=None)"""
import re,sys,json,importlib.util,os
D='/home/user/P_D_r/quiz-app/neuro'
sys.path.insert(0,D)
from fixlib import build,PLACEHOLDER
s=open(D+'/work.html',encoding='utf-8').read()
done=json.load(open(D+'/off_done.json')) if os.path.exists(D+'/off_done.json') else []
for t in sys.argv[1:]:
  sp=importlib.util.spec_from_file_location('m',f'{D}/specs/off-{t}.py'); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
  L=m.OFF; N=len(L); sid=f'{t}-area-off'
  arts=[]
  for i,q in enumerate(L,1):
    cid=f'{sid}-q-{i:03d}'
    ans=q['ans'] if isinstance(q['ans'],list) else [q['ans']]
    assert len(q['choices'])==len(q['exps'])==5,(t,i)
    if len(ans)==1 and not q.get('fixed'):
      target=[3,1,4,2,5,2,4,1,5,3][(i-1)%10]; r=(ans[0]-target)%5
      q=dict(q,choices=q['choices'][r:]+q['choices'][:r],exps=q['exps'][r:]+q['exps'][:r]); ans=[target]
    assert all(1<=a<=5 for a in ans),(t,i)
    f=dict(meta=f'탈야 · {i}/{N} · 2026 {q["src"]} · 수업자료 기준',scope=False,subj=False,stem=q['stem'],choices=q['choices'],ans=ans,
           basis=q['basis'],exps=q['exps'],visual=q.get('visual'),extra=None,caveat=q.get('caveat'),nav='<div class="nav"></div>')
    arts.append(f'<article class="qcard{" active" if i==1 else ""}" data-qcard="{i-1}" id="{cid}">'+build(cid,f)+'</article>')
  a=s.index(f'id="{sid}"'); a=s.rindex('<section',0,a); b=s.index('</section>',a)
  sec=s[a:b]
  q0=sec.index('<div class="questions">')+len('<div class="questions">'); q1=sec.index('</div><a class="reset-area')
  sec=sec[:q0]+''.join(arts)+sec[q1:]
  s=s[:a]+sec+s[b:]
  if t not in done: done.append(t)
  print(t,'off',N)
open(D+'/work.html','w',encoding='utf-8').write(s)
json.dump(done,open(D+'/off_done.json','w'))
