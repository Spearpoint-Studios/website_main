import Image from 'next/image'
import { games } from '@/content/games'

export function GamesSection() {
  return (
    <section className="section" id="games">
      <h2>Games</h2>
      <p className="lede">Everything we have released, and what we are building next.</p>
      <div className="games">
        {games.map((game) => (
          <article className="game" key={game.slug}>
            <div className="game-art">
              <Image src={game.image} alt="" width={480} height={300} />
            </div>
            <h3>{game.title}</h3>
            <p>{game.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
