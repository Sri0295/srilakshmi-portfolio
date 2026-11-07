# Srilakshmi S — Developer Portfolio

A soft-pink editorial-minimalist portfolio built with **React 19 + TypeScript + Vite + Tailwind CSS v4**, subtle **GSAP + ScrollTrigger + Lenis** motion, and a strict **content-verification system** so nothing unverified is ever published as fact.

**Read [`CONTENT_AUDIT.md`](./CONTENT_AUDIT.md) first** — it records every content decision, including the Nov 2026 redesign and the published internship/certificates.

---

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build (dist/)
npm run preview    # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc -b
npm run assets     # regenerate the OG social image (requires `npm i -D sharp`)
```

> The QA harness (`scripts/qa-palette-form.mjs`) uses `playwright-core` with the system
> Chrome: `npm i -D --no-save playwright-core`, run `npm run preview`, then
> `node scripts/qa-palette-form.mjs`. Formspree responses are mocked except where noted.

---

## Design system — Soft Pink Editorial Minimalism

Single cohesive light theme (no dark-mode toggle). Tokens live in `src/styles/tokens.css`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFF9F7` | off-white page background |
| `--bg-deep` | `#F6DCE3` | baby pink bands |
| `--surface` | `#FFFFFF` | content cards |
| `--surface-2` | `#FBECEF` | soft blush |
| `--brand` | `#D895A7` | dusty rose — important interactions |
| `--coral` | `#AD647C` | deep rose — CTAs & key accents |
| `--ink` | `#514047` | warm dark brown text |
| `--ink-muted` | `#897B80` | secondary text |
| `--line` | `#EAD9DF` | soft borders |

Native browser cursor (the custom cursor system was removed by owner request); no moving
marquee; static editorial skills section; one profile photograph (hero only) at
`public/images/profile/srilakshmi-profile.jpg`.

### Typography

| Family | Variable source | Use |
|---|---|---|
| **Archivo** | `@fontsource-variable/archivo` (wght 400–900) | headings, hero name, section & project titles |
| **DM Sans** | `@fontsource-variable/dm-sans` (wght 200–1000) | body, descriptions, buttons, navigation, UI |
| **IBM Plex Mono** | `@fontsource/ibm-plex-mono` (static 400/500/600 — no variable exists) | section numbers, dates, metadata, technical labels |

All three are self-hosted through Fontsource (no Google Fonts request at runtime), loaded once in
`src/main.tsx`, and mapped to the shared tokens `--ff-display` / `--ff-body` / `--ff-mono` in
`src/styles/tokens.css` with system fallback stacks.

---

## Owner configuration — the one file to know

**`src/data/site.ts`**

| Setting | Purpose |
|---|---|
| `url` | Canonical domain — update after first deploy (also `index.html`, `public/robots.txt`, `public/sitemap.xml`) |
| `availability` | The “Open to opportunities” badge text/state |
| `contactForm.endpoint` | Live Formspree endpoint (`https://formspree.io/f/mrppvpjn`) |

The phone number is intentionally absent from the entire site (owner decision).

---

## Publishing gated content

### Metrics — `src/data/contentVerification.ts`
Ten résumé-reported numbers (92% accuracy, 20,000 samples, r = 0.83, …) stay `unverified` and
render nowhere. Flip `status: 'verified'` + add `methodology` to publish them as animated
highlights / case-study results. (The four internship responsibility points were approved
verbatim by the owner and appear in the timeline.)

### Experience — `src/data/experience.ts`
Doosan Bobcat (Data Analytics Intern, Jun–Sep 2025) is published with owner-approved content.
TVS Motors remains a draft (`publish: false`) until confirmed.

### Certificates — `src/data/certifications.ts`
All four credentials are backed by owner-supplied PDFs in `public/certificates/`, with issue
dates and verification links exactly as printed on the certificates. Add a new entry (id, title,
issuer, issueDate, credentialUrl, pdf, verified) to extend the gallery — no component changes
needed. Cards without a PDF show no preview rather than a fabricated one.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

After the first deploy: update the domain in `site.ts`, `index.html`, `public/robots.txt`,
`public/sitemap.xml`; attach a custom domain if desired.

---

## Feature map

| Feature | Where |
|---|---|
| Preloader (real readiness, skip button, rose curtain) | `components/preloader/Preloader.tsx` |
| Hero — SRILAKSHMI reveal, single editorial portrait | `sections/Hero.tsx` |
| Editorial about (no second photo) | `sections/About.tsx` |
| Verification-gated highlight counters | `sections/Highlights.tsx` |
| Experience timeline (published entries only) | `sections/Timeline.tsx` |
| Static editorial expertise grid | `sections/Expertise.tsx` + `data/skills.ts` |
| Sticky project cards + real screenshots | `sections/Projects.tsx`, `components/projects/ProjectVisual.tsx` |
| Case studies + architecture explorer | `components/projects/CaseStudyOverlay.tsx` |
| Certificate gallery (PDFs + verification links) | `sections/Certifications.tsx` + `data/certifications.ts` |
| Recruiter Quick View (print-friendly) | `components/recruiter-view/RecruiterView.tsx` |
| Command palette Ctrl/Cmd+K | `components/command-palette/CommandPalette.tsx` + `data/commands.ts` |
| Section progress navigator | `components/ui/ScrollProgress.tsx` |
| Formspree contact form | `sections/Contact.tsx` + `data/site.ts` |

## Accessibility & resilience

- All reveal-hidden states are applied **by GSAP at runtime** — content is fully visible without
  JavaScript, and `prefers-reduced-motion` skips the preloader, parallax and all scroll
  choreography.
- Keyboard: skip link, focus-visible rings, Escape closes every overlay, palette is fully
  arrow/enter driven with focus restoration, Ctrl+K never hijacks form typing.
- Print stylesheet force-reveals everything.
- QA (Nov 2026): zero console errors, zero horizontal overflow at
  1920/1440/1280/1024/768/430/390/360 px, palette navigation 6/6, Enter/arrow/Escape verified,
  résumé download verified, Formspree success/error/retry/duplicate-guard verified with mocked
  responses plus one live confirmed submission.

## Project structure

```
src/
  components/   animation, navigation, preloader, projects,
                command-palette, recruiter-view, ui (buttons, count-up, icons…)
  sections/     Hero, About, Highlights, Timeline, Expertise, Projects,
                Education, Certifications, Contact
  data/         profile, site, projects, experience, education,
                certifications, skills, highlights, contentVerification, commands
  hooks/        useReducedMotion, useMediaQuery, useActiveSection
  lib/          gsap setup, Lenis-aware scroll helper
  styles/       tokens.css (single light theme), globals.css
scripts/        optimize-images.mjs (OG image), qa-palette-form.mjs (Playwright)
public/         images (profile photo, project screenshots, og.png),
                certificates (4 PDFs), resume PDF, favicon, robots, sitemap
```
