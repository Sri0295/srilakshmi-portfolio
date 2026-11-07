# Srilakshmi S — Developer Portfolio

A vibrant, cinematic, single-page developer portfolio built with **React 19 + TypeScript + Vite + Tailwind CSS v4**, animated with **GSAP + ScrollTrigger + Lenis**, featuring a strict **content-verification system** so nothing unverified is ever published as fact.

**Read [`CONTENT_AUDIT.md`](./CONTENT_AUDIT.md) first** — it lists every conflicting résumé claim, every withheld metric, and the exact switch that publishes each one.

---

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build (dist/)
npm run preview    # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc -b
npm run assets     # regenerate optimized images + og.png (requires `npm i -D sharp`)
```

> The browser test harness (`scripts/browser-test.mjs`) uses `playwright-core` with the system
> Chrome; install with `npm i -D --no-save playwright-core` and run `node scripts/browser-test.mjs`
> while `npm run preview` is up.

---

## Owner configuration — the one file to know

**`src/data/site.ts`**

| Setting | Purpose |
|---|---|
| `url` | Canonical domain — update after first deploy (also update `index.html`, `public/robots.txt`, `public/sitemap.xml`) |
| `availability` | The “Open to opportunities” badge text/state |
| `contactForm.endpoint` | Paste your Formspree endpoint (see below) |

Profile facts (name, links, photo paths) live in `src/data/profile.ts`. The phone number is
intentionally removed from the entire site (owner decision, Nov 2026).

---

## Publishing withheld content (verification workflow)

### 1. Résumé-reported metrics — `src/data/contentVerification.ts`

Ten numbers (92% accuracy, 20,000 samples, 10,000+ records, r = 0.83, …) are stored with
`status: 'unverified'` and are **not rendered anywhere**. To publish one:

1. Re-derive it from the project’s real artefacts (notebook output, test logs, dashboard).
2. Fill in `methodology` (dataset, split, averaging method).
3. Flip `status: 'verified'`.

Verified metrics appear automatically: animated count-ups in **Highlights**, a **Results** grid in
the project case study.

### 2. Experience entries — `src/data/experience.ts`

The Doosan Bobcat internship (Data Analytics Intern, Jun 2025 – Sep 2025) is **published** with
owner-approved content (Nov 2026), including the four responsibility points and the GitHub link.
The TVS Motors trainee entry remains a draft (`publish: false`) until confirmed; the timeline
renders only `publish: true` entries plus education.

### 3. Project links & screenshots — `src/data/projects.ts`

- GitHub links exist for NEW_SRI (code platform) and Sales-Data-Analysis (verified during build).
- The DR / Haar projects have no verified repos — add `github` only when confirmed. Note:
  `github.com/Sri0295/lbp-cascade` is an **LBP** cascade project, deliberately not linked to the
  Haar one.
- Real screenshots (owner-supplied, Nov 2026) are wired in for the code-quality platform,
  diabetic-retinopathy and haar-cascades projects (`public/images/projects/`). Sales Data
  Analysis still uses a stylised, labelled placeholder — drop
  `public/images/projects/sales-data-analysis.jpg` in place and add the `image` field in
  `projects.ts` to replace it.

### 4. Contact form (Formspree)

The form is **live**: it POSTs (FormData + `Accept: application/json`) to the owner-supplied
endpoint configured in `site.contactForm.endpoint` and shows a success state only on a confirmed
`200` response. Errors surface Formspree's own reason, keep the visitor's text, and allow retry.
Includes required-field + email validation, a 2,000-character message limit, a honeypot field,
duplicate-submission prevention, and focus moves to the first invalid field.

To change the endpoint, edit `contactForm.endpoint` in `src/data/site.ts`.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

`vercel.json` pins the framework/build/output. After the first deploy:

1. Update the domain in `src/data/site.ts`, `index.html` (canonical + og:url), `public/robots.txt`, `public/sitemap.xml`.
2. Attach a custom domain in the Vercel dashboard if desired.
3. Configure the Formspree endpoint.

No environment variables, no secrets, no backend.

---

## Feature map

| Feature | Where |
|---|---|
| Cinematic preloader (real asset readiness, skip button, curtain exit) | `components/preloader/Preloader.tsx` |
| Character-by-character gradient hero reveal | `sections/Hero.tsx`, `.grad-chars` in `globals.css` |
| Technology marquee (verified tech only, hover-pause) | `sections/TechMarquee.tsx` |
| Verification-gated animated highlights | `sections/Highlights.tsx` + `data/highlights.ts` |
| Career timeline with publication gating | `sections/Timeline.tsx` + `data/experience.ts` |
| Four capability areas + **Skill Constellation** (Feature A) | `sections/Expertise.tsx`, `components/skills/SkillConstellation.tsx` |
| Sticky stacked projects (desktop) / vertical list (mobile) | `sections/Projects.tsx` |
| Case-study overlay + **Architecture Explorer** (Feature D) | `components/projects/CaseStudyOverlay.tsx`, `ArchitectureExplorer.tsx` — URL-hash deep links (`/#project/<slug>`) survive refresh |
| **Recruiter Quick View** (Feature B, print-friendly) | `components/recruiter-view/RecruiterView.tsx` |
| **Command palette** Ctrl/Cmd+K (Feature C, diacritic-insensitive) | `components/command-palette/CommandPalette.tsx` |
| Section progress navigator (Feature G) | `components/ui/ScrollProgress.tsx` |
| Design-grid easter egg — press **G** (Feature F) | `components/ui/GridOverlay.tsx` |
| Magnetic buttons, contextual cursor labels | `hooks/useMagnetic.ts`, `components/cursor/CustomCursor.tsx` |
| Two vibrant themes (Aurora ⇄ Ember) | `src/styles/tokens.css` (`[data-theme]`) |

## Accessibility & resilience notes

- All reveal-hidden states are applied **by GSAP at runtime** — with JavaScript off/failing, every
  section is fully visible; `prefers-reduced-motion` skips the preloader, cursor, parallax and all
  scroll choreography (verified by automated reduced-motion run).
- Keyboard: skip link, focus-visible rings, Escape closes every overlay, palette is fully
  arrow/enter driven, menu uses `aria-expanded`/`aria-controls`.
- Print stylesheet force-reveals everything (Recruiter View → Print works).
- Automated checks: zero console errors at 1920/1440/1280/768/390/360 px, zero horizontal overflow
  at all eight spec viewports, reduced-motion run clean. Screenshots: `docs/shots/`.

## Project structure

```
src/
  components/   animation, cursor, navigation, preloader, projects, skills,
                command-palette, recruiter-view, ui (buttons, count-up, icons…)
  sections/     Hero, TechMarquee, About, Highlights, Timeline, Expertise,
                Projects, Education, Certifications, Languages, Contact, Footer
  data/         profile, site, projects, experience, education, certifications,
                skills, highlights, contentVerification   ← single source of truth
  hooks/        useReducedMotion, useMediaQuery, useMagnetic, useActiveSection
  lib/          gsap setup, Lenis-aware scroll helper
  styles/       tokens.css (two themes), globals.css
scripts/        optimize-images.mjs (sharp), browser-test.mjs (playwright-core)
public/         images (owner photo, og.png), resume PDF, favicon, robots, sitemap
```
