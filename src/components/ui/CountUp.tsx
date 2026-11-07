import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

/** Scroll-triggered integer count-up. Static for reduced-motion users. */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) {
        if (el) el.textContent = `${value}${suffix}`
        return
      }
      const state = { v: 0 }
      gsap.to(state, {
        v: value,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(state.v)}${suffix}`
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    },
    { dependencies: [value] },
  )

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  )
}
