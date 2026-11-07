import { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../animation/Reveal'
import {
  constellationEdges,
  constellationNodes,
  type ConstellationGroup,
} from '../../data/skills'
import { getProject, type Accent } from '../../data/projects'

const GROUP_COLOR: Record<ConstellationGroup, string> = {
  core: 'var(--brand)',
  web: 'var(--coral)',
  data: 'var(--aqua)',
  ml: 'var(--lime)',
  cv: 'var(--peach)',
  tools: 'var(--lavender)',
}

const ACCENT_VAR: Record<Accent, string> = {
  brand: 'var(--brand)',
  coral: 'var(--coral)',
  aqua: 'var(--aqua)',
  peach: 'var(--peach)',
}

const GROUP_LABEL: Record<ConstellationGroup, string> = {
  core: 'Core',
  web: 'Web',
  data: 'Data',
  ml: 'Machine Learning',
  cv: 'Computer Vision',
  tools: 'Tools',
}

interface Props {
  selected: string | null
  onSelect: (id: string | null) => void
  onOpenProject: (slug: string) => void
}

/**
 * FEATURE A — Interactive Skill Constellation.
 * The SVG is decorative (aria-hidden); selection is driven by accessible
 * chip buttons below it, and works identically on mobile.
 */
export default function SkillConstellation({ selected, onSelect, onOpenProject }: Props) {
  const nodes = useMemo(() => new Map(constellationNodes.map((n) => [n.id, n])), [])

  const neighbors = useMemo(() => {
    if (!selected) return new Set<string>()
    const set = new Set<string>()
    for (const e of constellationEdges) {
      if (e.from === selected) set.add(e.to)
      if (e.to === selected) set.add(e.from)
    }
    return set
  }, [selected])

  const selectedNode = selected ? nodes.get(selected) : undefined
  const projectSlugs = selectedNode ? Array.from(new Set(selectedNode.projectSlugs)) : []

  return (
    <div className="mt-16">
      {/* Node map (desktop) */}
      <Reveal className="card relative hidden overflow-hidden bg-bg-deep/60 p-4 md:block">
        <svg
          viewBox="0 0 1000 560"
          className="h-auto w-full"
          aria-hidden="true"
          data-cursor={selectedNode?.label ?? 'Pick a skill'}
        >
          {/* edges */}
          {constellationEdges.map((e) => {
            const a = nodes.get(e.from)!
            const b = nodes.get(e.to)!
            const active = selected === e.from || selected === e.to
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? GROUP_COLOR[a.group] : 'var(--line)'}
                strokeWidth={active ? 2.4 : 1.2}
                opacity={selected ? (active ? 0.95 : 0.25) : 0.7}
              />
            )
          })}
          {/* nodes */}
          {constellationNodes.map((n) => {
            const isSelected = n.id === selected
            const isNeighbor = neighbors.has(n.id)
            const dim = selected && !isSelected && !isNeighbor
            const r = n.group === 'core' ? 30 : isSelected ? 24 : 17
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                opacity={dim ? 0.28 : 1}
                className="transition-opacity duration-300"
                onClick={() => onSelect(isSelected ? null : n.id)}
              >
                <circle
                  r={r + 10}
                  fill="transparent"
                  className="cursor-pointer"
                />
                {isSelected && (
                  <circle r={r + 12} fill="none" stroke={GROUP_COLOR[n.group]} strokeWidth={1.2} opacity={0.6} className="animate-ping" />
                )}
                <circle
                  r={r}
                  fill={isSelected || isNeighbor ? GROUP_COLOR[n.group] : 'var(--surface)'}
                  stroke={GROUP_COLOR[n.group]}
                  strokeWidth={2}
                  className="cursor-pointer transition-all duration-300"
                />
                <text
                  y={r + 22}
                  textAnchor="middle"
                  fontSize={n.group === 'core' ? 20 : 15}
                  fontFamily="var(--ff-mono)"
                  fill={isSelected ? 'var(--ink)' : 'var(--ink-muted)'}
                  className="cursor-pointer select-none"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>
      </Reveal>

      {/* Accessible skill chips (all viewports) */}
      <Reveal className="mt-8 space-y-5" stagger>
        {(Object.keys(GROUP_LABEL) as ConstellationGroup[]).map((group) => (
          <div key={group} className="flex flex-wrap items-center gap-2.5">
            <span
              className="mr-1 w-24 shrink-0 font-mono text-[0.66rem] tracking-[0.2em] uppercase"
              style={{ color: GROUP_COLOR[group] }}
            >
              {GROUP_LABEL[group]}
            </span>
            {constellationNodes
              .filter((n) => n.group === group)
              .map((n) => {
                const isSelected = n.id === selected
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onSelect(isSelected ? null : n.id)}
                    aria-pressed={isSelected}
                    className="chip cursor-pointer transition-all duration-200 hover:text-ink"
                    style={
                      isSelected
                        ? { borderColor: GROUP_COLOR[group], color: GROUP_COLOR[group], background: 'color-mix(in srgb, currentColor 12%, transparent)' }
                        : undefined
                    }
                  >
                    {n.label}
                  </button>
                )
              })}
          </div>
        ))}
      </Reveal>

      {/* Selection panel */}
      <div aria-live="polite" className="mt-8 min-h-[5.5rem]">
        {selectedNode ? (
          <div className="card p-6" style={{ borderColor: GROUP_COLOR[selectedNode.group] }}>
            <p className="font-mono text-[0.7rem] tracking-[0.24em] uppercase" style={{ color: GROUP_COLOR[selectedNode.group] }}>
              {GROUP_LABEL[selectedNode.group]} · {selectedNode.label}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[0.7rem] tracking-wider text-faint uppercase">
                {projectSlugs.length ? 'Applied in:' : 'Supporting skill across the stack'}
              </span>
              {projectSlugs.map((slug) => {
                const project = getProject(slug)
                if (!project) return null
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => onOpenProject(slug)}
                    className="chip cursor-pointer !text-ink transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: ACCENT_VAR[project.accent] }}
                  >
                    {project.shortTitle} <ArrowUpRight size={11} aria-hidden="true" />
                  </button>
                )
              })}
              {projectSlugs.length > 0 && (
                <span className="font-mono text-[0.66rem] text-faint">
                  opens the case study
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-faint">
            Select any skill above to trace it through the constellation and jump to the projects where it is applied.
          </p>
        )}
      </div>
    </div>
  )
}
