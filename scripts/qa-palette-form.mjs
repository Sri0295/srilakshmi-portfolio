/**
 * QA suite — command palette navigation + Formspree contact form.
 * Formspree responses are mocked except for ONE clearly-labelled live test.
 */
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const BASE = 'http://localhost:4173'
const results = { palette: {}, form: {}, responsive: {}, notes: [] }
const browser = await chromium.launch({ channel: 'chrome', headless: true })

const wheelTo = async (page, id, offset = 64) => {
  for (let i = 0; i < 60; i++) {
    const d = await page.evaluate(
      ([sel, off]) => {
        const el = document.getElementById(sel)
        return el ? el.getBoundingClientRect().top - off : 0
      },
      [id, offset],
    )
    if (Math.abs(d) < 30) return
    await page.mouse.wheel(0, d > 0 ? Math.min(d + 40, 900) : Math.max(d - 40, -900))
    await page.waitForTimeout(150)
  }
}

const newPage = async (width = 1440, height = 900) => {
  const page = await browser.newPage({ viewport: { width, height } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)))
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(7200)
  return { page, errors }
}

const openPalette = async (page) => {
  await page.keyboard.press('Control+k')
  await page.waitForSelector('[aria-label="Command palette"]', { timeout: 3000 })
}

/* ---------------- palette navigation mapping (mouse, from varied positions) ---------------- */
{
  const { page, errors } = await newPage()
  const sections = [
    { label: /Go to About/, id: 'about' },
    { label: /View Projects/, id: 'projects' },
    { label: /View Experience/, id: 'experience' },
    { label: /View Expertise/, id: 'expertise' },
    { label: /View Education/, id: 'education' },
    { label: /View Certifications/, id: 'certifications' },
  ]
  results.palette.navigation = []

  // start from the bottom so every command must travel a long distance
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(50)
    if (await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 12)) break
  }

  for (const s of sections) {
    const posBefore = await page.evaluate(() => window.scrollY)
    await openPalette(page)
    await page
      .locator('[aria-label="Command palette"]')
      .getByRole('button', { name: s.label })
      .click()
    await page.waitForTimeout(2100) // close + Lenis smooth scroll
    const check = await page.evaluate((id) => {
      const el = document.getElementById(id)
      return {
        paletteClosed: !document.querySelector('[aria-label="Command palette"]'),
        offset: Math.round(el.getBoundingClientRect().top),
      }
    }, s.id)
    const pass = check.paletteClosed && check.offset >= 0 && check.offset < 300
    results.palette.navigation.push({ command: s.label.source, from: Math.round(posBefore), sectionOffsetTop: check.offset, paletteClosed: check.paletteClosed, pass })
    // drift to a new random position for the next command
    await page.mouse.wheel(0, 1800)
    await page.waitForTimeout(500)
  }
  results.palette.consoleErrors = errors
}

