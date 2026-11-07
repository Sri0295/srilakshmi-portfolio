import type { ReactNode } from 'react'

interface SplitProps {
  text: string
  className?: string
  charClassName?: string
}

/**
 * Character splitter used for staggered reveals. Words are kept in
 * `whitespace-nowrap` boxes so lines break between words, never mid-word.
 * The plain text is exposed via aria-label; the visual characters are
 * aria-hidden so screen readers read one clean string.
 */
export function SplitChars({ text, className = '', charClassName = '' }: SplitProps) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              className={`ss-char inline-block will-change-transform ${charClassName}`}
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  )
}

interface WordsProps {
  children: string
  className?: string
  wordClassName?: string
}

export function SplitWords({ children, className = '', wordClassName = '' }: WordsProps) {
  const words = children.split(' ')
  return (
    <span className={className} aria-label={children} role="text">
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className={`ss-word inline-block ${wordClassName}`}>
          {word}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}

export type SplitNode = ReactNode
