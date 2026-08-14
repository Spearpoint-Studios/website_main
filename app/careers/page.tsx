import Link from 'next/link'
import type { Metadata } from 'next'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: `Careers at ${site.name}`,
  description: `Open roles at ${site.name}.`,
  openGraph: {
    title: `Careers at ${site.name}`,
    description: `Open roles at ${site.name}.`,
    url: 'https://spearpointstudio.com/careers',
    siteName: site.name,
    images: ['/brand/og.jpg'],
    type: 'website',
  },
}

export default function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell careers-page">
        <p className="eyebrow">Careers</p>
        <div className="card careers-empty">
          <h1>Nothing open right now</h1>
          <p>
            We are a small team, so we only post a role when there is real work behind it. This
            page updates the moment that changes, so it is worth a second look later.
          </p>
          <p>
            If you still want to reach us, say hello in Discord or send a message and tell us
            what you are good at. We read everything.
          </p>
          <div className="careers-empty-actions">
            <a className="button" href={site.discordUrl} target="_blank" rel="noreferrer noopener">
              Say hello on Discord
            </a>
            <Link className="button-link" href="/#contact">
              Send a message
              <span aria-hidden="true" className="button-link-chevron">&rsaquo;</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
