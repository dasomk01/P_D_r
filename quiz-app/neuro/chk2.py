from playwright.sync_api import sync_playwright
import re
with sync_playwright() as p:
  b=p.chromium.launch(executable_path=__import__('glob').glob('/opt/pw-browsers/chromium*/chrome-linux/chrome')[0])
  pg=b.new_page(viewport={'width':420,'height':900})
  pg.goto('file:///home/user/P_D_r/quiz-app/neuro/neuro-app.html')
  el=pg.locator('#topic-014-area-ty-q-030')
  art=el
  cid=art.get_attribute('id'); print(cid)
  pg.evaluate(f"location.hash='#{cid}'")
  pg.wait_for_timeout(500)
  art.locator('label.choice').nth(1).click()
  pg.wait_for_timeout(300)
  art.screenshot(path='ty.png')
  b.close()
