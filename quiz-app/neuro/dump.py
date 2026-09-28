import sys,re,html
s=open(sys.argv[1],encoding='utf-8').read(); topic=sys.argv[2]
for cid,b in re.findall(r'<article class="qcard[^"]*"[^>]*id="(%s-area-yama-q-\d+)">(.*?)</article>'%topic,s,re.S):
  g=lambda p:(re.search(p,b,re.S).group(1) if re.search(p,b,re.S) else '')
  meta=html.unescape(g(r'<div class="qmeta">(.*?)</div>'))
  stem=html.unescape(g(r'<div class="stem">(.*?)</div>')).replace('\n',' ')
  ch=[html.unescape(x) for x in re.findall(r'<label class="choice"[^>]*>(.*?)</label>',b,re.S)]
  ent='class="entry"' in b
  ans=html.unescape(g(r'제공 정답: ([^\n<]*)'))
  flags=('[제외]' if '채점 제외' in b or '자동채점 제외' in b else '')+('[범위외]' if '수업범위 외' in b else '')+('[시각]' if 'class="visual"' in b else '')
  print(f"{cid[-5:]} {meta.split('·',2)[-1].strip()} {flags}\n  S: {stem[:150]}{'…' if len(stem)>150 else ''}")
  if ent: print('  [주관식] A:',ans[:80])
  else: print('  C:',' | '.join(c[:45] for c in ch),'\n  A:',ans[:60])
