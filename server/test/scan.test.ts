import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanScan, SCAN_KEYS } from "../src/scan.ts";

const blank = Object.fromEntries(SCAN_KEYS.map((k) => [k, null]));

test("keeps numbers in range and rounds them", () => {
  const r = cleanScan({ is_body_composition_report: true, fields: { ...blank, weight: 95.04, bf: 24.62, bone: 3.127, visceral: 12 }, converted: [] });
  assert.ok(!("notReport" in r));
  if ("notReport" in r) return;
  assert.deepEqual(r.fields, { weight: 95, bf: 24.6, bone: 3.13, visceral: 12 });
  assert.equal(r.missing.length, SCAN_KEYS.length - 4);
});

test("throws out impossible numbers rather than locking them in", () => {
  const r = cleanScan({ is_body_composition_report: true, fields: { ...blank, height: 5.11, weight: 210 * 10, bf: -3 }, converted: [] });
  if ("notReport" in r) throw new Error("should be a report");
  assert.deepEqual(r.fields, {});
  assert.deepEqual(r.rejected.sort(), ["bf", "height", "weight"]);
});

test("flags a document that is not a scan report", () => {
  assert.deepEqual(cleanScan({ is_body_composition_report: false, fields: blank, converted: [] }), { notReport: true });
  assert.deepEqual(cleanScan(null), { notReport: true });
});

test("only reports conversions for fields it kept", () => {
  const r = cleanScan({ is_body_composition_report: true, fields: { ...blank, weight: 90, height: 999 }, converted: ["weight", "height", "nonsense"] });
  if ("notReport" in r) throw new Error("should be a report");
  assert.deepEqual(r.converted, ["weight"]);
});
