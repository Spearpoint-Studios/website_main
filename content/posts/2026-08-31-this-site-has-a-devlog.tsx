import { site } from '@/content/site'
import type { PostMeta } from './types'

export const meta = {
  slug: 'this-site-has-a-devlog',
  title: 'This site has a devlog',
  date: '2026-08-31',
  tag: 'Update',
  excerpt: 'Where to find what we are building, and what will show up here.',
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>
        Until now this site had one render on the home page and no way to say
        anything about it. That has been fixed. This is the first post on the
        studio devlog.
      </p>

      <h2>What goes here</h2>

      <p>
        Two kinds of thing. Devlogs, which are notes on whatever is currently
        being built, written while it is being built and without waiting for it
        to be finished. And updates, which are the shorter announcements worth
        putting somewhere permanent.
      </p>

      <p>
        We are not promising a schedule. Posts will appear when there is
        something real to show, which is a lower bar than it sounds and a more
        honest one than a weekly slot nobody fills.
      </p>

      <h2>Where else to find us</h2>

      <p>
        Most of the day-to-day conversation happens in{' '}
        <a href={site.discordUrl} target="_blank" rel="noreferrer noopener">
          our Discord
        </a>
        , and it will stay there. This page is for the things that deserve to
        outlive a chat scroll.
      </p>
    </>
  )
}
