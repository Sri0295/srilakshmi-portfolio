import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const reqs = []
page.on('request', (r) => r.url().includes('formspree') && reqs.push({ url: r.url(), method: r.method() }))
page.on('response', (r) => r.url().includes('formspree') && reqs.push({ status: r.status() }))
await page.goto('http://localhost:4173', { waitUntil: 'load' })
await page.waitForTimeout(7200)
for (let i = 0; i < 60; i++) {
  const d = await page.evaluate(() => {
    const el = document.getElementById('contact')
    return el ? el.getBoundingClientRect().top - 64 : 0
  })
  if (Math.abs(d) < 28) break
  await page.mouse.wheel(0, d > 0 ? Math.min(d + 40, 900) : Math.max(d - 40, -900))
  await page.waitForTimeout(150)
}
await page.waitForTimeout(800)
await page.getByRole('textbox', { name: 'Name' }).fill('Portfolio QA')
await page.getByRole('textbox', { name: 'Email' }).fill('portfolio-qa@example.com')
await page.getByRole('textbox', { name: 'Message' }).fill('One-time verification message sent while wiring up the portfolio contact form (Nov 2026). Safe to disregard — no reply needed.')
await page.getByRole('button', { name: /send message/i }).click()
await page.waitForTimeout(6000)
const state = await page.evaluate(() => ({
  status: document.getElementById('contact-status')?.innerText,
  cleared: (document.getElementById('contact-name')).value === '',
}))
await page.screenshot({ path: 'docs/shots/form-live-success.png' })
console.log(JSON.stringify({ requests: reqs, state }, null, 2))
await browser.close()
