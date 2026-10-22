import json,re,sys
import os
D=os.path.dirname(os.path.abspath(__file__))
def build(items,title,appkey,out):
  Q=[]
  for o in items:
    notes=[n for n in o.get('notes',[]) if not n.startswith('🔁 원래 주관식')] if o.get('area')!='야마' else o.get('notes',[])
    warn=[n for n in notes if n.startswith('⚠')]
    if o.get('excl'): notes=notes+['복원 불완전·확인 필요 문항이라 정답 자동 채점은 하지 않아요.']
    fl=dict(warn=bool(warn or o.get('excl')),chk=bool(o.get('ai') or any('정답' in n for n in warn)),
      inc=bool(o.get('excl') or any('복원' in n for n in warn)),ydiff=any(('연도' in n or '년도' in n) and '선지' in n for n in notes),
      oos=bool(o.get('oos')),tyb=bool(o.get('tyb')))
    meta=re.sub(r'^👑+ 킹+야 · \d+회 \([^)]*\)','',o.get('meta',''))
    Q.append(dict(k=o.get('k') or o['id'],area=o['area'],prof=o.get('prof',''),sec=o.get('sec',''),meta=meta,year=o.get('year',''),
      type=o.get('type','객'),rep=o.get('rep',1),repyears=o.get('repyears',''),stem=o['stem'],choices=o['choices'],
      ans=[] if o.get('excl') else o.get('ans',[]),imgs=o.get('imgs',[]),vis=o.get('vis',[]),notes=notes,basis=o.get('basis',''),
      exps=o.get('exps',[]),ai=o.get('ai',''),pick=(len(o.get('ans',[])) if len(o.get('ans',[]))>1 and re.search(r'지시하는 수만큼|\((두|세) 가지\)',o['stem']) else 0),fl={k:1 for k,v in fl.items() if v}))
  t=open(D+'/app.html',encoding='utf-8').read()
  data=json.dumps(Q,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
  t=t.replace('__TITLE__',title).replace('__APPKEY__',appkey).replace('__DATA__',data)
  open(out,'w',encoding='utf-8').write(t); return len(Q),len(t.encode())
if __name__=='__main__':
  it=json.load(open(D+'/neuro_items.json'))
  print(build(it,'신경학 야마','neuro2',D+'/test_neuro.html'))
