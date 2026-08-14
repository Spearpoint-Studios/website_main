import { describe, it, expect } from 'vitest'
import { roles, openRoles, roleBySlug } from './roles'

describe('roles', () => {
  it('returns an empty array from openRoles, so the careers page renders its empty state', () => {
    expect(openRoles()).toEqual([])
  })

  it('returns undefined for any slug, since there are no roles to find yet', () => {
    expect(roleBySlug('anything')).toBeUndefined()
    expect(roleBySlug('not-a-real-role')).toBeUndefined()
  })

  it('has no slash separators in any user-visible string', () => {
    for (const role of roles) {
      expect(role.location).not.toMatch(/\s\/\s/)
      expect(role.summary).not.toMatch(/\s\/\s/)
      expect(role.title).not.toMatch(/\s\/\s/)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(roles.map((r) => r.slug)).size).toBe(roles.length)
  })
})
