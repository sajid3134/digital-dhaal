import { NextResponse } from "next/server";
import { setUserKyc } from "../../../lib/db.js";
import { getUserFromRequest } from "../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../lib/ratelimit.js";
import { isSameOrigin, jsonError } from "../../../lib/security.js";

// Prototype identity-check status. This is a DEMO: it never receives or stores
// any image — the client sends only the resulting status flag after its
// simulated match. Real biometric verification would replace this endpoint.
export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`kyc:${user.id}:${getClientIp(request)}`, 10, 10 * 60_000)) {
    return jsonError("Too many attempts — try again shortly.", 429);
  }

  const body = await request.json().catch(() => ({}));
  const status = body.status === "verified" ? "verified" : "none";

  setUserKyc(user.id, status);
  return NextResponse.json({ ok: true, kycStatus: status });
}
