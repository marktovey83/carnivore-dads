const KEY = "cd-app-state-v1";
const COUNTRIES = [
  ["AU", "Australia"],
  ["NZ", "New Zealand"],
  ["GB", "United Kingdom"],
  ["IE", "Ireland"],
  ["US", "United States"],
  ["CA", "Canada"],
  ["ZA", "South Africa"],
];
const TRADES = ["FIFO electrician", "Police", "Plumber / trades", "Truck / long haul", "Builder", "Office / desk", "Other"];
const KIT = [
  // slug gives the item its lesson page. video is the file in assets/ once it
  // exists; null means the lesson says so rather than pretending.
  { id: "ketones", name: "Blood ketone meter and strips", slug: "ketone-meter", video: "phase1-ketone-meter.mp4" },
  { id: "baja", name: "Mineralised salt", slug: "mineralised-salt", video: "phase1-mineralised-salt.mp4" },
  { id: "fish", name: "Fish oil", slug: "fish-oil", video: "phase1-fish-oil.mp4" },
  { id: "mag", name: "Magnesium glycinate", slug: "magnesium", video: "phase1-magnesium.mp4" },
  { id: "watch", name: "Smart watch with heart rate", slug: "smart-watch", video: "phase1-smart-watch.mp4" },
  { id: "gym", name: "Gym membership", slug: "gym-membership", video: "phase1-gym-membership.mp4" },
  { id: "scan", name: "Body scan", slug: "body-scan", video: "phase1-body-scan.mp4", hint: "Tick it when your scan is done." },
];

function kitItem(key) {
  return KIT.find((k) => k.slug === key || k.id === key) || null;
}

/* The plate can only promise what is actually behind it. All seven have a
   lesson now, so all seven say WATCH, but the marks stay keyed off what the
   item really has so a Phase 2 plate with no film still says SOON. */
function plateMark(item) {
  if (item.href) return "OPEN";
  if (item.video) return "WATCH";
  return "SOON";
}

function plate(item) {
  const mark = plateMark(item);
  const to = item.href || `#/app/kit/${item.slug}`;
  const verb = mark === "WATCH" ? "Watch" : mark === "OPEN" ? "Open" : "Read about";
  return `<a href="${to}" class="kit-plate-link" aria-label="${verb} ${item.name}"><span class="kit-plate"><span class="cd-plate"><span>CD</span></span><small>${mark}</small></span></a>`;
}
const PHASE_NAMES = ["Knowing your body", "The switch", "The liver", "Advanced macros", "Graduate"];
const LESSONS = [
  ["Your ketone meter", "Your smart watch", "Mineralised salt", "Fish oil", "Magnesium glycinate", "Gym and body scan", "Gut health", "Intro macros"],
  ["Sugar", "Macros", "Gut health", "Cells"],
  ["The processing station", "Intro fasting", "Zones continued"],
  ["Timing and amounts", "When carbs come back", "Your scan as a work list", "Structured workouts"],
];
const SHOP = [
  ["Mineralised sea salt", 18],
  ["Fish oil", 32],
  ["Magnesium glycinate", 24],
  ["Ketone strips", 29],
  ["Inspection-plate cap", 35],
];
const CLIENTS = [
  { id: "daniel", name: "Daniel R.", suburb: "Mandurah, WA", trade: "FIFO electrician", country: "Australia", phase: 2, day: 11, status: "miss", lastLog: "6 days ago", ketones: "9 logged", lessons2: "1 of 4", notes: "On a two-weeks-on swing. Expect gaps in logging while he's on site — check in when he's back." },
  { id: "james", name: "James P.", suburb: "Fremantle, WA", trade: "Builder", country: "Australia", phase: 1, day: 8, status: "ok", lastLog: "yesterday", ketones: "4 logged", notes: "" },
  { id: "tom", name: "Tom H.", suburb: "Osborne Park, WA", trade: "Truck / long haul", country: "Australia", phase: 2, day: 16, status: "gate", lastLog: "today", ketones: "14 logged", lessons2: "3 of 4", notes: "One lesson to go before Phase 3." },
];

