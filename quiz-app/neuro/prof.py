import re,json,collections
pages={int(k):v for k,v in json.load(open('wbpages.json')).items()}
NAME=r'([가-힣](?:\s?[가-힣]){1,2})\s*(?:교수님|교수|pf|PF|Pf)'
def norm(n): return n.replace(' ','')
BAD={'담당','참고','신경과','해당','여러','모든','다른','강의','정경','교수'}
blocks=collections.defaultdict(list)  # (prefix,num)->[(page,prof)]
for p,t in pages.items():
  parts=re.split(r'(?=번호\s+(?:객|주)?\s*\d+\s+정답)',t)
  for part in parts[1:]:
    m=re.match(r'번호\s+(객|주)?\s*(\d+)',part); pre,num=m.group(1) or '',int(m.group(2))
    seg=part[:1500]
    prof=None
    d=re.search(r'담당\s*교\s*수\s*님?\s+(.{0,40})',seg)
    if d:
      names=[norm(x) for x in re.findall(NAME,d.group(1))]
      if not names:
        mm=re.match(r'([가-힣]{3})',d.group(1).replace(' ',''))
        names=[mm.group(1)] if mm else []
      names=[x for x in names if x not in BAD]
      if names: prof=', '.join(dict.fromkeys(names))
    if not prof:
      r=re.search(r'참고\s+(.{0,60})',seg)
      if r:
        names=[norm(x) for x in re.findall(NAME,r.group(1)) if norm(x) not in BAD]
        if names: prof=names[0]
    blocks[(pre,num)].append((p,prof))
def lookup(pre,num,page=None,rng=None):
  cands=blocks.get((pre,num),[])+([] if pre=='' else [])
  if page: c=[x for x in cands if page<=x[0]<=page+2]
  else: c=[x for x in cands if rng[0]<=x[0]<=rng[1]]
  c.sort(key=lambda x:(x[1] is None, x[0]-(page or 0)))
  return c[0][1] if c else None
WL={'고은정','서만욱','오선영','신병수','고명환','강현구','이종명','김선준','김고운','정슬기','곽효성','박정수','정경호','류한욱','황승배','양태호','원유희','최하영','황윤수','김기욱','신현준','채주희','황윤수'}
FIX={'서만옥':'서만욱'}
def clean(pr):
  if not pr: return None
  ns=[FIX.get(x.strip(),x.strip()) for x in pr.split(',')]
  ns=[x for x in ns if x in WL]
  return ', '.join(dict.fromkeys(ns)) or None
def find(pre,num,page,rng):
  lo,hi=(page,page+2) if page else rng
  for pp in [pre,'']:
    c=[(abs(x[0]-(page or x[0])),clean(x[1])) for x in blocks.get((pp,num),[]) if lo<=x[0]<=hi]
    c=sorted([x for x in c if x[1]])
    if c: return c[0][1],'exact'
  if page:
    near=[(abs(p-page),clean(pr)) for k,v in blocks.items() for p,pr in v if abs(p-page)<=1]
    near=sorted([x for x in near if x[1]])
    if near: return near[0][1],'near'
  return None,None
def qpage(pre,num,year,rng):
  pat=re.compile(re.escape(pre)+r'\s*'+str(num)+r'\s*\.\s*\n.{0,700}?\['+str(year)+r'\]',re.S)
  c=[p for p in range(rng[0],rng[1]+1) if p in pages and pat.search(pages[p])]
  return c[0] if c else None
def find2(pre,num,year,page,rng):
  if not page: page=qpage(pre,num,year,rng)
  if not page:
    return find(pre,num,None,rng)
  lo,hi=page,page+2
  for pp in [pre,'','객' if pre=='주' else '주']:
    c=sorted([(x[0]-page,clean(x[1])) for x in blocks.get((pp,num),[]) if lo<=x[0]<=hi and clean(x[1])])
    if c: return c[0][1],'exact'
  near=sorted([(abs(p-page),clean(pr)) for k,v in blocks.items() for p,pr in v if abs(p-page)<=1 and clean(pr)])
  if near: return near[0][1],'near'
  return None,None
def prof_for(meta,rng):
  y=re.search(r'야마 (\d{4}) (객|주)(\d+)',meta)
  if not y: return None,None
  p=re.search(r'학습지 (\d+)',meta)
  return find2(y.group(2),int(y.group(3)),int(y.group(1)),int(p.group(1)) if p else None,rng)
