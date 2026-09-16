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
        'There are two experience totals and they do different jobs. Global XP is the account total. Team XP is tracked separately for each team, and it both promotes you up that team’s rank ladder and unlocks the teams that sit beyond it.',
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
        'Visitors are the outlier: half the global rate of most staff and no team experience at all, because there is no Visitor ladder to climb and nothing unlocks from it. The spread between staff teams is deliberately narrow. Sixty against fifty is a nudge towards the harder jobs, not a reason to abandon a team you enjoy.',
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
    { kind: 'heading', text: 'What each total unlocks' },
    {
      kind: 'note',
      body:
        'The prerequisites below are the new system and are not live yet. The game currently unlocks every team on global XP alone.',
    },
    {
      kind: 'text',
      body:
        'Global XP buys exactly one thing: Field Rangers, at 2,500. Every team past that is bought with team XP on a specific other team, so the two totals do different jobs and you need both.',
    },
    {
      kind: 'table',
      columns: ['Team', 'Requires'],
      rows: [
        ['Field Rangers', '2,500 global XP'],
        ['Behaviour Unit', '2,000 team XP on Field Rangers'],
        ['Containment Division', '5,000 team XP on Field Rangers'],
        ['Helix Genetics', '3,000 team XP on Behaviour Unit'],
        ['GenCore', '8,000 on Field Rangers and 8,000 on Helix Genetics'],
      ],
    },
    { kind: 'heading', text: 'How long that actually takes' },
    {
      kind: 'text',
      body:
        'At 55 team XP every five minutes, a Field Ranger earns 660 an hour. Behaviour Unit at 2,000 is about three hours of ranger work, and Containment Division at 5,000 is around seven and a half. Doing the daily quests cuts all of those substantially, because a quest pays team XP directly.',
    },
    {
      kind: 'text',
      body:
        'GenCore is the long route by design. Eight thousand on Field Rangers is roughly twelve hours, and the eight thousand on Helix Genetics cannot start until Behaviour Unit and then Helix itself are unlocked.',
    },
    {
      kind: 'note',
      body:
        'Team XP keeps accruing on a team after it has bought you something. Hitting 5,000 on Field Rangers for Containment Division does not spend it, so the same experience still counts towards the 8,000 GenCore wants.',
    },
    { kind: 'heading', text: 'Saving' },
    {
      kind: 'note',
      body:
        'Progress saves automatically every three minutes, and again when you leave. A server crash can cost you at most the last few minutes.',
    },
  ],
}
