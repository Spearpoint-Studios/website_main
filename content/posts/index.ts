import type { PostModule } from './types'

import * as developmentUpdate from './2026-09-06-development-update'
import * as releaseDate from './2026-10-03-release-date'
import * as releaseNotesV02 from './2026-10-18-release-notes-v0-2'

const registry: PostModule[] = [developmentUpdate, releaseDate, releaseNotesV02]

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

export type { PostMeta, PostModule, PostTag, PostCover, PostCountdown } from './types'
