import type { WikiPage } from './types'

export const page: WikiPage = {
  meta: {
    slug: 'vehicles',
    title: 'Vehicles',
    category: 'Systems',
    summary:
      'Spawning and driving park vehicles, the controls, and what changes while you are in a seat.',
    keywords: ['cars', 'driving', 'transport', 'spawn', 'gears', 'jeep', 'tour'],
    order: 2,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'The park is large enough that walking across it is a real cost, and vehicles are how most teams cover it. They are also the only way to move several people at once, which matters for a tour or a response.',
    },
    { kind: 'heading', text: 'Getting one' },
    {
      kind: 'text',
      body:
        'Vehicles are spawned from the vehicle spawner rather than found lying around. You can have one out at a time; spawning another replaces it, and you can delete the one you have when you are finished with it.',
    },
    { kind: 'heading', text: 'Driving' },
    {
      kind: 'text',
      body:
        'Taking a drive seat swaps your keybinds. Sprint, crouch, pet, whistle and night vision go away, and the driving set appears. Leaving the seat puts them back.',
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
      ],
    },
    {
      kind: 'note',
      body:
        'Radio still works from the driver’s seat if your team has it, so you can keep talking while moving.',
    },
    { kind: 'heading', text: 'Vehicles and animals' },
    {
      kind: 'text',
      body:
        'A vehicle is not armour. Something large will damage it and everyone in it, and a wreck in the wrong place is an obstacle for whoever comes next. Driving into a breach to get a closer look is how a one-animal problem becomes a two-casualty one.',
    },
  ],
}
