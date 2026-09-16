import type { WikiSearchDoc } from '@/lib/wiki-search'
import { WIKI_CATEGORIES, pageText, type WikiCategory, type WikiPage } from './types'

import { page as breaches } from './breaches'
import { page as controls } from './controls'
import { page as dinosaurs } from './dinosaurs'
import { page as equipment } from './equipment'
import { page as gettingStarted } from './getting-started'
import { page as glossary } from './glossary'
import { page as medical } from './medical'
import { page as packs } from './packs'
import { page as progression } from './progression'
import { page as quests } from './quests'
import { page as ranks } from './ranks'
import { page as teams } from './teams'
import { page as vehicles } from './vehicles'
import { page as weapons } from './weapons'

const registry: WikiPage[] = [
  breaches,
  controls,
  dinosaurs,
  equipment,
  gettingStarted,
  glossary,
  medical,
  packs,
  progression,
  quests,
  ranks,
  teams,
  vehicles,
  weapons,
]

/** Within a category: by `order`, then title. Pages without an order sort last. */
function byOrderThenTitle(a: WikiPage, b: WikiPage): number {
  const orderA = a.meta.order ?? Number.MAX_SAFE_INTEGER
  const orderB = b.meta.order ?? Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) return orderA - orderB
  return a.meta.title.localeCompare(b.meta.title)
}

export function allWikiPages(): WikiPage[] {
  // Category order comes from WIKI_CATEGORIES, so the index reads in the order
  // someone would work through it rather than alphabetically.
  return [...registry].sort((a, b) => {
    const byCategory =
      WIKI_CATEGORIES.indexOf(a.meta.category) - WIKI_CATEGORIES.indexOf(b.meta.category)
    return byCategory !== 0 ? byCategory : byOrderThenTitle(a, b)
  })
}

export function wikiPageBySlug(slug: string): WikiPage | undefined {
  return registry.find((page) => page.meta.slug === slug)
}

export type WikiSection = { category: WikiCategory; pages: WikiPage[] }

/** Categories with no pages are dropped, so an empty heading never renders. */
export function wikiByCategory(): WikiSection[] {
  return WIKI_CATEGORIES.map((category) => ({
    category,
    pages: registry.filter((page) => page.meta.category === category).sort(byOrderThenTitle),
  })).filter((section) => section.pages.length > 0)
}

/**
 * The search index, derived from the same blocks the page renders from. There
 * is no second copy of the text to keep in step, so a page cannot be findable
 * by a word it no longer contains.
 */
export function wikiSearchIndex(): WikiSearchDoc[] {
  return allWikiPages().map((page) => ({
    slug: page.meta.slug,
    title: page.meta.title,
    category: page.meta.category,
    summary: page.meta.summary,
    keywords: page.meta.keywords ?? [],
    text: pageText(page),
  }))
}

export { WIKI_CATEGORIES, pageText, cellText } from './types'
export type { WikiBlock, WikiCategory, WikiCell, WikiMeta, WikiPage } from './types'
