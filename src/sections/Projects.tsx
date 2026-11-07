import { useRef } from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import { gsap, useGSAP } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import ProjectVisual from '../components/projects/ProjectVisual'
import { projects, type Project } from '../data/projects'

const ACCENT_TEXT: Record<Project['accent'], string> = {
  brand: 'text-coral',
  coral: 'text-coral',
  aqua: 'text-coral',
  peach: 'text-coral',
}

const ACCENT_GLOW: Record<Project['accent'], string> = {
  brand: 'from-brand/10 via-transparent',
  coral: 'from-brand/10 via-transparent',
  aqua: 'from-brand/10 via-transparent',
  peach: 'from-brand/10 via-transparent',
}

function ProjectLinks({
  project,
  onOpenProject,
  compact,
}: {
  project: Project
  onOpenProject: (slug: string) => void
  compact?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onOpenProject(project.slug)}
        className={`btn btn-primary ${compact ? '!px-5 !py-2.5 text-sm' : ''}`}
        aria-label={`Open the case study for ${project.title}`}
      >
        Case study <ArrowUpRight size={15} aria-hidden="true" />
      </button>
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className={`btn btn-ghost ${compact ? '!px-5 !py-2.5 text-sm' : ''}`}
          aria-label={`${project.title} source code on GitHub`}
        >
          <GithubIcon size={16} /> GitHub
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          className={`btn btn-ghost ${compact ? '!px-5 !py-2.5 text-sm' : ''}`}
          aria-label={`${project.title} live demo (opens in a new tab)`}
          title={project.demoNote}
        >
          <ExternalLink size={15} aria-hidden="true" /> Live demo
        </a>
      )}
    </div>
  )
}

function ProjectCardBody({
  project,
  onOpenProject,
  featured,
}: {
  project: Project
  onOpenProject: (slug: string) => void
  featured?: boolean
}) {
  return (
    <article className="card group relative flex h-full flex-col justify-center overflow-hidden p-7 md:p-10 xl:p-12">
      <div aria-hidden="true" className={`absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-br ${ACCENT_GLOW[project.accent]} to-transparent blur-2xl`} />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`font-display text-5xl font-bold tracking-tight md:text-6xl ${ACCENT_TEXT[project.accent]}`}>
              {project.num}
            </span>
            {featured && (
              <span className="rounded-full border border-lime/50 px-3 py-1 font-mono text-[0.62rem] tracking-[0.2em] text-lime uppercase">
                Featured build
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight font-bold tracking-tight">
            {project.title}
          </h3>
          <p className={`mt-1.5 font-mono text-[0.7rem] tracking-[0.22em] uppercase ${ACCENT_TEXT[project.accent]}`}>
            {project.category}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-[0.95rem]">{project.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
            {project.tech.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <ProjectLinks project={project} onOpenProject={onOpenProject} compact />
          </div>
        </div>
        <ProjectVisual project={project} />
      </div>
    </article>
  )
}

interface Props {
  onOpenProject: (slug: string) => void
}

/** Selected projects — sticky stacked panels on desktop, vertical list on mobile. */
export default function Projects({ onOpenProject }: Props) {
  const stackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  /* Sticky-stack depth effect */
  useGSAP(
    () => {
      if (reduced || !isDesktop) return
      const panels = gsap.utils.toArray<HTMLElement>('[data-stack-panel]', stackRef.current)
      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return
        const next = panels[i + 1]
        gsap.to(panel.querySelector('article'), {
          scale: 0.93,
          opacity: 0.45,
          y: -24,
          transformOrigin: 'center top',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
        })
      })
    },
    { scope: stackRef, dependencies: [isDesktop] },
  )

  return (
    <section id="projects" aria-label="Selected projects" className="relative">
      <div className="container-site">
        <SectionHeading
          num="06"
          eyebrow="Selected work"
          title={
            <>
              BUILT &amp; <span className="text-gradient">SHIPPED.</span>
            </>
          }
          lead="Four end-to-end builds across machine learning, computer vision and data analytics — each with its architecture documented, links verified, and results published only once re-verified."
        />
      </div>

      {/* Desktop — sticky stacked panels */}
      <div ref={stackRef} className="mt-16 hidden lg:block">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-stack-panel
            className="sticky top-0 flex h-screen items-center py-10"
            style={{ zIndex: i + 1 }}
          >
            <div className="container-site w-full">
              <ProjectCardBody project={project} onOpenProject={onOpenProject} featured={i === 0} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile / tablet — readable vertical flow */}
      <div className="container-site mt-14 space-y-8 lg:hidden">
        {projects.map((project, i) => (
          <Reveal key={project.slug}>
            <ProjectCardBody project={project} onOpenProject={onOpenProject} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
