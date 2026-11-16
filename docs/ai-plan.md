# AI plan: scan reader, bloods reader and Ask CD

Status: plan only, nothing built yet. Written 16 November 2026.

## What we are building

Four features, one small server behind them all.

| # | Feature | What the dad sees | What AI does |
|---|---|---|---|
| 1 | **Scan reader** | Uploads or photographs his Technogym report on the scan page. The twelve boxes fill in. He checks them and saves. | Reads the report and pulls out the twelve numbers. |
| 2 | **Bloods reader** | Uploads his blood test, if he chooses to. Gets a Bloods page: each marker, his number, the lab's range, and what it means in factory language. | Reads the report, pulls out each marker, unit and lab range, and writes a short plain explanation. |
| 3 | **Ask CD** | A chat button on every page, and an "Ask about this scan" button on the body scan profile. | Answers questions about the program and about his own numbers, in the CD voice, inside the education-only rules. |
| 4 | **Body image** | A realistic picture of a body with his numbers at the top of the scan profile. | Nothing at first (see below). |

## The rules every AI feature follows

These come straight from the master map and do not bend.

- **Education and advice only.** No diagnosis, no treatment, no prescription, and never a word about stopping or changing a GP medicine.
- **The dad confirms every number.** AI fills the boxes; he checks them and presses save. Nothing is saved on AI's word alone.
- **Out of range goes to the GP.** A blood marker outside the lab's printed range gets "worth showing your GP", not an opinion on what it means for him.
- **Red-flag symptoms get a straight answer.** Chest pain, fainting, confusion, very high or very low blood sugar: stop reading, call a doctor or emergency services. Ask CD says this and nothing else.
- **Medical lane stays medical lane.** If bloods or a question suggest the medical lane (diabetes medicine, blood pressure medicine, kidney or liver strain), Ask CD points him to his GP and to the coach. It never unlocks or changes his phase.
- **No made-up numbers.** If the report is blurry or a number is missing, the box stays empty and he is told which one to type.

## How it fits together

```
 Phone (the app as it is now)
   |  photo / PDF, or a question + his numbers
   v
 CD server (new, small)  -- holds the AI key, checks consent, limits use
   |
   v
 Claude (Anthropic API)  -- reads the report or answers the question
   |
   v
 CD server -> phone: the twelve numbers, the blood markers, or the answer
```

- **Why a server:** the AI account key cannot sit inside a public website, or anyone could run up the bill with it. The server keeps it, checks the dad has said yes, and caps how much each person can use.
- **Hosting:** a serverless host (Cloudflare Workers or Vercel) suits the app as it is: small, cheap, nothing to look after. Written in TypeScript to match the rest of the project.
- **Model:** Claude Opus 5.5 (`claude-opus-5-5`) to start. It reads photos and PDFs, and fills a fixed form of fields, so the twelve scan numbers come back in a shape the app can trust. Once it is working we can measure Claude Haiku 5.5 on real reports: it costs far less, and reading a report may not need the bigger model. That is a cost call for you, made on results.

## 1. Scan reader

1. Dad taps the upload box on Scan 1, 2 or 3 and picks a PDF or takes a photo.
2. The app sends the file to the CD server.
3. The server asks Claude for exactly the twelve fields (height, weight, body fat, visceral fat, fat mass, muscle, bone, water, phase angle, waist, hip, BMI), each with the unit printed on the report, or empty if it is not there.
4. The app fills the boxes, marks each one "from your report", and tells him to check them.
5. He saves as he does now. The scan still locks when he moves on a phase.

- **Phone-only storage stays true:** the file goes to the server, the numbers come back, nothing is kept on the server.
- **Test set:** 10 to 20 real Technogym reports (with permission, names removed), photographed badly as well as well. We check every number before it goes live.

## 2. Bloods reader

1. A new **Bloods** page under My body, with the same upload box. It is optional, and the page says so.
2. Claude pulls out every marker: name, his number, unit, and the lab's own reference range as printed.
3. The page lists them grouped the way the program teaches (fuel, fats in the pipes, liver, kidneys, inflammation), each with one or two lines in factory language about what that marker measures.
4. Anything outside the lab's range is marked and says "worth showing your GP". No judgement beyond that.
5. One set of bloods per phase, same edit-then-lock rule as scans, so he can compare before and after.

