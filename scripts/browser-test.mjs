/**
 * Browser test harness for the portfolio (dev-only, not shipped).
 * Uses the system Chrome via playwright-core.
 *
 * Usage: node scripts/browser-test.mjs
 */
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, 'docs', 'shots')
fs.mkdirSync(outDir, { recursive: true })

const BASE = 'http://localhost:4173'
const results = { pages: [], interactions: {} }

const browser = await chromium.launch({ channel: 'chrome', headless: true })
console.log('launched chrome')

async function newPage({ width, height, reducedMotion = 'no-preference' }) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 300))
  })
  page.on('pageerror', (e) => errors.push(`PAGEERROR: ${String(e.message).slice(0, 300)}`))
  return { ctx, page, errors }
}

async function shotSet(name, { width, height, reducedMotion, fullPage = true }) {
  const { ctx, page, errors } = await newPage({ width, height, reducedMotion })
  await page.goto(BASE, { waitUntil: 'load' })
  // Preloader (real readiness, capped) + intro
  await page.waitForTimeout(reducedMotion === 'reduce' ? 1500 : 7200)
  await page.screenshot({ path: path.join(outDir, `${name}-hero.png`) })
  if (fullPage) {
    // Scroll through the page like a user so scroll-reveals fire and lazy
    // images load, then return to the top for the full-page capture.
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel(0, 850)
      await page.waitForTimeout(130)
      const atBottom = await page.evaluate(
        () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 12,
      )
      if (atBottom) break
    }
    await page.waitForTimeout(600)
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel(0, -950)
      await page.waitForTimeout(70)
      const atTop = await page.evaluate(() => window.scrollY < 16)
      if (atTop) break
    }
    await page.waitForTimeout(700)
    await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true })
  }
  results.pages.push({ name, width, height, reducedMotion, errors })
  await ctx.close()
  console.log('shot', name, errors.length ? `ERRORS: ${errors.join(' | ')}` : 'no console errors')
}

/**
 * Lenis smooths wheel input and animates toward its own target, so native
 * scrollTo jumps get overridden. Scroll like a real user: wheel events until
 * the section sits near the top of the viewport.
 */
async function wheelToSection(page, id) {
  for (let i = 0; i < 50; i++) {
    const delta = await page.evaluate((sel) => {
      const el = document.getElementById(sel)
      if (!el) return 0
      return el.getBoundingClientRect().top - 64
    }, id)
    if (Math.abs(delta) < 28) return
    await page.mouse.wheel(0, delta > 0 ? Math.min(delta + 40, 900) : Math.max(delta - 40, -900))
    await page.waitForTimeout(200)
  }
}

/* ---------------- viewport matrix ---------------- */
await shotSet('desktop-1920', { width: 1920, height: 1080 })
await shotSet('desktop-1440', { width: 1440, height: 900 })
await shotSet('laptop-1280', { width: 1280, height: 800 })
await shotSet('tablet-768', { width: 768, height: 1024 })
await shotSet('mobile-390', { width: 390, height: 844 })
await shotSet('mobile-360', { width: 360, height: 740 })
await shotSet('reduced-motion-1440', { width: 1440, height: 900, reducedMotion: 'reduce' })

