"""학습지 원본 페이지에서 야마 문제 사진을 잘라(yimg_log.txt 좌표) 사진이 없던 야마 카드의 문두 아래에 넣는다.
기존 '시각자료 소견'(사진을 글로 옮긴 것)은 사진으로 교체. 재실행 시 교체."""
import re,json,os,html
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
T='/root/.claude/projects/-home-user-P-D-r/561b9438-f541-5374-9f36-ce0f5db3fe50/tool-results/'
OUT=D+'/yimg'; os.makedirs(OUT,exist_ok=True)
pmap={int(k):v for k,v in json.load(open(D+'/page_blob.json')).items()}
log=[]
for l in open(D+'/yimg_log.txt',encoding='utf-8'):
  if not l[0].isdigit(): continue
  p=l.rstrip('\n').split('|'); log.append(dict(page=int(p[0]),box=tuple(map(int,p[1].split(','))),key=p[2].strip(),note=(p[3] if len(p)>3 else '').strip()))
MANUAL={'topic-025-area-yama-q-007':('2017 객27',119),'topic-003-area-yama-q-013':('2021 객16',181)}
s=open(D+'/work.html',encoding='utf-8').read()
orig=json.load(open(D+'/yimg_orig.json')) if os.path.exists(D+'/yimg_orig.json') else {}
def restore(m):
  a=s.rindex('<article',0,m.start()); cid=re.search(r'id="([^"]+)"',s[a:m.start()]).group(1)
  return orig.get(cid,'')
s=re.sub(r'<div class="visual yimg">.*?</div><!--/yimg-->',restore,s,flags=re.S)
cards=[]
for m in re.finditer(r'<article[^>]*id="((topic-\d+)-area-yama-q-\d+)">(.*?)</article>',s,re.S):
  cid,t,b=m.groups()
  if '🤍' in b: continue
  meta=re.search(r'<div class="qmeta">(.*?)</div>',b).group(1)
  k=re.search(r'야마 (\d{4}) ?((?:객|주)\s?\d+)',meta); pg=re.search(r'학습지 (\d+)',meta)
  cards.append(dict(cid=cid,key=(k.group(1)+' '+k.group(2).replace(' ','')) if k else None,page=int(pg.group(1)) if pg else None,has='<img' in b))
by={}
for i,e in enumerate(log):
  hit=[c for c in cards if c['key']==e['key'] and c['page'] is not None and abs(c['page']-e['page'])<=2]
  for cid,(k,p) in MANUAL.items():
    if e['key']==k and e['page']==p: hit=[c for c in cards if c['cid']==cid]
  if not hit: continue
  c=min(hit,key=lambda c:abs((c['page'] or e['page'])-e['page']))
  if c['has']: continue
  by.setdefault(c['cid'],[]).append(e)
