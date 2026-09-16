import type { WikiPage } from './types'

/**
 * This is the decision order in CombatRules.Evaluate in the game repo, in the
 * order the checks actually run. The wording of each refusal is the exact
 * string the game sends back, so a player searching the message they saw finds
 * this page.
 */
export const page: WikiPage = {
  meta: {
    slug: 'combat-rules',
    title: 'Combat rules',
    category: 'Rules',
    summary:
      'Exactly who can damage whom. The game enforces these itself, so a blocked shot is a rule, not a bug.',
    keywords: ['pvp', 'killing', 'damage', 'team kill', 'tranquilliser', 'friendly fire', 'rdm'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Combat is enforced by the game rather than left to the honour system. When a shot does nothing and you see a message, that is one of the rules below firing, not a broken weapon.',
    },
    {
      kind: 'text',
      body:
        'The checks run in order and the first one that applies wins. That ordering matters: it is why an unarmed visitor is protected even from someone who would otherwise be allowed to shoot them.',
    },
    {
      kind: 'table',
      columns: ['#', 'Situation', 'Result'],
      rows: [
        ['1', 'The target is not a player', 'Allowed. NPCs and props have no protection.'],
        [
          '2',
          'The target is a contained dinosaur',
          { text: 'Blocked, unless the damage is non-lethal.', note: '“Cannot attack a contained animal”' },
        ],
        ['3', 'The target is a rogue dinosaur', 'Allowed, lethally. Going rogue removes the protection above.'],
        ['4', 'The attacker is a dinosaur', 'Allowed. Animals are not bound by staff rules.'],
        [
          '5',
          'The target is a visitor',
          { text: 'Blocked, unless they are armed.', note: '“Cannot attack an unarmed guest”' },
        ],
        [
          '6',
          'Both are on the same team',
          { text: 'Blocked, unless team killing is enabled for that player.', note: '“Cannot attack your own team”' },
        ],
        [
          '7',
          'Both are on protected teams',
          { text: 'Blocked.', note: '“Cannot attack allied personnel”' },
        ],
        ['8', 'Anything else', 'Allowed.'],
      ],
    },
    { kind: 'heading', text: 'Protected teams' },
    {
      kind: 'text',
      body:
        'Field Rangers, Containment Division, Helix Genetics, and Park Operations are protected. Two members of any of those teams cannot shoot each other, even on different teams. The park’s own staff do not have a firefight in the middle of a containment breach.',
    },
    {
      kind: 'note',
      body:
        'This is a rule about pairs. Someone on a protected team can still be attacked by someone who is not on one.',
    },
    { kind: 'heading', text: 'Tranquillisers' },
    {
      kind: 'text',
      body:
        'Non-lethal damage is the exception carved out for contained animals, and it is the whole reason the Behaviour Unit and Containment Division can do their jobs. A contained dinosaur can always be tranquillised and never killed.',
    },
    { kind: 'heading', text: 'Armed visitors' },
    {
      kind: 'text',
      body:
        'A visitor who picks up a weapon stops counting as a protected guest for as long as they stay armed. That status decays on its own after five minutes without a weapon, so arming yourself once does not mark you for the rest of the round.',
    },
  ],
}
