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
  return `<svg viewBox="0 0 60 30" width="42" height="21">${paths[code] || paths.AU}</svg>`;
}

function lockup(compact) {
  return `
    <div class="lockup">
      <div class="plates">
        <div class="flag-plate">${flag(state.country)}</div>
        <div class="cd-plate"><span>CD</span></div>
      </div>
      <div class="ember-rule"></div>
      <div class="wordmark">
        <h1 style="font-size:${compact ? 22 : 28}px">CARNIVORE DADS</h1>
        ${compact ? "" : '<p class="etk">Energy through knowledge</p>'}
      </div>
    </div>`;
}

function tabs(active) {
  const item = (href, label, key) => `<a href="${href}" class="${active === key ? "on" : ""}">${label}</a>`;
  return `<nav class="tabs">${item("#/app/videos", "Videos", "videos")}${item("#/app/ketones", "Ketones", "ketones")}${item("#/app/shop", "Shop", "shop")}${item("#/app/account", "Account", "account")}</nav>`;
}

function phone(inner, tab) {
  return `
    <div class="desk">
      <div class="desk-bar"><span><strong>Carnivore Dads</strong> · factory reset</span><a href="#/admin">Admin</a></div>
      <div class="phone">
        <div class="screen ${tab ? "with-tabs" : ""}">
          <a href="#/app/phase-1">${lockup(!!tab)}</a>
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
    <label class="field">Email</label>
    <input id="email" value="${escapeAttr(state.email)}" placeholder="you@email.com" />
    <label class="field">Password</label>
    <input id="password" type="password" />
    <p class="fine" style="margin-top:10px"><button class="linkish">Forgot password</button></p>
    <button class="btn" style="margin-top:18px" data-act="signin">SIGN IN</button>
    <p class="fine" style="margin:22px 0 8px;letter-spacing:.18em">NEW HERE</p>
    <a class="btn ghost" href="#/reset">START YOUR RESET</a>
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
    <p class="lede">Your numbers, your trade, and the way in. Phase 1 opens the moment this is done.</p>
    <div class="price">$25 <span>/ WEEK</span></div>
    <p class="fine">Billed weekly while you are in the phases. You move up when your data says so, not when a calendar does.</p>
    <p class="fine">[Cancellation terms]</p>
    <p class="field">Your numbers</p>
    <label class="field">Email</label><input id="email" value="${escapeAttr(state.email)}" placeholder="you@email.com" />
    <label class="field">Occupation</label>
    <select id="occupation">${["", ...TRADES].map((t) => `<option ${t === state.occupation ? "selected" : ""}>${t || "Choose your trade"}</option>`).join("")}</select>
    <p class="fine">Not small talk. This is the language every video and lesson gets written in.</p>
    <div class="stat-grid">
      <div><label class="field">Height (cm)</label><input id="height" value="${escapeAttr(state.height)}" /></div>
      <div><label class="field">Weight (kg)</label><input id="weight" value="${escapeAttr(state.weight)}" /></div>
    </div>
    <label class="field">Street address</label><input id="street" value="${escapeAttr(state.address.street)}" />
    <label class="field">Suburb</label><input id="suburb" value="${escapeAttr(state.address.suburb)}" />
    <div class="stat-grid">
      <div><label class="field">State</label><input id="region" value="${escapeAttr(state.address.state)}" /></div>
      <div><label class="field">Postcode</label><input id="postcode" value="${escapeAttr(state.address.postcode)}" /></div>
    </div>
    <p class="fine">Where your kit gets delivered, and what your account is tied to.</p>
    <label class="fine" style="display:flex;gap:8px;align-items:flex-start;margin-top:12px">
      <input id="localAds" type="checkbox" ${state.address.localAds ? "checked" : ""} style="width:18px" />
      Show me gyms and butchers near me. Off by default.
    </label>
    <p class="field" style="margin-top:22px">Payment</p>
    <div class="row-btns"><button class="btn ghost">Apple Pay</button><button class="btn ghost">Google Pay</button></div>
    <p class="fine" style="margin:12px 0">OR CARD</p>
    <label class="field">Card number</label><input placeholder="•••• •••• •••• ••••" />
    <div class="stat-grid">
      <div><label class="field">Expiry</label><input placeholder="MM/YY" /></div>
      <div><label class="field">CVC</label><input placeholder="123" /></div>
    </div>
    <button class="btn" style="margin-top:20px" data-act="pay">START MY RESET — $25 / WEEK</button>
    <a class="btn ghost" href="#/app/shop" style="margin-top:10px;display:block">GO TO THE SHOP</a>
    ${legal()}
  `);
}

