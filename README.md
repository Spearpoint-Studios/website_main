# website_-main
Our main website, all traffic that goes through spearpointstudio.com uses this source code.

## Stack

Next.js (App Router) with React and TypeScript. Styling is one plain stylesheet,
`app/globals.css` — no CSS framework. Tests run on vitest.

There are no runtime dependencies beyond `next` and `react`. That is worth
keeping: it is why the build is fast and why there is nothing to audit. Reach
for a package only when hand-writing the thing would genuinely be worse.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest
npm run lint
npm run build   # what CI and the VPS run
```

## Content

Content is typed TypeScript modules under `content/`, registered by hand in an
`index.ts`. There is no CMS and no markdown parser.

| | |
|---|---|
| `content/posts/` | Blog posts. A `meta` export plus a React component for the body. |
| `content/wiki/` | Game wiki. A `meta` export plus a list of content blocks. |

The wiki is **data, not JSX**: a page is an array of blocks (`text`, `heading`,
`list`, `table`, `note`), rendered by `components/wiki-blocks.tsx`. Writing a
page needs no React, formatting stays consistent for free, and the search index
is derived from the same blocks the page renders from — so a page can never be
findable by a word it no longer contains.

Search (`lib/wiki-search.ts`) is hand-rolled and has no dependencies. The whole
corpus is a few dozen short pages, so it is built at build time, shipped with
the page as data, and scored in the browser on each keystroke. Every word typed
has to appear on a page, so a longer query narrows rather than widens.

To add a wiki page: write `content/wiki/<slug>.ts`, add it to the registry in
`content/wiki/index.ts`, and run `npm test`. The registry tests check slugs,
categories, empty blocks, and that every table row has as many cells as the
table has columns.

## Deployment

Production is an OVH VPS at `149.56.99.128` running the Next.js app under
systemd, behind Caddy, behind Cloudflare on Full (Strict).

Push to `main` and it is live within about a minute plus however long the
build takes. A build that fails is discarded; the running site is left
completely untouched.

| Piece | Path |
|---|---|
| Deploy script | `/usr/local/bin/spearpoint-deploy` |
| Rollback | `/usr/local/bin/spearpoint-rollback` |
| Timer, runs every minute | `/etc/systemd/system/spearpoint-deploy.timer` |
| App service | `/etc/systemd/system/spearpoint-web.service` |
| Releases | `/var/www/spearpoint/releases/<sha>` |
| Live release | `/var/www/spearpoint/current` |
| Secrets | `/var/www/spearpoint/shared/.env` |

### Operations

```bash
# force a deploy instead of waiting for the timer
sudo systemctl start spearpoint-deploy.service

# what happened on recent deploys
journalctl -u spearpoint-deploy.service -n 20

# roll back to the previous release
spearpoint-rollback
```

`DISCORD_WEBHOOK_URL` lives only in `shared/.env`. Anyone holding it can post
to the studio's Discord channel, so it never goes in git, a pull request, or
CI.

Origin port 443 is firewalled to Cloudflare's published IP ranges. The
contact form's rate limiter trusts the `CF-Connecting-IP` header to identify
visitors, and that trust only holds because Cloudflare is the only thing
that can reach the origin on 443. Do not remove or narrow that firewall rule
without understanding this dependency.
