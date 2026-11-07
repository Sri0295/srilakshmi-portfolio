import { useRef } from 'react'
import { Download, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons'
import { gsap, useGSAP } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SplitChars, SplitWords } from '../components/animation/SplitText'
import { MagneticLink } from '../components/ui/Buttons'
import { scrollToId } from '../lib/scroll'
import { profile } from '../data/profile'
import { site } from '../data/site'

export default function Hero({ introDone }: { introDone: boolean }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  /* Initial hidden states (JS-applied so content stays visible without JS) */
  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.set(q('.h-char'), { yPercent: 120 })
      gsap.set(q('.h-fade'), { opacity: 0, y: 30 })
      gsap.set(q('.h-word'), { opacity: 0, y: 14 })
      gsap.set(q('.h-photo'), { clipPath: 'inset(0 0 100% 0)' })
    },
    { scope: root },
  )

  /* Intro timeline — plays once the preloader hands over */
  useGSAP(
    () => {
      if (!introDone || reduced) return
      const q = gsap.utils.selector(root)

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(q('.h-char'), { yPercent: 0, duration: 0.95, stagger: 0.035 })
        .to(q('.h-word'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.016 }, '-=0.55')
        .to(q('.h-fade'), { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 }, '-=0.4')
        .to(q('.h-photo'), { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, '-=0.85')
        .fromTo(q('.h-photo-img'), { scale: 1.08 }, { scale: 1, duration: 1.4 }, '<')
      /* Gentle editorial parallax on the portrait */
      gsap.to(q('.h-photo-wrap'), {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root, dependencies: [introDone] },
  )

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section
      ref={root}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <div className="h-parallax-text">
          <p className="h-fade inline-flex w-fit items-center gap-3 rounded-full border border-line bg-surface px-4 py-2">
            <span
              className={`animate-pulse-dot h-2 w-2 rounded-full ${
                site.availability.open ? 'bg-coral' : 'bg-faint'
              }`}
              aria-hidden="true"
            />
            <span className="font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
              {site.availability.label}
            </span>
          </p>

          <p className="h-fade mt-9 font-mono text-sm tracking-[0.32em] text-coral uppercase md:text-base">
            {profile.role} <span className="text-faint">·</span> {profile.role2}
          </p>

          <h1 className="mt-4 font-display leading-[0.95] font-bold tracking-tight">
            <span className="block overflow-hidden pb-1 text-hero">
              <SplitChars text="SRILAKSHMI" className="grad-chars inline-block" charClassName="h-char" />
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-muted">
            <SplitWords className="inline" wordClassName="h-word">
              {profile.tagline}
            </SplitWords>
          </p>

          <div className="h-fade mt-9 flex flex-wrap items-center gap-4">
            <MagneticLink
              href="#projects"
              onClick={(e) => jump(e, 'projects')}
              aria-label="View my work — projects section"
            >
              View My Work <span aria-hidden="true">↓</span>
            </MagneticLink>
            <MagneticLink
              variant="ghost"
              href={site.resumePath}
              download="Srilakshmi-S-Resume.pdf"
            >
              <Download size={17} aria-hidden="true" /> Download Résumé
            </MagneticLink>
          </div>

          <div className="h-fade mt-8 flex items-center gap-3">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Srilakshmi on GitHub"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-coral hover:text-coral"
            >
              <GithubIcon size={17} />
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Srilakshmi on LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-coral hover:text-coral"
            >
              <LinkedinIcon size={17} />
            </a>
            <a
              href={`mailto:${profile.contact.email}`}
              aria-label="Email Srilakshmi"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-coral hover:text-coral"
            >
              <Mail size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Portrait — the only profile photograph on the site */}
        <div className="h-parallax-text relative mx-auto w-full max-w-[22rem] lg:max-w-[25rem]">
          <div
            aria-hidden="true"
            className="absolute -top-4 -right-4 h-full w-full rounded-[24px] bg-bg-deep"
          />
          <div className="h-photo-wrap relative">
            <figure className="h-photo relative overflow-hidden rounded-[24px] border border-line shadow-[var(--shadow-lift)]">
              <img
                src={profile.photo.portrait}
                alt={profile.photo.alt}
                width={1126}
                height={1500}
                fetchPriority="high"
                decoding="async"
                className="h-photo-img aspect-[3/4] w-full object-cover object-[center_20%]"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        onClick={(e) => jump(e, 'about')}
        className="h-fade absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-coral"
        aria-label="Scroll to the about section"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.34em] uppercase">Scroll</span>
        <span className="grid h-9 w-6 justify-center rounded-full border border-line pt-1.5" aria-hidden="true">
          <span className="animate-bounce h-2 w-1 rounded-full bg-coral" />
        </span>
      </a>
    </section>
  )
}
