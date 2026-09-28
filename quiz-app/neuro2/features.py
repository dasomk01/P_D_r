"""work.html → final.html : 출제교수 표시, 연도 내림차순 정렬, 번호판 현재/표시 색, 복습 표시(맞음/헷갈림/틀림)와 주제별 복습 모드.
2번 앱: 복습 표시는 localStorage `neuro2-app-marks-v1`(1번 앱 `neuro-app-marks-v5`와 분리)."""
import re,json,html,collections,sys
D='/home/user/P_D_r/quiz-app/neuro2'
s=open(D+'/work2.html',encoding='utf-8').read()
yprof={tuple(k.split('|')):v for k,v in json.load(open(D+'/yprof.json',encoding='utf-8')).items()}
AREA_NAME={'yama':'야마','variants':'야마 변형','ty':'티야','off':'탈야'}
ART=re.compile(r'<article class="qcard[^"]*"[^>]*id="([^"]+)">.*?</article>',re.S)

# ---- 주제별 교수(상위 details.prof) ----
topic_prof={}
for m in re.finditer(r'<details class="prof"><summary>(.*?)</summary>(.*?)(?=<details class="prof">|</main>)',s,re.S):
  for t in re.findall(r'<details class="topic" id="(topic-\d+)"',m.group(2)): topic_prof[t]=m.group(1)

def yama_key(meta):
  m=re.search(r'야마 (\d{4}) (객|주)(\d+)',meta); p=re.search(r'학습지 ([\d–]+)',meta)
  return (m.group(0) if m else None, p.group(1) if p else None)

# 변형 카드 → 원본 야마 카드의 교수 (중복 제거 전 전체 work.html 기준)
full=open(D+'/work.html',encoding='utf-8').read()
yama_by_key={}; yama_key_of={}
for m in ART.finditer(full):
  cid=m.group(1); t,area,q=re.match(r'(topic-\d+)-area-(\w+)-(q-\d+)',cid).groups()
  if area!='yama': continue
  meta=html.unescape(re.search(r'<div class="qmeta">(.*?)</div>',m.group(0)).group(1))
  k=yama_key(meta); yama_key_of[(t,q)]=k[0]
  if k[0] and (t,q) in yprof: yama_by_key.setdefault((t,k[0]),yprof[(t,q)])

def prof_of(cid,meta):
  t,area,q=re.match(r'(topic-\d+)-area-(\w+)-(q-\d+)',cid).groups()
  mf=re.search(r'· 출제 (\S+) 교수님',meta)
  if mf: return mf.group(1)
  if area=='yama' and (t,q) in yprof: return yprof[(t,q)]
  if area=='variants':
    k=yama_key(meta)
    if k[0]:
      if (t,k[0]) in yama_by_key: return yama_by_key[(t,k[0])]
    elif (t,q) in yprof: return yprof[(t,q)]   # 원본 번호 없는 변형 → 같은 순번 야마
  mt=re.search(r'· (\S+) 교수님 강조',meta)
  if mt: return mt.group(1)
  return topic_prof[t]

# ---- 1) 출제교수 태그 + 복습 표시 + 다시 풀기 ----
def card(m):
  x=m.group(0); cid=m.group(1)
  meta=html.unescape(re.search(r'<div class="qmeta">(.*?)</div>',x).group(1))
  pr=prof_of(cid,meta)
  tag=f'<span class="prof-tag">출제 {html.escape(pr.replace(", "," · "))} 교수님</span>'
  x=x.replace('<div class="qmeta">',f'<div class="qmeta">{tag}',1)
  f=f'{cid}-f'
  x=re.sub(r'<input (class="(?:choice-input|multi-input|reveal-toggle)[^"]*")',rf'<input form="{f}" \1',x)
  x=x.replace('<textarea class="entry"',f'<textarea form="{f}" class="entry"')
  mk=(f'<form id="{f}" class="qform"></form><div class="mark"><span class="mark-t">복습 표시</span>'
      +''.join(f'<input class="mk mk-{k}" type="radio" name="mk-{cid}" id="{cid}-mk-{k}" value="{k}"/><label for="{cid}-mk-{k}" class="mk-l mk-l-{k}">{lab}</label>'
               for k,lab in [('o','⭕ 맞음'),('q','🟡 헷갈림'),('x','❌ 틀림'),('n','지우기')])
      +f'<button type="reset" form="{f}" class="redo">↺ 다시 풀기</button></div>')
  i=x.rfind('<div class="nav">'); x=x[:i]+mk+x[i:]
  return x
