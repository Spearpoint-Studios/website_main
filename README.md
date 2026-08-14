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

Production is an OVH VPS at `149.56.99.128` running Caddy, fronted by Cloudflare
with the encryption mode set to Full (Strict). Caddy holds its own Let's Encrypt
certificate, so traffic is encrypted browser to edge and edge to origin.

**Deploys are automatic.** Push to `main` and the change is live within about a
minute. There is no build and no CI step.

The VPS pulls rather than GitHub pushing, so no deploy credentials exist
anywhere:

| Piece | Path |
|---|---|
| Web root, a clone of this repo | `/var/www/spearpoint` |
| Deploy script | `/usr/local/bin/spearpoint-deploy` |
| Timer, runs every minute | `/etc/systemd/system/spearpoint-deploy.timer` |
| Caddy config | `/etc/caddy/Caddyfile` |

The deploy script fetches `origin/main` and hard-resets the working tree to it.
Anything committed locally on the server is discarded on the next tick, so never
edit files in `/var/www/spearpoint` directly.

### Operations

```bash
# force a deploy instead of waiting for the timer
sudo systemctl start spearpoint-deploy.service

# what happened on recent deploys
journalctl -u spearpoint-deploy.service -n 20

# is the timer alive, when does it next fire
systemctl list-timers spearpoint-deploy.timer
```

Because the web root is a git clone, the `.git` directory sits inside the
directory Caddy serves. The `hide` directive in the Caddyfile's `file_server`
block is what keeps `/.git/config` from being world readable. Do not remove it.
