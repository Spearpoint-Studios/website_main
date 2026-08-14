# website_-main
Our main website, all traffic that goes through spearpointstudios.com uses this source code.

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
