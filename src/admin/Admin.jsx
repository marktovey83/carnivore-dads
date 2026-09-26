import { Link, useNavigate, useParams } from "react-router-dom";
import { SAMPLE_CLIENTS } from "../data";
import { BrandLockup } from "../components/Brand";

function Top() {
  return (
    <header className="admin-top">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="cd-plate">
          <span>CD</span>
        </div>
        <div>
          <div style={{ fontFamily: "Anton, sans-serif", letterSpacing: "0.06em" }}>CARNIVORE DADS</div>
          <div className="etk" style={{ margin: 0 }}>
            Admin
          </div>
        </div>
      </div>
      <nav className="admin-nav">
        <Link to="/admin/clients" className="on">
          Clients
        </Link>
        <span style={{ color: "#5e594e" }}>Shop orders</span>
        <span style={{ color: "#5e594e" }}>Staff</span>
        <span>Mark T.</span>
        <Link to="/admin">Sign out</Link>
      </nav>
    </header>
  );
}

export function AdminLogin() {
  const nav = useNavigate();
  return (
    <div className="admin" style={{ display: "grid", placeItems: "center" }}>
      <div style={{ width: minWidth() }}>
        <BrandLockup country="AU" />
        <p className="etk" style={{ textAlign: "center" }}>
          Staff access · client tracking
        </p>
        <label className="field">Work email</label>
        <input defaultValue="mark@carnivoredads.com" />
        <label className="field">Password</label>
        <input type="password" defaultValue="password1234" />
        <label className="field">6-digit code from your authenticator</label>
        <input placeholder="000000" />
        <button className="btn" style={{ marginTop: 18 }} onClick={() => nav("/admin/clients")}>
          SIGN IN
        </button>
        <p className="legal">Admin accounts are invite-only. Every sign-in and every client file opened is logged.</p>
        <p className="fine" style={{ marginTop: 18 }}>
          <Link to="/">Dads sign in through the app.</Link>
        </p>
      </div>
    </div>
  );
}

function minWidth() {
  return "min(420px, calc(100% - 40px))";
}

export function Clients() {
  return (
    <div className="admin">
      <Top />
      <div className="admin-body">
        <h2 className="display">CLIENTS MAP</h2>
        <p className="fine">Pinned by delivery suburb · sample data</p>
        <div className="legend">
          <span>
            <i className="dot ok" /> On track
          </span>
          <span>
            <i className="dot gate" /> Gate ready
          </span>
          <span>
            <i className="dot miss" /> No log 5+ days
          </span>
        </div>
        <div className="map-grid">
          {SAMPLE_CLIENTS.map((c) => (
            <Link key={c.id} to={`/admin/clients/${c.id}`} className="client-card" style={{ color: "inherit" }}>
              <div className="split">
                <strong>{c.name}</strong>
                <i className={`dot ${c.status}`} />
              </div>
              <p className="fine">
                {c.suburb} · {c.trade}
              </p>
              <p>
                Phase {c.phase} · Day {c.day}
              </p>
              <p className="fine">Last log {c.lastLog}</p>
              <p className="etk">Open client file</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClientFile() {
  const { id } = useParams();
  const c = SAMPLE_CLIENTS.find((x) => x.id === id) || SAMPLE_CLIENTS[0];
  return (
    <div className="admin">
      <Top />
      <div className="admin-body">
        <Link to="/admin/clients" className="fine">
          ← All clients
        </Link>
        <div className="split" style={{ marginTop: 12 }}>
          <h2 className="display">{c.name.toUpperCase()}</h2>
          {c.status === "miss" && <span className="badge">NO LOG 5+ DAYS</span>}
        </div>
        <p className="fine">
          {c.suburb} · {c.trade} · {c.country}
        </p>
        <div className="row-btns" style={{ margin: "16px 0 24px" }}>
          <button className="btn small">EMAIL {c.name.split(" ")[0].toUpperCase()}</button>
          <button className="btn small ghost">SEND KETONE NUDGE</button>
        </div>
        <div className="map-grid">
          {["Knowing your body", "The Dad Bod", "The Liver", "Advanced macros", "The Room"].map((title, i) => {
            const n = i + 1;
            const state = n < c.phase ? "DONE" : n === c.phase ? `DAY ${c.day}` : "LOCKED";
            return (
              <div className="card" key={title}>
                <div className="etk">
                  Phase {n} · {state}
                </div>
                <strong>{title}</strong>
              </div>
            );
          })}
        </div>
        <h3 className="field">Phase 2 → 3 gate</h3>
        <div className="gate-box">
          <div className="stat">
            <span className="field" style={{ margin: 0 }}>
              Morning ketones · 7 days
            </span>
            <b>{c.ketones}</b>
            <p className="fine">Needs most mornings at 0.5 mmol/L or above.</p>
          </div>
          <div className="stat">
            <span className="field" style={{ margin: 0 }}>
              Clean random pings
            </span>
            <b>{c.pings}</b>
          </div>
          <div className="stat">
            <span className="field" style={{ margin: 0 }}>
              Time in Phase 2
            </span>
            <b>{c.day} days</b>
            <p className="fine">A guide, not a countdown</p>
          </div>
        </div>
        <h3 className="field">Team notes</h3>
        <div className="card">{c.notes || "No notes yet."}</div>
      </div>
    </div>
  );
}
