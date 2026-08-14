# website_-main
Our main website, all traffic that goes through spearpointstudio.com uses this source code.

## Stack

Plain HTML and CSS. No build step, no dependencies.

- `index.html` — the page
- `styles.css` — all styling, with a light/dark palette driven by `prefers-color-scheme`

## Running locally

Open `index.html` directly in a browser, or serve the folder if you want a real
`http://` origin:

```bash
python -m http.server 4300
# then open http://localhost:4300
```

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
