import { NextResponse } from "next/server";
import {
  getOtp,
  bumpOtpAttempts,
  deleteOtp,
  markPhoneVerified,
} from "../../../../../lib/db.js";
import { getUserFromRequest, hashOtp } from "../../../../../lib/auth.js";
import { isSameOrigin, jsonError, cleanString } from "../../../../../lib/security.js";

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  const body = await request.json().catch(() => ({}));
  const code = cleanString(body.code, 6);
  if (!/^\d{6}$/.test(code)) return jsonError("৬ সংখ্যার কোডটি দিন।", 400);

  const otp = getOtp(user.id);
  if (!otp) return jsonError("কোনো কোড পাঠানো হয়নি — আগে কোড পাঠান।", 400);
  if (new Date(otp.expires_at) < new Date()) {
    deleteOtp(user.id);
    return jsonError("কোডের মেয়াদ শেষ — নতুন কোড পাঠান।", 400);
  }
  if (otp.attempts >= 5) {
    deleteOtp(user.id);
    return jsonError("অনেকবার ভুল হয়েছে — নতুন কোড পাঠান।", 429);
  }

  if (hashOtp(code, user.id) !== otp.code_hash) {
    bumpOtpAttempts(user.id);
    return jsonError("কোডটি সঠিক নয়।", 400);
  }

  deleteOtp(user.id);
  markPhoneVerified(user.id);
  return NextResponse.json({ ok: true });
}
