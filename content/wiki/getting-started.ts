import type { WikiPage } from './types'

export const page: WikiPage = {
  meta: {
    slug: 'getting-started',
    title: 'Getting started',
    category: 'Getting started',
    summary:
      'What Dinosaur Park Roleplay is, what you can do on your first join, and where to go next.',
    keywords: ['new player', 'beginner', 'how to play', 'first time', 'noob'],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Dinosaur Park Roleplay is a park simulation. Staff keep a working park running and the animals contained, visitors walk around it, and the dinosaurs are played by people too. Most of what happens comes from those three groups getting in each other’s way.',
    },
    { kind: 'heading', text: 'Your first join' },
    {
      kind: 'text',
      body:
        'You start as a Visitor. There is nothing to unlock first and no application to fill in. Walk the park, find the control room, watch a containment team work, and get a feel for the place before committing to a job.',
    },
    {
      kind: 'text',
      body:
        'Visitors earn experience more slowly than staff, and only towards the global total rather than a team. That is deliberate. It is the tourist role, not a grind — and since global XP unlocks nothing, staying a Visitor does not move you towards a job.',
    },
    { kind: 'heading', text: 'Picking a team' },
    {
      kind: 'text',
      body:
        'Three teams are open from your first join: Visitor, Park Operations, and Field Rangers. The four specialist teams are earned by working the team that feeds them, not by building up a general total.',
    },
    {
      kind: 'text',
      body:
        'Every team has its own rank ladder, climbed with experience earned on that team, so switching jobs never costs you the rank you already hold elsewhere. If you want a specialist team, Field Rangers is where to start: three of the four are reached through it.',
    },
    { kind: 'heading', text: 'Playing as a dinosaur' },
    {
      kind: 'text',
      body:
        'Dinosaurs are playable. Some are open to everyone, others are tied to a game pass, a group rank, or a specific person. A contained animal cannot be killed by staff, only tranquillised, which is what keeps the park from turning into a shooting range.',
    },
    { kind: 'heading', text: 'Where to go next' },
    {
      kind: 'list',
      items: [
        'Teams — what each job does, and the chain of prerequisites to reach it.',
        'Experience and progression — how the two XP totals work and how fast they move.',
        'Playing as a dinosaur — access rules, keybinds, containment, and going rogue.',
        'Controls and keybinds — every key, on foot, as an animal, and driving.',
        'Weapons and equipment — what is in the locker and what it does.',
      ],
    },
  ],
}
