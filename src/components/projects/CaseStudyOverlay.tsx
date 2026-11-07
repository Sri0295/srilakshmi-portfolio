import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, Info, ShieldQuestion, X } from 'lucide-react'
import { GithubIcon } from '../ui/BrandIcons'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { getProject, projects } from '../../data/projects'
import { metrics } from '../../data/contentVerification'
import ArchitectureExplorer from './ArchitectureExplorer'
import ProjectVisual from './ProjectVisual'

interface Props {
  slug: string
  onClose: () => void
  onNavigate: (slug: string) => void
}

/**
 * Full-screen case study panel. Opens over the page with its own scroll
 * (data-lenis-prevent), Escape to close, focus restore, and prev/next nav.
 */
export default function CaseStudyOverlay({ slug, onClose, onNavigate }: Props) {
  const project = getProject(slug)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)
  const reduced = prefersReducedMotion()

  const requestClose = () => {
    if (closing) return
    setClosing(true)
    if (reduced) {
      onClose()
      return
    }
    gsap.to(rootRef.current, {
      yPercent: 8,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  /* Entrance + focus management */
  useGSAP(
    () => {
      if (reduced) return
      gsap.fromTo(
        rootRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'expo.inOut' },
      )
      gsap.fromTo(
        rootRef.current?.querySelectorAll('.cs-reveal') ?? [],
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, delay: 0.45, ease: 'power3.out' },
      )
    },
    { dependencies: [] },
  )

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!project) return null

  const index = projects.findIndex((p) => p.slug === slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  const publishedMetrics = project.metricIds
    .map((id) => metrics[id])
    .filter((m) => m.status === 'verified')

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${project.title}`}
      className="fixed inset-0 z-[115] overflow-y-auto bg-bg"
      data-lenis-prevent
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="container-site flex h-16 items-center justify-between">
          <p className="font-mono text-[0.7rem] tracking-[0.28em] text-faint uppercase">
            Case study <span className="text-brand">{project.num}</span> / {String(projects.length).padStart(2, '0')}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-coral hover:text-coral"
            aria-label="Close case study"
            data-cursor="Close"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Keyed by slug so content re-animates on prev/next navigation */}
      <div key={slug} className="container-site max-w-4xl pt-12 pb-20">
        <p className="cs-reveal font-mono text-[0.72rem] tracking-[0.26em] uppercase text-aqua">{project.category}</p>
        <h2 className="cs-reveal mt-3 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] leading-tight font-bold tracking-tight">
          {project.title}
        </h2>
        <p className="cs-reveal mt-4 max-w-2xl text-muted">{project.tagline}</p>

        <div className="cs-reveal mt-8">
          <ProjectVisual project={project} />
        </div>

        <div className="cs-reveal mt-8 flex flex-wrap gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost !px-5 !py-2.5 text-sm" data-cursor="GitHub">
              <GithubIcon size={15} /> Source code
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-ghost !px-5 !py-2.5 text-sm" data-cursor="Live demo" title={project.demoNote}>
              <ExternalLink size={15} aria-hidden="true" /> Live demo
            </a>
          )}
          {!project.github && !project.demo && (
            <p className="font-mono text-xs text-faint">Repository / deployment links pending owner confirmation.</p>
          )}
        </div>

        {project.contextNote && (
          <p className="cs-reveal mt-8 flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-surface/50 p-4 text-xs leading-relaxed text-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-aqua" aria-hidden="true" />
            {project.contextNote}
          </p>
        )}

        <section className="cs-reveal mt-10" aria-label="Overview">
          <h3 className="font-display text-2xl font-semibold">Overview</h3>
          <p className="mt-3 leading-relaxed text-muted">{project.overview}</p>
        </section>

        <section className="cs-reveal mt-10" aria-label="Key engineering contributions">
          <h3 className="font-display text-2xl font-semibold">Key contributions</h3>
          <ol className="mt-4 space-y-3">
            {project.contributions.map((c, i) => (
              <li key={c.slice(0, 24)} className="flex gap-4">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-relaxed text-muted">{c}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="cs-reveal mt-10" aria-label="Technology stack">
          <h3 className="font-display text-2xl font-semibold">Stack</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="cs-reveal mt-10" aria-label="Architecture walkthrough">
          <h3 className="font-display text-2xl font-semibold">How it works</h3>
          <p className="mt-2 mb-5 text-sm text-faint">
            Select a stage of the pipeline to read what happens at that point.
          </p>
          <ArchitectureExplorer key={slug} project={project} />
        </section>

        <section className="cs-reveal mt-10" aria-label="Results">
          <h3 className="font-display text-2xl font-semibold">Results</h3>
          {publishedMetrics.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {publishedMetrics.map((m) => (
                <div key={m.id} className="card p-6">
                  <p className="font-display text-4xl font-bold text-gradient">{m.display}</p>
                  <p className="mt-2 text-sm font-medium">{m.label}</p>
                  <p className="mt-1 text-xs text-faint">{m.context}</p>
                  {m.methodology && <p className="mt-3 border-l-2 border-line pl-3 text-xs text-muted">{m.methodology}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 flex items-start gap-3 rounded-xl border border-dashed border-line bg-surface/50 p-5 text-sm leading-relaxed text-muted">
              <ShieldQuestion size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
              Performance numbers for this project are reported in the résumé but are withheld here until they are
              re-verified against the project's actual results (dataset, test split and evaluation method). The
              architecture and contributions above describe exactly what was built.
            </p>
          )}
        </section>

        {/* Prev / next */}
        <nav className="cs-reveal mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2" aria-label="More projects">
          <button
            type="button"
            onClick={() => onNavigate(prev.slug)}
            className="card group flex items-center gap-4 p-5 text-left transition-colors hover:border-brand"
            data-cursor={`Previous: ${prev.shortTitle}`}
          >
            <ArrowLeft size={17} className="shrink-0 text-faint transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>
              <span className="block font-mono text-[0.62rem] tracking-[0.24em] text-faint uppercase">Previous</span>
              <span className="mt-0.5 block font-display text-base font-semibold">{prev.shortTitle}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="card group flex items-center justify-end gap-4 p-5 text-right transition-colors hover:border-coral"
            data-cursor={`Next: ${next.shortTitle}`}
          >
            <span>
              <span className="block font-mono text-[0.62rem] tracking-[0.24em] text-faint uppercase">Next</span>
              <span className="mt-0.5 block font-display text-base font-semibold">{next.shortTitle}</span>
            </span>
            <ArrowRight size={17} className="shrink-0 text-faint transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  )
}
