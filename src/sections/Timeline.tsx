import { useRef } from 'react'
import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { education } from '../data/education'
import { publishedExperience } from '../data/experience'

type Accent = 'brand' | 'coral'

interface TimelineItem {
  id: string
  year: string
  period: string
  title: string
  org: string
  summary: string
  accent: Accent
  icon: 'education' | 'experience'
  responsibilities?: string[]
  tech?: string[]
  github?: string
  projectSlug?: string
}

const primary = education.find((e) => e.primary)!

/** Large timeline marker: just the year for experience spans. */
const yearOf = (period: string) => period.match(/20\d{2}/)?.[0] ?? period

function buildItems(): TimelineItem[] {
  const items: TimelineItem[] = []

  /* Published experience entries — newest first */
  for (const entry of publishedExperience) {
    items.push({
      id: entry.id,
      year: yearOf(entry.period),
      period: entry.period,
      title: entry.role,
      org: `${entry.org} · ${entry.location}`,
      summary: entry.summary,
      accent: 'coral',
      icon: 'experience',
      responsibilities: entry.responsibilities,
      tech: entry.tech,
      github: entry.github,
      projectSlug: entry.projectSlug,
    })
  }

  items.push({
    id: 'be-cse',
    year: primary.period,
    period: primary.period,
    title: primary.degree,
    org: primary.institution,
    summary: `${primary.result} — foundations across software development, machine learning, computer vision and data analytics.`,
    accent: 'brand',
    icon: 'education',
  })

  return items
}

const DOT: Record<Accent, string> = {
  brand: 'bg-brand shadow-brand/50',
  coral: 'bg-coral shadow-coral/50',
}

/** Career timeline — published experience + education. */
export default function Timeline({ onOpenProject }: { onOpenProject?: (slug: string) => void }) {
  const lineRef = useRef<HTMLDivElement>(null)
  const items = buildItems()

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: { trigger: lineRef.current?.parentElement, start: 'top 75%', end: 'bottom 55%', scrub: true },
      },
    )
  }, {})

  return (
    <section id="experience" aria-label="Career timeline" className="section overflow-hidden">
      <div aria-hidden="true" className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
      <div className="container-site relative">
        <SectionHeading
          num="04"
          eyebrow="Journey"
          title={
            <>
              THE STORY <span className="text-gradient">SO FAR.</span>
            </>
          }
          lead="Education and verified experience, in one line of sight."
        />

        <div className="relative mt-16 max-w-3xl">
          <div aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-brand via-coral to-aqua"
          />

          <ol className="space-y-12">
            {items.map((item, i) => (
              <li key={item.id}>
                <Reveal delay={0.05 * i}>
                  <div className="group relative pl-12">
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 left-0 h-[15px] w-[15px] rounded-full shadow-[0_0_16px] transition-transform duration-300 group-hover:scale-125 ${DOT[item.accent]}`}
                      style={{ backgroundColor: 'var(--ink)' }}
                    />
                    <p className="font-display text-4xl font-bold tracking-tight text-outline md:text-5xl">
                      {item.year}
                    </p>
                    <div className="card mt-4 p-6 transition-transform duration-300 group-hover:-translate-y-0.5 md:p-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {item.icon === 'education' ? (
                          <GraduationCap size={17} className="text-brand" aria-hidden="true" />
                        ) : (
                          <Briefcase size={16} className="text-coral" aria-hidden="true" />
                        )}
                        <h3 className="font-display text-xl font-semibold tracking-tight uppercase md:text-2xl">
                          {item.title}
                        </h3>
                        <span className="font-mono text-[0.7rem] tracking-wider text-muted uppercase">
                          {item.org}
                        </span>
                        <span className="w-full font-mono text-[0.7rem] tracking-[0.18em] text-faint uppercase">
                          {item.period}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>

                      {item.responsibilities && item.responsibilities.length > 0 && (
                        <Reveal className="mt-4 space-y-2.5" stagger staggerAmount={0.09} y={18}>
                          {item.responsibilities.map((point) => (
                            <p key={point.slice(0, 32)} className="flex gap-3 text-sm leading-relaxed text-muted">
                              <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                              {point}
                            </p>
                          ))}
                        </Reveal>
                      )}

                      {item.tech && item.tech.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                          {item.tech.map((t) => (
                            <li key={t} className="chip">
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}

                      {(item.github || item.projectSlug) && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {item.github && (
                            <a
                              href={item.github}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost !px-5 !py-2.5 text-sm"
                              data-cursor="GitHub"
                              aria-label={`${item.title} project repository on GitHub`}
                            >
                              <GithubIcon size={15} /> GitHub
                            </a>
                          )}
                          {item.projectSlug && onOpenProject && (
                            <button
                              type="button"
                              onClick={() => onOpenProject(item.projectSlug!)}
                              className="btn btn-primary !px-5 !py-2.5 text-sm"
                              data-cursor="Open case study"
                              aria-label="View the internship project case study"
                            >
                              View Internship Project <ArrowUpRight size={14} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