const defaults = {
  country: "AU",
  email: "",
  occupation: "",
  height: "180",
  weight: "95",
  address: { street: "", suburb: "", state: "WA", postcode: "", localAds: false },
  watched: {},
  owned: {},
  scan: { height: "180", weight: "95", bodyFat: "28", visceral: "12" },
  ketones: [],
  phase: 1,
  phase2At: null, // when he opened Phase 2
  done2: {}, // Phase 2 lessons he has ticked off
};

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...defaults };
  }
}
let state = load();
function save(next) {
  state = { ...state, ...next };
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

function flag(code) {
  const paths = {
    AU: '<rect width="60" height="30" fill="#012169"/><circle cx="15" cy="23" r="2.4" fill="#fff"/><circle cx="46" cy="20" r="1.5" fill="#fff"/><circle cx="40" cy="10" r="1.5" fill="#fff"/><circle cx="46.5" cy="5" r="1.5" fill="#fff"/><circle cx="52.5" cy="12" r="1.3" fill="#fff"/>',
    NZ: '<rect width="60" height="30" fill="#012169"/><circle cx="45" cy="7" r="2" fill="#fff"/><circle cx="45" cy="7" r="1.1" fill="#C8102E"/><circle cx="51" cy="14" r="2" fill="#fff"/><circle cx="51" cy="14" r="1.1" fill="#C8102E"/>',
    GB: '<rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" fill="none"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10" fill="none"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6" fill="none"/>',
    IE: '<rect width="20" height="30" fill="#169B62"/><rect x="20" width="20" height="30" fill="#fff"/><rect x="40" width="20" height="30" fill="#FF883E"/>',
    US: '<rect width="60" height="30" fill="#fff"/><rect width="60" height="2.3" fill="#B31942"/><rect y="4.6" width="60" height="2.3" fill="#B31942"/><rect y="9.2" width="60" height="2.3" fill="#B31942"/><rect y="13.8" width="60" height="2.3" fill="#B31942"/><rect y="18.5" width="60" height="2.3" fill="#B31942"/><rect y="23.1" width="60" height="2.3" fill="#B31942"/><rect y="27.7" width="60" height="2.3" fill="#B31942"/><rect width="24" height="16" fill="#0A3161"/>',
    CA: '<rect width="60" height="30" fill="#fff"/><rect width="15" height="30" fill="#D80621"/><rect x="45" width="15" height="30" fill="#D80621"/><polygon fill="#D80621" points="30,6.5 31.4,10.3 35,9.6 34,12.6 37.6,11.2 36.2,14.2 39,15.6 36.2,17.2 37.6,20.2 34,18.8 35,21.8 31.4,21.1 30.8,25 29.2,25 28.6,21.1 25,21.8 26,18.8 22.4,20.2 23.8,17.2 21,15.6 23.8,14.2 22.4,11.2 26,12.6 25,9.6 28.6,10.3"/>',
    ZA: '<rect width="60" height="30" fill="#007749"/><path d="M0,0 L22,15 L0,30 Z" fill="#000"/><path d="M8,0 H60 V8 H18 Z" fill="#fff"/><path d="M8,22 H60 V30 H18 Z" fill="#fff"/><path d="M8,0 H60 V6 H20 Z" fill="#001489"/><path d="M8,24 H60 V30 H20 Z" fill="#E03C31"/>',
  };
  return `<svg class="flag-svg" viewBox="0 0 60 30">${paths[code] || paths.AU}</svg>`;
}

function lockup(compact) {
  // Plates on top, flag then CD. The wordmark underneath them, with the ember
  // rule and the slogan beside it on the same line.
  return `
    <div class="lockup${compact ? " compact" : ""}">
      <div class="plates">
        <span class="flag-plate">${flag(state.country)}</span>
        <span class="cd-plate"><span>CD</span></span>
      </div>
      <div class="mark-line">
        <strong>CARNIVORE DADS</strong>
        <span class="etk">Energy through knowledge</span>
      </div>
    </div>`;
}

const TABS = [
  ["#/app/videos", "Videos", "videos", "M8 5v14l11-7z"],
  ["#/app/ketones", "Ketones", "ketones", "M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12z"],
  ["#/app/my-body", "My body", "home", "M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6M8 10h8l-2 7 1 5M10 17l-1 5M8 10l-3 5M16 10l3 5"],
  ["#/app/shop", "Shop", "shop", "M3 4h2l3 11h11l2-8H6M9 20h1M18 20h1"],
  ["#/app/account", "Account", "account", "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2"],
];

function tabs(active) {
  return `<nav class="tabs" aria-label="Main">${TABS.map(([href, label, key, icon]) => `
    <a href="${href}" class="${key === "home" ? "tab-hub" : ""}${active === key ? " on" : ""}" ${active === key ? 'aria-current="page"' : ""}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${icon}" /></svg>
      <span>${label}</span>
    </a>`).join("")}</nav>`;
}

function phone(inner, tab) {
  return `
    <div class="desk">
      <div class="desk-bar"><span><strong>Carnivore Dads</strong><span class="desk-sub"> · factory reset</span></span><span class="desk-links"><a href="#/admin">Admin</a></span></div>
      <div class="phone">
        <div class="screen ${tab ? "with-tabs" : ""}">
          <a href="#/app/my-body">${lockup(!!tab)}</a>
          ${inner}
        </div>
        ${tab ? tabs(tab) : ""}
      </div>
    </div>`;
}

function legal() {
  return `<p class="legal">Education and advice only. Not treatment, not a prescription, not a diagnosis. Your GP owns your medicine.</p>`;
}

function login() {
  const name = COUNTRIES.find((c) => c[0] === state.country)?.[1];
  return phone(`
    <p class="lede" style="text-align:center">Know your body. Build your habits. Keep showing up.</p>
    <a class="btn" href="#/app/my-body" style="margin-top:26px;display:block">LOG IN</a>
    <p class="fine" style="margin:22px 0 8px;letter-spacing:.18em;text-align:center">NEW HERE</p>
    <a class="btn ghost" href="#/reset">REGISTER</a>
    <p class="legal">Education and advice only. Your GP owns your medicine.</p>
    <div class="country-row">
      <div class="split"><span class="field" style="margin:0">Your country</span><span>${name}</span></div>
      <div class="country-list">
        ${COUNTRIES.map(([code, label]) => `<button data-country="${code}" class="${code === state.country ? "on" : ""}">${label}</button>`).join("")}
      </div>
    </div>
  `);
}

function reset() {
  return phone(`
    <h2 class="display">START YOUR RESET.</h2>
    <p class="lede">Three things, then Phase 1 opens. Everything else can wait.</p>
    <label class="field">Occupation</label>
    <select id="occupation">${["", ...TRADES].map((t) => `<option ${t === state.occupation ? "selected" : ""}>${t || "Choose your trade"}</option>`).join("")}</select>
    <p class="fine">Not small talk. This is the language every video and lesson gets written in.</p>
    <div class="stat-grid">
      <div><label class="field">Height (cm)</label><input id="height" value="${escapeAttr(state.height)}" /></div>
      <div><label class="field">Weight (kg)</label><input id="weight" value="${escapeAttr(state.weight)}" /></div>
    </div>
    <button class="btn" style="margin-top:22px" data-act="start">OPEN PHASE 1</button>
    <p class="fine" style="margin-top:14px">Your delivery address and the rest of your details live in Account, and only matter when there is something to post you.</p>
    ${legal()}
  `);
}

function phaseShell(title, tab, phase, body) {
  const current = Number(state.phase) || 1;
  if (phase === null) {
    const rows = PHASE_NAMES.map((name, i) => {
      const n = i + 1;
      const locked = n > current;
      const mark = locked ? "LOCKED" : n === current ? "YOU&rsquo;RE HERE" : "DONE";
      const note = noteFor(title, n, locked);
      return `
        <button class="phase-row ${n === current ? "is-current" : ""}" ${locked ? 'aria-disabled="true" data-locked="' + n + '"' : 'data-phase="' + n + '"'}>
          <span>
            <small>${mark}</small>
            <b>${n === 5 ? "Graduate" : "Phase " + n}</b>
            ${n === 5 ? "" : `<em>${name}</em>`}
            ${note ? `<em class="phase-note">${note}</em>` : ""}
          </span>
          <span aria-hidden="true">${locked ? '<svg width="18" height="20" viewBox="0 0 20 22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="9" width="12" height="10" rx="2"/><path d="M6 9V6a4 4 0 0 1 8 0v3"/></svg>' : "&rsaquo;"}</span>
        </button>`;
    }).join("");
    return phone(`
      <p class="phase-tag">YOUR JOURNEY</p>
      <h2 class="display">${title.toUpperCase()}.</h2>
      <p class="lede">Choose a phase to open. Your progress is shared across all three tabs.</p>
      <nav class="phase-picker" aria-label="Program phase">${rows}</nav>
      <p class="fine" id="phase-note" role="status" hidden></p>
    `, tab);
  }
  if (phase === 5) {
    return phone(`
      <button class="linkish phase-back" data-phase="back">&lsaquo; PHASES</button>
      <p class="phase-tag">GRADUATE</p>
      <h2 class="display">YOUR ONGOING RECORD.</h2>
      <p class="lede">Your earlier phases stay open. Keep using your logbook and look back when it helps.</p>
    `, tab);
  }
  return phone(`
    <button class="linkish phase-back" data-phase="back">&lsaquo; PHASES</button>
    <p class="phase-tag">PHASE ${phase}</p>
    <h2 class="display">${PHASE_NAMES[phase - 1].toUpperCase()}.</h2>
    ${body}
  `, tab);
}

/* The one line of state worth showing on a locked-or-not row. */
function noteFor(title, n, locked) {
  if (locked || n === 5) return "";
  if (n === 2) {
    const g = gate3();
    if (title === "Ketones") return `${readingsFor(2).length} readings saved`;
    return g.met ? "All lessons done" : `${g.done} of ${PHASE2_LESSONS.length} lessons done`;
  }
  if (title === "Ketones") return `${readingsFor(1).length} readings saved`;
  if (title === "My body") {
    if (Number(state.phase) === 1) {
      const left = gate2().items.filter((i) => !i.ok).length;
      return left ? `${left} of ${KIT.length} left before Phase 2` : "Phase 2 is ready to unlock";
    }
    return state.owned.scan ? "Scan saved" : "No scan saved yet";
  }
  return "";
}

function myBody(phase) {
  const owned = KIT.filter((k) => state.owned[k.id]).length;
  const rows = KIT.map((item) => {
    const watched = !!state.watched[item.id];
    const have = !!state.owned[item.id];
    const hint = have
      ? "Got it."
      : item.hint
        ? item.hint
        : item.video && !watched
          ? "Tick it when it is in your hands. The video tells you which one to buy."
          : "Tick it when it is in your hands.";
    return `
      <div class="kit-row">
        <button class="check ${have ? "on" : ""}" data-own="${item.id}">${have ? "\u2713" : ""}</button>
        <div>${item.name}<div class="fine">${hint}</div></div>
        ${plate(item)}
      </div>`;
  }).join("");
  const kit = `
    <div class="card intro-card">
      <p class="field" style="margin-top:0">Start here</p>
      <h3 class="intro-title">LEARN THE FACTORY.</h3>
      <video class="lesson-video" controls preload="metadata" playsinline
             src="./assets/phase1-intro.mp4"></video>
      <p class="fine">1:02</p>
      <p class="lede" style="margin:10px 0 0">Eleven systems, one loading dock, pipes that carry what the machines need, a warehouse of stored fat around the organs, and a processing station in the liver. Phase 1 is the baseline: the bloods so nobody is guessing, the scan so you can see the engine, your first meter readings, and the simple kit below.</p>
    </div>
    <div class="split"><span class="field" style="margin:0">What you need</span><span class="badge">${owned} / ${KIT.length}</span></div>
    ${rows}
    <div class="split" style="margin-top:22px"><span class="field" style="margin:0">Your bloods</span><span class="badge">OPTIONAL</span></div>
    <div class="card">
      <p class="lede" style="margin:0">You do not have to hand us your blood test. But it is the difference between us teaching you about a factory and us teaching you about yours.</p>
      <p class="fine">We ask every Carnivore Dad to get bloods twice a year. Not because something is wrong, because a man who checks is a man who knows.</p>
      <button class="btn ghost">UPLOAD YOUR BLOOD TEST</button>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Your ketone readings</p>
      <p class="lede" style="margin:0">Test whenever you like, as often as you like. After a big feed, after something sweet, first thing, last thing. Every reading goes on your record.</p>
      <a class="btn ghost" href="#/app/ketones/1" style="margin-top:12px;display:block">OPEN YOUR READINGS</a>
    </div>
    ${gate2Card()}`;
  const later = `
    <p class="lede">The work for this phase. Your scan and your lessons sit together here.</p>`;
  return phaseShell("My body", "home", phase, `
    ${phase === 1 ? kit : phase === 2 ? phase2Body() : later}
    <div class="card">
      <p class="field" style="margin-top:0">Your scan</p>
      <p class="lede" style="margin:0">Your results exactly as the machine printed them. Reading a scan file automatically is not connected, so enter the numbers.</p>
      <a class="btn ghost" href="#/app/scan" style="margin-top:12px;display:block">ENTER A SCAN</a>
      <a class="btn ghost" href="#/app/factory" style="margin-top:8px;display:block">OPEN YOUR FACTORY</a>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Learn</p>
      <p class="lede" style="margin:0">${phase === 1 ? "Basic macros and Your body lessons live in your phase library." : phase === 2 ? "Every Phase 2 lesson in one list." : "Open the lessons for this phase."}</p>
      <a class="btn ghost" href="#/app/videos/${phase}" style="margin-top:12px;display:block">OPEN PHASE VIDEOS</a>
    </div>
    ${legal()}
  `);
}

function factory() {
  const fat = Number(state.scan.bodyFat || 28);
  const vis = Number(state.scan.visceral || 12);
  const scale = 1 + (fat - 15) / 80;
  return phone(
    `
    <p class="phase-tag">Phase ${Number(state.phase) || 1}</p>
    <h2 class="display">THIS IS YOUR FACTORY.</h2>
    <p class="lede">Built from your scan. Not a stock photo, not a guess — your height, your weight, your numbers.</p>
    <p class="fine">FRONT / SCAN 001</p>
    <div class="body-stage">
      <div class="sil" style="transform:scale(${scale})">
        <div class="arm l"></div><div class="arm r"></div>
        <div class="head"></div>
        <div class="torso"><div class="gut" style="opacity:${0.25 + vis / 30};height:${28 + vis * 1.4}%"></div></div>
        <div class="legs"><div class="leg"></div><div class="leg"></div></div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><span class="field" style="margin:0">Body fat</span><b>${fat}%</b></div>
      <div class="stat"><span class="field" style="margin:0">Visceral fat</span><b>${vis}</b></div>
    </div>
    <p class="fine">The scales told you ${escapeHtml(state.scan.weight || state.weight)} kilos. They could not tell you where it sits. The ember is the fat packed around your organs — that is the part Phase 2 goes after.</p>
    <div class="card"><strong>FOOD · MACROS</strong><p class="fine">Protein, fat, and the carbs you are about to stop sending in. What comes through the loading bay decides what the whole factory runs on.</p></div>
    <p class="field">What happens now</p>
    <div class="card">
      <strong>BLOOD KETONES</strong>
      ${Number(state.phase) >= 2
        ? `<p class="fine">Keep testing whenever you like. The more readings you log, the clearer the picture of the factory switching fuel.</p>
      <a class="btn" href="#/app/ketones/2">LOG A READING</a>`
        : `<p class="fine">Eat the way you eat now and test whenever you like, as often as you like. Try one after a sugary meal, one after a big feed, one first thing. Watch what the number does. That is your before-photo.</p>
      <a class="btn" href="#/app/ketones/1">LOG A READING</a>`}
    </div>
  `,
    "home"
  );
}

function scan() {
  const fields = [
    ["height", "Height", "cm"],
    ["waist", "Waist circumference", "cm"],
    ["hips", "Hip circumference", "cm"],
    ["weight", "Weight", "kg"],
    ["bmi", "BMI", ""],
    ["bodyFat", "Body fat %", "%"],
    ["smm", "Skeletal muscle mass (SMM)", "kg"],
    ["visceral", "Visceral fat", "level"],
  ];
  return phone(
    `
    <p class="phase-tag">Phase 1 · Kit</p>
    <h2 class="display">YOUR SCAN NUMBERS.</h2>
    <p class="lede">Photograph every screen the machine gives you and we will read the numbers off it. Or type them in yourself.</p>
    <div class="row-btns"><button class="btn ghost">TAKE PHOTO</button><button class="btn ghost">UPLOAD</button></div>
    ${fields
      .map(
        ([k, label, unit]) => `
      <div class="kit-row">
        <div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div>
        <div><label class="field" style="margin-top:0">${label}</label><input data-scan="${k}" value="${escapeAttr(state.scan[k] || "")}" /></div>
        <span class="fine">${unit}</span>
      </div>`
      )
      .join("")}
    <p class="fine">BMI is on the page because the machine prints it. The program still tells you to put the scales in the cupboard.</p>
    <button class="btn" style="margin-top:16px" data-act="save-scan">SAVE MY SCAN</button>
    <a class="btn ghost" href="#/app/factory" style="margin-top:8px;display:block">SEE THE FACTORY</a>
  `,
    "home"
  );
}

function kitLesson(slug) {
  if (slug === "ketone-meter") return ketoneMeter();
  if (slug === "fish-oil") return fishOil();
  if (slug === "magnesium") return magnesium();
  if (slug === "smart-watch") return smartWatch();
  if (slug === "gym-membership") return gymMembership();
  if (slug === "body-scan") return bodyScan();
  if (slug === "mineralised-salt" || slug === "baja-salt") return mineralisedSalt();
  const item = kitItem(slug);
  if (!item) return login();
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">${item.name.toUpperCase()}.</h2>
    <div class="lesson-pending">
      <p class="etk">BEING MADE</p>
      <p>Still being filmed. When it lands it tells you which one to buy and what the factory needs it for, the same as the others.</p>
    </div>
    <p class="fine">Nothing is held up by a lesson that does not exist yet. Tick this off whenever it is in your hands.</p>
    <button class="btn" data-watch="${item.id}">GOT IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/my-body/1" style="margin-top:8px;display:block">BACK TO THE KIT</a>
    ${legal()}
  `,
    "videos"
  );
}

function bodyScan() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">YOUR BODY SCAN.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-body-scan.mp4"></video>
    <p class="fine">1:08</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>A MIRROR ONLY SHOWS THE PAINT</strong>We are not after a picture of the outside. We are after a picture of the inside. That is what the scan is for.</li>
      <li><strong>WHAT IT ACTUALLY SHOWS</strong>The warehouse around the organs, the size of the engine, and what is really holding the place up.</li>
      <li><strong>FOUNDATIONS, NOT THE MIRROR</strong>A good body is not built by chasing the glass. It is built on the fuel, the pipes, the quiet systems and the habit of showing up.</li>
      <li><strong>INSIDE FIRST, OUTSIDE FOLLOWS</strong>When the inside is reset and running clean, the outside starts to change. That is the order, and it is that way round.</li>
      <li><strong>IT IS A BASELINE, NOT A GRADE</strong>The starting picture of your factory, so every phase runs on real numbers instead of a feeling in the glass.</li>
      <li><strong>DO NOT TREAT IT LIKE A SCORE</strong>Treat it like the blueprint. It is the plan of the place, not a mark out of ten.</li>
      <li><strong>EDUCATION, NOT VANITY</strong>Learn the factory. Then run it.</li>
    </ul>
    <button class="btn" data-watch="scan">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/scan" style="margin-top:8px;display:block">ENTER MY SCAN</a>
    <a class="btn ghost" href="#/app/my-body/1" style="margin-top:8px;display:block">BACK TO THE KIT</a>
    ${legal()}
  `,
    "videos"
  );
}

