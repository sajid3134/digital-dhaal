import { NextResponse } from "next/server";
import { setUserPhone, saveOtp } from "../../../../../lib/db.js";
import {
  getUserFromRequest,
  generateOtpCode,
  hashOtp,
} from "../../../../../lib/auth.js";
import { rateLimit } from "../../../../../lib/ratelimit.js";
import {
  isSameOrigin,
  jsonError,
  isValidBdPhone,
  cleanString,
} from "../../../../../lib/security.js";

const OTP_TTL_MS = 5 * 60_000;

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`otp-send:${user.id}`, 3, 10 * 60_000)) {
    return jsonError("অনেকবার কোড পাঠানো হয়েছে — ১০ মিনিট পর আবার চেষ্টা করুন।", 429);
  }

  const body = await request.json().catch(() => ({}));
  const phone = cleanString(body.phone, 20);
  if (!isValidBdPhone(phone)) {
    return jsonError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)।", 400);
  }

  const code = generateOtpCode();
  setUserPhone(user.id, phone);
  saveOtp(user.id, phone, hashOtp(code, user.id), OTP_TTL_MS);

  // DEMO MODE: no SMS gateway wired up yet. The code is printed to the server
  // terminal. To go live, replace this log with an SMS provider call
  // (e.g. SSL Wireless / Twilio) and remove the demo note from the response.
  console.log(`\n========== OTP (demo mode) ==========`);
  console.log(`  Phone: ${phone}   Code: ${code}`);
  console.log(`=====================================\n`);

  return NextResponse.json({
    ok: true,
    demo: true,
    message: "ডেমো মোড: কোডটি সার্ভার টার্মিনালে দেখুন।",
  });
}
