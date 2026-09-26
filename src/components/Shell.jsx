import { NavLink, useNavigate } from "react-router-dom";
import { BrandLockup } from "./Brand";

export function Phone({ children, tabs = false, country = "AU" }) {
  return (
    <div className="desk">
      <div className="desk-bar">
        <span>
          <strong>Carnivore Dads</strong> · factory reset
        </span>
        <NavLink to="/admin">Admin</NavLink>
      </div>
      <div className="phone">
        {children}
        {tabs && <TabBar />}
      </div>
    </div>
  );
}

export function Header({ country, phase }) {
  const nav = useNavigate();
  return (
    <button className="linkish" onClick={() => nav("/app/phase-1")} style={{ width: "100%" }}>
      <BrandLockup country={country} compact={!!phase} />
    </button>
  );
}

export function TabBar() {
  const item = (to, label) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? "on" : "")}>
      {label}
    </NavLink>
  );
  return (
    <nav className="tabs">
      {item("/app/videos", "Videos")}
      {item("/app/ketones", "Ketones")}
      {item("/app/shop", "Shop")}
      {item("/app/account", "Account")}
    </nav>
  );
}
