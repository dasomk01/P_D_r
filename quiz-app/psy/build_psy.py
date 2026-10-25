import importlib,sys,json,collections,os,re,difflib
D=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,D)
from mk import build
from fix_choices import FIX,EXPFIX
from tyb import TYB
import hashlib,random
MODS=['q1_intro','q2_interview','q3_class','q4_scz1','q5_scz2','q6_anx','q7_ocd','q8_scz3','q9b_scz4','q9_ptsd','q10_scz5','q11_child1','q12_adhd','q13_eat','q14_som','q15_pd','q19_dis','q16_sex','q18_geri','q17_mood','q20_child3','q21_child4','q22_psysoc']
# 야마(기출): y_*.py. 구역 → 붙일 수업 모듈(그 수업 문제 뒤에 넣는다)
YMODS=['y_iv','y_cl','y_scz','y_anx','y_ocd','y_ptsd','y_nd','y_eat','y_pd','y_dis','y_sex','y_geri','y_mood','y_child4','y_psysoc']
YSEC={'iv':'q2_interview','cl':'q3_class','scz1':'q4_scz1','scz2':'q5_scz2','scz3':'q8_scz3','sczt':'q9b_scz4','anx':'q6_anx','ocd':'q7_ocd','ptsd':'q9_ptsd',
  'scz5':'q10_scz5','nd1':'q11_child1','nd2':'q12_adhd','tic':'q20_child3','eat':'q13_eat','som':'q14_som','psm':'q14_som',
  'pd':'q15_pd','dis':'q19_dis','sex':'q16_sex','geri':'q18_geri','dep':'q17_mood','bip':'q17_mood','canx':'q21_child4','cdep':'q21_child4','pst':'q22_psysoc'}
YSRC={'iv':'학습지 「정신과적 면담 및 평가」 243–251쪽','cl':'학습지 「정신장애의 진단분류체계」 256–267쪽',
  'scz1':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','scz2':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽',
  'scz3':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','sczt':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','anx':'학습지 「불안장애」 166–188쪽','ocd':'학습지 「강박관련장애」 189–195쪽','ptsd':'학습지 「외상 및 스트레스 관련 장애」 196–204쪽',
  'scz5':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','nd1':'학습지 「신경발달장애」 76–100쪽','nd2':'학습지 「신경발달장애」 76–100쪽','tic':'학습지 「신경발달장애」 76–100쪽',
  'eat':'학습지 「급식 및 섭식 장애」 218–223쪽','som':'학습지 「신체증상 및 관련 장애」 231–236쪽','psm':'학습지 「정신신체의학」 224–230쪽',
  'pd':'학습지 「성격장애」 14–23쪽','dis':'학습지 「해리장애」 237–241쪽','sex':'학습지 「성장애」 8–13쪽','geri':'학습지 「노인정신의학」 54–57쪽',
  'dep':'학습지 「우울장애」 341–362쪽','bip':'학습지 「양극성 관련 장애」 326–340쪽',
  'canx':'학습지 「소아청소년 정신의학」 113–144쪽(새 학습지)','cdep':'학습지 「소아청소년 정신의학」 113–144쪽(새 학습지)','pst':'학습지 「정신사회적 치료」 206–218쪽(새 학습지)'}
# 아직 수업 전인 야마 구역: (섹션명, 교수, 뒤에 붙일 수업 모듈)
PRE={}

def N(t): return re.sub(r'[\s\W_]+','',t.lower())
def R(a,b): return difflib.SequenceMatcher(None,N(a),N(b)).ratio()
def same(c,s,ch,ans):
  # 문제·선지가 거의 같고 정답 선지 내용이 같으면 같은 문제로 본다
  if not c['ans'] or not ans or R(c['stem'],s)<0.8 or len(c['ch'])!=len(ch): return False
  if R(' '.join(c['ch'][a-1] for a in c['ans']),' '.join(ch[a-1] for a in ans))<0.85: return False
  return min(R(x,y) for x,y in zip(c['ch'],ch))>=0.9   # 선지가 하나라도 바뀌거나 순서가 다르면 따로 둔다

# 야마 해설 보강: yexp_*.py 의 EXP = {카드키: {'cls': 올해 수업 기준 해설, 'wb': 학습지 해설}}
import glob
EXP={}
for p in sorted(glob.glob(D+'/yexp_*.py')): EXP.update(importlib.import_module(os.path.basename(p)[:-3]).EXP)

