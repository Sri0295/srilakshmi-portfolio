import { useEffect, useRef, useState } from 'react'
import { Briefcase, Command, Mail, Menu, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { gsap, useGSAP } from '../../lib/gsap'
import { getLenis, scrollToId } from '../../lib/scroll'
import { SECTION_IDS } from '../../hooks/useActiveSection'
import { profile } from '../../data/profile'

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

interface NavbarProps {
  active: string
  onOpenPalette: () => void
  onOpenRecruiter: () => void
}

export default function Navbar({
  active,
  onOpenPalette,
  onOpenRecruiter,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const activeNum = String(Math.max(1, SECTION_IDS.indexOf(active as (typeof SECTION_IDS)[number]) + 1)).padStart(2, '0')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll lock while the mobile menu is open */
  useEffect(() => {
    const lenis = getLenis()
    if (menuOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  /* Menu transition */
  useGSAP(
    () => {
      if (!menuOpen) return
      const overlay = overlayRef.current
      if (!overlay) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(
        overlay,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' },
      )
        .fromTo(
          overlay.querySelectorAll('.m-item'),
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
          '-=0.25',
        )
      return () => {
        tl.kill()
      }
    },
    { dependencies: [menuOpen] },
  )

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    // wait for the menu to release the scroll lock
    window.setTimeout(() => scrollToId(id), 60)
  }

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    go(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'border-b border-line bg-bg/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-site flex h-[4.25rem] items-center justify-between gap-4"
        >
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => jump(e, 'hero')}
            className="group flex items-center gap-3"
            aria-label="Srilakshmi S — back to top"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface font-display text-lg font-bold transition-transform duration-300 group-hover:rotate-[-6deg]">
              <span className="text-gradient">SS</span>
            </span>
            <span className="hidden font-mono text-meta tracking-[0.28em] text-muted uppercase sm:inline">
              {profile.name}
            </span>
            <span
              className="hidden font-mono text-meta text-faint md:inline"
              aria-hidden="true"
            >
              {activeNum} / {SECTION_IDS.length}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => jump(e, link.id)}
                    className={`group relative font-mono text-[0.78rem] tracking-[0.18em] uppercase transition-colors ${
                      isActive ? 'text-aqua' : 'text-muted hover:text-ink'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-aqua transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="command-palette-trigger"
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 font-mono text-[0.7rem] text-muted transition-colors hover:border-aqua hover:text-aqua xl:flex"
              aria-label="Open command palette (Ctrl+K)"
            >
              <Command size={13} aria-hidden="true" /> Ctrl K
            </button>
            <button
              type="button"
              onClick={onOpenRecruiter}
              className="hidden items-center gap-2 rounded-full border border-line px-3.5 py-2 font-mono text-[0.7rem] tracking-wider text-muted uppercase transition-colors hover:border-coral hover:text-coral lg:flex"
            >
              <Briefcase size={13} aria-hidden="true" /> Recruiter view
            </button>
            <button
              type="button"
              onClick={() => go('contact')}
              className="btn btn-primary hidden !px-5 !py-2.5 text-sm lg:inline-flex"
            >
              Hire Me
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          className="fixed inset-0 z-[99] flex flex-col bg-bg-deep lg:hidden"
          style={{ clipPath: 'inset(0 0 100% 0)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-coral/20 blur-3xl" aria-hidden="true" />

          <nav aria-label="Mobile" className="container-site flex flex-1 flex-col justify-center gap-2 pt-16">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className="m-item group flex items-baseline gap-4 border-b border-line/60 py-4 text-left"
              >
                <span className="font-mono text-sm text-aqua">0{i + 1}</span>
                <span
                  className={`font-display text-4xl font-bold tracking-tight transition-colors sm:text-5xl ${
                    active === link.id ? 'text-gradient' : 'text-ink group-hover:text-lavender'
                  }`}
                >
                  {link.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="m-item container-site flex flex-wrap items-center gap-4 pb-10">
            <div className="flex items-center gap-3">
              <a href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted"><GithubIcon size={17} /></a>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted"><LinkedinIcon size={17} /></a>
              <a href={`mailto:${profile.contact.email}`} aria-label="Email" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted"><Mail size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
