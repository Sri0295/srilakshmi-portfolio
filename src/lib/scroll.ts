import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  lenisInstance = lenis
}

export const getLenis = () => lenisInstance

/** Smooth-scrolls to a section id, working with or without Lenis. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -72, duration: 1.25 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
