# Spearpoint Studio website design

Date: 2026-08-14
Status: approved, pending content
Repo: `Spearpoint-Studios/website_main`
Production: https://spearpointstudio.com

## Context

The site currently serves a single static hello world page from Caddy on an OVH
VPS at `149.56.99.128`, fronted by Cloudflare with encryption mode Full (Strict).
Deploys happen through a systemd timer that fetches `origin/main` every minute
and hard-resets the working tree.

This document specifies replacing that page with a real studio site: a home page
with games and careers sections, a contact form that delivers to Discord, and
social links. Spearpoint Studio builds Roblox games.

## Goals

1. A site that reads as a working game studio rather than a template.
2. A contact form whose submissions arrive in Discord within seconds.
3. Careers listings that are trivial to edit as roles open and close.
4. A deploy pipeline where a broken commit cannot take production down.

## Non-goals

- A CMS. Content is typed data in the repo, edited by commit.
- User accounts, comments, or any persisted data. The site stores nothing.
- A blog or devlog. If one is wanted later it is a separate piece of work.
- Analytics. Not requested, and it would need a cookie banner.

## Design direction

The approved direction is "Vector, simplified", reviewed at
https://claude.ai/code/artifact/8798e4b8-df2f-4c6d-85b8-f00ab7114965

Rules that came out of that review and are binding on implementation:

- **One typeface.** Helvetica Neue, Helvetica, Arial. No monospace anywhere.
  Hierarchy comes from size and weight.
- **No slash separators.** Metadata strings like `Remote / Full time` or
  `Careers / 3 open roles` are forbidden. Labels are plain words.
- **The chevron mark appears exactly twice.** In the header, and small and muted
  in the footer. It is never a bullet, a divider, or a decorative element.
- **Minimal rules.** Sections separate with whitespace and at most a single
  light line. No hairline grid dividing every cell.
- White ground, near-black text (`#101A22`), muted body (`#47596A`), one blue
  accent (`#1F7FA8`) drawn from the brand bokeh.

### Brand assets

Source files live outside the repo at `C:\Users\adame\Documents\Game Resources\PR`
and get committed into `public/brand/`:

| Source | Committed as | Use |
|---|---|---|
| `Logo11TS.png` (500x500, alpha) | `mark.png` | Header and footer logo |
| `LogoCover.png` (2064x425) | `cover.jpg` | Full bleed band under the hero |
| `Logo11.png` (969x923) | `og.jpg` | Open Graph and social preview image |

The bokeh sources are photographic and must ship as JPEG, not PNG. As PNG the
cover is 888KB; at quality 82 it is 30KB for the same visual result.

## Information architecture

A single page with anchored sections, plus one standalone route.

| Route | Contents |
|---|---|
| `/` | Header, hero, brand band, Games, Careers, Contact, footer |
| `/careers/[slug]` | Full description for one role, with an Apply link back to Contact |
| `/api/contact` | POST endpoint, forwards to Discord |

Careers detail pages exist so a role can be linked directly when it is posted
somewhere else. If a role has no long description it renders the summary and the
Apply link, which is still a valid page.

## Content model

`content/games.ts` and `content/roles.ts` export typed arrays. No database, no
fetch at runtime.

```ts
export type Game = {
  slug: string
  title: string
  blurb: string          // one line, shown on the card
  image: string          // path under /public/games
  url?: string           // Roblox experience link
}

export type Role = {
  slug: string
  title: string
  location: string       // "Remote", "Part time". One word or two, never slashed
  summary: string        // one line, shown in the list
  description?: string   // markdown-free paragraphs for the detail page
  open: boolean
}
```

`open: false` hides a role from the list without deleting it, so a role can come
back without rewriting it.

## Contact form

### Flow

1. Browser posts JSON to `/api/contact`.
2. Route validates, applies spam and rate checks, and on success posts a Discord
   embed to `DISCORD_WEBHOOK_URL`.
3. Route returns `{ ok: true }` or `{ ok: false, error: string }`.

The webhook URL is read from the environment inside the route handler. It is
never imported into a client component, never prefixed `NEXT_PUBLIC_`, and never
returned in a response.

### Request

```ts
{
  name: string       // 1..80
  email: string      // 3..160, must contain @ and a dot after it
  subject: string    // 1..120
  message: string    // 10..4000
  role?: string      // slug, set when arriving from an Apply link
  website?: string   // honeypot, must be empty
  renderedAt: number // epoch ms, set when the form mounts
}
```

### Validation and rejection rules

| Condition | Response |
|---|---|
| Any required field missing or out of range | 400, names the offending field |
| `website` non-empty | 200 `{ ok: true }`, silently discarded |
| `Date.now() - renderedAt < 3000` | 200 `{ ok: true }`, silently discarded |
| More than 5 submissions from one IP in 10 minutes | 429, asks the sender to try later |
| Discord returns non-2xx | 502, generic message, real error logged server side |

Bot rejections return success on purpose. Telling a bot it was detected teaches
whoever wrote it how to get past the check.

### Rate limiting behind Cloudflare

**This is the one detail most likely to be got wrong.** Every request arrives
from a Cloudflare edge IP, so keying a limiter on the socket address throttles
the entire internet as a single visitor. The client IP must be read from
`CF-Connecting-IP`, falling back to the first entry of `X-Forwarded-For`, and
only then to the socket address.

