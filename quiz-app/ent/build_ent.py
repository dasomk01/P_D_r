# 이비인후과(이과) 문풀 빌드 – 정신의학 앱(quiz-app/psy)과 같은 구조.  python3 build_ent.py → ent-app.html
import importlib,sys,json,collections,os,re,difflib,glob,hashlib,random,base64
D=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,D)
from mk import build
from tq_tyb import TQ   # 티야방 내용을 문제로 만든 티야
from fq_fh import FQ    # 형성평가(중간평가) 복원 문항
from fix_choices import FIX
from fix_choices2 import FIX as _F2
FIX.update(_F2)
# 티야(올해 수업 STT·강의록 기반 5지선다) 모듈 – 수업 순서
MODS=['q1_struct','q2_hear','q3_vext','q4_mid','q5_oto','q6_snhl','q7_vest','q8_fn']
# 야마(학습지 기출 원문·정답) 모듈 – 순서 중요(문제 None 은 같은 묶음의 바로 앞 카드에 합친다)
YMODS=['y_dev','y_aud','y_vest','y_sym','y_ext','y_cong','y_aom','y_com','y_tbf','y_inner','y_hl','y_vdx','y_fn']
# 야마 구역 → 붙일 수업(그 수업 티야 뒤에 넣는다)
YSEC={'dev':'q1_struct','aud':'q2_hear','sym':'q2_hear','vest':'q3_vext','ext':'q3_vext',
  'cong':'q4_mid','aom':'q4_mid','com':'q4_mid','tbf':'q4_mid','ots':'q5_oto',
  'inner':'q6_snhl','hlx':'q7_vest','hlr':'q7_vest','vdx':'q7_vest'}
W='학습지 「2026 이과학 학습지」 '
YSRC={'dev':W+'「귀의 발생과 구조」 5–28쪽','aud':W+'「청각기관의 구조와 기능」 29–54쪽','vest':W+'「전정계의 해부와 생리」 55–69쪽',
  'sym':W+'「이과적 증상」 70–77쪽','ext':W+'「외이질환」 78–97쪽','cong':W+'「선천성 외이기형」 98–104쪽',
  'aom':W+'「급성 중이염과 삼출성 중이염」 105–125쪽','com':W+'「만성 중이염, 진주종과 유양돌기염」 126–142쪽',
  'tbf':W+'「측두골 외상」 143–148쪽','ots':W+'「이경화증」 149–151쪽','inner':W+'「내이질환」 152–172쪽',
  'hlx':W+'「난청의 조기진단」 173–179쪽','hlr':W+'「난청의 재활」 180–190쪽','vdx':W+'「전정질환의 치료와 재활」 191–214쪽',
  'bppv':W+'「전정질환의 치료와 재활」 191–214쪽 중 BPPV 문항','fn':W+'「안면신경질환」 215–228쪽'}
# 아직 수업 전인 야마: (섹션명, 교수, 뒤에 붙일 수업 모듈). 11/4 STT: 「BPPV는 내일부터」 – 안면신경도 그 뒤.
PRE={}   # 11/5 BPPV·안면신경 수업 → 모두 수업 섹션으로 옮김
YSEC.update(bppv='q8_fn',fn='q8_fn')
PREFAM={'dhleft':'bppv','epleyord':'bppv','epleypic':'bppv','hroll':'bppv','hroll11':'bppv','hroll13':'bppv'}  # vdx 안의 BPPV 묶음
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
        c=dict(sec=PREFAM.get(f,sec),f=f,ys=[yl],stem=stem,ch=ch,ans=ans,basis=basis,notes=list(notes or []),excl=excl,cf={str(y):prof})
        fam[f].append(c);cards.append(c)
  out=collections.defaultdict(list);seen=set()
  for c in cards:
    allys=[y for d in fam[c['f']] for y in d['ys']]
    rep=len({y.split()[0] for y in allys})
    k='y-'+c['f']+'-'+c['ys'][0].split()[0]
    if k in seen: k+='-'+c['ys'][0].split()[1]
    seen.add(k)
    notes=list(dict.fromkeys(c['notes']))
    if len(c['ys'])>1: notes=['같은 문제(문제·선지 거의 동일): '+' · '.join(c['ys'][1:])]+notes
    if c['excl']: notes=notes+['학습지 정답 그대로는 채점하지 않고, 확인되면 반영할게요.']
    tb=TYB.get(k) or TYB.get('fam:'+c['f']);ex=EXP.get(k,{});cls=ex.get('cls') or CLS.get(c['f'])
    parts=['📌 티야방('+tb[0]+'): '+tb[1]] if tb else []
    if cls: parts.append('🎓 올해 수업 기준: '+cls)
    parts.append('📚 학습지 해설: '+ex['wb'] if ex.get('wb') else '📚 학습지 해설 요약: '+c['basis'])
    sec,prof=PRE[c['sec']][:2] if c['sec'] in PRE else importlib.import_module(YSEC[c['sec']]).SEC
    cn=cfnote(c['cf'],prof)
    if cn: notes=[cn]+notes
    out[c['sec']].append(dict(k='ent-'+k,fam=c['f'],area='야마',prof=prof,sec=sec,meta='근거: '+YSRC[c['sec']],tyb=bool(tb),
      year=c['ys'][0],type='객' if c['ch'] else '주',rep=rep,repyears=' · '.join(y for y in allys if y!=c['ys'][0]) if rep>1 else '',
      stem=c['stem'],choices=c['ch'],ans=c['ans'],excl=c['excl'],imgs=imgs(k),vis=[],notes=notes,basis='\n\n'.join(parts),exps=[],ai=''))
  return out

