const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/**
 * Resolve the real visitor address.
 *
 * The site sits behind Cloudflare, so the socket address is always a
 * Cloudflare edge server. Keying a limiter on it would throttle every
 * visitor as though they were one person.
 */
export function clientIp(headers: Headers): string {
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf.trim()

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  return 'unknown'
}

export function rateLimit(key: string, now: number): { allowed: boolean } {
  const cutoff = now - WINDOW_MS
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return { allowed: false }
  }

  recent.push(now)
  hits.set(key, recent)
  return { allowed: true }
}

export function resetRateLimit(): void {
  hits.clear()
}
