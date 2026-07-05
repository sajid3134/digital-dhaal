import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "../../../../lib/db.js";
import { hashPassword, startSession, setAuthCookie } from "../../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../../lib/ratelimit.js";
import {
  isSameOrigin,
  jsonError,
  isValidEmail,
  cleanString,
} from "../../../../lib/security.js";

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);
  if (!rateLimit(`register:${getClientIp(request)}`, 10, 15 * 60_000)) {
    return jsonError("Too many attempts. Please wait a while.", 429);
  }

  const body = await request.json().catch(() => ({}));
  const name = cleanString(body.name, 80);
  const email = cleanString(body.email, 254);
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2) return jsonError("নাম দিন (কমপক্ষে ২ অক্ষর)।", 400);
  if (!isValidEmail(email)) return jsonError("সঠিক ইমেইল ঠিকানা দিন।", 400);
  if (password.length < 8)
    return jsonError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।", 400);

  if (getUserByEmail(email)) {
    return jsonError("এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে — লগইন করুন।", 409);
  }

  const user = createUser({ name, email, passwordHash: hashPassword(password) });
  const token = startSession(user.id);

  const response = NextResponse.json({ ok: true, name: user.name });
  setAuthCookie(response, token);
  return response;
}
