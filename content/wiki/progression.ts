import type { WikiPage } from './types'

/** Tick rates and quest rewards mirror ProgressionConfig and QuestConfig. */
export const page: WikiPage = {
  meta: {
    slug: 'progression',
    title: 'Experience and progression',
    category: 'Progression',
    summary:
      'Global XP is a rewards track and unlocks nothing. Team XP does all the gating. How both are earned, and how fast.',
    keywords: ['xp', 'levelling', 'leveling', 'grind', 'credits', 'rewards', 'daily', 'unlock', 'prerequisite'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'There are two experience totals and they do completely different jobs. Global XP is the account-wide total and it is a rewards track: it unlocks nothing. Team XP is tracked separately for each team, and it does all the gating — it promotes you up that team’s rank ladder and unlocks the teams beyond it.',
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
    { kind: 'heading', text: 'What global XP is for' },
    {
      kind: 'text',
      body:
        'Global XP is the account total and it is purely a rewards track. It does not unlock teams, it does not affect your rank, and no job is closed to you because it is low. It is the measure of what you have done across the whole park rather than a key to anything.',
    },
    {
      kind: 'text',
      body:
        'That means a long-standing Visitor and a long-standing Ranger can hold similar global totals while having very different access. Access is the other total’s job.',
    },
    { kind: 'heading', text: 'What team XP unlocks' },
    {
      kind: 'note',
      body:
        'The prerequisites below are the new system and are not live yet. The game currently unlocks teams on global XP.',
    },
    {
      kind: 'text',
      body:
        'Three teams need nothing at all. Every other team is bought with team XP on a specific other team, which is the only gate in the game.',
    },
    {
      kind: 'table',
      columns: ['Team', 'Requires'],
      rows: [
        ['Visitor', 'Nothing'],
        ['Park Operations', 'Nothing'],
        ['Field Rangers', 'Nothing'],
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
      kind: 'text',
      body:
        'None of that waiting happens at the start, though. Field Rangers is open immediately, so the clock on every specialist team begins on your first join rather than after a qualifying period as a Visitor.',
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
