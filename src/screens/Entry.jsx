import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES } from "../data";
import { useApp } from "../state";
import { BrandLockup } from "../components/Brand";
import { Phone } from "../components/Shell";

export function Login() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState(state.email || "");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Phone>
      <div className="screen">
        <BrandLockup country={state.country} />
        <label className="field">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        <label className="field">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="fine" style={{ marginTop: 10 }}>
          <button className="linkish">Forgot password</button>
        </p>
        <button
          className="btn"
          style={{ marginTop: 18 }}
          onClick={() => {
            patch({ email, paid: true });
            nav("/app/phase-1");
          }}
        >
          SIGN IN
        </button>
        <p className="fine" style={{ margin: "22px 0 8px", letterSpacing: "0.18em" }}>
          NEW HERE
        </p>
        <Link className="btn ghost" to="/reset">
          START YOUR RESET
        </Link>
        <p className="legal">Education and advice only. Your GP owns your medicine.</p>
        <div className="country-row">
          <div className="split">
            <span className="field" style={{ margin: 0 }}>
              Your country
            </span>
            <button className="linkish" onClick={() => setOpen(!open)}>
              {COUNTRIES.find((c) => c.code === state.country)?.name}
            </button>
          </div>
          {open && (
            <div className="country-list">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  className={c.code === state.country ? "on" : ""}
                  onClick={() => {
                    patch({ country: c.code });
                    setOpen(false);
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Phone>
  );
}

export function Reset() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: state.email,
    occupation: state.occupation,
    height: state.height,
    weight: state.weight,
    ...state.address,
  });
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <Phone>
      <div className="screen">
        <BrandLockup country={state.country} />
        <h2 className="display">START YOUR RESET.</h2>
        <p className="lede">Your numbers, your trade, and the way in. Phase 1 opens the moment this is done.</p>
        <div className="split">
          <div className="price">
            $25 <span>/ WEEK</span>
          </div>
        </div>
        <p className="fine">Billed weekly while you are in the phases. You move up when your data says so, not when a calendar does.</p>
        <p className="fine">[Cancellation terms]</p>
        <p className="field">Your numbers</p>
        <label className="field">Email</label>
        <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        <label className="field">Occupation</label>
        <select value={form.occupation} onChange={(e) => set("occupation", e.target.value)}>
          <option value="">Choose your trade</option>
          {["FIFO electrician", "Police", "Plumber / trades", "Truck / long haul", "Builder", "Office / desk", "Other"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <p className="fine">Not small talk. This is the language every video and lesson gets written in.</p>
        <div className="stat-grid">
          <div>
            <label className="field">Height (cm)</label>
            <input value={form.height} onChange={(e) => set("height", e.target.value)} />
          </div>
          <div>
            <label className="field">Weight (kg)</label>
            <input value={form.weight} onChange={(e) => set("weight", e.target.value)} />
          </div>
        </div>
        <label className="field">Street address</label>
        <input value={form.street} onChange={(e) => set("street", e.target.value)} />
        <label className="field">Suburb</label>
        <input value={form.suburb} onChange={(e) => set("suburb", e.target.value)} />
        <div className="stat-grid">
          <div>
            <label className="field">State</label>
            <input value={form.state} onChange={(e) => set("state", e.target.value)} />
          </div>
          <div>
            <label className="field">Postcode</label>
            <input value={form.postcode} onChange={(e) => set("postcode", e.target.value)} />
          </div>
        </div>
        <p className="fine">Where your kit gets delivered, and what your account is tied to.</p>
        <label className="fine" style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 12 }}>
          <input
            type="checkbox"
            checked={!!form.localAds}
            onChange={(e) => set("localAds", e.target.checked)}
            style={{ width: 18 }}
          />
          Show me gyms and butchers near me. Off by default.
        </label>
        <p className="field" style={{ marginTop: 22 }}>
          Payment
        </p>
        <div className="row-btns">
          <button className="btn ghost">Apple Pay</button>
          <button className="btn ghost">Google Pay</button>
        </div>
        <p className="fine" style={{ margin: "12px 0" }}>
          OR CARD
        </p>
        <label className="field">Card number</label>
        <input placeholder="•••• •••• •••• ••••" />
        <div className="stat-grid">
          <div>
            <label className="field">Expiry</label>
            <input placeholder="MM/YY" />
          </div>
          <div>
            <label className="field">CVC</label>
            <input placeholder="123" />
          </div>
        </div>
        <button
          className="btn"
          style={{ marginTop: 20 }}
          onClick={() => {
            patch({
              email: form.email || "you@email.com",
              occupation: form.occupation,
              height: form.height,
              weight: form.weight,
              address: form,
              paid: true,
              scan: { ...state.scan, height: form.height, weight: form.weight },
            });
            nav("/check-email");
          }}
        >
          START MY RESET — $25 / WEEK
        </button>
        <Link className="btn ghost" to="/app/shop" style={{ marginTop: 10 }}>
          GO TO THE SHOP
        </Link>
        <p className="legal">Education and advice only. Not treatment, not a prescription, not a diagnosis. Your GP owns your medicine.</p>
      </div>
    </Phone>
  );
}

export function CheckEmail() {
  const { state } = useApp();
  return (
    <Phone>
      <div className="screen">
        <BrandLockup country={state.country} />
        <h2 className="display">CHECK YOUR EMAIL.</h2>
        <p className="lede">
          Payment is in. We have sent a link to <b>{state.email || "you@email.com"}</b>. Open it, set your password, and Phase 1 is yours.
        </p>
        <p className="badge">WAITING ON YOU</p>
        <Link className="btn" to="/set-password" style={{ marginTop: 22 }}>
          OPEN MAIL APP
        </Link>
        <p className="fine" style={{ marginTop: 16 }}>
          Nothing there? <button className="linkish">Send it again</button>
        </p>
        <p className="fine">Check your junk folder before you send it again.</p>
      </div>
    </Phone>
  );
}

export function SetPassword() {
  const { state } = useApp();
  const nav = useNavigate();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const ok = a.length >= 10 && /\d/.test(a) && a === b;
  return (
    <Phone>
      <div className="screen">
        <BrandLockup country={state.country} />
        <h2 className="display">SET YOUR PASSWORD.</h2>
        <p className="lede">Last step. Then Phase 1 opens.</p>
        <p className="fine">{state.email || "you@email.com"}</p>
        <label className="field">New password</label>
        <input type="password" value={a} onChange={(e) => setA(e.target.value)} />
        <label className="field">Confirm password</label>
        <input type="password" value={b} onChange={(e) => setB(e.target.value)} />
        <p className="fine">At least 10 characters · One number · Both passwords match</p>
        <button className="btn" style={{ marginTop: 18, opacity: ok ? 1 : 0.5 }} disabled={!ok} onClick={() => nav("/app/phase-1")}>
          OPEN PHASE 1
        </button>
        <p className="legal">This link is good for [link expiry]. After that, ask for a new one.</p>
      </div>
    </Phone>
  );
}
