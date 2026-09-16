import type { WikiPage } from './types'

/**
 * The prerequisite chain below is the incoming unlock system, agreed with the
 * studio. The live game still unlocks teams on global XP alone and still has a
 * Facilities team; the note in the page says so. When the game changes, delete
 * that note and the one on the progression page.
 */
export const page: WikiPage = {
  meta: {
    slug: 'teams',
    title: 'Teams',
    category: 'Teams',
    summary:
      'The seven teams, what each does, and the experience on other teams you need before you can join them.',
    keywords: ['jobs', 'roles', 'departments', 'factions', 'unlock', 'slots', 'prerequisite'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'There are seven teams. Two are open to anyone. The rest are earned, and most are earned by working a specific team first rather than by accumulating a general total.',
    },
    {
      kind: 'note',
      body:
        'The prerequisites below are the new system and are not live yet. The game currently unlocks every team on global XP alone. This page will stop carrying this note when that changes.',
    },
    { kind: 'heading', text: 'What each team does' },
    {
      kind: 'table',
      columns: ['Team', 'Role', 'Slots'],
      rows: [
        ['Visitor', 'The default. No duties, no equipment, and the slowest experience gain.', 'Unlimited'],
        ['Park Operations', 'Runs the public side of the park: gates, rides, tours, and guests.', '8'],
        ['Field Rangers', 'Patrols the grounds and is first to respond when something gets out.', '10'],
        ['Behaviour Unit', 'Works with the animals directly: handling, observation, and enrichment.', '12'],
        ['Containment Division', 'The armed response. Recaptures escaped animals and handles serious incidents.', '10'],
        ['Helix Genetics', 'The laboratory. Research, breeding, and whatever is being grown this week.', '6'],
        ['GenCore', 'The parent company. Oversight, contracts, and interests of their own.', '6'],
      ],
    },
    { kind: 'heading', text: 'How teams unlock' },
    {
      kind: 'text',
      body:
        'Field Rangers is the one team bought with global XP. Everything past it is bought with team XP earned on a specific other team, so reaching the specialist roles means actually having done the job that feeds into them.',
    },
    {
      kind: 'table',
      columns: ['Team', 'Requires'],
      rows: [
        ['Visitor', 'Nothing'],
        ['Park Operations', 'Nothing'],
        ['Field Rangers', '2,500 global XP'],
        ['Behaviour Unit', '2,000 team XP on Field Rangers'],
        ['Containment Division', '5,000 team XP on Field Rangers'],
        ['Helix Genetics', '3,000 team XP on Behaviour Unit'],
        [
          'GenCore',
          { text: '8,000 team XP on Field Rangers and 8,000 on Helix Genetics', note: 'Both, not either' },
        ],
      ],
    },
    { kind: 'heading', text: 'Why it works this way' },
    {
      kind: 'text',
      body:
        'Under a global total, someone could stand around as a Visitor for long enough and walk straight into the armed response team having never patrolled anything. Tying each unlock to the team below it means the person recapturing an animal has already spent time being the person who reports one loose.',
    },
    {
      kind: 'text',
      body:
        'GenCore needs both halves because it oversees both halves. Eight thousand on Field Rangers is the field side, eight thousand on Helix Genetics is the laboratory side, and the two together are roughly the longest route in the game.',
    },
    { kind: 'heading', text: 'Headcount limits' },
    {
      kind: 'text',
      body:
        'Every staff team has a slot limit, so a full team means waiting for someone to leave. The limits keep the park balanced rather than gate content: ten armed operatives and one attendant is not a park. Behaviour Unit has the most at twelve, because handling animals is the job that most needs more than one person on it.',
    },
    { kind: 'heading', text: 'Radio access' },
    {
      kind: 'text',
      body:
        'Park Operations, Field Rangers, Containment Division and Helix Genetics have radios. Visitors, Behaviour Unit and GenCore do not, so coordination on those teams happens in proximity chat.',
    },
  ],
}
