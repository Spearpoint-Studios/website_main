import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { site } from '@/content/site'
import { allPosts, postBySlug } from '@/content/posts'
import { formatPostDate } from '@/lib/post-date'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

type PostPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return allPosts().map((post) => ({ slug: post.meta.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post) return {}

  const { meta } = post
  const title = `${meta.title} — ${site.name}`

  return {
    title,
    description: meta.excerpt,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      url: `https://spearpointstudio.com/blog/${meta.slug}`,
      siteName: site.name,
      images: [meta.cover?.src ?? '/brand/og.jpg'],
      type: 'article',
      publishedTime: meta.date,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post) notFound()

  const { meta, default: Body } = post

  return (
    <>
      <SiteHeader />
      <main className="shell post-page">
        <article>
          <header className="post-head">
            <p className="eyebrow">{meta.tag}</p>
            <h1 className="post-title">{meta.title}</h1>
            <time className="post-date" dateTime={meta.date}>
              {formatPostDate(meta.date)}
            </time>
          </header>

          {meta.cover ? (
            <figure className="showcase post-cover">
              <Image
                src={meta.cover.src}
                alt={meta.cover.alt}
                width={1920}
                height={1080}
                sizes="(min-width: 56rem) 832px, 100vw"
                priority
              />
            </figure>
          ) : null}

          <div className="prose">
            <Body />
          </div>
        </article>

        <div className="post-foot">
          <Link className="button-link" href="/blog">
            All posts
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
