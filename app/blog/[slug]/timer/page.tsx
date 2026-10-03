import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { site } from '@/content/site'
import { allPosts, postBySlug } from '@/content/posts'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Countdown } from '@/components/countdown'

type TimerPageProps = { params: Promise<{ slug: string }> }

// Only posts that carry a countdown get a timer page; every other slug 404s.
export const dynamicParams = false

export function generateStaticParams() {
  return allPosts()
    .filter((post) => post.meta.countdown)
    .map((post) => ({ slug: post.meta.slug }))
}

export async function generateMetadata({ params }: TimerPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post?.meta.countdown) return {}

  const { meta } = post
  const title = `Countdown: ${meta.title} — ${site.name}`

  return {
    title,
    description: meta.excerpt,
    openGraph: {
      title: `Countdown: ${meta.title}`,
      description: meta.excerpt,
      url: `https://spearpointstudio.com/blog/${meta.slug}/timer`,
      siteName: site.name,
      images: [meta.cover?.src ?? '/brand/og.jpg'],
      type: 'website',
    },
  }
}

export default async function TimerPage({ params }: TimerPageProps) {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post?.meta.countdown) notFound()

  const { meta } = post
  const countdown = meta.countdown!

  return (
    <>
      <SiteHeader />
      <main className="shell post-page timer-page">
        <header className="post-head">
          <p className="eyebrow">Countdown</p>
          <h1 className="post-title">{meta.title}</h1>
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

        <Countdown at={countdown.at} label={countdown.label} />

        <div className="post-foot">
          <Link className="button-link" href={`/blog/${meta.slug}`}>
            Read the announcement
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
