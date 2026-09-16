import type { WikiPage } from './types'

/**
 * These ladders mirror RankConfig.Ladders in the game repo. If a rank or a
 * threshold changes there, change it here.
 */
export const page: WikiPage = {
  meta: {
    slug: 'ranks',
    title: 'Ranks',
    category: 'Progression',
    summary:
      'Every team has its own rank ladder, climbed with experience earned on that team. Here is each ladder in full.',
    keywords: ['promotion', 'ladder', 'rank up', 'titles', 'uniform'],
    order: 1,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Rank is per team. The experience that promotes you is the experience earned on that team, so moving to a new job starts you at the bottom of its ladder without touching the rank you hold on the old one.',
    },
    {
      kind: 'text',
      body:
        'Visitors have a single rank and no ladder. Field Rangers and Containment Division have the longest ones, and both add an early step at 500 so a new member sees a promotion quickly rather than waiting for 1,500.',
    },
    { kind: 'heading', text: 'Park Operations' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Attendant', 'Starting rank'],
        ['Operator', '1,500'],
        ['Senior Attendant', '5,000'],
        ['Shift Lead', '12,000'],
        ['Operations Manager', '24,000'],
      ],
    },
    { kind: 'heading', text: 'Field Rangers' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Entrant', 'Starting rank'],
        ['Trainee', '500'],
        ['Junior Ranger', '1,500'],
        ['Ranger', '3,000'],
        ['Senior Ranger', '5,000'],
        ['Park Warden', '8,000'],
        ['Field Administrant', '12,000'],
        ['Deputy Director', '17,000'],
        ['Ranger Director', '24,000'],
      ],
    },
    { kind: 'heading', text: 'Behaviour Unit' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Trainee', 'Starting rank'],
        ['Handler', '1,500'],
        ['Behaviourist', '5,000'],
        ['Senior Behaviourist', '12,000'],
        ['Lead Behaviourist', '24,000'],
      ],
    },
    { kind: 'heading', text: 'Containment Division' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Training Uniform', 'Starting rank'],
        ['Enlisted', '500'],
        ['Operative', '1,500'],
        ['Containment Specialist', '3,000'],
        ['Senior Operative', '5,000'],
        ['Corporal', '8,000'],
        ['Lieutenant', '12,000'],
        ['Captain', '17,000'],
        ['Divison Deputy', '24,000'],
        ['Divison Director', '32,000'],
      ],
    },
    { kind: 'heading', text: 'Helix Genetics' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Lab Assistant', 'Starting rank'],
        ['Technician', '1,500'],
        ['Geneticist', '5,000'],
        ['Senior Geneticist', '12,000'],
        ['Research Director', '24,000'],
      ],
    },
    { kind: 'heading', text: 'GenCore' },
    {
      kind: 'table',
      columns: ['Rank', 'Team XP'],
      rows: [
        ['Contractor', 'Starting rank'],
        ['Field Agent', '1,500'],
        ['Senior Agent', '5,000'],
        ['Handler', '12,000'],
        ['Regional Director', '24,000'],
      ],
    },
  ],
}
