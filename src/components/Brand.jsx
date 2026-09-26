import { Link } from "react-router-dom";
import { COUNTRIES } from "../data";

function Flag({ code }) {
  const c = code || "AU";
  return (
    <svg viewBox="0 0 60 30" width="42" height="21" aria-hidden="true">
      {c === "AU" && (
        <>
          <rect width="60" height="30" fill="#012169" />
          <rect width="30" height="15" fill="#012169" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#fff" strokeWidth="2.2" fill="none" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#C8102E" strokeWidth="1.1" fill="none" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#fff" strokeWidth="3.6" fill="none" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#C8102E" strokeWidth="2" fill="none" />
          <circle cx="15" cy="23" r="2.4" fill="#fff" />
          <circle cx="46" cy="20" r="1.5" fill="#fff" />
          <circle cx="40" cy="10" r="1.5" fill="#fff" />
          <circle cx="46.5" cy="5" r="1.5" fill="#fff" />
          <circle cx="52.5" cy="12" r="1.3" fill="#fff" />
        </>
      )}
      {c === "NZ" && (
        <>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#fff" strokeWidth="2.2" fill="none" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#fff" strokeWidth="3.6" fill="none" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#C8102E" strokeWidth="2" fill="none" />
          <circle cx="45" cy="7" r="2" fill="#fff" />
          <circle cx="45" cy="7" r="1.1" fill="#C8102E" />
          <circle cx="51" cy="14" r="2" fill="#fff" />
          <circle cx="51" cy="14" r="1.1" fill="#C8102E" />
          <circle cx="39" cy="16.5" r="2" fill="#fff" />
          <circle cx="39" cy="16.5" r="1.1" fill="#C8102E" />
          <circle cx="46" cy="23" r="2" fill="#fff" />
          <circle cx="46" cy="23" r="1.1" fill="#C8102E" />
        </>
      )}
      {c === "GB" && (
        <>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" fill="none" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3.4" fill="none" />
          <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" fill="none" />
          <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" fill="none" />
        </>
      )}
      {c === "IE" && (
        <>
          <rect width="20" height="30" fill="#169B62" />
          <rect x="20" width="20" height="30" fill="#fff" />
          <rect x="40" width="20" height="30" fill="#FF883E" />
        </>
      )}
      {c === "US" && (
        <>
          <rect width="60" height="30" fill="#fff" />
          {[0, 4.62, 9.23, 13.85, 18.46, 23.08, 27.69].map((y) => (
            <rect key={y} y={y} width="60" height="2.31" fill="#B31942" />
          ))}
          <rect width="24" height="16.15" fill="#0A3161" />
        </>
      )}
      {c === "CA" && (
        <>
          <rect width="60" height="30" fill="#fff" />
          <rect width="15" height="30" fill="#D80621" />
          <rect x="45" width="15" height="30" fill="#D80621" />
          <polygon fill="#D80621" points="30,6.5 31.4,10.3 35,9.6 34,12.6 37.6,11.2 36.2,14.2 39,15.6 36.2,17.2 37.6,20.2 34,18.8 35,21.8 31.4,21.1 30.8,25 29.2,25 28.6,21.1 25,21.8 26,18.8 22.4,20.2 23.8,17.2 21,15.6 23.8,14.2 22.4,11.2 26,12.6 25,9.6 28.6,10.3" />
        </>
      )}
      {c === "ZA" && (
        <>
          <rect width="60" height="30" fill="#007749" />
          <path d="M0,0 L22,15 L0,30 Z" fill="#000" />
          <path d="M0,4 L18,15 L0,26 Z" fill="#FFB81C" />
          <path d="M0,8 L14,15 L0,22 Z" fill="#E03C31" />
          <path d="M8,0 H60 V8 H18 Z" fill="#fff" />
          <path d="M8,22 H60 V30 H18 Z" fill="#fff" />
          <path d="M8,0 H60 V6 H20 Z" fill="#001489" />
          <path d="M8,24 H60 V30 H20 Z" fill="#E03C31" />
        </>
      )}
    </svg>
  );
}

export function BrandLockup({ country = "AU", align = "center", compact = false }) {
  return (
    <div className={`lockup ${align === "left" ? "left" : ""}`}>
      <div className="plates">
        <div className="flag-plate" title={COUNTRIES.find((c) => c.code === country)?.name}>
          <Flag code={country} />
        </div>
        <div className="cd-plate">
          <span>CD</span>
        </div>
      </div>
      <div className="ember-rule" />
      <div className="wordmark">
        <h1 style={{ fontSize: compact ? 22 : 28 }}>CARNIVORE DADS</h1>
        {!compact && <p className="etk">Energy through knowledge</p>}
      </div>
    </div>
  );
}

export function CdPlate({ to, onClick }) {
  const inner = (
    <div className="cd-plate" style={{ width: 36, height: 24, cursor: "pointer" }}>
      <span style={{ fontSize: 13 }}>CD</span>
    </div>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return (
    <button className="linkish" onClick={onClick} aria-label="Open teaching">
      {inner}
    </button>
  );
}
