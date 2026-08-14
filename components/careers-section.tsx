import Link from 'next/link'
import { openRoles } from '@/content/roles'

export function CareersSection() {
  const roles = openRoles()

  return (
    <section className="section" id="careers">
      <h2>Careers</h2>
      <p className="lede">
        We are a small team, so everyone here owns something real. If that sounds right, we
        would like to hear from you.
      </p>
      {roles.length === 0 ? (
        <p className="lede">No open roles right now. Send us a message anyway if you think we should meet.</p>
      ) : (
        <div className="roles">
          {roles.map((role) => (
            <div className="role" key={role.slug}>
              <div className="role-t">
                <Link href={`/careers/${role.slug}`}>
                  <b>{role.title}</b>
                </Link>
                <span>{role.summary}</span>
              </div>
              <span className="role-loc">{role.location}</span>
              <Link className="role-go" href={`/?role=${role.slug}#contact`}>
                Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
