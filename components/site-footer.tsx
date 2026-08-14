import Image from 'next/image'
import { site } from '@/content/site'
import { SocialLinks } from './social-links'

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="shell ft-in">
        <div className="ft-brand">
          <Image src="/brand/mark.png" alt="" width={16} height={16} />
          <span>{site.name}</span>
        </div>
        <SocialLinks />
      </div>
    </footer>
  )
}
