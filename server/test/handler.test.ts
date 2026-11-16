import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.ts";

const ORIGIN = "https://marktovey83.github.io";
const env = { ANTHROPIC_API_KEY: "test-key", ALLOWED_ORIGINS: ORIGIN };

function post(file?: File, origin = ORIGIN) {
  const form = new FormData();
  if (file) form.append("file", file);
  return new Request("https://server.example/scan/read", { method: "POST", body: form, headers: { Origin: origin } });
}

/* Stand in for the Anthropic API so the test spends nothing. */
function fakeClaude(answer: unknown, stop = "end_turn") {
  const real = globalThis.fetch;
  let sent: any = null;
  globalThis.fetch = (async (_url: any, init: any) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({
      id: "msg_test", type: "message", role: "assistant", model: "claude-opus-5-5",
      content: [{ type: "text", text: JSON.stringify(answer) }],
      stop_reason: stop, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 },
    }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { restore: () => (globalThis.fetch = real), sent: () => sent };
}

const png = () => new File([new Uint8Array([137, 80, 78, 71])], "scan.png", { type: "image/png" });

test("refuses other websites", async () => {
  const r = await worker.fetch(post(png(), "https://evil.example"), env);
  assert.equal(r.status, 403);
});

test("asks for a file when none came", async () => {
  const r = await worker.fetch(post(), env);
  assert.equal(r.status, 400);
});

test("refuses files that are not a PDF or photo", async () => {
  const r = await worker.fetch(post(new File(["x"], "a.txt", { type: "text/plain" })), env);
  assert.equal(r.status, 415);
});

test("reads a report and sends back the numbers", async () => {
  const blank = { height: null, weight: null, bf: null, visceral: null, fatMass: null, muscle: null, bone: null, water: null, phaseAngle: null, waist: null, hip: null, bmi: null };
  const fake = fakeClaude({ is_body_composition_report: true, fields: { ...blank, weight: 95, bf: 24.6, visceral: 12.4 }, converted: [] });
  try {
    const r = await worker.fetch(post(png()), env);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("Access-Control-Allow-Origin"), ORIGIN);
    const body: any = await r.json();
    assert.deepEqual(body.fields, { weight: 95, bf: 24.6, visceral: 12.4 });
    assert.equal(body.missing.length, 9);
    const sent = fake.sent();
    assert.equal(sent.model, "claude-opus-5-5");
    assert.equal(sent.output_config.format.type, "json_schema");
    assert.equal(sent.messages[0].content[0].type, "image");
  } finally {
    fake.restore();
  }
});

test("says so when the file is not a scan report", async () => {
  const fake = fakeClaude({ is_body_composition_report: false, fields: {}, converted: [] });
  try {
    const r = await worker.fetch(post(png()), env);
    assert.equal(r.status, 422);
  } finally {
    fake.restore();
  }
});

test("a refusal comes back as unreadable, not an error page", async () => {
  const fake = fakeClaude({}, "refusal");
  try {
    const r = await worker.fetch(post(png()), env);
    assert.equal(r.status, 422);
  } finally {
    fake.restore();
  }
});