Storage is an in-memory Map with timestamp pruning. The site runs as one process,
so this is sufficient and needs no Redis. If the app is ever scaled to multiple
instances this limiter becomes per-instance and must be revisited.

### Discord message format

An embed, not a plain content string, so long messages stay readable:

- Title: the subject
- Description: the message body, truncated at 4000 to respect Discord's limit
- Fields: name, email, and role when present
- Colour: `0x1F7FA8`, the site accent
- Timestamp: submission time

### Client behaviour

The form is a client component. On submit it disables the button and shows a
pending state. On success it replaces itself with a confirmation. On failure it
shows the error above the form and **keeps every field populated**, because
losing a long message to a network blip is the worst outcome available here.

## Careers

Roles render from `content/roles.ts` filtered to `open: true`. Each row shows
title, summary, and location, with an Apply link.

Apply routes to `/?role=<slug>#contact`. The query string must precede the
fragment; `/#contact?role=<slug>` puts the parameter inside the fragment where
`useSearchParams` cannot see it. The contact form reads the parameter, prefills
the subject as `Application: <role title>`, and sends the slug in the `role`
field so the Discord embed shows which role it was.

There is no separate application form and no file upload. A portfolio link goes
in the message body.

## Social links

Footer only, as icons with accessible labels. Discord, Twitter, GitHub.

URLs live in `content/site.ts` alongside other studio constants. Implementation
uses the official brand SVG paths, not the simplified stand-ins from the mockup.

## Infrastructure changes

The VPS currently has no Node runtime. Moving from static files to Next.js
requires:

1. **Node 24 LTS** installed from NodeSource.
2. **A systemd service** `spearpoint-web.service` running `next start` bound to
   `127.0.0.1:3000`, so the app is not directly reachable from the internet.
3. **Caddy switches from `file_server` to `reverse_proxy 127.0.0.1:3000`.**
   The `hide .git` directive that currently protects the repo metadata becomes
   unnecessary once Caddy stops serving the directory, but the web root stops
   being a served directory at all, which closes that class of problem entirely.

Caddy keeps its own Let's Encrypt certificate and Cloudflare stays on Full
(Strict). The firewall rules do not change: 22 rate limited, 80 and 443 open.

## Deploy pipeline

Replaces the current pull-and-reset script. Trigger stays the same, a systemd
timer every minute, so no credentials exist anywhere and nothing inbound is
exposed.

### Layout

```
/var/www/spearpoint/
  repo/                    working clone, fetched from but never served
  releases/
    <short-sha>/           full build output, one per deploy
  shared/
    .env                   DISCORD_WEBHOOK_URL, never in git
  current -> releases/<short-sha>
```

### Algorithm

1. Fetch `origin/main`. If the remote SHA equals the SHA of `current`, exit.
2. Create `releases/<sha>`, export the tree into it.
3. Symlink `shared/.env` into the release.
4. `npm ci --omit=dev` then `npm run build`.
5. **If any step above fails, delete the release directory and exit non-zero.
   The symlink never moves and the running site is untouched.**
6. Repoint `current` at the new release atomically.
7. `systemctl restart spearpoint-web`.
8. Prune all but the newest three releases.

Rollback is repointing `current` at the previous release and restarting. That is
worth writing as `spearpoint-rollback` so it is one command under pressure.

### Build resources

The box has 3.7GB RAM and 36GB free. A Next.js build of this size fits
comfortably. If builds ever start failing on memory, the answer is building in
CI rather than adding swap.

## Environment

`shared/.env` on the server, `.env.local` for local development, and
`.env.example` committed as documentation.

| Variable | Purpose |
|---|---|
| `DISCORD_WEBHOOK_URL` | Contact form destination. Server side only. |

The existing `.gitignore` already ignores `.env` and `.env.*` while explicitly
un-ignoring `.env.example`, so the documentation file commits and the real ones
cannot. The webhook URL is a capability: anyone holding it can post to the
channel. It is written directly on the server and never pasted into chat, a PR,
or CI.

## Testing

- **Unit.** Validation and the rate limiter, including the Cloudflare header
  precedence, which is the piece most likely to regress silently.
- **Route.** `/api/contact` with the Discord call stubbed, covering success,
  each rejection rule, and a Discord outage returning 502.
- **Manual before shipping.** One real submission arriving in the Discord
  channel, one Apply link prefilling correctly, the form preserving input after
  a forced failure, and the site rendering at 375px wide.

## Inputs still needed

The build can proceed on layout, styling, the form, and the deploy pipeline
without these. Content files ship with clearly marked placeholders until they
arrive.

| Input | Blocks |
|---|---|
| Game titles, art, one line each | Games section |
| Real open roles | Careers section and detail pages |
| Discord invite, Twitter handle, GitHub org URL | Footer links |
| Studio facts: founded, team size, shipped work | Hero and any about copy |
| `DISCORD_WEBHOOK_URL` | Contact form delivery, written on the server |

## Risks

| Risk | Mitigation |
|---|---|
| A bad commit breaks the build | Symlink only moves after a successful build |
| Rate limiter keyed on Cloudflare IP throttles everyone | Read `CF-Connecting-IP`; covered by a unit test |
| Webhook URL leaks | Server-only env var, never `NEXT_PUBLIC_`, never echoed in a response |
| Node process dies | `Restart=always` in the unit file |
| Site has no real game art | Design chosen partly because the grid carries it, but this remains the largest quality gap |
