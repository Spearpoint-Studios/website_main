import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resetRateLimit } from '@/lib/rate-limit'

const sendToDiscord = vi.fn()
vi.mock('@/lib/discord', () => ({
  sendToDiscord: (...args: unknown[]) => sendToDiscord(...args),
  buildEmbed: () => ({}),
}))

const { POST } = await import('./route')

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://spearpointstudio.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9', ...headers },
    body: JSON.stringify(body),
  })
}

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This is a long enough message.',
  renderedAt: 0,
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    resetRateLimit()
    sendToDiscord.mockReset().mockResolvedValue(true)
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.test/hook'
  })

  it('accepts a valid submission and forwards it', async () => {
    const response = await POST(post(valid))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendToDiscord).toHaveBeenCalledOnce()
  })

  it('rejects an invalid submission with the reason', async () => {
    const response = await POST(post({ ...valid, email: 'nope' }))
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('Please enter a valid email address.')
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('reports success for a honeypot hit but sends nothing', async () => {
    const response = await POST(post({ ...valid, website: 'spam' }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('rate limits after five submissions from one address', async () => {
    for (let i = 0; i < 5; i++) await POST(post(valid))
    const response = await POST(post(valid))
    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('600')
  })

  it('does not rate limit a different address', async () => {
    for (let i = 0; i < 5; i++) await POST(post(valid))
    const response = await POST(post(valid, { 'cf-connecting-ip': '203.0.113.10' }))
    expect(response.status).toBe(200)
  })

  it('returns 502 without leaking detail when Discord fails', async () => {
    sendToDiscord.mockResolvedValue(false)
    const response = await POST(post(valid))
    expect(response.status).toBe(502)
    const body = await response.json()
    expect(body.error).toBe('We could not deliver your message. Please try again shortly.')
    expect(JSON.stringify(body)).not.toContain('discord.test')
  })

  it('returns 500 when the webhook is not configured', async () => {
    delete process.env.DISCORD_WEBHOOK_URL
    const response = await POST(post(valid))
    expect(response.status).toBe(500)
    expect(JSON.stringify(await response.json())).not.toContain('DISCORD_WEBHOOK_URL')
  })

  it('rejects a request whose content-length exceeds the cap without parsing it', async () => {
    const response = await POST(post(valid, { 'content-length': String(64 * 1024 + 1) }))
    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ ok: false, error: 'That message is too large.' })
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('rejects an oversized actual body with no content-length header', async () => {
    const oversized = { ...valid, message: 'a'.repeat(64 * 1024 + 1) }
    const request = new Request('https://spearpointstudio.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9' },
      body: JSON.stringify(oversized),
    })
    // The fetch Request implementation does not populate content-length for
    // a plain string body, so this exercises the actual-read guard rather
    // than the header check above.
    expect(request.headers.get('content-length')).toBeNull()
    const response = await POST(request)
    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ ok: false, error: 'That message is too large.' })
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('still returns 400 for malformed JSON', async () => {
    const request = new Request('https://spearpointstudio.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9' },
      body: '{not valid json',
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ ok: false, error: 'Invalid request body.' })
  })
})
