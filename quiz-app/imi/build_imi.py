# 임상의학입문(1-2) 문풀 빌드 – 이과 앱(quiz-app/ent)과 같은 구조.  python3 build_imi.py → imi-app.html
import importlib,sys,json,collections,os,re,difflib,glob,hashlib,random,base64
D=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,D)
from mk import build
# 티야(올해 수업 STT·강의록 기반 5지선다) 모듈 – 수업 순서. 각 모듈: SEC=(섹션명,교수), Q=[튜플]
MODS=[]
# 야마(학습지 기출 원문·정답) 모듈 – 순서 중요(문제 None 은 같은 묶음의 바로 앞 카드에 합친다)
YMODS=[]
# 야마 구역 → 붙일 수업(그 수업 티야 뒤에 넣는다)
YSEC={}
W='학습지 「2026 임상의학입문 1-2 학습지」 '
YSRC={}
PRE={}      # 수업 전 야마: 구역 → (섹션명, 교수, 뒤에 붙일 수업 모듈)
PREFAM={}   # 묶음 단위로 다른 구역에 보내기
TQ={};FQ={};FIX={}
# 단원별 모듈 sec_<slug>.py 를 ORDER 순서로 모은다: SECMODS=[티야 모듈…], YMODS=[야마 모듈…], YSEC={구역:붙일 수업 모듈}, YSRC={구역:'「단원」 쪽'}
from order import ORDER
for _u in ORDER:
  try: _s=importlib.import_module('sec_'+_u)
  except ModuleNotFoundError: continue
  _bad=[m for m in _s.MODS+_s.YMODS if not os.path.exists(D+'/'+m+'.py')]
  if _bad: print('⏳ 작업 중 단원 건너뜀',_u,_bad); continue
  MODS+=_s.MODS; YMODS+=_s.YMODS; YSEC.update(_s.YSEC); YSRC.update({k:W+v for k,v in _s.YSRC.items()})
  PRE.update(getattr(_s,'PRE',{})); PREFAM.update(getattr(_s,'PREFAM',{}))
def _merge(pat,name):
  o={}
  for p in sorted(glob.glob(D+'/'+pat)): o.update(getattr(importlib.import_module(os.path.basename(p)[:-3]),name,{}))
  return o
FQ=_merge('fq_*.py','FQ'); FIX=_merge('fix_*.py','FIX'); TQ=_merge('tq_*.py','TQ')
# 야마변형(v_<slug>.py VQ={수업모듈:[튜플]}, 영역 '야마변형') · 탈야(x_<slug>.py XQ={수업모듈:[튜플]}, 영역 '탈야') – 그 수업 티야 뒤에 붙는다
for _p,_n in (('v_*.py','VQ'),('x_*.py','XQ')):
  _ok=set(open(D+'/done_vx.txt').read().split()) if os.environ.get('PUBLISH') and os.path.exists(D+'/done_vx.txt') else None
  for _f in sorted(glob.glob(D+'/'+_p)):
    if _ok is not None and os.path.basename(_f)[:-3] not in _ok: continue
    try: importlib.import_module(os.path.basename(_f)[:-3])
    except Exception as _e: print('⏳ 작업 중 파일 건너뜀',os.path.basename(_f),type(_e).__name__); continue
    for _m,_l in getattr(importlib.import_module(os.path.basename(_f)[:-3]),_n,{}).items(): TQ.setdefault(_m,[]).extend(_l)
# 출제 언급 근거 문제(trend_<slug>.py)도 티야 – 그 단원 마지막 수업 티야 뒤에 넣는다(영역 '티야')
for _u in ORDER:
  if os.path.exists(D+'/trend_'+_u+'.py') and os.path.exists(D+'/sec_'+_u+'.py'):
    _ms=importlib.import_module('sec_'+_u).MODS
    if _ms and _ms[-1] in MODS: TQ.setdefault(_ms[-1],[]).extend([('티야',)+tuple(x[1:]) for x in importlib.import_module('trend_'+_u).Q])
