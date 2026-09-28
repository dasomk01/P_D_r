import sys
from playwright.sync_api import sync_playwright
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  pg=b.new_page(viewport={'width':430,'height':1400},device_scale_factor=1)
  for cid,acts,out in [('topic-020-area-yama-q-003',['opt-2'],'s1.png'),('topic-020-area-yama-q-012',['opt-2','opt-3','reveal'],'s2.png'),('topic-020-area-yama-q-010',['opt-1'],'s3.png')]:
    pg.goto('file://'+f+'#'+cid)
    pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
    pg.goto('file://'+f+'#'+cid)
    pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
    for a in acts: pg.click(f'label[for="{cid}-{a}"]')
    pg.locator('#'+cid).screenshot(path=out)
  b.close()
