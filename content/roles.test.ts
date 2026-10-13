import { describe, it, expect } from 'vitest'
import { roles, openRoles, roleBySlug } from './roles'
import { ANSWER_MAX_LENGTH } from '@/lib/contact-schema'

const EMBED_TOTAL_LIMIT = 6000
const FIELD_NAME_LIMIT = 256
const WORST_CASE_HEADER = 120 + 'Name'.length + 80 + 'Email'.length + 160 + 'Role'.length + 64

describe('roles', () => {
  it('lists every open role and nothing else', () => {
    expect(openRoles()).toEqual(roles.filter((role) => role.open))
  })

  it('finds a role by its slug', () => {
    for (const role of roles) expect(roleBySlug(role.slug)).toBe(role)
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

  it('gives every open role at least one question, all unique', () => {
    for (const role of openRoles()) {
      expect(role.questions.length).toBeGreaterThan(0)
      expect(new Set(role.questions).size).toBe(role.questions.length)
    }
  })

  it('keeps every question inside a Discord field name', () => {
    for (const role of roles) {
      for (const question of role.questions) {
        expect(question.length).toBeLessThanOrEqual(FIELD_NAME_LIMIT)
      }
    }
  })

  it('fits a fully written application inside one Discord embed', () => {
    for (const role of roles) {
      const size = role.questions.reduce(
        (total, question) => total + question.length + ANSWER_MAX_LENGTH,
        WORST_CASE_HEADER,
      )
      expect(size, role.slug).toBeLessThanOrEqual(EMBED_TOTAL_LIMIT)
    }
  })
})
