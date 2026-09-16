import type { WikiPage } from './types'

/** Numbers are PackConfig in the game repo. */
export const page: WikiPage = {
  meta: {
    slug: 'packs',
    title: 'Packs',
    category: 'Dinosaurs',
    summary:
      'Animals can group up. A pack hits harder, but only while its members stay close together.',
    keywords: ['pack', 'group', 'herd', 'buff', 'damage bonus', 'invite', 'teamwork'],
    order: 1,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Dinosaurs can form a pack. It is the animal answer to the radio: a way to work as a group when you have no way to talk to each other at range.',
    },
    { kind: 'heading', text: 'Forming one' },
    {
      kind: 'text',
      body:
        'Press B near another animal to invite it. The invite reaches 120 studs and expires after thirty seconds if it is not taken. A pack holds five animals including you.',
    },
    { kind: 'heading', text: 'The damage bonus' },
    {
      kind: 'text',
      body:
        'Each packmate within 60 studs adds 25 percent to your damage, up to three of them. A lone animal does its base damage; one with three mates nearby does 175 percent of it.',
    },
    {
      kind: 'table',
      columns: ['Mates within 60 studs', 'Your damage'],
      rows: [
        ['0', '100%'],
        ['1', '125%'],
        ['2', '150%'],
        ['3 or more', '175%'],
      ],
    },
    {
      kind: 'note',
      body:
        'The cap is three, so the fourth and fifth members add nothing to the bonus. They are still worth having for the numbers and for covering more ground.',
    },
    { kind: 'heading', text: 'Why the range matters' },
    {
      kind: 'text',
      body:
        'The invite reaches twice as far as the bonus does. You can recruit an animal from across a clearing, but the two of you have to close to 60 studs before either gets anything out of it. A pack strung out across the park is a pack of individuals.',
    },
    {
      kind: 'text',
      body:
        'That is the whole tactical shape of it: staying together is strong and splitting up is not. A coordinated pack of three is considerably more dangerous to a containment team than five animals wandering separately.',
    },
  ],
}
