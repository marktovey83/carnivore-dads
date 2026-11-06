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

1. Login: the lockup, the slogan, LOG IN or REGISTER, and the country plate
2. Start your reset: trade, height, weight. Nothing else.
3. My body: the phase picker, then Phase 1's kit, bloods, scan and lessons
4. Your factory (parametric silhouette from scan numbers)
5. Body scan entry
6. Baja salt lesson
7. Tabs: Videos · Ketones · My body · Shop · Account

## The hub, after the production build

My body, Ketones and Videos are one shell with different contents, so the
phase a man is in means the same thing on all three. Each opens on the phase
picker: Phase 1 to 4 and Graduate, with the one he is up to marked and the
rest padlocked. A locked row says when it opens rather than doing nothing.
The CD lockup is the way home to the picker.

`#/app/my-body` opens the picker, `#/app/my-body/1` opens that phase. Same for
`#/app/ketones` and `#/app/videos`.

Account holds what Start your reset no longer asks for: email, delivery
address and the local gyms and butchers consent box, off by default. None of
it is needed to begin, so none of it is in the way of beginning. It is also
the way back to the login.

The craving screens were never built here, so there was nothing to remove.

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

The Pages workflow stamps `?v=` on the script and stylesheet with the commit
SHA at deploy time. Before that it was a hardcoded date, so a push landed at
the same URL and browsers kept serving the old files. If a change does not
appear on the live site, that is the first thing to check.

Hash routes:

- `#/` Login
- `#/reset` Start your reset
- `#/app/my-body` My body, the phase picker
- `#/app/my-body/1` Phase 1
- `#/app/ketones` · `#/app/videos` · `#/app/shop`
- `#/admin` Staff

## Phase 2: The Switch

Formerly "The Dad Bod". Phase 1 has a gate card at the foot of the kit:
his trade, a saved scan and five baseline readings. Bloods are asked for,
not required. When all three are in, UNLOCK PHASE 2 opens it.

`#/app/my-body/2` is The Switch: what changes at the dock, a GP warning for
anyone on blood sugar or blood pressure medicine, his visceral number from
the scan, the first-week salt and magnesium reminder, his last seven
mornings, the five lessons (`#/app/lesson/2/<slug>`) and the Phase 3 gate.

`#/app/ketones/2` logs mornings and handles random pings. Readings are
tagged with the phase they were taken in, so the baseline stays the baseline.
A ping falls due at a random time 12 to 42 hours after the last, in waking
hours, and is never announced. There is no push service, so it shows the next
time the app is open, and he then has 30 minutes to send the number and a
photo of the meter. Clean means in time and at 0.5 or above. The photo is
shrunk to a thumbnail and kept on the phone.

Phase 2 → 3 gate: at least 7 days in Phase 2, 5 of the last 7 mornings at
0.5 or above (a ping is not a morning), and 3 clean pings. When it is met the
app says so; Phase 3 itself is not built yet, so it does not open.

Lesson films for Phase 2 are not made yet. Each lesson page says so and
carries the full script as text.

## The login is a door, not an auth check

The lockup, the slogan, and two ways in: LOG IN opens My body, REGISTER opens
Start your reset. There are no email or password fields, on purpose. There is
no auth service behind this, and a form that takes a password and then lets
anybody through is worse than no form: it tells a man an account is holding
his record when nothing is. With no fields, nothing is pretending.

The country picker stays at the foot and sets the flag in the lockup.

## Payment is out, for now

The $25 a week screen, the card fields, "check your email" and "set your
password" have been taken out. There is no payment provider behind any of it,
and a form that takes a card number and then says it worked is worse than not
having one.

REGISTER collects his numbers and his trade and opens Phase 1 straight away.
His record is on the phone.

Putting payment back is a deliberate job: a provider, a real account, and the
cancellation terms that are still a placeholder.

React source is in `src/` for a later Vite build. The live app is the root static files so you can view it on GitHub immediately.

## Product docs

See `docs/master-map.md`, `docs/app-build-status.md`, `docs/feature-backlog.md`.
