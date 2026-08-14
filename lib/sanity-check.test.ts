import { describe, it, expect } from 'vitest'
import { siteIsConfigured } from './sanity-check'

describe('sanity-check', () => {
  it('confirms the toolchain runs', () => {
    expect(siteIsConfigured()).toBe(true)
  })
})
