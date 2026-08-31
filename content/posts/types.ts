import type { ComponentType } from 'react'

export type PostTag = 'Devlog' | 'Update'

export type PostCover = {
  src: string
  alt: string
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  tag: PostTag
  excerpt: string
  cover?: PostCover
}

export type PostModule = {
  meta: PostMeta
  default: ComponentType
}
