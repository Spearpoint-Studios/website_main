import { describe, it, expect } from 'vitest'
import { roles, openRoles, roleBySlug, openRoleBySlug, isOpen, type Role } from './roles'
import { ANSWER_MAX_LENGTH } from '@/lib/contact-schema'

const EMBED_TOTAL_LIMIT = 6000
const FIELD_NAME_LIMIT = 256
const WORST_CASE_HEADER = 120 + 'Name'.length + 80 + 'Email'.length + 160 + 'Role'.length + 64

describe('isOpen', () => {
  const role: Role = {
    slug: 'tester',
    title: 'Tester',
    location: 'Remote',
    summary: 'Tests things.',
    questions: ['Why?'],
    open: true,
  }
  const closesAt = '2030-01-08T23:59:59+01:00'
  const closing = Date.parse(closesAt)

  it('keeps a role with no closing date open', () => {
    expect(isOpen(role, closing)).toBe(true)
  })

  it('keeps a role open until its closing instant', () => {
    expect(isOpen({ ...role, closesAt }, closing - 1)).toBe(true)
  })

  it('closes a role at its closing instant and after', () => {
    expect(isOpen({ ...role, closesAt }, closing)).toBe(false)
    expect(isOpen({ ...role, closesAt }, closing + 86_400_000)).toBe(false)
  })

  it('reads the offset, not the server clock zone', () => {
    // 23:59:59 at +01:00 is 22:59:59 UTC.
    expect(isOpen({ ...role, closesAt }, Date.parse('2030-01-08T22:59:58Z'))).toBe(true)
    expect(isOpen({ ...role, closesAt }, Date.parse('2030-01-08T23:00:00Z'))).toBe(false)
  })

  it('treats a role switched off by hand as closed, whatever its date', () => {
    expect(isOpen({ ...role, open: false, closesAt }, closing - 1)).toBe(false)
  })

  it('treats an unreadable closing date as closed', () => {
    expect(isOpen({ ...role, closesAt: 'next week' }, 0)).toBe(false)
  })
})

describe('roles', () => {
  it('lists every open role and nothing else', () => {
    const now = Date.now()
    expect(openRoles(now)).toEqual(roles.filter((role) => isOpen(role, now)))
  })

  it('finds an open role by slug only while it is open', () => {
    for (const role of roles) {
      if (!role.closesAt) continue
      const closing = Date.parse(role.closesAt)
      expect(openRoleBySlug(role.slug, closing - 1)).toBe(role.open ? role : undefined)
      expect(openRoleBySlug(role.slug, closing)).toBeUndefined()
    }
  })

  it('gives every closing date an explicit offset and a real instant', () => {
    for (const role of roles) {
      if (role.closesAt === undefined) continue
      expect(role.closesAt, role.slug).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/)
      expect(Number.isNaN(Date.parse(role.closesAt)), role.slug).toBe(false)
    }
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
    // Every role switched on, whether or not its date has passed, so this
    // check does not quietly stop covering a role once it expires.
    for (const role of roles.filter((r) => r.open)) {
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