Y=yama()
items=[];errs=[]
for m in MODS:
  M=importlib.import_module(m); sec,prof=M.SEC
  for t in M.Q+TQ.get(m,[])+FQ.get(m,[]):
    area,k,stem,ch,ans,basis,exps,src=t[:8]; qn=list(t[8]) if len(t)>8 else []
    ch=FIX.get(k,ch)
    r=random.Random(int(hashlib.md5(k.encode()).hexdigest(),16)); idx=list(range(5)); r.shuffle(idx)
    ch=[ch[i] for i in idx]; exps=[exps[i] for i in idx]; ans=idx.index(ans-1)+1
    if len(ch)!=5 or len(exps)!=5 or not 1<=ans<=5: errs.append((k,len(ch),len(exps),ans))
    tb=TYB.get(k)
    if not tb and src.startswith('티야방'): tb=(src.split()[1],'')
    if tb and tb[1]: basis='📌 티야방('+tb[0]+'): '+tb[1]+'\n\n'+basis
    items.append(dict(k='ent-'+k,area=area,prof=prof,sec=sec,meta=('📌티야방 · ' if tb else '')+'근거: '+src,tyb=bool(tb),
      year='',type='객',rep=1,stem=stem,choices=ch,ans=[ans],imgs=[],vis=[],notes=qn,basis=basis,exps=exps,ai=''))
  for ys,ym in YSEC.items():
    if ym==m: items+=Y[ys]
  for ys,(_,_,pm) in PRE.items():
    if pm==m: items+=Y[ys]
for i in items:
  if i['area']=='야마' and not i.get('excl') and i['choices'] and (not i['ans'] or max(i['ans'])>len(i['choices'])): errs.append(i['k'])
keys=[i['k'] for i in items]; dup=[k for k,c in collections.Counter(keys).items() if c>1]
lost=[s for s in Y if s not in YSEC and s not in PRE]
print(len(items),collections.Counter(i['area'] for i in items),'errs',errs,'dup',dup,'구역누락',lost)
ym=[i for i in items if i['area']=='야마']
print('야마',len(ym),'킹야(2회)',sum(i['rep']==2 for i in ym),'킹킹야(3회+)',sum(i['rep']>=3 for i in ym),'확인필요',len([i for i in ym if i.get('excl')]))
ny=[i for i in items if i['area']!='야마']
print('정답위치',sorted(collections.Counter(i['ans'][0] for i in ny).items()))
long=[i['k'] for i in ny if len(i['choices'][i['ans'][0]-1])>1.6*max(len(c) for j,c in enumerate(i['choices']) if j!=i['ans'][0]-1)]
print('answer-much-longer',len(long),long)
print('그림',sum(bool(i['imgs']) for i in items),'주관식',len([i for i in ym if not i['choices']]),'IMG키없음',[k for k in IMG if 'ent-'+k not in keys])
# 형성평가 칩: fhset.py 의 FHKEYS(앞 'ent-' 뺀 키) + 「형성평가」 표시
FHKEYS=set(importlib.import_module('fhset').FHKEYS) if os.path.exists(D+'/fhset.py') else set()
for i in items:
  if i['k'][4:] in FHKEYS or '형성평가' in i['stem'][:8] or any('형성평가' in n for n in i['notes']) or '중간평가' in i['meta'] or '형성평가' in i['meta']: i['fh']=True
print('형성평가',sum(1 for i in items if i.get('fh')))
if os.environ.get('DUMP'): json.dump(items,open(os.environ['DUMP'],'w'),ensure_ascii=False)
print(build(items,'이비인후과 문풀','ent-app',D+'/ent-app.html'))
