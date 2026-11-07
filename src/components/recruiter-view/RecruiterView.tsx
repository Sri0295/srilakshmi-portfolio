import { useEffect, useRef } from 'react'
import { ArrowUpRight, Award, Briefcase, Download, GraduationCap, Printer, X } from 'lucide-react'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { profile } from '../../data/profile'
import { site } from '../../data/site'
import { skillGroups } from '../../data/skills'
import { projects } from '../../data/projects'
import { education } from '../../data/education'
import { certifications } from '../../data/certifications'
import { experience } from '../../data/experience'

interface Props {
  onClose: () => void
  onOpenProject: (slug: string) => void
}

const primaryEducation = education[0]
const publishedExperience = experience.filter((e) => e.publish)

/**
 * FEATURE B — Recruiter Quick View: everything a recruiter needs in one
 * compact, print-friendly panel, bypassing the cinematic experience.
 */
export default function RecruiterView({ onClose, onOpenProject }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduced = prefersReducedMotion()

  useGSAP(() => {
    if (reduced) return
    gsap.fromTo(panelRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
  }, {})

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const coreSkills = Array.from(new Set(skillGroups.flatMap((c) => c.skills)))

  return (
    <div
      className="fixed inset-0 z-[118] overflow-y-auto bg-bg/80 p-4 backdrop-blur-md sm:p-8"
      data-lenis-prevent
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Recruiter quick view"
        className="card mx-auto my-auto w-full max-w-2xl p-7 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface-2 font-display text-xl font-bold text-coral">
              SS
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">{profile.name}</h2>
              <p className="mt-0.5 font-mono text-xs tracking-[0.18em] text-aqua uppercase">
                {profile.role} · {profile.role2}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
                {site.availability.label}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close recruiter view"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-coral hover:text-coral"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-7 space-y-6">
          {/* Education */}
          <section aria-label="Education">
            <h3 className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.26em] text-faint uppercase">
              <GraduationCap size={13} aria-hidden="true" /> Education
            </h3>
            <p className="mt-2.5 text-sm">
              <strong>{primaryEducation.degree}</strong> — {primaryEducation.institution}
              <span className="text-muted"> · {primaryEducation.period} · {primaryEducation.result}</span>
            </p>
          </section>

          {/* Core skills */}
          <section aria-label="Core technical skills">
            <h3 className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.26em] text-faint uppercase">
              <Briefcase size={13} aria-hidden="true" /> Core technical skills
            </h3>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {coreSkills.map((skill) => (
                <li key={skill} className="chip !py-1">
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          {/* Project highlights */}
          <section aria-label="Project highlights">
            <h3 className="font-mono text-[0.68rem] tracking-[0.26em] text-faint uppercase">Project highlights</h3>
            <ul className="mt-2.5 space-y-2.5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onOpenProject(p.slug)
                    }}
                    className="group flex w-full items-start justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left transition-colors hover:border-brand"
                  >
                    <span>
                      <span className="block text-sm font-semibold">{p.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">{p.tagline}</span>
                    </span>
                    <ArrowUpRight size={14} className="mt-1 shrink-0 text-faint transition-colors group-hover:text-brand" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Experience */}
          <section aria-label="Experience">
            <h3 className="font-mono text-[0.68rem] tracking-[0.26em] text-faint uppercase">Experience</h3>
            {publishedExperience.length > 0 ? (
              <ul className="mt-2.5 space-y-2">
                {publishedExperience.map((e) => (
                  <li key={e.id} className="text-sm">
                    <strong>{e.role}</strong> — {e.org}
                    <span className="text-muted"> · {e.period}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-sm text-muted">
                Internship completed in 2025 — title, dates and scope are being confirmed and will be published
                shortly.
              </p>
            )}
          </section>

          {/* Certifications */}
          <section aria-label="Certifications">
            <h3 className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.26em] text-faint uppercase">
              <Award size={13} aria-hidden="true" /> Certifications
            </h3>
            <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.id} className="text-xs text-muted">
                  <span className="text-ink">{c.title}</span> — {c.issuer}
                </li>
              ))}
            </ul>
          </section>

          {/* Contact + actions */}
          <section aria-label="Contact" className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <a href={`mailto:${profile.contact.email}`} className="btn btn-primary !px-5 !py-2.5 text-sm">
              {profile.contact.email}
            </a>
            <a href={site.resumePath} download="Srilakshmi-S-Resume.pdf" className="btn btn-ghost !px-5 !py-2.5 text-sm">
              <Download size={14} aria-hidden="true" /> Résumé
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-ghost !px-4 !py-2.5 text-sm"
            >
              <Printer size={14} aria-hidden="true" /> Print
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