function gymMembership() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">GYM MEMBERSHIP.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-gym-membership.mp4"></video>
    <p class="fine">1:16</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>SHOWING UP IS THE FIRST JOB</strong>The membership is not a twelve week plan. It is a place to build the habit of walking onto the floor.</li>
      <li><strong>NOT A LIFTING PROGRAM</strong>The scan usually shows a big engine already there. It does not need heavy loads yet. It needs to run on the right fuel first.</li>
      <li><strong>THAT IS THE REBUILD</strong>You show up, you keep the engine in zone two, and you let the cells grow more power plants.</li>
      <li><strong>INSIDE, NOT OUTSIDE</strong>We are not painting the outside of the factory. We are resetting how it runs on the inside: the pipes, the fuel, the quiet systems.</li>
      <li><strong>THE SAUNA IS HEAT WORK</strong>Heat makes the factory open the drains and move old waste out of the systems. Sweat is one of the ways the place clears what it no longer needs.</li>
      <li><strong>NOT A MIRACLE</strong>It is another steady tool, the same as the rest of them.</li>
      <li><strong>THE OUTSIDE FOLLOWS</strong>When the habit is solid and the engine is running clean, the outside starts to match. Not because of a short plan. Do not chase a twelve week transformation.</li>
    </ul>
    <button class="btn" data-watch="gym">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/my-body/1" style="margin-top:8px;display:block">BACK TO THE KIT</a>
    ${legal()}
  `,
    "videos"
  );
}

function smartWatch() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">YOUR SMART WATCH.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-smart-watch.mp4"></video>
    <p class="fine">1:14</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>EVERY ENGINE NEEDS A GAUGE</strong>The heart rate monitor is that gauge. It shows you how hard the factory is working, in real time.</li>
      <li><strong>ZONE TWO IS THE STEADY CRUISE</strong>Not a sprint and not a max effort. A pace where you can still talk.</li>
      <li><strong>WHAT THE ZONE BUILDS</strong>In there the factory learns to burn fat cleanly, and the cells grow more of their own power plants. More engines inside the cells. That is how fat adaptation gets built.</li>
      <li><strong>QUIET, STEADY, REPEATED</strong>That is the whole method. It is not meant to feel like much.</li>
      <li><strong>PHASE 1 IS NOT A LIFTING PROGRAM</strong>The scan usually shows a big engine already there. It does not need new heavy loads yet. It needs to run on the right fuel.</li>
      <li><strong>YOUR JOB IS TO SHOW UP</strong>Walk, easy bike, light movement that keeps the gauge in the right range. Build the habit.</li>
      <li><strong>WEIGHTS COME LATER</strong>Structured weights come in once the factory is adapted. Not now. Do not chase a personal best and do not turn Phase 1 into a bodybuilding plan.</li>
    </ul>
    <button class="btn" data-watch="watch">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
    ${legal()}
  `,
    "videos"
  );
}