- **Ranges come from his own lab report,** not from us. Labs differ and the printed range is the one his GP will use.
- **Medical-lane check:** if his bloods show a marker the master map lists for the medical lane, the page tells him to talk to his GP before Phase 2, and the coach sees it on his client file (only if he has said the coach can).

## 3. Ask CD

- **Where:** a chat button on every page, plus "Ask about this scan" on the body scan profile and "Ask about my bloods" on the Bloods page. Those two open the chat with that scan or those bloods already loaded.
- **What it knows:**
  - the program: the master map, every lesson and every kit page, written into its instructions;
  - him, but only what he has agreed to share: phase, scans, ketone readings, bloods.
- **How it talks:** the CD voice. Short, plain, trade language, factory analogies.
- **What it will not do:** the rules above. Off-topic questions get a polite "that is outside what I cover".
- **Handing to a person:** a "Talk to a coach" button in the chat. It sends the question to the coach's client file (the admin pages already exist). Ask CD offers it when a question needs a human.
- **Limits:** a daily number of questions per dad, so one chatty user cannot run up the bill.
- **Checking it:** before launch, a set of 50 to 100 real-style questions, including the hard ones (meds, chest pain, "can I stop my statin", "my mate says carbs are fine"). Every answer read by you or the coach. Re-run whenever the instructions change.

## 4. Body image

Start without AI:

1. **First:** a library of 20 to 30 realistic images covering body-fat levels and builds, made once and checked by you. The app picks the closest to his latest scan. No running cost, no data leaves the phone, and every image has been seen by a person.
2. **Later, if wanted:** generate an image per dad from his numbers. This needs a separate image-generation service (Claude reads images but does not make them). It costs more per image, and the picture is still an illustration of a body with his numbers, not him. The page must say so.

## Privacy and consent

Blood results and body measurements are health information. In Australia that is "sensitive information" under the Privacy Act, and the other countries you sell into have similar rules. So:

- **One clear yes per feature,** asked the first time he uses it: what goes where, what is kept, how to say no. Saying no keeps the app working by hand.
- **Account page update:** it currently says data is kept on the phone and nowhere else. That line changes when the first AI feature ships.
- **Keep nothing we do not need.** The scan and bloods readers keep nothing on the server. Ask CD needs his recent questions while he is chatting; we decide how long to keep them (suggest 30 days) and say so.
- **Coach access is a separate yes.**
- **Real accounts come first** if anything is kept on the server. Login today is a demo; it would need real sign-in before the coach can see anyone's bloods.
- **A privacy policy and a legal read** before launch. This plan is not legal advice.

## Rough running costs

Estimates at Claude Opus 5.5 list prices ($4 per million tokens in, $20 per million out), before testing:

| Use | Rough cost each |
|---|---|
| Reading one scan report | 3 to 6 cents |
| Reading one blood test (several pages) | 5 to 15 cents |
| One Ask CD answer | 2 to 5 cents, with the program text cached |

A dad who uploads three scans, two blood tests and asks 100 questions over the program costs roughly $3 to $6 in AI. Claude Haiku 5.5, if it reads well enough, would cut that a long way. We measure on real reports and real questions before deciding.

## Build order

| Step | What | Why this order |
|---|---|---|
| 0 | Server, AI account and key, consent screen, Account page wording | Everything else needs these. |
| 1 | Scan reader | Smallest, nothing kept, makes the existing upload box real. |
| 2 | Bloods page and bloods reader | Same pipeline as scans, adds the medical-lane check. |
| 3 | Ask CD, linked from the scan and bloods pages | Needs the scan and bloods data to be worth asking about. |
| 4 | Body image library | Can run alongside any step; needs the images made. |
| 5 | Real accounts and coach view | Only once something needs keeping on the server. |

## Decisions needed from you

1. **Hosting:** Cloudflare Workers or Vercel (either is fine; pick the one you already have, if any).
2. **AI account:** an Anthropic API account in the business's name, for the key and the bill.
3. **Phone-only or cloud:** keep everything on the phone (no coach view of bloods), or add real accounts so the coach can see what the dad shares.
4. **Who answers "Talk to a coach":** a person, and how quickly.
5. **Test material:** 10 to 20 real Technogym reports and a handful of blood tests, with permission and names removed.
6. **Legal read:** privacy policy and the Ask CD rules, before launch.
