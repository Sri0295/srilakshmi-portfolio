import { useReducedMotion } from '../hooks/useReducedMotion'
import { marqueeTech } from '../data/skills'

const ACCENTS = ['var(--lavender)', 'var(--coral)', 'var(--aqua)', 'var(--peach)', 'var(--lime)']

/** Continuous technology ticker — verified technologies only. */
export default function TechMarquee() {
  const reduced = useReducedMotion()
  const copies = reduced ? [0] : [0, 1]

  return (
    <section
      aria-label="Technologies Srilakshmi works with"
      className="relative z-10 overflow-hidden border-y border-line bg-bg-deep py-7"
    >
      <div
        className={`${
          reduced ? 'flex w-full flex-wrap justify-center gap-y-4' : 'animate-marquee hover:[animation-play-state:paused] flex w-max'
        }`}
      >
        {copies.map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className={`flex shrink-0 items-center ${reduced ? 'flex-wrap justify-center' : ''}`}
          >
            {marqueeTech.map((tech, i) => (
              <li key={`${copy}-${tech}`} className="flex items-center">
                <span
                  className="px-7 font-display text-2xl font-semibold tracking-tight whitespace-nowrap md:text-4xl"
                  style={{ color: ACCENTS[i % ACCENTS.length] }}
                >
                  {tech}
                </span>
                <span aria-hidden="true" className="text-sm" style={{ color: ACCENTS[(i + 2) % ACCENTS.length] }}>
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
