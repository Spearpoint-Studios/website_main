import type { WikiPage } from './types'

export const page: WikiPage = {
  meta: {
    slug: 'glossary',
    title: 'Glossary',
    category: 'Reference',
    summary: 'The terms and abbreviations that get used in radio traffic and in the wiki.',
    keywords: ['terms', 'abbreviations', 'jargon', 'slang', 'acronyms', 'meaning'],
    order: 1,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'Most of these turn up in radio traffic without explanation. If you have just joined a team and people are using a word at you, it is probably here.',
    },
    {
      kind: 'table',
      columns: ['Term', 'Meaning'],
      rows: [
        ['Breach', 'An animal has left its enclosure and reached somewhere it should not be.'],
        ['Rogue', 'The mark on an animal that has reached a human area. It removes the animal’s protection from lethal damage and decays five minutes after it returns.'],
        ['Contained', 'An animal inside its enclosure. Cannot be killed, only sedated.'],
        ['CD', 'Containment Division. The armed response team.'],
        ['BU', 'Behaviour Unit. The animal handlers.'],
        ['Helix', 'Helix Genetics. The laboratory.'],
        ['GenCore', 'The parent company that oversees the park.'],
        ['Global XP', 'The account-wide experience total. A rewards track — it unlocks no teams and affects no rank.'],
        ['Team XP', 'Experience on one specific team. Promotes you on that team and unlocks the teams beyond it. The only thing that gates access.'],
        ['Tranq', 'Tranquilliser. Any of the dart weapons or the sedation serums.'],
        ['Pack', 'A group of up to five animals. Members within 60 studs give each other a damage bonus.'],
        ['Downed', 'Incapacitated but not dead. Can be revived by someone who reaches you.'],
        ['Duties', 'The task list for your current team, on J.'],
        ['Protected personnel', 'Members of Park Operations, Field Rangers, Containment Division or Helix Genetics, who cannot attack one another.'],
        ['Stud', 'Roblox’s unit of distance. Roughly a foot; a tall human is about five.'],
      ],
    },
  ],
}
