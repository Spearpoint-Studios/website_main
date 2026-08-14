export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  open: boolean
}

// PLACEHOLDER CONTENT. Replace with the studio's real openings.
export const roles: Role[] = [
  {
    slug: 'gameplay-programmer',
    title: 'Gameplay Programmer',
    location: 'Remote',
    summary: 'Luau, systems design, and the tooling around them.',
    description: [
      'You will own gameplay systems end to end, from prototype to the version players actually touch.',
      'We care more about what you have shipped than where you learned it.',
    ],
    open: true,
  },
  {
    slug: '3d-environment-artist',
    title: '3D Environment Artist',
    location: 'Remote',
    summary: 'Spaces that read clearly and run fast on low-end hardware.',
    description: [
      'Roblox reaches a lot of players on modest devices. Making a space feel rich inside that budget is the craft.',
    ],
    open: true,
  },
  {
    slug: 'community-manager',
    title: 'Community Manager',
    location: 'Part time',
    summary: 'Discord, updates, and staying close to what players want.',
    open: true,
  },
]

export function openRoles(): Role[] {
  return roles.filter((role) => role.open)
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