LECT={ # cid: (blob, 기준 W,H, crop, masks, note)
 'topic-009-area-yama-q-001':('mcp-Somed-blob-1790776871450-66y0be.jpg',1600,900,(100,230,1445,870),[],'뇌출혈 강의록 97쪽 형성평가 슬라이드'),
 'topic-010-area-yama-q-001':('mcp-Somed-blob-1790776872061-tdikoi.jpg',1600,900,(455,195,1025,820),[],'중추신경계외상 강의록 76쪽 형성평가 슬라이드'),
 'topic-010-area-yama-q-002':('mcp-Somed-blob-1790776872061-2tm5eq.jpg',1600,900,(195,185,1405,870),[],'중추신경계외상 강의록 77쪽 형성평가 슬라이드'),
 'topic-017-area-yama-q-001':('mcp-Somed-blob-1790776878841-ez2ddf.jpg',1440,1080,(100,135,1340,1070),[(1112,415,1390,562),(1155,695,1240,735),(775,675,1115,765)],'뇌파1 강의록 34쪽 형성평가 슬라이드 · 정답 힌트가 되는 필기는 가림'),
 'topic-017-area-yama-q-002':('mcp-Somed-blob-1790776878841-gqrf34.jpg',1440,1080,(100,130,1340,1075),[(755,585,895,650),(835,655,1080,780)],'뇌파1 강의록 35쪽 형성평가 슬라이드 · 정답 힌트가 되는 필기는 가림'),
 'topic-017-area-yama-q-003':('mcp-Somed-blob-1790776878842-2nwq7p.jpg',1440,1080,(10,175,1430,1035),[(118,402,408,505)],'뇌파1 강의록 36쪽 형성평가 슬라이드 · 정답 힌트가 되는 필기는 가림'),
 'topic-017-area-yama-q-004':('mcp-Somed-blob-1790776878991-a1b2rp.jpg',1440,1080,(28,160,1405,1078),[],'뇌파1 강의록 39쪽 형성평가 슬라이드 · 정답 힌트가 되는 필기는 가림'),
 'topic-017-area-yama-q-005':('mcp-Somed-blob-1790776880069-hftpzh.jpg',1440,1080,(0,272,1440,1070),[(0,355,220,412)],'뇌파2 강의록 17쪽 형성평가 슬라이드 · 정답 힌트가 되는 필기는 가림'),
 'topic-026-area-yama-q-001':('mcp-Somed-blob-1790776880030-0tk3as.jpg',1600,900,(285,190,1285,690),[],'외상성 뇌손상 영상 강의록 34쪽 Quiz 슬라이드'),
}
from PIL import ImageDraw
for cid,(blob,W,H,box,masks,note) in LECT.items():
  im=Image.open(T+blob).convert('RGB'); sx=im.width/W; sy=im.height/H; d=ImageDraw.Draw(im)
  for m in masks: d.rectangle((int(m[0]*sx),int(m[1]*sy),int(m[2]*sx),int(m[3]*sy)),fill=(255,255,255))
  im=im.crop((int(box[0]*sx),int(box[1]*sy),int(box[2]*sx),int(box[3]*sy)))
  fn='l_'+cid[6:9]+'_'+cid[-3:]+'.jpg'; im.save(OUT+'/'+fn,'JPEG',quality=82,optimize=True)
  by[cid]=[dict(fn=fn,note=note)]
n=0;files=[]
for cid,es in by.items():
  imgs=[];notes=[]
  for j,e in enumerate(es):
    if 'fn' in e:
      imgs.append(f'<img src="yimg/{e["fn"]}" alt="원본 문제 사진" loading="lazy" style="max-width:100%;height:auto;display:block;margin:8px auto;border-radius:6px"/>'); files.append(e['fn']); notes.append(e['note']); continue
    fn=f'y_{e["page"]}_{e["box"][0]}_{e["box"][1]}.jpg'
    im=Image.open(T+pmap[e['page']]).convert('RGB')
    sx=im.width/990; sy=im.height/1400
    x0,y0,x1,y1=e['box']; im=im.crop((int(x0*sx),int(y0*sy),int(x1*sx),int(y1*sy)))
    im.save(OUT+'/'+fn,'JPEG',quality=82,optimize=True); files.append(fn)
    imgs.append(f'<img src="yimg/{fn}" alt="원본 문제 사진" loading="lazy" style="max-width:100%;height:auto;display:block;margin:8px auto;border-radius:6px"/>')
    if e['note'] and e['note'] not in notes: notes.append(e['note'])
  src=(('학습지 '+str(es[0]['page'])+'쪽 원본 사진') if 'page' in es[0] else '')+((' · ' if 'page' in es[0] else '')+' / '.join(notes) if notes else '')
  vis=f'<div class="visual yimg"><b>문제 사진</b>{"".join(imgs)}<div class="source">{html.escape(src)}</div></div><!--/yimg-->'
  a=s.index(f'id="{cid}">'); b=s.index('</article>',a); card=s[a:b]
  tv=re.search(r'<div class="visual"><b>시각자료 소견</b>.*?</div>',card,re.S)
  if tv:
    orig[cid]=tv.group(0); card=card.replace(tv.group(0),vis,1)
  else:
    se=re.search(r'<div class="stem">.*?</div>',card,re.S); card=card[:se.end()]+vis+card[se.end():]
    orig.setdefault(cid,'')
  s=s[:a]+card+s[b:]; n+=1
json.dump(orig,open(D+'/yimg_orig.json','w'),ensure_ascii=False)
open(D+'/work.html','w',encoding='utf-8').write(s)
print('cards',n,'images',len(files))
