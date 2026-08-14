import Link from 'next/link'
import { ScrollReveal } from '@/components/scroll-reveal'

export function CareersSection() {
  return (
    <section className="section section--alt" id="careers-teaser">
      <div className="shell">
        <ScrollReveal>
          <Link href="/careers" className="card card-teaser">
            <div className="card-teaser-text">
              <h2>Careers</h2>
              <p className="lede">
                We are a small team, and everyone here owns something real. See how to reach us
                and what it is like to work with us.
              </p>
            </div>
            <span className="card-teaser-go" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
