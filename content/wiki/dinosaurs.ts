import type { WikiPage } from './types'

export const page: WikiPage = {
  meta: {
    slug: 'dinosaurs',
    title: 'Playing as a dinosaur',
    category: 'Dinosaurs',
    summary:
      'How dinosaur access works, the keybinds, what protects a contained animal, and what changes when one goes rogue.',
    keywords: ['dino', 'animals', 'species', 'gamepass', 'game pass', 'unlock', 'morph', 'rogue', 'keybinds', 'controls', 'roar', 'sniff'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'The animals are played by people. There are around seventy in the roster, from Compsognathus up to Mosasaurus, including the named individuals from the films and a handful of hybrids.',
    },
    { kind: 'heading', text: 'Who can play what' },
    {
      kind: 'text',
      body: 'Access to a given dinosaur is decided by a short list of rules.',
    },
    {
      kind: 'table',
      columns: ['Rule', 'What it means'],
      rows: [
        ['Open', 'Anyone can pick it.'],
        ['Game pass', 'Owning the pass unlocks it permanently.'],
        ['Group rank', 'Requires a minimum rank in the Roblox group.'],
        ['Named', 'Reserved for specific people, usually staff or an event winner.'],
      ],
    },
    {
      kind: 'text',
      body:
        'A dinosaur can carry more than one of these at once, and satisfying any single one is enough.',
    },
    { kind: 'heading', text: 'Keybinds' },
    {
      kind: 'text',
      body:
        'Playing an animal replaces the entire human control set. Sprint and crouch are gone, both attacks are on the mouse, and the roar is spread across the number row.',
    },
    {
      kind: 'table',
      columns: ['Key', 'Action'],
      rows: [
        ['Left mouse', 'Primary attack'],
        ['Right mouse', 'Secondary attack'],
        ['Q', { text: 'Sniff', note: 'Picks up nearby scent trails' }],
        ['1 – 9', { text: 'Roar', note: 'Each number is a different call' }],
        ['H', 'Sit'],
        ['B', { text: 'Pack invite', note: 'Invites a nearby animal to your pack' }],
        ['N', 'Night vision'],
        ['Z', { text: 'Unlock mouse', note: 'Frees the cursor without leaving the animal' }],
        ['J', 'Duties'],
        ['L', 'Player list'],
        ['Backspace', 'Hide all UI'],
      ],
    },
    {
      kind: 'note',
      body:
        'Animals have no radio. Coordination between dinosaurs is roars, the pack system, and proximity chat.',
    },
    { kind: 'heading', text: 'Contained animals' },
    {
      kind: 'text',
      body:
        'A dinosaur inside its enclosure is a contained animal and cannot be killed. Staff can tranquillise it, move it, and work around it, but lethal damage is refused outright by the game itself. This is what stops the park being cleared out by whoever is holding a rifle.',
    },
    { kind: 'heading', text: 'Going rogue' },
    {
      kind: 'text',
      body:
        'An animal that gets loose into a human area is marked rogue, and that protection drops. A rogue dinosaur can be killed. The mark is not permanent: it decays five minutes after the animal is no longer somewhere it should not be.',
    },
    {
      kind: 'note',
      body:
        'The Behaviour Unit is excluded from rogue spawning, on the grounds that the people whose job is handling animals should not be the ones generating loose ones.',
    },
    { kind: 'heading', text: 'What a breach means for staff' },
    {
      kind: 'text',
      body:
        'A breach is the main thing that turns a quiet round into a busy one. Field Rangers respond first, Containment Division handles anything they cannot, and the Behaviour Unit tries to talk the thing back into its pen. All three are doing their actual job, which is the point.',
    },
  ],
}
