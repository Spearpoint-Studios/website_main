import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { allPosts, latestPosts, postBySlug } from './index'

const publicDir = fileURLToPath(new URL('../../public', import.meta.url))

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/
const DAY_MS = 24 * 60 * 60 * 1000

describe('posts registry', () => {
  it('registers at least one post, so every assertion below has something to check', () => {
    expect(allPosts().length).toBeGreaterThan(0)
  })

  it('has unique slugs', () => {
    const slugs = allPosts().map((post) => post.meta.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has kebab-case slugs carrying no date prefix', () => {
    for (const { meta } of allPosts()) {
      expect(meta.slug).toMatch(SLUG)
      expect(meta.slug).not.toMatch(DATE_PREFIX)
    }
  })

  it('has dates that are ISO calendar days and parse to a real time', () => {
    for (const { meta } of allPosts()) {
      expect(meta.date).toMatch(ISO_DATE)
      expect(Number.isNaN(Date.parse(meta.date))).toBe(false)
    }
  })

  it('has no date more than a day in the future, which would pin a typo to the top of the feed', () => {
    for (const { meta } of allPosts()) {
      expect(Date.parse(meta.date)).toBeLessThanOrEqual(Date.now() + DAY_MS)
    }
  })

  it('has a non-empty title and excerpt on every post', () => {
    for (const { meta } of allPosts()) {
      expect(meta.title.trim()).not.toBe('')
      expect(meta.excerpt.trim()).not.toBe('')
    }
  })

  it('has no slash separators in any user-visible string', () => {
    for (const { meta } of allPosts()) {
      expect(meta.title).not.toMatch(/\s\/\s/)
      expect(meta.excerpt).not.toMatch(/\s\/\s/)
      expect(meta.tag).not.toMatch(/\s\/\s/)
    }
  })

  it('has a body component on every post', () => {
    for (const post of allPosts()) {
      expect(typeof post.default).toBe('function')
    }
  })

  it('points every cover at a file that exists under public, with alt text', () => {
    for (const { meta } of allPosts()) {
      if (!meta.cover) continue
      expect(meta.cover.src.startsWith('/')).toBe(true)
      expect(existsSync(`${publicDir}${meta.cover.src}`)).toBe(true)
      expect(meta.cover.alt.trim()).not.toBe('')
    }
  })

  it('returns posts newest first', () => {
    const dates = allPosts().map((post) => Date.parse(post.meta.date))
    const descending = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(descending)
  })
})

describe('latestPosts', () => {
  it('returns no more than the requested count', () => {
    expect(latestPosts(2).length).toBeLessThanOrEqual(2)
    expect(latestPosts(1)).toHaveLength(1)
  })

  it('returns the newest posts, in the same order as allPosts', () => {
    expect(latestPosts(2)).toEqual(allPosts().slice(0, 2))
  })

  it('returns an empty array for a count of zero', () => {
    expect(latestPosts(0)).toEqual([])
  })
})

describe('postBySlug', () => {
  it('finds every registered post', () => {
    for (const post of allPosts()) {
      expect(postBySlug(post.meta.slug)).toBe(post)
    }
  })

  it('returns undefined for a slug that is not registered', () => {
    expect(postBySlug('not-a-real-post')).toBeUndefined()
    expect(postBySlug('')).toBeUndefined()
  })
})
