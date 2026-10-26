import { describe, it, expect } from 'vitest'
import { normalize, tokenize, searchWiki, type WikiSearchDoc } from './wiki-search'

function doc(overrides: Partial<WikiSearchDoc> = {}): WikiSearchDoc {
  return {
    slug: 'field-rangers',
    title: 'Field Rangers',
    category: 'Teams',
    summary: 'The team that patrols the park and responds to escaped animals.',
    keywords: ['ranger', 'patrol'],
    text: 'Field Rangers unlock at 2500 XP and carry tranquilliser equipment.',
    ...overrides,
  }
}

describe('normalize', () => {
  it('lowercases and folds punctuation to spaces so "T-Rex" and "t rex" agree', () => {
    expect(normalize('T-Rex')).toBe('t rex')
    expect(normalize('T Rex')).toBe('t rex')
  })

  it('strips surrounding whitespace and collapses runs', () => {
    expect(normalize('  Helix   Genetics!  ')).toBe('helix genetics')
  })

  it('returns an empty string for punctuation alone', () => {
    expect(normalize('---')).toBe('')
  })
})

describe('tokenize', () => {
  it('splits a query into words', () => {
    expect(tokenize('field rangers')).toEqual(['field', 'rangers'])
  })

  it('returns no tokens for an empty or punctuation-only query', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('   ')).toEqual([])
    expect(tokenize('!!')).toEqual([])
  })
})

describe('searchWiki', () => {
  it('returns nothing for an empty query rather than everything', () => {
    expect(searchWiki([doc()], '')).toEqual([])
    expect(searchWiki([doc()], '   ')).toEqual([])
  })

  it('finds a page by a word in its title', () => {
    const hits = searchWiki([doc()], 'rangers')
    expect(hits).toHaveLength(1)
    expect(hits[0].doc.slug).toBe('field-rangers')
  })

  it('finds a page by a word only in its body', () => {
    const hits = searchWiki([doc()], 'tranquilliser')
    expect(hits).toHaveLength(1)
  })

  it('finds a page by a keyword that appears nowhere else', () => {
    const hits = searchWiki([doc({ keywords: ['sedative'] })], 'sedative')
    expect(hits).toHaveLength(1)
  })

  it('ranks a title match above a body-only match', () => {
    const titleMatch = doc({ slug: 'a', title: 'Credits', text: 'nothing relevant' })
    const bodyMatch = doc({ slug: 'b', title: 'Quests', text: 'rewards pay credits on completion' })
    const hits = searchWiki([bodyMatch, titleMatch], 'credits')
    expect(hits.map((hit) => hit.doc.slug)).toEqual(['a', 'b'])
  })

  it('narrows rather than widens as more words are typed', () => {
    const rangers = doc({ slug: 'rangers', title: 'Field Rangers', text: 'patrol the park' })
    // Summary overridden too: the shared fixture's summary mentions the park,
    // which would make this page match "park" for the wrong reason.
    const genetics = doc({
      slug: 'genetics',
      title: 'Helix Genetics',
      summary: 'The team that runs the laboratory.',
      text: 'run the lab',
      keywords: [],
    })

    expect(searchWiki([rangers, genetics], 'the')).toHaveLength(2)
    expect(searchWiki([rangers, genetics], 'the park')).toHaveLength(1)
  })

  it('excludes a page when any single token is missing', () => {
    expect(searchWiki([doc()], 'rangers mosasaurus')).toEqual([])
  })

  it('matches case-insensitively and ignores punctuation in the query', () => {
    expect(searchWiki([doc()], 'FIELD RANGERS!')).toHaveLength(1)
  })

  it('matches a partial word, so results appear while still typing', () => {
    expect(searchWiki([doc()], 'rang')).toHaveLength(1)
  })

  it('honours the limit', () => {
    const many = Array.from({ length: 30 }, (_, index) => doc({ slug: `page-${index}` }))
    expect(searchWiki(many, 'rangers', 5)).toHaveLength(5)
  })

  it('breaks score ties by title, so results do not reorder run to run', () => {
    const b = doc({ slug: 'b', title: 'Bravo' })
    const a = doc({ slug: 'a', title: 'Alpha' })
    const hits = searchWiki([b, a], 'rangers')
    expect(hits.map((hit) => hit.doc.title)).toEqual(['Alpha', 'Bravo'])
  })

  it('returns a snippet drawn from around the body match', () => {
    const hits = searchWiki([doc()], 'tranquilliser')
    expect(hits[0].snippet).toContain('tranquilliser')
  })

  it('falls back to the summary when the match was not in the body', () => {
    const hits = searchWiki([doc({ keywords: ['sedative'] })], 'sedative')
    expect(hits[0].snippet).toBe(doc().summary)
  })

  it('returns an empty list rather than throwing when there are no pages', () => {
    expect(searchWiki([], 'anything')).toEqual([])
  })
})