function checkEmail() {
  return phone(`
    <h2 class="display">CHECK YOUR EMAIL.</h2>
    <p class="lede">Payment is in. We have sent a link to <b>${escapeHtml(state.email || "you@email.com")}</b>. Open it, set your password, and Phase 1 is yours.</p>
    <p class="badge">WAITING ON YOU</p>
    <a class="btn" href="#/set-password" style="margin-top:22px;display:block">OPEN MAIL APP</a>
    <p class="fine" style="margin-top:16px">Nothing there? <button class="linkish">Send it again</button></p>
    <p class="fine">Check your junk folder before you send it again.</p>
  `);
}

function setPassword() {
  return phone(`
    <h2 class="display">SET YOUR PASSWORD.</h2>
    <p class="lede">Last step. Then Phase 1 opens.</p>
    <p class="fine">${escapeHtml(state.email || "you@email.com")}</p>
    <label class="field">New password</label><input id="pw1" type="password" />
    <label class="field">Confirm password</label><input id="pw2" type="password" />
    <p class="fine">At least 10 characters · One number · Both passwords match</p>
    <button class="btn" style="margin-top:18px" data-act="open-phase">OPEN PHASE 1</button>
    <p class="legal">This link is good for [link expiry]. After that, ask for a new one.</p>
  `);
}

