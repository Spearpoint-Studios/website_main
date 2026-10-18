import type { PostMeta } from './types'

export const meta = {
  slug: 'release-notes-v0-2',
  title: 'Release notes v0.2',
  date: '2026-10-18',
  tag: 'Release notes',
  excerpt:
    'The Compy, skins for 21 dinosaurs, a VIP helicopter, 10 new badges, smoother dinosaur controls and a new dinosaur selection screen.',
} satisfies PostMeta

const skins = [
  'Acrocanthosaurus',
  'Aerosteon',
  'Allosaurus',
  'Ankylosaurus',
  'Baryonyx',
  'Carnotaurus',
  'Compsognathus',
  'Cryolophosaurus',
  'Iguanodon',
  'Kaprosuchus',
  'Majungasaurus',
  'Mosasaurus',
  'Pachyrhinosaurus',
  'Parasaurolophus',
  'Pentaceratops',
  'Spinosaurus',
  'Stegosaurus',
  'Tarbosaurus',
  'Tyrannosaurus Rex',
  'Tyrannotitan',
  'Velociraptor',
]

const badges = [
  'Clocked In',
  'Dutiful',
  'Lights Out',
  'Moving Day',
  'A Bone to Pick',
  'Eye in the Sky',
  'Deep Water',
  'Apex Predator',
  'Mutant',
  'Mad Science',
]

export default function Body() {
  return (
    <>
      <h2>New dinosaur</h2>

      <ul>
        <li>Added the Compy, available as a small carnivore.</li>
      </ul>

      <h2>Skins</h2>

      <p>
        Added multiple skins to almost all dinosaurs, check them out yourself!
        These dinosaurs now have skins:
      </p>

      <ul className="list-columns">
        {skins.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2>VIP</h2>

      <ul>
        <li>Added the VIP helicopter. You can only spawn it every 5 minutes.</li>
        <li>Added a golden VIP nametag.</li>
        <li>Increased the VIP game pass price by 50 Robux.</li>
      </ul>

      <h2>Badges</h2>

      <p>Added 10 badges:</p>

      <ul className="list-columns">
        {badges.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2>Dinosaur controls and AI</h2>

      <ul>
        <li>
          Improved the dinosaur control system with dynamic turning rates,
          acceleration and deceleration.
        </li>
        <li>
          Reverse is now on the middle mouse button. On mobile and console,
          pull your joystick back to reverse.
        </li>
        <li>Improved dinosaur AI, so dinosaurs now ignore water, among other fixes.</li>
      </ul>

      <h2>Interface</h2>

      <ul>
        <li>New dinosaur selection screen.</li>
        <li>New proximity prompt UI.</li>
        <li>Added a death screen.</li>
        <li>Added a hull HP display for helicopters.</li>
        <li>Improved the main menu animations.</li>
        <li>The loading screen now stays up for the whole loading process.</li>
        <li>
          Added pop-ups on the loading screen to like and favourite the game.
          This helps the game&apos;s stats on Roblox.
        </li>
      </ul>

      <h2>Map and spawns</h2>

      <ul>
        <li>Finished the T-Rex paddock.</li>
        <li>Dryosaurus now spawn in Galli Valley.</li>
        <li>Therizinosaurus now spawn in the Allosaurus paddock.</li>
        <li>Improved the map when viewing it as a dinosaur.</li>
        <li>Updated the old map images to include the new builds.</li>
      </ul>

      <h2>Other changes</h2>

      <ul>
        <li>Added an ATV driving animation.</li>
        <li>Added R15 locks.</li>
        <li>New command system for moderators and administrators.</li>
        <li>The game is now rated All Ages.</li>
      </ul>

      <h2>Removed</h2>

      <ul>
        <li>Removed the defib.</li>
      </ul>
    </>
  )
}
