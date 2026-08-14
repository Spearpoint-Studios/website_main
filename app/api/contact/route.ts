import { validateContact } from '@/lib/contact-schema'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { sendToDiscord } from '@/lib/discord'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
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
