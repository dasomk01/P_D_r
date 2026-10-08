"""야마 카드 복원 라이브러리. apply(html, topic, specs) → (html, n).
spec 키: meta, stem, choices, ans(list), basis, exps(list), visual(html), extra(html),
 caveat(str: 채점은 하되 보이는 주의 문구), subj(bool), answer_text(주관식 정답), keep_excluded(bool)."""
import re,html
E=html.escape
PLACEHOLDER=re.compile(r'복원된 원본 선지|채점 제외|자동채점|원문 야마의 실제 선|질문의 핵심 조건과 일치하지 않음')
def parse(b):
  g=lambda p:(re.search(p,b,re.S).group(1) if re.search(p,b,re.S) else None)
  f={}
  f['meta']=html.unescape(g(r'<div class="qmeta">(.*?)</div>') or '')
  f['scope']='<div class="scope">' in b
  f['excluded']='<div class="excluded">' in b
  f['stem']=html.unescape(g(r'<div class="stem">(.*?)</div>') or '')
  v=re.search(r'<div class="visual">.*?</div>',b,re.S); f['visual']=v.group(0) if v and v.start()<b.find('<div class="feedback"') else None
  f['subj']='class="entry"' in b
  labels=re.findall(r'<label class="choice"[^>]*>(.*?)</label>',b,re.S)
  f['choices']=[re.sub(r'^\s*\d+\.\s*','',html.unescape(x)) for x in labels]
  inputs=re.findall(r'<input class="([^"]*)"[^>]*value="(\d+)"',b)
  corr=[int(v) for c,v in inputs if 'correct' in c and 'wrong' not in c and 'mc-wrong' not in c]
  fb=g(r'<div class="feedback"><div>(.*?)</div>') or ''
  fb=html.unescape(fb)
  m=re.match(r'제공 정답: ([^\n]*)',fb); f['given']=m.group(1).strip() if m else ''
  if not corr and f['given']:
    corr=[int(x) for x in re.findall(r'(?:^|[,/ ])(\d{1,2})\.',' '+f['given'])][:1]
  f['ans']=corr
  lines=[l for l in fb.split('\n')[1:] if l.strip()]
  lines=[l for l in lines if not re.match(r'\s*\d+\.\s',l) and not l.startswith('제공 정답')]
  f['basis']=re.sub(r'^(정답 근거|근거·해설)\s*[:：]\s*','','\n'.join(lines).strip())
  f['exps']=[re.sub(r'^\s*\d+\.\s*','',html.unescape(x)) for x in re.findall(r'<div>(\d+\..*?)</div>',(g(r'<div class="opt-exp">(.*?)</div></div>') or '')+'</div>',re.S)]
  f['nav']=g(r'(<div class="nav">.*?</div>)') or ''
  return f
def clean_basis(t):
  sents=re.split(r'(?<=[.다])\s+',t)
  return ' '.join(x for x in sents if not re.search(r'채점|복원 불완전|복원이 불완전|참고용으로만',x)).strip()
