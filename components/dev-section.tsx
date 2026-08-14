import Image from 'next/image'
import { ScrollReveal } from '@/components/scroll-reveal'

// Three licensed stock photographs, not photographs of Spearpoint. The
// duotone treatment lives entirely in CSS (.dev-media-item in globals.css),
// not in the files themselves.
const GALLERY = [
  { src: '/media/workstation.jpg', width: 1400, height: 933 },
  { src: '/media/desk.jpg', width: 1400, height: 930 },
  { src: '/media/playtest.jpg', width: 1400, height: 933 },
] as const

export function DevSection() {
  return (
    <section className="section" id="development">
      <div className="shell">
        <ScrollReveal>
          <div className="section-head">
            <h2>How the work gets done</h2>
            <p className="lede">
              Design happens in the editor, systems get built in code, and then real players
              pick up a controller so we can see what actually happens.
            </p>
          </div>
          <div className="dev-media">
            {GALLERY.map((image) => (
              <div className="dev-media-item" key={image.src}>
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 48rem) 33vw, 100vw"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
