import Image from 'next/image'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DevSection } from '@/components/dev-section'
import { CareersSection } from '@/components/careers-section'
import { ContactSection } from '@/components/contact-form'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <Image
              src="/brand/cover.jpg"
              alt=""
              fill
              sizes="100vw"
              priority
              className="hero-bg-img"
            />
            <div className="hero-overlay" />
          </div>

          <div className="shell hero-content">
            <p className="eyebrow hero-eyebrow">Roblox game studio</p>
            <h1 className="hero-title">{site.tagline}</h1>
            <p className="hero-lede">{site.description}</p>
            <div className="hero-cta">
              <a className="button" href="#contact">Get in touch</a>
              <a
                className="button"
                href={site.discordUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Join the Discord
              </a>
            </div>
          </div>

          <div className="hero-cue-row">
            <span className="scroll-cue" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </section>

        <DevSection />
        <CareersSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
