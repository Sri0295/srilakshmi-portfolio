import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Desktop-only trailing cursor: a fast dot, a lagging ring and a contextual
 * label picked up from `data-cursor` attributes. Native cursor is kept for
 * usability; this is an accent, not a replacement.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const dot = dotRef.current!
    const ring = ringRef.current!
    const label = labelRef.current!

    gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })
    const labelX = gsap.quickTo(label, 'x', { duration: 0.3, ease: 'power3.out' })
    const labelY = gsap.quickTo(label, 'y', { duration: 0.3, ease: 'power3.out' })

    let shown = false
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot, ring, label], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      labelX(e.clientX + 22)
      labelY(e.clientY + 18)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
      const interactive = (e.target as HTMLElement).closest?.('a, button, [role="button"], input, textarea, select, summary')
      if (target) {
        label.textContent = target.dataset.cursor ?? ''
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.25 })
        gsap.to(ring, { scale: 1.7, borderColor: 'var(--aqua)', duration: 0.3 })
      } else {
        gsap.to(label, { opacity: 0, scale: 0.7, duration: 0.2 })
        gsap.to(ring, {
          scale: interactive ? 1.5 : 1,
          borderColor: interactive ? 'var(--brand)' : 'rgba(245,240,255,0.7)',
          duration: 0.3,
        })
      }
    }

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 })
    const onLeave = () => gsap.to([dot, ring, label], { opacity: 0, duration: 0.25 })
    const onEnter = () => shown && gsap.to([dot, ring, label], { opacity: 1, duration: 0.25 })

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [reduced])

  /* Reduced motion / touch: no cursor accent at all */
  if (reduced) return null

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[130] hidden h-10 w-10 rounded-full border border-white/70 mix-blend-difference lg:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[130] hidden h-1.5 w-1.5 rounded-full bg-white mix-blend-difference lg:block"
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[131] hidden rounded-full bg-aqua px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-[#0c1a18] opacity-0 lg:block"
      />
    </>
  )
}
