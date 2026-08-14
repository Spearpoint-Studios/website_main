const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

// This process is long-lived (systemd, not serverless), so `hits` would grow
// without bound if we only ever pruned the key currently being read: an
// attacker rotating CF-Connecting-IP never revisits a key, so it never gets
// cleaned up. Sweep the whole map periodically instead, but only when a full
// window has elapsed since the last sweep, so the O(n) walk doesn't run on
// every request.
let lastSweep = 0

function sweep(now: number): void {
  if (now - lastSweep < WINDOW_MS) return
  lastSweep = now
  const cutoff = now - WINDOW_MS
  for (const [key, timestamps] of hits) {
    if (timestamps.every((t) => t <= cutoff)) hits.delete(key)
  }
}

/** Test-only observability hook: the size of the underlying Map. */
export function rateLimitSize(): number {
  return hits.size
}

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
  sweep(now)

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
  lastSweep = 0
}
