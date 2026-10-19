import importlib,sys,json,collections,os,re,difflib
D=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,D)
from mk import build
from fix_choices import FIX,EXPFIX
from tyb import TYB
import hashlib,random
MODS=['q1_intro','q2_interview','q3_class','q4_scz1','q5_scz2','q6_anx','q7_ocd','q8_scz3','q9_ptsd']
# 야마(기출): y_*.py. 구역 → 붙일 수업 모듈(그 수업 문제 뒤에 넣는다)
YMODS=['y_iv','y_cl','y_scz','y_anx','y_ocd','y_ptsd']
YSEC={'iv':'q2_interview','cl':'q3_class','scz1':'q4_scz1','scz2':'q5_scz2','scz3':'q8_scz3','sczt':None,'anx':'q6_anx','ocd':'q7_ocd','ptsd':'q9_ptsd'}
YSRC={'iv':'학습지 「정신과적 면담 및 평가」 243–251쪽','cl':'학습지 「정신장애의 진단분류체계」 256–267쪽',
  'scz1':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','scz2':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽',
  'scz3':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','sczt':'학습지 「조현병 스펙트럼 및 기타 정신병적 장애」 268–301쪽','anx':'학습지 「불안장애」 166–188쪽','ocd':'학습지 「강박관련장애」 189–195쪽','ptsd':'학습지 「외상 및 스트레스 관련 장애」 196–204쪽'}
SCZT=('조현병 정신사회적 치료·경과·예후 (야마 · 수업 전)','정영철')

def N(t): return re.sub(r'[\s\W_]+','',t.lower())
def R(a,b): return difflib.SequenceMatcher(None,N(a),N(b)).ratio()
def same(c,s,ch,ans):
  # 문제·선지가 거의 같고 정답 선지 내용이 같으면 같은 문제로 본다
  if not c['ans'] or not ans or R(c['stem'],s)<0.8 or len(c['ch'])!=len(ch): return False
  if R(' '.join(c['ch'][a-1] for a in c['ans']),' '.join(ch[a-1] for a in ans))<0.85: return False
  return min(R(x,y) for x,y in zip(c['ch'],ch))>=0.9   # 선지가 하나라도 바뀌거나 순서가 다르면 따로 둔다

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
    tb=TYB.get(k);basis=c['basis']
    if tb: basis='📌 티야방('+tb[0]+'): '+tb[1]+'\n\n'+basis
    sec,prof=SCZT if c['sec']=='sczt' else importlib.import_module(YSEC[c['sec']]).SEC
    out[c['sec']].append(dict(k='psy-'+k,area='야마',prof=prof,sec=sec,meta='근거: '+YSRC[c['sec']],tyb=bool(tb),
      year=c['ys'][0],type='객',rep=rep,repyears=' · '.join(y for y in allys if y!=c['ys'][0]) if rep>1 else '',
      stem=c['stem'],choices=c['ch'],ans=c['ans'],excl=c['excl'],imgs=[],vis=[],notes=notes,basis='📚 학습지 해설 요약: '+basis if not tb else basis,exps=[],ai=''))
  return out

Y=yama()
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
  if m=='q8_scz3': items+=Y['sczt']
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
