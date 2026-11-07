import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { skillGroups } from '../data/skills'

/**
 * Static editorial expertise section — no auto-scrolling ticker, no skill
 * percentages. Categories and technologies exactly as approved by the owner.
 */
export default function Expertise() {
  return (
    <section id="expertise" aria-label="Technical expertise" className="section overflow-hidden">
      <div className="container-site relative">
        <SectionHeading
          num="05"
          eyebrow="Expertise"
          title={
            <>
              WHAT I <span className="text-gradient">BRING.</span>
            </>
          }
          lead="A practical toolkit built through shipped projects — organised the way I actually use it."
        />

        <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={0.04 * i}>
              <div className="group border-t border-line pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-coral md:text-2xl">
                    {group.title}
                  </h3>
                  <span className="font-mono text-[0.66rem] tracking-[0.2em] text-faint uppercase">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.95rem] leading-relaxed text-muted">
                  {group.skills.map((skill, si) => (
                    <span key={skill} className="transition-colors duration-300 group-hover:text-ink">
                      {skill}
                      {si < group.skills.length - 1 && (
                        <span aria-hidden="true" className="ml-2 text-brand">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
