# Carnivore Dads

React build of the Carnivore Dads app — a five-phase men's health program for dads. Design system and copy come from the locked canvases. No Claude in this stack.

**Live (once Pages is on):** https://marktovey83.github.io/carnivore-dads/

**Repo:** https://github.com/marktovey83/carnivore-dads

## Design system (locked)

- Charcoal `#141414` · Plate `#262626` · Bone `#EDE6D6` · Ember `#C9963A`
- Type: Anton (display), Antonio (text)
- Lockup: country flag plate → CD plate → ember rule → wordmark
- Countries: AU, NZ, UK, IE, US, CA, ZA
- Mobile-first dad app, desktop admin

## What this build includes

Dad flow

1. Login (returning dad + country plate)
2. Start your reset ($25/week, numbers, address, payment)
3. Check your email
4. Set your password
5. Phase 1 kit list (knowledge-gated)
6. Your factory (parametric silhouette from scan numbers)
7. Body scan entry
8. Baja salt lesson
9. Tabs: Videos · Ketones · Shop · Account

Admin

- Staff sign-in
- Clients map
- Client file + Phase 2→3 gate

The CD lockup is the way home to Phase 1.

## Decisions used in this build

Taken from the later README notes where they disagree with older docs:

- Company is Australia
- Phase 1 ketone baseline is **5 tests, one every second day**
- Occupation-language videos are shelved (occupation is still collected)
- Bloods are optional
- Local gyms/butchers consent box is kept, off by default

Still placeholders: cancellation terms, password-link expiry.

Open `index.html` or the GitHub Pages URL. No build step required.

Hash routes:

- `#/` Login
- `#/reset` Start your reset
- `#/app/phase-1` Phase 1
- `#/admin` Staff

React source is in `src/` for a later Vite build. The live app is the root static files so you can view it on GitHub immediately.

## Product docs

See `docs/master-map.md`, `docs/app-build-status.md`, `docs/feature-backlog.md`.