function magnesium() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">MAGNESIUM GLYCINATE.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-magnesium.mp4"></video>
    <p class="fine">1:21</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>THE OFF SWITCH</strong>Some machines need a quiet off switch. Magnesium is that switch for muscle, for nerves, and for the night shift.</li>
      <li><strong>THE DOCK CHANGES FAST</strong>Drop the sugar and the flour and the loading dock changes quickly. The pipes can run short on minerals for a few days.</li>
      <li><strong>RESTLESS LEGS, TIGHT CALVES</strong>That is why some men get them early on. It is not a broken engine. It is a short mineral load while the factory switches fuel.</li>
      <li><strong>WHY GLYCINATE</strong>It is the form we use because it is gentle on the gut, and it carries glycine with it.</li>
      <li><strong>A TOP-UP, NOT A SEDATIVE</strong>It helps the off switch work while the pipes settle. It is not a sedative and it is not a prescription.</li>
      <li><strong>DO NOT CHASE A DOSE</strong>It is one of the quiet minerals the factory uses every day. Not a brand, not a big number, not medicine.</li>
      <li><strong>THE BODY ALREADY KNOWS HOW TO REST</strong>Your job is to stop a short mineral load from keeping the machines on.</li>
    </ul>
    <button class="btn" data-watch="mag">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
    ${legal()}
  `,
    "videos"
  );
}

function fishOil() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">FISH OIL.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-fish-oil.mp4"></video>
    <p class="fine">1:21</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>THE WALLS OF THE MACHINES</strong>Every machine is built from parts that come through the loading dock. The walls, the membranes, need two kinds of oil in balance: omega six and omega three.</li>
      <li><strong>THE FLOOD</strong>Seed oils flood the dock with omega six. Soy, canola, sunflower, corn.</li>
      <li><strong>STIFF AND NOISY</strong>Too much of one oil and the walls get stiff and noisy, and the alarm starts to ring. That is inflammation.</li>
      <li><strong>THE OTHER SIDE</strong>Fish oil brings EPA and DHA, the long chain oils the brain and the organs prefer for quiet, steady work.</li>
      <li><strong>TURN OFF THE TAP FIRST</strong>You cannot out-supplement a flood. Throw the seed oil bottle out and stop the excess at the dock. Then a simple top-up helps restock the membranes while the factory rebuilds.</li>
      <li><strong>QUIET AND STEADY</strong>The membranes of long-lived cells take time to turn over. That is why this work is slow and steady rather than a quick fix.</li>
      <li><strong>NOT A MAGIC BOTTLE</strong>Do not chase a brand and do not treat fish oil like medicine. It is the missing oil the dock stopped delivering when the seed oils took over.</li>
    </ul>
    <button class="btn" data-watch="fish">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
    ${legal()}
  `,
    "videos"
  );
}

function ketoneMeter() {
  return phone(
    `
    <p class="phase-tag">Phase 1 &middot; The kit</p>
    <h2 class="display">YOUR KETONE METER.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-ketone-meter.mp4"></video>
    <p class="fine">1:30</p>
    <p class="field">What the lesson covers</p>
    <ul class="points">
      <li><strong>THE DOCK GOES QUIET</strong>The machines still need power when no new fuel is coming in. The work does not stop. Head office puts the call out: release stored fat.</li>
      <li><strong>THE FIRST WAREHOUSE</strong>The fat sitting closest to the blood pipes is the fat wrapped around the organs. That is the first warehouse to open.</li>
      <li><strong>THE PROCESSING STATION</strong>Fat leaves the depot into the corridor, and the liver turns some of it into ketones: a clean fuel the brain and organs can use.</li>
      <li><strong>THE GAUGE ON THE PIPE</strong>The meter does not measure how much fat you have left. It measures that fat is being broken down right now.</li>
      <li><strong>A LOW READING IS NOT A BROKEN FACTORY</strong>On the diet you eat today a low number is the honest starting point. That is why we take the baseline first, so every later reading has something to be compared against.</li>
      <li><strong>WHAT WE ARE ACTUALLY AFTER</strong>Not a number on a scale. The warehouse around the organs. The meter tells us that warehouse is moving.</li>
      <li><strong>THE TREND, NOT THE READING</strong>One lucky high number is not the story. Watch the pattern over days. The factory is learning to run on its own stores.</li>
    </ul>
    <button class="btn" data-watch="ketones">WATCHED IT &mdash; UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/ketones/1" style="margin-top:8px;display:block">OPEN YOUR READINGS</a>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
    ${legal()}
  `,
    "videos"
  );
}

function mineralisedSalt() {
  return phone(
    `
    <p class="phase-tag">Phase 1 · The kit</p>
    <h2 class="display">MINERALISED SALT.</h2>
    <video class="lesson-video" controls preload="metadata" playsinline
           src="./assets/phase1-mineralised-salt.mp4"></video>
    <p class="fine">1:44</p>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>THE PIPES</strong>Everything that comes in at the loading dock ends up in the pipes. They carry what the machines need to keep running.</li>
      <li><strong>STRIPPED CLEAN</strong>Table salt is sodium chloride and nothing else. Every other mineral has been taken out of it. That is what most men put on their food every day.</li>
      <li><strong>WHAT SURVIVES</strong>Grey Celtic salt off the Atlantic, or Baja sea salt out of the Sea of Cortez. Both still carry the small minerals the factory uses every day.</li>
      <li><strong>WHEN THE DOCK CHANGES</strong>Drop the sugar and the flour and insulin drops with them. The kidneys open the drains, and water and sodium go out first.</li>
      <li><strong>DRY PIPES, NOT A BROKEN ENGINE</strong>The headache and the tight calves in the first few days are the pipes running dry. The factory is still running. It just needs the pipes kept full while it changes fuel.</li>
      <li><strong>THE PINCH</strong>A pinch on your food, or a pinch in water. No big dose and no protocol. Keep the corridor full and let the factory do the rest.</li>
      <li><strong>NOT MEDICINE</strong>Do not chase a number on the scale, and do not treat salt like a dose. It is the top-up the pipes need when the loading dock changes.</li>
    </ul>
    <button class="btn" data-watch="baja">WATCHED IT — UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
    ${legal()}
  `,
    "videos"
  );
}

function videos(phase) {
  if (phase === 2) {
    return phaseShell("Videos", "videos", phase, `
    <p class="lede">The films for Phase 2 are being made. Every lesson is here to read in the meantime.</p>
    ${lessonRows()}
  `);
  }
  const list = LESSONS[phase - 1] || [];
  const rows = list.map((title) => `
      <div class="kit-row">
        <div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">&#9655;</span></div>
        <div>${title}${title === "Mineralised salt" ? '<div class="fine"><a href="#/app/kit/mineralised-salt">Open the lesson</a></div>' : title === "Your ketone meter" ? '<div class="fine"><a href="#/app/kit/ketone-meter">Read the lesson</a></div>' : ""}</div>
        <span class="fine">Coming soon</span>
      </div>`).join("");
  return phaseShell("Videos", "videos", phase, `
    <p class="lede">Your phase library. Videos appear here when they are ready.</p>
    ${rows}
  `);
}

