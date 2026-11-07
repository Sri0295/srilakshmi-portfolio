import { useState, useRef, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons'
import { Reveal } from '../components/animation/Reveal'
import { SplitChars } from '../components/animation/SplitText'
import { MagneticLink } from '../components/ui/Buttons'
import { profile } from '../data/profile'
import { site } from '../data/site'

type FormStatus = 'idle' | 'invalid' | 'sending' | 'success' | 'error' | 'unconfigured'

const MAX_MESSAGE_LENGTH = 2000

/** Contact — violet-to-coral treatment, submitting through Formspree. */
export default function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: false, email: false, message: false })
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return // duplicate-submission guard

    const form = e.currentTarget
    const data = new FormData(form)

    /* Honeypot — bots fill hidden fields */
    if (data.get('_gotcha')) return

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const errors = {
      name: !name,
      email: !emailOk,
      message: !message || message.length > MAX_MESSAGE_LENGTH,
    }
    setFieldErrors(errors)

    if (errors.name || errors.email || errors.message) {
      setStatus('invalid')
      setStatusMessage(
        errors.message && message.length > MAX_MESSAGE_LENGTH
          ? `Please keep the message under ${MAX_MESSAGE_LENGTH} characters.`
          : 'Please fill in your name, a valid email address and a message.',
      )
      // Focus the first invalid field for keyboard and screen-reader users
      const firstInvalid = errors.name ? nameRef : errors.email ? emailRef : messageRef
      firstInvalid.current?.focus()
      return
    }

    const endpoint = site.contactForm.endpoint
    if (!endpoint) {
      setStatus('unconfigured')
      setStatusMessage(
        'The contact service has not been connected yet, so this message cannot be sent. Please use email or LinkedIn instead — the site owner can enable the form in one line of configuration (see README).',
      )
      return
    }

    try {
      setStatus('sending')
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (res.ok) {
        setStatus('success')
        setStatusMessage("Thank you! Your message has been sent successfully. I'll get back to you soon.")
        form.reset()
        setFieldErrors({ name: false, email: false, message: false })
      } else {
        // Formspree reports problems as { errors: [...] } — surface the real
        // reason, keep the visitor's text, and let them retry.
        const payload = (await res.json().catch(() => null)) as { errors?: { message?: string }[] } | null
        const detail = payload?.errors?.[0]?.message
        setStatus('error')
        setStatusMessage(
          detail
            ? `The message could not be sent (${detail}). Please try again or use email directly.`
            : 'The message could not be sent right now. Please try again or use email directly.',
        )
      }
    } catch {
      setStatus('error')
      setStatusMessage('Network problem — the message was not sent. Please check your connection and try again.')
    }
  }

  const fieldClass = (invalid: boolean) =>
    `w-full rounded-xl border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-coral ${
      invalid ? 'border-coral' : 'border-line'
    }`

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="section relative overflow-hidden bg-bg-deep/50"
    >
      <div className="container-site relative grid gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="text-coral">09</span> Contact
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] font-bold tracking-tight">
              <SplitChars text="LET'S CREATE" className="block" charClassName="inline-block" />
              <span className="grad-chars block">
                <SplitChars text="SOMETHING" className="inline-block" charClassName="inline-block" />
              </span>
              <SplitChars text="MEANINGFUL." className="block" charClassName="inline-block" />
            </h2>
            <p className="mt-6 max-w-lg text-muted">
              Have an opportunity, project or collaboration in mind? Let's connect.
            </p>
          </Reveal>

          <Reveal className="mt-10 space-y-3.5" stagger>
            <a
              href={`mailto:${profile.contact.email}`}
              className="group flex w-fit items-center gap-4 text-ink"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-coral transition-colors group-hover:border-coral">
                <Mail size={17} aria-hidden="true" />
              </span>
              <span className="font-mono text-sm sm:text-base">{profile.contact.email}</span>
            </a>
            <div className="flex gap-3 pt-3">
              <MagneticLink variant="ghost" href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="!px-4 !py-2.5 text-sm">
                <LinkedinIcon size={16} /> LinkedIn
              </MagneticLink>
              <MagneticLink variant="ghost" href={profile.contact.github} target="_blank" rel="noreferrer" className="!px-4 !py-2.5 text-sm">
                <GithubIcon size={16} /> GitHub
              </MagneticLink>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal className="card relative p-7 md:p-9">
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div>
              <label htmlFor="contact-name" className="mb-1.5 block font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                ref={nameRef}
                aria-invalid={fieldErrors.name || undefined}
                aria-describedby="contact-status"
                className={fieldClass(fieldErrors.name)}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                ref={emailRef}
                aria-invalid={fieldErrors.email || undefined}
                aria-describedby="contact-status"
                className={fieldClass(fieldErrors.email)}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Tell me about the opportunity…"
                ref={messageRef}
                aria-invalid={fieldErrors.message || undefined}
                aria-describedby="contact-status"
                className={`${fieldClass(fieldErrors.message)} resize-none`}
              />
              <p className="mt-1 text-right font-mono text-[0.62rem] text-faint">
                Up to {MAX_MESSAGE_LENGTH.toLocaleString()} characters
              </p>
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:opacity-60">
              {status === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  Send message <Send size={15} aria-hidden="true" />
                </>
              )}
            </button>

            <div id="contact-status" role="status" aria-live="polite">
              {status === 'invalid' && (
                <p className="flex items-start gap-2 text-xs text-coral">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> {statusMessage}
                </p>
              )}
              {status === 'unconfigured' && (
                <p className="flex items-start gap-2 text-xs text-muted">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> {statusMessage}
                </p>
              )}
              {status === 'success' && (
                <p className="flex items-start gap-2 text-xs text-coral">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> {statusMessage}
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-start gap-2 text-xs text-coral">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> {statusMessage}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
