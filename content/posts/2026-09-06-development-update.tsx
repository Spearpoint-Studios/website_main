import type { PostMeta } from './types'

export const meta = {
  slug: 'development-update',
  title: 'Development update',
  date: '2026-09-06',
  tag: 'Update',
  excerpt:
    'The new version is close. Most of the human builds are remade, the dinosaur terrain stays, and the wait is nearly done.',
  cover: {
    src: '/media/posts/development-update.webp',
    alt: 'A night-time street in the remade town, lit by lamp posts and neon signs, with palm trees, an arcade, and a thatched-roof building on the corner.',
  },
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>
        We have been working hard day and night, across different timezones, to
        push a new version of the game you have loved for years. We are close to
        completion, and while we cannot give out a release date just yet because
        we are afraid of having to delay it, I can promise you that the waiting
        is nearly done.
      </p>

      <p>
        Most of the main human builds have been remade, while the rest of the
        dinosaur terrain is staying the same. The game has not lost its charm,
        but we do have to move in a way that lets us finance this.
      </p>

      <p>
        I can tell you this much: the game will no longer be chaos with fifty
        T-Rexes fighting off the ACU. There will be limits set and amends made
        between the community and the studio, so that the gameplay ends up in
        the right place.
      </p>

      <p>
        One of my close friends,{' '}
        <a
          href="https://www.roblox.com/users/106709/profile"
          target="_blank"
          rel="noreferrer noopener"
        >
          @98a
        </a>
        , and I are now making the last pushes, programming and fixing bugs that
        have been there for a long time. Let it be known that we are listening
        closely to what the community has been asking for for years. We are
        slowly getting it done.
      </p>

      <p>Thanks for everything. Lemon out!</p>
    </>
  )
}
