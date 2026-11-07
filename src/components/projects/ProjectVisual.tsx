import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import type { Project } from '../../data/projects'

/**
 * Project image slot. Owner-supplied screenshots render as-is (no filters,
 * no distortion, natural aspect ratio, subtle hover scale, clip-path reveal).
 * Projects without a supplied screenshot keep a stylised placeholder,
 * clearly labelled on-screen.
 */
export default function ProjectVisual({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLElement>(null)
  const hasImage = Boolean(project.image)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !hasImage) return
      gsap.fromTo(
        wrapRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.1,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 88%', once: true },
        },
      )
    },
    { dependencies: [hasImage] },
  )

  if (hasImage) {
    return (
      <figure
        ref={wrapRef as React.RefObject<HTMLElement>}
        className="relative overflow-hidden rounded-2xl border border-line bg-bg-deep/40"
      >
        <img
          src={project.image}
          alt={`${project.title} — project screenshot`}
          width={project.imageWidth}
          height={project.imageHeight}
          loading="lazy"
          decoding="async"
          className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </figure>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-bg-deep"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[project.accent]} opacity-[0.16]`} />
      {project.visual === 'sentinel' && <SentinelArt />}
      {project.visual === 'dr' && <RetinaArt />}
      {project.visual === 'haar' && <HaarArt />}
      {project.visual === 'sales' && <SalesArt />}
      <span className="absolute right-3 bottom-3 rounded-full border border-line bg-bg/70 px-2.5 py-1 font-mono text-[0.6rem] tracking-wider text-faint uppercase backdrop-blur-sm">
        Stylised preview — real screenshot to be added
      </span>
    </div>
  )
}

const GRADIENTS: Record<Project['accent'], string> = {
  brand: 'from-brand to-lavender',
  coral: 'from-coral to-peach',
  aqua: 'from-aqua to-brand',
  peach: 'from-peach to-coral',
}

/* 01 — code editor with prediction panel (placeholder, unused while a real
   screenshot exists for this project) */
function SentinelArt() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
      <rect x="38" y="42" width="250" height="216" rx="10" fill="var(--surface)" stroke="var(--line)" />
      <rect x="38" y="42" width="250" height="30" rx="10" fill="var(--surface-2)" />
      <circle cx="56" cy="57" r="4" fill="var(--coral)" />
      <circle cx="70" cy="57" r="4" fill="var(--peach)" />
      <circle cx="84" cy="57" r="4" fill="var(--lime)" />
      {[
        [70, 40, 'var(--brand)'],
        [86, 64, 'var(--aqua)'],
        [102, 48, 'var(--coral)'],
        [118, 88, 'var(--lavender)'],
        [134, 30, 'var(--aqua)'],
        [150, 70, 'var(--brand)'],
        [166, 52, 'var(--coral)'],
        [182, 96, 'var(--lime)'],
      ].map(([y, w, c], i) => (
        <rect key={i} x={56 + (i % 2) * 16} y={y as number} width={w as number} height={7} rx={3.5} fill={c as string} opacity={0.75} />
      ))}
      <rect x="236" y="120" width="132" height="112" rx="12" fill="var(--bg)" stroke="var(--brand)" strokeWidth="1.5" />
      <rect x="252" y="138" width="70" height="7" rx="3.5" fill="var(--brand)" />
      <rect x="252" y="156" width="100" height="5" rx="2.5" fill="var(--ink-muted)" opacity="0.5" />
      <rect x="252" y="168" width="84" height="5" rx="2.5" fill="var(--ink-muted)" opacity="0.5" />
      <rect x="252" y="188" width="52" height="16" rx="8" fill="var(--coral)" opacity="0.9" />
      <rect x="252" y="212" width="100" height="4" rx="2" fill="var(--lime)" opacity="0.7" />
      <rect x="252" y="221" width="72" height="4" rx="2" fill="var(--aqua)" opacity="0.7" />
    </svg>
  )
}

