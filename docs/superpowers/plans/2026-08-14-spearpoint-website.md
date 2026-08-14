# Spearpoint Studio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single static hello world page at spearpointstudio.com with a Next.js studio site that has games and careers sections, a contact form delivering to Discord, and social links.

**Architecture:** Next.js App Router with TypeScript, hand-written CSS, and content as typed data files in the repo. The contact form posts to a server-only route handler that validates, rate limits, and forwards a Discord embed. The VPS gains a Node runtime; Caddy stops serving a directory and reverse-proxies to the app. Deploys build into per-release folders and flip a symlink only on success.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Vitest, plain CSS, Caddy, systemd, Node 24 LTS.

**Spec:** `docs/superpowers/specs/2026-08-14-spearpoint-website-design.md`

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **One typeface only:** `"Helvetica Neue", Helvetica, Arial, sans-serif`. No monospace anywhere, in any component, including code-ish or metadata text.
- **No slash separators in user-visible strings.** `Remote / Full time`, `Careers / 3 open roles`, and any `word / word` construction are forbidden. Use plain words.
- **The chevron mark appears exactly twice in the rendered site:** once in the header, once small and muted in the footer. Never as a bullet, divider, list marker, or decoration.
- **Minimal rules.** Sections separate with whitespace and at most one light line. No hairline grid dividing every cell.
- **Palette:** ground `#FFFFFF`, text `#101A22`, muted `#47596A`, secondary muted `#6A7C8B`, accent `#1F7FA8`, header line `#E6EDF2`, section line `#EEF3F6`, input border `#D3DFE7`.
- **`DISCORD_WEBHOOK_URL` is server-only.** Never prefixed `NEXT_PUBLIC_`, never imported into a client component, never included in any response body.
- **Bot rejections return HTTP 200 `{ ok: true }`.** Honeypot hits and too-fast submissions are silently discarded so the bot author learns nothing.
- **Rate limit:** 5 submissions per client IP per 10 minutes, keyed on `CF-Connecting-IP` first.
- **Node process binds `127.0.0.1:3000`**, never `0.0.0.0`.
- **No em-dashes or hyphens as prose clause separators** in user-visible copy. Hyphens are fine in compound words and numeric ranges.

---

### Task 1: Freeze production, scaffold Next.js, wire testing

Production currently serves `index.html` from a directory that a systemd timer resets to `origin/main` every minute. Deleting that file in a push would 404 the live site instantly. This task stops that timer first, so the current page keeps serving untouched until Task 11 cuts over.

**Files:**
- Modify (on the VPS, not in git): disable `spearpoint-deploy.timer`
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `.env.example`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `lib/sanity-check.test.ts`
- Delete: nothing yet. `index.html` and `styles.css` stay until Task 11.

**Interfaces:**
- Consumes: nothing
- Produces: a working `npm run dev`, `npm run build`, and `npm test`

- [ ] **Step 1: Stop the legacy deploy timer on the VPS**

```bash
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 \
  'sudo systemctl disable --now spearpoint-deploy.timer && systemctl is-enabled spearpoint-deploy.timer || true'
```

Expected: `disabled`. Confirm the site is still up afterwards:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://spearpointstudio.com/
```

Expected: `200`. Production is now frozen at the current page and safe from every push until Task 11.

- [ ] **Step 2: Scaffold the app in place**

The repo already has files, so scaffold into a temp directory and move the output in, keeping `index.html`, `styles.css`, `README.md`, `LICENSE`, `.gitignore`, and `docs/`.

```bash
cd /c/Users/adame/Repos
npx create-next-app@latest _spear_tmp \
  --typescript --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm
cp -r _spear_tmp/app _spear_tmp/public _spear_tmp/package.json _spear_tmp/tsconfig.json \
      _spear_tmp/next.config.ts _spear_tmp/next-env.d.ts _spear_tmp/eslint.config.mjs \
      website_main/
