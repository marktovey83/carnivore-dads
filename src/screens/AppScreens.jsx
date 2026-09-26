import { useState } from "react";
import { Link } from "react-router-dom";
import { KIT, SHOP } from "../data";
import { kitProgress, useApp } from "../state";
import { BrandLockup, CdPlate } from "../components/Brand";
import { Header, Phone } from "../components/Shell";

export function Phase1() {
  const { state, setWatched, toggleOwned } = useApp();
  const { owned, total } = kitProgress(state);
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Phase 1</p>
        <h2 className="display">KNOWING YOUR BODY.</h2>
        <p className="lede">
          Before anything changes, we find out what you are working with. Learn what each piece of kit does, get the right one in your hands, and put your first numbers on the board.
        </p>
        <div className="split">
          <span className="field" style={{ margin: 0 }}>
            What you need
          </span>
          <span className="badge">
            {owned} / {total}
          </span>
        </div>
        {KIT.map((item) => {
          const watched = !!state.watched[item.id];
          const have = !!state.owned[item.id];
          return (
            <div key={item.id} className={`kit-row ${watched ? "" : "locked"}`}>
              <button className={`check ${have ? "on" : ""}`} onClick={() => toggleOwned(item.id)} disabled={!watched && item.id !== "ketones"}>
                {have ? "✓" : ""}
              </button>
              <div>
                <div>{item.name}</div>
                {!watched && <div className="fine">Watch it first. It tells you which one to buy.</div>}
                {watched && !have && <div className="fine">Tick it when it is in your hands.</div>}
              </div>
              <CdPlate
                to={item.lesson || undefined}
                onClick={!item.lesson ? () => setWatched(item.id) : undefined}
              />
            </div>
          );
        })}
        <div className="split" style={{ marginTop: 22 }}>
          <span className="field" style={{ margin: 0 }}>
            Your bloods
          </span>
          <span className="badge">OPTIONAL</span>
        </div>
        <div className="card">
          <p className="lede" style={{ margin: 0 }}>
            You do not have to hand us your blood test. But it is the difference between us teaching you about a factory and us teaching you about yours.
          </p>
          <p className="fine">
            We ask every Carnivore Dad to get bloods twice a year. Not because something is wrong — because a man who checks is a man who knows.
          </p>
          <button className="btn ghost">UPLOAD YOUR BLOOD TEST</button>
        </div>
        <Link className="btn" to="/app/factory" style={{ marginTop: 16 }}>
          OPEN YOUR FACTORY
        </Link>
        <p className="legal">Education and advice only. Not treatment, not a prescription, not a diagnosis. Your GP owns your medicine.</p>
      </div>
    </Phone>
  );
}

export function Factory() {
  const { state } = useApp();
  const fat = Number(state.scan.bodyFat || 28);
  const vis = Number(state.scan.visceral || 12);
  const scale = 1 + (fat - 15) / 80;
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Phase 1</p>
        <h2 className="display">THIS IS YOUR FACTORY.</h2>
        <p className="lede">Built from your scan. Not a stock photo, not a guess — your height, your weight, your numbers.</p>
        <p className="fine">FRONT / SCAN 001</p>
        <div className="body-stage">
          <div className="sil" style={{ transform: `scale(${scale})` }}>
            <div className="arm l" />
            <div className="arm r" />
            <div className="head" />
            <div className="torso">
              <div className="gut" style={{ opacity: 0.25 + vis / 30, height: `${28 + vis * 1.4}%` }} />
            </div>
            <div className="legs">
              <div className="leg" />
              <div className="leg" />
            </div>
          </div>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <span className="field" style={{ margin: 0 }}>
              Body fat
            </span>
            <b>{fat}%</b>
          </div>
          <div className="stat">
            <span className="field" style={{ margin: 0 }}>
              Visceral fat
            </span>
            <b>{vis}</b>
          </div>
        </div>
        <p className="fine">
          The scales told you {state.scan.weight || 95} kilos. They could not tell you where it sits. The ember is the fat packed around your organs — that is the part Phase 2 goes after.
        </p>
        <div className="card">
          <div className="split">
            <strong>FOOD · MACROS</strong>
            <CdPlate />
          </div>
          <p className="fine">Protein, fat, and the carbs you are about to stop sending in. What comes through the loading bay decides what the whole factory runs on.</p>
        </div>
        <p className="fine">Bloods received. They open up the factory map, bay by bay.</p>
        <p className="field">What happens now</p>
        <div className="card">
          <strong>BLOOD KETONES</strong>
          <p className="fine">
            Eat the way you eat now. Test first thing, five times, one every second day, and photograph each one. That is your before-photo, and it is what opens Phase 2.
          </p>
          <Link className="btn" to="/app/ketones">
            LOG MY FIRST READING
          </Link>
        </div>
      </div>
    </Phone>
  );
}

