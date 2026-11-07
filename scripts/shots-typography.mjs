import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errs = []
for (const [w, h, name] of [[1440, 900, 'type-desktop'], [390, 844, 'type-mobile']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)))
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)))
  await page.goto('http://localhost:4173', { waitUntil: 'load' })
  await page.waitForTimeout(7200)
  await page.screenshot({ path: `docs/shots/${name}-hero.png` })
  // clip check: hero name box vs its content, and horizontal overflow
  const check = await page.evaluate(() => {
    const line = document.querySelector('#hero h1 span.block')
    const chars = line.querySelectorAll('.ss-char')
    const lineRect = line.getBoundingClientRect()
    let clipped = false
    chars.forEach((c) => {
      const r = c.getBoundingClientRect()
      if (r.right > lineRect.right + 2 || r.left < lineRect.left - 2) clipped = true
    })
    const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family)
    return {
      clipped,
      lineWidth: Math.round(lineRect.width),
      fontsLoaded: [...new Set(fonts)],
      hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }
  })
  console.log(name, JSON.stringify(check))
  await page.close()
}
console.log('pageerrors:', errs.length ? errs : 'none')
await browser.close()
