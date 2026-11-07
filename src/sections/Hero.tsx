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
      gsap.set(q('.h-photo-wrap'), { clipPath: 'inset(0 0 100% 0)' })
      gsap.set(q('.h-chip'), { opacity: 0, y: 16 })
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
        .to(q('.h-photo-wrap'), { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, '-=0.85')
        .fromTo(q('.h-photo-img'), { scale: 1.28 }, { scale: 1, duration: 1.5 }, '<')
        .to(q('.h-chip'), { opacity: 1, y: 0, duration: 0.55, stagger: 0.09 }, '-=1.0')

      /* Ambient scroll parallax */
      gsap.to(q('.h-parallax-text'), {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(q('.h-parallax-photo'), {
        yPercent: 9,
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
      {/* Ambient background */}
      <div className="absolute inset-0 bg-blueprint" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-float-slow absolute -top-36 -left-36 h-[32rem] w-[32rem] rounded-full bg-brand/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow top-1/3 -right-44 h-[30rem] w-[30rem] rounded-full bg-coral/20 blur-3xl absolute [animation-delay:-4s]"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full bg-aqua/15 blur-3xl absolute [animation-delay:-7s]"
      />
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute top-[14%] right-[4%] hidden font-display text-[24vw] leading-none font-bold opacity-[0.06] select-none lg:block"
      >
        SS
      </span>

      <div className="container-site relative grid items-center gap-16 lg:grid-cols-[1.12fr_0.88fr]">
        {/* Copy */}
        <div className="h-parallax-text">
          <p className="h-fade flex w-fit items-center gap-3 rounded-full border border-line bg-surface/70 px-4 py-2 backdrop-blur-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                site.availability.open ? 'animate-pulse-dot bg-lime' : 'bg-coral'
              }`}
              aria-hidden="true"
            />
            <span className="font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
              {site.availability.label}
            </span>
          </p>

          <p className="h-fade mt-9 font-mono text-sm tracking-[0.32em] text-aqua uppercase md:text-base">
            {profile.role} <span className="text-faint">·</span> {profile.role2}
          </p>

          <h1 className="mt-3 font-display leading-[0.92] font-bold tracking-tight">
            <span className="block overflow-hidden pb-1 text-hero">
              <SplitChars text="SRILAKSHMI" className="grad-chars inline-block" charClassName="h-char" />
            </span>
            <span className="block overflow-hidden pb-2 text-hero" aria-hidden="true">
              <SplitChars text="S." charClassName="h-char text-outline" />
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
              cursor="View work"
              aria-label="View my work — projects section"
            >
              View My Work <span aria-hidden="true">↓</span>
            </MagneticLink>
            <MagneticLink
              variant="ghost"
              href={site.resumePath}
              download="Srilakshmi-S-Resume.pdf"
              cursor="Download"
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
              data-cursor="GitHub"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand"
            >
              <GithubIcon size={17} />
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Srilakshmi on LinkedIn"
              data-cursor="LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua hover:text-aqua"
            >
              <LinkedinIcon size={17} />
            </a>
            <a
              href={`mailto:${profile.contact.email}`}
              aria-label="Email Srilakshmi"
              data-cursor="Email"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-coral hover:text-coral"
            >
              <Mail size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div className="h-parallax-photo relative mx-auto w-full max-w-[24rem] lg:max-w-[27rem]">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-brand/70 via-coral/50 to-aqua/60 opacity-70 blur-[6px]"
          />
          <div className="h-photo-wrap relative overflow-hidden rounded-[28px] border border-line shadow-2xl shadow-brand/20">
            <img
              src={profile.photo.portrait}
              alt={profile.photo.alt}
              width={1100}
              height={1375}
              fetchPriority="high"
              decoding="async"
              className="h-photo-img aspect-[4/5] h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-transparent"
            />
          </div>
          <div className="h-chip card animate-float-slow absolute top-10 -left-5 px-4 py-2 font-mono text-xs shadow-xl sm:-left-9">
            Python
          </div>
          <div className="h-chip card animate-float-slow absolute top-1/3 -right-4 px-4 py-2 font-mono text-xs shadow-xl [animation-delay:-3.2s] sm:-right-8">
            ML · Computer Vision
          </div>
          <div className="h-chip card animate-float-slow absolute -bottom-5 left-8 px-4 py-2 font-mono text-xs shadow-xl [animation-delay:-6.1s]">
            Flask · Deployed
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        onClick={(e) => jump(e, 'about')}
        className="h-fade absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-aqua"
        data-cursor="Scroll"
        aria-label="Scroll to the about section"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.34em] uppercase">Scroll</span>
        <span className="grid h-9 w-6 justify-center rounded-full border border-line pt-1.5" aria-hidden="true">
          <span className="animate-bounce h-2 w-1 rounded-full bg-aqua" />
        </span>
      </a>
    </section>
  )
}
