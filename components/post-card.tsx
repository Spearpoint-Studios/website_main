import Image from 'next/image'
import Link from 'next/link'
import type { PostMeta } from '@/content/posts'
import { formatPostDate } from '@/lib/post-date'

type PostCardProps = {
  meta: PostMeta
  headingLevel?: 2 | 3
}

export function PostCard({ meta, headingLevel = 3 }: PostCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <Link href={`/blog/${meta.slug}`} className="card post-card">
      {meta.cover ? (
        <div className="post-card-cover">
          <Image
            src={meta.cover.src}
            alt=""
            fill
            sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw"
          />
        </div>
      ) : null}
      <div className="post-card-body">
        <span className="post-tag">{meta.tag}</span>
        <Heading className="post-card-title">{meta.title}</Heading>
        <time className="post-card-date" dateTime={meta.date}>
          {formatPostDate(meta.date)}
        </time>
        <p className="post-card-excerpt">{meta.excerpt}</p>
      </div>
    </Link>
  )
}
