import sys,importlib,re,base64,html
D='/home/user/P_D_r/quiz-app/derm'; sys.path.insert(0,D); sys.path.insert(0,D+'/fh_doc')
from data import T
from yimg01 import IMG
Q={}
for m in ['qf0503','qf0504','qf0505','qf0602','qf0603','qf0604','qf0901','qf0902','qf1001','qf1002','qf1003','qf1004','qf1105','qf1204']:
  for t in importlib.import_module(m).Q: Q[t[1]]=t
C='①②③④⑤⑥⑦⑧'; E=html.escape
def ans(t): a=t[4]; return a if isinstance(a,list) else [a]
def img(f): return 'data:image/jpeg;base64,'+base64.b64encode(open(D+'/'+f,'rb').read()).decode()
b=[]; prof=None; top=None
for i,(p,tp,k,ti,d,ex) in enumerate(T,1):
  t=Q[k]
  if p!=prof: b.append('<h2>%s 교수님</h2>'%p); prof=p; top=None
  hd='<h3>%s</h3>'%E(tp) if tp!=top else ''; top=tp
  stem=re.sub(r'^(🤍|💜)형성평가(\(수업 퀴즈\))?\s*','',t[2])
  tag='💜 종합' if t[2].startswith('💜') else '🤍 수업 끝 퀴즈'
  photo=all(re.fullmatch(r'[①-⑧]\s*',c) for c in t[3])
  ch='' if photo else '<ol>'+''.join('<li><b>%s</b> %s</li>'%(C[j],E(c)) for j,c in enumerate(t[3]))+'</ol>'
  ims=''.join(('<img class="big" src="%s">' if k=='fh-1111-2' else '<img src="%s">')%img(f) for f in IMG.get(k,[])) if not (k=='fh-1111-3') else '<p class="m">(사진은 12번과 같음)</p>'
  a=''.join(C[x-1] for x in ans(t)); at=' · '.join(t[3][x-1].strip() for x in ans(t) if not photo)
  b.append('%s<div class="q"><div class="t"><span class="n">%d</span>%s</div><div class="m">%s · %s</div><p>%s</p>%s%s<div class="a"><b>정답 %s %s</b><br>%s</div></div>'%(hd,i,E(ti),tag,d,E(stem),ims,ch,a,E(at),E(ex)))
rows=''.join('<tr><td>%d</td><td>%s</td><td>%s</td><td><b>%s</b></td></tr>'%(i,p,E(ti),''.join(C[x-1] for x in ans(Q[k]))) for i,(p,tp,k,ti,d,ex) in enumerate(T,1))
H='''<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:10mm 9mm}
body{font-family:"Noto Sans CJK KR","Noto Sans KR",sans-serif;font-size:8.6pt;line-height:1.38;color:#111;margin:0}
h1{font-size:14pt;margin:0 0 2px}.sub{font-size:8pt;color:#555;margin-bottom:6px}
.cols{column-count:2;column-gap:6mm;column-fill:balance}
h2{font-size:11pt;margin:4px 0 3px;padding:2px 5px;background:#efe9fb;border-left:3px solid #7a5cc4;break-after:avoid}
h3{font-size:9.4pt;margin:5px 0 2px;color:#5a3fa8;break-after:avoid}
.q{break-inside:avoid;border:1px solid #ddd;border-radius:4px;padding:4px 6px;margin:0 0 5px}
.t{font-weight:700;font-size:9.2pt}.n{display:inline-block;min-width:16px;background:#333;color:#fff;border-radius:3px;text-align:center;margin-right:4px;font-size:8pt}
.m{color:#666;font-size:7.6pt}p{margin:2px 0}
ol{list-style:none;padding:0;margin:2px 0}li{margin:0}
img{max-width:100%;max-height:38mm;width:auto;display:block;margin:3px auto}img.big{max-height:72mm}
.a{background:#f2f8f2;border-left:3px solid #3a9a4a;padding:2px 5px;margin-top:3px;font-size:8.2pt}
.ans{break-inside:avoid}table{border-collapse:collapse;width:100%;font-size:8pt}td,th{border:1px solid #ccc;padding:1px 4px}th{background:#eee}td:nth-child(1),td:nth-child(2),td:nth-child(4),th{white-space:nowrap}
</style></head><body><h1>피부과 형성평가 정리본</h1><div class="sub">23문항 · 🤍 수업 끝 퀴즈 18 · 💜 11/9 종합 형성평가 5 · 🏥 국시 기출 0 · 교수님·주제별 · 2026-11-21</div>
<div class="cols">'''+''.join(b)+'<div class="ans"><h2>정답표</h2><table><tr><th>번호</th><th>교수</th><th>문제 제목</th><th>정답</th></tr>'+rows+'</table></div></div></body></html>'
open(D+'/fh_doc/fh.html','w').write(H)
