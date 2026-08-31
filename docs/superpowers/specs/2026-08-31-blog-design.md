# Spearpoint Studio blog design

Date: 2026-08-31
Status: approved
Repo: `Spearpoint-Studios/website_main`
Production: https://spearpointstudio.com
Supersedes: the "no blog or devlog" non-goal in
`2026-08-14-spearpoint-website-design.md`, which said a blog would be a separate
piece of work. This is that work.

## Context

The site ships a home page (hero, work-in-progress showcase, careers teaser,
contact form) and a `/careers` page holding an empty state. Content is typed data
in the repo, edited by commit. There is no place to say what the studio is
building, and the one render on the home page sits in a section with no story
around it and nowhere to click through to.

Two defects found while reviewing the running site are fixed in the same pass.
Both are consequences of the light redesign in `401a3a9` and the careers
simplification in `59623b9` rather than anything new.

## Goals

1. Posts are hardcoded. Adding one is a new file plus one import line, with no
   CMS, no fetch at runtime, and no new runtime dependency.
2. Getting a post wrong is a build failure, not a broken page.
3. The home page's work-in-progress section leads somewhere.
4. The header is legible at the top of the home page.

## Non-goals

- Markdown or MDX. Chosen against because it costs `@next/mdx` plus remark in a
  repo whose entire dependency list is `next` and `react`.
- Tag filtering, pagination, search, RSS, comments, or reactions. Two tags and a
  handful of posts do not need any of them. Each is cheap to add later against
  the same registry.
- A role detail route. See "Fix: careers dead code" below.
- Analytics. Unchanged from the original spec: it would need a cookie banner.

## Binding rules inherited from the original spec

These carry over unchanged and constrain this work:

- **One typeface.** The `--sans` stack. No monospace anywhere, including inside
  post bodies.
- **No slash separators** in user-visible metadata. `Devlog / 31 August 2026` is
  forbidden. The tag and the date are separate elements with no separator glyph
  between them, and a test asserts it the way `roles.test.ts` already does.
- **Minimal rules.** Whitespace and a ground change separate sections. No
  hairline grid.
- **The brand chevron mark appears exactly twice**, in the header and the footer.
  The generic arrow chevrons already shipped in `.card-teaser-go` and
  `.button-link-chevron` are not the brand mark and may be reused.

The original spec's hex values (`#101A22`, `#47596A`, `#1F7FA8`) were superseded
by the Apple-style palette in `401a3a9`. The tokens in `globals.css` are
authoritative: `--l-text`, `--l-muted`, `--l-accent`, `--l-line`, `--l-alt`.

## Content model

`content/posts/`, one file per post, registered in `index.ts`.

```ts
export type PostTag = 'Devlog' | 'Update'

export type PostCover = {
  src: string          // path under /public
  alt: string          // required; a cover is never decorative
}

export type PostMeta = {
  slug: string         // URL segment, kebab-case, no date prefix
  title: string
  date: string         // 'YYYY-MM-DD'. Sort key and article publishedTime
  tag: PostTag
  excerpt: string      // one or two sentences. Card text and OG description
  cover?: PostCover
}

export type PostModule = {
  meta: PostMeta
  default: React.ComponentType
}
```

A post file:

```tsx
import type { PostMeta } from './types'

export const meta = {
  slug: 'feeding-dinosaurs',
  title: '...',
  date: '2026-08-31',
  tag: 'Devlog',
  excerpt: '...',
  cover: { src: '/media/posts/feeding-dinosaurs.jpg', alt: '...' },
} satisfies PostMeta

export default function Body() {
  return (
    <>
      <p>...</p>
    </>
  )
}
```

`satisfies PostMeta` rather than `: PostMeta` on purpose. It type-checks every
field while keeping the literal types, so `meta.tag` stays `'Devlog'` instead of
widening to `PostTag`. A missing field, a misspelled tag, or a stray property is
a compile error.