# 🎓 올해 수업 기준 해설(선택): yexp_*.py 의 EXP={카드키:{'cls':..,'wb':..}} / 묶음별 CLS={묶음:..}
EXP={};CLS={}
for p in sorted(glob.glob(D+'/yexp_*.py')):
  m=importlib.import_module(os.path.basename(p)[:-3]); EXP.update(getattr(m,'EXP',{})); CLS.update(getattr(m,'CLS',{}))
TYB={}   # 📌 티야방: tyb.py 의 TYB={키 또는 'fam:묶음':(담당자,멘트)}
if os.path.exists(D+'/tyb.py'): TYB=importlib.import_module('tyb').TYB
IMG={}
for p in sorted(glob.glob(D+'/yimg_*.py')): IMG.update(importlib.import_module(os.path.basename(p)[:-3]).IMG)
def imgs(k): return ['data:image/'+('png' if f.endswith('png') else 'jpeg')+';base64,'+base64.b64encode(open(D+'/'+f,'rb').read()).decode() for f in IMG.get(k,[])]

def N(t): return re.sub(r'[\s\W_]+','',t.lower())
def R(a,b): return difflib.SequenceMatcher(None,N(a),N(b)).ratio()
def same(c,s,ch,ans):
  if not c['ans'] or not ans or R(c['stem'],s)<0.8 or len(c['ch'])!=len(ch): return False
  if R(' '.join(c['ch'][a-1] for a in c['ans']),' '.join(ch[a-1] for a in ans))<0.85: return False
  return min(R(x,y) for x,y in zip(c['ch'],ch))>=0.9
def cfnote(cf,prof):
  g=collections.OrderedDict()
  for y in sorted(cf,reverse=True): g.setdefault(cf[y] or '미상',[]).append(y)
  if not g: return None
  t='✍️ 출제: '+' / '.join(p+(' 교수님' if p!='미상' else '')+' ('+'·'.join(ys)+')' for p,ys in g.items())
  if any(p not in (prof,'미상') for p in g): t+=' — 올해 담당 '+prof+' 교수님과 다른 교수님 출제 포함'
  return t

# 야마 선지별 해설: yx_*.py 의 X = {(묶음, 연도, '번호'): [(해설, 근거), ...]}  근거 c=올해 수업(강의록·STT), w=학습지 해설에만, k=수업 외 지식
YX={}
for p in sorted(glob.glob(D+'/yx_*.py')): YX.update(importlib.import_module(os.path.basename(p)[:-3]).X)
TAG={'c':' 🎓올해 수업','w':' 📚학습지에만(올해 수업엔 없음)','k':' 🧠수업 외 지식(학습지·올해 수업 모두 없음)'}
def yexps(c):
  y,n=c['ys'][0].split(); x=YX.get((c['f'],int(y),n))
  if not x: return []
  if len(x)!=len(c['ch']): print('YX 선지 수 불일치',c['f'],y,n); return []
  return [t+TAG[g] for t,g in x]

