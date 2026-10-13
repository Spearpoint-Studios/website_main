export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  questions: string[]
  open: boolean
}

export const roles: Role[] = [
  {
    slug: 'moderator',
    title: 'Moderator',
    location: 'Remote, volunteer',
    summary: 'Keep our Discord and game servers a place people want to come back to.',
    description: [
      'You will handle reports, enforce the rules in Discord and in game, and step in early when a conversation starts to go sideways. Most of the job is talking to people, not banning them.',
      'Experience helps but is not required. Being calm and fair matters more.',
    ],
    questions: [
      'How old are you, and what timezone are you in?',
      'What are your Discord and Roblox usernames?',
      'How many hours a week can you realistically give?',
      'Have you moderated a community before? Where, and for how long?',
      'Two players are arguing in chat and it is getting personal. What do you do?',
      'A friend of yours breaks a rule. How do you handle it?',
    ],
    open: true,
  },
]

export function openRoles(): Role[] {
  return roles.filter((role) => role.open)
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
