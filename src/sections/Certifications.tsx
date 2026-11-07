import { Award, BadgeCheck, ExternalLink, FileDown } from 'lucide-react'
import { Reveal } from '../components/animation/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { certifications } from '../data/certifications'

/**
 * BACKED BY PROOF — real certificate evidence. Each card links to the
 * owner-supplied PDF and, where printed on the certificate, the official
 * verification link. Nothing is fabricated.
 */
export default function Certifications() {
  return (
    <section
      id="certifications"
      aria-label="Certifications and achievements"
      className="section overflow-hidden"
    >
      <div className="container-site relative">
        <SectionHeading
          num="08"
          eyebrow="Credentials"
          title={
            <>
              BACKED BY <span className="text-gradient">PROOF.</span>
            </>
          }
          lead="Original certificates on file — view the document itself, or verify through the issuer where a link is printed."
        />

        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2" stagger>
          {certifications.map((cert) => (
            <article
              key={cert.id}
              className="card group relative flex flex-col gap-5 overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-coral">
                  <Award size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug font-semibold md:text-xl">{cert.title}</h3>
                  <p className="mt-1.5 font-mono text-xs tracking-wider text-muted uppercase">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] text-faint">
                {cert.issueDate && <span>Issued {cert.issueDate}</span>}
                {cert.verified && (
                  <span className="inline-flex items-center gap-1.5 text-coral">
                    <BadgeCheck size={13} aria-hidden="true" /> Certificate on file
                  </span>
                )}
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-1">
                {cert.pdf && (
                  <a
                    href={cert.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary !px-5 !py-2.5 text-sm"
                    aria-label={`View the ${cert.title} certificate (opens PDF in a new tab)`}
                  >
                    View certificate <FileDown size={14} aria-hidden="true" />
                  </a>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost !px-5 !py-2.5 text-sm"
                    aria-label={`Verify the ${cert.title} credential with the issuer`}
                  >
                    Verify <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
