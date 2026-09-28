import sys,re,html,hashlib,collections
src,out=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
CARD=re.compile(r'<article class="qcard[^"]*"[^>]*id="([^"]+)">(.*?)</article>',re.S)
BLANK='_____'
def h(x):return int(hashlib.md5(x.encode()).hexdigest(),16)
def script(t):
  hg=bool(re.search('[가-힣]',t)); la=bool(re.search('[A-Za-z]',t))
  return 'num' if re.fullmatch(r'[\d.%\s~-]+',t) else ('mix' if hg and la else 'ko' if hg else 'en')
SYN=[{'뇌졸중','뇌경색','뇌출혈','stroke','허혈','infarct','infarction'},{'뇌압','ICP','두개내압'},{'뇌척수액','CSF'},
     {'뇌파','EEG'},{'기억력','기억','저장','학습','memory'},{'의식','각성','consciousness'},{'치매','알츠하이머병','인지기능','dementia'},
     {'CT','MRI','영상'},{'근력','근육','muscle','weakness'},{'두통','편두통','headache','migraine'},{'베르니케','Wernicke'},{'브로카','Broca'},
     {'파킨슨병','Parkinson','파킨슨'},{'뇌동맥류','동맥류','aneurysm'},{'감각','sensory','감각신경'},{'운동','운동신경','motor'},{'수면','REM','NREM','sleep'},
     {'시상','thalamus'},{'해마','hippocampus'},{'소뇌','cerebellum'},{'CPP','뇌관류압'},{'복시','diplopia'},{'동공','pupil'}]
def related(a,b):
  la,lb=a.lower(),b.lower()
  if la==lb or la in lb or lb in la: return True
  for g in SYN:
    gl={x.lower() for x in g}
    if any(x in la for x in gl) and any(x in lb for x in gl): return True
  return False

cards=[(m.group(1),m.group(2)) for m in CARD.finditer(s)]
info={}
for cid,body in cards:
  if '-area-off-' not in cid: continue
  topic=cid.split('-area-')[0]
  ans=html.unescape(re.search(r'제공 정답: ([^\n<]*)',body).group(1)).strip()
  stem=html.unescape(re.search(r'<div class="stem">(.*?)</div>',body,re.S).group(1))
  DEF='다음 설명에 해당하는 의학 용어를 쓰시오.'
  isdef=DEF in stem and BLANK not in stem
  if isdef: stem='다음 설명에 해당하는 의학 용어로 가장 알맞은 것을 고르시오.\n“'+stem.split(DEF,1)[1].strip().lstrip('“').strip()
  body_txt=re.sub(r'^다음 설명(의 빈칸에 들어갈|에 해당하는) 의학 용어(를 쓰시오|로 가장 알맞은 것을 고르시오)\.\s*','',stem).strip('“” \n')
  i=body_txt.find(BLANK); ctx=body_txt[max(0,i-28):i+len(BLANK)+22].replace('\n',' ').replace(BLANK,ans).strip('“” ') if i>=0 else body_txt[:50].replace('\n',' ')
  meta=re.search(r'<div class="qmeta">(.*?)</div>',body).group(1)
  srcname='강의록' if '강의록' in meta else 'STT' if 'STT' in meta else '수업 자료'
  info[cid]=dict(topic=topic,ans=ans,stem=stem,ctx=ctx,src=srcname,isdef=isdef)
by_topic=collections.defaultdict(list)
for cid,v in info.items(): by_topic[v['topic']].append(cid)

def pick(cid):
  v=info[cid]; a=v['ans']; sc=script(a); L=len(a)
  chosen=[]; seen={a.lower()}
  def cands(pool,strict):
    out=[]
    for o in pool:
      b=info[o]['ans']
      if b.lower() in seen or related(a,b): continue
      if b in v['stem'].replace(BLANK,''): continue  # 문맥에 이미 나오는 단어는 제외
      if strict and (script(b)!=sc or not (L/2.2<=len(b)<=L*2.2+2)): continue
      out.append(o)
    return sorted(out,key=lambda o:h(cid+o))
  for pool,strict,tag in [(by_topic[v['topic']],True,'same'),(by_topic[v['topic']],False,'same'),(list(info),True,'other'),(list(info),False,'other')]:
    for o in cands(pool,strict):
      if len(chosen)==4: break
      b=info[o]['ans']
      if any(related(b,info[c]['ans']) for c,_ in chosen): continue
      chosen.append((o,tag)); seen.add(b.lower())
    if len(chosen)==4: break
  assert len(chosen)==4,cid
  return chosen

