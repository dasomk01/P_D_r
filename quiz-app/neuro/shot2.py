import sys
from playwright.sync_api import sync_playwright
f=sys.argv[1]
cases=[('topic-023-area-yama-q-013',['opt-2'],'v1.png'),('topic-018-area-yama-q-044',['opt-2','opt-3','reveal'],'v2.png'),('topic-014-area-yama-q-021',['opt-3'],'v3.png'),('topic-026-area-yama-q-010',['opt-5'],'v4.png')]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  pg=b.new_page(viewport={'width':430,'height':1400})
  errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
  for cid,acts,out in cases:
    pg.goto('file://'+f+'#'+cid)
    pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
    pg.goto('file://'+f+'#'+cid)
    for a in acts: pg.click(f'label[for="{cid}-{a}"]')
    pg.locator('#'+cid).screenshot(path=out)
  print('errors',errs)
  b.close()
