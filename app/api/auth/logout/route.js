import { NextResponse } from "next/server";
import { AUTH_COOKIE, endSession, clearAuthCookie } from "../../../../lib/auth.js";
import { isSameOrigin, jsonError } from "../../../../lib/security.js";

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);
  endSession(request.cookies.get(AUTH_COOKIE)?.value);
  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);
  return response;
}