export function BodyScan() {
  const { state, patch, setWatched } = useApp();
  const scan = state.scan;
  const set = (k, v) => patch({ scan: { ...scan, [k]: v } });
  const fields = [
    ["height", "Height", "cm"],
    ["waist", "Waist circumference", "cm"],
    ["hips", "Hip circumference", "cm"],
    ["weight", "Weight", "kg"],
    ["bmi", "BMI", ""],
    ["bfm", "Body fat mass (BFM)", "kg"],
    ["bodyFat", "Body fat %", "%"],
    ["smm", "Skeletal muscle mass (SMM)", "kg"],
    ["tbw", "Total body water (TBW)", "kg"],
    ["bmr", "Basal metabolic rate (BMR)", "kcal"],
    ["visceral", "Visceral fat", "level"],
  ];
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Phase 1 · Kit</p>
        <h2 className="display">YOUR BODY SCAN.</h2>
        <p className="lede">Photograph every screen the machine gives you and we will read the numbers off it. Or type them in yourself.</p>
        <div className="row-btns">
          <button className="btn ghost">TAKE PHOTO</button>
          <button className="btn ghost">UPLOAD</button>
        </div>
        {fields.map(([k, label, unit]) => (
          <div key={k} className="kit-row">
            <CdPlate />
            <div style={{ gridColumn: "2 / 3" }}>
              <label className="field" style={{ marginTop: 0 }}>
                {label}
              </label>
              <input value={scan[k] || ""} onChange={(e) => set(k, e.target.value)} />
            </div>
            <span className="fine">{unit}</span>
          </div>
        ))}
        <p className="fine">BMI is on the page because the machine prints it. The program still tells you to put the scales in the cupboard.</p>
        <button
          className="btn"
          style={{ marginTop: 16 }}
          onClick={() => {
            setWatched("scan");
            patch({ owned: { ...state.owned, scan: true } });
          }}
        >
          SAVE MY SCAN
        </button>
        <Link className="btn ghost" to="/app/factory" style={{ marginTop: 8 }}>
          SEE THE FACTORY
        </Link>
      </div>
    </Phone>
  );
}

export function BajaSalt() {
  const { state, setWatched, patch } = useApp();
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Phase 1 · The kit</p>
        <h2 className="display">BAJA GOLD SEA SALT.</h2>
        <div className="body-stage" style={{ height: 180, background: "#16120c" }}>
          <div>
            <p className="etk" style={{ textAlign: "center" }}>
              1:06
            </p>
            <p style={{ fontFamily: "Anton, sans-serif", fontSize: 22 }}>PLAY</p>
          </div>
        </div>
        <p className="field">What the video covers</p>
        <ul className="points">
          <li>
            <strong>NOT TABLE SALT</strong>
            Two piles side by side. One is stripped white. One still has what the sea put in it.
          </li>
          <li>
            <strong>SEA OF CORTEZ</strong>
            Unrefined and mineral rich, off the ponds rather than out of a refinery.
          </li>
          <li>
            <strong>MAGNESIUM · POTASSIUM · TRACE</strong>
            What survives when nobody strips it out.
          </li>
          <li>
            <strong>THE DUMP</strong>
            Pipes running dry, not the engine failing. When the fuel changes, water and salt go out with it.
          </li>
          <li>
            <strong>THE PINCH</strong>
            A pinch in the water. A pinch on the steak. That is the whole method.
          </li>
        </ul>
        <button
          className="btn"
          onClick={() => {
            setWatched("baja");
            patch({ owned: { ...state.owned, baja: state.owned.baja } });
          }}
        >
          WATCHED IT — UNLOCK THE BOX
        </button>
        <Link className="btn ghost" to="/app/shop" style={{ marginTop: 8 }}>
          GET IT IN THE SHOP
        </Link>
      </div>
    </Phone>
  );
}

