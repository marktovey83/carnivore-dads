import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { AppState } from "./state";
import { CheckEmail, Login, Reset, SetPassword } from "./screens/Entry";
import { Account, BajaSalt, BodyScan, Factory, Ketones, Phase1, Shop, Videos } from "./screens/AppScreens";
import { AdminLogin, ClientFile, Clients } from "./admin/Admin";

function App() {
  return (
    <AppState>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/app/phase-1" element={<Phase1 />} />
          <Route path="/app/factory" element={<Factory />} />
          <Route path="/app/scan" element={<BodyScan />} />
          <Route path="/app/kit/baja-salt" element={<BajaSalt />} />
          <Route path="/app/videos" element={<Videos />} />
          <Route path="/app/ketones" element={<Ketones />} />
          <Route path="/app/shop" element={<Shop />} />
          <Route path="/app/account" element={<Account />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/clients/:id" element={<ClientFile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppState>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
