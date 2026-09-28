import sys,re,html,collections,json
s=open(sys.argv[1],encoding='utf-8').read()
res=collections.defaultdict(list)
for cid,b in re.findall(r'<article class="qcard[^"]*"[^>]*id="([^"]+)">(.*?)</article>',s,re.S):
  area=re.search(r'area-([a-z]+)-q',cid).group(1)
  if area=='off': continue
  stem=html.unescape(re.search(r'<div class="stem">(.*?)</div>',b,re.S).group(1))
  vis='class="visual"' in b or '시각자료 소견' in b or '<img' in b
  ch=[html.unescape(x) for x in re.findall(r'<label class="choice"[^>]*>(.*?)</label>',b,re.S)]
  excl='자동 채점 제외' in b or '자동채점 제외' in b
  ans=re.search(r'제공 정답: ([^\n<]*)',b); ans=ans.group(1) if ans else ''
  if any(re.search(r'번은|번 그림|정답,|입니다\.?$|\[\d+쪽\]|교수님|복원자|선배',c) or len(c)>160 for c in ch): res['선지오염(해설/STT/강의록 조각)'].append(cid)
  if re.match(r'^[가-힣]{1,2}\s',stem) and not re.match(r'^(다음|각|위|이|두|한|세|어느|아래|환자|남자|여자|최근|정상|뇌|그림|표|것)',stem): res['문제 앞부분 잘림(의심)'].append(cid)
  if re.search(r'증례',stem) and len(stem)<60: res['증례 누락'].append(cid)
  if re.search(r'(다음|아래)\s*(표|그림|사진|대화|영상|MRI|CT|뇌파|EEG)',stem) and not vis: res['표/그림/대화 누락'].append(cid)
  if re.search(r'두\s*가지|모두 고르|2개',stem) and ch and not re.search(r'[,·]\s*\d|②,|, ?\d번',ans): res['복수정답인데 단일채점'].append(cid)
  if excl: res['채점 제외 표시'].append(cid)
  if ans.strip()=='' and area!='yama': res['정답 없음'].append(cid)
for k,v in res.items():
  by=collections.Counter(x.split('-area-')[1].split('-q')[0] for x in v)
  print(f'{k}: {len(v)}  {dict(by)}')
json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
