import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { getLenis, scrollToId, setLenis } from './lib/scroll'
import { useReducedMotion } from './hooks/useReducedMotion'
import { SECTION_IDS, useActiveSection } from './hooks/useActiveSection'
import type { CommandDefinition } from './data/commands'
import { profile } from './data/profile'
import { site } from './data/site'
import Preloader from './components/preloader/Preloader'
import Navbar from './components/navigation/Navbar'
import ScrollProgress from './components/ui/ScrollProgress'
import CommandPalette from './components/command-palette/CommandPalette'
import RecruiterView from './components/recruiter-view/RecruiterView'
import CaseStudyOverlay from './components/projects/CaseStudyOverlay'
import Hero from './sections/Hero'
import About from './sections/About'
import Highlights from './sections/Highlights'
import Timeline from './sections/Timeline'
import Expertise from './sections/Expertise'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  const reduced = useReducedMotion()

  /* Intro state — heavy preloader runs once per browser session;
     reduced-motion users never see it (decided in the initial state). */
  const [introDone, setIntroDone] = useState(() => {
    if (reduced) return true
    try {
      return sessionStorage.getItem('ss-intro-seen') === '1'
    } catch {
      return false
    }
  })
  const [showPreloader, setShowPreloader] = useState(!introDone)

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [recruiterOpen, setRecruiterOpen] = useState(false)
  const [caseStudy, setCaseStudy] = useState<string | null>(() => {
    const match = window.location.hash.match(/^#project\/([\w-]+)/)
    return match ? match[1] : null
  })

  const active = useActiveSection([...SECTION_IDS])

  /* Lenis smooth scrolling + GSAP integration */
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])

  /* Scroll lock while any overlay is open */
  const overlayOpen = paletteOpen || recruiterOpen || caseStudy !== null
  useEffect(() => {
    const lenis = getLenis()
    if (overlayOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [overlayOpen])

  /* Case study ⇄ URL hash (survives refresh, works with browser back) */
  const syncFromHash = useCallback(() => {
    const match = window.location.hash.match(/^#project\/([\w-]+)/)
    setCaseStudy(match ? match[1] : null)
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', syncFromHash)
    window.addEventListener('hashchange', syncFromHash)
    return () => {
      window.removeEventListener('popstate', syncFromHash)
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [syncFromHash])

  const openProject = useCallback((slug: string) => {
    setCaseStudy(slug)
    window.history.pushState(null, '', `#project/${slug}`)
  }, [])

  const closeProject = useCallback(() => {
    setCaseStudy(null)
    if (window.location.hash.startsWith('#project/')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  /* Ctrl/Cmd + K — never hijacks the shortcut while typing in a form field
     (the palette's own search input is exempt so Ctrl+K still closes it). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const target = e.target as HTMLElement | null
        const typingField = target?.closest('input, textarea, select, [contenteditable="true"]')
        if (typingField && !typingField.closest('[role="dialog"]')) return
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Command execution: the palette is closed first; its unmount releases the
     Lenis scroll lock (lenis.stop() + overflow hidden), and scrolling while
     locked is a silent no-op — hence the deferred action. */
  const runCommandAction = useCallback(
    (command: CommandDefinition) => {
      setPaletteOpen(false)
      window.setTimeout(() => {
        switch (command.action.type) {
          case 'scroll':
            scrollToId(command.action.sectionId)
            break
          case 'download-resume': {
            const anchor = document.createElement('a')
            anchor.href = site.resumePath
            anchor.download = 'Srilakshmi-S-Resume.pdf'
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            break
          }
          case 'recruiter':
            setRecruiterOpen(true)
            return
          case 'case-study':
            openProject(command.action.slug)
            return
          case 'link':
            window.open(command.action.url, '_blank', 'noopener')
            break
          case 'copy-email':
            navigator.clipboard?.writeText(profile.contact.email).catch(() => {})
            break
        }
      }, 100)
    },
    [openProject],
  )

  /* Restore keyboard focus to the palette trigger after plain dismissal */
  const hadPalette = useRef(false)
  useEffect(() => {
    if (hadPalette.current && !paletteOpen && !recruiterOpen && caseStudy === null) {
      document.getElementById('command-palette-trigger')?.focus()
    }
    hadPalette.current = paletteOpen
  }, [paletteOpen, recruiterOpen, caseStudy])

  /* Recalculate scroll geometry once the intro hands over */
  useEffect(() => {
    if (!introDone) return
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(t)
  }, [introDone])

  const handleIntroComplete = useCallback(() => {
    setShowPreloader(false)
    setIntroDone(true)
  }, [])

  return (
    <>
      <a
        href="#about"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          scrollToId('about')
        }}
      >
        Skip to content
      </a>

      {showPreloader && !reduced && <Preloader onComplete={handleIntroComplete} />}

      <Navbar
        active={active}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenRecruiter={() => setRecruiterOpen(true)}
      />

      <ScrollProgress active={active} />

      <main>
        <Hero introDone={introDone} />
        <About />
        <Highlights onOpenProject={openProject} />
        <Timeline onOpenProject={openProject} />
        <Expertise />
        <Projects onOpenProject={openProject} />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      {caseStudy && (
        <CaseStudyOverlay slug={caseStudy} onClose={closeProject} onNavigate={openProject} />
      )}
      {recruiterOpen && (
        <RecruiterView
          onClose={() => setRecruiterOpen(false)}
          onOpenProject={(slug) => {
            setRecruiterOpen(false)
            openProject(slug)
          }}
        />
      )}
      {paletteOpen && <CommandPalette onDismiss={() => setPaletteOpen(false)} onExecute={runCommandAction} />}
    </>
  )
}