def build(cid,f):
  multi=len(f['ans'])>1
  P=[f'<div class="qmeta">{E(f["meta"])}</div>']
  if f['scope']: P.append('<div class="scope">[수업범위 외] 원문 보존</div>')
  if f.get('keep_excluded'): P.append('<div class="excluded">복원 불완전/확인 필요 · 자동 채점 제외</div>')
  elif f.get('caveat'): P.append(f'<div class="scope">⚠ {E(f["caveat"])}</div>')
  P.append(f'<div class="stem">{E(f["stem"])}</div>')
  if f.get('visual'): P.append(f['visual'])
  if f['subj']:
    P.append(f'<textarea class="entry" placeholder="답을 작성하세요"></textarea><input class="reveal-toggle" id="{cid}-reveal" type="checkbox"/><label class="reveal reset" for="{cid}-reveal">답 작성 완료 · 해설 보기</label>')
    P.append(f'<div class="feedback"><div>{E("제공 정답: "+f["answer_text"])}\n\n{E("근거·해설: "+f["basis"])}</div>'+(f.get('extra') or '')+'</div>')
    P.append(f['nav']); return ''.join(P)
  if multi: P.append(f'<div class="qmeta">정답 {len(f["ans"])}개를 모두 고른 뒤 아래 "채점하기"를 누르세요.</div>')
  ex=f.get('keep_excluded')
  for k,c in enumerate(f['choices'],1):
    ok=k in f['ans']; oid=f'{cid}-opt-{k}'
    if multi:
      P.append(f'<div class="choice-wrap"><input class="multi-input {"mc-correct" if ok else "mc-wrong"}" id="{oid}" type="checkbox" value="{k}"/><label class="choice" for="{oid}">{k}. {E(c)}</label></div>')
    elif ex:
      P.append(f'<div class="choice-wrap neutral-wrap"><input class="choice-input" id="{oid}" name="answer-{cid}" type="radio" value="{k}"/><label class="choice" for="{oid}">{k}. {E(c)}</label></div>')
    else:
      kd='correct' if ok else 'wrong'
      P.append(f'<div class="choice-wrap {kd}-wrap"><input class="choice-input {kd}-input" id="{oid}" name="answer-{cid}" type="radio" value="{k}"/><label class="choice" for="{oid}">{k}. {E(c)}</label></div>')
  an=','.join(map(str,f['ans']))
  if multi: P.append(f'<input class="reveal-toggle" id="{cid}-reveal" type="checkbox"/><label class="reveal reset" for="{cid}-reveal">채점하기 · 해설 보기</label>')
  if ex: P.append('<div class="gradebox grade-excluded">선택 완료 · 이 문항은 복원 불완전/확인 필요로 자동채점 제외</div>')
  else: P.append(f'<div class="gradebox"><div class="grade-correct">✅ 정답</div><div class="grade-wrong">❌ 오답 · 정답은 {an}번</div></div>')
  at=f.get('answer_note') or ' / '.join(f'{a}. {f["choices"][a-1]}' for a in f['ans'])
  fb=f'<div class="feedback"><div>{E("제공 정답: "+at)}\n\n{E("정답 근거: "+f["basis"])}</div>'+(f.get('extra') or '')
  fb+='<div class="opt-exp"><b>선지별 해설</b>'+''.join(f'<div>{k}. {E(x)}</div>' for k,x in enumerate(f['exps'],1))+'</div></div>'
  P.append(fb); P.append(f['nav']); return ''.join(P)
def apply(s,topic,specs,log):
  n=0
  def sub(m):
    nonlocal n
    cls,cid,body=m.group(1),m.group(2),m.group(3)
    key=cid.split('-area-yama-')[-1]
    if not cid.startswith(topic+'-area-yama-') or key not in specs: return m.group(0)
    sp=specs[key]; f=parse(body)
    unexcl=f['excluded'] and not sp.get('keep_excluded')
    f.update({k:v for k,v in sp.items()})
    if 'tail' in sp: f['meta']=' · '.join(f['meta'].split(' · ')[:2]+[sp['tail']])
    if 'basis' not in sp: f['basis']=clean_basis(f['basis'])
    if f['subj']:
      if 'answer_text' not in sp: f['answer_text']=f['given']
    else:
      assert f['ans'] and all(1<=a<=len(f['choices']) for a in f['ans']),(cid,f['ans'],len(f['choices']))
      if not f.get('keep_excluded'):
        assert len(f['exps'])==len(f['choices']),(cid,'exps',len(f['exps']),len(f['choices']))
        bad=[x for x in f['exps'] if PLACEHOLDER.search(x)]
        assert not bad,(cid,'placeholder exps',bad[:1])
    n+=1; log.append(cid)
    newcls='qcard'+(' multi' if len(f['ans'])>1 and not f['subj'] else '')+(' active' if 'active' in cls else '')
    return m.group(0).replace(f'class="{cls}"',f'class="{newcls}"',1).replace(body,build(cid,f),1)
  s=re.sub(r'<article class="(qcard[^"]*)"[^>]*id="([^"]+)">(.*?)</article>',sub,s,flags=re.S)
  return s,n

import base64
IMGDIR='/home/user/P_D_r/quiz-app/neuro2/img'
import io
from PIL import Image
# 아티팩트 16MB 제한 — 임베드할 때 WebP(최대 폭 900, 품질 62)로 다시 인코딩
def _b64(n):
  im=Image.open(IMGDIR+'/'+n).convert('RGB')
  if im.width>900: im=im.resize((900,round(im.height*900/im.width)),Image.LANCZOS)
  b=io.BytesIO(); im.save(b,'WEBP',quality=62,method=6); return base64.b64encode(b.getvalue()).decode()
