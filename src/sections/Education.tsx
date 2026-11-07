import { GraduationCap } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { education } from '../data/education'

const primary = education[0]

/** Education — university-focused; school history removed by owner decision. */
export default function Education() {
  return (
    <section id="education" aria-label="Education" className="section overflow-hidden">
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

        <Reveal className="mt-14 max-w-3xl">
          <div className="card relative overflow-hidden p-8 md:p-10">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand via-coral to-peach" />
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-coral">
                  <GraduationCap size={24} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{primary.degree}</h3>
                  <p className="mt-1.5 text-muted">{primary.institution}</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full bg-surface-2 px-4 py-1.5 font-mono text-xs font-semibold tracking-wider text-coral">
                  {primary.result}
                </span>
                <span className="font-mono text-sm text-faint">{primary.period}</span>
              </div>
            </div>
            <div className="mt-7 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-brand via-coral to-peach" />
            </div>
            <p className="mt-2 font-mono text-[0.66rem] tracking-wider text-faint uppercase">CGPA 8.0 / 10</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
