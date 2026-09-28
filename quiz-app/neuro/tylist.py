import re,html,sys
s=open('work.html',encoding='utf-8').read()
for t in sys.argv[1:]:
  for cid,b in re.findall(r'<article class="qcard[^"]*"[^>]*id="('+t+r'-area-ty-q-\d+)">(.*?)</article>',s,re.S):
    st=html.unescape(re.search(r'<div class="stem">(.*?)</div>',b,re.S).group(1))
    m=html.unescape(re.search(r'<div class="qmeta">(.*?)</div>',b).group(1))
    print(cid[-5:],'|',m[:50],'|',st[:110])
