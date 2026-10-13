import { describe, it, expect } from 'vitest'
import { ANSWER_MAX_LENGTH, validateContact } from './contact-schema'
import type { Role } from '@/content/roles'

const NOW = 1_000_000
const base = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This is a long enough message.',
  renderedAt: NOW - 10_000,
}

describe('validateContact', () => {
  it('accepts a well formed submission', () => {
    const result = validateContact(base, NOW)
    expect(result.ok).toBe(true)
  })

  it('rejects a non-object body', () => {
    expect(validateContact('nope', NOW)).toEqual({ ok: false, error: 'Invalid request body.' })
  })

  it('rejects a missing name', () => {
    const result = validateContact({ ...base, name: '' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter your name.' })
  })

  it('rejects a name over 80 characters', () => {
    const result = validateContact({ ...base, name: 'a'.repeat(81) }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter your name.' })
  })

  it('rejects an email with no dot after the at sign', () => {
    const result = validateContact({ ...base, email: 'ada@example' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter a valid email address.' })
  })

  it('rejects a message under 10 characters', () => {
    const result = validateContact({ ...base, message: 'short' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please write a little more in your message.' })
  })

  it('discards a submission with the honeypot filled', () => {
    const result = validateContact({ ...base, website: 'http://spam.example' }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('discards a submission faster than three seconds', () => {
    const result = validateContact({ ...base, renderedAt: NOW - 500 }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('accepts a submission whose renderedAt is in the future (visitor clock runs fast)', () => {
    const result = validateContact({ ...base, renderedAt: NOW + 300_000 }, NOW)
    expect(result.ok).toBe(true)
  })

  it('discards a submission with a delta of exactly zero', () => {
    const result = validateContact({ ...base, renderedAt: NOW }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('accepts a submission with a delta of exactly MIN_FILL_MS', () => {
    const result = validateContact({ ...base, renderedAt: NOW - 3000 }, NOW)
    expect(result.ok).toBe(true)
  })

  it('discards a submission with a delta of 2999ms', () => {
    const result = validateContact({ ...base, renderedAt: NOW - 2999 }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('trims surrounding whitespace on accepted values', () => {
    const result = validateContact({ ...base, name: '  Ada  ' }, NOW)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.name).toBe('Ada')
  })

  it('passes the role slug through when present', () => {
    const result = validateContact({ ...base, role: 'gameplay-programmer' }, NOW)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.role).toBe('gameplay-programmer')
  })

  it('accepts a role at exactly 64 characters', () => {
    const role = 'a'.repeat(64)
    const result = validateContact({ ...base, role }, NOW)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.role).toBe(role)
  })

  it('rejects a role over 64 characters', () => {
    const result = validateContact({ ...base, role: 'a'.repeat(65) }, NOW)
    expect(result).toEqual({ ok: false, error: 'Invalid role.' })
  })
})

describe('validateContact for a role with questions', () => {
  const role: Role = {
    slug: 'tester',
    title: 'Tester',
    location: 'Remote',
    summary: 'Tests things.',
    questions: ['How old are you?', 'Why this role?'],
    open: true,
  }
  const findRole = (slug: string) => (slug === role.slug ? role : undefined)
  const application = {
    ...base,
    message: '',
    role: 'tester',
    answers: ['  19, CET  ', 'I like breaking things.'],
  }

  it('accepts an application with no message', () => {
    expect(validateContact(application, NOW, findRole).ok).toBe(true)
  })

  it('pairs each trimmed answer with the role question, not client text', () => {
    const result = validateContact(application, NOW, findRole)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.answers).toEqual([
      { question: 'How old are you?', answer: '19, CET' },
      { question: 'Why this role?', answer: 'I like breaking things.' },
    ])
  })

  it('rejects an application with a blank answer', () => {
    const result = validateContact({ ...application, answers: ['19', '   '] }, NOW, findRole)
    expect(result).toEqual({ ok: false, error: 'Please answer every question.' })
  })

  it('rejects an application with too few answers', () => {
    const result = validateContact({ ...application, answers: ['19'] }, NOW, findRole)
    expect(result).toEqual({ ok: false, error: 'Please answer every question.' })
  })

  it('rejects an application with too many answers', () => {
    const result = validateContact(
      { ...application, answers: ['19', 'yes', 'extra'] },
      NOW,
      findRole,
    )
    expect(result).toEqual({ ok: false, error: 'Please answer every question.' })
  })

  it('rejects an application whose answers are not an array', () => {
    const result = validateContact({ ...application, answers: 'nope' }, NOW, findRole)
    expect(result).toEqual({ ok: false, error: 'Please answer every question.' })
  })

  it('treats non-string answers as blank', () => {
    const result = validateContact({ ...application, answers: ['19', 42] }, NOW, findRole)
    expect(result).toEqual({ ok: false, error: 'Please answer every question.' })
  })

  it('accepts an answer at exactly the length limit', () => {
    const answers = ['19', 'a'.repeat(ANSWER_MAX_LENGTH)]
    expect(validateContact({ ...application, answers }, NOW, findRole).ok).toBe(true)
  })

  it('rejects an answer over the length limit', () => {
    const answers = ['19', 'a'.repeat(ANSWER_MAX_LENGTH + 1)]
    const result = validateContact({ ...application, answers }, NOW, findRole)
    expect(result).toEqual({
      ok: false,
      error: `Please keep each answer under ${ANSWER_MAX_LENGTH} characters.`,
    })
  })

  it('still discards a filled honeypot', () => {
    const result = validateContact({ ...application, website: 'x' }, NOW, findRole)
    expect(result).toEqual({ ok: 'discard' })
  })
})
