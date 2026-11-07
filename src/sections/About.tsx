import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { profile } from '../data/profile'
import { skillGroups } from '../data/skills'

const AREAS_OF_INTEREST = [
  'Full Stack Development',
  'Machine Learning',
  'Computer Vision',
  'Data Analytics',
]

/** About — editorial typography only; no second photograph. */
export default function About() {
  const technicalBackground = skillGroups
    .filter((g) => ['programming', 'backend', 'analytics'].includes(g.id))
    .map((g) => g.skills.join(', '))
    .join(' · ')

  return (
    <section id="about" aria-label="About Srilakshmi" className="section overflow-hidden">
      <div className="container-site relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* Left — heading + introduction */}
        <div>
          <SectionHeading
            num="02"
            eyebrow="About"
            title={
              <>
                BEYOND THE <span className="text-gradient">ORDINARY.</span>
              </>
            }
          />
          <Reveal className="mt-7">
            <p className="max-w-xl leading-relaxed text-muted">{profile.about}</p>
          </Reveal>
        </div>

        {/* Right — interests, background, résumé */}
        <div className="lg:pt-24">
          <Reveal className="space-y-8" stagger>
            <div className="border-t border-line pt-7">
              <p className="font-mono text-[0.7rem] tracking-[0.26em] text-faint uppercase">
                Areas of interest
              </p>
              <ul className="mt-4 space-y-2.5">
                {AREAS_OF_INTEREST.map((area) => (
                  <li key={area} className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="h-px w-5 shrink-0 translate-y-[-3px] bg-brand" />
                    <span className="font-display text-lg font-semibold">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line pt-7">
              <p className="font-mono text-[0.7rem] tracking-[0.26em] text-faint uppercase">
                Technical background
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{technicalBackground}</p>
            </div>

            <div className="border-t border-line pt-7">
              <a
                href="/resume/Srilakshmi-S-Resume.pdf"
                download="Srilakshmi-S-Resume.pdf"
                className="inline-flex items-center gap-2 font-display text-sm font-semibold text-coral transition-colors hover:text-brand"
              >
                Download résumé (PDF) <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
