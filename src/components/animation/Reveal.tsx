import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  start?: string
  /** Stagger direct children instead of the wrapper itself */
  stagger?: boolean
  staggerAmount?: number
}

/**
 * Scroll-triggered rise + fade. Initial hidden state is applied by GSAP (JS)
 * so content stays visible when JavaScript is disabled or fails.
 * With prefers-reduced-motion, no animation is created at all.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 44,
  start = 'top 84%',
  stagger = false,
  staggerAmount = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current
      if (!el) return
      const targets = stagger ? Array.from(el.children) : el
      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1.05,
        delay,
        stagger: stagger ? staggerAmount : 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once: true },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
