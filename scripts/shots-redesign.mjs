import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:4173', { waitUntil: 'load' })
await page.waitForTimeout(7200)
await page.screenshot({ path: 'docs/shots/redesign-hero.png' })
for (let i = 0; i < 60; i++) {
  await page.mouse.wheel(0, 850)
  await page.waitForTimeout(120)
  if (await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 12)) break
}
await page.waitForTimeout(800)
for (let i = 0; i < 60; i++) {
  await page.mouse.wheel(0, -950)
  await page.waitForTimeout(60)
  if (await page.evaluate(() => window.scrollY < 16)) break
}
await page.waitForTimeout(600)
await page.screenshot({ path: 'docs/shots/redesign-full.png', fullPage: true })
await browser.close()
