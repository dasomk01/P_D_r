# 형성평가 정리본: fq_fh.py(원문) → fh_summary.html / 형성평가_정리본.pdf (A4 2단)
import os,sys,html,base64,json
D=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,D)
from fq_fh import FQ
from yimg_ent import IMG
Q={t[1]:t for m in FQ.values() for t in m}
# (교수님 – 주제, [(키, 제목, 출처)])
G=[('이은정 교수님 – 귀의 발생과 구조 (11/3 5교시)',[('fh1104-01','이관의 기능','11/4 4교시 중간평가 1번'),('fh1104-07','고실 내 약물이 흡수되는 막','11/4 4교시 중간평가 7번')]),
 ('이은정 교수님 – 청각기관의 구조와 기능·청력검사 (11/3 6교시)',[('fh1104-03','후미로 병변·신생아 확진 검사','11/4 4교시 중간평가 3번'),('fh1104-05','객관적 청력검사가 아닌 것','11/4 4교시 중간평가 5번'),('fh1104-04','순음청력도로 난청 유형 판단','11/4 4교시 중간평가 4번')]),
 ('이은정 교수님 – 전정계의 해부와 생리 (11/4 1교시)',[('fh1104-06','병변 측을 알 수 있는 전정검사','11/4 4교시 중간평가 6번')]),
 ('이은정 교수님 – 급성·삼출성·만성 중이염 (11/4 2–3교시)',[('fh1104-02','소아 삼출성 중이염의 치료','11/4 4교시 중간평가 2번'),('fh1104-10','소아 급성 중이염의 1차 항생제','11/4 4교시 중간평가 10번'),('fh1104-08','건성 천공 만성 중이염의 치료','11/4 4교시 중간평가 8번'),('fh1104-09','상고실 병변의 진단','11/4 4교시 중간평가 9번')]),
 ('여차동 교수님 – 내이질환: 돌발성 난청 (11/4 5교시)',[('fh1105-2','돌발성 난청 증례','11/5 1교시 형성평가 2번')]),
 ('여차동 교수님 – 난청의 조기진단 (11/4 6교시)',[('fh1105-3','외유모세포에서 생기는 검사','11/5 1교시 형성평가 3번'),('fh1105-4','신생아 청각선별 1-3-6','11/5 1교시 형성평가 4번')]),
 ('여차동 교수님 – 전정질환 (11/4 6교시)',[('fh1105-1','청력저하가 없는 급성 어지럼','11/5 1교시 형성평가 1번')])]
NUM='①②③④⑤'
def short(t):
  b=t[5].split('. ',1)[-1] if t[5].startswith('중간평가 원문') or t[5].startswith('형성평가 원문') else t[5]
  import re
  return re.sub(r'(?<![가-힣] )(?<!동 )교수님',' 여차동 교수님',b).replace('  ',' ').strip()
def img(k):
  out=''
  for f in IMG.get(k,[]):
    p=os.path.join(D,f); b64=base64.b64encode(open(p,'rb').read()).decode()
    out+=f'<img src="data:image/jpeg;base64,{b64}">'
  return out
h=['<!doctype html><html><head><meta charset="utf-8"><title>이과 형성평가 정리본</title><style>',
'@page{size:A4;margin:10mm 10mm}body{font-family:"Noto Sans CJK KR","Noto Sans KR",sans-serif;font-size:8.7pt;line-height:1.34;color:#111;margin:0}',
'h1{font-size:15pt;margin:0 0 2mm}.sub{color:#555;font-size:8.5pt;margin-bottom:3mm}.cols{column-count:2;column-gap:7mm;column-fill:auto}',
'h2{font-size:10.5pt;margin:2mm 0 1.5mm;padding:1mm 2mm;background:#eef2f8;border-left:3px solid #3a5ba0;break-after:avoid}',
'.q{break-inside:avoid;margin:0 0 3mm;padding-bottom:2mm;border-bottom:1px dashed #bbb}.t{font-weight:700}.src{color:#3a5ba0;font-size:8pt}',
'.stem{margin:1mm 0}.ch{margin:0;padding-left:1mm}.ch div{margin:.3mm 0}.ans{margin-top:1mm;font-weight:700;color:#0a6b47}.ex{color:#333;font-size:8.6pt}',
'img{max-width:100%;max-height:44mm;display:block;margin:1mm 0}table{border-collapse:collapse;width:100%;font-size:7.8pt;break-inside:avoid}td,th{border:1px solid #999;padding:.3mm 1mm;text-align:left;vertical-align:top}td:nth-child(1){width:7%;text-align:center}td:nth-child(2){width:11%;white-space:nowrap}td:nth-child(3){width:40%}th{background:#eef2f8}',
'</style></head><body><h1>이비인후과(이과) 형성평가 정리본</h1><div class="sub">11/4 4교시 중간평가 10문항 + 11/5 1교시 형성평가 4문항 · 교수님–주제는 수업 순서(11/4 중간평가는 여차동 교수님이 냈지만 이은정 교수님 수업 범위 문항은 그 수업에 묶음) · 문제·선지 원문 그대로 · 수업 중 국시 기출 슬라이드는 이과 수업에 없었음</div><div class="cols">']
rows=[]; n=0
for g,items in G:
  h.append(f'<h2>{html.escape(g)}</h2>')
  for k,title,src in items:
    t=Q[k]; n+=1; ch=t[3]; a=t[4]
    h.append(f'<div class="q"><div class="t">{n}. {html.escape(title)} <span class="src">· {src}</span></div><div class="stem">{html.escape(t[2]).replace(chr(10),"<br>")}</div>{img(k)}<div class="ch">'+''.join(f'<div>{NUM[i]} {html.escape(c)}</div>' for i,c in enumerate(ch))+f'</div><div class="ans"><b>정답 {NUM[a-1]} {html.escape(ch[a-1])}</b></div><div class="ex">{html.escape(short(t))}</div></div>')
    rows.append((n,g.split(' 교수님')[0],title,f'{NUM[a-1]} {ch[a-1][:18]}'+('…' if len(ch[a-1])>18 else '')))
h.append('<h2>정답 한눈표</h2><table><tr><th>번호</th><th>교수</th><th>문제 제목</th><th>정답</th></tr>'+''.join(f'<tr><td>{a}</td><td>{c}</td><td>{html.escape(b)}</td><td>{html.escape(d)}</td></tr>' for a,c,b,d in rows)+'</table></div></body></html>')
open(os.path.join(D,'fh_summary.html'),'w').write(''.join(h))
json.dump([dict(g=g,items=[dict(k=k,title=ti,src=s) for k,ti,s in it]) for g,it in G],open(os.path.join(D,'fh_groups.json'),'w'),ensure_ascii=False)
print('ok',n)
