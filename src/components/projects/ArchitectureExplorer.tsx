import { useState } from 'react'
import type { Project } from '../../data/projects'

/**
 * FEATURE D — interactive architecture walkthrough. Steps reflect the real,
 * résumé-grounded pipeline of each project.
 */
export default function ArchitectureExplorer({ project }: { project: Project }) {
  const [activeId, setActiveId] = useState(project.architecture[0]?.id ?? '')
  const active = project.architecture.find((s) => s.id === activeId) ?? project.architecture[0]

  return (
    <div>
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-2" aria-label="Architecture steps">
        {project.architecture.map((step, i) => {
          const isActive = active?.id === step.id
          return (
            <li key={step.id} className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveId(step.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'border-brand bg-brand-soft text-ink'
                    : 'border-line text-muted hover:border-faint hover:text-ink'
                }`}
              >
                <span className={`font-mono text-[0.62rem] ${isActive ? 'text-brand' : 'text-faint'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.82rem] font-medium">{step.title}</span>
              </button>
              {i < project.architecture.length - 1 && (
                <span aria-hidden="true" className="h-px w-5 shrink-0 bg-line" />
              )}
            </li>
          )
        })}
      </ol>

      <div className="card mt-4 p-6" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-xl font-semibold">
            <span className="font-mono text-sm text-brand">{String(project.architecture.indexOf(active) + 1).padStart(2, '0')} — </span>
            {active.title}
          </p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies in this step">
            {active.tech.map((t) => (
              <li key={t} className="chip !px-2.5 !py-0.5 !text-[0.62rem]">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{active.detail}</p>
      </div>
    </div>
  )
}
