"""specs/ty-topic-XXX.py 의 TY 목록을 해당 주제 티야 영역의 기존 문항 뒤에 추가(재실행 시 이전 추가분 교체)."""
import re,sys,json,importlib.util,os
D='/home/user/P_D_r/quiz-app/neuro'
sys.path.insert(0,D)
from fixlib import build
s=open(D+'/work.html',encoding='utf-8').read()
base=json.load(open(D+'/ty_base.json')) if os.path.exists(D+'/ty_base.json') else {}
PAT=[2,4,1,5,3,3,5,1,4,2]
for t in sys.argv[1:]:
  sp=importlib.util.spec_from_file_location('m',f'{D}/specs/ty-{t}.py'); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
  sid=f'{t}-area-ty'
  a=s.index(f'id="{sid}"'); a=s.rindex('<section',0,a); b=s.index('</section>',a); sec=s[a:b]
  q0=sec.index('<div class="questions">')+len('<div class="questions">'); q1=sec.index('</div><a class="reset-area')
  arts=re.findall(r'<article class="qcard.*?</article>',sec[q0:q1],re.S)
  if t not in base: base[t]=len(arts)
  arts=arts[:base[t]]; K=len(arts); N=K+len(m.TY)
  arts=[re.sub(r'티야 · (\d+)/\d+',lambda x:f'티야 · {x.group(1)}/{N}',x,1) for x in arts]
  for j,q in enumerate(m.TY):
    i=K+j+1; cid=f'{sid}-q-{i:03d}'
    assert len(q['choices'])==len(q['exps'])==5,(t,i)
    tg=PAT[j%10]; r=(1-tg)%5
    ch=q['choices'][r:]+q['choices'][:r]; ex=q['exps'][r:]+q['exps'][:r]; assert ch[tg-1]==q['choices'][0]
    f=dict(meta=f'티야 · {i}/{N} · 2026 {q["src"]} · {q["prof"]} 교수님 강조',scope=False,subj=False,stem=q['stem'],choices=ch,ans=[tg],
           basis=q['basis'],exps=ex,visual=None,extra=None,caveat=None,nav='<div class="nav"></div>')
    arts.append(f'<article class="qcard" data-qcard="{i-1}" id="{cid}">'+build(cid,f)+'</article>')
  sec=sec[:q0]+''.join(arts)+sec[q1:]; s=s[:a]+sec+s[b:]
  print(t,'ty',K,'+',len(m.TY),'=',N)
open(D+'/work.html','w',encoding='utf-8').write(s)
json.dump(base,open(D+'/ty_base.json','w'))
