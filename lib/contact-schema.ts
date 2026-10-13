import { roleBySlug, type Role } from '@/content/roles'

export type Answer = {
  question: string
  answer: string
}

export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  role?: string
  answers?: Answer[]
  website?: string
  renderedAt: number
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; error: string }
  | { ok: 'discard' }

const MIN_FILL_MS = 3000
export const ANSWER_MAX_LENGTH = 800

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

export function validateContact(
  body: unknown,
  now: number,
  findRole: (slug: string) => Role | undefined = roleBySlug,
): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid request body.' }
  }

  const raw = body as Record<string, unknown>

  // Honeypot. Real people never see this field, so anything in it is a bot.
  if (str(raw.website).length > 0) return { ok: 'discard' }

  // Only discard when the elapsed time is genuinely inside the fill window.
  // A negative delta means the visitor's clock runs fast relative to the
  // server, not that the form was filled too quickly. Unsynced clocks drift
  // by minutes routinely, so a negative delta must fall through to normal
  // validation and be delivered rather than silently discarded.
  const renderedAt = typeof raw.renderedAt === 'number' ? raw.renderedAt : 0
  const elapsed = now - renderedAt
  if (elapsed >= 0 && elapsed < MIN_FILL_MS) return { ok: 'discard' }

  const name = str(raw.name)
  if (!inRange(name, 1, 80)) return { ok: false, error: 'Please enter your name.' }

  const email = str(raw.email)
  if (!inRange(email, 3, 160) || !looksLikeEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const subject = str(raw.subject)
  if (!inRange(subject, 1, 120)) return { ok: false, error: 'Please add a subject.' }

  const role = str(raw.role)
  if (role.length > 64) return { ok: false, error: 'Invalid role.' }

  const questions = (role && findRole(role)?.questions) || []
  const message = str(raw.message)

  if (questions.length === 0) {
    if (!inRange(message, 10, 4000)) {
      return { ok: false, error: 'Please write a little more in your message.' }
    }
    return {
      ok: true,
      value: { name, email, subject, message, renderedAt, ...(role ? { role } : {}) },
    }
  }

  if (message.length > 4000) return { ok: false, error: 'That message is too long.' }

  const rawAnswers = Array.isArray(raw.answers) ? raw.answers : []
  if (rawAnswers.length !== questions.length) {
    return { ok: false, error: 'Please answer every question.' }
  }

  const answers: Answer[] = []
  for (let i = 0; i < questions.length; i++) {
    const answer = str(rawAnswers[i])
    if (answer.length === 0) return { ok: false, error: 'Please answer every question.' }
    if (answer.length > ANSWER_MAX_LENGTH) {
      return {
        ok: false,
        error: `Please keep each answer under ${ANSWER_MAX_LENGTH} characters.`,
      }
    }
    answers.push({ question: questions[i], answer })
  }

  return { ok: true, value: { name, email, subject, message, role, answers, renderedAt } }
}
