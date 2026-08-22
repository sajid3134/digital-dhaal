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

// Sends a verification code by the user's chosen channel: phone SMS or email.
// DEMO MODE for both — the code is printed to the server terminal instead of
// being sent. To go live, replace the console.log with an SMS/email provider.
export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`otp-send:${user.id}`, 4, 10 * 60_000)) {
    return jsonError("অনেকবার কোড পাঠানো হয়েছে — ১০ মিনিট পর আবার চেষ্টা করুন।", 429);
  }

  const body = await request.json().catch(() => ({}));
  const method = body.method === "email" ? "email" : "phone";
  const code = generateOtpCode();

  let destination;
  if (method === "email") {
    // The code goes to the account email — no extra input needed.
    destination = user.email;
    saveOtp(user.id, destination, hashOtp(code, user.id), OTP_TTL_MS, "email");
  } else {
    const phone = cleanString(body.phone, 20);
    if (!isValidBdPhone(phone)) {
      return jsonError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)।", 400);
    }
    destination = phone;
    setUserPhone(user.id, phone);
    saveOtp(user.id, phone, hashOtp(code, user.id), OTP_TTL_MS, "phone");
  }

  console.log(`\n========== OTP (demo mode) ==========`);
  console.log(`  Channel: ${method}   To: ${destination}   Code: ${code}`);
  console.log(`=====================================\n`);

  return NextResponse.json({
    ok: true,
    demo: true,
    method,
    destination: method === "email" ? destination : undefined,
    message: "ডেমো মোড: কোডটি সার্ভার টার্মিনালে দেখুন।",
  });
}
