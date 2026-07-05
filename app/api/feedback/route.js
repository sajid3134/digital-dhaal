import { NextResponse } from "next/server";
import { addFeedback, SUPPORT_TYPES } from "../../../lib/db.js";
import { getUserFromRequest } from "../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../lib/ratelimit.js";
import { isSameOrigin, jsonError, cleanString } from "../../../lib/security.js";

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  if (!rateLimit(`feedback:${getClientIp(request)}`, 5, 60 * 60_000)) {
    return jsonError("Too many submissions — try again later.", 429);
  }

  const body = await request.json().catch(() => ({}));
  const supportType = body.supportType;
  const rating = Number(body.rating);
  const review = cleanString(body.review, 1000);

  if (!SUPPORT_TYPES.includes(supportType)) return jsonError("Invalid type", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return jsonError("Rating must be 1-5", 400);
  }
  if (review.length < 5) return jsonError("Review is required", 400);

  const user = getUserFromRequest(request);
  addFeedback({ userId: user?.id ?? null, supportType, rating, review });

  return NextResponse.json({ ok: true });
}
