import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { SplitChars } from '../animation/SplitText'
import { profile } from '../../data/profile'

interface PreloaderProps {
  onComplete: () => void
}

const CURTAIN_COLORS = [
  'var(--brand)',
  'var(--coral)',
  'var(--aqua)',
  'var(--lime)',
  'var(--peach)',
]

/**
 * Cinematic preloader — real progress (fonts + hero image + window load,
 * hard-capped at 3.5 s), staggered name reveal, multi-strip curtain exit.
 * Skipped entirely for reduced-motion users and repeat visits in a session.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const finishedRef = useRef(false)

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    try {
      sessionStorage.setItem('ss-intro-seen', '1')
    } catch {
      /* storage unavailable — non-fatal */
    }
    onComplete()
  }

  /* Real readiness → progress */
  useEffect(() => {
    if (prefersReducedMotion()) {
      finish()
      return
    }
    let raf = 0
    const t0 = performance.now()
    let ready = false

    const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve()
    const heroImage = new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = profile.photo.portrait
    })
    const windowLoad = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const cap = window.setTimeout(() => {
      ready = true
    }, 3500)

    Promise.all([fontsReady, heroImage, windowLoad])
      .then(() => {
        ready = true
      })
      .catch(() => {
        ready = true
      })

    const tick = () => {
      const elapsed = performance.now() - t0
      const target = ready ? 100 : Math.min(86, elapsed / 18)
      setProgress((p) => {
        const next = p + (target - p) * 0.09
        return ready && next > 99.2 ? 100 : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(cap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Name starts hidden below its clipped container */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const chars = nameRef.current?.querySelectorAll('.ss-char')
    if (chars?.length) gsap.set(chars, { yPercent: 130 })
  }, [])

  /* Progress 100 → run the exit timeline */
  useGSAP(
    () => {
      if (progress < 100 || exiting || prefersReducedMotion()) return
      setExiting(true)

      const chars = nameRef.current?.querySelectorAll('.ss-char')
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: finish,
      })

      tl.to([logoRef.current, metaRef.current], { opacity: 0, y: -24, duration: 0.4 }, 0)
        .fromTo(
          chars ?? [],
          { yPercent: 130 },
          { yPercent: 0, duration: 0.75, stagger: 0.04 },
          0.1,
        )
        .to({}, { duration: 0.3 })
        .to(nameRef.current, { yPercent: -110, duration: 0.55, ease: 'expo.inOut' }, '+=0.02')
        .to(
          panelRef.current,
          { yPercent: -100, duration: 0.85, ease: 'expo.inOut' },
          '<0.1',
        )
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.9, ease: 'expo.inOut', stagger: { each: 0.07 } },
          '<0.12',
        )
        .call(
          () => {
            // Hand over to the hero while the curtain is still lifting.
            if (!finishedRef.current) {
              finishedRef.current = true
              try {
                sessionStorage.setItem('ss-intro-seen', '1')
              } catch {
                /* noop */
            }
            onComplete()
          }
        }, undefined, '<+=0.25')
    },
    { dependencies: [progress, exiting] },
  )

  /* Skip button */
  const skip = () => {
    gsap.killTweensOf('*')
    gsap.set(rootRef.current, { yPercent: -100, duration: 0.25, ease: 'power2.in' })
    finish()
  }

  return (
    <div ref={rootRef} className="fixed inset-0 z-[120]" role="presentation">
      {/* Trailing colour curtain */}
      <div className="absolute inset-0 flex">
        {CURTAIN_COLORS.map((c) => (
          <span key={c} className="h-full flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* Main panel */}
      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-bg-deep"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute top-[12%] left-[8%] h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute right-[6%] bottom-[10%] h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
        </div>

        <div ref={logoRef} className="relative mb-10 flex flex-col items-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border border-line bg-surface font-display text-3xl font-bold">
            <span className="text-gradient">SS</span>
          </div>
          <span className="mt-4 font-mono text-[11px] tracking-[0.4em] text-faint uppercase">
            Portfolio · 2026
          </span>
        </div>

        <div ref={nameRef} className="relative overflow-hidden px-4">
          <p className="font-display text-[clamp(2.2rem,8vw,7rem)] leading-none font-bold tracking-tight">
            <SplitChars text={profile.firstName.toUpperCase()} />
          </p>
        </div>

        <div ref={metaRef} className="absolute inset-x-0 bottom-8 flex items-end justify-between px-8">
          <span className="font-mono text-meta tracking-[0.3em] text-faint uppercase">
            Loading experience
          </span>
          <span className="font-mono text-4xl font-semibold text-aqua tabular-nums md:text-5xl">
            {Math.round(progress)}%
          </span>
        </div>

        <button
          type="button"
          onClick={skip}
          className="absolute top-6 right-6 rounded-full border border-line px-4 py-2 font-mono text-meta tracking-widest text-muted uppercase transition-colors hover:border-aqua hover:text-aqua"
        >
          Skip intro →
        </button>
      </div>
    </div>
  )
}