/* 02 — retinal scan with five-stage scale */
function RetinaArt() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
      <circle cx="170" cy="150" r="104" fill="none" stroke="var(--coral)" strokeWidth="1.4" opacity="0.5" />
      <circle cx="170" cy="150" r="78" fill="none" stroke="var(--peach)" strokeWidth="1" opacity="0.4" />
      <circle cx="170" cy="150" r="52" fill="var(--coral)" opacity="0.14" />
      <circle cx="170" cy="150" r="20" fill="var(--peach)" opacity="0.6" />
      {[
        'M170 150 C 120 110, 90 130, 70 160',
        'M170 150 C 220 120, 250 140, 272 170',
        'M170 150 C 150 200, 120 215, 96 222',
        'M170 150 C 200 190, 230 205, 252 208',
        'M170 150 C 168 110, 175 90, 182 72',
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--coral)" strokeWidth="1.6" opacity="0.55" />
      ))}
      <line x1="170" y1="26" x2="170" y2="52" stroke="var(--aqua)" strokeWidth="1.5" />
      <line x1="170" y1="248" x2="170" y2="274" stroke="var(--aqua)" strokeWidth="1.5" />
      <line x1="46" y1="150" x2="72" y2="150" stroke="var(--aqua)" strokeWidth="1.5" />
      <line x1="268" y1="150" x2="294" y2="150" stroke="var(--aqua)" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx={322} cy={92 + i * 26} r={i === 4 ? 7 : 5} fill={i === 4 ? 'var(--coral)' : 'var(--surface-2)'} stroke="var(--coral)" strokeWidth="1.2" />
        </g>
      ))}
      <text x="338" y="228" fontSize="11" fontFamily="var(--ff-mono)" fill="var(--ink-muted)">Stage 5</text>
    </svg>
  )
}

/* 03 — detection brackets */
function HaarArt() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
      <rect x="0" y="0" width="400" height="300" fill="var(--surface)" opacity="0.35" />
      <rect x="140" y="66" width="120" height="150" rx="14" fill="var(--surface-2)" opacity="0.85" />
      <circle cx="200" cy="120" r="26" fill="var(--bg-deep)" opacity="0.9" />
      <rect x="172" y="158" width="56" height="44" rx="10" fill="var(--bg-deep)" opacity="0.9" />
      {[
        'M120 56 h-24 v24',
        'M280 56 h24 v24',
        'M120 226 h-24 v-24',
        'M280 226 h24 v-24',
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x="132" y="58" width="136" height="166" rx="14" fill="none" stroke="var(--aqua)" strokeWidth="1.6" strokeDasharray="6 6" />
      <rect x="132" y="36" width="96" height="18" rx="9" fill="var(--aqua)" />
      <text x="146" y="48.5" fontSize="10.5" fontFamily="var(--ff-mono)" fill="#0c1a18">FACE 0.98</text>
      <rect x="300" y="180" width="70" height="40" rx="8" fill="var(--bg)" stroke="var(--line)" />
      <text x="312" y="197" fontSize="9.5" fontFamily="var(--ff-mono)" fill="var(--ink-muted)">scale ↑</text>
      <text x="312" y="210" fontSize="9.5" fontFamily="var(--ff-mono)" fill="var(--lime)">FP ↓</text>
    </svg>
  )
}

/* 04 — dashboard bars + trend */
function SalesArt() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
      {[52, 96, 140, 184].map((y) => (
        <line key={y} x1="48" y1={y} x2="352" y2={y} stroke="var(--line)" strokeWidth="1" />
      ))}
      {[
        [64, 74, 'var(--aqua)'],
        [112, 118, 'var(--brand)'],
        [160, 92, 'var(--aqua)'],
        [208, 150, 'var(--peach)'],
        [256, 108, 'var(--brand)'],
        [304, 62, 'var(--coral)'],
      ].map(([x, h, c], i) => (
        <rect key={i} x={x as number} y={236 - (h as number)} width={26} height={h as number} rx={6} fill={c as string} opacity={0.85} />
      ))}
      <path
        d="M77 168 C 110 150, 130 130, 173 128 S 240 106, 287 100 S 330 92, 317 88"
        fill="none"
        stroke="var(--lime)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="317" cy="88" r="4.5" fill="var(--lime)" />
      <rect x="272" y="42" width="96" height="26" rx="13" fill="var(--bg)" stroke="var(--peach)" strokeWidth="1.4" />
      <text x="288" y="59" fontSize="11" fontFamily="var(--ff-mono)" fill="var(--peach)">KPI · Sales</text>
    </svg>
  )
}
