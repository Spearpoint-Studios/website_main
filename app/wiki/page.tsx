import Link from 'next/link'
import type { Metadata } from 'next'
import { site } from '@/content/site'
import { wikiByCategory, allWikiPages, wikiSearchIndex } from '@/content/wiki'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WikiSearch } from '@/components/wiki-search'

const TITLE = `Wiki — ${site.name}`
const DESCRIPTION =
  'A guide to Dinosaur Park Roleplay: the teams, how experience and ranks work, the combat rules, and playing as a dinosaur.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://spearpointstudio.com/wiki',
    siteName: site.name,
    images: ['/brand/og.jpg'],
    type: 'website',
  },
}

export default function WikiPage() {
  const sections = wikiByCategory()
  // Derived from the same blocks the pages render from, then handed to the
  // client component as plain data.
  const index = wikiSearchIndex()

  return (
    <>
      <SiteHeader />
      <main className="shell wiki-page">
        <p className="eyebrow">Wiki</p>
        <div className="page-head">
          <h1 className="page-title">Dinosaur Park Roleplay</h1>
          <p className="lede">
            How the park actually works: what each team does, how you rank up,
            who is allowed to shoot whom, and what happens when an animal gets
            out.
          </p>
        </div>

        <WikiSearch index={index} />

        {allWikiPages().length === 0 ? (
          <div className="card empty-state">
            <h2>Nothing here yet</h2>
            <p>The wiki is being written. Check back shortly.</p>
          </div>
        ) : (
          <div className="wiki-index">
            {sections.map((section) => (
              <section key={section.category} className="wiki-index-section">
                <h2 className="wiki-index-heading">{section.category}</h2>
                <ul className="wiki-index-list">
                  {section.pages.map(({ meta }) => (
                    <li key={meta.slug}>
                      <Link className="card card-interactive wiki-card" href={`/wiki/${meta.slug}`}>
                        <span className="wiki-card-title">{meta.title}</span>
                        <span className="wiki-card-summary">{meta.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
