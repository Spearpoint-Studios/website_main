'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/content/site'

// The header sits over the page, so treat the hero as "passed" once its
// bottom edge reaches roughly the header's own height, rather than waiting
// for it to leave the viewport entirely. That matches what the eye sees.
const HEADER_OVERLAP_PX = 72

// This is derived from scroll position rather than from an
// IntersectionObserver on the hero. The observer version shipped broken: it
// never reported the hero as non-intersecting on the home page, so the header
// kept its transparent dark-page styling while white content scrolled
// underneath, leaving near-white text on a white ground. Reading the hero's
// rect on scroll is deterministic and trivially verifiable in a browser.
//
// useSyncExternalStore rather than useState plus an effect, for two reasons.
// It computes the correct value on the very first render, so landing on a
// deep link part-way down the page is styled correctly immediately. And it
// avoids calling setState inside an effect, which this repo's lint config
// rejects.
function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

function readHeroPassed(): boolean {
  const hero = document.querySelector('.hero')
  // Pages with no hero are light throughout, so treat them as past it.
  if (!hero) return true
  return hero.getBoundingClientRect().bottom <= HEADER_OVERLAP_PX
}

// There is no layout on the server, so assume the top of the page. The home
// page renders its dark hero there, and every other page is forced light by
// isLightPage below, so this cannot produce a wrong first paint.
function heroPassedOnServer(): boolean {
  return false
}

export function SiteHeader() {
  const pathname = usePathname()
  const isLightPage = pathname !== '/'
  const pastHero = useSyncExternalStore(
    subscribeToScroll,
    readHeroPassed,
    heroPassedOnServer,
  )

  const isLight = isLightPage || pastHero

  return (
    <header className={isLight ? 'hd is-light' : 'hd'}>
      <div className="shell hd-in">
        <Link href="/" className="hd-brand">
          <Image
            src="/brand/mark.png"
            alt=""
            width={22}
            height={22}
            priority
            className="hd-brand-mark"
          />
          <b>{site.name}</b>
        </Link>
        <nav className="hd-nav">
          <Link href="/blog" className={pathname.startsWith('/blog') ? 'is-active' : undefined}>
            Blog
          </Link>
          <Link href="/wiki" className={pathname.startsWith('/wiki') ? 'is-active' : undefined}>
            Wiki
          </Link>
          <Link href="/careers" className={pathname === '/careers' ? 'is-active' : undefined}>
            Careers
          </Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