s=ART.sub(card,s)

# ---- 2) 연도 내림차순 정렬(야마·야마 변형) + 번호 다시 매기기 ----
def year_of(x):
  if '🤍형성평가' in x: return 99999
  meta=re.search(r'<div class="qmeta">((?:<span[^>]*>.*?</span>)*)(.*?)</div>',x).group(2)
  meta=re.sub(r'^[^·]*· \d+/\d+ · ','',html.unescape(meta))
  y=re.search(r'(20\d\d|19\d\d)',meta)
  return int(y.group(1)) if y else -1
def renumber(sec,sec_id,label,sort):
  q0=sec.index('<div class="questions">')+len('<div class="questions">'); q1=sec.index('</div><a class="reset-area')
  arts=[m.group(0) for m in ART.finditer(sec[q0:q1])]
  if sort: arts=sorted(arts,key=lambda x:-year_of(x))
  N=len(arts)
  tmp=[]
  for i,x in enumerate(arts,1):
    old=re.search(r'id="([^"]+)">',x).group(1); x=x.replace(old+'"','@@NEW@@"').replace(old+'-','@@NEW@@-').replace('#'+old,'#@@NEW@@'); tmp.append(x)
  out=[]
  for i,x in enumerate(tmp,1):
    nid=f'{sec_id}-q-{i:03d}'; x=x.replace('@@NEW@@',nid)
    x=re.sub(r'data-qcard="\d+"',f'data-qcard="{i-1}"',x,1)
    x=re.sub(r'class="qcard( multi)?( active)?"',lambda m:f'class="qcard{m.group(1) or ""}{" active" if i==1 else ""}"',x,1)
    x=re.sub(r'(<div class="qmeta">(?:<span[^>]*>.*?</span>)*'+re.escape(label)+r' · )\d+/\d+',lambda m:f'{m.group(1)}{i}/{N}',x,1)
    nav='<div class="nav">'+(f'<a href="#{sec_id}-q-{i-1:03d}">← 이전</a>' if i>1 else '')+(f'<a href="#{sec_id}-q-{i+1:03d}">다음 →</a>' if i<N else '')+'</div>'
    x=re.sub(r'<div class="nav">.*?</div>',nav,x,1,flags=re.S)
    out.append(x)
  jump='<div class="jump">'+''.join(f'<a class="{"active" if i==1 else ""}" href="#{sec_id}-q-{i:03d}">{i}</a>' for i in range(1,N+1))+'</div>'
  sec=re.sub(r'<div class="jump">.*?</div>',jump,sec,1,flags=re.S)
  q0=sec.index('<div class="questions">')+len('<div class="questions">'); q1=sec.index('</div><a class="reset-area')
  sec=sec[:q0]+''.join(out)+sec[q1:]
  sec=re.sub(r'(<a class="reset-area reset" href="#)[^"]+',rf'\g<1>{sec_id}-q-001',sec,1)
  return sec,N
def fix_sections(s):
  out=[];pos=0
  for m in re.finditer(r'<section class="area[^"]*" data-area-section="(\w+)" id="([^"]+)">.*?</section>',s,re.S):
    area,sid=m.groups(); sec=m.group(0)
    sec,N=renumber(sec,sid,AREA_NAME[area],area in('yama','variants'))
    out.append(s[pos:m.start()]); out.append(sec); pos=m.end()
  out.append(s[pos:]); return ''.join(out)
s=fix_sections(s)

# ---- 복습 표시 저장 키 고정: 형성평가 삽입으로 밀린 야마 번호를 원래(v8) 번호로 저장 ----
def stable_keys(s):
  out=[];pos=0
  for m in re.finditer(r'<section class="area[^"]*" data-area-section="(yama|variants)" id="([^"]+)">.*?</section>',s,re.S):
    sid=m.group(2); sec=m.group(0); arts=list(ART.finditer(sec))
    k=sum(1 for a in arts if '🤍형성평가' in a.group(0))
    new=sec; 
    for i,a in enumerate(arts,1):
      x=a.group(0); cid=a.group(1)
      if '🤍형성평가' in x:
        mv=re.search(r'형성평가 (\d+)번 변형 (\d)',x)
        if mv: key=f'mk-fhv-{mv.group(1)}-{mv.group(2)}'
        else: key='mk-fh-'+re.search(r'형성평가 (\d+)번',x).group(1)
      else: key=f'mk-{sid}-q-{i-k:03d}'
      y=x.replace(f'name="mk-{cid}"',f'name="mk-{cid}" data-k="{key}"')
      new=new.replace(x,y,1)
    out.append(s[pos:m.start()]); out.append(new); pos=m.end()
  out.append(s[pos:]); return ''.join(out)
