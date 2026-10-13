import { describe, it, expect, vi } from 'vitest'
import { buildEmbed, sendToDiscord } from './discord'
import type { ContactInput } from './contact-schema'

const input: ContactInput = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Partnership',
  message: 'We should talk.',
  renderedAt: 0,
}

describe('buildEmbed', () => {
  it('uses the subject as the title and the message as the description', () => {
    const embed = buildEmbed(input)
    expect(embed.title).toBe('Partnership')
    expect(embed.description).toBe('We should talk.')
  })

  it('includes name and email as fields', () => {
    const fields = buildEmbed(input).fields as Array<{ name: string; value: string }>
    expect(fields.find((f) => f.name === 'Name')?.value).toBe('Ada')
    expect(fields.find((f) => f.name === 'Email')?.value).toBe('ada@example.com')
  })

  it('omits the role field when no role was sent', () => {
    const fields = buildEmbed(input).fields as Array<{ name: string }>
    expect(fields.find((f) => f.name === 'Role')).toBeUndefined()
  })

  it('includes the role field when a role was sent', () => {
    const fields = buildEmbed({ ...input, role: 'gameplay-programmer' })
      .fields as Array<{ name: string; value: string }>
    expect(fields.find((f) => f.name === 'Role')?.value).toBe('gameplay-programmer')
  })

  it('truncates a description longer than the Discord limit', () => {
    const embed = buildEmbed({ ...input, message: 'x'.repeat(5000) })
    expect((embed.description as string).length).toBeLessThanOrEqual(4096)
  })

  it('adds one field per answer, after the role, in question order', () => {
    const fields = buildEmbed({
      ...input,
      role: 'moderator',
      answers: [
        { question: 'How old are you?', answer: '19' },
        { question: 'Why this role?', answer: 'I like people.' },
      ],
    }).fields as Array<{ name: string; value: string; inline?: boolean }>
    expect(fields.slice(3)).toEqual([
      { name: 'How old are you?', value: '19' },
      { name: 'Why this role?', value: 'I like people.' },
    ])
  })

  it('caps answer fields at the Discord field limits', () => {
    const fields = buildEmbed({
      ...input,
      answers: [{ question: 'q'.repeat(300), answer: 'a'.repeat(2000) }],
    }).fields as Array<{ name: string; value: string }>
    const answer = fields[fields.length - 1]
    expect(answer.name.length).toBe(256)
    expect(answer.value.length).toBe(1024)
  })

  it('omits the description when the message is empty', () => {
    const embed = buildEmbed({ ...input, message: '' })
    expect('description' in embed).toBe(false)
  })
})

describe('sendToDiscord', () => {
  it('posts JSON to the webhook and reports success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    const ok = await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)
    expect(ok).toBe(true)
    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://discord.test/hook')
    expect((init as RequestInit).method).toBe('POST')
  })

  it('suppresses mentions in the posted payload', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)
    const [, init] = fetchImpl.mock.calls[0]
    const payload = JSON.parse((init as RequestInit).body as string)
    expect(payload.allowed_mentions).toEqual({ parse: [] })
  })

  it('reports failure on a non-2xx response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('nope', { status: 500 }))
    expect(await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)).toBe(false)
  })

  it('reports failure when the request throws', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'))
    expect(await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)).toBe(false)
  })

  it('logs only the error message, never the whole error object', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const secretUrl = 'https://discord.test/hook/secret-token'
    const error = new Error('network down') as Error & { request?: { url: string } }
    error.request = { url: secretUrl }
    const fetchImpl = vi.fn().mockRejectedValue(error)

    await sendToDiscord(input, secretUrl, fetchImpl as never)

    expect(consoleError).toHaveBeenCalledWith('[contact] Discord delivery failed', 'network down')
    for (const call of consoleError.mock.calls) {
      expect(JSON.stringify(call)).not.toContain(secretUrl)
    }
    consoleError.mockRestore()
  })
})