rm -rf _spear_tmp website_main/public/*.svg
```

- [ ] **Step 3: Add Vitest**

```bash
cd /c/Users/adame/Repos/website_main
npm install -D vitest @vitejs/plugin-react
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: { environment: 'node', include: ['**/*.test.ts', '**/*.test.tsx'] },
})
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a sanity test that fails**

Create `lib/sanity-check.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { siteIsConfigured } from './sanity-check'

describe('sanity-check', () => {
  it('confirms the toolchain runs', () => {
    expect(siteIsConfigured()).toBe(true)
  })
})
```

- [ ] **Step 5: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL, cannot resolve `./sanity-check`.

- [ ] **Step 6: Make it pass**

Create `lib/sanity-check.ts`:

```ts
export function siteIsConfigured(): boolean {
  return true
}
```

- [ ] **Step 7: Confirm it passes and the app builds**

```bash
npm test
npm run build
```

Expected: 1 test passing, build succeeds.

- [ ] **Step 8: Create `.env.example`**

```bash
# Destination for contact form submissions.
# Create in Discord: Server Settings, Integrations, Webhooks, New Webhook.
# Anyone holding this URL can post to the channel. Never commit the real value.
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/000000000000000000/replace-me
```

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts \
        eslint.config.mjs vitest.config.ts .env.example app lib public
git commit -m "feat: scaffold Next.js app with TypeScript and Vitest"
```

---

### Task 2: Brand assets and design tokens

**Files:**
- Create: `public/brand/mark.png`, `public/brand/cover.jpg`, `public/brand/og.jpg`
- Rewrite: `app/globals.css`
- Rewrite: `app/layout.tsx`

**Interfaces:**
- Consumes: Task 1 scaffold
- Produces: CSS custom properties `--ground --text --muted --muted-2 --accent --line --line-soft --sans`, and `<html>` carrying the single typeface

- [ ] **Step 1: Convert and commit the brand assets**

The bokeh sources are photographic. As PNG the cover is 888KB; as JPEG at quality 82 it is 30KB for the same visual result. The mark keeps alpha so it stays PNG.

```powershell
Add-Type -AssemblyName System.Drawing
$src = "C:\Users\adame\Documents\Game Resources\PR"
$dst = "C:\Users\adame\Repos\website_main\public\brand"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Scaled($in, $out, $maxW, $quality, $asJpeg) {
  $img = [System.Drawing.Image]::FromFile($in)
  $r = $maxW / $img.Width
  $bmp = New-Object System.Drawing.Bitmap([int]$maxW, [int]($img.Height * $r))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, 0, 0, $bmp.Width, $bmp.Height)
  if ($asJpeg) {
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int]$quality)
    $bmp.Save($out, $jpeg, $ep)
  } else { $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png) }
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

Save-Scaled "$src\Logo11TS.png"  "$dst\mark.png"  256  0   $false
Save-Scaled "$src\LogoCover.png" "$dst\cover.jpg" 1920 82  $true
Save-Scaled "$src\Logo11.png"    "$dst\og.jpg"    1200 82  $true
```

Verify each is under 120KB:

```bash
ls -la public/brand
```

- [ ] **Step 2: Write `app/globals.css`**

```css
:root {
  --ground: #FFFFFF;
  --text: #101A22;
  --muted: #47596A;
  --muted-2: #6A7C8B;
  --accent: #1F7FA8;
  --line: #E6EDF2;
  --line-soft: #EEF3F6;
  --field: #D3DFE7;
  --sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --measure: 60rem;
  --gutter: 2.75rem;
}

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

body {
  background: var(--ground);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

.shell { max-width: var(--measure); margin: 0 auto; padding: 0 var(--gutter); }

@media (max-width: 40rem) { :root { --gutter: 1.25rem; } }

.section { padding: 4.5rem 0; }
.section + .section { border-top: 1px solid var(--line-soft); }

.section h2 {
  margin: 0 0 0.6rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.section .lede {
  margin: 0 0 2.2rem;
  color: var(--muted);
  font-size: 0.9375rem;
  max-width: 52ch;
}

.button {
  display: inline-block;
  background: var(--text);
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 0;
  cursor: pointer;
  font-family: inherit;
}

.button:hover { background: var(--accent); }
.button:disabled { opacity: 0.55; cursor: default; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 3: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://spearpointstudio.com'),
  title: 'Spearpoint Studio',
  description: 'Spearpoint Studio designs, builds, and runs experiences on Roblox.',
  openGraph: {
    title: 'Spearpoint Studio',
    description: 'Spearpoint Studio designs, builds, and runs experiences on Roblox.',
    url: 'https://spearpointstudio.com',
    siteName: 'Spearpoint Studio',
    images: ['/brand/og.jpg'],
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: Verify the build and commit**

```bash
npm run build
git add app/globals.css app/layout.tsx public/brand
git commit -m "feat: brand assets and design tokens"
```

---

### Task 3: Content model

**Files:**
- Create: `content/site.ts`, `content/games.ts`, `content/roles.ts`
- Create: `content/roles.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `site: { name: string; tagline: string; description: string; discordUrl: string; twitterUrl: string; githubUrl: string }`
  - `type Game = { slug: string; title: string; blurb: string; image: string; url?: string }`
  - `games: Game[]`
  - `type Role = { slug: string; title: string; location: string; summary: string; description?: string[]; open: boolean }`
  - `roles: Role[]`
  - `openRoles(): Role[]`
  - `roleBySlug(slug: string): Role | undefined`

- [ ] **Step 1: Write the failing test**

Create `content/roles.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { roles, openRoles, roleBySlug } from './roles'

describe('roles', () => {
  it('hides roles marked closed', () => {
    const closed = roles.filter((r) => !r.open)
    const listed = openRoles()
    for (const role of closed) {
      expect(listed.find((r) => r.slug === role.slug)).toBeUndefined()
    }
  })

  it('finds a role by slug', () => {
    const first = roles[0]
    expect(roleBySlug(first.slug)?.title).toBe(first.title)
  })

  it('returns undefined for an unknown slug', () => {
    expect(roleBySlug('not-a-real-role')).toBeUndefined()
  })

  it('has no slash separators in any user-visible string', () => {
    for (const role of roles) {
      expect(role.location).not.toMatch(/\s\/\s/)
      expect(role.summary).not.toMatch(/\s\/\s/)
      expect(role.title).not.toMatch(/\s\/\s/)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(roles.map((r) => r.slug)).size).toBe(roles.length)
  })
})
```

The slash test enforces a global constraint mechanically rather than by memory.

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL, cannot resolve `./roles`.

- [ ] **Step 3: Write `content/roles.ts`**

```ts
export type Role = {
  slug: string
  title: string
  location: string
  summary: string
  description?: string[]
  open: boolean
}

// PLACEHOLDER CONTENT. Replace with the studio's real openings.
export const roles: Role[] = [
  {
    slug: 'gameplay-programmer',
    title: 'Gameplay Programmer',
    location: 'Remote',
    summary: 'Luau, systems design, and the tooling around them.',
    description: [
      'You will own gameplay systems end to end, from prototype to the version players actually touch.',
      'We care more about what you have shipped than where you learned it.',
    ],
    open: true,
  },
  {
    slug: '3d-environment-artist',
    title: '3D Environment Artist',
    location: 'Remote',
    summary: 'Spaces that read clearly and run fast on low-end hardware.',
    description: [
      'Roblox reaches a lot of players on modest devices. Making a space feel rich inside that budget is the craft.',
    ],
    open: true,
  },
  {
    slug: 'community-manager',
    title: 'Community Manager',
    location: 'Part time',
    summary: 'Discord, updates, and staying close to what players want.',
    open: true,
  },
]

export function openRoles(): Role[] {
  return roles.filter((role) => role.open)
}

export function roleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
```

- [ ] **Step 4: Write `content/games.ts`**

```ts
export type Game = {
  slug: string
  title: string
  blurb: string
  image: string
  url?: string
}

// PLACEHOLDER CONTENT. Replace with real titles, art, and Roblox links.
// Art belongs in public/games and should be 16:10, at most 200KB each.
export const games: Game[] = [
  { slug: 'game-one',   title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
  { slug: 'game-two',   title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
  { slug: 'game-three', title: 'Title to come', blurb: 'One line about what it is.', image: '/brand/cover.jpg' },
]
```

- [ ] **Step 5: Write `content/site.ts`**

```ts
export const site = {
  name: 'Spearpoint Studio',
  tagline: 'We build Roblox games people stay in',
  description:
    'Spearpoint Studio designs, builds, and runs experiences on Roblox. Small team, shipped work, and a community we actually talk to.',

  // PLACEHOLDER URLS. Replace with the real destinations.
  discordUrl: 'https://discord.gg/replace-me',
  twitterUrl: 'https://twitter.com/replace-me',
  githubUrl: 'https://github.com/Spearpoint-Studios',
} as const
```

- [ ] **Step 6: Run the tests and commit**

```bash
npm test
git add content
git commit -m "feat: typed content model for games, roles, and site constants"
```

---

### Task 4: Header, footer, and social links

**Files:**
- Create: `components/site-header.tsx`, `components/site-footer.tsx`, `components/social-links.tsx`
- Modify: `app/globals.css` (append the header and footer rules)

**Interfaces:**
- Consumes: `site` from `content/site.ts`
- Produces: `<SiteHeader />`, `<SiteFooter />`, `<SocialLinks />`

The chevron mark budget is spent here and nowhere else: once in `SiteHeader`, once in `SiteFooter`.

- [ ] **Step 1: Write `components/social-links.tsx`**

Official brand paths, not the simplified stand-ins from the mockup.

```tsx
import { site } from '@/content/site'

const ICONS = {
  discord:
    'M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418Z',
  twitter:
    'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
} as const

const LINKS = [
  { key: 'discord', label: 'Discord', href: site.discordUrl },
  { key: 'twitter', label: 'Twitter', href: site.twitterUrl },
  { key: 'github', label: 'GitHub', href: site.githubUrl },
] as const

export function SocialLinks() {
  return (
    <div className="social">
      {LINKS.map((link) => (
        <a
          key={link.key}
          href={link.href}
          aria-label={link.label}
          target="_blank"
          rel="noreferrer noopener"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.key]} />
          </svg>
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write `components/site-header.tsx`**

```tsx
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
```

The mark uses `alt=""` because the adjacent text already names the studio; a screen reader announcing "Spearpoint Studio Spearpoint Studio" is worse than silence.

- [ ] **Step 3: Write `components/site-footer.tsx`**

```tsx
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
```

- [ ] **Step 4: Append the styles to `app/globals.css`**

```css
/* header */
.hd { border-bottom: 1px solid var(--line); }

