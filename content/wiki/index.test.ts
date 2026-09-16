import { describe, it, expect } from 'vitest'
import { searchWiki } from '@/lib/wiki-search'
import {
  allWikiPages,
  wikiPageBySlug,
  wikiByCategory,
  wikiSearchIndex,
  WIKI_CATEGORIES,
  cellText,
} from './index'
import { pageText } from './types'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

describe('wiki registry', () => {
  it('registers at least one page, so every assertion below has something to check', () => {
    expect(allWikiPages().length).toBeGreaterThan(0)
  })

  it('has unique slugs', () => {
    const slugs = allWikiPages().map((page) => page.meta.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has kebab-case slugs', () => {
    for (const { meta } of allWikiPages()) {
      expect(meta.slug).toMatch(SLUG)
    }
  })

  it('has a non-empty title and summary on every page', () => {
    for (const { meta } of allWikiPages()) {
      expect(meta.title.trim()).not.toBe('')
      expect(meta.summary.trim()).not.toBe('')
    }
  })

  it('puts every page in a known category', () => {
    for (const { meta } of allWikiPages()) {
      expect(WIKI_CATEGORIES).toContain(meta.category)
    }
  })

  it('gives every page at least one block, so no page renders blank', () => {
    for (const page of allWikiPages()) {
      expect(page.blocks.length).toBeGreaterThan(0)
    }
  })

  it('orders pages by category first, following WIKI_CATEGORIES', () => {
    const positions = allWikiPages().map((page) => WIKI_CATEGORIES.indexOf(page.meta.category))
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })
})

describe('wiki blocks', () => {
  it('has no empty text, heading or note', () => {
    for (const page of allWikiPages()) {
      for (const block of page.blocks) {
        if (block.kind === 'text' || block.kind === 'note') {
          expect(block.body.trim(), `${page.meta.slug}`).not.toBe('')
        }
        if (block.kind === 'heading') {
          expect(block.text.trim(), `${page.meta.slug}`).not.toBe('')
        }
      }
    }
  })

  it('has no empty list, and no empty item within one', () => {
    for (const page of allWikiPages()) {
      for (const block of page.blocks) {
        if (block.kind !== 'list') continue
        expect(block.items.length, `${page.meta.slug}`).toBeGreaterThan(0)
        for (const item of block.items) {
          expect(item.trim(), `${page.meta.slug}`).not.toBe('')
        }
      }
    }
  })

  it('gives every table row exactly as many cells as it has columns', () => {
    for (const page of allWikiPages()) {
      for (const block of page.blocks) {
        if (block.kind !== 'table') continue
        expect(block.columns.length, `${page.meta.slug}`).toBeGreaterThan(0)
        expect(block.rows.length, `${page.meta.slug}`).toBeGreaterThan(0)
        for (const row of block.rows) {
          // A short row silently shifts every cell after it into the wrong
          // column, which looks plausible and is wrong.
          expect(row.length, `${page.meta.slug} row: ${row.map(cellText).join(' | ')}`).toBe(
            block.columns.length,
          )
        }
      }
    }
  })

  it('starts every page with prose rather than a heading or a table', () => {
    for (const page of allWikiPages()) {
      expect(page.blocks[0].kind, `${page.meta.slug}`).toBe('text')
    }
  })
})

describe('wikiPageBySlug', () => {
  it('finds every registered page', () => {
    for (const page of allWikiPages()) {
      expect(wikiPageBySlug(page.meta.slug)).toBe(page)
    }
  })

  it('returns undefined for a slug that is not registered', () => {
    expect(wikiPageBySlug('not-a-real-page')).toBeUndefined()
    expect(wikiPageBySlug('')).toBeUndefined()
  })
})

describe('wikiByCategory', () => {
  it('lists every page exactly once across all sections', () => {
    const grouped = wikiByCategory().flatMap((section) => section.pages)
    expect(grouped).toHaveLength(allWikiPages().length)
    expect(new Set(grouped.map((page) => page.meta.slug)).size).toBe(grouped.length)
  })

  it('never returns an empty section, which would render a bare heading', () => {
    for (const section of wikiByCategory()) {
      expect(section.pages.length).toBeGreaterThan(0)
    }
  })

  it('puts each page under its own category', () => {
    for (const section of wikiByCategory()) {
      for (const page of section.pages) {
        expect(page.meta.category).toBe(section.category)
      }
    }
  })
})

describe('wikiSearchIndex', () => {
  it('has one document per page', () => {
    expect(wikiSearchIndex()).toHaveLength(allWikiPages().length)
  })

  it('carries the page body as text, so search covers more than the title', () => {
    for (const doc of wikiSearchIndex()) {
      expect(doc.text.length, doc.slug).toBeGreaterThan(50)
    }
  })

  it('derives text from the blocks, so it cannot drift from what renders', () => {
    for (const page of allWikiPages()) {
      const doc = wikiSearchIndex().find((entry) => entry.slug === page.meta.slug)
      expect(doc?.text).toBe(pageText(page))
    }
  })

  it('finds every page by its own title', () => {
    const index = wikiSearchIndex()
    for (const page of allWikiPages()) {
      const hits = searchWiki(index, page.meta.title)
      expect(hits.map((hit) => hit.doc.slug), page.meta.title).toContain(page.meta.slug)
    }
  })

  it('finds the pages a player would actually search for', () => {
    const index = wikiSearchIndex()
    const expectations: [query: string, slug: string][] = [
      ['m4a1', 'weapons'],
      ['shotgun', 'weapons'],
      ['handcuffs', 'equipment'],
      ['gencore', 'teams'],
      ['ranger director', 'ranks'],
      ['sniff', 'controls'],
      ['pack invite', 'packs'],
      ['rogue', 'breaches'],
      ['defibrillator', 'medical'],
      ['handbrake', 'vehicles'],
      ['daily', 'quests'],
      ['game pass', 'dinosaurs'],
      ['new player', 'getting-started'],
      ['stud', 'glossary'],
    ]
    for (const [query, slug] of expectations) {
      const hits = searchWiki(index, query)
      expect(hits.map((hit) => hit.doc.slug), query).toContain(slug)
    }
  })

  it('no longer mentions Facilities, which was removed from the game', () => {
    // A stale mention would send someone looking for a team that is not there.
    for (const doc of wikiSearchIndex()) {
      expect(`${doc.title} ${doc.summary} ${doc.text}`, doc.slug).not.toMatch(/Facilities/i)
    }
  })

  it('finds nothing for a word no page contains', () => {
    expect(searchWiki(wikiSearchIndex(), 'zzzzznotaword')).toEqual([])
  })
})
