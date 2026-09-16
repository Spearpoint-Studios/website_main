import type { WikiPage } from './types'

/** Tick rates and quest rewards mirror ProgressionConfig and QuestConfig. */
export const page: WikiPage = {
  meta: {
    slug: 'progression',
    title: 'Experience and progression',
    category: 'Progression',
    summary:
      'How global and team experience are earned, how fast each team earns them, and what quests are worth.',
    keywords: ['xp', 'levelling', 'leveling', 'grind', 'credits', 'rewards', 'daily'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'There are two experience totals and they do different jobs. Global XP is the account total, and it is what unlocks teams. Team XP is tracked separately for each team, and it is what promotes you up that team’s rank ladder.',
    },
    { kind: 'heading', text: 'Earning it by playing' },
    {
      kind: 'text',
      body:
        'Both totals tick up on their own every five minutes while you are in the server. How much depends on your team.',
    },
    {
      kind: 'table',
      columns: ['Team', 'Global XP per tick', 'Team XP per tick'],
      rows: [
        ['Visitor', '25', '—'],
        ['Park Operations', '50', '50'],
        ['Facilities', '50', '50'],
        ['Field Rangers', '55', '55'],
        ['Behaviour Unit', '55', '55'],
        ['Containment Division', '60', '60'],
        ['Helix Genetics', '60', '60'],
        ['GenCore', '60', '60'],
      ],
    },
    {
      kind: 'text',
      body:
        'Visitors are the outlier: half the global rate of most staff and no team experience at all, because there is no Visitor ladder to climb. The spread between staff teams is deliberately narrow. Sixty against fifty is a nudge towards the harder jobs, not a reason to abandon a team you enjoy.',
    },
    { kind: 'heading', text: 'Quests' },
    {
      kind: 'text',
      body:
        'Three quests are available each day. They are the fastest way to move both totals, and they pay credits as well.',
    },
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
        'A demanding quest is worth roughly two hours of passive play, so the daily three are worth doing before anything else.',
    },
    { kind: 'heading', text: 'How long unlocks actually take' },
    {
      kind: 'text',
      body:
        'At 50 global XP every five minutes, ignoring quests, that is 600 an hour. Field Rangers at 2,500 is a little over four hours. Containment Division at 15,000 is about twenty-five. GenCore at 40,000 is the long haul. Doing the daily quests cuts all of those substantially.',
    },
    { kind: 'heading', text: 'Saving' },
    {
      kind: 'note',
      body:
        'Progress saves automatically every three minutes, and again when you leave. A server crash can cost you at most the last few minutes.',
    },
  ],
}
