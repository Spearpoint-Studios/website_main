import { describe, it, expect, beforeEach } from 'vitest'
import { clientIp, rateLimit, resetRateLimit } from './rate-limit'

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
})