/* ---------------- interactions on one live page ---------------- */
{
  const { ctx, page, errors } = await newPage({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(5800)

  // 1. Sticky projects — scroll into the middle of the stack (visual check)
  await wheelToSection(page, 'projects')
  await page.waitForTimeout(600)
  for (let i = 0; i < 2; i++) {
    await page.mouse.wheel(0, 850)
    await page.waitForTimeout(260)
  }
  await page.screenshot({ path: path.join(outDir, 'ix-projects-sticky.png') })

  // 2. Case study overlay — wheel back up to the first sticky panel so its
  //    controls are the topmost clickable layer
  for (let i = 0; i < 10; i++) {
    const offset = await page.evaluate(() => {
      const first = document.querySelector('[data-stack-panel]')
      return first ? first.getBoundingClientRect().top - 4 : 0
    })
    if (Math.abs(offset) < 20) break
    await page.mouse.wheel(0, Math.max(offset - 40, -900))
    await page.waitForTimeout(200)
  }
  await page.waitForTimeout(600)
  // Real-user clickability evidence: is the button the topmost element at its centre?
  results.interactions.caseStudyButtonTopmost = await page.evaluate(() => {
    const btn = document.querySelector('[data-stack-panel] button[aria-label^="Open the case study"]')
    if (!btn) return 'BUTTON NOT FOUND'
    const r = btn.getBoundingClientRect()
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return top === btn || btn.contains(top) ? 'YES' : `NO (${top?.tagName})`
  })
  await page
    .locator('[data-stack-panel]')
    .first()
    .getByRole('button', { name: /open the case study for/i })
    .click({ timeout: 6000, force: true }) // Lenis fights Playwright's internal scrolling; hit-test proven above
  await page.waitForTimeout(1400)
  let overlayOpen = await page.evaluate(
    () => !!document.querySelector('[aria-label^="Case study:"]'),
  )
  results.interactions.caseStudyOpenedByClick = overlayOpen
  if (!overlayOpen) {
    // Fall back to the shared-URL path — same overlay component
    await page.goto(`${BASE}/#project/code-quality-platform`, { waitUntil: 'load' })
    await page.waitForTimeout(4500)
    overlayOpen = await page.evaluate(
      () => !!document.querySelector('[aria-label^="Case study:"]'),
    )
    results.interactions.caseStudyOpenedByHash = overlayOpen
  }
  await page.screenshot({ path: path.join(outDir, 'ix-case-study.png') })
  // architecture step 2
  const stepBtn = page.locator('[aria-label="Architecture steps"] button').nth(1)
  if (await stepBtn.count()) await stepBtn.click().catch(() => {})
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(outDir, 'ix-case-study-step2.png') })
  // hash check
  results.interactions.caseStudyHash = await page.evaluate(() => window.location.hash)
  // prev/next navigation
  await page.locator('nav[aria-label="More projects"] button').nth(1).click()
  await page.waitForTimeout(1200)
  results.interactions.caseStudyAfterNext = await page.evaluate(() => window.location.hash)
  // Escape closes
  await page.keyboard.press('Escape')
  await page.waitForTimeout(900)
  results.interactions.caseStudyClosed = await page.evaluate(
    () => !document.querySelector('[aria-label^="Case study:"]'),
  )

  // 3. Command palette
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(outDir, 'ix-palette.png') })
  await page.keyboard.type('resume')
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(outDir, 'ix-palette-filtered.png') })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // 4. Recruiter view
  await page.getByRole('button', { name: 'Recruiter view' }).click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, 'ix-recruiter.png') })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // 5. Skill constellation selection
  await wheelToSection(page, 'expertise')
  await page.waitForTimeout(900)
  await page.locator('#expertise').getByRole('button', { name: 'SQL', exact: true }).first().click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(outDir, 'ix-constellation.png') })
  results.interactions.constellationPanel = await page
    .locator('#expertise [aria-live="polite"]')
    .innerText()
    .catch(() => 'NOT FOUND')

  // 6. Theme toggle
  await page.getByRole('button', { name: /Switch to the Ember theme/i }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: path.join(outDir, 'ix-theme-ember.png') })
  await page.getByRole('button', { name: /Switch to the Aurora theme/i }).click()

  // 7. Contact form — unconfigured endpoint path (must NOT fake success)
  await wheelToSection(page, 'contact')
  await page.waitForTimeout(800)
  await page.getByRole('textbox', { name: 'Name' }).fill('Test Visitor')
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Message' }).fill('Hello from the automated test.')
  await page.getByRole('button', { name: /send message/i }).click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(outDir, 'ix-contact-form.png') })
  results.interactions.contactFormMessage = await page
    .locator('#contact [aria-live="polite"]')
    .innerText()
    .catch(() => 'NOT FOUND')

  // 8. Deep link refresh (hash survives reload)
  await page.goto(`${BASE}/#project/code-quality-platform`, { waitUntil: 'load' })
  await page.waitForTimeout(4500)
  results.interactions.deepLinkOverlayOpen = await page.evaluate(
    () => !!document.querySelector('[aria-label^="Case study:"]'),
  )
  await page.screenshot({ path: path.join(outDir, 'ix-deep-link.png') })

  // 9. Mobile menu
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(4500)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, 'ix-mobile-menu.png') })
  await page.getByRole('button', { name: 'Close menu' }).click()
  await page.waitForTimeout(600)

  results.interactions.consoleErrors = errors
  await ctx.close()
  console.log('interactions done', errors.length ? `ERRORS: ${errors.join(' | ')}` : 'no console errors')
}

await browser.close()
fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2))
console.log('WROTE results.json')
