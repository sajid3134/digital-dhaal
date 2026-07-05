import { NextResponse } from "next/server";
import { getUserByEmail } from "../../../../lib/db.js";
import {
  verifyPassword,
  startSession,
  setAuthCookie,
} from "../../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../../lib/ratelimit.js";
import { isSameOrigin, jsonError, cleanString } from "../../../../lib/security.js";

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);
  if (!rateLimit(`login:${getClientIp(request)}`, 10, 15 * 60_000)) {
    return jsonError("Too many attempts. Please wait a while.", 429);
  }

  const body = await request.json().catch(() => ({}));
  const email = cleanString(body.email, 254);
  const password = typeof body.password === "string" ? body.password : "";

  const user = email ? getUserByEmail(email) : null;
  // Same error for wrong email vs wrong password — no account enumeration.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return jsonError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।", 401);
  }

  const token = startSession(user.id);
  const response = NextResponse.json({ ok: true, name: user.name });
  setAuthCookie(response, token);
  return response;
}
