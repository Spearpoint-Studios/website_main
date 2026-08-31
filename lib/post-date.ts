const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

export function formatPostDate(iso: string): string {
  if (!ISO_DAY.test(iso)) return iso

  const parsed = Date.parse(`${iso}T00:00:00Z`)
  if (Number.isNaN(parsed)) return iso

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}
