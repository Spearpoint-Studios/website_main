import type { PostMeta } from './types'

export const meta = {
  slug: 'building-the-forest',
  title: 'Building the forest',
  date: '2026-08-15',
  tag: 'Devlog',
  excerpt:
    'The first environment render, and what a picture like this is actually for.',
  cover: {
    src: '/media/posts/building-the-forest.jpg',
    alt: 'A rendered forest scene with two theropod dinosaurs facing each other among ferns and boulders.',
  },
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>
        This is the first render we have been happy enough with to put somewhere
        public. Two theropods, a lot of ferns, and a boulder field, lit late in
        the day.
      </p>

      <h2>What a render like this is for</h2>

      <p>
        It is not a screenshot of a game. Nothing here is playable yet. A frame
        like this exists to answer questions that are much harder to answer
        while looking at a grey box: how dense the undergrowth needs to be
        before a forest reads as a forest, whether an animal that size still
        feels large when there are trees to compare it against, and how much of
        the scene survives once the light stops being flat.
      </p>

      <p>
        The scale question is the one that keeps coming back. An animal modelled
        in isolation always looks right, because there is nothing to argue with
        it. Put it next to a fern and a rock and you find out whether the
        proportions were ever real.
      </p>

      <h2>What comes next</h2>

      <p>
        Undergrowth is the expensive part. Every fern here is placed, and placing
        them one at a time does not scale past a single hero shot. The next piece
        of work is making that density something we can produce repeatedly rather
        than by hand.
      </p>
    </>
  )
}
