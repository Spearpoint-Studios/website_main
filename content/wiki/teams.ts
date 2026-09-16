import type { WikiPage } from './types'

/**
 * Unlock thresholds and headcount limits mirror ProgressionConfig in the game
 * repo (TeamUnlockXP and TeamLimits). If those change, change them here.
 */
export const page: WikiPage = {
  meta: {
    slug: 'teams',
    title: 'Teams',
    category: 'Teams',
    summary:
      'The eight teams, what each does, the experience needed to unlock them, and how many people each can hold.',
    keywords: ['jobs', 'roles', 'departments', 'factions', 'unlock', 'slots'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'There are eight teams. Three are open immediately and the rest unlock with global experience. Each has a headcount limit, so a full team means waiting for someone to leave.',
    },
    {
      kind: 'table',
      columns: ['Team', 'Unlocks at', 'Slots'],
      rows: [
        [
          { text: 'Visitor', note: 'The default. No duties, no equipment, and the slowest experience gain.' },
          'Open',
          'Unlimited',
        ],
        [
          { text: 'Park Operations', note: 'Runs the public side of the park: gates, rides, tours, and guests.' },
          'Open',
          '8',
        ],
        [
          { text: 'Facilities', note: 'Keeps the place working. Power, repairs, cleaning, and the things that break.' },
          'Open',
          '6',
        ],
        [
          { text: 'Field Rangers', note: 'Patrols the grounds and is first to respond when something gets out.' },
          '2,500 XP',
          '10',
        ],
        [
          { text: 'Behaviour Unit', note: 'Works with the animals directly: handling, observation, and enrichment.' },
          '5,000 XP',
          '12',
        ],
        [
          { text: 'Containment Division', note: 'The armed response. Recaptures escaped animals and handles serious incidents.' },
          '15,000 XP',
          '10',
        ],
        [
          { text: 'Helix Genetics', note: 'The laboratory. Research, breeding, and whatever is being grown this week.' },
          '25,000 XP',
          '6',
        ],
        [
          { text: 'GenCore', note: 'The parent company. Oversight, contracts, and interests of their own.' },
          '40,000 XP',
          '6',
        ],
      ],
    },
    { kind: 'heading', text: 'Headcount limits' },
    {
      kind: 'text',
      body:
        'The limits keep the park balanced rather than gate content. Ten armed operatives and one attendant is not a park, so the teams that most change how a round plays are held smallest relative to demand.',
    },
    {
      kind: 'note',
      body:
        'Behaviour Unit has the largest limit at twelve, because handling animals is the job that most needs more than one person on it.',
    },
    { kind: 'heading', text: 'Protected teams' },
    {
      kind: 'text',
      body:
        'Field Rangers, Containment Division, Helix Genetics, and Park Operations count as protected personnel. Two members of those teams cannot attack each other, even across team lines. The combat rules page covers exactly how that is enforced.',
    },
  ],
}
