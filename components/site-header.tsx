'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/content/site'

const SCROLL_THRESHOLD = 40

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    // Intentionally no immediate call here. Reading window.scrollY during the
    // effect body would fire the setter synchronously on mount; the listener
    // below updates state only in response to real scroll events instead.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'hd is-scrolled' : 'hd'}>
      <div className="shell hd-in">
        <Link href="/" className="hd-brand">
          <Image src="/brand/mark.png" alt="" width={22} height={22} priority />
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