/* When a Phase 1 reading was taken. He picks one; it is a note, not a rule. */
const WHEN = ["Any time", "First thing", "After a sugary meal", "After a big feed", "Before bed"];

/* The meter form both phases share. */
function readingForm() {
  return `
    <label class="field">Your reading (mmol/L)</label>
    <input id="mmol" inputmode="decimal" placeholder="e.g. 0.1" />
    <label class="field">When did you test?</label>
    <select id="mmol-when">${WHEN.map((w) => `<option>${w}</option>`).join("")}</select>
    <button class="btn" style="margin-top:12px" data-act="log-ketone">SAVE READING</button>
    <p class="fine" id="mmol-msg" role="status"></p>`;
}

/* Every reading in a phase, numbered in the order he took them. */
function readingRows(phase) {
  const list = readingsFor(phase);
  return `
    <p class="badge" style="margin-top:16px">${list.length} LOGGED</p>
    ${list.map((k, i) => `
      <div class="kit-row">
        <div class="check on">${i + 1}</div>
        <div>${escapeHtml(k.mmol)} mmol/L${k.when ? ` · ${escapeHtml(k.when)}` : ""}<div class="fine">${new Date(k.at).toLocaleString()}</div></div>
        <span></span>
      </div>`).join("")}`;
}

function ketones(phase) {
  if (phase === 2) return phaseShell("Ketones", "ketones", phase, phase2Ketones());
  return phaseShell("Ketones", "ketones", phase, `
    <p class="lede">${phase === 1
      ? "Your starting picture. Test whenever you like, as often as you like, on the diet you eat now. After a sugary meal. After a big feed. First thing, last thing, whenever you are curious. On the old diet the number usually sits low, around 0.0 to 0.2 mmol/L. That is not a failure. It is the honest before-photo, and the more readings you log, the sharper it gets."
      : "Your meter readings, kept in one place."}</p>
    ${readingForm()}
    ${readingRows(1)}
    <p class="fine">A reading is a fact about right now, not a score. The dial is a scale, not a target.</p>
    <a class="btn ghost" href="#/app/kit/ketone-meter" style="margin-top:12px;display:block">WATCH: YOUR KETONE METER</a>
  `);
}

function shop() {
  return phone(`
    <p class="phase-tag">YOUR KIT</p>
    <h2 class="display">SHOP.</h2>
    <p class="lede">Take a look at the proposed Carnivore Dads range. Products and prices are indicative, and orders are not open yet. Your health record stays in this app.</p>
    ${SHOP.map(([name, price]) => `<div class="kit-row"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div><div>${name}</div><strong>$${price}</strong></div>`).join("")}
    <a class="btn ghost" href="#/app/my-body" style="margin-top:16px;display:block">BACK TO YOUR KIT</a>
    <a class="btn ghost" href="#/app/videos" style="margin-top:8px;display:block">VIEW THE GUIDES</a>
  `, "shop");
}

function account() {
  const a = state.address || {};
  const name = COUNTRIES.find((c) => c[0] === state.country)?.[1];
  return phone(`
    <p class="phase-tag">YOUR FILE</p>
    <h2 class="display">ACCOUNT.</h2>
    <p class="lede">What the app knows about you. It is kept on this phone and nowhere else.</p>
    <div class="card">
      <div class="file-row"><span>Trade</span><b>${escapeHtml(state.occupation || "Not set")}</b></div>
      <div class="file-row"><span>Height</span><b>${escapeHtml(state.height || "--")} cm</b></div>
      <div class="file-row"><span>Weight</span><b>${escapeHtml(state.weight || "--")} kg</b></div>
      <div class="file-row"><span>Country</span><b>${name}</b></div>
      <p class="fine">Your trade and numbers come from Start your reset. Your country is set on the login screen.</p>
    </div>
    <div class="split" style="margin-top:22px"><span class="field" style="margin:0">Delivery</span><span class="badge">WHEN THERE IS SOMETHING TO POST</span></div>
    <label class="field">Email</label><input id="email" value="${escapeAttr(state.email)}" placeholder="you@email.com" />
    <label class="field">Street address</label><input id="street" value="${escapeAttr(a.street || "")}" />
    <label class="field">Suburb</label><input id="suburb" value="${escapeAttr(a.suburb || "")}" />
    <div class="stat-grid">
      <div><label class="field">State</label><input id="region" value="${escapeAttr(a.state || "")}" /></div>
      <div><label class="field">Postcode</label><input id="postcode" value="${escapeAttr(a.postcode || "")}" /></div>
    </div>
    <label class="fine" style="display:flex;gap:8px;align-items:flex-start;margin-top:12px">
      <input id="localAds" type="checkbox" ${a.localAds ? "checked" : ""} style="width:18px" />
      Show me gyms and butchers near me. Off by default.
    </label>
    <button class="btn" style="margin-top:18px" data-act="save-account">SAVE DETAILS</button>
    ${installCard()}
    <a class="btn ghost" href="#/" style="margin-top:10px;display:block">BACK TO LOG IN</a>
    ${legal()}
  `, "account");
}

/* --- The app ------------------------------------------------------------
   The website and the app are the same thing: installing puts the site on
   his home screen with its own icon, full screen, no browser bar. */

let installPrompt = null; // Android hands this over when the site can be installed
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  if (location.hash === "#/app/account") render();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  if (location.hash === "#/app/account") render();
});

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}

function installCard() {
  const iphone = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const body = isInstalled()
    ? `<p class="lede" style="margin:0">You are in the app. Everything you do here is the same as on the website.</p>`
    : installPrompt
      ? `<p class="lede" style="margin:0">Put Carnivore Dads on your home screen. It opens full screen with its own icon, like any other app.</p>
         <button class="btn" data-act="install" style="margin-top:12px">INSTALL THE APP</button>`
      : iphone
        ? `<p class="lede" style="margin:0">Open this page in Safari, tap the Share button, then <b>Add to Home Screen</b>.</p>`
        : `<p class="lede" style="margin:0">In Chrome, tap the <b>&#8942;</b> menu, then <b>Install app</b> or <b>Add to Home screen</b>.</p>`;
  return `
    <div class="card" style="margin-top:22px">
      <p class="field" style="margin-top:0">Get the app</p>
      ${body}
    </div>`;
}

/* ---------------------------------------------------------------------------
   Phase 2: The switch.

   The factory changes fuel. The dock stops taking sugar and flour, and the
   factory learns to run on what is already in the warehouse. It is about
   knowing why: four lessons, and the meter whenever he is curious. Phase 3
   stays locked until the four are ticked off, so nobody gets ahead.
--------------------------------------------------------------------------- */


/* Readings saved before phases were tracked belong to Phase 1. */
function readingsFor(phase) {
  return (state.ketones || []).filter((k) => (k.phase || 1) === phase);
}

/* Phase 1 -> 2. */
function gate2() {
  // Phase 2 opens when every box in What you need is ticked.
  const items = KIT.map((k) => ({ ok: !!state.owned[k.id], label: k.name, note: state.owned[k.id] ? "Ticked" : "Not ticked yet" }));
  return { items, met: items.every((i) => i.ok) };
}

/* Phase 2 -> 3. Knowledge, not numbers: every Phase 2 lesson ticked off. */
function gate3() {
  const items = PHASE2_LESSONS.map((l) => ({
    ok: !!(state.done2 || {})[l.slug],
    label: l.title,
    note: (state.done2 || {})[l.slug] ? "Done" : "Not done yet",
    href: `#/app/lesson/2/${l.slug}`,
  }));
  const done = items.filter((i) => i.ok).length;
  return { done, items, met: items.every((i) => i.ok) };
}

function gateList(items) {
  return items
    .map(
      (i) => `
      <${i.href && !i.ok ? `a href="${i.href}"` : "div"} class="gate-row ${i.ok ? "ok" : ""}">
        <span class="check ${i.ok ? "on" : ""}">${i.ok ? "✓" : ""}</span>
        <span>${i.label}<span class="fine">${escapeHtml(i.note)}</span></span>
      </${i.href && !i.ok ? "a" : "div"}>`
    )
    .join("");
}

