import { NextResponse } from "next/server";

import { createUser, getUserByEmail } from "../../../../lib/db.js";
import {
  hashPassword,
  startSession,
  setAuthCookie,
} from "../../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../../lib/ratelimit.js";
import {
  isSameOrigin,
  jsonError,
  isValidEmail,
  cleanString,
} from "../../../../lib/security.js";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(request) {
  // CSRF protection
  if (!isSameOrigin(request)) {
    return jsonError("Forbidden", 403);
  }

  // Rate limiting
  const clientIp = getClientIp(request);
  const allowed = rateLimit(
    `register:${clientIp}`,
    10,
    15 * 60_000,
  );

  if (!allowed) {
    return jsonError(
      "Too many attempts. Please wait a while.",
      429,
    );
  }

  // Parse request body safely
  const body = await request.json().catch(() => ({}));

  const name = cleanString(body.name, MAX_NAME_LENGTH);
  const email = cleanString(body.email, MAX_EMAIL_LENGTH);
  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  // Validation
  if (name.length < 2) {
    return jsonError(
      "নাম দিন (কমপক্ষে ২ অক্ষর)।",
      400,
    );
  }

  if (!isValidEmail(email)) {
    return jsonError(
      "সঠিক ইমেইল ঠিকানা দিন।",
      400,
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return jsonError(
      "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
      400,
    );
  }

  // Prevent duplicate accounts
  if (getUserByEmail(email)) {
    return jsonError(
      "এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে — লগইন করুন।",
      409,
    );
  }

  // Create user
  const user = createUser({
    name,
    email,
    passwordHash: hashPassword(password),
  });

  // Create session
  const sessionToken = startSession(user.id);

  const response = NextResponse.json({
    ok: true,
    name: user.name,
  });

  setAuthCookie(response, sessionToken);

  return response;
}
