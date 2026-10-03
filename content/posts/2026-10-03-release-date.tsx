import type { PostMeta } from './types'

import { site } from '../site'

export const meta = {
  slug: 'release-date',
  title: 'Dinosaur Roleplay releases Friday 9 October at 22:00 CET',
  date: '2026-10-03',
  tag: 'Update',
  excerpt:
    'The wait is over. Dinosaur Roleplay goes live Friday 9 October at 22:00 CET, and we are running ads at launch, so we need every one of you in the server.',
  cover: {
    src: '/media/posts/release-date.webp',
    alt: 'A mosasaur breaching out of the lagoon in front of the stadium stands, framed like a camera viewfinder.',
  },
  countdown: {
    // 22:00 on Central European clocks, which are on summer time (UTC+2)
    // until 25 October.
    at: '2026-10-09T22:00:00+02:00',
    label: 'Dinosaur Roleplay goes live in',
  },
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>
        It is happening. Dinosaur Roleplay releases on Friday 9 October at{' '}
        <strong>22:00 CET</strong>. After months of rebuilding, bug fixing and
        late nights across different timezones, the new version is ready, and
        we want you there the second the doors open.
      </p>

      <h2>We are running ads, and that is where you come in</h2>

      <p>
        At launch we are putting money behind sponsored ads on Roblox to bring
        new players into the game. Here is the thing about ads: they only work
        if the people who click them land in a game that feels alive. A new
        player who joins an empty server leaves within a minute. A new player
        who joins a full lagoon, with people roleplaying, hunting and talking,
        stays.
      </p>

      <p>
        Roblox also pushes games that are doing well. The more players we have
        online in the first hours, the higher we climb in discovery, and the
        more of our ad budget turns into real, lasting players instead of
        quick bounces. Every one of you who is online at 22:00 makes the ads
        worth more.
      </p>

      <h2>How you can help</h2>

      <ul>
        <li>
          Be in the game at 22:00 CET, and stay a while if you can.
        </li>
        <li>
          Bring your friends. Invite them into your server so they start with
          people they know.
        </li>
        <li>
          Like and favourite the game. It helps more than you would think.
        </li>
        <li>
          Welcome new players. Show them around, roleplay with them, make them
          want to come back.
        </li>
        <li>
          Report bugs in the{' '}
          <a href={site.discordUrl} target="_blank" rel="noreferrer noopener">
            Discord
          </a>{' '}
          instead of leaving. We will be online all night fixing things.
        </li>
      </ul>

      <p>
        You have stuck with this game for years. Friday is the day to show
        up for it. See you in the lagoon on Friday at 22:00 CET.
      </p>

      <p>Lemon out!</p>
    </>
  )
}