def _yd(y): return '연도 미상 '+y[5:] if y.startswith('2000 ') else y   # 연도 2000 = 학습지에 「20??」로만 적힌 문항
def yama():
  cards=[];fam=collections.defaultdict(list)
  for m in YMODS:
    for sec,f,y,n,stem,ch,ans,basis,notes,prof in importlib.import_module(m).Y:
      yl='%d %s'%(y,n)
      if stem is None and ans is None:            # 바로 앞 해와 같은 문제
        c=fam[f][-1]; c['ys'].append(yl); c['cf'][str(y)]=prof; c['notes']+=list(notes or []); continue
      if stem is None:                             # 문제·선지는 앞과 같고 정답만 다른 해 → 따로 카드
        stem,ch=fam[f][-1]['stem'],fam[f][-1]['ch']; basis=basis or fam[f][-1]['basis']
      excl=not ans and bool(ch)
      for c in fam[f]:
        if not excl and same(c,stem,ch,ans): c['ys'].append(yl); c['cf'][str(y)]=prof; c['notes']+=list(notes or []); break
      else:
        c=dict(m=m,sec=PREFAM.get(f,sec),f=f,ys=[yl],stem=stem,ch=ch,ans=ans,basis=basis,notes=list(notes or []),excl=excl,cf={str(y):prof})
        fam[f].append(c);cards.append(c)
  out=collections.defaultdict(list);seen=set()
  for c in cards:
    allys=[y for d in fam[c['f']] for y in d['ys']]
    rep=len({y.split()[0] for y in allys})
    k='y-'+c['f']+'-'+c['ys'][0].split()[0]
    if k in seen: k+='-'+c['ys'][0].split()[1]
    seen.add(k)
    notes=list(dict.fromkeys(c['notes']))
    if len(c['ys'])>1: notes=['같은 문제(문제·선지 거의 동일): '+' · '.join(_yd(y) for y in c['ys'][1:])]+notes
    if c['excl']: notes=notes+['학습지 정답 그대로는 채점하지 않고, 확인되면 반영할게요.']
    tb=TYB.get(k) or TYB.get('fam:'+c['f']);ex=EXP.get(k,{});cls=ex.get('cls') or CLS.get(c['f'])
    parts=['📌 티야방('+tb[0]+'): '+tb[1]] if tb else []
    if cls: parts.append('🎓 올해 수업 기준: '+cls)
    parts.append('📚 학습지 해설: '+ex['wb'] if ex.get('wb') else '📚 학습지 해설 요약: '+c['basis'])
    sec,prof=PRE[c['sec']][:2] if c['sec'] in PRE else importlib.import_module(YSEC[c['sec']]).SEC
    cn=cfnote(c['cf'],prof)
    if cn: notes=[cn]+notes
    _oos=c['sec'].endswith('_out')   # 구역 이름이 _out 이면 올해 수업범위 외 – 정답률에서 뺀다
    out[c['sec']].append(dict(k='imi-'+k,fam=c['f'],area='야마',prof=prof,sec=sec,oos=1 if _oos else 0,meta=('📦 올해 수업범위 외 · 정답률 제외 · ' if _oos else '')+'근거: '+YSRC[c['sec']],tyb=bool(tb),
      yrs=list(dict.fromkeys('연도 미상' if y.startswith('2000 ') else y.split()[0] for y in c['ys'])),year=_yd(c['ys'][0]),type='객' if c['ch'] else '주',rep=rep,repyears=' · '.join(_yd(y) for y in allys if y!=c['ys'][0]) if rep>1 else '',
      stem=c['stem'],choices=c['ch'],ans=c['ans'],excl=c['excl'],imgs=imgs(k),vis=[],notes=notes,basis='\n\n'.join(parts),exps=yexps(c),ai='',ymod=c['m']))
  return out

Y=yama()
items=[];errs=[]
for m in MODS:
  M=importlib.import_module(m); sec,prof=M.SEC
  for t in M.Q+TQ.get(m,[])+FQ.get(m,[]):
    area,k,stem,ch,ans,basis,exps,src=t[:8]; qn=list(t[8]) if len(t)>8 else []
    ch=FIX.get(k,ch)
    r=random.Random(int(hashlib.md5(k.encode()).hexdigest(),16)); idx=list(range(len(ch)))
    if area=='형성평가' and not stem.startswith(('🤍','💜')): stem='🤍형성평가 '+stem   # 🤍 수업 끝 퀴즈, 💜 과정별·전체
    if '원문' not in src: r.shuffle(idx)   # 형성평가 원문은 선지 순서 그대로
    ch=[ch[i] for i in idx]; exps=[exps[i] for i in idx]; ans=idx.index(ans-1)+1
    if not (len(ch)==5 or '원문' in src and len(ch)==4) or len(exps)!=len(ch) or not 1<=ans<=len(ch): errs.append((k,len(ch),len(exps),ans))
    tb=TYB.get(k)
    if not tb and src.startswith('티야방'): tb=(src.split()[1],'')
    if tb and tb[1]: basis='📌 티야방('+tb[0]+'): '+tb[1]+'\n\n'+basis
    items.append(dict(k='imi-'+k,area=area,prof=prof,sec=sec,meta=('📌티야방 · ' if tb else '')+'근거: '+src,tyb=bool(tb),
      year='',type='객',rep=1,stem=stem,choices=ch,ans=[ans],imgs=imgs(k),vis=[],notes=qn,basis=basis,exps=exps,ai=''))
  for ys,ym in YSEC.items():
    if ym==m: items+=Y[ys]
  for ys,(_,_,pm) in PRE.items():
    if pm==m: items+=Y[ys]
