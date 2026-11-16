/* The twelve Technogym Checkup numbers the app's scan page holds, with the
   range a real adult reading could fall in. A number outside its range is
   treated as misread and sent back empty, so the dad types it himself
   rather than locking in a wrong number. */

export const SCAN_FIELDS = {
  height: { label: "Height", unit: "cm", min: 120, max: 230 },
  weight: { label: "Weight", unit: "kg", min: 35, max: 300 },
  bf: { label: "Body fat", unit: "%", min: 2, max: 70 },
  visceral: { label: "Visceral fat", unit: "level", min: 1, max: 60 },
  fatMass: { label: "Fat mass", unit: "kg", min: 1, max: 200 },
  muscle: { label: "Muscle / lean mass", unit: "kg", min: 15, max: 150 },
  bone: { label: "Bone mineral", unit: "kg", min: 0.5, max: 8 },
  water: { label: "Body water", unit: "%", min: 25, max: 80 },
  phaseAngle: { label: "Phase angle", unit: "°", min: 2, max: 15 },
  waist: { label: "Waist", unit: "cm", min: 40, max: 220 },
  hip: { label: "Hip", unit: "cm", min: 50, max: 220 },
  bmi: { label: "BMI", unit: "", min: 12, max: 80 },
} as const;

export type ScanKey = keyof typeof SCAN_FIELDS;
export const SCAN_KEYS = Object.keys(SCAN_FIELDS) as ScanKey[];

/* The shape Claude must answer in. Every field is present; a number it cannot
   read cleanly off the report is null. */
export const SCAN_SCHEMA = {
  type: "object",
  properties: {
    is_body_composition_report: {
      type: "boolean",
      description: "True only if the document is a body composition or body scan report.",
    },
    fields: {
      type: "object",
      properties: Object.fromEntries(
        SCAN_KEYS.map((k) => [
          k,
          {
            type: ["number", "null"],
            description: `${SCAN_FIELDS[k].label}${SCAN_FIELDS[k].unit ? ` in ${SCAN_FIELDS[k].unit}` : ""}, exactly as printed (converted to these units if printed in others), or null if not clearly printed.`,
          },
        ]),
      ),
      required: SCAN_KEYS,
      additionalProperties: false,
    },
    converted: {
      type: "array",
      items: { type: "string", enum: SCAN_KEYS },
      description: "Fields whose value was converted from another unit (for example pounds or inches).",
    },
  },
  required: ["is_body_composition_report", "fields", "converted"],
  additionalProperties: false,
} as const;

export const SCAN_SYSTEM = `You read body composition scan reports (Technogym Checkup and similar machines) for the Carnivore Dads app.

Copy numbers off the report exactly as printed. These numbers lock into a man's health record, so a wrong number is worse than an empty one.

- Only fill a field when the number is clearly printed on the report for that measurement. If it is missing, cut off, blurry or ambiguous, use null. Never estimate, calculate or infer a value that is not printed.
- Use the current/measured value, not a target, ideal range, previous result or change figure.
- Units: height, waist and hip in cm; weight, fat mass, muscle and bone in kg; body fat and body water in percent; phase angle in degrees. If the report prints another unit (lb, in, litres of water), convert to these units and list the field in "converted". Body water in litres cannot be converted to percent unless the percent is printed: use null.
- Visceral fat is the machine's visceral fat level or rating as printed (a plain number, not kg or cm²). If only an area in cm² is printed, use null.
- "Muscle" is skeletal muscle mass or lean/fat-free mass, whichever the report prints. Prefer skeletal muscle mass if both are printed.
- If the document is not a body composition report, set is_body_composition_report to false and every field to null.`;

export type ScanResult = {
  fields: Partial<Record<ScanKey, number>>;
  missing: ScanKey[];
  rejected: ScanKey[];
  converted: ScanKey[];
};

/* Turn Claude's answer into what the app gets: numbers inside their range,
   rounded to the step the scan page uses, and lists of what was missing or
   thrown out so the app can tell him which boxes to type. */
export function cleanScan(raw: unknown): ScanResult | { notReport: true } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (r.is_body_composition_report !== true) return { notReport: true };
  const f = (r.fields && typeof r.fields === "object" ? r.fields : {}) as Record<string, unknown>;
  const out: ScanResult = { fields: {}, missing: [], rejected: [], converted: [] };
  for (const k of SCAN_KEYS) {
    const v = f[k];
    if (v === null || v === undefined || v === "") {
      out.missing.push(k);
      continue;
    }
    const n = typeof v === "number" ? v : Number(v);
    const { min, max } = SCAN_FIELDS[k];
    if (!Number.isFinite(n) || n < min || n > max) {
      out.rejected.push(k);
      continue;
    }
    out.fields[k] = Math.round(n * (k === "bone" ? 100 : 10)) / (k === "bone" ? 100 : 10);
  }
  if (Array.isArray(r.converted)) {
    out.converted = r.converted.filter((k): k is ScanKey => SCAN_KEYS.includes(k as ScanKey) && k in out.fields);
  }
  return out;
}