E=html.escape
def rebuild(cid,body):
  v=info[cid]; ds=pick(cid)
  pos=h(cid+'pos')%5
  opts=[(info[o]['ans'],o,tag) for o,tag in ds]; opts.insert(pos,(v['ans'],None,None))
  stem=v['stem']
  if v['isdef']: pass
  elif stem.startswith('다음 설명의 빈칸에 들어갈 의학 용어를 쓰시오.'):
    stem=stem.replace('다음 설명의 빈칸에 들어갈 의학 용어를 쓰시오.','다음 설명의 빈칸에 들어갈 의학 용어로 가장 알맞은 것을 고르시오.',1)
  else:
    stem='다음 빈칸에 들어갈 말로 가장 알맞은 것을 고르시오.\n'+stem
  meta=re.search(r'<div class="qmeta">.*?</div>',body,re.S).group(0)
  nav=re.search(r'<div class="nav">.*?</div>',body,re.S).group(0)
  fb=re.search(r'<div class="feedback"><div>(.*?)</div></div>',body,re.S).group(1)
  fb_rest=fb.split('\n',1)[1] if '\n' in fb else ''
  fb_rest=fb_rest.replace('다음 설명에 해당하는 의학 용어를 쓰시오.\n','')
  html_opts=[];exps=[]
  for k,(t,o,tag) in enumerate(opts,1):
    ok=o is None; kind='correct' if ok else 'wrong'
    oid=f'{cid}-opt-{k}'
    html_opts.append(f'<div class="choice-wrap {kind}-wrap"><input class="choice-input {kind}-input" id="{oid}" name="answer-{cid}" type="radio" value="{k}"/><label class="choice" for="{oid}">{k}. {E(t)}</label></div>')
    if ok: exps.append(f'{k}. {t}: 정답. ' + (f'{v["src"]}에서 이 설명에 해당하는 용어이다.' if v['isdef'] else f'{v["src"]} 원문 문맥 그대로의 용어이다.'))
    else:
      where='같은 수업' if tag=='same' else '다른 수업'
      if info[o]['isdef']: why=f'‘{info[o]["ctx"]}…’라는 설명에 해당하는 용어로'
      else: why=f'‘…{info[o]["ctx"]}…’ 맥락으로 나온 용어로'
      target='이 설명과' if v['isdef'] else '이 빈칸의 문맥과'
      exps.append(f'{k}. {t}: 오답. {where} {info[o]["src"]}에서 {why}, {target} 맞지 않는다.')
  exp_txt='\n'.join(exps)
  return (f'{meta}<div class="stem">{E(stem)}</div>'+''.join(html_opts)+
    f'<div class="gradebox"><div class="grade-correct">✅ 정답</div><div class="grade-wrong">❌ 오답 · 정답은 {pos+1}번</div></div>'
    f'<div class="feedback"><div>제공 정답: {pos+1}. {E(v["ans"])}\n{fb_rest}</div><div class="opt-exp"><b>선지별 해설</b>'+''.join(f'<div>{E(x)}</div>' for x in exps)+'</div></div>'+nav)

n=0
def sub(m):
  global n
  cid,body=m.group(1),m.group(2)
  if cid in info:
    n+=1; return m.group(0).replace(body,rebuild(cid,body),1)
  return m.group(0)
s=CARD.sub(sub,s)
s=s.replace('인터랙션 v2:','형식: 야마 원본 주관식만 주관식 유지 · 탈야 전체 객관식(5지선다) · 인터랙션 v2:',1)
s=s.replace('[절대 유지할 앱 구조]','[문제 형식 — 사용자 지정]\n- 야마: 원본이 주관식인 문항만 주관식 유지(원문 보존). 원본 객관식은 객관식.\n- 야마 변형/티야/탈야: 전부 객관식(5지선다). 탈야를 빈칸 쓰기 주관식으로 만들지 않는다.\n\n[절대 유지할 앱 구조]',1)
open(out,'w',encoding='utf-8').write(s)
print('converted',n)
