from playwright.sync_api import sync_playwright
f='file:///home/user/P_D_r/quiz-app/neuro/final.html'
T='topic-012'; A=f'{T}-area-yama'
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
  pg=b.new_page(viewport={'width':430,'height':1000}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto(f); pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
  pg.goto(f+'#'+A+'-q-003')
  pg.click(f'label[for="{A}-q-003-opt-2"]'); pg.click(f'label[for="{A}-q-003-mk-x"]')
  pg.click(f'#{A}-q-003 .nav a:has-text("다음")')
  pg.click(f'label[for="{A}-q-004-mk-q"]')
  pg.click(f'#{A}-q-004 .nav a:has-text("다음")'); pg.click(f'label[for="{A}-q-005-mk-o"]')
  pg.locator(f'#{A} .jump').screenshot(path='j1.png')
  print('hl', pg.evaluate(f"getComputedStyle(document.querySelector('#{A} .jump a[href=\"#{A}-q-005\"]')).outlineStyle"), pg.evaluate(f"getComputedStyle(document.querySelector('#{A} .jump a[href=\"#{A}-q-001\"]')).outlineStyle"))
  pg.locator(f'#{A}-q-005').screenshot(path='c1.png')
  # 다시 풀기
  pg.goto(f+'#'+A+'-q-003'); pg.click(f'#{A}-q-003 .redo')
  print('after reset checked', pg.evaluate(f"document.querySelectorAll('#{A}-q-003 .choice-input:checked').length"), 'mark kept', pg.evaluate(f"document.querySelector('#{A}-q-003-mk-x').checked"))
  pg.click(f'label[for="{T}-review"]')
  vis=pg.evaluate(f"[...document.querySelectorAll('#{T} .qcard')].filter(e=>e.offsetParent).map(e=>e.id)")
  print('review visible',vis)
  pg.locator(f'#{T}').screenshot(path='r1.png')
  print(pg.evaluate("document.querySelector('.review-count[data-topic=\"topic-012\"]').textContent"))
  pg.reload(); print('persist', pg.evaluate(f"document.querySelector('#{A}-q-003-mk-x').checked"))
  print('errors',errs); b.close()
