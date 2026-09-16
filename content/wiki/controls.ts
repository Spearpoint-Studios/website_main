import type { WikiPage } from './types'

/**
 * Every binding here is registered in KeybindInit.luau in the game repo. The
 * on-screen keybind list shows whichever set applies to what you are currently
 * controlling, which is why they are split the same way here.
 */
export const page: WikiPage = {
  meta: {
    slug: 'controls',
    title: 'Controls and keybinds',
    category: 'Reference',
    summary:
      'Every key, split by what you are controlling: on foot, as a dinosaur, or in a vehicle.',
    keywords: ['keys', 'keybinds', 'bindings', 'controls', 'hotkeys', 'gamepad', 'mobile'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'The keybind list on screen changes with what you are controlling. Taking a vehicle seat swaps the movement keys for driving ones and puts them back when you get out, so the list is always the set that currently applies.',
    },
    { kind: 'heading', text: 'On foot' },
    {
      kind: 'table',
      columns: ['Key', 'Action'],
      rows: [
        ['Left Shift', 'Sprint'],
        ['Left Ctrl', 'Crouch'],
        ['C', 'Pet'],
        ['V', 'Whistle'],
        ['T', { text: 'Radio transmission', note: 'Only on teams with radio access' }],
        ['N', { text: 'Toggle night vision', note: 'Only while you have night vision equipment' }],
        ['J', 'Duties'],
        ['L', 'Player list'],
        ['Backspace', { text: 'Hide all UI', note: 'Becomes Drop Item while holding food' }],
      ],
    },
    {
      kind: 'note',
      body:
        'Radio is limited to Containment Division, Helix Genetics, Field Rangers and Park Operations. On any other team the T binding does not appear at all.',
    },
    { kind: 'heading', text: 'As a dinosaur' },
    {
      kind: 'text',
      body:
        'Playing an animal replaces the whole set. Sprint and crouch are gone, and the attacks are on the mouse.',
    },
    {
      kind: 'table',
      columns: ['Key', 'Action'],
      rows: [
        ['Left mouse', 'Primary attack'],
        ['Right mouse', 'Secondary attack'],
        ['Q', 'Sniff'],
        ['1 – 9', { text: 'Roar', note: 'Different numbers give different calls' }],
        ['H', 'Sit'],
        ['B', 'Pack invite'],
        ['N', 'Night vision'],
        ['Z', { text: 'Unlock mouse', note: 'Frees the cursor without leaving the animal' }],
        ['J', 'Duties'],
        ['L', 'Player list'],
        ['Backspace', 'Hide all UI'],
      ],
    },
    { kind: 'heading', text: 'Driving' },
    {
      kind: 'text',
      body:
        'Taking a drive seat removes sprint, crouch, pet, whistle and night vision, and adds the set below. Leaving the seat restores the ones it took.',
    },
    {
      kind: 'table',
      columns: ['Key', 'Action'],
      rows: [
        ['W', 'Throttle'],
        ['S', 'Brake'],
        ['A', 'Steer left'],
        ['D', 'Steer right'],
        ['P', 'Handbrake'],
        ['E', 'Shift up'],
        ['Q', 'Shift down'],
        ['T', { text: 'Radio transmission', note: 'If your team has radio access' }],
      ],
    },
    { kind: 'heading', text: 'Controller and touch' },
    {
      kind: 'text',
      body:
        'Gamepad is supported for the common actions: sprint is the left stick click and crouch is B. The on-screen list shows controller glyphs rather than keys when you are using one, and touch controls surface the same actions as buttons.',
    },
  ],
}