s=stable_keys(s)
# 탭 숫자 갱신
for m in re.finditer(r'<section class="area[^"]*" data-area-section="(\w+)" id="([^"]+)">(.*?)</section>',s,re.S):
  n=len(ART.findall(m.group(3)))
  s=re.sub(r'(<a class="[^"]*" href="#'+m.group(2)+r'">'+AREA_NAME[m.group(1)]+r' )\d+',lambda k:k.group(1)+str(n),s,1)

# ---- 3) 주제별 복습 모드 토글 ----
def topic_open(m):
  t=m.group(1)
  return (m.group(0)+f'<div class="review-bar"><input class="review-toggle" type="checkbox" id="{t}-review"/>'
          f'<label class="review-btn" for="{t}-review"><span class="rv-off">🔁 헷갈림·틀림만 다시 풀기</span><span class="rv-on">← 전체 문제로 돌아가기</span></label>'
          f'<span class="review-count" data-topic="{t}"></span></div><div class="review-empty">이 주제에서 🟡 헷갈림·❌ 틀림으로 표시한 문제가 아직 없어요. 문제를 풀고 아래 "복습 표시"를 눌러 두세요.</div>')
s=re.sub(r'<details class="topic" id="(topic-\d+)"><summary>.*?</summary>',topic_open,s,flags=re.S)

# ---- 4) CSS ----
ids=[m.group(1) for m in ART.finditer(s)]
cur=',\n'.join(f'.area:has(#{c}:target) .jump a[href="#{c}"]' for c in ids)
mo=',\n'.join(f'.area:has(#{c}-mk-o:checked) .jump a[href="#{c}"]' for c in ids)
mq=',\n'.join(f'.area:has(#{c}-mk-q:checked) .jump a[href="#{c}"]' for c in ids)
mx=',\n'.join(f'.area:has(#{c}-mk-x:checked) .jump a[href="#{c}"]' for c in ids)
tabcss=[]
for t in re.findall(r'<details class="topic" id="(topic-\d+)"',s):
  for a in AREA_NAME:
    A=f'{t}-area-{a}'
    tabcss.append(f'.topic:has(#{A}:target) > .tabs a[href="#{A}"],.topic:has(#{A} .qcard:target) > .tabs a[href="#{A}"]')