.hd-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.15rem;
  padding-bottom: 1.15rem;
  gap: 1rem;
}

.hd-brand { display: flex; align-items: center; gap: 0.65rem; }
.hd-brand b { font-size: 0.9375rem; font-weight: 700; letter-spacing: -0.015em; }
.hd-brand img { filter: brightness(0); }

.hd-nav { display: flex; gap: 1.75rem; font-size: 0.875rem; color: var(--muted); }
.hd-nav a:hover { color: var(--text); }

@media (max-width: 34rem) {
  .hd-in { flex-direction: column; align-items: flex-start; }
  .hd-nav { gap: 1.1rem; }
}

/* footer */
.ft { border-top: 1px solid var(--line); padding: 2rem 0; margin-top: 1rem; }

.ft-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.ft-brand { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8125rem; color: var(--muted-2); }
.ft-brand img { filter: brightness(0); opacity: 0.55; }

.social { display: flex; gap: 1.1rem; align-items: center; color: var(--muted); }
.social a { display: grid; place-items: center; }
.social svg { width: 18px; height: 18px; display: block; }
.social a:hover { color: var(--accent); }
```

- [ ] **Step 5: Build and commit**

```bash
npm run build
git add components app/globals.css
git commit -m "feat: site header, footer, and social links"
```

---

### Task 5: Home page sections

**Files:**
- Rewrite: `app/page.tsx`
- Create: `components/games-section.tsx`, `components/careers-section.tsx`
- Modify: `app/globals.css` (append hero, band, games, roles rules)

**Interfaces:**
- Consumes: `site`, `games`, `openRoles()`, `SiteHeader`, `SiteFooter`
- Produces: the home route rendering everything except the contact form, which Task 9 slots in

- [ ] **Step 1: Write `components/games-section.tsx`**

```tsx
import Image from 'next/image'
import { games } from '@/content/games'

