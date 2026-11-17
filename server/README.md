# Carnivore Dads server

Reads body scan reports for the app. Runs on Cloudflare Workers, separate
from the GitHub Pages site, because the Anthropic API key cannot sit in a
public website.

`POST /scan/read` with a form field `file` (PDF, JPG, PNG or WebP, up to
10 MB). It answers with the scan numbers it could read:

```json
{ "fields": { "weight": 95, "bf": 24.6, "visceral": 12.4 },
  "missing": ["waist", "hip"], "rejected": [], "converted": [] }
```

- `missing`: not printed on the report.
- `rejected`: read, but outside what a real reading could be, so thrown out.
- `converted`: changed from pounds or inches.

Nothing is stored. The file is sent to Claude, read, and dropped. Each
connection gets 6 reads a minute.

## Set it up (once)

You need a Cloudflare account (free plan is fine) and an Anthropic API
account with a key.

```bash
cd server
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

The live server is deployed by Cloudflare from GitHub: every push to
`main` that changes `server/` rebuilds it (root directory `server`, deploy
command `npx wrangler deploy`). It runs at
`https://carnivore-dads-server.mark-c4a.workers.dev`.

In `app.js`, the reader is in test mode: it only switches on for a phone
that opened the app with `?reader=on` in the address (`?reader=off` turns it
off). Set `READER_FOR_EVERYONE` to `true` to open it to every dad.

## Body picture

`POST /body/picture` with JSON `{ scan, looks, reference? }` draws a
lifelike picture of a man with those scan numbers using Google's Gemini
image model, and sends it back as a data URL. `reference` is his Scan 1
picture, so Scan 2 and 3 stay the same man. Nothing is stored on the server;
the app keeps pictures on the phone.

It needs two things in Cloudflare:

- Secret `GEMINI_API_KEY` (Settings, Variables and Secrets, type Secret).
- `GEMINI_IMAGE_MODEL` in `wrangler.toml`. Open `/body/models` once the key is
  in to see which image models the key can use.

`/health` shows `picture_key_set` and `picture_model`.

## Checks

```bash
npm run check   # types
npm test        # handler and number checks, with Claude stood in, so no cost
npm run dev     # local server on http://localhost:8787
```

Before going live, run 10 to 20 real Technogym reports through it (names
removed) and check every number against the paper.
