import type { ReactNode } from 'react'
import { Reveal } from '../animation/Reveal'

interface SectionHeadingProps {
  num: string
  eyebrow: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  className?: string
}

/** Numbered eyebrow + oversized display heading + optional lead paragraph. */
export function SectionHeading({
  num,
  eyebrow,
  title,
  lead,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  return (
    <Reveal
      stagger
      className={`${align === 'center' ? 'text-center [&_.eyebrow]:justify-center' : ''} ${className}`}
    >
      <p className="eyebrow">
        <span className="text-coral">{num}</span> {eyebrow}
      </p>
      <h2 className="mt-5 font-display leading-[0.98] font-bold tracking-tight text-display max-w-5xl">
        {title}
      </h2>
      {lead ? (
        <p className={`mt-6 max-w-2xl text-muted ${align === 'center' ? 'mx-auto' : ''}`}>{lead}</p>
      ) : null}
    </Reveal>
  )
}
