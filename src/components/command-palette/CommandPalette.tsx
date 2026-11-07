import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Command, CornerDownLeft, ExternalLink, FileDown } from 'lucide-react'
import { gsap, useGSAP } from '../../lib/gsap'
import { commandDefinitions, type CommandDefinition } from '../../data/commands'

interface Props {
  /** Plain dismissal (Escape / click outside) — no command selected */
  onDismiss: () => void
  /** Executes the command: App closes the palette, then runs the action */
  onExecute: (command: CommandDefinition) => void
}

/**
 * Ctrl/Cmd+K command palette. Displays the central command registry
 * (src/data/commands.ts) and hands every selection to App for execution —
 * the palette itself never scrolls, so the Lenis scroll lock can never
 * swallow a navigation.
 */
export default function CommandPalette({ onDismiss, onExecute }: Props) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = useMemo(() => {
    const fold = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    const q = fold(query.trim())
    if (!q) return commandDefinitions
    return commandDefinitions.filter((c) =>
      fold(`${c.label} ${c.description} ${c.category} ${c.keywords}`).includes(q),
    )
  }, [query])

  const onQueryChange = (value: string) => {
    setQuery(value)
    setActiveIdx(0)
  }

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  useGSAP(() => {
    gsap.fromTo(panelRef.current, { y: -18, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' })
  }, {})

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onDismiss()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      // If a command button itself has focus, let its native click fire —
      // handling Enter here too would execute two different commands.
      if ((e.target as HTMLElement).closest('[role="listbox"] button')) return
      e.preventDefault()
      const command = filtered[activeIdx]
      if (command) onExecute(command)
    }
    // Tab is left untouched so it moves through the interactive controls.
  }

  return (
    <div
      className="fixed inset-0 z-[125] flex items-start justify-center bg-bg/70 px-4 pt-[13vh] backdrop-blur-sm"
      onClick={onDismiss}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="card w-full max-w-xl overflow-hidden !bg-bg-deep/95 shadow-2xl shadow-brand/20"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Command size={16} className="text-aqua" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered[activeIdx] ? `cmd-${filtered[activeIdx].id}` : undefined}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Where to? Try 'projects', 'resume', 'github'…"
            aria-label="Search commands"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
          <kbd className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.62rem] text-faint">ESC</kbd>
        </div>

        <ul
          ref={listRef}
          id="command-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-[46vh] overflow-y-auto p-2"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-faint" role="status">
              No matching command — try “projects”, “resume” or “education”.
            </li>
          )}
          {filtered.map((command, i) => (
            <li
              key={command.id}
              id={`cmd-${command.id}`}
              role="option"
              aria-selected={i === activeIdx}
            >
              <button
                type="button"
                data-active={i === activeIdx || undefined}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => onExecute(command)}
                title={command.description}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                  i === activeIdx ? 'bg-brand-soft text-ink' : 'text-muted'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {command.action.type === 'case-study' && <ExternalLink size={13} className="shrink-0 text-faint" aria-hidden="true" />}
                  {(command.action.type === 'download-resume' || command.action.type === 'copy-email') && (
                    <FileDown size={13} className="shrink-0 text-faint" aria-hidden="true" />
                  )}
                  {command.label}
                </span>
                <span className="font-mono text-[0.66rem] text-faint">{command.category}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 border-t border-line px-5 py-3 font-mono text-[0.64rem] text-faint">
          <span className="flex items-center gap-1.5">
            <ArrowUp size={11} aria-hidden="true" />
            <ArrowDown size={11} aria-hidden="true" /> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <CornerDownLeft size={11} aria-hidden="true" /> select
          </span>
          <span className="ml-auto">Srilakshmi S — command palette</span>
        </div>
      </div>
    </div>
  )
}