tabsel=',\n'.join(tabcss)
css=f'''
.topic:has(> .area:target) > .tabs a.active,.topic:has(> .area .qcard:target) > .tabs a.active{{background:#fff;color:inherit}}
{tabsel}{{background:#5a3daa!important;color:#fff!important;border-color:#5a3daa!important}}
.king-tag{{display:inline-block;background:#f5b400;color:#3b2a00;border-radius:999px;padding:2px 9px;margin-right:6px;font-size:12px;font-weight:800}}
.ai-est{{background:#eef6ff;border:1px solid #9cc3ee;border-radius:10px;padding:10px 12px;margin-bottom:12px;white-space:normal}}
/* v5: 출제교수 · 번호판 색 · 복습 표시 */
.prof-tag{{display:inline-block;background:#5a3daa;color:#fff;border-radius:999px;padding:2px 9px;margin-right:6px;font-size:12px;font-weight:700}}
.jump a{{min-width:40px;text-align:center}}
{mo}{{background:#e6f6ea!important;border-color:#62b37a!important}}
{mq}{{background:#fff4cc!important;border-color:#e0b43a!important}}
{mx}{{background:#fde6e6!important;border-color:#d05a5a!important}}
.jump a.active{{outline:3px solid #5a3daa;outline-offset:-1px;font-weight:800}}
.area:has(.qcard:target) .jump a.active{{outline:none;font-weight:400;background:#fff;border-color:#d7d1ea}}
{cur}{{outline:3px solid #5a3daa!important;outline-offset:-1px;font-weight:800!important}}
.mark{{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:16px 0 4px;padding-top:12px;border-top:1px dashed #d7d1ea}}
.mark-t{{font-size:13px;color:#6b6480;margin-right:4px}}
.mk{{position:absolute;opacity:0;pointer-events:none}}
.mk-l{{border:1px solid #d7d1ea;border-radius:999px;padding:6px 11px;cursor:pointer;font-size:14px;background:#fff}}
.mk-l-n{{color:#8a8499;font-size:12px}}
.mk-o:checked+.mk-l{{background:#e6f6ea;border-color:#62b37a;font-weight:700}}
.mk-q:checked+.mk-l{{background:#fff4cc;border-color:#e0b43a;font-weight:700}}
.mk-x:checked+.mk-l{{background:#fde6e6;border-color:#d05a5a;font-weight:700}}
.redo{{margin-left:auto;border:1px solid #d7d1ea;background:#fff;border-radius:10px;padding:6px 11px;font:inherit;font-size:13px;cursor:pointer}}
.qform{{display:none}}
.review-bar{{display:flex;align-items:center;gap:10px;margin:10px 0 4px}}
.review-toggle{{position:absolute;opacity:0;pointer-events:none}}
.review-btn{{border:1px solid #e0b43a;background:#fffaf0;border-radius:10px;padding:8px 12px;cursor:pointer;font-weight:700}}
.review-btn .rv-on{{display:none}}
.review-count{{font-size:13px;color:#6b6480}}
.review-empty{{display:none;background:#fff7df;border:1px solid #e2c66f;border-radius:10px;padding:10px;margin:8px 0}}
.topic:has(.review-toggle:checked) .review-btn{{background:#5a3daa;color:#fff;border-color:#5a3daa}}
.topic:has(.review-toggle:checked) .review-btn .rv-on{{display:inline}}
.topic:has(.review-toggle:checked) .review-btn .rv-off{{display:none}}
.topic:has(.review-toggle:checked) > .tabs,
.topic:has(.review-toggle:checked) .jump,
.topic:has(.review-toggle:checked) .reset-area,
.topic:has(.review-toggle:checked) .qcard .nav{{display:none!important}}
.topic:has(.review-toggle:checked) > .area{{display:block!important}}
.topic:has(.review-toggle:checked) .qcard{{display:none!important}}
.topic:has(.review-toggle:checked) .qcard:has(.mk-q:checked),
.topic:has(.review-toggle:checked) .qcard:has(.mk-x:checked){{display:block!important;margin-bottom:14px}}
.topic:has(.review-toggle:checked) > .area:not(:has(.mk-q:checked)):not(:has(.mk-x:checked)){{display:none!important}}
.topic:has(.review-toggle:checked) > .area::before{{display:block;font-weight:800;color:#5a3daa;margin:14px 0 6px}}
.topic:has(.review-toggle:checked) > .area[data-area-section="yama"]::before{{content:"야마"}}
.topic:has(.review-toggle:checked) > .area[data-area-section="variants"]::before{{content:"야마 변형"}}
.topic:has(.review-toggle:checked) > .area[data-area-section="ty"]::before{{content:"티야"}}
.topic:has(.review-toggle:checked) > .area[data-area-section="off"]::before{{content:"탈야"}}
.topic:has(.review-toggle:checked):not(:has(.mk-q:checked)):not(:has(.mk-x:checked)) > .review-empty{{display:block}}
'''
i=s.rfind('</style>'); s=s[:i]+css+s[i:]

# ---- 5) 복습 표시 저장(자바스크립트가 되는 환경에서만; 없어도 앱은 동작) ----
js='''<script>
(function(){var K='neuro2-app-marks-v1',st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
function save(){try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}
function count(){document.querySelectorAll('.review-count').forEach(function(el){var t=el.getAttribute('data-topic');var n=document.querySelectorAll('#'+t+' .mk-q:checked, #'+t+' .mk-x:checked').length;el.textContent=n?('복습 대상 '+n+'문항'):''})}
function key(el){return el.getAttribute('data-k')||el.name}
document.querySelectorAll('input.mk').forEach(function(el){var v=st[key(el)];if(v&&el.value===v)el.checked=true});
document.addEventListener('change',function(e){var t=e.target;if(t.classList&&t.classList.contains('mk')){var k=key(t);if(t.value==='n')delete st[k];else st[k]=t.value;save();count()}});
count();})();
</script>'''
s=s.replace('</body>',js+'</body>',1)
open(D+'/final.html','w',encoding='utf-8').write(s)
print('cards',len(ids),'size',len(s)/1e6)
