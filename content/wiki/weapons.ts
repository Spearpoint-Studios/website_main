import type { WikiPage } from './types'

/**
 * Stats are read straight out of each weapon's BlasterSettings.Stats in the
 * place file (ReplicatedStorage.Locker.Guns), not estimated. If a weapon is
 * retuned in Studio, these need updating to match.
 *
 * Tracker Gun is deliberately absent: it carries no BlasterSettings because it
 * does no damage. It is on the equipment page instead.
 */
export const page: WikiPage = {
  meta: {
    slug: 'weapons',
    title: 'Weapons',
    category: 'Equipment',
    summary:
      'Every firearm in the locker with its damage, rate of fire, magazine, reserve ammunition and reload time.',
    keywords: [
      'guns', 'firearms', 'rifle', 'shotgun', 'pistol', 'smg', 'sniper',
      'dps', 'stats', 'damage', 'loadout', 'tranq', 'dart',
    ],
    order: 0,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'There are 22 firearms in the locker. Which ones you can draw depends on your team: most are Containment Division issue, Field Rangers carry tranquilliser equipment, and the rest of the park is unarmed.',
    },
    {
      kind: 'text',
      body:
        'Damage is per shot against a human target. Rate of fire is rounds per minute. Reserve is the ammunition carried beyond the loaded magazine.',
    },
    {
      kind: 'table',
      columns: ['Weapon', 'Class', 'Damage', 'RPM', 'Magazine', 'Reserve', 'Reload'],
      rows: [
        ['BERETTA M9A3', 'Sidearm', '15', '250', '17', '102', '2s'],
        ['Springfield 1911', 'Sidearm', '20', '350', '9', '153', '2s'],
        ['CZ Scorpion Evo 3', 'Submachine gun', '15', '850', '30', '150', '2s'],
        ['M16A2', 'Submachine gun', '22', '700', '30', '150', '4s'],
        ['MP5', 'Submachine gun', '13', '750', '40', '150', '2s'],
        ['MPX', 'Submachine gun', '22', '700', '35', '140', '2s'],
        ['CMMG MK. 47 MUTANT', 'Rifle', '35', '600', '30', '150', '2s'],
        ['M1A EBR', 'Rifle', '40', '650', '20', '80', '2s'],
        ['M4A1', 'Rifle', '24', '700', '30', '150', '2s'],
        ['MCX', 'Rifle', '27', '600', '30', '150', '2s'],
        ['REMINGTON RSASS', 'Rifle', '35', '350', '20', '100', '2s'],
        ['M110', 'Marksman', '40', '150', '20', '80', '2s'],
        ['Remington 700', 'Marksman', '35', '50', '5', '30', '4s'],
        ['BENELLI M4', 'Shotgun', '50', '80', '5', '30', '6s'],
        ['Remington 870', 'Shotgun', '45', '45', '6', '30', '6s'],
        ['UTS 15', 'Shotgun', '65', '55', '15', '30', '6s'],
        ['T-', 'Tranquilliser', '70', '100', '1', '150', '2s'],
        ['T-10', 'Tranquilliser', '250', '250', '1', '150', '2s'],
        ['T-15', 'Tranquilliser', '6', '900', '100', '350', '15s'],
        ['T-29', 'Tranquilliser', '10', '500', '42', '350', '3s'],
        ['T-40', 'Tranquilliser', '200', '250', '30', '150', '2s'],
        ['Tranquillizer Rifle', 'Tranquilliser', '400', '250', '12', '120', '5s'],
      ],
    },
    { kind: 'heading', text: 'Reading the table' },
    {
      kind: 'text',
      body:
        'Damage and rate of fire together matter more than either alone. The MP5 does 13 a shot but fires at 750, which is more damage per second than the 24-damage M4A1 at 700. The trade is reserve ammunition and how quickly recoil takes you off target.',
    },
    {
      kind: 'text',
      body:
        'Shotguns list a low rate of fire because it is per trigger pull rather than per pellet. The Benelli M4 at 50 a shot and the UTS 15 at 65 are the hardest hitting things in the locker short of a tranquilliser.',
    },
    { kind: 'heading', text: 'Tranquillisers' },
    {
      kind: 'text',
      body:
        'The tranquilliser weapons carry enormous damage numbers because that number is sedation, not injury. They are the only thing that works on a contained animal, which cannot be killed. A tranquillised dinosaur goes down rather than dying.',
    },
    {
      kind: 'text',
      body:
        'The T-series are single-purpose dart guns. The T-10 and T-40 are the heavy options with one and thirty darts respectively, the T-15 and T-29 trade per-dart power for volume, and the Tranquillizer Rifle sits in the middle with twelve darts and a five second reload.',
    },
    { kind: 'heading', text: 'Fire modes' },
    {
      kind: 'text',
      body:
        'Weapons listing more than one mode can be switched in the field. Auto holds fire while the trigger is down, Semi is one round per pull, and Shotgun fires a spread from a single pull.',
    },
    {
      kind: 'note',
      body:
        'These numbers come from the weapon configuration in the live place file. If a weapon feels different in game to what is written here, the wiki is the thing that is out of date.',
    },
  ],
}