function gate2Card() {
  const g = gate2();
  if (Number(state.phase) >= 2) {
    return `
    <div class="card gate-card">
      <p class="field" style="margin-top:0">Phase 1 gate</p>
      <p class="lede" style="margin:0">Met. Phase 2 is open.</p>
      <a class="btn ghost" href="#/app/my-body/2" style="margin-top:12px;display:block">GO TO THE SWITCH</a>
    </div>`;
  }
  return `
    <div class="card gate-card">
      <p class="field" style="margin-top:0">What opens Phase 2</p>
      ${gateList(g.items)}
      ${g.met
        ? `<button class="btn" data-act="unlock-2" style="margin-top:8px">UNLOCK PHASE 2: THE SWITCH</button>`
        : `<p class="fine" style="margin-bottom:0">Tick every box in What you need and Phase 2 opens.</p>`}
    </div>`;
}

function gate3Card() {
  const g = gate3();
  return `
    <div class="card gate-card">
      <p class="field" style="margin-top:0">What opens Phase 3</p>
      ${gateList(g.items)}
      ${g.met
        ? `<p class="lede" style="margin:8px 0 0">All four done. The liver is next, and the Phase 3 lessons are being built. Keep testing whenever you like: every reading adds to what you know.</p>`
        : `<p class="fine" style="margin-bottom:0">Tick off all four lessons and Phase 3 opens. Take your time with them. The point is to understand the switch, not to race it.</p>`}
    </div>`;
}

function parseMmol(raw) {
  const n = Number(String(raw).replace(",", ".").trim());
  if (!raw || !isFinite(n) || n < 0 || n > 10) return null;
  return Math.round(n * 10) / 10;
}

/* --- Screens ------------------------------------------------------------ */

/* The Switch opens the way Phase 1 does: the intro film at the top, then the
   lessons as a list he ticks off, then the rest of the phase's work. */
const PHASE2_INTRO_VIDEO = null; // "phase2-intro.mp4" once it is filmed

function phase2Body() {
  const vis = state.scan.visceral;
  const done = PHASE2_LESSONS.filter((l) => (state.done2 || {})[l.slug]).length;
  return `
    <div class="card intro-card">
      <p class="field" style="margin-top:0">Start here</p>
      <h3 class="intro-title">CHANGE THE FUEL.</h3>
      ${PHASE2_INTRO_VIDEO
        ? `<video class="lesson-video" controls preload="metadata" playsinline src="./assets/${PHASE2_INTRO_VIDEO}"></video>`
        : `<div class="lesson-pending"><p class="etk">FILM BEING MADE</p><p>The intro film for The Switch is still being made.</p></div>`}
      <p class="lede" style="margin:10px 0 0">Phase 1 was the before-photo. Phase 2 is where the factory changes fuel. The loading dock stops taking sugar, and the cells learn to run on what is already stocked in the warehouse. Four lessons below. Tick them all off and Phase 3 opens.</p>
    </div>
    <div class="split"><span class="field" style="margin:0">Your lessons</span><span class="badge">${done} / ${PHASE2_LESSONS.length}</span></div>
    ${lessonRows()}
    <div class="card warn-card" style="margin-top:22px">
      <p class="field" style="margin-top:0">Before you switch</p>
      <p class="lede" style="margin:0">If you take anything for blood sugar or blood pressure, or your GP has told you a medicine depends on what you eat, see your GP <b>before</b> you change fuel. Changing what comes through the dock changes how those medicines land. Your GP owns your medicine. We do not.</p>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">The first few days</p>
      <p class="lede" style="margin:0">Headache, flat, tight calves. That is the pipes running dry while the factory changes fuel, not a broken engine. Keep the salt and the magnesium going and eat until you are full. This is a fuel change, not a diet.</p>
      <div class="row-btns" style="margin-top:12px">
        <a class="btn ghost small" href="#/app/kit/mineralised-salt">SALT</a>
        <a class="btn ghost small" href="#/app/kit/magnesium">MAGNESIUM</a>
      </div>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Your ketone readings</p>
      <p class="lede" style="margin:0">Test whenever you like, as often as you like. Watch the number move as the factory changes fuel.</p>
      <a class="btn ghost" href="#/app/ketones/2" style="margin-top:12px;display:block">LOG A READING</a>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Your warehouse</p>
      <div class="split"><span class="lede" style="margin:0">Visceral fat, from your scan</span><b class="big-num">${escapeHtml(vis || "--")}</b></div>
      <p class="fine">The fat packed around the organs. It sits closest to the pipes, so it is the first warehouse to open when the dock goes quiet. This is the part Phase 2 goes after.</p>
      <a class="btn ghost" href="#/app/lesson/2/visceral-fat" style="margin-top:4px;display:block">WHAT THIS NUMBER MEANS</a>
    </div>
    ${gate3Card()}`;
}

/* Same row as the Phase 1 kit: tick, name and hint, then the CD plate that
   opens the lesson. The plate only says WATCH when there is a film. */
function lessonRows() {
  return PHASE2_LESSONS.map((l) => {
    const done = !!(state.done2 || {})[l.slug];
    const mark = l.video ? "WATCH" : "READ";
    return `
      <div class="kit-row">
        <span class="check ${done ? "on" : ""}" aria-label="${done ? "Done" : "Not done"}">${done ? "✓" : ""}</span>
        <div>${l.title}<div class="fine">${done ? "Done. Open it again any time." : l.sub}</div></div>
        <a href="#/app/lesson/2/${l.slug}" class="kit-plate-link" aria-label="${mark === "WATCH" ? "Watch" : "Read"} ${l.title}"><span class="kit-plate"><span class="cd-plate"><span>CD</span></span><small>${mark}</small></span></a>
      </div>`;
  }).join("");
}

function phase2Ketones() {
  return `
    <p class="lede">Test whenever you like, as often as you like. First thing, after a big feed, after a slip-up, before bed. There is no number to hit. Each reading shows you the factory switching fuel, and that is the whole point.</p>
    ${readingForm()}
    ${readingRows(2)}
    <p class="fine">Things that scramble a reading: ketone drinks, a big fast then a steak, a bad night, being crook, and some diabetes medicines. A reading means fat is on duty right now. Nothing more.</p>
    ${gate3Card()}`;
}

/* Old lesson addresses from the first cut of Phase 2, folded into the four. */
const LESSON_ALIASES = { "the-switch": "sugar", alcohol: "sugar", "basic-macros": "macros", "zone-training": "cells" };

function lesson(phase, slug) {
  slug = LESSON_ALIASES[slug] || slug;
  const all = [...PHASE2_LESSONS, ...PHASE2_EXTRA];
  const l = all.find((x) => x.slug === slug);
  if (phase !== 2 || !l || Number(state.phase) < 2) return myBody(null);
  const i = PHASE2_LESSONS.indexOf(l);
  const main = i >= 0;
  const next = main ? PHASE2_LESSONS[i + 1] : null;
  const done = !!(state.done2 || {})[l.slug];
  return phone(
    `
    <a class="linkish phase-back" href="#/app/my-body/2">&lsaquo; THE SWITCH</a>
    <p class="phase-tag">Phase 2 &middot; ${main ? `Lesson ${i + 1} of ${PHASE2_LESSONS.length}` : "Your scan"}</p>
    <h2 class="display">${l.title.toUpperCase()}.</h2>
    ${l.video
      ? `<video class="lesson-video" controls preload="metadata" playsinline src="./assets/${l.video}"></video>`
      : `<div class="lesson-pending"><p class="etk">FILM BEING MADE</p><p>The video for this one is still being made. Everything it will say is below.</p></div>`}
    <p class="field">What the ${l.video ? "video" : "lesson"} covers</p>
    <ul class="points">
      ${(typeof l.points === "function" ? l.points() : l.points).map(([h, t]) => `<li><strong>${h}</strong>${t}</li>`).join("")}
    </ul>
    ${main
      ? done
        ? `<p class="fine">Ticked off.</p>${next ? `<a class="btn" href="#/app/lesson/2/${next.slug}" style="margin-top:8px;display:block">NEXT: ${next.title.toUpperCase()}</a>` : ""}`
        : `<button class="btn" data-done2="${l.slug}" data-next="${next ? next.slug : ""}">${l.video ? "WATCHED IT" : "READ IT"} &mdash; TICK IT OFF</button>`
      : ""}
    <a class="btn ghost" href="#/app/my-body/2" style="margin-top:8px;display:block">BACK TO THE SWITCH</a>
    ${legal()}
  `,
    "videos"
  );
}

