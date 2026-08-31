import Link from 'next/link'
import { latestPosts } from '@/content/posts'
import { PostCard } from '@/components/post-card'
import { ScrollReveal } from '@/components/scroll-reveal'

export function LatestPosts() {
  const posts = latestPosts(3)
  if (posts.length === 0) return null

  return (
    <section className="section" id="latest">
      <div className="shell">
        <ScrollReveal>
          <div className="section-head">
            <h2>Latest</h2>
            <p className="lede">What we are building, in our own words.</p>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.meta.slug} meta={post.meta} />
            ))}
          </div>
          <div className="section-foot">
            <Link className="button-link" href="/blog">
              Read all posts
              <span aria-hidden="true" className="button-link-chevron">
                &rsaquo;
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
