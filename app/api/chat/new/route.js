import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth.js";
import { isSameOrigin, jsonError } from "../../../../lib/security.js";

// Start a fresh case: clear the per-case session cookie. The old case stays
// in the database for the engineers; the next message creates a new one.
export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);
  if (!getUserFromRequest(request)) return jsonError("Not signed in", 401);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("dd_session", "", { path: "/", maxAge: 0 });
  return response;
}
