# RemoteBase Employee Hub

A fast internal launcher for RemoteBase HR and ops documents: policies,
medical insurance, time off, performance, people and contacts, and
IT/equipment - plus live search and an FAQ.

This is a static site: plain HTML, CSS, and JavaScript, no build step,
no server, no database. Content lives in one file so the People Team can
update it without touching code.

## Repository structure

```
index.html              markup only
styles/main.css         all styling
scripts/main.js         rendering + search + FAQ behaviour
data/data.js             all editable content (links, contacts, FAQ, chips)
assets/logo.png          header logo
assets/favicon.png       browser tab icon
config/allowed-domains.json   documents which email domains may access the hub
render.yaml              Render deploy config + security headers
```

## Local development

No build step and no dependencies. Any static file server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works for a quick look,
though a local server is closer to how it behaves once deployed.

## Editing content and links

Everything editable - the 6 resource categories and their document links,
the 5 contact cards, the FAQ, the search chips, and the footer email
addresses - lives in **`data/data.js`**, in a single `HUB_DATA` object.
Nothing else needs to change to add, remove, or re-word an entry.

- **Resource links**: each category has a `links` array of
  `{ label, href }`. Add or remove entries freely.
- **Contacts**: a contact with `href: "#"` renders as a plain,
  non-clickable label (the current state for all 5 contacts - no real
  destination has been supplied yet). Set a real `href` (a `mailto:`
  address or a Slack link) to turn it into a clickable button.
- **Search chips**: each is `{ label, query }` - `label` is the button
  text, `query` is what actually gets typed into search when it's
  clicked. `query` must be a word or phrase that really appears in a
  link label, category title, or blurb (search is a literal substring
  match), or the chip will always show "Nothing matches that yet".
  Check a new query actually hits something before adding it.
- **FAQ**: a plain array of `{ q, a }` pairs.
- The page rebuilds itself from this file on every load - no other file
  needs to change.

## Editing the logo or favicon

Replace `assets/logo.png` and/or `assets/favicon.png` with new files of
the same name. An SVG logo is preferred if you have one - swap the file
extension and update the two `<img>`/`<link>` references in `index.html`
accordingly.

## Access control

The hub must only be reachable by people with an email on one of these
domains: `remotebase.com`, `snapdev.ai`, `ember.new` (documented in
`config/allowed-domains.json`, which is a reference, not an enforcement
mechanism).

This is done with **Cloudflare Access** in front of a Render static
site, at no cost, since total users are expected to be 50 or fewer
(Cloudflare Access's free-tier cap). There is no auth code in this repo
to write or maintain - enforcement happens at Cloudflare's edge, before
the page ever loads.

### One-time setup

1. **Deploy this repo to Render as a static site** (see Deployment
   below) and note the `*.onrender.com` URL it gets.
2. **Add your domain to Cloudflare** (if not already there): create a
   free Cloudflare account, add the domain (e.g. `remotebase.com`), and
   update your registrar's nameservers to Cloudflare's.
3. **Point a subdomain at Render**: in Cloudflare DNS, add a `CNAME`
   record (for example `hub` -> `<your-app>.onrender.com`), proxied
   (orange cloud, not grey).
4. **Add the same custom domain in Render**: in the Render dashboard, on
   this static site, add the custom domain (e.g. `hub.remotebase.com`)
   and follow Render's verification step. Render issues its own TLS
   certificate for it automatically.
5. **Create a Zero Trust Access application**: in the Cloudflare
   dashboard, go to Zero Trust -> Access -> Applications -> Add an
   application -> Self-hosted. Set the application domain to
   `hub.remotebase.com`.
6. **Add a policy allowing only the three domains**: create one policy
   with action "Allow", and an "Emails ending in" rule for each of
   `remotebase.com`, `snapdev.ai`, and `ember.new`. Choose "One-time PIN"
   (email code, no extra setup) or Google as the login method.
7. Save. Visiting `hub.remotebase.com` now shows a Cloudflare login
   screen first; only a matching email gets through to the hub.

If the three allowed domains ever change, update both the Cloudflare
Access policy and `config/allowed-domains.json` (the second is
documentation only - editing it alone changes nothing).

**Trade-off to know about**: Cloudflare Access's free plan is capped at
50 authenticated users total. If usage grows past that, either move to a
paid Cloudflare plan, or switch to a small self-hosted auth layer
(Google sign-in on a Render web service) - ask if you want that built
instead.

**Second layer**: the Google Docs linked from the hub stay permissioned
in Google Drive independently, so a leaked hub link on its own does not
expose a document to someone without Drive access.

## Deployment

This repo includes a `render.yaml` Blueprint. In the Render dashboard:
"New" -> "Blueprint" -> point it at this repository. Render reads
`render.yaml` and creates a free static site with no build step
(`staticPublishPath: .`) and the security headers below already applied.

Alternatively, create the static site manually: build command empty,
publish directory `.`.

HTTPS is automatic on the `*.onrender.com` URL and on any custom domain
added afterwards (see Access control above for the custom-domain steps).

## Security

- **Headers** (set in `render.yaml`, applied to every path): a strict
  `Content-Security-Policy` (only this origin plus Google Fonts is
  allowed to load anything), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY` plus `frame-ancestors 'none'` (the hub cannot
  be iframed elsewhere), and `Strict-Transport-Security` (HSTS).
- **No inline scripts or styles**: all JS lives in `scripts/main.js` and
  `data/data.js`; all CSS lives in `styles/main.css`. This keeps the CSP
  above free of `unsafe-inline`.
- **No secrets**: this static site has no server and no credentials to
  manage. If the project later moves to a server-based auth option, add
  a `.env.example` alongside real secrets kept only in Render's
  dashboard.
- All external resource links open with `rel="noopener"`.
- Access is enforced at Cloudflare's edge (see above), never in the
  page's own JavaScript - there is nothing client-side to bypass.

## Accessibility and quality

- Keyboard: `/` focuses search from anywhere on the page, `Esc` clears
  it while it's focused; all interactive elements have a visible focus
  ring.
- Respects `prefers-reduced-motion` (disables the entrance animation).
- Responsive down to mobile widths.
- No build step, no runtime dependencies, no external JS libraries -
  only the page's own ~150 lines of vanilla JS and two Google Fonts
  stylesheets.
