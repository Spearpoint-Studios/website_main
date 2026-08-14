import { validateContact } from '@/lib/contact-schema'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { sendToDiscord } from '@/lib/discord'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The App Router applies no body size cap of its own, Caddy sets no default
// max_size in front of it, and the rate limiter runs after the parse, so
// nothing upstream protects this handler from an oversized request body.
// One unauthenticated POST with a multi-gigabyte body would otherwise
// exhaust the VPS. 64KB comfortably covers a 4000-character message plus
// the other fields.
const MAX_BODY_BYTES = 64 * 1024

function json(body: unknown, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  })
}

// The rate-limit window is ten minutes; telling the client exactly when to
// retry is friendlier than a bare 429 and lets well-behaved clients back off
// correctly instead of guessing.
const RATE_LIMIT_WINDOW_SECONDS = 600

const TOO_LARGE = { ok: false, error: 'That message is too large.' } as const

export async function POST(request: Request): Promise<Response> {
  // content-length can be absent or lied about, but when present and honest
  // it lets us reject oversized requests before reading any body at all.
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(TOO_LARGE, 413)
  }

  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) {
    return json(TOO_LARGE, 413)
  }

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400)
  }

  const now = Date.now()
  const result = validateContact(body, now)

  // Bots are told nothing. Reporting the block teaches whoever wrote it
  // exactly which check to defeat next.
  if (result.ok === 'discard') return json({ ok: true }, 200)
  if (result.ok === false) return json({ ok: false, error: result.error }, 400)

  if (!rateLimit(clientIp(request.headers), now).allowed) {
    return json(
      { ok: false, error: 'That is a lot of messages. Please try again in a few minutes.' },
      429,
      { 'retry-after': String(RATE_LIMIT_WINDOW_SECONDS) },
    )
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('[contact] DISCORD_WEBHOOK_URL is not set')
    return json({ ok: false, error: 'The contact form is not available right now.' }, 500)
  }

  const delivered = await sendToDiscord(result.value, webhookUrl)
  if (!delivered) {
    return json(
      { ok: false, error: 'We could not deliver your message. Please try again shortly.' },
      502,
    )
  }

  return json({ ok: true }, 200)
}
