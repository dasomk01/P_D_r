import sys,re
sys.path.insert(0,sys.argv[0].rsplit('/',1)[0])
from fixlib import parse,PLACEHOLDER
s=open(sys.argv[1],encoding='utf-8').read(); topic=sys.argv[2]; keys=sys.argv[3].split(',') if len(sys.argv)>3 else None
for cid,b in re.findall(r'<article class="qcard[^"]*"[^>]*id="(%s-area-yama-q-\d+)">(.*?)</article>'%topic,s,re.S):
  k=cid.split('-area-yama-')[-1]
  if keys and k not in keys: continue
  f=parse(b)
  if keys is None and not f['excluded']: continue
  ph=any(PLACEHOLDER.search(x) for x in f['exps'])
  print(f"## {k} excl={f['excluded']} subj={f['subj']} ans={f['ans']} given={f['given'][:50]} placeholder={ph} nexp={len(f['exps'])}/{len(f['choices'])}")
  print('  B:',f['basis'][:300].replace('\n',' '))
  if ph or keys: 
    for x in f['exps']: print('   -',x[:140])
