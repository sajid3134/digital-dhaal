import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getCaseById,
  addEvidence,
  listEvidence,
  countEvidence,
} from "../../../lib/db.js";
import { getUserFromRequest } from "../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../lib/ratelimit.js";
import { isSameOrigin, jsonError, cleanString } from "../../../lib/security.js";

export const runtime = "nodejs";

const MAX_FILES = 10;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB each
const EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Where evidence images live on disk (data/ is gitignored — never committed).
function caseDir(caseId) {
  return path.join(process.cwd(), "data", "uploads", caseId);
}

// Attach a screenshot to a case. Ownership enforced; capped at MAX_FILES.
export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`evidence:${user.id}:${getClientIp(request)}`, 40, 10 * 60_000)) {
    return jsonError("Too many uploads — try again in a few minutes.", 429);
  }

  const form = await request.formData().catch(() => null);
  if (!form) return jsonError("Bad request", 400);

  const caseId = cleanString(form.get("caseId"), 64);
  const file = form.get("file");
  const caseRow = getCaseById(caseId);
  if (!caseRow) return jsonError("Case not found", 404);
  if (caseRow.userId && caseRow.userId !== user.id) return jsonError("Forbidden", 403);

  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return jsonError("No image provided", 400);
  }
  const ext = EXT[file.type];
  if (!ext) return jsonError("Only image files (PNG, JPG, WEBP, GIF) are allowed.", 415);
  if (file.size > MAX_BYTES) return jsonError("Each image must be under 5 MB.", 413);
  if (countEvidence(caseId) >= MAX_FILES) {
    return jsonError(`You can attach up to ${MAX_FILES} images.`, 409);
  }

  const id = randomUUID();
  const name = `${id}.${ext}`;
  const dir = caseDir(caseId);
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buf);

  addEvidence(caseId, { id, file: name, mime: file.type, size: file.size });

  return NextResponse.json({ ok: true, evidence: listEvidence(caseId) });
}

// Current evidence list for a case the user owns.
export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);
  const caseId = cleanString(new URL(request.url).searchParams.get("caseId"), 64);
  const caseRow = getCaseById(caseId);
  if (!caseRow) return jsonError("Case not found", 404);
  if (caseRow.userId && caseRow.userId !== user.id) return jsonError("Forbidden", 403);
  return NextResponse.json({ evidence: listEvidence(caseId) });
}
