import Image from 'next/image'
import { ScrollReveal } from '@/components/scroll-reveal'

// A render from the studio's own work, so it carries no duotone treatment.
// The earlier stock photographs were tinted to hide that they were bought.
// This is the actual art and should be seen exactly as it was rendered.
//
// One image, shown large, rather than a grid. Only a single render exists so
// far, and repeating it across three tiles reads as a bug rather than a
// gallery. Adding more is a matter of dropping files in and switching this
// back to a grid.
const SHOWCASE = {
  src: '/media/showcase.jpg',
  width: 1920,
  height: 1080,
  alt: 'A rendered forest scene from a Spearpoint Studio project, with two theropod dinosaurs facing each other among ferns and boulders.',
}

export function DevSection() {
  return (
    <section className="section" id="work">
      <div className="shell">
        <ScrollReveal>
          <div className="section-head">
            <h2>Work in progress</h2>
            <p className="lede">
              Environments, creatures, and the systems that bring them to life. A look at
              what is being built right now.
            </p>
          </div>
          <figure className="showcase">
            <Image
              src={SHOWCASE.src}
              alt={SHOWCASE.alt}
              width={SHOWCASE.width}
              height={SHOWCASE.height}
              sizes="(min-width: 76rem) 1200px, 100vw"
              priority={false}
            />
          </figure>
        </ScrollReveal>
      </div>
    </section>
  )
}
