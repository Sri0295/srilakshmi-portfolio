import { ChevronDown, GraduationCap } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { education } from '../data/education'

const primary = education.find((e) => e.primary)!
const earlier = education.filter((e) => !e.primary)

/** Education — soft ivory surface, animated milestone card + compact history. */
export default function Education() {
  return (
    <section id="education" aria-label="Education" className="section section-ivory overflow-hidden">
      <div aria-hidden="true" className="absolute -top-20 left-[-7rem] h-96 w-96 rounded-full bg-peach/30 blur-3xl" />
      <div aria-hidden="true" className="absolute right-[-6rem] bottom-0 h-80 w-80 rounded-full bg-lavender/25 blur-3xl" />

      <div className="container-site relative">
        <SectionHeading
          num="07"
          eyebrow="Education"
          title={
            <>
              STRONG <span className="text-gradient">FOUNDATIONS.</span>
            </>
          }
        />

        <Reveal className="mt-14">
          <div className="card relative overflow-hidden !border-[rgba(34,28,63,0.15)] bg-white/60 p-8 shadow-xl shadow-[rgba(34,28,63,0.08)] md:p-10">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand via-coral to-peach" />
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--light-ink)] text-[var(--light-surface)]">
                  <GraduationCap size={24} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{primary.degree}</h3>
                  <p className="mt-1.5 text-muted">{primary.institution}</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full bg-[var(--light-ink)] px-4 py-1.5 font-mono text-xs font-semibold tracking-wider text-[var(--light-surface)]">
                  {primary.result}
                </span>
                <span className="font-mono text-sm text-faint">{primary.period}</span>
              </div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[rgba(34,28,63,0.1)]" aria-hidden="true">
              <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-brand via-coral to-peach" />
            </div>
            <p className="mt-2 font-mono text-[0.66rem] tracking-wider text-faint uppercase">CGPA 8.0 / 10</p>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <details className="card group !border-[rgba(34,28,63,0.15)] bg-white/40 p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-display text-lg font-semibold">Earlier education — school history</span>
              <ChevronDown size={18} className="text-faint transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-5 divide-y divide-[rgba(34,28,63,0.1)]">
              {earlier.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div>
                    <p className="font-semibold">{e.degree}</p>
                    <p className="text-sm text-muted">{e.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">{e.result}</p>
                    <p className="font-mono text-xs text-faint">{e.period}</p>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </Reveal>
      </div>
    </section>
  )
}
