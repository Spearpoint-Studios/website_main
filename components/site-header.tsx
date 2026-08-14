'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/content/site'

// Header height overlaps the page by roughly this much while sticky, so the
// hero is considered "passed" a little before its own box literally leaves
// the viewport, matching what the eye actually sees.
const HEADER_OVERLAP_PX = 72

export function SiteHeader() {
  const pathname = usePathname()
  const isLightPage = pathname !== '/'
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero || typeof IntersectionObserver === 'undefined') {
      // No hero on this page (e.g. /careers): nothing to observe, the header
      // stays in its light state throughout, decided below by isLightPage.
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: `-${HEADER_OVERLAP_PX}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

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
          <Link href="/careers" className={pathname === '/careers' ? 'is-active' : undefined}>
            Careers
          </Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
