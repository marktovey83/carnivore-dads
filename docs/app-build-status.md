# Carnivore Dads — App Build Status

_Where the app design is up to. Updated 7 September 2026._

Design canvas: **Carnivore Dads Login** — seven artboards, left to right in the order a dad meets them. (Source files: `design/login-and-phase1/`.)

---

## Screens built

| # | Screen | What it does |
|---|---|---|
| 1 | **Login** | Returning dad. Logo lockup, email, password, forgot password, and a route out to sign-up. Country picker at the foot. |
| 2 | **Start your reset** | New dad. Price, occupation, height, weight, full delivery address, payment (Apple Pay / Google Pay / card), start button, shop link. |
| 3 | **Check your email** | Payment taken, link sent, set your password. Resend, junk-folder nudge. |
| 4 | **Set your password** | From the email link. Password, confirm, rules, then straight into Phase 1. |
| 5 | **Phase 1** | Logo, shop icon, the kit as a locked checklist, the bloods block, four tabs. |
| 6 | **Your factory** | The scan-built body render, body fat, visceral fat, macros, bloods received, blood ketones next step. |
| 7 | **Body scan entry** | Photo capture or manual entry of every scan metric, each with its own CD video plate. |

Screens 5, 6 and 7 carry the tab bar: **Videos · Ketones · Shop · Account**.

---

## Locked this run

**The plate.** Country flag plate first, then the CD plate, then the ember rule, then the wordmark. Two separate plates, not one combined.

**Seven countries.** Australia, New Zealand, United Kingdom, Ireland, United States, Canada, South Africa.

**Entry is two doors.** Returning dads log in. New dads go through Start your reset, which takes payment *and* their numbers before an account exists. Account is created by email link afterwards.

**Address, not location.** Full street address — required. It is what the shop delivers to and what the account is tied to. A separate, off-by-default tick box covers showing him local gyms and butchers.

**The kit list is knowledge-gated.** Each item is locked until he has watched its CD video. The video's job is practical: which fish oil, which magnesium, which strips. Then the box opens and he ticks it when it is in his hands.

**The CD plate is the knowledge marker.** Wherever it appears — kit items, body fat, visceral fat, macros, every scan metric — it opens the teaching for that thing.

**Bloods are optional.** He is asked, not required, and asked again twice a year regardless of the program.

**The body is parametric, not generated.** One model driven by his scan figures, so Phase 2 and Phase 4 are genuinely comparable.

---

## Open — needs a decision

1. **The four tabs have no route back to Phase 1.** Either Phase 1 becomes a fifth tab, or the CD logo is the way home.
2. **Optional bloods vs the hard gate.** The master map has Phase 1 as a hard gate requiring bloods and no Phase 2 without starting data. If bloods are optional, something else has to earn the unlock. The master map is now out of step on this point.
3. **Visceral fat is not in the scan screenshots.** Not every InBody unit reports it. Phase 2's target, the ember mass on the body render, and the visceral rating all depend on it. Needs checking against the machines dads will actually use.
4. **BMI on the scan page.** The machine gives it, so it is captured — but it is the bathroom scales with extra steps, and the program tells dads to put the scales in the cupboard. Probably wants a CD video saying exactly that.
5. **Local-ads consent box** on the address screen — keep it, or handle consent in the terms instead.
6. **Placeholders waiting on real answers:** cancellation terms (screen 2), password link expiry (screen 4).

---

## Known gaps beyond the screens

- **Image generation is not in the platform or the financials.** Claude does not generate images. The parametric-model approach avoids needing one, but if any generated imagery is wanted, that is a third cost line alongside AI tokens and cloud.
- **Blood test upload means storing health data.** The most sensitive thing the app will hold. Where it lives and who can reach it needs an answer before that button is real.
- **Body-comp lineup plates.** The 5%, 35% and 40% renders still do not exist, and must be registered to the existing 10–30% set if they are ever made.
- **Butcher network** — see the feature backlog. Directory first, marketplace much later, if at all.
