export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  questions: string[]
  open: boolean
  // An ISO 8601 instant with an explicit offset. From this moment the role
  // counts as closed everywhere: off the careers page, and applications to it
  // are refused. Leave it out for a role that stays open until `open` is
  // flipped by hand.
  closesAt?: string
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
      'How many hours a week can you realistically give?',
      'Have you moderated a community before? Where, and for how long?',
      'Two players are arguing in chat and it is getting personal. What do you do?',
      'A friend of yours breaks a rule. How do you handle it?',
    ],
    open: false,
  },
  {
    slug: 'community-manager',
    title: 'Community Manager',
    location: 'Remote, volunteer',
    summary: 'Be the link between the people who play our games and the people who make them.',
    description: [
      'You will run announcements and events, collect feedback and bug reports for the team, and lead the moderators day to day.',
      'We are looking for someone who has run or grown a community before and writes in a friendly, plain voice.',
    ],
    questions: [
      'How old are you, and what timezone are you in?',
      'What communities have you run or helped grow? Links or numbers help.',
      'Write a short announcement for a new game update, two or three sentences.',
      'Players are angry about a change the team made. What do you post?',
      'What would you change about our Discord today?',
    ],
    open: false,
  },
  {
    slug: 'qa-tester',
    title: 'QA Tester',
    location: 'Remote, volunteer',
    summary: 'Play Dinosaur Roleplay updates before anyone else, and find what is broken before players do.',
    description: [
      'You will test new builds before they ship, try to break new features on purpose, and write bug reports clear enough that someone else can see the bug for themselves. When a fix lands, you check it is really fixed.',
      'No experience needed. Patience and a habit of noticing small things matter more.',
    ],
    questions: [
      'How old are you, and what timezone are you in?',
      'How many hours a week can you realistically give?',
      'What can you test on? PC, Mac, phone, tablet, console?',
      'Have you tested games or reported bugs before? Tell us about it.',
      'Describe a bug you have seen in any game, written as a report to us.',
    ],
    open: true,
    closesAt: '2026-11-08T23:59:59+01:00',
  },
  {
    slug: '3d-artist',
    title: '3D Artist',
    location: 'Remote, part time',
    summary: 'Model and texture the dinosaurs players spend their time as in Dinosaur Roleplay.',
    description: [
      'You will take dinosaurs from blockout to a finished, game-ready model: believable anatomy, clean topology that still looks right once it is rigged and animated, tidy UVs, and textures that hold up close without being too heavy to run on a phone.',
      'This is a part-time role with flexible hours, and you can start whenever suits you. Show us creatures you have made. A good eye for skin, scales and wear matters more than which software you use.',
    ],
    questions: [
      'How old are you, and what timezone are you in?',
      'Where can we see your work? Link a portfolio, ArtStation, Sketchfab or similar.',
      'Which tools do you model, sculpt and texture in?',
      'What past experience do you have? Studios, commissions and personal projects all count.',
    ],
    open: true,
  },
]

export function isOpen(role: Role, now: number = Date.now()): boolean {
  if (!role.open) return false
  if (role.closesAt === undefined) return true
  return now < Date.parse(role.closesAt)
}

export function openRoles(now: number = Date.now()): Role[] {
  return roles.filter((role) => isOpen(role, now))
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}

export function openRoleBySlug(slug: string, now: number = Date.now()): Role | undefined {
  const role = roleBySlug(slug)
  return role && isOpen(role, now) ? role : undefined
}