export function GamesSection() {
  return (
    <section className="section" id="games">
      <h2>Games</h2>
      <p className="lede">Everything we have released, and what we are building next.</p>
      <div className="games">
        {games.map((game) => (
          <article className="game" key={game.slug}>
            <div className="game-art">
              <Image src={game.image} alt="" width={480} height={300} />
            </div>
            <h3>{game.title}</h3>
            <p>{game.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `components/careers-section.tsx`**

Apply links use `/?role=<slug>#contact`. The query string must precede the fragment; putting it after would bury the parameter inside the hash where `useSearchParams` cannot read it.

```tsx
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
```

- [ ] **Step 3: Write `app/page.tsx`**

```tsx
import Image from 'next/image'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { GamesSection } from '@/components/games-section'
import { CareersSection } from '@/components/careers-section'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="shell">
          <section className="hero">
            <h1>{site.tagline}</h1>
            <p>{site.description}</p>
            <a className="button" href="#games">See what we make</a>
          </section>
        </div>

        <div className="band">
          <Image src="/brand/cover.jpg" alt="" fill sizes="100vw" priority />
        </div>

        <div className="shell">
          <GamesSection />
          <CareersSection />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
```

- [ ] **Step 4: Append styles to `app/globals.css`**

```css
/* hero */
.hero { padding: 5rem 0 4rem; }

.hero h1 {
  margin: 0 0 1.4rem;
  font-size: clamp(2.1rem, 5.2vw, 3.4rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 700;
  max-width: 17ch;
  text-wrap: balance;
}

.hero p { margin: 0 0 2.2rem; font-size: 1.0625rem; color: var(--muted); max-width: 48ch; }

/* brand band */
.band { position: relative; height: 13rem; overflow: hidden; }
.band img { object-fit: cover; }

/* games */
.games { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

@media (max-width: 52rem) { .games { grid-template-columns: 1fr 1fr; } }
@media (max-width: 34rem) { .games { grid-template-columns: 1fr; } }

.game-art { position: relative; aspect-ratio: 16 / 10; overflow: hidden; margin-bottom: 0.85rem; }
.game-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
.game h3 { margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 700; }
.game p { margin: 0; font-size: 0.8125rem; color: var(--muted-2); }

/* roles */
.roles { display: grid; max-width: 44rem; }

.role {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 0;
  border-bottom: 1px solid var(--line-soft);
}

.role:first-child { border-top: 1px solid var(--line-soft); }
.role-t { flex: 1; min-width: 0; }
.role-t b { display: block; font-size: 1rem; font-weight: 700; }
.role-t a:hover b { color: var(--accent); }
.role-t span { font-size: 0.8125rem; color: var(--muted-2); }
.role-loc { font-size: 0.8125rem; color: var(--muted-2); white-space: nowrap; }
.role-go { font-size: 0.875rem; font-weight: 600; color: var(--accent); white-space: nowrap; }

@media (max-width: 34rem) {
  .role { flex-wrap: wrap; gap: 0.4rem; }
  .role-t { flex-basis: 100%; }
}
```

- [ ] **Step 5: Verify in a browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm by eye: the chevron appears exactly twice, no slash separators anywhere, no monospace text.

- [ ] **Step 6: Commit**

```bash
npm run build
git add app components
git commit -m "feat: home page with hero, games, and careers sections"
```

---

### Task 6: Contact validation

**Files:**
- Create: `lib/contact-schema.ts`, `lib/contact-schema.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type ContactInput = { name: string; email: string; subject: string; message: string; role?: string; website?: string; renderedAt: number }`
  - `type ValidationResult = { ok: true; value: ContactInput } | { ok: false; error: string } | { ok: 'discard' }`
  - `validateContact(body: unknown, now: number): ValidationResult`

`ok: 'discard'` is the third state that carries the spec's rule that bot hits return success. The route maps it to HTTP 200 with `{ ok: true }`.

- [ ] **Step 1: Write the failing test**

Create `lib/contact-schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validateContact } from './contact-schema'

const NOW = 1_000_000
const base = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This is a long enough message.',
  renderedAt: NOW - 10_000,
}

describe('validateContact', () => {
  it('accepts a well formed submission', () => {
    const result = validateContact(base, NOW)
    expect(result.ok).toBe(true)
  })

  it('rejects a non-object body', () => {
    expect(validateContact('nope', NOW)).toEqual({ ok: false, error: 'Invalid request body.' })
  })

  it('rejects a missing name', () => {
    const result = validateContact({ ...base, name: '' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter your name.' })
  })

  it('rejects a name over 80 characters', () => {
    const result = validateContact({ ...base, name: 'a'.repeat(81) }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter your name.' })
  })

  it('rejects an email with no dot after the at sign', () => {
    const result = validateContact({ ...base, email: 'ada@example' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please enter a valid email address.' })
  })

  it('rejects a message under 10 characters', () => {
    const result = validateContact({ ...base, message: 'short' }, NOW)
    expect(result).toEqual({ ok: false, error: 'Please write a little more in your message.' })
  })

  it('discards a submission with the honeypot filled', () => {
    const result = validateContact({ ...base, website: 'http://spam.example' }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('discards a submission faster than three seconds', () => {
    const result = validateContact({ ...base, renderedAt: NOW - 500 }, NOW)
    expect(result).toEqual({ ok: 'discard' })
  })

  it('trims surrounding whitespace on accepted values', () => {
    const result = validateContact({ ...base, name: '  Ada  ' }, NOW)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.name).toBe('Ada')
  })

  it('passes the role slug through when present', () => {
    const result = validateContact({ ...base, role: 'gameplay-programmer' }, NOW)
    if (result.ok !== true) throw new Error('expected success')
    expect(result.value.role).toBe('gameplay-programmer')
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run lib/contact-schema.test.ts`
Expected: FAIL, cannot resolve `./contact-schema`.

- [ ] **Step 3: Write `lib/contact-schema.ts`**

```ts
export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  role?: string
  website?: string
  renderedAt: number
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; error: string }
  | { ok: 'discard' }

const MIN_FILL_MS = 3000

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function inRange(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}

function looksLikeEmail(value: string): boolean {
  const at = value.indexOf('@')
  if (at < 1) return false
  const domain = value.slice(at + 1)
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
}

export function validateContact(body: unknown, now: number): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid request body.' }
  }

  const raw = body as Record<string, unknown>

  // Honeypot. Real people never see this field, so anything in it is a bot.
  if (str(raw.website).length > 0) return { ok: 'discard' }

  const renderedAt = typeof raw.renderedAt === 'number' ? raw.renderedAt : 0
  if (now - renderedAt < MIN_FILL_MS) return { ok: 'discard' }

  const name = str(raw.name)
  if (!inRange(name, 1, 80)) return { ok: false, error: 'Please enter your name.' }

  const email = str(raw.email)
  if (!inRange(email, 3, 160) || !looksLikeEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const subject = str(raw.subject)
  if (!inRange(subject, 1, 120)) return { ok: false, error: 'Please add a subject.' }

  const message = str(raw.message)
  if (!inRange(message, 10, 4000)) {
    return { ok: false, error: 'Please write a little more in your message.' }
  }

  const role = str(raw.role)

  return {
    ok: true,
    value: { name, email, subject, message, renderedAt, ...(role ? { role } : {}) },
  }
}
```

- [ ] **Step 4: Run the tests and commit**

```bash
npx vitest run lib/contact-schema.test.ts
git add lib/contact-schema.ts lib/contact-schema.test.ts
git commit -m "feat: contact form validation with honeypot and timing checks"
```

---

### Task 7: Rate limiting and client IP resolution

This is the piece the spec flags as most likely to be got wrong. Behind Cloudflare every request arrives from an edge IP, so a limiter keyed on the socket address throttles every visitor as one person.

**Files:**
- Create: `lib/rate-limit.ts`, `lib/rate-limit.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `clientIp(headers: Headers): string`
  - `rateLimit(key: string, now: number): { allowed: boolean }`
  - `resetRateLimit(): void` (test helper)

- [ ] **Step 1: Write the failing test**

Create `lib/rate-limit.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { clientIp, rateLimit, resetRateLimit } from './rate-limit'

describe('clientIp', () => {
  it('prefers CF-Connecting-IP', () => {
    const h = new Headers({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '198.51.100.1, 172.16.0.1',
    })
    expect(clientIp(h)).toBe('203.0.113.7')
  })

  it('falls back to the first X-Forwarded-For entry', () => {
    const h = new Headers({ 'x-forwarded-for': '198.51.100.1, 172.16.0.1' })
    expect(clientIp(h)).toBe('198.51.100.1')
  })

  it('returns a stable placeholder when no header is present', () => {
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

describe('rateLimit', () => {
  beforeEach(() => resetRateLimit())

  it('allows the first five submissions', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('1.1.1.1', 1000).allowed).toBe(true)
    }
  })

  it('blocks the sixth submission inside the window', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('1.1.1.1', 1000).allowed).toBe(false)
  })

  it('allows again once the window has passed', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('1.1.1.1', 1000 + 10 * 60 * 1000 + 1).allowed).toBe(true)
  })

  it('tracks each address separately', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.1.1.1', 1000)
    expect(rateLimit('2.2.2.2', 1000).allowed).toBe(true)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run lib/rate-limit.test.ts`
Expected: FAIL, cannot resolve `./rate-limit`.

- [ ] **Step 3: Write `lib/rate-limit.ts`**

```ts
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/**
 * Resolve the real visitor address.
 *
 * The site sits behind Cloudflare, so the socket address is always a
 * Cloudflare edge server. Keying a limiter on it would throttle every
 * visitor as though they were one person.
 */
export function clientIp(headers: Headers): string {
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf.trim()

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  return 'unknown'
}

export function rateLimit(key: string, now: number): { allowed: boolean } {
  const cutoff = now - WINDOW_MS
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return { allowed: false }
  }

  recent.push(now)
  hits.set(key, recent)
  return { allowed: true }
}

export function resetRateLimit(): void {
  hits.clear()
}
```

- [ ] **Step 4: Run the tests and commit**

```bash
npx vitest run lib/rate-limit.test.ts
git add lib/rate-limit.ts lib/rate-limit.test.ts
git commit -m "feat: rate limiting keyed on the Cloudflare client IP"
```

---

### Task 8: Discord delivery and the contact route

**Files:**
- Create: `lib/discord.ts`, `lib/discord.test.ts`
- Create: `app/api/contact/route.ts`, `app/api/contact/route.test.ts`

**Interfaces:**
- Consumes: `validateContact`, `clientIp`, `rateLimit`, `ContactInput`
- Produces:
  - `buildEmbed(input: ContactInput): Record<string, unknown>`
  - `sendToDiscord(input: ContactInput, webhookUrl: string, fetchImpl?: typeof fetch): Promise<boolean>`
  - `POST(request: Request): Promise<Response>`

- [ ] **Step 1: Write the failing Discord test**

Create `lib/discord.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { buildEmbed, sendToDiscord } from './discord'
import type { ContactInput } from './contact-schema'

const input: ContactInput = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Partnership',
  message: 'We should talk.',
  renderedAt: 0,
}

describe('buildEmbed', () => {
  it('uses the subject as the title and the message as the description', () => {
    const embed = buildEmbed(input)
    expect(embed.title).toBe('Partnership')
    expect(embed.description).toBe('We should talk.')
  })

  it('includes name and email as fields', () => {
    const fields = buildEmbed(input).fields as Array<{ name: string; value: string }>
    expect(fields.find((f) => f.name === 'Name')?.value).toBe('Ada')
    expect(fields.find((f) => f.name === 'Email')?.value).toBe('ada@example.com')
  })

  it('omits the role field when no role was sent', () => {
    const fields = buildEmbed(input).fields as Array<{ name: string }>
    expect(fields.find((f) => f.name === 'Role')).toBeUndefined()
  })

  it('includes the role field when a role was sent', () => {
    const fields = buildEmbed({ ...input, role: 'gameplay-programmer' })
      .fields as Array<{ name: string; value: string }>
    expect(fields.find((f) => f.name === 'Role')?.value).toBe('gameplay-programmer')
  })

  it('truncates a description longer than the Discord limit', () => {
    const embed = buildEmbed({ ...input, message: 'x'.repeat(5000) })
    expect((embed.description as string).length).toBeLessThanOrEqual(4096)
  })
})

describe('sendToDiscord', () => {
  it('posts JSON to the webhook and reports success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    const ok = await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)
    expect(ok).toBe(true)
    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://discord.test/hook')
    expect((init as RequestInit).method).toBe('POST')
  })

  it('reports failure on a non-2xx response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('nope', { status: 500 }))
    expect(await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)).toBe(false)
  })

  it('reports failure when the request throws', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'))
    expect(await sendToDiscord(input, 'https://discord.test/hook', fetchImpl as never)).toBe(false)
  })
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run lib/discord.test.ts`
Expected: FAIL, cannot resolve `./discord`.

- [ ] **Step 3: Write `lib/discord.ts`**

```ts
import type { ContactInput } from './contact-schema'

const DESCRIPTION_LIMIT = 4096
const ACCENT = 0x1f7fa8

export function buildEmbed(input: ContactInput): Record<string, unknown> {
  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: 'Name', value: input.name, inline: true },
    { name: 'Email', value: input.email, inline: true },
  ]

  if (input.role) fields.push({ name: 'Role', value: input.role, inline: true })

  return {
    title: input.subject,
    description: input.message.slice(0, DESCRIPTION_LIMIT),
    color: ACCENT,
    fields,
    timestamp: new Date().toISOString(),
  }
}