export function Videos() {
  const { state, setWatched } = useApp();
  const lessons = [
    { id: "baja", name: "Baja salt", to: "/app/kit/baja-salt" },
    { id: "fish", name: "Fish oil" },
    { id: "mag", name: "Magnesium glycinate" },
    { id: "ketones", name: "Ketone meter and strips" },
    { id: "watch", name: "Smart watch" },
    { id: "gym", name: "Gym membership — habit, not a program" },
    { id: "scan", name: "How to read the scan", to: "/app/scan" },
    { id: "gut", name: "Gut health: amino acids and membranes" },
    { id: "macros", name: "Intro macros" },
  ];
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Videos</p>
        <h2 className="display">THE KIT, THEN THE FACTORY.</h2>
        <p className="lede">Knowledge first. Each CD plate opens the teaching for that thing. Occupation-language cuts are shelved for now — same lesson for every dad.</p>
        {lessons.map((v) => (
          <div className="kit-row" key={v.id}>
            <div className={`check ${state.watched[v.id] ? "on" : ""}`}>{state.watched[v.id] ? "✓" : ""}</div>
            <div>{v.name}</div>
            {v.to ? (
              <CdPlate to={v.to} />
            ) : (
              <CdPlate onClick={() => setWatched(v.id)} />
            )}
          </div>
        ))}
      </div>
    </Phone>
  );
}

export function Ketones() {
  const { state, addKetone } = useApp();
  const [val, setVal] = useState("");
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Ketones</p>
        <h2 className="display">BEFORE-PHOTO.</h2>
        <p className="lede">
          Phase 1 baseline is five tests, one every second day, on the diet you eat now. Typical old-diet reading is 0.0–0.2 mmol/L. That is the photo Phase 2 is judged against.
        </p>
        <label className="field">Morning reading (mmol/L)</label>
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="0.1" />
        <button className="btn" style={{ marginTop: 12 }} onClick={() => { if (val) { addKetone(val); setVal(""); } }}>
          SAVE READING
        </button>
        <p className="badge" style={{ marginTop: 16 }}>
          {state.ketones.length} / 5
        </p>
        {state.ketones.map((k, i) => (
          <div className="kit-row" key={k.at}>
            <div className="check on">{i + 1}</div>
            <div>
              {k.mmol} mmol/L
              <div className="fine">{new Date(k.at).toLocaleString()}</div>
            </div>
            <span />
          </div>
        ))}
      </div>
    </Phone>
  );
}

export function Shop() {
  const { state } = useApp();
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Shop</p>
        <h2 className="display">THE KIT SHELF.</h2>
        <p className="lede">Salt, fish oil, magnesium, strips, merch. Meat is not on this cart — perishable supply is a different business.</p>
        {SHOP.map((item) => (
          <div className="kit-row" key={item.id}>
            <div className="cd-plate" style={{ width: 36, height: 24 }}>
              <span style={{ fontSize: 13 }}>CD</span>
            </div>
            <div>{item.name}</div>
            <strong>${item.price}</strong>
          </div>
        ))}
      </div>
    </Phone>
  );
}

export function Account() {
  const { state } = useApp();
  return (
    <Phone tabs country={state.country}>
      <div className="screen with-tabs">
        <Header country={state.country} phase />
        <p className="phase-tag">Account</p>
        <h2 className="display">YOUR FILE.</h2>
        <div className="card">
          <p className="field" style={{ marginTop: 0 }}>
            Email
          </p>
          <p>{state.email || "you@email.com"}</p>
          <p className="field">Trade</p>
          <p>{state.occupation || "Not set"}</p>
          <p className="field">Delivery</p>
          <p>
            {state.address.street || "Address on file"} {state.address.suburb} {state.address.state} {state.address.postcode}
          </p>
          <p className="field">Plan</p>
          <p>$25 / week · active</p>
        </div>
        <Link className="btn ghost" to="/">
          SIGN OUT
        </Link>
      </div>
    </Phone>
  );
}
