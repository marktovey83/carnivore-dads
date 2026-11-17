import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanPictureInput, picturePrompt } from "../src/picture.ts";
import worker from "../src/index.ts";

const scan = { height: 180, weight: 104, bf: 31, visceral: 15, muscle: 64, waist: 108 };
const looks = { age: "40s", skin: "Olive", hair: "Short" };

test("needs height, weight and body fat", () => {
  assert.ok("error" in cleanPictureInput({ scan: { height: 180 }, looks }));
  assert.ok(!("error" in cleanPictureInput({ scan, looks })));
});

test("drops impossible numbers and unknown looks", () => {
  const r = cleanPictureInput({ scan: { ...scan, waist: 9999 }, looks: { age: "teen", skin: "<script>", hair: "Grey" } });
  if ("error" in r) throw new Error(r.error);
  assert.equal(r.scan.waist, undefined);
  assert.deepEqual(r.looks, { age: "40s", skin: "Olive", hair: "Grey" });
});

test("first picture describes him from his looks and numbers", () => {
  const r = cleanPictureInput({ scan, looks });
  if ("error" in r) throw new Error(r.error);
  const p = picturePrompt(r);
  assert.match(p, /in his 40s with olive skin and short dark hair/);
  assert.match(p, /weight 104 kg/);
  assert.match(p, /visceral fat level 15/);
  assert.match(p, /noticeable belly/);
  assert.doesNotMatch(p, /reference/);
});

test("later pictures keep the same man and change only the body", () => {
  const r = cleanPictureInput({ scan: { ...scan, weight: 91, bf: 21, visceral: 7 }, looks, reference: "data:image/png;base64,iVBORw0KGgo=" });
  if ("error" in r) throw new Error(r.error);
  const p = picturePrompt(r);
  assert.match(p, /same man as in the reference photo/);
  assert.match(p, /weight 91 kg/);
  assert.match(p, /waist is fairly trim/);
});

test("rejects a reference that is not an image", () => {
  assert.ok("error" in cleanPictureInput({ scan, looks, reference: "data:text/html;base64,PGh0bWw+" }));
});

const ORIGIN = "https://marktovey83.github.io";
const post = (body: unknown) => new Request("https://server.example/body/picture", { method: "POST", body: JSON.stringify(body), headers: { Origin: ORIGIN, "Content-Type": "application/json" } });

test("says pictures are not switched on without the Gemini key and model", async () => {
  const r = await worker.fetch(post({ scan, looks }), { ALLOWED_ORIGINS: ORIGIN } as any);
  assert.equal(r.status, 503);
});

test("draws a picture and sends it back to the phone", async () => {
  const real = globalThis.fetch;
  let sent: any = null, url = "";
  globalThis.fetch = (async (u: any, init: any) => {
    url = String(u); sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { mimeType: "image/png", data: "iVBORw0KGgo=" } }] } }] }), { status: 200 });
  }) as typeof fetch;
  try {
    const r = await worker.fetch(post({ scan, looks }), { ALLOWED_ORIGINS: ORIGIN, GEMINI_API_KEY: "k", GEMINI_IMAGE_MODEL: "test-image-model" } as any);
    assert.equal(r.status, 200);
    const body: any = await r.json();
    assert.equal(body.image, "data:image/png;base64,iVBORw0KGgo=");
    assert.match(url, /models\/test-image-model:generateContent$/);
    assert.deepEqual(sent.generationConfig.responseModalities, ["IMAGE"]);
    assert.equal(sent.generationConfig.imageConfig.aspectRatio, "9:16");
  } finally {
    globalThis.fetch = real;
  }
});

test("a blocked or failed picture comes back as a message", async () => {
  const real = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify({ promptFeedback: { blockReason: "SAFETY" } }), { status: 200 })) as typeof fetch;
  try {
    const r = await worker.fetch(post({ scan, looks }), { ALLOWED_ORIGINS: ORIGIN, GEMINI_API_KEY: "k", GEMINI_IMAGE_MODEL: "m" } as any);
    assert.equal(r.status, 502);
    const body: any = await r.json();
    assert.equal(body.detail, "SAFETY");
  } finally {
    globalThis.fetch = real;
  }
});
