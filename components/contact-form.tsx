'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { site } from '@/content/site'
import { roleBySlug } from '@/content/roles'
import { ScrollReveal } from '@/components/scroll-reveal'

type Status = 'idle' | 'sending' | 'sent'

function ContactFormInner() {
  const params = useSearchParams()
  const roleSlug = params.get('role') ?? ''
  const role = roleSlug ? roleBySlug(roleSlug) : undefined

  const renderedAt = useRef(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subjectEdit, setSubjectEdit] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')

  const defaultSubject = role ? `Application: ${role.title}` : ''
  const subject = subjectEdit ?? defaultSubject

  useEffect(() => { renderedAt.current = Date.now() }, [])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name, email, subject, message, website, renderedAt: renderedAt.current,
          ...(role ? { role: role.slug } : {}),
        }),
      })
      const body = await response.json()

      if (!response.ok || !body.ok) {
        setError(body.error ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
      setStatus('sent')
    } catch {
      setError('We could not reach the server. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="sent">
        <h3>Message sent</h3>
        <p>Thanks for getting in touch. We read everything and will reply by email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="pair">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-subject">Subject</label>
        <input id="c-subject" value={subject} onChange={(e) => setSubjectEdit(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <button className="button" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}

export function ContactSection() {
  return (
    <section className="section" id="contact">
      <div className="shell">
        <ScrollReveal>
          <div className="section-head">
            <h2>Contact</h2>
            <p className="lede">Questions, partnerships, or press. We read everything.</p>
          </div>
          <div className="contact-grid">
            <div className="card contact-card">
              <Suspense fallback={<p className="lede">Loading the form.</p>}>
                <ContactFormInner />
              </Suspense>
            </div>
            <aside className="card contact-aside">
              <h3>Prefer Discord?</h3>
              <p>
                Most of our conversations happen there. Jump in and say hello, or send this form
                and it reaches the same place.
              </p>
              <a className="button" href={site.discordUrl} target="_blank" rel="noreferrer noopener">
                Join the Discord
              </a>
            </aside>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
