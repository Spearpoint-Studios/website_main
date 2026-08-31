import type { PostModule } from './types'

import * as buildingTheForest from './2026-08-15-building-the-forest'
import * as aFenceAndAViaduct from './2026-08-22-a-fence-and-a-viaduct'
import * as thisSiteHasADevlog from './2026-08-31-this-site-has-a-devlog'

const registry: PostModule[] = [
  buildingTheForest,
  aFenceAndAViaduct,
  thisSiteHasADevlog,
]

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
