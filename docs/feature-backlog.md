# Carnivore Dads — Feature Backlog (proposed, not locked)

_Ideas raised but not yet locked into the master map. Nothing here is a decision. When something here gets locked, move it into `master-map.md` and delete it from this file._

---

## Butcher network — raised 5 September 2026

**The idea:** use the dad's location to find butchers near him who can supply the meat for the recipes, so ordering is one tap instead of a shopping trip he has to plan.

**Why it fits:** the biggest reason a dad falls off is friction at the meat counter — not knowing the cuts, not knowing what to ask for, buying wrong and eating wrong. A butcher who already knows the CD cut list removes that. It also gives The Room's recipe shelf somewhere to land: recipe → order → it turns up.

**The fork in the road.** These are two different businesses and the choice decides how much CD has to build and carry:

| | **A. Directory** | **B. Order-through** |
|---|---|---|
| What CD does | Lists butchers near him, with the CD cut list ready to show at the counter | Takes the order, splits the money, chases the butcher |
| CD's job when it goes wrong | None — he rang the butcher | Refunds, late deliveries, wrong or off meat |
| Build | Postcode lookup + a vetted list | Cart, payments, split settlement, order status, support |
| What CD becomes | An education app with a good address book | A perishable-food marketplace |

**Recommendation: start at A, in one city, and only move to B once a handful of butchers are actually taking CD orders by phone and want the volume.** A directory can ship alongside the recipe shelf. A marketplace is a company.

**Things to settle before this locks:**

- **Location, not live location.** Postcode or suburb at profile creation is enough to find butchers. Tracking where a dad is right now buys nothing and costs trust — it should not be built.
- **Collides with the locked shop.** The member shop is currently shelf-stable kit: salt, fish oil, magnesium glycinate, ketone strips, merch. Meat is perishable — cold chain, spoilage, same-day windows. It cannot ride on the same cart logic and probably should not sit on the same shelf.
- **Dubai company, meat in Australia.** Selling supplements and merch from a Dubai entity is one question; taking money for food supply in another country is a different one. Needs an actual answer before B.
- **"No medical claims" extends to the order.** A butcher order generated off a CD recipe must read as a shopping list, never as a prescribed diet.
- **Butcher supply is the real bottleneck.** The feature is worthless without butchers who will do it. That is a phone-call problem, not a code problem, and it should be tested before anything is built.
- **Margin question, unanswered.** Referral fee, margin on the order, or free-and-it-just-makes-the-program-stickier. Each one changes what CD has to promise the butcher.

**Status:** proposed. Not in the master map. Not costed.

---

## Entry screens — drafted 5 September 2026

Design canvas: **Carnivore Dads Entry Screens** (four artboards — returning-dad login, new-dad step 1, new-dad step 2 with the body-comp lineup, and the plate direction comparison).

**Two front doors, locked in conversation:**

- **Returning dad** → login screen. Logo lockup, email, password, sign in, forgot password, route to sign-up.
- **New dad** → step 1: logo, email, occupation, height, weight, then OK. Step 2: the body-comp lineup + account sign-up (name, password, date of birth, gender, chronic-illness flag).

Collecting height and weight *before* the account exists is deliberate — it means the lineup on step 2 is his numbers, not a generic chart. Nothing can be stored until he presses Create Account.

**Country flag on the plate — open decision.** Marketing to all English-speaking countries (AU, NZ, UK, IE, US, CA, ZA). The dad picks his country and the CD inspection plate changes.

- **Option B (as asked):** the flag fills the plate face. Unmistakable, but the CD mark leaves the most prominent spot on the screen and most flags turn to mush at 20px.
- **Option A (recommended):** the plate keeps CD and the flag rides the corner as a small enamel chip. Brand keeps its seat; the flag reads as a detail rather than a statement.

**Status:** awaiting the plate decision. Both built on the canvas at 64 / 34 / 20px for comparison.

---

## Body-comp lineup images — raised 5 September 2026

Step 2 shows the same man at **5% to 40% body fat in 5% increments** — eight plates — to teach that height and weight are not the story.

**Gap:** the existing set (`BodyComp_180cm_95kg_10pct.jpg` … `_30pct.jpg`) covers 10–30%. **5%, 35% and 40% do not exist and must be commissioned.**

**Hard requirement for the three new plates — registration.** Same man, same camera position, same framing, same crop, same lighting, same pose, same background, same lens distance as the existing five. They must be made to match the existing set, not generated fresh. Without registration the row reads as eight different blokes and the teaching collapses.

Note: 5% is stage-lean, not lean. If the point is "the scales cannot tell these men apart", 8% may be the more honest low anchor.

**Motion (parked, not needed yet).** Eight registered stills played in order read as one body changing — hard cut, cross-fade, or true morph, cheapest first. A drag-scrubber (he drags 5→40 and finds his own number) beats an autoplay loop on a phone and costs no motion work. Parked by decision on 5 September.

---

## Personalised body image after Phase 1 — raised 5 September 2026

**The intent (already in the master map):** once his scan and bloods are in, Phase 2 replaces the generic silhouette with an image of *his* body, and the profile image updates each phase.

**Platform gap this exposes:** **Claude does not generate images.** Claude is right for the teaching, the occupation language and the video scripts, but a rendered body needs a separate image service and a separate cost line. The financials currently list only "CD AI billed per token / video" and cloud — this is an unbudgeted third component.

**Recommendation: do not generate his body with an image model. Use a parametric 3D model.**

The whole value of the image is comparison across phases. If Phase 2's and Phase 4's images both come out of an image generator, the difference between them includes the generator's randomness, not only his progress — two renders of two slightly different men, presented as one man improving. That is the same failure as the bathroom scales the program already rejects.

A single rigged body model driven by his scan figures (height, weight, body fat, waist, visceral rating) is instant, free per render, identical for every dad, and changes **only** because his numbers changed. This is how gym scan software works and it is the honest version.

**Bloods do not belong on the body.** HbA1c, liver markers, inflammation and hormones are not visual. Painting them onto a torso is where an education app starts to look like it is diagnosing — the line CD holds everywhere else. Bloods light up bays on the eleven-system factory map; the scan shapes the body. Two pictures, two jobs.

**Tone:** a photoreal image of an overweight man, shown to that man, lands hard. The brand is inspection plates and factory diagrams — a technical render in charcoal and bone carries the same information as a photographic one without the shame, and is more on-brand.

**Status:** proposed approach. Image-generation cost line not in the founders financials.
