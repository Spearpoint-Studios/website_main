export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  questions: string[]
  open: boolean
}

export const roles: Role[] = []

export function openRoles(): Role[] {
  return roles.filter((role) => role.open)
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
