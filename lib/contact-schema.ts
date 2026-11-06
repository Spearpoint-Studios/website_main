import { isOpen, roleBySlug, type Role } from '@/content/roles'

export type Answer = {
  question: string
  answer: string
}

export type ContactInput = {
  discord: string
  roblox: string
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
// Current Discord usernames run to 32 characters; a legacy name#1234 tag can
// reach 37. Display names vary too much to pattern check, so only length is.
export const DISCORD_MAX_LENGTH = 37
// Roblox usernames are 3 to 20 letters, digits and underscores.
export const ROBLOX_MAX_LENGTH = 20
const ROBLOX_USERNAME = /^[A-Za-z0-9_]{3,20}$/

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

// People often type a handle the way it is shown in a mention.
function username(value: unknown): string {
  return str(value).replace(/^@/, '')
}

function inRange(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
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

  const discord = username(raw.discord)
  if (!inRange(discord, 2, DISCORD_MAX_LENGTH)) {
    return { ok: false, error: 'Please enter your Discord username.' }
  }

  const roblox = username(raw.roblox)
  if (roblox.length === 0) return { ok: false, error: 'Please enter your Roblox username.' }
  if (!ROBLOX_USERNAME.test(roblox)) {
    return {
      ok: false,
      error: 'Please check your Roblox username. It is 3 to 20 letters, numbers or underscores.',
    }
  }

  const subject = str(raw.subject)
  if (!inRange(subject, 1, 120)) return { ok: false, error: 'Please add a subject.' }

  const role = str(raw.role)
  if (role.length > 64) return { ok: false, error: 'Invalid role.' }

  // A role that has closed, by hand or by date, takes no more applications,
  // even from a form that was opened while it was still listed.
  const found = role ? findRole(role) : undefined
  if (found && !isOpen(found, now)) {
    return { ok: false, error: 'Applications for this role have closed.' }
  }

  const questions = found?.questions ?? []
  const message = str(raw.message)

  if (questions.length === 0) {
    if (!inRange(message, 10, 4000)) {
      return { ok: false, error: 'Please write a little more in your message.' }
    }
    return {
      ok: true,
      value: { discord, roblox, subject, message, renderedAt, ...(role ? { role } : {}) },
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

  return { ok: true, value: { discord, roblox, subject, message, role, answers, renderedAt } }
}
