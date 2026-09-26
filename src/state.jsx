import React, { createContext, useContext, useMemo, useState } from "react";
import { KIT } from "./data";

const KEY = "cd-app-state-v1";

const defaults = {
  country: "AU",
  email: "",
  occupation: "",
  height: "180",
  weight: "95",
  address: { street: "", suburb: "", state: "WA", postcode: "", localAds: false },
  watched: {},
  owned: { ketones: true, baja: true },
  scan: { height: "180", weight: "95", bodyFat: "28", visceral: "12", waist: "", hips: "", bmi: "", bfm: "", smm: "", tbw: "", bmr: "" },
  ketones: [],
  paid: false,
};

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaults;
  }
}

const Ctx = createContext(null);

export function AppState({ children }) {
  const [state, setState] = useState(load);
  const api = useMemo(() => {
    const save = (next) => {
      setState(next);
      localStorage.setItem(KEY, JSON.stringify(next));
    };
    return {
      state,
      patch: (partial) => save({ ...state, ...partial }),
      setWatched: (id) => save({ ...state, watched: { ...state.watched, [id]: true } }),
      toggleOwned: (id) => {
        if (!state.watched[id] && id !== "ketones") return;
        save({ ...state, owned: { ...state.owned, [id]: !state.owned[id] } });
      },
      addKetone: (mmol) => save({ ...state, ketones: [...state.ketones, { mmol, at: Date.now() }] }),
    };
  }, [state]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  return useContext(Ctx);
}

export function kitProgress(state) {
  const owned = KIT.filter((item) => state.owned[item.id]).length;
  return { owned, total: KIT.length };
}
