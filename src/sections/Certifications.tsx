import { Award } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { certifications, type Certification } from '../data/certifications'

const ACCENT: Record<Certification['accent'], { text: string; bar: string; glow: string }> = {
  brand: { text: 'text-brand', bar: 'from-brand to-lavender', glow: 'hover:shadow-brand/25' },
  coral: { text: 'text-coral', bar: 'from-coral to-peach', glow: 'hover:shadow-coral/25' },
  aqua: { text: 'text-aqua', bar: 'from-aqua to-brand', glow: 'hover:shadow-aqua/25' },
  lime: { text: 'text-lime', bar: 'from-lime to-aqua', glow: 'hover:shadow-lime/25' },
}

/** Certifications — no fabricated credential links or dates. */
export default function Certifications() {
  return (
    <section
      id="certifications"
      aria-label="Certifications and achievements"
      className="section overflow-hidden"
    >
      <div aria-hidden="true" className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
      <div className="container-site relative">
        <SectionHeading
          num="08"
          eyebrow="Credentials"
          title={
            <>
              BACKED BY <span className="text-gradient">PROOF.</span>
            </>
          }
          lead="Structured programmes and job simulations completed alongside the degree. Credential links are added only once verified — none are invented."
        />

        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2" stagger>
          {certifications.map((cert) => {
            const a = ACCENT[cert.accent]
            return (
              <article
                key={cert.id}
                className={`card group relative flex items-start gap-5 overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${a.glow}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${a.bar}`}
                />
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line ${a.text}`}>
                  <Award size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug font-semibold md:text-xl">{cert.title}</h3>
                  <p className="mt-1.5 font-mono text-xs tracking-wider text-muted uppercase">{cert.issuer}</p>
                  {cert.date && <p className="mt-1 font-mono text-[0.7rem] text-faint">{cert.date}</p>}
                </div>
              </article>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