The filename carries a date prefix (`2026-08-31-feeding-dinosaurs.tsx`) so the
directory sorts chronologically for a human reading it. The prefix is not parsed;
`meta.date` is the only source of truth for ordering.

### Registry

```ts
// content/posts/index.ts
import * as feedingDinosaurs from './2026-08-31-feeding-dinosaurs'

const registry: PostModule[] = [feedingDinosaurs]

export function allPosts(): PostModule[]        // newest first
export function latestPosts(count: number): PostModule[]
export function postBySlug(slug: string): PostModule | undefined
```

**Why an explicit registry and not a directory scan.** Turbopack has no
`import.meta.glob`, and `require.context` is webpack-only, so neither survives
`next build`. Reading the directory with `fs` would list the files but could not
turn a runtime-computed path into an imported component. One import line per post
is statically analysable, works identically in dev and in the production build,
and gives `generateStaticParams` a single source of truth.

`allPosts()` sorts by `meta.date` descending, breaking ties on `slug` so the
order is deterministic when two posts share a date.

## Information architecture

| Route | Contents |
|---|---|
| `/` | Header, hero, **Latest** (replaces Work in progress), Careers teaser, Contact, footer |
| `/blog` | Every post, newest first, in a card grid. Empty state when the registry is empty, reusing the `.careers-empty` card treatment with its own copy |
| `/blog/[slug]` | One post |

`Blog` joins the header nav ahead of `Careers`. The footer is unchanged.

Both blog routes are light throughout with no hero, which `SiteHeader` already
handles: it forces the light header state for any `pathname !== '/'`.

### `/blog/[slug]`

- `generateStaticParams` returns every slug from the registry, so posts are
  statically rendered at build time.
- `generateMetadata` per post: `title`, `excerpt` as description, OpenGraph
  `type: 'article'` with `publishedTime: meta.date`, and `cover.src` as the OG
  image falling back to `/brand/og.jpg`.
- An unknown slug calls `notFound()`. `generateStaticParams` covers every real
  slug, so this only fires for a hand-typed URL.
- `params` is a Promise in Next 16 and must be awaited in both the page and
  `generateMetadata`. Reading `params.slug` directly type-checks against the
  generated route types and then fails at runtime.
- Layout: eyebrow tag, `h1`, date, cover image in the existing `.showcase` frame,
  then the body inside a `.prose` scope, then a link back to `/blog`.

### Post body styling

Post bodies are authored as plain elements and styled by a single `.prose` scope,
so writing a post never involves choosing a class. `.prose` sets the measure,
vertical rhythm, and heading sizes, and gives `a` the accent colour with an
underline. It covers `p`, `h2`, `h3`, `ul`, `ol`, `li`, `strong`, `em`,
`blockquote`, `figure`, `figcaption`, and `img`.

`h1` is owned by the page, not the body, so a post body starting with `h2` is
correct and the document has exactly one `h1`.

## Home page change

`components/dev-section.tsx` is deleted. `components/latest-posts.tsx` replaces
it in the same slot: section head "Latest", then `latestPosts(3)` as cards, then
a `.button-link` reading "Read all posts" through to `/blog`.

`public/media/showcase.jpg` moves to `public/media/posts/` and becomes the first
post's cover. The render keeps its place on the page and now leads somewhere.
`.showcase` CSS is repurposed as the post-page cover frame rather than deleted,
since it is exactly the treatment a post cover wants.

The section renders nothing at all when the registry is empty, rather than an
empty band with a heading over it.

### Post card

Shared by `/blog` and the home page, one component,
`components/post-card.tsx`. Cover image in a 16:9 frame, tag, title, date,
excerpt. The whole card is one link. It reuses the existing `a.card` hover lift
so it matches the careers teaser.

The date renders as `31 August 2026` inside a `<time dateTime={meta.date}>`.
Formatted with `Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' })` — pinned
locale and time zone, because an unpinned formatter renders a different string on
the server than in the browser and Next reports it as a hydration mismatch.

