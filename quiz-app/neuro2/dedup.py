import re,sys,html,difflib,collections,json
sys.path.insert(0,'/home/user/P_D_r/quiz-app/neuro2')
from fixlib import parse
def N(t): return re.sub(r'[\s\W_]+','',t.lower())
def R(a,b): return difflib.SequenceMatcher(None,a,b).ratio()
def cards(s,area='yama'):
  out=[]
  for m in re.finditer(r'<article class="qcard[^"]*"[^>]*id="((topic-\d+)-area-'+area+r'-q-\d+)">(.*?)</article>',s,re.S):
    f=parse(m.group(3)); meta=re.sub('<[^>]+>','',f['meta'])
    ch=[N(c) for c in f['choices']]
    ans=' '.join(ch[a-1] for a in f['ans'] if a<=len(ch)) if f['choices'] else N(f.get('given',''))
    y=re.search(r'야마 (\d{4}) (객|주)(\d+)',meta)
    out.append(dict(cid=m.group(1),t=m.group(2),meta=meta,stem=N(f['stem']),ch=ch,ans=ans,subj=f['subj'],yl=(y.group(1)+' '+y.group(2)+y.group(3)) if y else None,excl=f['excluded'],raw=f))
  return out
def same(a,b):
  if a['subj']!=b['subj']: return False
  if R(a['stem'],b['stem'])<0.8: return False
  if a['subj']: return True
  if not a['ch'] or not b['ch'] or not a['ans'] or not b['ans']: return False
  if R(a['ans'],b['ans'])<0.85: return False
  sc=sum(max(R(x,y) for y in b['ch']) for x in a['ch'])/len(a['ch'])
  return sc>=0.8
# 같은 case(선지만 다르게 복원)라 자동 판정에서 빠지는 쌍을 수동 병합
MANUAL={'topic-027-area-yama-q-005':['topic-027-area-yama-q-006'],'topic-028-area-yama-q-003':['topic-028-area-yama-q-006']}
def groups(s):
  cs=cards(s); G=[]
  by=collections.defaultdict(list)
  for c in cs: by[c['t']].append(c)
  for t,L in by.items():
    used=set()
    for i,a in enumerate(L):
      if i in used or not a['yl']: continue
      g=[a]
      for j in range(i+1,len(L)):
        if j in used or not L[j]['yl']: continue
        if same(a,L[j]): g.append(L[j]); used.add(j)
      used.add(i)
      if len(g)>1: G.append(g)
  # 언어만 다른(한글/영문) 같은 문제 수동 병합
  byid={c['cid']:c for c in cs}
  for key,extra in MANUAL.items():
    g=next((g for g in G if any(c['cid']==key for c in g)),None)
    if g is None: g=[byid[key]]; G.append(g)
    for e in extra:
      for g2 in G:
        if g2 is not g and any(c['cid']==e for c in g2): G.remove(g2); g.extend(g2); break
      else:
        if all(c['cid']!=e for c in g): g.append(byid[e])
  return G
if __name__=='__main__':
  s=open(sys.argv[1],encoding='utf-8').read()
  G=groups(s); print(len(G),sum(len(g)-1 for g in G))
  for g in G: print(len(g),' / '.join(c['cid'][-9:]+' '+c['yl'] for c in g))
def apply(s):
  G=groups(s); drop=set(); log=[]
  for g in G:
    rep=sorted(g,key=lambda c:(c['excl'],'<div class="visual">' not in (c['raw']['visual'] or '') and not c['raw']['visual'],-int(c['yl'][:4])))[0]
    ys=sorted({c['yl'][:4] for c in g},reverse=True)
    n=len(g); tag='👑👑 킹킹야' if n>=3 else '👑 킹야'
    occ=' · '.join(sorted({c['yl'] for c in g},reverse=True))
    m=re.search(r'(<article class="qcard[^"]*"[^>]*id="'+re.escape(rep['cid'])+r'">)(<div class="qmeta">)',s)
    s=s[:m.end(1)]+m.group(2)+f'<span class="king-tag">{tag} · {n}회 ({", ".join(ys)})</span>'+s[m.end(2):]
    # 반복 출제 기록을 해설 맨 앞에
    i=s.find('id="'+rep['cid']+'"'); j=s.find('<div class="feedback"><div>',i)+len('<div class="feedback"><div>')
    s=s[:j]+html.escape(f'반복 출제: {occ} ({n}회)\n\n')+s[j:]
    for c in g:
      if c is not rep: drop.add(c['cid'])
    log.append((rep['cid'],occ,[c['cid'] for c in g if c is not rep]))
  for cid in drop:
    s=re.sub(r'<article class="qcard[^"]*"[^>]*id="'+re.escape(cid)+r'">.*?</article>','',s,1,flags=re.S)
  return s,log,drop