for i in items:
  if i['area']=='야마' and not i.get('excl') and i['choices'] and (not i['ans'] or max(i['ans'])>len(i['choices'])): errs.append(i['k'])
_IN=_merge('yimg_*.py','NOTE'); _AF=_merge('ansfix_*.py','F'); _AS=_merge('ansset_*.py','S')
_NX={}   # notes_*.py 의 N={카드키:[노트…]} – 나중에 받은 자료로 단 점검 노트를 카드에 덧붙인다
for _p in sorted(glob.glob(D+'/notes_*.py')):
  for _k,_v in importlib.import_module(os.path.basename(_p)[:-3]).N.items(): _NX.setdefault(_k,[]).extend(_v)
for i in items:
  if i['k'][4:] in _NX: i['notes']=list(i['notes'])+_NX[i['k'][4:]]
import glob as _g
_AU=[e for f in sorted(_g.glob(D+'/audit/g*.json')) for e in json.load(open(f))]
for e in _AU:
  for i in items:
    if i['k'][4:]!=e['key']: continue
    ft=e.get('fix_text')
    if ft and i['choices'] and 1<=ft['choice']<=len(i['choices']):
      c=i['choices'][ft['choice']-1]; i['choices'][ft['choice']-1]=c.replace(ft['from'],ft['to']) if ft['from'] in c else c
    hm=e['confidence'] in ('high','medium')
    if hm and e['type'] in ('wrong','multi','excl-resolved') and e.get('proposed') and i['choices']:
      if sorted(e['proposed'])!=sorted(i['ans']): i['ans']=list(e['proposed']); i['excl']=False; i['notes']=['✏️ 정답 수정(11/22 강의록 전수 점검): '+'·'.join('①②③④⑤'[n-1] for n in e['proposed'])+(' (복수정답 – 모두 골라야 정답)' if len(e['proposed'])>1 else '')]+list(i['notes'])
    if hm and e['type']=='none' and i['choices']:
      i['ans']=[]; i['excl']=True; i['notes']=['✏️ 맞는 답이 없는 문항(11/22 강의록 전수 점검) – 채점 안 함']+list(i['notes'])
    i['notes']=list(i['notes'])+['🔎 강의록 점검('+e['confidence']+'): '+e['reason_ko']]
