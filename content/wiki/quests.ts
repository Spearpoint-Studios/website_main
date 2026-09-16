import type { WikiPage } from './types'

/** Kinds, counts and reward tiers come from QuestConfig in the game repo. */
export const page: WikiPage = {
  meta: {
    slug: 'quests',
    title: 'Quests',
    category: 'Progression',
    summary:
      'Three daily quests drawn from a pool of fifty-eight, paying global XP, team XP and credits.',
    keywords: ['daily', 'tasks', 'objectives', 'duties', 'credits', 'rewards'],
    order: 2,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Three quests are available each day, drawn from a pool of fifty-eight. They are the fastest way to move both experience totals, and the only thing besides play time that pays credits.',
    },
    { kind: 'heading', text: 'Rewards' },
    {
      kind: 'table',
      columns: ['Difficulty', 'Global XP', 'Team XP', 'Credits'],
      rows: [
        ['Light', '150', '150', '120'],
        ['Standard', '300', '300', '250'],
        ['Demanding', '600', '600', '500'],
      ],
    },
    {
      kind: 'text',
      body:
        'A demanding quest pays 600 team XP, which is about an hour of passive play on a staff team. Three of those in a day is most of a Behaviour Unit unlock.',
    },
    { kind: 'heading', text: 'What they ask for' },
    {
      kind: 'text',
      body:
        'Quests come in ten kinds, and which ones you are offered depends on the team you are on. A Field Ranger gets patrol and observation work; the Behaviour Unit gets feeding and handling.',
    },
    {
      kind: 'table',
      columns: ['Kind', 'What it asks'],
      rows: [
        ['Patrol', 'Cover ground in a given zone.'],
        ['Observe', 'Spend time watching a particular animal or area.'],
        ['Feed', 'Feed animals.'],
        ['Drink', 'Keep water available.'],
        ['Deploy', 'Place equipment where it is needed.'],
        ['Serve', 'Handle guests, measured in time on task.'],
        ['Drive', 'Cover distance in a vehicle.'],
        ['Ride', 'Take the park rides, usually a visitor task.'],
        ['Hunt', 'An animal task. Track and take prey.'],
        ['Evade', 'An animal task. Avoid staff for a period.'],
        ['Pack', 'An animal task. Do something as a group.'],
      ],
    },
    { kind: 'heading', text: 'Progress and saving' },
    {
      kind: 'text',
      body:
        'Quest progress is tracked per target — so many seconds served, so many studs travelled, so many animals fed — and saves every couple of minutes. Leaving the server does not lose a part-finished quest.',
    },
    {
      kind: 'note',
      body:
        'Quests pay team XP to whichever team you are on when you finish, so completing one right after switching teams credits the new team rather than the one you did the work on.',
    },
  ],
}
