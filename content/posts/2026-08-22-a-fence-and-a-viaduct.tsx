import type { PostMeta } from './types'

export const meta = {
  slug: 'a-fence-and-a-viaduct',
  title: 'A fence and a viaduct',
  date: '2026-08-22',
  tag: 'Devlog',
  excerpt:
    'Two modular kits, and why almost everything structural gets built as a tile that repeats.',
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>
        Two things went through modelling this week: a containment fence, and a
        section of elevated monorail track. Neither is interesting on its own.
        What makes them worth writing about is that both were built the same
        way, and that way is how most of the structural set is going to get
        made.
      </p>

      <h2>Everything is a tile</h2>

      <p>
        Instead of modelling a fence, we model one span of fence. It has a post
        at one end, it ends exactly where the next copy begins, and its
        origin sits on the post rather than in the middle of nowhere. Line up
        twenty copies and you have a perimeter. Line up three and you have a
        gate surround.
      </p>

      <p>
        The viaduct is the same idea with a harder constraint. A bridge tile has
        to meet its neighbour at the same height <em>and</em> the same angle, or
        the join shows as a kink in something that is supposed to read as one
        continuous run. Getting the arch to end tangent to the tile edge is most
        of the work, and it is entirely invisible when it is right.
      </p>

      <h2>Why bother</h2>

      <p>
        Because the alternative is modelling every fence in the world
        individually, and then rebuilding all of them the first time someone
        decides the fence should be taller. A kit means that decision costs one
        file.
      </p>

      <p>
        It also means the pieces stop being precious. Once a tile snaps
        predictably, laying out a paddock is a layout problem rather than a
        modelling problem, and layout is something we can iterate on quickly.
      </p>
    </>
  )
}
