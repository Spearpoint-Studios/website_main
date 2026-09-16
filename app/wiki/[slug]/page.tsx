import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { site } from '@/content/site'
import { allWikiPages, wikiPageBySlug, wikiByCategory } from '@/content/wiki'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WikiBlocks } from '@/components/wiki-blocks'

type WikiArticleProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return allWikiPages().map((page) => ({ slug: page.meta.slug }))
}

export async function generateMetadata({ params }: WikiArticleProps): Promise<Metadata> {
  const { slug } = await params
  const page = wikiPageBySlug(slug)
  if (!page) return {}

  const { meta } = page
  return {
    title: `${meta.title} — Wiki — ${site.name}`,
    description: meta.summary,
    openGraph: {
      title: meta.title,
      description: meta.summary,
      url: `https://spearpointstudio.com/wiki/${meta.slug}`,
      siteName: site.name,
      images: ['/brand/og.jpg'],
      type: 'article',
    },
  }
}

export default async function WikiArticle({ params }: WikiArticleProps) {
  const { slug } = await params
  const page = wikiPageBySlug(slug)
  if (!page) notFound()

  const { meta, blocks } = page

  // Sibling pages in the same category, so the end of an article offers
  // somewhere to go that is actually related.
  const siblings =
    wikiByCategory()
      .find((section) => section.category === meta.category)
      ?.pages.filter((sibling) => sibling.meta.slug !== meta.slug) ?? []

  return (
    <>
      <SiteHeader />
      <main className="shell wiki-article">
        <nav className="wiki-crumbs" aria-label="Breadcrumb">
          <Link href="/wiki">Wiki</Link>
          <span aria-hidden="true"> / </span>
          <span>{meta.category}</span>
        </nav>

        <article>
          <header className="page-head">
            <h1 className="page-title">{meta.title}</h1>
            <p className="lede">{meta.summary}</p>
          </header>

          <div className="prose">
            <WikiBlocks blocks={blocks} />
          </div>
        </article>

        {siblings.length > 0 ? (
          <aside className="wiki-related">
            <h2 className="wiki-related-heading">More in {meta.category}</h2>
            <ul className="wiki-index-list">
              {siblings.map((sibling) => (
                <li key={sibling.meta.slug}>
                  <Link
                    className="card card-interactive wiki-card"
                    href={`/wiki/${sibling.meta.slug}`}
                  >
                    <span className="wiki-card-title">{sibling.meta.title}</span>
                    <span className="wiki-card-summary">{sibling.meta.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="post-foot">
          <Link className="button-link" href="/wiki">
            All wiki pages
            <span aria-hidden="true" className="button-link-chevron">
              &rsaquo;
            </span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
