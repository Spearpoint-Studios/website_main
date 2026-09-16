import type { WikiPage } from './types'

/** Items are the contents of ReplicatedStorage.Locker.Supply in the place file. */
export const page: WikiPage = {
  meta: {
    slug: 'equipment',
    title: 'Equipment',
    category: 'Equipment',
    summary:
      'Everything in the locker that is not a firearm: restraints, serums, medical kit, survey tools and field supplies.',
    keywords: ['tools', 'items', 'locker', 'gear', 'supply', 'serum', 'prod', 'kit'],
    order: 1,
  },
  blocks: [
    {
      kind: 'text',
      body:
        'The supply side of the locker holds twenty-seven items. Most are team equipment rather than personal kit, and what you can draw depends on the job you are doing.',
    },
    { kind: 'heading', text: 'Restraint and control' },
    {
      kind: 'table',
      columns: ['Item', 'What it does'],
      rows: [
        ['Handcuffs', 'Detains a person. The standard way to hold someone without shooting them.'],
        ['Baton', 'Close-quarters non-lethal control.'],
        ['Cattle Prod', 'Moves an animal without damaging it. Short reach.'],
        ['Telescopic Shock Prod', 'The same idea with enough reach to use from outside biting range.'],
        ['Tranquillizer Gas Grenade', 'Area sedation, for when a single dart is not going to be enough.'],
      ],
    },
    { kind: 'heading', text: 'Serums' },
    {
      kind: 'text',
      body:
        'Serums are the chemical half of animal handling. The knock-out grades escalate, the wake-up grades reverse them, and the lethal grade exists for animals that are not coming back.',
    },
    {
      kind: 'table',
      columns: ['Item', 'What it does'],
      rows: [
        ['Knock Out Serum 1 – 3', 'Sedation, in three strengths. Larger animals need the higher grades.'],
        ['Wake Up Serum 1 – 2', 'Brings a sedated animal back round.'],
        ['Lethal Serum', 'Euthanasia. Restricted, and not a combat tool.'],
      ],
    },
    { kind: 'heading', text: 'Medical' },
    {
      kind: 'table',
      columns: ['Item', 'What it does'],
      rows: [
        ['Medbag', 'The general-purpose medical kit.'],
        ['Bandage', 'Stops bleeding and restores a little health.'],
        ['Dinosaur Splint', 'The animal equivalent, for a creature with a broken limb.'],
        ['Vital Scanner', 'Reads the condition of a person or animal before you treat it.'],
        ['Blood Sampler', 'Takes a sample, usually for Helix Genetics.'],
      ],
    },
    { kind: 'heading', text: 'Survey and observation' },
    {
      kind: 'table',
      columns: ['Item', 'What it does'],
      rows: [
        ['Binoculars', 'Look at something from a safe distance.'],
        ['Camera', 'Takes photographs.'],
        ['Trail Camera', 'Placed in the field and left there.'],
        ['Trail Cam Monitor', 'Views what the trail cameras are seeing.'],
        ['Tracker Gun', 'Tags an animal so it can be followed. Does no damage, which is why it is here and not with the weapons.'],
        ['PDA', 'The handheld terminal. Park information, duties, and system access.'],
      ],
    },
    { kind: 'heading', text: 'Field supplies' },
    {
      kind: 'table',
      columns: ['Item', 'What it does'],
      rows: [
        ['Ammo Bag', 'Resupplies reserve ammunition.'],
        ['Flare', 'Light and a visible marker.'],
        ['Cones', 'Marks off an area.'],
        ['Moving Equipment', 'For relocating things that do not walk.'],
        ['Feeder Supplies', 'Restocks the feeders.'],
        ['Repair Tools', 'Fixes what has broken.'],
      ],
    },
  ],
}
