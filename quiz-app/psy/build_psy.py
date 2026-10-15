import importlib,sys,json,collections
D='/tmp/claude-0/-home-user-P-D-r/561b9438-f541-5374-9f36-ce0f5db3fe50/scratchpad/psy'
sys.path.insert(0,D)
from mk import build
from fix_choices import FIX,EXPFIX
from tyb import TYB
import hashlib,random
MODS=['q1_intro','q2_interview','q3_class','q4_scz1','q5_scz2','q6_anx','q7_ocd']
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
    items.append(dict(k='psy-'+k,area=area,prof=prof,sec=sec,meta=('🤍형성평가 · ' if area=='야마' else '')+('📌티야방 · ' if tb else '')+'근거: '+src,tyb=bool(tb),
      year='',type='객',rep=1,stem=stem,choices=ch,ans=[ans],imgs=[],vis=[],notes=[],basis=basis,exps=exps,ai=''))
keys=[i['k'] for i in items]; dup=[k for k,c in collections.Counter(keys).items() if c>1]
print(len(items),collections.Counter(i['area'] for i in items),'errs',errs,'dup',dup)
# answer-position distribution & length check (answer longest?)
print(collections.Counter(i['ans'][0] for i in items))
long=[i['k'] for i in items if len(i['choices'][i['ans'][0]-1])>1.6*max(len(c) for j,c in enumerate(i['choices']) if j!=i['ans'][0]-1)]
print('answer-much-longer',long)
print(build(items,'정신의학 문풀','psy-app',D+'/psy-app.html'))