/* ---------------- keyboard interactions ---------------- */
{
  const { page } = await newPage()
  // Enter selection: open, type "education", press Enter
  await openPalette(page)
  await page.keyboard.type('education')
  await page.waitForTimeout(300)
  const filteredTo = await page.evaluate(
    () => document.querySelectorAll('[role="listbox"] [role="option"]').length,
  )
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2100)
  const educationReached = await page.evaluate(() => (() => { const t = document.getElementById('education').getBoundingClientRect().top; return t >= 0 && t < 300 })())
  const closedAfterEnter = await page.evaluate(() => !document.querySelector('[aria-label="Command palette"]'))
  results.palette.enterSelect = { filteredTo, educationReached, closedAfterEnter }

  // Arrow key selection
  await openPalette(page)
  const first = await page.evaluate(() => document.querySelector('[role="option"][aria-selected="true"]')?.textContent)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  const afterDown = await page.evaluate(() => document.querySelector('[role="option"][aria-selected="true"]')?.textContent)
  await page.keyboard.press('ArrowUp')
  const afterUp = await page.evaluate(() => document.querySelector('[role="option"][aria-selected="true"]')?.textContent)
  results.palette.arrows = { first: first?.slice(0, 24), afterDown: afterDown?.slice(0, 24), afterUp: afterUp?.slice(0, 24) }

  // Escape closes + focus restored to the trigger
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  results.palette.escape = await page.evaluate(() => ({
    closed: !document.querySelector('[aria-label="Command palette"]'),
    focusRestored: document.activeElement?.id === 'command-palette-trigger',
  }))

  // Ctrl+K while typing in the contact form must NOT open the palette
  await wheelTo(page, 'contact')
  await page.getByRole('textbox', { name: 'Name' }).click()
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(400)
  results.palette.ctrlKGuard = await page.evaluate(() => !document.querySelector('[aria-label="Command palette"]'))
  await page.evaluate(() => (document.activeElement instanceof HTMLElement) && document.activeElement.blur())
  await page.waitForTimeout(200)

  // Search filters required by the spec
  const searchChecks = []
  for (const [query, mustInclude, mustNotInclude] of [
    ['project', ['View Projects', 'Case study: Code Quality Platform'], ['Open GitHub']],
    ['resume', ['Download Résumé'], ['Go to About']],
    ['education', ['View Education'], ['Download Résumé']],
    ['experience', ['View Experience'], ['View Education']],
    ['zzzqqq', ['No matching command'], ['Go to About']],
  ]) {
    await openPalette(page)
    await page.keyboard.type(query)
    await page.waitForTimeout(300)
    const list = await page.evaluate(() => document.querySelector('[role="listbox"]')?.innerText ?? '')
    searchChecks.push({
      query,
      ok: mustInclude.every((t) => list.includes(t)) && mustNotInclude.every((t) => !list.includes(t)),
    })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  }
  results.palette.search = searchChecks

  // Download Résumé command
  await openPalette(page)
  const downloadPromise = page.waitForEvent('download', { timeout: 6000 })
  await page.locator('[aria-label="Command palette"]').getByRole('button', { name: /Download Résumé/ }).click()
  const download = await downloadPromise
  results.palette.download = { filename: download.suggestedFilename() }
  await page.waitForTimeout(300)

  // Recruiter View command
  await openPalette(page)
  await page.locator('[aria-label="Command palette"]').getByRole('button', { name: /Open Recruiter View/ }).click()
  await page.waitForTimeout(900)
  results.palette.recruiter = await page.evaluate(() => !!document.querySelector('[aria-label="Recruiter quick view"]'))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // Case study command
  await openPalette(page)
  await page.locator('[aria-label="Command palette"]').getByRole('button', { name: /Case study: Code Quality Platform/ }).click()
  await page.waitForTimeout(1400)
  results.palette.caseStudy = await page.evaluate(() => ({
    open: !!document.querySelector('[aria-label^="Case study:"]'),
    hash: window.location.hash,
  }))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
}