for i in items:
  if i['k'][4:] in _AF:   # 답은 바꾸지 않는다 – 학습지 정답 그대로 두고 ⚠️ 주의 표시 + 의견
    _na,_r=_AF[i['k'][4:]]; _c='①②③④⑤⑥⑦'
    _cur='·'.join(_c[n-1] for n in i['ans']) if i['ans'] else '없음(학습지 정답 칸 비어 있음)'
    if _na and i['k'][4:] in _AS:   # 사용자가 직접 「답 바꿔」라고 한 카드만 실제로 바꾼다(ansset_*.py)
      i['notes']=list(i['notes'])+['✏️ 정답 변경(사용자 요청 '+_AS[i['k'][4:]]+'): 학습지 정답 '+_cur+' → '+'·'.join(_c[n-1] for n in _na)+'. '+_r]
      _old=list(i['ans']); i['ans']=list(_na); i['excl']=False
      if i.get('exps'):
        E=list(i['exps'])
        for n,e in enumerate(E):
          if n+1 in _na: E[n]='정답 – '+re.sub(r'\.? ?학습지 정답 \S는 ansfix로 \S로 고침','',re.sub(r'^(⚠️ 의견상 답|정답)\s*(\(ansfix\)|\(옳지 않음\))?\s*[–-]?\s*','',e))
          elif n+1 in _old: E[n]='📚 학습지 정답이었음(바꿈) – '+re.sub(r'^(📚 학습지 정답|정답|학습지 정답(이었으나)?)\s*[–-]?\s*','',e)
        i['exps']=E
      continue
    if _na:
      i['notes']=list(i['notes'])+['⚠️ 정답 주의 – 학습지 정답 '+_cur+' 그대로 둠. 의견: '+'·'.join(_c[n-1] for n in _na)+'이(가) 맞아 보임. '+_r]
    else:   # 해석이 갈림 → 답은 그대로, 채점만 제외
      i['excl']=True; i['notes']=list(i['notes'])+['⚖️ 해석이 갈려 채점 안 함(학습지 정답 '+_cur+'). '+_r]
    if i.get('exps'):   # 선지별 해설의 「정답」 표기를 학습지 기준으로 맞춘다
      E=list(i['exps'])
      for n,e in enumerate(E):
        if e.startswith('정답') and n+1 not in i['ans']: E[n]='⚠️ 의견상 답'+e[2:]
      for n in i['ans']:
        if n-1<len(E) and not E[n-1].startswith(('정답','학습지 정답')): E[n-1]='📚 학습지 정답 – '+E[n-1]
      i['exps']=E
# ansset 의 (정답, 사유) 튜플 – ansfix 없이 사용자 요청으로 직접 바꾸는 카드(채점 제외였던 카드 포함)
for i in items:
  _v=_AS.get(i['k'][4:])
  if not isinstance(_v,tuple): continue
  _na,_why=_v; _c='①②③④⑤⑥⑦'
  _cur='·'.join(_c[n-1] for n in i['ans']) if i['ans'] else '없음(채점 제외)'
  _old=list(i['ans']); i['ans']=list(_na); i['excl']=False
  i['notes']=[n for n in i['notes'] if not n.startswith('학습지 정답 그대로는 채점하지 않고')]+['✏️ 정답 변경(사용자 요청 11/26): 학습지 정답 '+_cur+' → '+'·'.join(_c[n-1] for n in _na)+'. '+_why]
  if i.get('exps'):
    E=list(i['exps'])
    for n,e in enumerate(E):
      if n+1 in _na and not e.startswith('정답'): E[n]='정답 – '+re.sub(r'^(⚠️ 의견상 답|⚖️[^–]*–|학습지 답)\s*[–-]?\s*','',e)
      elif n+1 in _old: E[n]='📚 학습지 정답이었음(바꿈) – '+re.sub(r'^(📚 학습지 정답|정답|학습지 정답)\s*[–-]?\s*','',e)
    i['exps']=E
_MA=_merge('memo_ans*.py','A')
for i in items:
  if i['k'][4:] in _MA: i['notes']=list(i['notes'])+['💬 메모 답 – \n'+_MA[i['k'][4:]]]
for i in items:
  if i['k'][4:] in _IN: i['notes']=list(i['notes'])+[_IN[i['k'][4:]]]
