/* Carnivore Dads server. One job for now: read a body scan report.

   POST /scan/read with a form field "file" (PDF, PNG, JPEG or WebP, up to
   10 MB). Answers with the twelve scan numbers it could read, and which
   ones it could not. Nothing is stored: the file is read, sent to Claude,
   and dropped. */

import Anthropic from "@anthropic-ai/sdk";
import { SCAN_SCHEMA, SCAN_SYSTEM, cleanScan } from "./scan.ts";

export interface Env {
  ANTHROPIC_API_KEY: string;
  /* Comma-separated origins allowed to call this server, e.g. the GitHub
     Pages site. Set in wrangler.toml. */
  ALLOWED_ORIGINS: string;
  /* Cloudflare rate limit binding: caps reads per visitor. */
  SCAN_LIMIT?: RateLimit;
}

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, "pdf" | "image"> = {
  "application/pdf": "pdf",
  "image/png": "image",
  "image/jpeg": "image",
  "image/webp": "image",
};

export default {
  /* Every answer goes out with the CORS header, even a crash, so the app
     can show what went wrong instead of "no connection". */
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      return await handle(req, env);
    } catch (err) {
      console.error("scan reader crashed", err);
      const origin = req.headers.get("Origin") || "";
      const ok = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).includes(origin);
      return new Response(JSON.stringify({ error: "server_error", message: "The reader hit a problem. Type the numbers for now." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...(ok ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) },
      });
    }
  },
};

async function handle(req: Request, env: Env): Promise<Response> {
  {
    const origin = req.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
    const cors: Record<string, string> = allowed.includes(origin)
      ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
      : {};
    const json = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

    const url = new URL(req.url);
    // A page anyone can open to see the server is up and has its key. It
    // says whether the key is there, never what it is.
    if (url.pathname === "/health") {
      return json(200, { ok: true, reader: "scan", key_set: Boolean(env.ANTHROPIC_API_KEY) });
    }
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: allowed.includes(origin) ? 204 : 403,
        headers: { ...cors, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" },
      });
    }
    if (url.pathname !== "/scan/read") return json(404, { error: "not_found" });
    if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
    if (!allowed.includes(origin)) return json(403, { error: "origin_not_allowed" });

    if (env.SCAN_LIMIT) {
      const who = req.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.SCAN_LIMIT.limit({ key: who });
      if (!success) return json(429, { error: "too_many", message: "That is a lot of reports in a short time. Try again in a minute." });
    }

    let file: File | null = null;
    try {
      const form = await req.formData();
      const f = form.get("file");
      file = f instanceof File ? f : null;
    } catch {
      file = null;
    }
    if (!file) return json(400, { error: "no_file", message: "No report came through. Pick the file again." });
    const kind = TYPES[file.type];
    if (!kind) return json(415, { error: "bad_type", message: "Send a PDF or a photo (JPG, PNG or WebP)." });
    if (file.size > MAX_BYTES) return json(413, { error: "too_big", message: "That file is over 10 MB. Try a photo of the page instead." });

    if (!env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set on the worker");
      return json(503, { error: "not_set_up", message: "The reader is not set up yet. Type the numbers for now." });
    }

    const data = toBase64(await file.arrayBuffer());
    const source =
      kind === "pdf"
        ? ({ type: "document", source: { type: "base64", media_type: "application/pdf", data } } as const)
        : ({ type: "image", source: { type: "base64", media_type: file.type as "image/png" | "image/jpeg" | "image/webp", data } } as const);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    let response;
    try {
      response = await client.beta.messages.create({
        model: "claude-opus-5-5",
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "medium", format: { type: "json_schema", schema: SCAN_SCHEMA } },
        system: SCAN_SYSTEM,
        messages: [
          {
            role: "user",
            content: [source, { type: "text", text: "Read the body composition numbers off this report." }],
          },
        ],
      });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) return json(503, { error: "busy", message: "The reader is busy. Try again in a minute." });
      if (err instanceof Anthropic.BadRequestError) return json(422, { error: "unreadable", message: "That file could not be read. Try a clearer photo of the page." });
      if (err instanceof Anthropic.APIError) return json(502, { error: "reader_failed", message: "The reader could not finish. Type the numbers for now." });
      throw err;
    }

    if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens") {
      return json(422, { error: "unreadable", message: "That report could not be read. Type the numbers for now." });
    }
    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json(502, { error: "reader_failed", message: "The reader could not finish. Type the numbers for now." });
    }
    const result = cleanScan(parsed);
    if ("notReport" in result) {
      return json(422, { error: "not_a_scan", message: "That does not look like a body scan report. Check you picked the right file." });
    }
    return json(200, result);
  }
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
