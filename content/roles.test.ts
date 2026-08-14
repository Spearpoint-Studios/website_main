import { describe, it, expect } from 'vitest'
import { roles, openRoles, roleBySlug } from './roles'

describe('roles', () => {
  it('hides roles marked closed', () => {
    const closed = roles.filter((r) => !r.open)
    const listed = openRoles()
    for (const role of closed) {
      expect(listed.find((r) => r.slug === role.slug)).toBeUndefined()
    }
  })

  it('finds a role by slug', () => {
    const first = roles[0]
    expect(roleBySlug(first.slug)?.title).toBe(first.title)
  })

  it('returns undefined for an unknown slug', () => {
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
