import { NextResponse } from "next/server";
import { getCaseById, saveBreachCheck } from "../../../lib/db.js";
import { getUserFromRequest } from "../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../lib/ratelimit.js";
import {
  isSameOrigin,
  jsonError,
  isValidEmail,
  isValidBdPhone,
  cleanString,
} from "../../../lib/security.js";

// Free, no-key breach lookup. We query it server-side so the browser never
// talks to a third party directly (keeps the same-origin CSP intact) and so
// the result can be stored on the case for the engineer.
const XPOSED_ENDPOINT = "https://api.xposedornot.com/v1/check-email/";
const SOURCE = "XposedOrNot";
const MAX_BREACHES = 60;

async function lookupEmail(email) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(XPOSED_ENDPOINT + encodeURIComponent(email), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    // 404 = the email isn't in any known breach — an honest "all clear".
    if (res.status === 404) return { status: "clean", breaches: [] };
    if (!res.ok) return { status: "error", breaches: [] };

    const data = await res.json().catch(() => null);
    const raw = Array.isArray(data?.breaches) ? data.breaches.flat() : [];
    const breaches = [...new Set(raw.filter((b) => typeof b === "string"))].slice(
      0,
      MAX_BREACHES,
    );
    if (breaches.length === 0) return { status: "clean", breaches: [] };
    return { status: "found", breaches };
  } catch {
    // Timeout / network error — never pretend it was clean.
    return { status: "error", breaches: [] };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`breach:${user.id}:${getClientIp(request)}`, 10, 10 * 60_000)) {
    return jsonError("Too many checks — try again in a few minutes.", 429);
  }

  const body = await request.json().catch(() => ({}));
  const caseId = cleanString(body.caseId, 64);
  const query = cleanString(body.query, 120);

  // The case must exist and belong to the signed-in user.
  const caseRow = getCaseById(caseId);
  if (!caseRow) return jsonError("Case not found", 404);
  if (caseRow.userId && caseRow.userId !== user.id) {
    return jsonError("Forbidden", 403);
  }

  const isEmail = isValidEmail(query);
  const isPhone = !isEmail && isValidBdPhone(query.replace(/[\s-]/g, ""));
  if (!isEmail && !isPhone) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const normalized = isEmail ? query.toLowerCase() : query.replace(/[\s-]/g, "");
  const outcome = isEmail
    ? await lookupEmail(normalized)
    : { status: "unsupported", breaches: [] };

  const result = {
    query: normalized,
    status: outcome.status,
    breaches: outcome.breaches,
    source: SOURCE,
    checkedAt: new Date().toISOString(),
  };

  // Persist everything except transient errors so the engineer sees a stable
  // record; an error is returned to the client but not written to the case.
  if (outcome.status !== "error") {
    saveBreachCheck(caseId, result);
  }

  return NextResponse.json(result);
}
