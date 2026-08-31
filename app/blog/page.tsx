import type { Metadata } from 'next'
import { site } from '@/content/site'
import { allPosts } from '@/content/posts'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PostCard } from '@/components/post-card'

const TITLE = `Devlog — ${site.name}`
const DESCRIPTION = 'Notes on what Spearpoint Studio is building, written while it is being built.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://spearpointstudio.com/blog',
    siteName: site.name,
    images: ['/brand/og.jpg'],
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = allPosts()

  return (
    <>
      <SiteHeader />
      <main className="shell blog-page">
        <p className="eyebrow">Devlog</p>
        <div className="page-head">
          <h1 className="page-title">What we are building</h1>
          <p className="lede">
            Notes from the studio, written while the work is still in progress rather than
            after it is finished.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="card empty-state">
            <h2>Nothing posted yet</h2>
            <p>
              We would rather post when there is something real to show than fill this page on a
              schedule. It updates the moment that changes, so it is worth a second look later.
            </p>
            <p>
              In the meantime, the day-to-day conversation happens in Discord, and you are
              welcome to join it.
            </p>
            <div className="empty-state-actions">
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
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.meta.slug} meta={post.meta} headingLevel={2} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