/* video is the file in assets/ once it is filmed, e.g. "phase2-sugar.mp4". */
const PHASE2_LESSONS = [
  {
    slug: "sugar",
    title: "Sugar",
    sub: "What stops coming through the dock, and why",
    video: null,
    points: [
      ["THE DOCK STOPS TAKING SUGAR", "Sugar, bread, pasta, rice, cereal, potatoes and juice stop coming through the loading dock. Meat, eggs, fish and butter keep coming."],
      ["SUGAR WEARS DISGUISES", "Bread, rice and pasta are not sweet, but by the time they reach the pipes they are sugar all the same. The dock cannot tell a slice of toast from a spoon of sugar."],
      ["THE NO NEW LOAD CALL", "With no sugar arriving, insulin falls. The gate on the warehouse opens and head office makes the call: run on what is in stock."],
      ["THE FIRST WEEK IS NOISY", "Headache, flat, short-tempered, tight calves. That is the pipes running dry while the factory changes fuel. Salt and magnesium keep them full. It passes."],
      ["BEER IS LIQUID BREAD", "Beer brings sugar and alcohol through the dock together. The liver clears alcohol before anything else, and that includes making ketones. A Friday night prints on Monday's meter."],
      ["YOUR GP STAYS IN THE LOOP", "If you take anything for blood sugar or blood pressure, see your GP before you switch. Changing fuel changes how those medicines land. That is their call, not ours."],
    ],
  },
  {
    slug: "macros",
    title: "Macros",
    sub: "Protein, fat, and how much to eat",
    video: null,
    points: [
      ["PROTEIN IS THE BUILDING MATERIAL", "Every machine in the factory is built and repaired from what protein brings in. Every plate starts with meat, fish or eggs."],
      ["FAT IS THE FUEL", "The fat that comes with the meat is what the factory runs on now. Do not trim it off and do not fear butter."],
      ["CARBS ARE THE FUEL YOU STOP SENDING", "Not banned for life. They are instant fuel for athletes on the clock, not for a dad running a steady day. They come back in Phase 4, on purpose, once the factory knows how to switch."],
      ["FULL, THEN STOP", "No weighing, no counting grams in an app. Eat until you are full and stop there."],
      ["DO NOT STARVE THE FACTORY", "This is a fuel change, not a calorie cut. Going very low on food scrambles the meter and makes the switch harder, not faster."],
      ["THE FAMILY TABLE", "Same meat as everyone else at the table. You do not need your own kitchen. Leave the bread and the potatoes for them and double up on what is on the board."],
    ],
  },
  {
    slug: "gut-health",
    title: "Gut health",
    sub: "The loading dock while the load changes",
    video: null,
    points: [
      ["THE DOCK GETS A NEW LOAD", "Change what comes in and the crew on the loading dock has to change with it. A few weeks of the gut being slow, loose or unsettled is the dock adjusting, not a fault."],
      ["AMINO ACIDS ARE STRUCTURE", "The dock breaks protein down into amino acids: the parts list every machine in the factory is built from."],
      ["CHOLESTEROL BUILDS WALLS AND BILE", "Cholesterol goes into the walls of every cell, and into bile, which the dock uses to break fat down. More fat coming in means more bile called for."],
      ["EASE THE FAT IN", "If the dock is struggling, bring the fat up over a week or two rather than overnight. Fat from the meat first, then butter."],
      ["SEED OILS STAY OUT", "Cook in butter, tallow or the fat off the meat. The seed oil bottle went in the bin in Phase 1. It stays there."],
      ["IF IT DOES NOT SETTLE", "Blood, real pain, or a gut that has not settled after a couple of weeks is a job for your GP, not for us. Go."],
    ],
  },
  {
    slug: "cells",
    title: "Cells",
    sub: "The power plants, and teaching them the new fuel",
    video: null,
    points: [
      ["EVERY CELL HAS POWER PLANTS", "Inside each cell are small power plants that turn fuel into the energy the machines run on. They can burn sugar or fat."],
      ["TWO FUELS", "Sugar burns fast and runs out fast. Fat, and the ketones the liver makes from it, burn steady. A busy dad needs steady."],
      ["RELEARNING THE FUEL", "After years of sugar the power plants have forgotten how to run on fat. The switch is them relearning. That is why the first week feels flat."],
      ["ZONE TWO GROWS MORE PLANTS", "Easy, steady work at a pace where you can still talk. Three or four sessions a week is plenty to start, and a brisk walk counts. That is when the cells build more power plants."],
      ["WEIGHTS STILL WAIT", "Structured lifting comes in Phase 4, on an engine that already runs on fat. Do not turn the switch into a bodybuilding block."],
      ["THE METER READS THE FUEL", "A ketone reading tells you the cells are being fed from fat right now. That is the switch, on a screen."],
    ],
  },
];

/* Lesson pages that are not on the list: opened from a card instead. */
const PHASE2_EXTRA = [
  {
    slug: "visceral-fat",
    title: "Visceral fat",
    video: null,
    points: () => [
      ["TWO KINDS OF STORE", "The fat you can pinch sits under the skin. Visceral fat is packed in around the organs: the hard belly that pushes the belt out. They are not the same store."],
      ["THE FIRST WAREHOUSE", "Visceral fat sits closest to the pipes, so it is the first warehouse that opens when the dock goes quiet. It is what Phase 2 goes after."],
      ["YOUR NUMBER", state.scan.visceral ? `Your scan put your visceral fat at ${escapeHtml(state.scan.visceral)}. That is your starting line. It is a number from a machine, not a grade.` : "Your scan does not have a visceral number saved. Some machines do not print one. Add it if yours does."],
      ["THE BELT, NOT THE SCALES", "The scales cannot tell the two stores apart. Your waist can. If the belt moves and the scales do not, the factory is doing its job."],
      ["NOT A BEAUTY CONTEST", "An optional second scan comes later, as data. Not a before-and-after photo."],
    ],
  },
];

function adminTop() {
  return `
    <header class="admin-top">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="cd-plate"><span>CD</span></div>
        <div><div style="font-family:Anton,sans-serif;letter-spacing:.06em">CARNIVORE DADS</div><div class="etk" style="margin:0">Admin</div></div>
      </div>
      <nav class="admin-nav">
        <a href="#/admin/clients" class="on">Clients</a>
        <span style="color:#5e594e">Shop orders</span>
        <span style="color:#5e594e">Staff</span>
        <span>Mark T.</span>
        <a href="#/admin">Sign out</a>
      </nav>
    </header>`;
}

function adminLogin() {
  return `
    <div class="admin" style="display:grid;place-items:center;min-height:100vh">
      <div style="width:min(420px, calc(100% - 40px))">
        ${lockup()}
        <p class="etk" style="text-align:center">Staff access · client tracking</p>
        <label class="field">Work email</label><input value="mark@carnivoredads.com" />
        <label class="field">Password</label><input type="password" />
        <label class="field">6-digit code from your authenticator</label><input placeholder="000000" />
        <a class="btn" href="#/admin/clients" style="margin-top:18px;display:block">SIGN IN</a>
        <p class="legal">Admin accounts are invite-only. Every sign-in and every client file opened is logged.</p>
        <p class="fine" style="margin-top:18px"><a href="#/">Dads sign in through the app.</a></p>
      </div>
    </div>`;
}

function clients() {
  return `
    <div class="admin">
      ${adminTop()}
      <div class="admin-body">
        <h2 class="display">CLIENTS MAP</h2>
        <p class="fine">Pinned by delivery suburb · sample data</p>
        <div class="legend"><span><i class="dot ok"></i> On track</span><span><i class="dot gate"></i> Gate ready</span><span><i class="dot miss"></i> No log 5+ days</span></div>
        <div class="map-grid">
          ${CLIENTS.map(
            (c) => `
            <a href="#/admin/clients/${c.id}" class="client-card" style="color:inherit">
              <div class="split"><strong>${c.name}</strong><i class="dot ${c.status}"></i></div>
              <p class="fine">${c.suburb} · ${c.trade}</p>
              <p>Phase ${c.phase} · Day ${c.day}</p>
              <p class="fine">Last log ${c.lastLog}</p>
              <p class="etk">Open client file</p>
            </a>`
          ).join("")}
        </div>
      </div>
    </div>`;
}

