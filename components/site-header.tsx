import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/content/site'

export function SiteHeader() {
  return (
    <header className="hd">
      <div className="shell hd-in">
        <Link href="/" className="hd-brand">
          <Image src="/brand/mark.png" alt="" width={21} height={21} priority />
          <b>{site.name}</b>
        </Link>
        <nav className="hd-nav">
          <Link href="/#games">Games</Link>
          <Link href="/#careers">Careers</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