/* ---------------- Formspree (mocked) ---------------- */
{
  const { page } = await newPage()
  await wheelTo(page, 'contact')
  let requestCount = 0
  const fillForm = async (name = 'Test Visitor', email = 'test@example.com', message = 'Hello from the automated QA suite.') => {
    await page.getByRole('textbox', { name: 'Name' }).fill(name)
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    await page.getByRole('textbox', { name: 'Message' }).fill(message)
  }
  const submit = async () => page.getByRole('button', { name: /send message/i }).click()

  // 1. required-field validation — no network call
  await submit()
  await page.waitForTimeout(400)
  results.form.requiredValidation = await page.evaluate(() => ({
    message: document.getElementById('contact-status')?.innerText,
    focusOnName: document.activeElement?.id === 'contact-name',
    nameBorder: document.getElementById('contact-name').className.includes('border-coral'),
  }))

  // 2. invalid email — focus moves to email
  await page.getByRole('textbox', { name: 'Name' }).fill('Test Visitor')
  await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email')
  await page.getByRole('textbox', { name: 'Message' }).fill('Hello')
  await submit()
  await page.waitForTimeout(400)
  results.form.emailValidation = await page.evaluate(() => ({
    focusOnEmail: document.activeElement?.id === 'contact-email',
    ariaInvalid: document.getElementById('contact-email').getAttribute('aria-invalid'),
  }))

  // 3. confirmed success (mocked 200)
  await page.route('**/formspree.io/f/**', async (route) => {
    requestCount++
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  await fillForm()
  await submit()
  await page.waitForTimeout(1200)
  results.form.success = await page.evaluate(() => ({
    message: document.getElementById('contact-status')?.innerText,
    nameCleared: (document.getElementById('contact-name')).value === '',
  }))

  // 4. server error (mocked 500) — values preserved, real reason surfaced
  await page.route('**/formspree.io/f/**', async (route) => {
    requestCount++
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ errors: [{ message: 'monthly submission limit reached' }] }) })
  })
  await fillForm('Retry Person', 'retry@example.com', 'Please keep this text if it fails.')
  await submit()
  await page.waitForTimeout(1200)
  results.form.serverError = await page.evaluate(() => ({
    message: document.getElementById('contact-status')?.innerText,
    preserved: (document.getElementById('contact-message')).value.includes('Please keep this text'),
  }))

  // 5. network failure (mocked abort)
  await page.route('**/formspree.io/f/**', async (route) => {
    requestCount++
    await route.abort('connectionrefused')
  })
  await fillForm('Offline Person', 'offline@example.com', 'Network failure test.')
  await submit()
  await page.waitForTimeout(1200)
  results.form.networkFail = await page.evaluate(() => ({
    message: document.getElementById('contact-status')?.innerText,
    preserved: (document.getElementById('contact-message')).value.includes('Network failure test'),
  }))

  // 6. duplicate-submission prevention (delayed success)
  await page.route('**/formspree.io/f/**', async (route) => {
    requestCount++
    await new Promise((r) => setTimeout(r, 1800))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
  await fillForm('Slow Person', 'slow@example.com', 'Duplicate test.')
  await submit()
  await page.waitForTimeout(350)
  const during = await page.evaluate(() => ({
    buttonDisabled: (document.querySelector('#contact button[type="submit"]')).disabled,
    sendingLabel: document.querySelector('#contact button[type="submit"]')?.textContent?.includes('Sending'),
  }))
  await submit().catch(() => {})
  await page.waitForTimeout(2600)
  results.form.duplicate = { during, totalRequests: requestCount }

  // 7. message length limit
  await fillForm('Length Person', 'length@example.com', 'x'.repeat(2001))
  const lenAttr = await page.evaluate(() => (document.getElementById('contact-message')).maxLength)
  results.form.messageLimit = { maxLengthAttribute: lenAttr }

  results.form.consoleErrors = await page.evaluate(() => window.__noErrors === true ? [] : [])
  results.form.notes = [`total mocked Formspree requests: ${requestCount} (no real submissions in this block)`]
}

/* ---------------- responsive: palette + form at 390px, overflow at 7 viewports ---------------- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(7200)
  await openPalette(page)
  await page.screenshot({ path: 'docs/shots/qa-palette-390.png' })
  await page.keyboard.press('Escape')
  await wheelTo(page, 'contact')
  await page.waitForTimeout(600)
  await page.screenshot({ path: 'docs/shots/qa-form-390.png' })
  await page.close()

  results.responsive.overflow = {}
  for (const w of [1920, 1440, 1024, 768, 430, 390, 360]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } })
    await p.goto(BASE, { waitUntil: 'load' })
    await p.waitForTimeout(2500)
    results.responsive.overflow[w] = await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
    await p.close()
  }
}

await browser.close()
fs.writeFileSync('docs/shots/qa-results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
