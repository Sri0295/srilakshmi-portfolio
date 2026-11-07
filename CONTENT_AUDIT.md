# CONTENT AUDIT — Srilakshmi S Portfolio

> **Redesign (Nov 7, 2026):** the visual identity changed from dark vibrant violet to **soft
> pink editorial minimalism** (single light theme, no dark toggle). Removed: custom cursor,
> moving tech marquee, skill constellation, grid easter egg, the second profile photo, floating
> tech labels, the outlined “S.”, and the HSC/SSLC school history. Added: certificate gallery
> with the four owner-supplied PDFs (dates + verification links as printed), the new profile
> photograph (`public/images/profile/srilakshmi-profile.jpg`), and the corrected hero name
> (SRILAKSHMI only). All functional systems (palette, recruiter view, case studies, Formspree)
> were preserved and re-verified after the redesign.

Built from two supplied résumés:

| Source | File | Character |
|---|---|---|
| Résumé v1 (original) | `MY resume (1).pdf` → `docs/source-resumes/resume-v1-original.pdf` | One-page, visual, older |
| Résumé v2 (detailed) | `SRILAKSHMI S (2).pdf` → `docs/source-resumes/resume-v2-detailed.pdf` | Three-page, bullet-heavy, newer; published as the downloadable résumé |

> **Update (Nov 2026):** the owner approved and published the Doosan Bobcat internship,
> added Django as a skill, supplied real project screenshots, removed the phone number
> and the Languages/soft-skills section. Details below.

---

## 1. Confirmed, non-conflicting content (published)

- Name, email `deekshud881@gmail.com`, LinkedIn, GitHub `@Sri0295`
  - **Phone number removed from the entire site by owner request (Nov 2026)** — no `tel:` links, no JSON-LD telephone, no UI references. The résumé PDF still contains it (unchanged, per instructions).
- B.E. Computer Science Engineering, PMC Tech Hosur, 2022–2026, CGPA 8.0/10
- HSC GGHS Bagalur 2020–2022 (75%), SSLC GGHS Bagalur 2019–2020 (77%) — compact/collapsible
- Technical skills: Python, **Django (owner-confirmed, Nov 2026)**, SQL, Flask, REST APIs, HTML5, CSS3, JavaScript, Pandas, NumPy, XGBoost, CNN, OpenCV, Power BI, Excel, Git/GitHub, Roboflow, Render deployment, AWS (Cloud Architecting)
- Projects: Code Quality Platform, Diabetic Retinopathy Detection, Haar Cascade Face Detection, Sales Data Analysis
- Certifications: AWS Academy (Cloud Architecting), CS50P (Harvard), IBM Digital Badge (Data Science), Tata Data Visualization (Forage)
- Languages & professional strengths: **section removed entirely by owner request (Nov 2026)** — data fields deleted from `profile.ts`, section component deleted, navigation/progress renumbered (Contact is now section 09).

## 2. Experience

### Doosan Bobcat internship — PUBLISHED (corrected by owner, Nov 7 2026)

- **Full Stack Intern · Doosan Bobcat Pvt Ltd, Chennai · Jun 2025 – Sep 2025**
- Five owner-approved responsibility points (movie booking web application: HTML/CSS/JS,
  interactive features, responsive design, REST API/SDLC exposure, testing & documentation).
- Technology tags: HTML, CSS, JavaScript, REST APIs, Responsive Design.
- GitHub + "View Internship Project" both link to
  `https://github.com/Sri0295/movie-ticket-booking-website` (repo existence verified during the
  build; opens in a new tab).
- **The Nov 6 "Data Analytics Intern" version is fully superseded** — its summary,
  responsibilities (sales records, SQL, EDA/r = 0.83, Power BI) and tech tags were removed from
  the experience entry. The Sales Data Analysis project remains in the Projects section as a
  standalone case study (repo verified), now explicitly described as separate from the
  internship.
- History of the conflict: résumé v1 said "Full Stack Intern, Jun–Jul 2025, movie booking
  website"; résumé v2 said "Data Analytics Intern, Jun–Sep 2025, sales analytics". The owner's
  Nov 7 correction keeps the Full Stack title + movie website but adopts the v2 duration
  (Jun–Sep 2025).

### TVS Motors Trainee, Feb 2024 — still a draft (`publish: false`)

Present in v1 only. Confirm before setting `publish: true`.

## 3. Résumé-reported metrics — registry still gated

`src/data/contentVerification.ts` still holds all ten metrics with `status: 'unverified'`, so the
**Highlights** section and the case-study **Results** blocks do not render them. The four
internship responsibility points appear in the timeline because the owner explicitly approved that
text (Nov 2026). To surface the same numbers as animated highlights / case-study results, flip the
corresponding `status` fields and add a `methodology` note.

Self-evident highlights published: 3 core Python/ML projects, 4 certifications, 5-stage DR model design.

## 4. External link verification (checked during build, 2026-11-06)

| Link | Status |
|---|---|
| `https://new-sri.onrender.com` | ✅ LIVE (HTTP 200; title “SENTINEL AI — Predictive Code Analysis”; ~58 s free-tier cold start) |
| `https://github.com/Sri0295` | ✅ exists — repos: NEW_SRI, Sales-Data-Analysis, movie-ticket-booking-website, lbp-cascade, Python-Backend-Development-Journal |
| `https://github.com/Sri0295/NEW_SRI` | ✅ matches the code-quality platform (Flask + XGBoost) → linked |
| `https://github.com/Sri0295/Sales-Data-Analysis` | ✅ exists → linked (project + internship) |
| `https://github.com/Sri0295/lbp-cascade` | ⚠️ LBP cascade (not Haar) → deliberately **not** linked to the Haar project |
| LinkedIn URL | not independently checkable (auth wall); taken verbatim from both résumés |

## 5. Project images (updated Nov 2026)

| Project | Image | Source |
|---|---|---|
| Code Quality Platform | `public/images/projects/code-quality-platform.jpg` (313×149) | Owner-supplied app screenshot (SENTINEL AI) |
| Diabetic Retinopathy | `public/images/projects/diabetic-retinopathy.jpg` (447×257) | Owner-supplied fundus stage grid (`OIP.jpg`) — **note: filename suggests a web-downloaded dataset illustration; confirm usage rights or replace with own model output** |
| Haar Cascades | `public/images/projects/haar-cascades.jpg` (398×398) | Owner-supplied night-vision detection screenshot (`fine_tuned_detection.jpg`) |
| Sales Data Analysis | stylised placeholder (labelled on-screen) | none supplied yet |

## 6. Remaining decisions required from the owner

1. **TVS Motors** — confirm to publish.
2. **Metric verification** (§3) if the numbers should appear in Highlights/case-study Results.
3. **DR image rights** (§5).
4. **Certificate credential URLs/IDs and dates** — still not supplied; cards render without links rather than fabricating them.
5. ~~Contact form endpoint~~ — **done (Nov 2026)**: live Formspree endpoint `https://formspree.io/f/mrppvpjn` integrated in `src/data/site.ts`; verified with a single labelled test submission (HTTP 200).
6. **Canonical domain** — `site.ts`, `index.html`, `robots.txt`, `sitemap.xml` still use the placeholder `https://srilakshmi-s-portfolio.vercel.app`.
