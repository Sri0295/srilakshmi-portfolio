import { useEffect, useState } from 'react'

/** Tracks which section is crossing the viewport's centre band. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join(',')

  useEffect(() => {
    const list = key.split(',')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-38% 0px -55% 0px' },
    )
    for (const id of list) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [key])

  return active
}

export const SECTION_IDS = [
  'hero',
  'about',
  'highlights',
  'experience',
  'expertise',
  'projects',
  'education',
  'certifications',
  'contact',
] as const
