"""specs/<topic>.py(TOPIC·YAMA·VAR·TY·OFF) → work.html 전체를 새로 만든다(재실행해도 같은 결과).
topics.json 순서대로 교수님 → 날짜/주제 → 야마/야마 변형/티야/탈야 구조를 만들고,
이후 build.py(중복 야마 병합) → features.py(출제교수·정렬·복습 표시) → mkart.py 로 배포본을 만든다."""
import sys,json,importlib.util,html
D='/home/user/P_D_r/quiz-app/neuro2'
sys.path.insert(0,D); sys.path.insert(0,D+'/specs')
from fixlib import build
E=html.escape
AREAS=[('yama','야마'),('variants','야마 변형'),('ty','티야'),('off','탈야')]
OFF_PAT=[3,1,4,2,5,2,4,1,5,3]; TY_PAT=[2,4,1,5,3,3,5,1,4,2]
def rot(ch,ex,ans,target):
  r=(ans-target)%5; return ch[r:]+ch[:r],ex[r:]+ex[:r]
def card(cid,i,f,n=5):
  """n=None: 선지 수 자유(선지 일부만 복원된 야마 원문)."""
  f=dict(dict(scope=False,subj=False,visual=None,extra=None,caveat=None,nav='<div class="nav"></div>'),**f)
  k=len(f['choices']); assert k==len(f['exps']) and (k==n if n else k>=2) and all(1<=a<=k for a in f['ans']),cid
  return f'<article class="qcard{" multi" if len(f["ans"])>1 else ""}{" active" if i==1 else ""}" data-qcard="{i-1}" id="{cid}">'+build(cid,f)+'</article>'
yprof={}
def topic_html(t):
  sp=importlib.util.spec_from_file_location(t,f'{D}/specs/{t}.py'); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
  T=m.TOPIC; cards={a:[] for a,_ in AREAS}
  N=len(m.YAMA)
  for i,q in enumerate(m.YAMA,1):
    cid=f'{t}-area-yama-q-{i:03d}'
    if q.get('prof') and q['prof']!=T['prof']: yprof[f'{t}|q-{i:03d}']=q['prof']
    if q.get('subj'):  # 원본 주관식 야마는 주관식 그대로
      f=dict(meta=f'야마 · {i}/{N} · {q["meta"]}',scope=bool(q.get('scope')),subj=True,stem=q['stem'],visual=q.get('visual'),caveat=q.get('caveat'),
             keep_excluded=q.get('keep_excluded',False),ans=[],choices=[],answer_text=q['answer_text'],basis=q['basis'],extra=None,nav='<div class="nav"></div>')
      cards['yama'].append(f'<article class="qcard{" active" if i==1 else ""}" data-qcard="{i-1}" id="{cid}">'+build(cid,f)+'</article>'); continue
    cards['yama'].append(card(cid,i,dict(meta=f'야마 · {i}/{N} · {q["meta"]}',stem=q['stem'],choices=q['choices'],ans=q['ans'] if isinstance(q['ans'],list) else [q['ans']],
      basis=q['basis'],exps=q['exps'],visual=q.get('visual'),caveat=q.get('caveat'),scope=bool(q.get('scope')),keep_excluded=q.get('keep_excluded',False)),n=None))
  N=len(m.VAR)
  for i,q in enumerate(m.VAR,1):
    cid=f'{t}-area-variants-q-{i:03d}'
    cards['variants'].append(card(cid,i,dict(meta=f'야마 변형 · {i}/{N} · 야마 변형 · {q["key"]}',stem=q['stem'],choices=q['choices'],ans=[q['ans']],
      basis=q['basis'],exps=q['exps'],visual=q.get('visual'))))
  N=len(m.TY)
  for i,q in enumerate(m.TY,1):
    cid=f'{t}-area-ty-q-{i:03d}'; tg=TY_PAT[(i-1)%10]; ch,ex=rot(q['choices'],q['exps'],1,tg)
    cards['ty'].append(card(cid,i,dict(meta=f'티야 · {i}/{N} · 2026 {q["src"]} · {q["prof"]} 교수님 강조',stem=q['stem'],choices=ch,ans=[tg],basis=q['basis'],exps=ex)))
  N=len(m.OFF)
  for i,q in enumerate(m.OFF,1):
    cid=f'{t}-area-off-q-{i:03d}'; tg=OFF_PAT[(i-1)%10]; ch,ex=rot(q['choices'],q['exps'],q['ans'],tg)
    cards['off'].append(card(cid,i,dict(meta=f'탈야 · {i}/{N} · 2026 {q["src"]} · 수업자료 기준',stem=q['stem'],choices=ch,ans=[tg],basis=q['basis'],exps=ex,visual=q.get('visual'))))
  tabs='<div class="tabs">'+''.join(f'<a class="{"active" if a=="yama" else ""}" href="#{t}-area-{a}">{n} {len(cards[a])}</a>' for a,n in AREAS)+'</div>'
  secs=''.join(f'<section class="area{" active" if a=="yama" else ""}" data-area-section="{a}" id="{t}-area-{a}"><div class="jump"></div><div class="questions">{"".join(cards[a])}</div><a class="reset-area reset" href="#{t}-area-{a}-q-001">이 영역 처음 문제로</a></section>' for a,_ in AREAS)
  return T['prof'],f'<details class="topic" id="{t}"><summary>{E(T["date"])} · {E(T["title"])} <small>{E(T["period"])}</small></summary>{tabs}{secs}</details>'
by={}
for t in json.load(open(D+'/topics.json')):
  p,h=topic_html(t); by.setdefault(p,[]).append(h)
body=('<body><header><h1>신경학 문풀앱 2</h1><div>교수님 → 날짜/주제 → 야마/야마 변형/티야/탈야 → 문제번호 · 9/28 2교시부터</div></header><main>'
      '<div class="audit">STEP 9 최종검수: 준비 중</div>'
      +''.join(f'<details class="prof"><summary>{E(p)}</summary>{"".join(L)}</details>' for p,L in by.items())+'</main></body></html>')
open(D+'/work.html','w',encoding='utf-8').write(open(D+'/head.html',encoding='utf-8').read()+body)
json.dump(yprof,open(D+'/yprof.json','w',encoding='utf-8'),ensure_ascii=False)
print('topics',sum(len(L) for L in by.values()),'yprof',yprof)