Grid: explicit breakpoints rather than `auto-fit`/`auto-fill`, because both make
the column count a function of the container width and neither can be capped at 3
without `minmax(max(...))` arithmetic that is harder to read than the media
queries it replaces.

| Width | Columns |
|---|---|
| below 40rem | 1 |
| 40rem to 64rem | 2 |
| 64rem and up | 3 |

A single post therefore renders at one third width and left-aligned, not
stretched across the row.

The tag renders as a `.post-tag` label on a card and as the existing `.eyebrow`
on the post page. There is no separator glyph between the tag and the date in
either place, per the inherited no-slashes rule.

## Fix: header white band at the top of the home page

`.hd` is `position: sticky` with a transparent background. Sticky keeps the
element in normal flow, so at scroll 0 the header occupies a strip above the hero
and paints `body`'s ground through itself. `body` was dark when this was written
and became white in `401a3a9`, so the header's white-and-cyan text now sits on a
white band and the brand name and logo mark are close to invisible. This is the
first thing every visitor sees.

The fix is `position: fixed`. The header leaves the flow, the hero starts at
y = 0, and the header overlays the dark hero as `site-header.tsx`'s own comment
already describes. No JavaScript changes: `readHeroPassed` compares the hero's
bottom edge against `HEADER_OVERLAP_PX` and stays correct.

Clearances to verify rather than assume:

- The hero's `padding: 7rem 0 3rem` must clear the fixed header. Under 34rem the
  header stacks to a column and grows taller, so the hero's small-width padding
  is raised to match.
- `.careers-page` has `padding: 8rem 0 6rem` and clears it. `/blog` and
  `/blog/[slug]` get the same top padding.
- `body` stays `display: flex; flex-direction: column` with
  `main { flex: 1 0 auto }`. Removing the header from the flow leaves main and
  footer, so the sticky footer still works.

Related, and the reason the anchors currently land wrong: `#contact` and `#work`
scroll their target to y = 0, which is underneath the header. Anchored sections
get `scroll-margin-top`.

## Fix: careers dead code

`openRoles()` in `content/roles.ts` is never called. `/careers` hardcodes its
empty state, so adding a role to the array today changes nothing on the page —
the array is a promise the site does not keep.

`/careers` now reads `openRoles()`. Empty renders the existing empty state,
unchanged. Non-empty renders a list of role cards showing title, location,
summary, and the optional `description` paragraphs inline, each with an Apply
link to `/?role=<slug>#contact`.

**Correction to an earlier draft of this spec.** That draft also called
`roleBySlug()` dead and specified deleting it. That was wrong:
`components/contact-form.tsx:14` calls it to resolve the `role` query parameter
and prefill the subject line as `Application: <title>`. It is live code on the
Apply path. It stays, and `roles.test.ts` keeps its assertions.

The Apply link therefore completes a path that already exists end to end:
`/careers` sets `?role=<slug>`, the contact form resolves it through
`roleBySlug`, and `lib/contact-schema.ts` carries `role` into the Discord embed
as its own field. None of that had a caller until now.

## Fix: shorthand padding clobbering the shell gutter

Found while verifying `/blog`, and pre-existing.

`.careers-page { padding: 8rem 0 6rem }` is a shorthand, and it is defined after
`.shell { padding: 0 var(--gutter) }`. Both are single-class selectors, so the
later one wins outright and sets left and right padding to zero. Any page using
`class="shell careers-page"` therefore has no horizontal gutter at all.

On `/careers` this hid behind `max-width: 46rem`: the block is centred, so on a
wide screen the content never reaches the edge and the bug is invisible. Below
46rem it has been running edge to edge since the light redesign. `/blog` made it
obvious immediately, because at `--measure` (76rem) the grid touches both edges
and the third card leaves the viewport.

All three page classes use `padding-top` / `padding-bottom` longhand instead, so
`.shell`'s horizontal padding survives. The longhand must stay longhand: any
future edit back to the shorthand reintroduces this.

