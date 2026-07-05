import { NextResponse } from "next/server";
import { getCaseById } from "../../../../lib/db.js";
import { getUserFromRequest } from "../../../../lib/auth.js";
import { ensureSessionCookie } from "../../../../lib/session.js";
import { isSameOrigin, jsonError } from "../../../../lib/security.js";

// Switch the active case (history sidebar). Ownership is enforced —
// a user can only open their own cases.
export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  const body = await request.json().catch(() => ({}));
  const caseId = typeof body.caseId === "string" ? body.caseId : "";
  const caseRow = caseId ? getCaseById(caseId) : null;

  if (!caseRow || caseRow.userId !== user.id) {
    return jsonError("Case not found", 404);
  }

  const response = NextResponse.json({ ok: true });
  ensureSessionCookie(response, caseId);
  return response;
}
