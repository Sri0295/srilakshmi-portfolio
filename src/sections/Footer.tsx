import { useRef } from 'react'
import { ArrowUp, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { scrollToId } from '../lib/scroll'
import { profile } from '../data/profile'

const QUICK_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const titleRef = useRef<HTMLParagraphElement>(null)
  /* Subtle drift on the giant footer word */
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      titleRef.current,
      { xPercent: 4 },
      {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: titleRef.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      },
    )
  }, {})

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-deep pt-16">
      <div className="container-site relative">
        <div className="flex flex-wrap items-start justify-between gap-10 pb-14">
          <div className="max-w-sm">
            <a
              href="#hero"
              onClick={(e) => jump(e, 'hero')}
              className="flex w-fit items-center gap-3"
              aria-label="Back to top"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface font-display text-lg font-bold">
                <span className="text-gradient">SS</span>
              </span>
              <span className="font-display text-lg font-semibold">{profile.name}</span>
            </a>
            <p className="mt-4 text-sm text-muted">
              Software Engineer · Full Stack Developer — Python, Flask, Machine Learning and Computer Vision.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-faint uppercase">Quick links</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => jump(e, link.id)}
                    className="text-sm text-muted transition-colors hover:text-aqua"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-faint uppercase">Social</p>
            <div className="mt-4 flex gap-3">
              <a href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand">
                <GithubIcon size={16} />
              </a>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-aqua hover:text-aqua">
                <LinkedinIcon size={16} />
              </a>
              <a href={`mailto:${profile.contact.email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-coral hover:text-coral">
                <Mail size={16} aria-hidden="true" />
              </a>
            </div>
            <a
              href="#hero"
              onClick={(e) => jump(e, 'hero')}
              className="mt-6 inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] text-faint uppercase transition-colors hover:text-ink"
            >
              Back to top <ArrowUp size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        <p
          ref={titleRef}
          aria-hidden="true"
          className="text-outline pointer-events-none w-max font-display text-[18vw] leading-[0.8] font-bold whitespace-nowrap opacity-25 select-none"
        >
          SRILAKSHMI
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-6">
          <p className="font-mono text-[0.7rem] text-faint">
            © {year} {profile.name}. Built with React, GSAP and care.
          </p>
          <p className="font-mono text-[0.7rem] text-faint">Designed as a vibrant, cinematic experience.</p>
        </div>
      </div>
    </footer>
  )
}