def vis(title,*imgs,note=''):
  h=''.join(f'<img src="data:image/webp;base64,{_b64(n)}" alt="{E(title)}" style="max-width:100%;height:auto;display:block;margin:8px auto;border-radius:6px"/>' for n in imgs)
  return f'<div class="visual"><b>{E(title)}</b>{h}'+(f'<div class="source">{E(note)}</div>' if note else '')+'</div>'

def Q(ans,basis,*exps,**kw):
  d=dict(ans=ans if isinstance(ans,list) else [ans],basis=basis,exps=list(exps)); d.update(kw); return d
def S(answer,basis,**kw):
  d=dict(answer_text=answer,basis=basis); d.update(kw); return d

def insert_yama(s,topic,after_key,sp):
  """after_key 카드 뒤에 새 야마 카드를 넣고 영역 전체 번호·nav·jump·탭 숫자를 다시 매긴다."""
  sec_id=f'{topic}-area-yama'
  a=s.index(f'id="{sec_id}"'); a=s.rindex('<section',0,a); b=s.index('</section>',a)+len('</section>')
  sec=s[a:b]
  arts=re.findall(r'<article class="[^"]*"[^>]*id="[^"]+">.*?</article>',sec,re.S)
  f=dict(meta='',scope=False,subj=False,nav='<div class="nav"></div>',caveat=None,visual=None,extra=None); f.update(sp)
  new=f'<article class="qcard{" multi" if len(f.get("ans",[]))>1 else ""}" data-qcard="0" id="NEWCARD">'+build('NEWCARD',f)+'</article>'
  idx=[i for i,x in enumerate(arts) if f'id="{sec_id}-{after_key}"' in x][0]
  arts.insert(idx+1,new)
  N=len(arts); out=[]
  for i,x in enumerate(arts,1):
    old=re.search(r'id="([^"]+)">',x).group(1); nid=f'{sec_id}-q-{i:03d}'
    x=x.replace(old,nid)
    x=re.sub(r'data-qcard="\d+"',f'data-qcard="{i-1}"',x,1)
    x=re.sub(r'class="qcard( multi)?( active)?"',lambda m:f'class="qcard{m.group(1) or ""}{" active" if i==1 else ""}"',x,1)
    x=re.sub(r'(<div class="qmeta">야마 · )\d+/\d+',lambda m:f'{m.group(1)}{i}/{N}',x,1)
    nav='<div class="nav">'+(f'<a href="#{sec_id}-q-{i-1:03d}">← 이전</a>' if i>1 else '')+(f'<a href="#{sec_id}-q-{i+1:03d}">다음 →</a>' if i<N else '')+'</div>'
    x=re.sub(r'<div class="nav">.*?</div>',nav,x,1,flags=re.S)
    out.append(x)
  jump='<div class="jump">'+''.join(f'<a class="{"active" if i==1 else ""}" href="#{sec_id}-q-{i:03d}">{i}</a>' for i in range(1,N+1))+'</div>'
  sec=re.sub(r'<div class="jump">.*?</div>',jump,sec,1,flags=re.S)
  q0=sec.index('<div class="questions">')+len('<div class="questions">'); q1=sec.index('</div><a class="reset-area')
  sec=sec[:q0]+''.join(out)+sec[q1:]
  s=s[:a]+sec+s[b:]
  s=re.sub(rf'(<a class="[^"]*" href="#{sec_id}">야마 )\d+',lambda m:f'{m.group(1)}{N}',s,1)
  return s

_W=None
def cur(topic,q):
  """work.html에 있는 현재 카드의 선지 목록."""
  global _W
  if _W is None: _W=open('/home/user/P_D_r/quiz-app/neuro2/work.html',encoding='utf-8').read()
  b=re.search(r'id="'+topic+'-area-yama-'+q+r'">(.*?)</article>',_W,re.S).group(1)
  return parse(b)['choices']
def last(topic,q,text):
  c=cur(topic,q); return c[:-1]+[text]
