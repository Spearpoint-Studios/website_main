export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  role?: string
  website?: string
  renderedAt: number
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; error: string }
  | { ok: 'discard' }

const MIN_FILL_MS = 3000

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function inRange(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}

function looksLikeEmail(value: string): boolean {
  const at = value.indexOf('@')
  if (at < 1) return false
  const domain = value.slice(at + 1)
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
}

export function validateContact(body: unknown, now: number): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid request body.' }
  }

  const raw = body as Record<string, unknown>

  // Honeypot. Real people never see this field, so anything in it is a bot.
  if (str(raw.website).length > 0) return { ok: 'discard' }

  const renderedAt = typeof raw.renderedAt === 'number' ? raw.renderedAt : 0
  if (now - renderedAt < MIN_FILL_MS) return { ok: 'discard' }

  const name = str(raw.name)
  if (!inRange(name, 1, 80)) return { ok: false, error: 'Please enter your name.' }

  const email = str(raw.email)
  if (!inRange(email, 3, 160) || !looksLikeEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const subject = str(raw.subject)
  if (!inRange(subject, 1, 120)) return { ok: false, error: 'Please add a subject.' }

  const message = str(raw.message)
  if (!inRange(message, 10, 4000)) {
    return { ok: false, error: 'Please write a little more in your message.' }
  }

  const role = str(raw.role)

  return {
    ok: true,
    value: { name, email, subject, message, renderedAt, ...(role ? { role } : {}) },
  }
}
