import { describe, it, expect, beforeEach } from 'vitest'
import { clientIp, rateLimit, rateLimitSize, resetRateLimit } from './rate-limit'

describe('clientIp', () => {
  it('prefers CF-Connecting-IP', () => {
    const h = new Headers({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '198.51.100.1, 172.16.0.1',
    })
    expect(clientIp(h)).toBe('203.0.113.7')
  })

  it('falls back to the first X-Forwarded-For entry', () => {
    const h = new Headers({ 'x-forwarded-for': '198.51.100.1, 172.16.0.1' })
    expect(clientIp(h)).toBe('198.51.100.1')
  })

  it('returns a stable placeholder when no header is present', () => {
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

describe('rateLimit', () => {
  beforeEach(() => resetRateLimit())

  it('allows the first five submissions', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('1.1.1.1', 1000).allowed).toBe(true)
    }
  })

  it('blocks the sixth submission inside the window', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('1.1.1.1', 1000).allowed).toBe(false)
  })

  it('allows again once the window has passed', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('1.1.1.1', 1000 + 10 * 60 * 1000 + 1).allowed).toBe(true)
  })

  it('tracks each address separately', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('2.2.2.2', 1000).allowed).toBe(true)
  })

  it('sweeps stale keys out of the map once a window has fully elapsed', () => {
    const WINDOW_MS = 10 * 60 * 1000

    // Prime the module's "last sweep" baseline so the rest of the test
    // measures elapsed time relative to a known point, not module init (0).
    const baseline = WINDOW_MS
    rateLimit('baseline', baseline)
    expect(rateLimitSize()).toBe(1)

    const keyCount = 500
    for (let i = 0; i < keyCount; i++) rateLimit(`10.0.0.${i}`, baseline)
    expect(rateLimitSize()).toBe(keyCount + 1)

    // Less than a full window since the last sweep: nothing is swept yet,
    // even though these particular entries are already outside their own
    // ten-minute rate-limit window.
    rateLimit('fresh-key-a', baseline + WINDOW_MS - 1)
    expect(rateLimitSize()).toBe(keyCount + 2)

    // A full window has now elapsed since the last sweep: the walk runs and
    // every key whose entries are all older than the cutoff is dropped,
    // while the still-recent fresh-key-a survives.
    rateLimit('fresh-key-b', baseline + WINDOW_MS + 1)
    expect(rateLimitSize()).toBeLessThan(keyCount)
  })
})
