import type { PostModule } from './types'

const registry: PostModule[] = []

export function allPosts(): PostModule[] {
  return [...registry].sort((a, b) => {
    const byDate = Date.parse(b.meta.date) - Date.parse(a.meta.date)
    return byDate !== 0 ? byDate : a.meta.slug.localeCompare(b.meta.slug)
  })
}

export function latestPosts(count: number): PostModule[] {
  return allPosts().slice(0, count)
}

export function postBySlug(slug: string): PostModule | undefined {
  return allPosts().find((post) => post.meta.slug === slug)
}

export type { PostMeta, PostModule, PostTag, PostCover } from './types'
