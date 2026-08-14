import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { openRoles, roleBySlug } from '@/content/roles'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function generateStaticParams() {
  return openRoles().map((role) => ({ slug: role.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const role = roleBySlug(slug)
  if (!role) return { title: `Careers at ${site.name}` }
  return { title: `${role.title} at ${site.name}`, description: role.summary }
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const role = roleBySlug(slug)
  if (!role || !role.open) notFound()

  return (
    <>
      <SiteHeader />
      <main className="shell">
        <article className="role-page">
          <Link className="back" href="/#careers">Back to careers</Link>
          <h1>{role.title}</h1>
          <p className="role-page-loc">{role.location}</p>
          <p className="role-page-summary">{role.summary}</p>
          {role.description?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <Link className="button" href={`/?role=${role.slug}#contact`}>
            Apply for this role
          </Link>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
