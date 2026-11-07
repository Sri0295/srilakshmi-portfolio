import { useEffect, useState } from 'react'

/** FEATURE F — press "G" to flash a 12-column layout grid (designer easter egg). */
export default function GridOverlay() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key.toLowerCase() === 'g') setOn((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div aria-hidden="true" className={`grid-overlay ${on ? 'on' : ''}`}>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}