function clientFile(id) {
  const c = CLIENTS.find((x) => x.id === id) || CLIENTS[0];
  const phases = ["Knowing your body", "The Switch", "The Liver", "Advanced macros", "The Room"];
  return `
    <div class="admin">
      ${adminTop()}
      <div class="admin-body">
        <a href="#/admin/clients" class="fine">← All clients</a>
        <div class="split" style="margin-top:12px"><h2 class="display">${c.name.toUpperCase()}</h2>${c.status === "miss" ? '<span class="badge">NO LOG 5+ DAYS</span>' : ""}</div>
        <p class="fine">${c.suburb} · ${c.trade} · ${c.country}</p>
        <div class="row-btns" style="margin:16px 0 24px"><button class="btn small">EMAIL ${c.name.split(" ")[0].toUpperCase()}</button><button class="btn small ghost">SEND KETONE NUDGE</button></div>
        <div class="map-grid">
          ${phases
            .map((title, i) => {
              const n = i + 1;
              const st = n < c.phase ? "DONE" : n === c.phase ? `DAY ${c.day}` : "LOCKED";
              return `<div class="card"><div class="etk">Phase ${n} · ${st}</div><strong>${title}</strong></div>`;
            })
            .join("")}
        </div>
        <h3 class="field">Phase 2 → 3 gate</h3>
        <div class="gate-box">
          <div class="stat"><span class="field" style="margin:0">Phase 2 lessons</span><b>${c.lessons2 || "—"}</b><p class="fine">All four ticked off opens Phase 3.</p></div>
          <div class="stat"><span class="field" style="margin:0">Ketone readings</span><b>${c.ketones}</b><p class="fine">Any time he likes. No target.</p></div>
          <div class="stat"><span class="field" style="margin:0">Time in Phase 2</span><b>${c.day} days</b><p class="fine">A guide, not a countdown</p></div>
        </div>
        <h3 class="field">Team notes</h3>
        <div class="card">${c.notes || "No notes yet."}</div>
      </div>
    </div>`;
}

function escapeHtml(s) {
  const map = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;" };
  return String(s).replace(/[&<>"']/g, (c) => map[c]);
}
function escapeAttr(s) {
  return escapeHtml(s || "");
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  if (hash === "/" || hash === "") return login();
  if (hash === "/reset") return reset();
  // The three hub tabs take an optional phase: #/app/my-body opens the picker,
  // #/app/my-body/2 opens phase 2. Anything above the phase he is up to is
  // refused by phaseShell rather than routed to.
  const hub = hash.match(/^\/app\/(my-body|ketones|videos)(?:\/(\d))?$/);
  if (hub) {
    const phase = hub[2] ? Math.min(5, Math.max(1, Number(hub[2]))) : null;
    const open = phase !== null && phase <= (Number(state.phase) || 1) ? phase : null;
    if (hub[1] === "my-body") return myBody(open);
    if (hub[1] === "ketones") return ketones(open);
    return videos(open);
  }
  if (hash === "/app/phase-1") return myBody(1);
  const les = hash.match(/^\/app\/lesson\/(\d)\/([a-z-]+)$/);
  if (les) return lesson(Number(les[1]), les[2]);
  if (hash === "/app/factory") return factory();
  if (hash === "/app/scan") return scan();
  if (hash.startsWith("/app/kit/")) return kitLesson(hash.slice("/app/kit/".length));
  if (hash === "/app/shop") return shop();
  if (hash === "/app/account") return account();
  if (hash === "/admin") return adminLogin();
  if (hash === "/admin/clients") return clients();
  if (parts[0] === "admin" && parts[1] === "clients" && parts[2]) return clientFile(parts[2]);
  return login();
}

function val(id) {
  return document.getElementById(id)?.value || "";
}

function bind() {
  document.querySelectorAll("[data-phase]").forEach((btn) => {
    btn.onclick = () => {
      const want = btn.getAttribute("data-phase");
      const base = location.hash.replace(/^#/, "").replace(/\/\d$/, "");
      location.hash = want === "back" ? "#" + base : "#" + base + "/" + want;
    };
  });
  // A locked phase says why rather than doing nothing.
  document.querySelectorAll("[data-locked]").forEach((btn) => {
    btn.onclick = () => {
      const n = Number(btn.getAttribute("data-locked"));
      const note = document.getElementById("phase-note");
      if (!note) return;
      note.textContent =
        n === 2
          ? "Phase 2 opens when every box in What you need is ticked. Open Phase 1 to see what is left."
          : n === 3
            ? "Phase 3 opens when all four Phase 2 lessons are ticked off."
            : `${n === 5 ? "Graduate" : "Phase " + n} opens after the phase before it.`;
      note.hidden = false;
    };
  });
  document.querySelectorAll("[data-country]").forEach((btn) => {
    btn.onclick = () => save({ country: btn.getAttribute("data-country") });
  });
  document.querySelectorAll("[data-watch]").forEach((btn) => {
    btn.onclick = () => save({ watched: { ...state.watched, [btn.getAttribute("data-watch")]: true } });
  });
  document.querySelectorAll("[data-done2]").forEach((btn) => {
    btn.onclick = () => {
      const next = btn.getAttribute("data-next");
      save({ done2: { ...(state.done2 || {}), [btn.getAttribute("data-done2")]: true } });
      location.hash = next ? "#/app/lesson/2/" + next : "#/app/my-body/2";
    };
  });
  document.querySelectorAll("[data-own]").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-own");
      // Any box ticks straight away. The last one ticked opens Phase 2.
      const owned = { ...state.owned, [id]: !state.owned[id] };
      const all = KIT.every((k) => owned[k.id]);
      if (all && (Number(state.phase) || 1) < 2) {
        const now = Date.now();
        save({ owned, phase: 2, phase2At: now });
        location.hash = "#/app/my-body/2";
        return;
      }
      save({ owned });
    };
  });
  // querySelector, singular, meant only the first action button on a screen
  // was ever wired up. The login has two.
  document.querySelectorAll("[data-act]").forEach((act) => {
    act.onclick = () => {
    const kind = act.getAttribute("data-act");
    if (kind === "start") {
      save({
        occupation: val("occupation"),
        height: val("height"),
        weight: val("weight"),
        scan: { ...state.scan, height: val("height"), weight: val("weight") },
      });
      location.hash = "#/app/my-body/1";
    }
    if (kind === "save-account") {
      save({
        email: val("email"),
        address: {
          street: val("street"),
          suburb: val("suburb"),
          state: val("region"),
          postcode: val("postcode"),
          localAds: document.getElementById("localAds")?.checked || false,
        },
      });
    }
    if (kind === "save-scan") {
      const scan = { ...state.scan };
      document.querySelectorAll("[data-scan]").forEach((el) => {
        scan[el.getAttribute("data-scan")] = el.value;
      });
      save({ scan, watched: { ...state.watched, scan: true }, owned: { ...state.owned, scan: true } });
      location.hash = "#/app/factory";
    }
    if (kind === "log-ketone") {
      const mmol = parseMmol(val("mmol"));
      const msg = document.getElementById("mmol-msg");
      if (mmol === null) {
        if (msg) msg.textContent = "Type the number off the meter, like 0.6.";
        return;
      }
      // Readings land in the phase he is in, so the baseline stays the baseline.
      const when = val("mmol-when");
      save({ ketones: [...state.ketones, { mmol: String(mmol), at: Date.now(), phase: Number(state.phase) || 1, ...(when && when !== "Any time" ? { when } : {}) }] });
    }
    if (kind === "install" && installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.finally(() => {
        installPrompt = null;
        render();
      });
    }
    if (kind === "unlock-2") {
      if (!gate2().met) return;
      const now = Date.now();
      save({ phase: 2, phase2At: now });
      location.hash = "#/app/my-body/2";
    }
    };
  });
}

function render() {
  const root = document.getElementById("root");
  try {
    root.innerHTML = route();
    bind();
  } catch (err) {
    root.innerHTML = '<div class="screen"><h2 class="display">LOAD FAILED.</h2><p class="lede">' + String(err) + "</p></div>";
  }
}

window.addEventListener("hashchange", render);
// Hide the tab bar while a field has focus, so the keyboard cannot push it
// over the box he is typing in. Then bring the field into view above it.
const isField = (el) => el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && el.type !== "file";
document.addEventListener("focusin", (e) => {
  if (!isField(e.target)) return;
  document.body.classList.add("typing");
  setTimeout(() => e.target.scrollIntoView({ block: "center" }), 300);
});
document.addEventListener("focusout", () => {
  setTimeout(() => {
    if (!isField(document.activeElement)) document.body.classList.remove("typing");
  }, 0);
});
render();

// Makes the site installable and lets it open without a signal. See sw.js.
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
