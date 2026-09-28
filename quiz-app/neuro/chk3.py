from playwright.sync_api import sync_playwright
import glob
with sync_playwright() as p:
  b=p.chromium.launch(executable_path=glob.glob('/opt/pw-browsers/chromium*/chrome-linux/chrome')[0])
  pg=b.new_page(); u='file://'+__import__('os').getcwd()+'/neuro-app.html'
  pg.goto(u); pg.evaluate("localStorage.setItem('neuro-app-marks-v5',JSON.stringify({'mk-topic-014-area-yama-q-001':'x'}))")
  pg.reload(); pg.wait_for_timeout(800)
  print('q003 x:',pg.evaluate("document.getElementById('topic-014-area-yama-q-003-mk-x').checked"),'q001 x:',pg.evaluate("document.getElementById('topic-014-area-yama-q-001-mk-x').checked"))
  pg.evaluate("document.querySelector('label[for=\"topic-014-area-yama-q-001-mk-o\"]').click()"); pg.wait_for_timeout(200)
  print(pg.evaluate("localStorage.getItem('neuro-app-marks-v5')"))
  b.close()
