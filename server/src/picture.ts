/* The body picture: a lifelike image of the dad drawn from his scan numbers
   and the looks he picked, by Google's Gemini image model.

   Scan 1 is drawn fresh. Scan 2 and 3 send his Scan 1 picture along as the
   reference, so it is the same man with the new numbers, not a stranger. */

import { SCAN_FIELDS, type ScanKey } from "./scan.ts";

export const LOOK_CHOICES = {
  age: ["30s", "40s", "50s", "60s"],
  skin: ["Light", "Fair", "Olive", "Brown", "Dark"],
  hair: ["Short", "Shaved", "Thinning", "Grey"],
} as const;

export type Looks = { age: string; skin: string; hair: string };
export type PictureInput = {
  scan: Partial<Record<ScanKey, number>>;
  looks: Looks;
  reference?: { mimeType: string; data: string };
};

const SKIN: Record<string, string> = {
  Light: "light, fair-skinned",
  Fair: "fair skin with a light tan",
  Olive: "olive skin",
  Brown: "brown skin",
  Dark: "dark brown skin",
};
const HAIR: Record<string, string> = {
  Short: "short dark hair",
  Shaved: "a shaved head",
  Thinning: "short, thinning hair",
  Grey: "short grey hair",
};

/* Check what the app sent. Numbers outside a real range are dropped; looks
   must be one of the choices; a reference image must be a small JPEG, PNG
   or WebP. */
export function cleanPictureInput(raw: unknown): PictureInput | { error: string } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const scan: Partial<Record<ScanKey, number>> = {};
  for (const k of Object.keys(SCAN_FIELDS) as ScanKey[]) {
    const n = Number(r.scan?.[k]);
    const { min, max } = SCAN_FIELDS[k];
    if (r.scan?.[k] != null && Number.isFinite(n) && n >= min && n <= max) scan[k] = n;
  }
  if (scan.height == null || scan.weight == null || (scan.bf == null && scan.fatMass == null)) {
    return { error: "Your scan needs at least height, weight and body fat to draw your picture." };
  }
  const looks = r.looks || {};
  const pick = <T extends readonly string[]>(list: T, v: unknown, d: T[number]) => (list.includes(v as string) ? (v as string) : d);
  const out: PictureInput = {
    scan,
    looks: { age: pick(LOOK_CHOICES.age, looks.age, "40s"), skin: pick(LOOK_CHOICES.skin, looks.skin, "Olive"), hair: pick(LOOK_CHOICES.hair, looks.hair, "Short") },
  };
  if (r.reference) {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(r.reference));
    if (!m || m[2].length > 6_000_000) return { error: "The earlier picture could not be used. Try again." };
    out.reference = { mimeType: m[1], data: m[2] };
  }
  return out;
}

/* How the numbers read in words. The model draws better from a plain
   description than from a list of figures alone. */
function build(scan: PictureInput["scan"]): string {
  const bf = scan.bf ?? (scan.fatMass && scan.weight ? (scan.fatMass / scan.weight) * 100 : 25);
  const bmi = scan.bmi ?? (scan.weight! / (scan.height! / 100) ** 2);
  const frame = bmi >= 32 ? "a big, heavy frame" : bmi >= 27 ? "a solid, heavy-set frame" : bmi >= 23 ? "a medium, solid frame" : "a lean frame";
  const fat =
    bf >= 32 ? "a lot of soft fat over his whole body, a large round belly that hangs over the waistband, soft chest"
    : bf >= 27 ? "a noticeable belly and soft midsection, some softness at the chest and sides, little muscle definition"
    : bf >= 22 ? "a slight belly and some softness around the waist, muscle shape only faintly visible"
    : bf >= 17 ? "a fairly flat stomach with a little softness at the waist, some visible muscle shape in the arms and shoulders"
    : bf >= 13 ? "a flat stomach with faint ab outlines, visible muscle shape in shoulders, arms and chest"
    : "a lean, defined body with visible abs and clear muscle definition";
  const vis = scan.visceral;
  const middle =
    vis == null ? ""
    : vis >= 15 ? " He carries his fat deep in the middle: a firm, round, protruding belly, wide waist compared to his hips."
    : vis >= 10 ? " He carries extra weight around the middle: the belly pushes out and the waist is thick."
    : vis >= 6 ? " A little extra around the middle, but the waist is fairly trim."
    : " Trim around the middle.";
  const muscle = scan.muscle;
  const build =
    muscle == null ? ""
    : muscle >= 70 ? " Broad shoulders and plenty of muscle under the fat: arms and thighs are thick and strong."
    : muscle >= 60 ? " Average-to-good muscle: solid shoulders, arms and legs."
    : " Not much muscle: narrow shoulders, thin arms and legs.";
  return `${frame}, ${fat}.${middle}${build}`;
}

const STYLE =
  "Photorealistic full-body studio photograph, head to feet in frame, front view, standing straight and relaxed, arms by his sides, looking at the camera with a calm neutral expression. Shirtless, wearing plain black training shorts to mid-thigh, barefoot. Plain dark charcoal studio background, soft even studio lighting, sharp focus, natural skin texture. Upright 9:16 image. No text, logos, watermarks, jewellery or tattoos. Respectful, non-sexual, like a fitness assessment photo.";

export function picturePrompt(p: PictureInput): string {
  const s = p.scan;
  const figures = [
    `height ${s.height} cm`,
    `weight ${s.weight} kg`,
    s.bf != null ? `body fat ${s.bf}%` : "",
    s.visceral != null ? `visceral fat level ${s.visceral}` : "",
    s.muscle != null ? `muscle mass ${s.muscle} kg` : "",
    s.waist != null ? `waist ${s.waist} cm` : "",
    s.hip != null ? `hips ${s.hip} cm` : "",
  ].filter(Boolean).join(", ");
  if (p.reference) {
    return `This is the same man as in the reference photo. Keep his face, head, hair, skin tone, height, pose, shorts, lighting, background and camera framing exactly the same. Change only his body to match his new body scan: ${figures}. He now has ${build(s)} Show the change honestly, neither flattering nor exaggerated. ${STYLE}`;
  }
  return `A man in his ${p.looks.age} with ${SKIN[p.looks.skin]} and ${HAIR[p.looks.hair]}, an ordinary working dad, not a model. His body matches his body scan: ${figures}. He has ${build(s)} Draw him true to these numbers, neither flattering nor exaggerated. ${STYLE}`;
}

export type GeminiImage = { mimeType: string; data: string };

/* Ask Gemini for the picture. REST generateContent with an image response. */
export async function drawPicture(p: PictureInput, key: string, model: string): Promise<GeminiImage | { error: string; status: number; detail?: string }> {
  const parts: any[] = [{ text: picturePrompt(p) }];
  if (p.reference) parts.push({ inlineData: { mimeType: p.reference.mimeType, data: p.reference.data } });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "9:16" } },
    }),
  });
  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: "draw_failed", status: res.status, detail: String(body?.error?.message || "").slice(0, 300) };
  }
  for (const c of body.candidates || []) {
    for (const part of c?.content?.parts || []) {
      const img = part.inlineData || part.inline_data;
      if (img?.data) return { mimeType: img.mimeType || img.mime_type || "image/png", data: img.data };
    }
  }
  const reason = body?.promptFeedback?.blockReason || body?.candidates?.[0]?.finishReason || "no_image";
  return { error: "no_image", status: 422, detail: String(reason) };
}
