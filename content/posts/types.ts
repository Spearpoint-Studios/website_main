import type { ComponentType } from 'react'

export type PostTag = 'Devlog' | 'Update'

export type PostCover = {
  src: string
  alt: string
}

// A launch moment a post points at. `at` is an ISO timestamp with an explicit
// UTC offset, so the instant is unambiguous whatever the viewer's timezone.
export type PostCountdown = {
  at: string
  label: string
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  tag: PostTag
  excerpt: string
  cover?: PostCover
  countdown?: PostCountdown
}

export type PostModule = {
  meta: PostMeta
  default: ComponentType
}
