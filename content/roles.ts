export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  open: boolean
}

// No roles are open right now. Add entries here when a position opens; the
// careers page and its empty state read directly from this array.
export const roles: Role[] = []

export function openRoles(): Role[] {
  return roles.filter((role) => role.open)
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
