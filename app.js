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
  { id: "ketones", name: "Blood ketone meter and strips" },
  { id: "baja", name: "Baja salt", href: "#/app/kit/baja-salt" },
  { id: "fish", name: "Fish oil" },
  { id: "mag", name: "Magnesium glycinate" },
  { id: "watch", name: "Smart watch with heart rate" },
  { id: "gym", name: "Gym membership" },
  { id: "scan", name: "Body scan", href: "#/app/scan" },
];
const PHASE_NAMES = ["Knowing your body", "The dad bod", "The liver", "Advanced macros", "Graduate"];
const LESSONS = [
  ["Your ketone meter", "Your smart watch", "Baja salt", "Fish oil", "Magnesium glycinate", "Gym and body scan", "Gut health", "Intro macros"],
  ["The crash", "Basic macros", "Zone training", "Alcohol", "Visceral fat"],
  ["The processing station", "Intro fasting", "Zones continued"],
  ["Timing and amounts", "When carbs come back", "Your scan as a work list", "Structured workouts"],
];
const SHOP = [
  ["Baja Gold sea salt", 18],
  ["Fish oil", 32],
  ["Magnesium glycinate", 24],
  ["Ketone strips", 29],
  ["Inspection-plate cap", 35],
];
const CLIENTS = [
  { id: "daniel", name: "Daniel R.", suburb: "Mandurah, WA", trade: "FIFO electrician", country: "Australia", phase: 2, day: 11, status: "miss", lastLog: "6 days ago", ketones: "2 of 7", pings: "1 of 3", notes: "On a two-weeks-on swing. Expect gaps in logging while he's on site — check in when he's back." },
  { id: "james", name: "James P.", suburb: "Fremantle, WA", trade: "Builder", country: "Australia", phase: 1, day: 8, status: "ok", lastLog: "yesterday", ketones: "4 of 5", pings: "—", notes: "" },
  { id: "tom", name: "Tom H.", suburb: "Osborne Park, WA", trade: "Truck / long haul", country: "Australia", phase: 2, day: 16, status: "gate", lastLog: "today", ketones: "6 of 7", pings: "3 of 3", notes: "Gate almost met. Morning readings holding." },
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
        <span class="ember-rule"></span>
        <span class="etk">Energy through knowledge</span>
      </div>
    </div>`;
}

function tabs(active) {
  const item = (href, label, key) => `<a href="${href}" class="${active === key ? "on" : ""}">${label}</a>`;
  return `<nav class="tabs">${item("#/app/videos", "Videos", "videos")}${item("#/app/ketones", "Ketones", "ketones")}${item("#/app/my-body", "My body", "home")}${item("#/app/shop", "Shop", "shop")}${item("#/app/account", "Account", "account")}</nav>`;
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
  if (title === "Ketones") return `${state.ketones.length} readings saved`;
  if (title === "My body") return state.owned.scan ? "Scan saved" : "No scan saved yet";
  return "";
}

function myBody(phase) {
  const owned = KIT.filter((k) => state.owned[k.id]).length;
  const rows = KIT.map((item) => {
    const watched = !!state.watched[item.id];
    const have = !!state.owned[item.id];
    return `
      <div class="kit-row ${watched ? "" : "locked"}">
        <button class="check ${have ? "on" : ""}" data-own="${item.id}">${have ? "✓" : ""}</button>
        <div>${item.name}<div class="fine">${watched ? "Tick it when it is in your hands." : "Watch it first. It tells you which one to buy."}</div></div>
        ${item.href ? `<a href="${item.href}"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div></a>` : `<button class="linkish" data-watch="${item.id}"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div></button>`}
      </div>`;
  }).join("");
  const kit = `
    <div class="split"><span class="field" style="margin:0">What you need</span><span class="badge">${owned} / ${KIT.length}</span></div>
    ${rows}
    <div class="split" style="margin-top:22px"><span class="field" style="margin:0">Your bloods</span><span class="badge">OPTIONAL</span></div>
    <div class="card">
      <p class="lede" style="margin:0">You do not have to hand us your blood test. But it is the difference between us teaching you about a factory and us teaching you about yours.</p>
      <p class="fine">We ask every Carnivore Dad to get bloods twice a year. Not because something is wrong, because a man who checks is a man who knows.</p>
      <button class="btn ghost">UPLOAD YOUR BLOOD TEST</button>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Ketone baseline</p>
      <p class="lede" style="margin:0">Your starting readings stay with your Ketones record. Five tests, every second day.</p>
      <a class="btn ghost" href="#/app/ketones/1" style="margin-top:12px;display:block">OPEN BASELINE READINGS</a>
    </div>`;
  const later = `
    <p class="lede">The work for this phase. Your scan and your lessons sit together here.</p>`;
  return phaseShell("My body", "home", phase, `
    ${phase === 1 ? kit : later}
    <div class="card">
      <p class="field" style="margin-top:0">Your scan</p>
      <p class="lede" style="margin:0">Your results exactly as the machine printed them. Reading a scan file automatically is not connected, so enter the numbers.</p>
      <a class="btn ghost" href="#/app/scan" style="margin-top:12px;display:block">ENTER A SCAN</a>
      <a class="btn ghost" href="#/app/factory" style="margin-top:8px;display:block">OPEN YOUR FACTORY</a>
    </div>
    <div class="card">
      <p class="field" style="margin-top:0">Learn</p>
      <p class="lede" style="margin:0">${phase === 1 ? "Basic macros and Your body lessons live in your phase library." : "Open the lessons for this phase."}</p>
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
    <p class="phase-tag">Phase 1</p>
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
      <p class="fine">Eat the way you eat now. Test first thing, five times, one every second day, and photograph each one. That is your before-photo, and it is what opens Phase 2.</p>
      <a class="btn" href="#/app/ketones">LOG MY FIRST READING</a>
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
    <h2 class="display">YOUR BODY SCAN.</h2>
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

function baja() {
  return phone(
    `
    <p class="phase-tag">Phase 1 · The kit</p>
    <h2 class="display">BAJA GOLD SEA SALT.</h2>
    <div class="body-stage" style="height:180px;background:#16120c"><div><p class="etk" style="text-align:center">1:06</p><p style="font-family:Anton,sans-serif;font-size:22px">PLAY</p></div></div>
    <p class="field">What the video covers</p>
    <ul class="points">
      <li><strong>NOT TABLE SALT</strong>Two piles side by side. One is stripped white. One still has what the sea put in it.</li>
      <li><strong>SEA OF CORTEZ</strong>Unrefined and mineral rich, off the ponds rather than out of a refinery.</li>
      <li><strong>MAGNESIUM · POTASSIUM · TRACE</strong>What survives when nobody strips it out.</li>
      <li><strong>THE DUMP</strong>Pipes running dry, not the engine failing. When the fuel changes, water and salt go out with it.</li>
      <li><strong>THE PINCH</strong>A pinch in the water. A pinch on the steak. That is the whole method.</li>
    </ul>
    <button class="btn" data-watch="baja">WATCHED IT — UNLOCK THE BOX</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:8px;display:block">GET IT IN THE SHOP</a>
  `,
    "videos"
  );
}

function videos(phase) {
  const list = LESSONS[phase - 1] || [];
  const rows = list.map((title) => `
      <div class="kit-row">
        <div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">&#9655;</span></div>
        <div>${title}${title === "Baja salt" ? '<div class="fine"><a href="#/app/kit/baja-salt">Read the written guide</a></div>' : ""}</div>
        <span class="fine">Coming soon</span>
      </div>`).join("");
  return phaseShell("Videos", "videos", phase, `
    <p class="lede">Your phase library. Videos appear here when they are ready.</p>
    ${rows}
  `);
}

function ketones(phase) {
  const rows = state.ketones.map((k, i) => `
      <div class="kit-row">
        <div class="check on">${i + 1}</div>
        <div>${escapeHtml(k.mmol)} mmol/L<div class="fine">${new Date(k.at).toLocaleString()}</div></div>
        <span></span>
      </div>`).join("");
  return phaseShell("Ketones", "ketones", phase, `
    <p class="lede">${phase === 1
      ? "Your starting picture. Five tests, one every second day, on the diet you eat now. A typical old-diet reading is 0.0 to 0.2 mmol/L, and a low number is the honest starting point, not a failure."
      : "Your meter readings, kept in one place."}</p>
    <label class="field">Morning reading (mmol/L)</label>
    <input id="mmol" placeholder="0.1" />
    <button class="btn" style="margin-top:12px" data-act="log-ketone">SAVE READING</button>
    <p class="badge" style="margin-top:16px">${state.ketones.length}${phase === 1 ? " / 5" : ""}</p>
    ${rows}
    <p class="fine">A reading is a fact about right now, not a score. The dial is a scale, not a target.</p>
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
    <a class="btn ghost" href="#/" style="margin-top:10px;display:block">BACK TO LOG IN</a>
    ${legal()}
  `, "account");
}

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
  const phases = ["Knowing your body", "The Dad Bod", "The Liver", "Advanced macros", "The Room"];
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
          <div class="stat"><span class="field" style="margin:0">Morning ketones · 7 days</span><b>${c.ketones}</b><p class="fine">Needs most mornings at 0.5 mmol/L or above.</p></div>
          <div class="stat"><span class="field" style="margin:0">Clean random pings</span><b>${c.pings}</b></div>
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
  if (hash === "/app/factory") return factory();
  if (hash === "/app/scan") return scan();
  if (hash === "/app/kit/baja-salt") return baja();
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
      note.textContent = `${n === 5 ? "Graduate" : "Phase " + n} opens after the phase before it.`;
      note.hidden = false;
    };
  });
  document.querySelectorAll("[data-country]").forEach((btn) => {
    btn.onclick = () => save({ country: btn.getAttribute("data-country") });
  });
  document.querySelectorAll("[data-watch]").forEach((btn) => {
    btn.onclick = () => save({ watched: { ...state.watched, [btn.getAttribute("data-watch")]: true } });
  });
  document.querySelectorAll("[data-own]").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-own");
      if (!state.watched[id]) return;
      save({ owned: { ...state.owned, [id]: !state.owned[id] } });
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
      const mmol = val("mmol");
      if (!mmol) return;
      save({ ketones: [...state.ketones, { mmol, at: Date.now() }] });
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
render();
