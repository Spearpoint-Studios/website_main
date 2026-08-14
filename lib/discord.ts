import type { ContactInput } from './contact-schema'

const DESCRIPTION_LIMIT = 4096
const ACCENT = 0x1f7fa8

export function buildEmbed(input: ContactInput): Record<string, unknown> {
  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: 'Name', value: input.name, inline: true },
    { name: 'Email', value: input.email, inline: true },
  ]

  if (input.role) fields.push({ name: 'Role', value: input.role, inline: true })

  return {
    title: input.subject,
    description: input.message.slice(0, DESCRIPTION_LIMIT),
    color: ACCENT,
    fields,
    timestamp: new Date().toISOString(),
  }
}

export async function sendToDiscord(
  input: ContactInput,
  webhookUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ embeds: [buildEmbed(input)] }),
    })
    return response.ok
  } catch (error) {
    console.error('[contact] Discord delivery failed', error)
    return false
  }
}
