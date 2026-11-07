import { useState } from 'react'
import { ArrowUpRight, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CountUp } from '../components/ui/CountUp'
import { highlights, type Highlight } from '../data/highlights'
import { metrics } from '../data/contentVerification'

const ACCENT_BG: Record<Highlight['accent'], string> = {
  brand: 'from-brand/15',
  coral: 'from-brand/15',
  aqua: 'from-brand/15',
  lime: 'from-brand/15',
  peach: 'from-brand/15',
}

const ACCENT_TEXT: Record<Highlight['accent'], string> = {
  brand: 'text-coral',
  coral: 'text-coral',
  aqua: 'text-coral',
  lime: 'text-coral',
  peach: 'text-coral',
}

function HighlightCard({
  item,
  onOpenProject,
}: {
  item: Highlight
  onOpenProject?: (slug: string) => void
}) {
  const [open, setOpen] = useState(false)

  /* Gated metric: only render when the owner verified it */
  const metric = item.metricId ? metrics[item.metricId] : null
  if (item.metricId && (!metric || metric.status !== 'verified')) return null

  return (
    <div
      className={`card group relative overflow-hidden bg-gradient-to-br ${ACCENT_BG[item.accent]} to-surface p-7 transition-transform duration-300 hover:-translate-y-1.5`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`font-display text-6xl font-bold tracking-tight md:text-7xl ${ACCENT_TEXT[item.accent]}`}>
          {item.value !== undefined ? <CountUp value={item.value} /> : metric?.display}
        </p>
        {item.metricId ? (
          <span
            className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-muted uppercase"
            title={metric?.methodology}
          >
            <ShieldCheck size={12} aria-hidden="true" /> Verified
          </span>
        ) : (
          <span
            className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-faint uppercase"
            title="Self-evident from this page or a model design fact"
          >
            <ShieldQuestion size={12} aria-hidden="true" /> On-page
          </span>
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{item.label}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="font-mono text-[0.7rem] tracking-wider text-faint uppercase transition-colors hover:text-aqua"
        >
          {open ? '− Hide detail' : '+ What this means'}
        </button>
        {item.projectSlug && onOpenProject && (
          <button
            type="button"
            onClick={() => onOpenProject(item.projectSlug!)}
            className="inline-flex items-center gap-1 font-mono text-[0.7rem] tracking-wider uppercase transition-colors"
            style={{ color: 'var(--aqua)' }}
          >
            View project <ArrowUpRight size={12} aria-hidden="true" />
          </button>
        )}
      </div>
      {open && <p className="mt-3 border-l-2 border-line pl-3 text-xs leading-relaxed text-faint">{item.detail}</p>}
    </div>
  )
}

/** Professional highlights — verification-gated animated numbers. */
export default function Highlights({ onOpenProject }: { onOpenProject?: (slug: string) => void }) {
  return (
    <section
      id="highlights"
      aria-label="Professional highlights"
      className="section bg-surface/40 overflow-hidden"
    >
      <div aria-hidden="true" className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
      <div className="container-site relative">
        <SectionHeading
          num="03"
          eyebrow="Highlights"
          title={
            <>
              NUMBERS THAT <span className="text-gradient">EARN TRUST.</span>
            </>
          }
          lead="Every figure here is either visible on this page itself or re-verified against project artefacts before publication. Résumé-reported results are never presented as facts without that check."
        />
        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger>
          {highlights.map((item) => (
            <HighlightCard key={item.id} item={item} onOpenProject={onOpenProject} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