def yama():
  cards=[];fam=collections.defaultdict(list)
  for m in YMODS:
    for sec,f,y,n,stem,ch,ans,basis,notes in importlib.import_module(m).Y:
      yl='%d %s'%(y,n)
      if stem is None:                       # 바로 앞 해와 문제·선지가 같은 해
        fam[f][-1]['ys'].append(yl);continue
      excl=not ans
      for c in fam[f]:
        if not excl and same(c,stem,ch,ans): c['ys'].append(yl);break
      else:
        c=dict(sec=sec,f=f,ys=[yl],stem=stem,ch=ch,ans=ans,basis=basis,notes=list(notes),excl=excl)
        fam[f].append(c);cards.append(c)
  out=collections.defaultdict(list)
  for c in cards:
    allys=[y for d in fam[c['f']] for y in d['ys']]
    rep=len({y.split()[0] for y in allys})
    k='y-'+c['f']+'-'+c['ys'][0].split()[0]
    notes=c['notes']
    if len(c['ys'])>1: notes=['같은 문제(문제·선지 거의 동일): '+' · '.join(c['ys'][1:])]+notes
    if c['excl']: notes=notes+['학습지 정답 그대로는 채점하지 않고, 확인되면 반영할게요.']
    tb=TYB.get(k);ex=EXP.get(k,{})
    parts=['📌 티야방('+tb[0]+'): '+tb[1]] if tb else []
    if ex.get('cls'): parts.append('🎓 올해 수업 기준: '+ex['cls'])
    parts.append('📚 학습지 해설: '+ex['wb'] if ex.get('wb') else '📚 학습지 해설 요약: '+c['basis'])
    basis='\n\n'.join(parts)
    sec,prof=PRE[c['sec']][:2] if c['sec'] in PRE else importlib.import_module(YSEC[c['sec']]).SEC
    out[c['sec']].append(dict(k='psy-'+k,area='야마',prof=prof,sec=sec,meta='근거: '+YSRC[c['sec']],tyb=bool(tb),
      year=c['ys'][0],type='객',rep=rep,repyears=' · '.join(y for y in allys if y!=c['ys'][0]) if rep>1 else '',
      stem=c['stem'],choices=c['ch'],ans=c['ans'],excl=c['excl'],imgs=[],vis=[],notes=notes,basis=basis,exps=[],ai=''))
  return out

Y=yama()
if os.environ.get('DUMPKEYS'):
  json.dump({s:[dict(k=i['k'][4:],year=i['year'],rep=i['repyears'],stem=i['stem'][:60]) for i in v] for s,v in Y.items()},open(os.environ['DUMPKEYS'],'w'),ensure_ascii=False,indent=0)
items=[];errs=[]
for m in MODS:
  M=importlib.import_module(m); sec,prof=M.SEC
  for t in M.Q:
    area,k,stem,ch,ans,basis,exps,src=t
    ch=FIX.get(k,ch); exps=EXPFIX.get(k,exps)
    if area!='야마':
      r=random.Random(int(hashlib.md5(k.encode()).hexdigest(),16)); idx=list(range(5)); r.shuffle(idx)
      ch=[ch[i] for i in idx]; exps=[exps[i] for i in idx]; ans=idx.index(ans-1)+1
    if len(ch)!=5 or len(exps)!=5 or not 1<=ans<=5: errs.append((k,len(ch),len(exps),ans))
    tb=TYB.get(k)
    if tb: basis='📌 티야방('+tb[0]+'): '+tb[1]+'\n\n'+basis
    if '티야방' in src and not tb: tb=('',)
    items.append(dict(k='psy-'+k,area=area,prof=prof,sec=sec,meta=('📌티야방 · ' if tb else '')+'근거: '+src,tyb=bool(tb),
      year='',type='객',rep=1,stem=stem,choices=ch,ans=[ans],imgs=[],vis=[],notes=[],basis=basis,exps=exps,ai=''))
  for ys,ym in YSEC.items():
    if ym==m: items+=Y[ys]
  for ys,(_,_,pm) in PRE.items():
    if pm==m: items+=Y[ys]
for i in items:
  if i['area']=='야마' and not i.get('excl') and (not i['ans'] or max(i['ans'])>len(i['choices'])): errs.append(i['k'])
keys=[i['k'] for i in items]; dup=[k for k,c in collections.Counter(keys).items() if c>1]
print(len(items),collections.Counter(i['area'] for i in items),'errs',errs,'dup',dup)
ym=[i for i in items if i['area']=='야마']
print('야마',len(ym),'킹야(2회)',sum(i['rep']==2 for i in ym),'킹킹야(3회+)',sum(i['rep']>=3 for i in ym),'확인필요',[i['k'] for i in ym if i.get('excl')])
# answer-position distribution & length check (answer longest?) – 야마는 원문이라 제외
ny=[i for i in items if i['area']!='야마']
print(collections.Counter(i['ans'][0] for i in ny))
long=[i['k'] for i in ny if len(i['choices'][i['ans'][0]-1])>1.6*max(len(c) for j,c in enumerate(i['choices']) if j!=i['ans'][0]-1)]
print('answer-much-longer',long)
print(build(items,'정신의학 문풀','psy-app',D+'/psy-app.html'))