## Repository hygiene

Next 16's dev server writes two files the repo does not want:

- `AGENTS.md` and `CLAUDE.md` are generated on every `next dev`. Disabled with
  `agentRules: false` in `next.config.ts`.
- `next-env.d.ts` is rewritten to point at `.next/dev/types` in dev and
  `.next/types` in build. The dev variant is reverted, not committed.

## Testing

`content/posts/index.test.ts
lib/post-date.ts
lib/post-date.test.ts`, written before the registry, covering the mistakes
an author actually makes when hardcoding a post:

| Assertion | Catches |
|---|---|
| Slugs are unique | Two posts silently colliding on one URL |
| Slugs are kebab-case with no date prefix | A URL that does not match the design |
| Every `date` matches `YYYY-MM-DD` and parses | A typo that breaks sort order |
| No `date` is more than a day in the future | A typo like `2062-08-31`, which would pin that post to the top of the feed forever and silently. One day of slack absorbs time zones. |
| `title` and `excerpt` are non-empty | A card that renders blank |
| No user-visible string contains ` / ` | The inherited no-slashes rule |
| Every `cover.src` resolves to a file under `public/` | A cover that 404s |
| Every `cover.alt` is non-empty | An unlabelled image |
| `allPosts()` is sorted newest first | A regression in the sort |
| Every post exposes a body component | A file exporting `meta` but no default |
| `postBySlug` finds every registered post and returns undefined otherwise | A broken route |

Existing suites must stay green and unmodified. `roles.test.ts` is untouched.

`lib/post-date.test.ts` covers the formatter separately, including a time-zone
assertion proved non-vacuous by removing `timeZone: 'UTC'` and watching it fail
with `30 August 2026`.

The visual fixes are verified in a browser at the top of the home page, at
`/careers`, at `/blog`, and on a post, at desktop and at 375px, since neither is
something a unit test can see.

## Files

**New**

```
content/posts/types.ts
content/posts/index.ts
content/posts/index.test.ts
lib/post-date.ts
lib/post-date.test.ts
content/posts/2026-08-15-building-the-forest.tsx
content/posts/2026-08-22-a-fence-and-a-viaduct.tsx
content/posts/2026-08-31-this-site-has-a-devlog.tsx
components/post-card.tsx
components/latest-posts.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx
public/media/posts/                        cover images
```

**Modified**

```
app/page.tsx                DevSection -> LatestPosts
app/careers/page.tsx        read openRoles(), render role cards
app/globals.css             header fixed, scroll-margin, blog styles, .prose
components/site-header.tsx  add Blog to nav
next.config.ts              agentRules: false
```

**Deleted**

```
components/dev-section.tsx
public/media/showcase.jpg   (moved under public/media/posts/)
```

## Seed content

Three posts ship so the grid fills at every breakpoint and both card variants
are exercised against real content.

| Slug | Date | Tag | Cover |
|---|---|---|---|
| `building-the-forest` | 2026-08-15 | Devlog | the existing forest render |
| `a-fence-and-a-viaduct` | 2026-08-22 | Devlog | none |
| `this-site-has-a-devlog` | 2026-08-31 | Update | none |

Two of the three have no cover, which is deliberate: it exercises the optional
`cover` path and the card layout that has to work without an image.

Subject matter is drawn only from work that demonstrably exists: the committed
render, and the modular paddock fence and monorail viaduct kits being modelled
for the dinosaur roleplay project. No internal measurements or schedule details
go into public copy.

**The prose is a draft written by the implementer, not studio-approved copy.** It
is factually conservative and makes no claims about dates, headcount, or release
plans. It is expected to be rewritten before it reaches production, and the
handover must say so explicitly.

## Code style

New code carries no comments, per the repo owner's standing preference. Existing
comments are left intact, including the ones in `site-header.tsx` that document
why the header stopped using an IntersectionObserver — that history stays true
after the sticky-to-fixed change and is worth keeping.
