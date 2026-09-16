import type { WikiPage } from './types'

/** Rogue mechanics come from RogueConfig and the rogue service in the game repo. */
export const page: WikiPage = {
  meta: {
    slug: 'breaches',
    title: 'Breaches and rogue animals',
    category: 'Systems',
    summary:
      'What happens when an animal gets out, what the rogue mark changes, and what each team does about it.',
    keywords: ['escape', 'containment breach', 'rogue', 'loose', 'alarm', 'recapture', 'alert'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'A breach is the event the whole park is arranged around. Most of a quiet round is maintenance and guests; a breach is what turns three teams onto the same problem at once.',
    },
    { kind: 'heading', text: 'The rogue mark' },
    {
      kind: 'text',
      body:
        'An animal that reaches a human area is marked rogue. The mark is what removes its protection: a contained animal cannot be killed, and a rogue one can. Nothing else about the animal changes.',
    },
    {
      kind: 'text',
      body:
        'It is not permanent. The mark decays five minutes after the animal stops being somewhere it should not be, so an animal that is herded back becomes protected again rather than staying a target for the rest of the round.',
    },
    {
      kind: 'note',
      body:
        'The Behaviour Unit is excluded from rogue spawning. The people whose job is handling animals are not the ones generating loose ones.',
    },
    { kind: 'heading', text: 'Who does what' },
    {
      kind: 'table',
      columns: ['Team', 'Role in a breach'],
      rows: [
        ['Field Rangers', 'First response. Locate the animal, report it, and keep guests away from it.'],
        ['Behaviour Unit', 'Tries to move it back without sedation. The preferred outcome.'],
        ['Containment Division', 'Sedation and force, in that order. Called when the above is not working.'],
        ['Park Operations', 'Moves guests out of the way and closes what needs closing.'],
        ['Helix Genetics', 'Cares about why it got out, usually after the fact.'],
      ],
    },
    { kind: 'heading', text: 'Handling one' },
    {
      kind: 'text',
      body:
        'Sedation is almost always the right answer. Tranquilliser weapons work on a contained animal where nothing else does, and an animal that is put down is one the park has lost. The escalation from prod, to dart, to anything heavier is a roleplay decision as much as a mechanical one.',
    },
    {
      kind: 'text',
      body:
        'The alert system exists to make that coordination public. Raising the alert level tells everyone in the park what is happening without needing to reach them individually.',
    },
  ],
}
