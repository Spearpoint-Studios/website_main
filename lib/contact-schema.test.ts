import { describe, it, expect } from 'vitest'
import { validateContact } from './contact-schema'

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
