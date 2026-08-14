import Image from 'next/image'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { GamesSection } from '@/components/games-section'
import { CareersSection } from '@/components/careers-section'
import { ContactSection } from '@/components/contact-form'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="shell">
          <section className="hero">
            <h1>{site.tagline}</h1>
            <p>{site.description}</p>
            <a className="button" href="#games">See what we make</a>
          </section>
        </div>

        <div className="band">
          <Image src="/brand/cover.jpg" alt="" fill sizes="100vw" priority />
        </div>

        <div className="shell">
          <GamesSection />
          <CareersSection />
          <ContactSection />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