# 사용자가 직접 준 문항(extra_*.json, 앱 형식) – 같은 날짜·교시 섹션의 티야 뒤에 끼운다. 섹션 이름·교수는 앱 것에 맞춘다.
for _f in sorted(glob.glob(D+'/extra_*.json')):
  for _x in json.load(open(_f)):
    _pre=_x['sec'].split(' · ')[0]
    _same=[n for n,i in enumerate(items) if i['sec'].startswith(_pre+' ')]
    if _same: _x['sec']=items[_same[0]]['sec']; _x['prof']=items[_same[0]]['prof']
    for _k,_v in dict(fam='',year='',type='객',rep=1,repyears='',imgs=[],vis=[],notes=[],ai='',yrs=[]).items(): _x.setdefault(_k,_v)
    _x['meta']=('📝 사용자 추가 · ' if not _x['meta'].startswith('📝') else '')+_x['meta']
    _t=[n for n in _same if items[n]['area']!='야마']
    _b=[n for n in _same if re.match(r'imi-[a-z]+-t01$',items[n]['k'])]   # 사용자 요청: 그 섹션의 출제언급 티야(…-t01) 앞
    items.insert(_b[0] if _b else ((_t[-1]+1) if _t else (_same[-1]+1 if _same else len(items))),_x)
# 카드 단위 올해 수업범위 외(oos_*.py 의 O={카드키:이유}) – 같은 수업의 「… – 올해 수업범위 외」 구역으로 옮기고 정답률에서 뺀다. 답은 그대로.
_OO=_merge('oos_*.py','O'); _oc=[]
for i in list(items):
  if i['k'][4:] in _OO and not i.get('oos'):
    items.remove(i); i['oos']=1; i['meta']='📦 올해 수업범위 외 · 정답률 제외 ('+_OO[i['k'][4:]]+') · '+i['meta']; _oc.append(i)
for i in _oc:
  _s=i['sec']; i['sec']=_s+' – 올해 수업범위 외'
  _ix=[n for n,j in enumerate(items) if j['sec'] in (_s,i['sec'])]
  items.insert(_ix[-1]+1 if _ix else len(items),i)
keys=[i['k'] for i in items]; dup=[k for k,c in collections.Counter(keys).items() if c>1]
lost=[s for s in Y if s not in YSEC and s not in PRE]
print(len(items),collections.Counter(i['area'] for i in items),'errs',errs,'dup',dup,'구역누락',lost)
ym=[i for i in items if i['area']=='야마']
print('야마',len(ym),'킹야(2회)',sum(i['rep']==2 for i in ym),'킹킹야(3회+)',sum(i['rep']>=3 for i in ym),'확인필요',len([i for i in ym if i.get('excl')]))
ny=[i for i in items if i['area'] not in ('야마','형성평가')]
print('정답위치',sorted(collections.Counter(i['ans'][0] for i in ny).items()))
long=[i['k'] for i in ny if len(i['choices'][i['ans'][0]-1])>1.6*max(len(c) for j,c in enumerate(i['choices']) if j!=i['ans'][0]-1)]
print('answer-much-longer',len(long),long)
ym_=[i for i in ym if i['choices'] and not i.get('excl')]
print('야마 선지별 해설',sum(bool(i['exps']) for i in ym if i['choices']),'/',sum(1 for i in ym if i['choices']))
print('그림',sum(bool(i['imgs']) for i in items),'주관식',len([i for i in ym if not i['choices']]),'IMG키없음',[k for k in IMG if 'imi-'+k not in keys])
# 형성평가 칩: 🤍(수업 끝 퀴즈)·💜(과정별·전체) 형성평가 원문 + 수업 중 국시 기출(노트가 「국시 기출」로 시작) → 🏥
for i in items:
  if i['area']=='형성평가': i['fh']=True
  if i['area']!='야마' and any(n.startswith('국시 기출') for n in i['notes']): i['fh']=i['ks']=True
print('메모 답',sum(any(n.startswith('💬 메모 답') for n in i['notes']) for i in items),'/',len(_MA),'키없음',[k for k in _MA if 'imi-'+k not in keys])
print('형성평가',sum(bool(i.get('fh')) and not i.get('ks') for i in items),'국시',sum(bool(i.get('ks')) for i in items))
if os.environ.get('DUMP'): json.dump(items,open(os.environ['DUMP'],'w'),ensure_ascii=False)
print(build(items,'임상의학입문 문풀','imi-app',os.environ.get('OUT',D+'/imi-app.html')))
