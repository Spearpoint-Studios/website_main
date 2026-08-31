import { describe, it, expect } from 'vitest'
import { formatPostDate } from './post-date'

describe('formatPostDate', () => {
  it('renders an ISO day as a long British date', () => {
    expect(formatPostDate('2026-08-31')).toBe('31 August 2026')
  })

  it('does not pad the day, so the first of a month reads naturally', () => {
    expect(formatPostDate('2026-08-01')).toBe('1 August 2026')
  })

  it('renders the same day regardless of the machine time zone', () => {
    const original = process.env.TZ

    process.env.TZ = 'Pacific/Kiritimati'
    const ahead = formatPostDate('2026-08-31')

    process.env.TZ = 'Pacific/Midway'
    const behind = formatPostDate('2026-08-31')

    process.env.TZ = original

    expect(ahead).toBe('31 August 2026')
    expect(behind).toBe('31 August 2026')
  })

  it('returns the input unchanged when it is not an ISO day', () => {
    expect(formatPostDate('not a date')).toBe('not a date')
  })
})
