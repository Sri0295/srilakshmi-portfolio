import { useRef } from 'react'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { profile } from '../data/profile'
import { education } from '../data/education'
import { certifications } from '../data/certifications'

const primary = education.find((e) => e.primary)!

/** About — light lavender section with the owner's real photograph. */
export default function About() {
  const photoRef = useRef<HTMLDivElement>(null)

  /* Gentle scroll drift + tilt on the portrait */
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      photoRef.current,
      { yPercent: 6, rotate: 1.5 },
      {
        yPercent: -6,
        rotate: -1.5,
        ease: 'none',
        scrollTrigger: { trigger: photoRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, {})

  return (
    <section id="about" aria-label="About Srilakshmi" className="section section-light overflow-hidden">
      <div aria-hidden="true" className="absolute -top-24 right-[-8rem] h-96 w-96 rounded-full bg-coral/25 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-6rem] left-[-6rem] h-96 w-96 rounded-full bg-brand/15 blur-3xl" />

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Photograph */}
        <div ref={photoRef} className="relative mx-auto w-full max-w-[22rem] will-change-transform lg:max-w-[24rem]">
          <div aria-hidden="true" className="absolute -inset-3 rounded-[30px] border-2 border-dashed border-[rgba(34,28,63,0.25)]" />
          <div className="relative overflow-hidden rounded-[24px] shadow-2xl shadow-[rgba(34,28,63,0.35)]">
            <img
              src={profile.photo.square}
              alt={profile.photo.alt}
              width={1000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--light-ink)] px-5 py-2.5 shadow-lg">
            <GraduationCap size={15} className="text-lime" aria-hidden="true" />
            <span className="font-mono text-[0.7rem] tracking-wider text-[var(--light-surface)] uppercase">
              {primary.institution} · {primary.result}
            </span>
          </div>
        </div>

        {/* Copy */}
        <div>
          <SectionHeading
            num="02"
            eyebrow="About"
            title={
              <>
                MORE THAN <span className="text-gradient">JUST CODE.</span>
              </>
            }
          />
          <Reveal className="mt-7 space-y-5" stagger>
            {profile.about.map((para) => (
              <p key={para.slice(0, 24)} className="max-w-2xl opacity-90">
                {para}
              </p>
            ))}
          </Reveal>

          <Reveal className="mt-8" stagger>
            <p className="font-mono text-[0.7rem] tracking-[0.26em] uppercase opacity-60">
              Engineering interests
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {['Full Stack Development', 'Machine Learning', 'Computer Vision', 'Data Analytics'].map(
                (interest) => (
                  <li key={interest} className="chip !border-[rgba(34,28,63,0.25)] !text-[var(--light-ink)]">
                    {interest}
                  </li>
                ),
              )}
            </ul>
          </Reveal>

          <Reveal className="mt-8" stagger>
            <p className="font-mono text-[0.7rem] tracking-[0.26em] uppercase opacity-60">
              Certified by
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="chip !border-[rgba(34,28,63,0.25)] !text-[var(--light-ink)]"
                  title={cert.issuer}
                >
                  {cert.issuer.split(' ')[0]}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-9">
            <a
              href="/resume/Srilakshmi-S-Resume.pdf"
              download="Srilakshmi-S-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--light-ink)] px-6 py-3 font-display text-sm font-semibold text-[var(--light-surface)] transition-transform duration-300 hover:-translate-y-0.5"
              data-cursor="Download"
            >
              Download résumé <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