function phase1() {
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
  return phone(
    `
    <p class="phase-tag">Phase 1</p>
    <h2 class="display">KNOWING YOUR BODY.</h2>
    <p class="lede">Before anything changes, we find out what you are working with. Learn what each piece of kit does, get the right one in your hands, and put your first numbers on the board.</p>
    <div class="split"><span class="field" style="margin:0">What you need</span><span class="badge">${owned} / ${KIT.length}</span></div>
    ${rows}
    <div class="split" style="margin-top:22px"><span class="field" style="margin:0">Your bloods</span><span class="badge">OPTIONAL</span></div>
    <div class="card">
      <p class="lede" style="margin:0">You do not have to hand us your blood test. But it is the difference between us teaching you about a factory and us teaching you about yours.</p>
      <p class="fine">We ask every Carnivore Dad to get bloods twice a year. Not because something is wrong — because a man who checks is a man who knows.</p>
      <button class="btn ghost">UPLOAD YOUR BLOOD TEST</button>
    </div>
    <a class="btn" href="#/app/factory" style="margin-top:16px;display:block">OPEN YOUR FACTORY</a>
    ${legal()}
  `,
    "home"
  );
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

function videos() {
  const lessons = [
    ["baja", "Baja salt", "#/app/kit/baja-salt"],
    ["fish", "Fish oil", ""],
    ["mag", "Magnesium glycinate", ""],
    ["ketones", "Ketone meter and strips", ""],
    ["watch", "Smart watch", ""],
    ["gym", "Gym membership — habit, not a program", ""],
    ["scan", "How to read the scan", "#/app/scan"],
    ["gut", "Gut health: amino acids and membranes", ""],
    ["macros", "Intro macros", ""],
  ];
  return phone(
    `
    <p class="phase-tag">Videos</p>
    <h2 class="display">THE KIT, THEN THE FACTORY.</h2>
    <p class="lede">Knowledge first. Each CD plate opens the teaching for that thing. Occupation-language cuts are shelved for now — same lesson for every dad.</p>
    ${lessons
      .map(
        ([id, name, href]) => `
      <div class="kit-row">
        <div class="check ${state.watched[id] ? "on" : ""}">${state.watched[id] ? "✓" : ""}</div>
        <div>${name}</div>
        ${href ? `<a href="${href}"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div></a>` : `<button class="linkish" data-watch="${id}"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div></button>`}
      </div>`
      )
      .join("")}
  `,
    "videos"
  );
}

function ketones() {
  return phone(
    `
    <p class="phase-tag">Ketones</p>
    <h2 class="display">BEFORE-PHOTO.</h2>
    <p class="lede">Phase 1 baseline is five tests, one every second day, on the diet you eat now. Typical old-diet reading is 0.0–0.2 mmol/L. That is the photo Phase 2 is judged against.</p>
    <label class="field">Morning reading (mmol/L)</label>
    <input id="mmol" placeholder="0.1" />
    <button class="btn" style="margin-top:12px" data-act="log-ketone">SAVE READING</button>
    <p class="badge" style="margin-top:16px">${state.ketones.length} / 5</p>
    ${state.ketones
      .map(
        (k, i) => `
      <div class="kit-row">
        <div class="check on">${i + 1}</div>
        <div>${escapeHtml(k.mmol)} mmol/L<div class="fine">${new Date(k.at).toLocaleString()}</div></div>
        <span></span>
      </div>`
      )
      .join("")}
  `,
    "ketones"
  );
}

function shop() {
  return phone(
    `
    <p class="phase-tag">Shop</p>
    <h2 class="display">THE KIT SHELF.</h2>
    <p class="lede">Salt, fish oil, magnesium, strips, merch. Meat is not on this cart — perishable supply is a different business.</p>
    ${SHOP.map(([name, price]) => `<div class="kit-row"><div class="cd-plate" style="width:36px;height:24px"><span style="font-size:13px">CD</span></div><div>${name}</div><strong>$${price}</strong></div>`).join("")}
  `,
    "shop"
  );
}

function account() {
  const a = state.address || {};
  return phone(
    `
    <p class="phase-tag">Account</p>
    <h2 class="display">YOUR FILE.</h2>
    <div class="card">
      <p class="field" style="margin-top:0">Email</p><p>${escapeHtml(state.email || "you@email.com")}</p>
      <p class="field">Trade</p><p>${escapeHtml(state.occupation || "Not set")}</p>
      <p class="field">Delivery</p><p>${escapeHtml([a.street, a.suburb, a.state, a.postcode].filter(Boolean).join(" ") || "Address on file")}</p>
      <p class="field">Plan</p><p>$25 / week · active</p>
    </div>
    <a class="btn ghost" href="#/">SIGN OUT</a>
  `,
    "account"
  );
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
        <label class="field">Password</label><input type="password" value="password12" />
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
  if (hash === "/check-email") return checkEmail();
  if (hash === "/set-password") return setPassword();
  if (hash === "/app/phase-1") return phase1();
  if (hash === "/app/factory") return factory();
  if (hash === "/app/scan") return scan();
  if (hash === "/app/kit/baja-salt") return baja();
  if (hash === "/app/videos") return videos();
  if (hash === "/app/ketones") return ketones();
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
  const act = document.querySelector("[data-act]");
  if (!act) return;
  act.onclick = () => {
    const kind = act.getAttribute("data-act");
    if (kind === "signin") {
      save({ email: val("email") });
      location.hash = "#/app/phase-1";
    }
    if (kind === "pay") {
      save({
        email: val("email") || "you@email.com",
        occupation: val("occupation"),
        height: val("height"),
        weight: val("weight"),
        address: {
          street: val("street"),
          suburb: val("suburb"),
          state: val("region"),
          postcode: val("postcode"),
          localAds: document.getElementById("localAds")?.checked || false,
        },
        scan: { ...state.scan, height: val("height"), weight: val("weight") },
      });
      location.hash = "#/check-email";
    }
    if (kind === "open-phase") {
      const a = val("pw1");
      const b = val("pw2");
      if (a.length < 10 || !/\d/.test(a) || a !== b) return;
      location.hash = "#/app/phase-1";
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
