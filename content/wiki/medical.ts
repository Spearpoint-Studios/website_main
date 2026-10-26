import type { WikiPage } from './types'

export const page: WikiPage = {
  meta: {
    slug: 'medical',
    title: 'Injury and medical',
    category: 'Systems',
    summary:
      'Going down rather than dying, what the medical kit does, and how being revived works.',
    keywords: ['downed', 'revive', 'health', 'bleeding', 'defibrillator', 'bandage', 'medic', 'ragdoll'],
    order: 1,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Taking enough damage puts you down rather than killing you outright. A downed player is on the floor, out of the fight, and waiting for someone to get to them — which is the point, because it turns a kill into a situation that needs handling.',
    },
    { kind: 'heading', text: 'Being downed' },
    {
      kind: 'text',
      body:
        'While down you cannot move or act, but you are still there and still able to be saved. Someone has to physically reach you, which is what makes dragging a casualty out of a bad position a real decision rather than a formality.',
    },
    { kind: 'heading', text: 'The kit' },
    {
      kind: 'table',
      columns: ['Item', 'Use'],
      rows: [
        ['Bandage', 'Stops bleeding and restores a little health. The common one.'],
        ['Medbag', 'The full kit, for treating someone properly.'],
        ['Defibrillator', 'Brings back someone who is fully out.'],
        ['Splint', 'For a broken limb rather than a wound.'],
        ['Vital Scanner', 'Reads a casualty’s condition before you commit to a treatment.'],
      ],
    },
    { kind: 'heading', text: 'Animals' },
    {
      kind: 'text',
      body:
        'Animals get their own treatment path. The Dinosaur Splint handles a broken limb, the wake-up serums reverse sedation, and the Behaviour Unit and Helix Genetics between them cover most of what an injured animal needs.',
    },
    {
      kind: 'note',
      body:
        'Falling far enough does damage on its own. It is a common way to end up down without anyone having shot at you.',
    },
  ],
}