export async function sendToDiscord(
  input: ContactInput,
  webhookUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ embeds: [buildEmbed(input)] }),
    })
    return response.ok
  } catch (error) {
    console.error('[contact] Discord delivery failed', error)
    return false
  }
}
```

- [ ] **Step 4: Write the failing route test**

Create `app/api/contact/route.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resetRateLimit } from '@/lib/rate-limit'

const sendToDiscord = vi.fn()
vi.mock('@/lib/discord', () => ({
  sendToDiscord: (...args: unknown[]) => sendToDiscord(...args),
  buildEmbed: () => ({}),
}))

const { POST } = await import('./route')

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://spearpointstudio.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9', ...headers },
    body: JSON.stringify(body),
  })
}

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This is a long enough message.',
  renderedAt: 0,
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    resetRateLimit()
    sendToDiscord.mockReset().mockResolvedValue(true)
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.test/hook'
  })

  it('accepts a valid submission and forwards it', async () => {
    const response = await POST(post(valid))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendToDiscord).toHaveBeenCalledOnce()
  })

  it('rejects an invalid submission with the reason', async () => {
    const response = await POST(post({ ...valid, email: 'nope' }))
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('Please enter a valid email address.')
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('reports success for a honeypot hit but sends nothing', async () => {
    const response = await POST(post({ ...valid, website: 'spam' }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('rate limits after five submissions from one address', async () => {
    for (let i = 0; i < 5; i++) await POST(post(valid))
    const response = await POST(post(valid))
    expect(response.status).toBe(429)
  })

  it('does not rate limit a different address', async () => {
    for (let i = 0; i < 5; i++) await POST(post(valid))
    const response = await POST(post(valid, { 'cf-connecting-ip': '203.0.113.10' }))
    expect(response.status).toBe(200)
  })

  it('returns 502 without leaking detail when Discord fails', async () => {
    sendToDiscord.mockResolvedValue(false)
    const response = await POST(post(valid))
    expect(response.status).toBe(502)
    const body = await response.json()
    expect(body.error).toBe('We could not deliver your message. Please try again shortly.')
    expect(JSON.stringify(body)).not.toContain('discord.test')
  })

  it('returns 500 when the webhook is not configured', async () => {
    delete process.env.DISCORD_WEBHOOK_URL
    const response = await POST(post(valid))
    expect(response.status).toBe(500)
    expect(JSON.stringify(await response.json())).not.toContain('DISCORD_WEBHOOK_URL')
  })
})
```

- [ ] **Step 5: Run it and confirm it fails**

Run: `npx vitest run app/api/contact/route.test.ts`
Expected: FAIL, cannot resolve `./route`.

- [ ] **Step 6: Write `app/api/contact/route.ts`**

```ts
import { validateContact } from '@/lib/contact-schema'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { sendToDiscord } from '@/lib/discord'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400)
  }

  const now = Date.now()
  const result = validateContact(body, now)

  // Bots are told nothing. Reporting the block teaches whoever wrote it
  // exactly which check to defeat next.
  if (result.ok === 'discard') return json({ ok: true }, 200)
  if (result.ok === false) return json({ ok: false, error: result.error }, 400)

  if (!rateLimit(clientIp(request.headers), now).allowed) {
    return json(
      { ok: false, error: 'That is a lot of messages. Please try again in a few minutes.' },
      429,
    )
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('[contact] DISCORD_WEBHOOK_URL is not set')
    return json({ ok: false, error: 'The contact form is not available right now.' }, 500)
  }

  const delivered = await sendToDiscord(result.value, webhookUrl)
  if (!delivered) {
    return json(
      { ok: false, error: 'We could not deliver your message. Please try again shortly.' },
      502,
    )
  }

  return json({ ok: true }, 200)
}
```

- [ ] **Step 7: Run the whole suite and commit**

```bash
npm test
git add lib/discord.ts lib/discord.test.ts app/api
git commit -m "feat: contact API route forwarding to Discord"
```

---

### Task 9: Contact form component

**Files:**
- Create: `components/contact-form.tsx`
- Modify: `app/page.tsx` (add the contact section)
- Modify: `app/globals.css` (append form rules)

**Interfaces:**
- Consumes: `POST /api/contact`, `roleBySlug`
- Produces: `<ContactSection />`

- [ ] **Step 1: Write `components/contact-form.tsx`**

Two details matter here. The form must keep every field populated after a failure, because losing a long message to a network blip is the worst outcome available. And `useSearchParams` requires a Suspense boundary in the App Router, so the component is wrapped.

```tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { site } from '@/content/site'
import { roleBySlug } from '@/content/roles'

type Status = 'idle' | 'sending' | 'sent'

function ContactFormInner() {
  const params = useSearchParams()
  const roleSlug = params.get('role') ?? ''
  const role = roleSlug ? roleBySlug(roleSlug) : undefined

  const [renderedAt, setRenderedAt] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => setRenderedAt(Date.now()), [])
  useEffect(() => {
    if (role) setSubject(`Application: ${role.title}`)
  }, [role])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name, email, subject, message, website, renderedAt,
          ...(roleSlug ? { role: roleSlug } : {}),
        }),
      })
      const body = await response.json()

      if (!response.ok || !body.ok) {
        setError(body.error ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
      setStatus('sent')
    } catch {
      setError('We could not reach the server. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="sent">
        <h3>Message sent</h3>
        <p>Thanks for getting in touch. We read everything and will reply by email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="pair">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-subject">Subject</label>
        <input id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <button className="button" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}

export function ContactSection() {
  return (
    <section className="section" id="contact">
      <h2>Contact</h2>
      <p className="lede">Questions, partnerships, or press. We read everything.</p>
      <div className="contact-grid">
        <Suspense fallback={<p className="lede">Loading the form.</p>}>
          <ContactFormInner />
        </Suspense>
        <aside className="contact-aside">
          <h3>Prefer Discord?</h3>
          <p>
            Most of our conversations happen there. Jump in and say hello, or send this form
            and it reaches the same place.
          </p>
          <a className="button" href={site.discordUrl} target="_blank" rel="noreferrer noopener">
            Join the Discord
          </a>
        </aside>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the form styles to `app/globals.css`**

```css
.contact-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }

@media (min-width: 50rem) { .contact-grid { grid-template-columns: 1.4fr 1fr; } }

.field { display: grid; gap: 0.35rem; margin-bottom: 0.9rem; }
.field label { font-size: 0.8125rem; font-weight: 600; color: var(--muted); }

.field input, .field textarea {
  font: inherit;
  font-size: 0.875rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--field);
  background: #fff;
  color: var(--text);
  width: 100%;
}

.field textarea { resize: vertical; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }

@media (max-width: 34rem) { .pair { grid-template-columns: 1fr; gap: 0; } }

.honeypot {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.form-error {
  margin: 0 0 1rem;
  padding: 0.7rem 0.9rem;
  border-left: 3px solid #B4322A;
  background: #FCF3F2;
  color: #8A2822;
  font-size: 0.875rem;
}

.sent h3 { margin: 0 0 0.4rem; font-size: 1.125rem; font-weight: 700; }
.sent p { margin: 0; color: var(--muted); font-size: 0.9375rem; }

.contact-aside h3 { margin: 0 0 0.5rem; font-size: 0.9375rem; font-weight: 700; }
.contact-aside p { margin: 0 0 1.4rem; font-size: 0.875rem; color: var(--muted-2); }
```

Note the honeypot is hidden with clip-path rather than `display: none`. Many bots skip fields that are outright hidden, and this keeps it in the accessibility tree's dead zone without tipping them off.

- [ ] **Step 3: Add the section to `app/page.tsx`**

Import `ContactSection` and render it directly after `<CareersSection />`:

```tsx
import { ContactSection } from '@/components/contact-form'
```

```tsx
          <CareersSection />
          <ContactSection />
```

- [ ] **Step 4: Verify locally**

```bash
echo 'DISCORD_WEBHOOK_URL=https://discord.test/hook' > .env.local
npm run dev
```

Open `http://localhost:3000/?role=gameplay-programmer#contact` and confirm the subject prefills to `Application: Gameplay Programmer`. Submit with a bad email and confirm the error appears and the typed message survives.

- [ ] **Step 5: Commit**

```bash
npm run build
git add components/contact-form.tsx app/page.tsx app/globals.css
git commit -m "feat: contact form with role prefill and input preservation"
```

---

### Task 10: Careers detail route

**Files:**
- Create: `app/careers/[slug]/page.tsx`
- Modify: `app/globals.css` (append detail rules)

**Interfaces:**
- Consumes: `roles`, `roleBySlug`, `SiteHeader`, `SiteFooter`
- Produces: static pages at `/careers/<slug>` for every role

- [ ] **Step 1: Write `app/careers/[slug]/page.tsx`**

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { roles, roleBySlug } from '@/content/roles'
import { site } from '@/content/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }))
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
```

A closed role returns 404 rather than rendering, so a stale link cannot advertise a position that is filled.

- [ ] **Step 2: Append styles to `app/globals.css`**

```css
.role-page { padding: 3.5rem 0 4.5rem; max-width: 46rem; }
.role-page .back { font-size: 0.875rem; color: var(--accent); font-weight: 600; }

.role-page h1 {
  margin: 1.2rem 0 0.4rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.role-page-loc { margin: 0 0 1.4rem; font-size: 0.875rem; color: var(--muted-2); }
.role-page-summary { margin: 0 0 1.6rem; font-size: 1.0625rem; color: var(--muted); }
.role-page p { font-size: 0.9375rem; color: var(--muted); }
.role-page .button { margin-top: 1.4rem; }
```

- [ ] **Step 3: Verify and commit**

```bash
npm run build
```

Expected: the build output lists `/careers/gameplay-programmer`, `/careers/3d-environment-artist`, and `/careers/community-manager` as prerendered.

```bash
git add app/careers app/globals.css
git commit -m "feat: careers detail pages"
```

---

### Task 11: Server runtime and Caddy cutover

This is the task that changes production. Everything before it was invisible to visitors.

**Files:**
- Create: `deploy/spearpoint-web.service`, `deploy/Caddyfile`
- Delete: `index.html`, `styles.css`

**Interfaces:**
- Consumes: a repo that builds
- Produces: a running Node service on `127.0.0.1:3000` behind Caddy

- [ ] **Step 1: Remove the old static site from the repo**

```bash
git rm index.html styles.css
git commit -m "chore: remove the static placeholder site"
```

- [ ] **Step 2: Write `deploy/spearpoint-web.service`**

```ini
[Unit]
Description=Spearpoint Studio website
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/spearpoint/current
EnvironmentFile=/var/www/spearpoint/shared/.env
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=3

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
```

`HOSTNAME=127.0.0.1` keeps Node off the public interface. The firewall would block it anyway, but defence in depth costs nothing here.

- [ ] **Step 3: Write `deploy/Caddyfile`**

```
# Spearpoint Studio website
#
# Caddy no longer serves a directory. It reverse proxies to the Next.js
# process on loopback, which permanently removes the class of problem where
# repo metadata under the web root becomes fetchable.

spearpointstudio.com, www.spearpointstudio.com {
	encode zstd gzip

	header {
		X-Content-Type-Options nosniff
		X-Frame-Options SAMEORIGIN
		Referrer-Policy strict-origin-when-cross-origin
	}

	reverse_proxy 127.0.0.1:3000
}
```

- [ ] **Step 4: Install Node 24 on the VPS**

```bash
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
EOF
```

Expected: `v24.x.x`.

- [ ] **Step 5: Create the release layout and the environment file**

```bash
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
sudo mkdir -p /var/www/spearpoint/{releases,shared}
sudo chown -R ubuntu:ubuntu /var/www/spearpoint
if [ ! -d /var/www/spearpoint/repo/.git ]; then
  rm -rf /var/www/spearpoint/repo
  git clone --quiet https://github.com/Spearpoint-Studios/website_main.git /var/www/spearpoint/repo
fi
touch /var/www/spearpoint/shared/.env
chmod 600 /var/www/spearpoint/shared/.env
ls -la /var/www/spearpoint
EOF
```

- [ ] **Step 6: Have the owner write the webhook URL**

This step is the site owner's, not the implementer's. The webhook is a capability: anyone holding it can post to the channel. It is never pasted into chat, a PR, or CI.

Give them this to run themselves:

```bash
ssh ubuntu@149.56.99.128
printf 'DISCORD_WEBHOOK_URL=%s\n' 'PASTE_THE_URL_HERE' > /var/www/spearpoint/shared/.env
chmod 600 /var/www/spearpoint/shared/.env
```

Verify it is set without printing it:

```bash
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 \
  'grep -c "^DISCORD_WEBHOOK_URL=https://discord" /var/www/spearpoint/shared/.env'
```

Expected: `1`.

- [ ] **Step 7: Build the first release by hand**

```bash
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
cd /var/www/spearpoint/repo
git fetch --quiet origin main
SHA=$(git rev-parse --short origin/main)
REL=/var/www/spearpoint/releases/$SHA
rm -rf "$REL" && mkdir -p "$REL"
git archive origin/main | tar -x -C "$REL"
ln -sfn /var/www/spearpoint/shared/.env "$REL/.env.production.local"
cd "$REL"
npm ci
npm run build
ln -sfn "$REL" /var/www/spearpoint/current
echo "release $SHA built"
EOF
```

- [ ] **Step 8: Install and start the service**

```bash
scp -i ~/.ssh/id_ed25519_spearpoint deploy/spearpoint-web.service ubuntu@149.56.99.128:/tmp/
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
sudo mv /tmp/spearpoint-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now spearpoint-web
sleep 4
systemctl is-active spearpoint-web
curl -sS -o /dev/null -w "local app: %{http_code}\n" http://127.0.0.1:3000/
EOF
```

Expected: `active`, and `local app: 200`. **Do not proceed until both are true.** The site is still serving the old page at this point, so a failure here costs nothing.

- [ ] **Step 9: Cut Caddy over**

```bash
scp -i ~/.ssh/id_ed25519_spearpoint deploy/Caddyfile ubuntu@149.56.99.128:/tmp/
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.static.bak
sudo mv /tmp/Caddyfile /etc/caddy/Caddyfile
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile | tail -1
sudo systemctl reload caddy
sleep 3
systemctl is-active caddy
EOF
```

- [ ] **Step 10: Verify production end to end**

```bash
curl -sS -o /dev/null -w "apex     %{http_code}\n" "https://spearpointstudio.com/?cb=$RANDOM"
curl -sS -o /dev/null -w "www      %{http_code}\n" "https://www.spearpointstudio.com/?cb=$RANDOM"
curl -sS -o /dev/null -w "careers  %{http_code}\n" "https://spearpointstudio.com/careers/gameplay-programmer?cb=$RANDOM"
curl -sS -o /dev/null -w "http     %{http_code}\n" "http://spearpointstudio.com/"
```

Expected: 200, 200, 200, 308.

Rollback if anything is wrong:

```bash
sudo cp /etc/caddy/Caddyfile.static.bak /etc/caddy/Caddyfile && sudo systemctl reload caddy
```

- [ ] **Step 11: Commit**

```bash
git add deploy
git commit -m "feat: systemd unit and Caddy reverse proxy for the Next.js app"
```

---

### Task 12: Release-based deploy pipeline

**Files:**
- Create: `deploy/spearpoint-deploy.sh`, `deploy/spearpoint-rollback.sh`
- Modify: `README.md`

**Interfaces:**
- Consumes: the release layout from Task 11
- Produces: an automatic deploy that cannot take the site down

- [ ] **Step 1: Write `deploy/spearpoint-deploy.sh`**

```bash
#!/usr/bin/env bash
# Build a new release and switch to it only if the build succeeds.
# A failing build leaves the running site completely untouched.
set -euo pipefail

ROOT=/var/www/spearpoint
REPO="$ROOT/repo"
RELEASES="$ROOT/releases"
KEEP=3

cd "$REPO"
git fetch --quiet origin main
SHA=$(git rev-parse --short origin/main)
TARGET="$RELEASES/$SHA"

if [ "$(readlink -f "$ROOT/current" || true)" = "$(readlink -f "$TARGET" || true)" ]; then
  echo "up to date at $SHA"
  exit 0
fi

echo "building $SHA"
rm -rf "$TARGET"
mkdir -p "$TARGET"
git archive origin/main | tar -x -C "$TARGET"
ln -sfn "$ROOT/shared/.env" "$TARGET/.env.production.local"

cd "$TARGET"
if ! npm ci --no-audit --no-fund; then
  echo "npm ci failed, discarding $SHA" >&2
  rm -rf "$TARGET"
  exit 1
fi

if ! npm run build; then
  echo "build failed, discarding $SHA" >&2
  rm -rf "$TARGET"
  exit 1
fi

ln -sfn "$TARGET" "$ROOT/current"
sudo /usr/bin/systemctl restart spearpoint-web
echo "deployed $SHA"

# Keep the newest KEEP releases so a rollback target always exists.
cd "$RELEASES"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf
```

The two `if ! ...; then rm -rf; exit 1; fi` blocks are the entire safety property. The symlink line is unreachable unless both succeeded.

- [ ] **Step 2: Write `deploy/spearpoint-rollback.sh`**

```bash
#!/usr/bin/env bash
# Switch back to the previous release. For use under pressure, so it takes
# no arguments and explains itself.
set -euo pipefail

ROOT=/var/www/spearpoint
CURRENT=$(readlink -f "$ROOT/current")
PREVIOUS=$(ls -1dt "$ROOT"/releases/*/ | grep -v "^$CURRENT/$" | head -1 || true)

if [ -z "$PREVIOUS" ]; then
  echo "no previous release to roll back to" >&2
  exit 1
fi

echo "rolling back from $(basename "$CURRENT") to $(basename "$PREVIOUS")"
ln -sfn "${PREVIOUS%/}" "$ROOT/current"
sudo /usr/bin/systemctl restart spearpoint-web
echo "done"
```

- [ ] **Step 3: Install the scripts and replace the old deploy unit**

```bash
scp -i ~/.ssh/id_ed25519_spearpoint deploy/spearpoint-deploy.sh deploy/spearpoint-rollback.sh \
  ubuntu@149.56.99.128:/tmp/
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 'bash -s' <<'EOF'
set -e
sudo mv /tmp/spearpoint-deploy.sh /usr/local/bin/spearpoint-deploy
sudo mv /tmp/spearpoint-rollback.sh /usr/local/bin/spearpoint-rollback
sudo chmod 755 /usr/local/bin/spearpoint-deploy /usr/local/bin/spearpoint-rollback

# The deploy runs as ubuntu but must restart a system service.
echo 'ubuntu ALL=(root) NOPASSWD: /usr/bin/systemctl restart spearpoint-web' \
  | sudo tee /etc/sudoers.d/spearpoint-deploy >/dev/null
sudo chmod 440 /etc/sudoers.d/spearpoint-deploy
sudo visudo -c

sudo systemctl daemon-reload
sudo systemctl enable --now spearpoint-deploy.timer
systemctl list-timers spearpoint-deploy.timer --no-pager --no-legend
EOF
```

The sudoers line grants exactly one command, not general root. `visudo -c` validates the file before it can lock anyone out.

- [ ] **Step 4: Prove the safety property with a deliberately broken commit**

This is the test that matters. Anyone can write a deploy script that works; the claim being verified is that a broken one cannot take the site down.

```bash
git checkout -b deploy-safety-check
printf '\nthis is not valid typescript at all;;;\n' >> content/site.ts
git add content/site.ts
git commit -m "test: deliberately broken commit to verify deploy safety"
git push origin deploy-safety-check:main
```

Wait 90 seconds, then:

```bash
curl -sS -o /dev/null -w "site during broken deploy: %{http_code}\n" "https://spearpointstudio.com/?cb=$RANDOM"
ssh -i ~/.ssh/id_ed25519_spearpoint ubuntu@149.56.99.128 \
  'journalctl -u spearpoint-deploy.service -n 5 --no-pager --output=cat; readlink /var/www/spearpoint/current'
```

Expected: the site still returns **200**, the journal shows `build failed, discarding`, and `current` still points at the previous SHA.

Then revert:

```bash
git checkout main
git revert --no-edit HEAD
git push origin main
```

Confirm recovery after 90 seconds:

```bash
curl -sS -o /dev/null -w "after revert: %{http_code}\n" "https://spearpointstudio.com/?cb=$RANDOM"
```

- [ ] **Step 5: Update the README**

Replace the Deployment section written for the static site. It currently describes a web root that is a git clone and a `hide` directive protecting `.git`, neither of which is true any more.

```markdown
## Deployment

Production is an OVH VPS at `149.56.99.128` running the Next.js app under
systemd, behind Caddy, behind Cloudflare on Full (Strict).

Push to `main` and it is live within about a minute plus build time. A build
that fails is discarded and the running site is untouched.

| Piece | Path |
|---|---|
| Deploy script | `/usr/local/bin/spearpoint-deploy` |
| Rollback | `/usr/local/bin/spearpoint-rollback` |
| Timer, every minute | `/etc/systemd/system/spearpoint-deploy.timer` |
| App service | `/etc/systemd/system/spearpoint-web.service` |
| Releases | `/var/www/spearpoint/releases/<sha>` |
| Live release | `/var/www/spearpoint/current` |
| Secrets | `/var/www/spearpoint/shared/.env` |

```bash
sudo systemctl start spearpoint-deploy.service   # deploy now
journalctl -u spearpoint-deploy.service -n 20    # what happened
spearpoint-rollback                              # previous release
```

`DISCORD_WEBHOOK_URL` lives only in `shared/.env`. Anyone holding it can post
to the Discord channel, so it never goes in git, a PR, or CI.
```

- [ ] **Step 6: Commit**

```bash
git add deploy README.md
git commit -m "feat: release-based deploy with rollback"
git push origin main
```

---

## Self-review

**Spec coverage.** Every section of the spec maps to a task: design direction to Global Constraints plus Tasks 2, 4, 5; brand assets to Task 2; information architecture to Tasks 5 and 10; content model to Task 3; contact form flow, validation, rate limiting, Discord format, and client behaviour to Tasks 6, 7, 8, 9; careers to Tasks 5 and 10; social links to Task 4; infrastructure to Task 11; deploy pipeline to Task 12; environment to Tasks 1, 11, 12; testing to Tasks 6, 7, 8 and the manual checks in 9 and 11.

**Two gaps found and closed while reviewing.** The spec's manual test list includes rendering at 375px wide; responsive rules are now in Tasks 4, 5, and 9 rather than left implicit. And the spec's risk table claims a failing build cannot take the site down without saying how that is proven, so Task 12 Step 4 pushes a deliberately broken commit and asserts the site still returns 200.

**Type consistency.** `ContactInput` is defined in Task 6 and consumed unchanged in Tasks 8 and 9. `Role` and `Game` are defined in Task 3 and consumed in Tasks 5 and 10. `validateContact` returns the same three-state union everywhere it appears. `clientIp` and `rateLimit` signatures match between Task 7 and Task 8. `sendToDiscord` takes the same injectable `fetchImpl` in its definition and its tests.

**Known deviation from the spec.** The spec's deploy algorithm says "export the tree" without naming a method; the plan uses `git archive origin/main | tar -x`, which produces a clean tree with no `.git` directory inside the release. That is stricter than the spec and worth keeping.
