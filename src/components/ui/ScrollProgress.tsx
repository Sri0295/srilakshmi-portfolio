import { SECTION_IDS } from '../../hooks/useActiveSection'
import { scrollToId } from '../../lib/scroll'

const LABELS: Record<string, string> = {
  hero: 'Home',
  about: 'About',
  highlights: 'Highlights',
  experience: 'Experience',
  expertise: 'Expertise',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  contact: 'Contact',
}

/** FEATURE G — vertical section navigator (large screens only). */
export default function ScrollProgress({ active }: { active: string }) {
  return (
    <nav
      aria-label="Section progress"
      className="fixed top-1/2 right-6 z-[90] hidden -translate-y-1/2 flex-col gap-3.5 xl:flex"
    >
      {SECTION_IDS.map((id, i) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${LABELS[id] ?? id} section`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className={`absolute right-5 rounded-full border border-line bg-bg/85 px-2.5 py-1 font-mono text-[0.6rem] tracking-wider whitespace-nowrap uppercase opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 ${
                isActive ? 'text-aqua opacity-100' : 'text-muted'
              }`}
            >
              {String(i + 1).padStart(2, '0')} · {LABELS[id] ?? id}
            </span>
            <span
              aria-hidden="true"
              className={`block rounded-full transition-all duration-300 ${
                isActive ? 'h-2.5 w-2.5 bg-aqua shadow-[0_0_10px] shadow-aqua/60' : 'h-1.5 w-1.5 bg-faint/50 group-hover:bg-muted'
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}
