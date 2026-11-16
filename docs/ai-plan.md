# AI plan: scan reader, bloods reader and Ask CD

Status: plan only, nothing built yet. Written 16 November 2026.

## What we are building

Four features, one small server behind them all.

| # | Feature | What the dad sees | What AI does |
|---|---|---|---|
| 1 | **Scan reader** | Uploads or photographs his Technogym report on the scan page. The twelve boxes fill in. He checks them and saves. | Reads the report and pulls out the twelve numbers. |
| 2 | **Bloods reader** | Uploads his blood test, if he chooses to. Gets a Bloods page: each marker, his number, the lab's range, and what it means in factory language. | Reads the report, pulls out each marker, unit and lab range, and writes a short plain explanation. |
| 3 | **Ask CD** | A chat button on every page, and an "Ask about this scan" button on the body scan profile. | Answers questions about the program and about his own numbers, in the CD voice, inside the education-only rules. |
| 4 | **Body image** | A lifelike picture made from his own scan at the top of the scan profile, a new one for each scan, so he sees Scan 1 to Scan 3 change. | Turns his scan numbers into a picture, made fresh for him. |

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

Made for him from his scan, every time. No stock pictures.

1. When he saves a scan, the app sends the CD server his scan numbers plus a few things he picks once in his profile: age range, skin tone, hair. The scan cannot tell us those.
2. The server turns the numbers into a precise picture description: height and weight, body fat, muscle mass, waist and hip, and where the fat sits (visceral fat is fat around the middle, so a high number shows as a thicker waist and belly).
3. An image-generation service draws him: front view, standing straight, plain background, training shorts, same lighting every time. Claude does not make images itself, so this step uses a separate service. Claude can write the description.
4. **Same man, every scan.** Scan 2 and Scan 3 are made by changing his Scan 1 picture to the new numbers, not drawn from scratch. That way the change he sees is the change in his body, not a different person.
5. The picture goes back to the phone and sits on the scan profile with "Made from your Scan N numbers. An illustration, not a photo." Editing a scan during its phase makes a new picture. A daily cap stops endless remakes.

- **No face likeness by default.** The face is plain and turned slightly, so it is clearly him-shaped but not a photo of anyone. Using his own photo for the face is possible but means sending a photo of him to another company. It needs its own yes, and we would leave it out at first.
- **Checking it:** before launch, run 30 to 50 sets of real scan numbers across the range (lean to heavy, short to tall, high and low visceral) and look at every picture. The things to catch: a picture that flatters or shames, a Scan 2 that looks like someone else, anything that would embarrass him if his kids saw it.
- **Which service:** to be picked by testing two or three on the same scan numbers. The tests are realism, how well each one follows the numbers, keeping the same man across scans, and price. Prices change often, so we compare on the day.

## Privacy and consent

Blood results and body measurements are health information. In Australia that is "sensitive information" under the Privacy Act, and the other countries you sell into have similar rules. So:

- **One clear yes per feature,** asked the first time he uses it: what goes where, what is kept, how to say no. Saying no keeps the app working by hand.
- **Account page update:** it currently says data is kept on the phone and nowhere else. That line changes when the first AI feature ships.
- **Keep nothing we do not need.** The scan and bloods readers keep nothing on the server. Ask CD needs his recent questions while he is chatting; we decide how long to keep them (suggest 30 days) and say so.
- **Body pictures:** the image service gets his scan numbers and his picked looks, never his name or email. His pictures live on his phone; to make Scan 2 look like the same man, the phone sends his Scan 1 picture along. We pick a service that does not keep the pictures or train on them, and check that in its terms.
- **Coach access is a separate yes.**
- **Real accounts come first** if anything is kept on the server. Login today is a demo; it would need real sign-in before the coach can see anyone's bloods.
- **A privacy policy and a legal read** before launch. This plan is not legal advice.

## Rough running costs

Estimates at Claude Opus 5.5 list prices ($4 per million tokens in, $20 per million out), before testing:

| Use | Rough cost each |
|---|---|
| Reading one scan report | 3 to 6 cents |
| Reading one blood test (several pages) | 5 to 15 cents |
| One body picture | Set by the image service we pick; compared in testing |
| One Ask CD answer | 2 to 5 cents, with the program text cached |

A dad who uploads three scans, two blood tests and asks 100 questions over the program costs roughly $3 to $6 in Claude, plus his body pictures. Claude Haiku 5.5, if it reads well enough, would cut that a long way. We measure on real reports and real questions before deciding.

## Build order

| Step | What | Why this order |
|---|---|---|
| 0 | Server, AI account and key, consent screen, Account page wording | Everything else needs these. |
| 1 | Scan reader | Smallest, nothing kept, makes the existing upload box real. |
| 2 | Bloods page and bloods reader | Same pipeline as scans, adds the medical-lane check. |
| 3 | Body image from the scan | Builds on the scan reader; the profile picture becomes his. |
| 4 | Ask CD, linked from the scan and bloods pages | Needs the scan and bloods data to be worth asking about. |
| 5 | Real accounts and coach view | Only once something needs keeping on the server. |

## Decisions needed from you

1. **Hosting:** Cloudflare Workers or Vercel (either is fine; pick the one you already have, if any).
2. **AI account:** an Anthropic API account in the business's name, for the key and the bill.
3. **Phone-only or cloud:** keep everything on the phone (no coach view of bloods), or add real accounts so the coach can see what the dad shares.
4. **Who answers "Talk to a coach":** a person, and how quickly.
5. **Test material:** 10 to 20 real Technogym reports and a handful of blood tests, with permission and names removed.
6. **Legal read:** privacy policy, the Ask CD rules and the body pictures, before launch.
7. **Body picture inputs:** which choices the dad makes once (age range, skin tone, hair, anything else), and whether his own photo is ever used for the face.
