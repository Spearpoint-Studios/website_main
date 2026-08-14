export type Game = {
  slug: string
  title: string
  blurb: string
  image: string
  url?: string
}

// PLACEHOLDER CONTENT. Replace with real titles, art, and Roblox links.
// Art belongs in public/games and should be 16:10, at most 200KB each.
export const games: Game[] = [
  { slug: 'game-one',   title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
  { slug: 'game-two',   title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
  { slug: 'game-three', title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
]
