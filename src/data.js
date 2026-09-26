export const COUNTRIES = [
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "ZA", name: "South Africa" },
];

export const TRADES = [
  "FIFO electrician",
  "Police",
  "Plumber / trades",
  "Truck / long haul",
  "Builder",
  "Office / desk",
  "Other",
];

export const KIT = [
  { id: "ketones", name: "Blood ketone meter and strips" },
  { id: "baja", name: "Baja salt", lesson: "/app/kit/baja-salt" },
  { id: "fish", name: "Fish oil" },
  { id: "mag", name: "Magnesium glycinate" },
  { id: "watch", name: "Smart watch with heart rate" },
  { id: "gym", name: "Gym membership" },
  { id: "scan", name: "Body scan", lesson: "/app/scan" },
];

export const SHOP = [
  { id: "baja", name: "Baja Gold sea salt", price: 18 },
  { id: "fish", name: "Fish oil", price: 32 },
  { id: "mag", name: "Magnesium glycinate", price: 24 },
  { id: "strips", name: "Ketone strips", price: 29 },
  { id: "cap", name: "Inspection-plate cap", price: 35 },
];

export const SAMPLE_CLIENTS = [
  {
    id: "daniel",
    name: "Daniel R.",
    suburb: "Mandurah, WA",
    trade: "FIFO electrician",
    country: "Australia",
    phase: 2,
    day: 11,
    status: "miss",
    lastLog: "6 days ago",
    ketones: "2 of 7",
    pings: "1 of 3",
    notes: "On a two-weeks-on swing. Expect gaps in logging while he's on site — check in when he's back.",
  },
  {
    id: "james",
    name: "James P.",
    suburb: "Fremantle, WA",
    trade: "Builder",
    country: "Australia",
    phase: 1,
    day: 8,
    status: "ok",
    lastLog: "yesterday",
    ketones: "4 of 5",
    pings: "—",
    notes: "",
  },
  {
    id: "tom",
    name: "Tom H.",
    suburb: "Osborne Park, WA",
    trade: "Truck / long haul",
    country: "Australia",
    phase: 2,
    day: 16,
    status: "gate",
    lastLog: "today",
    ketones: "6 of 7",
    pings: "3 of 3",
    notes: "Gate almost met. Morning readings holding.",
  },
];
