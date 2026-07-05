import { NextResponse } from "next/server";
import {
  createUser,
  getUserByEmail,
  getUserByGoogleId,
  linkGoogleId,
} from "../../../../../lib/db.js";
import { startSession, setAuthCookie } from "../../../../../lib/auth.js";

function loginFailed(request, reason) {
  console.error("[google-oauth]", reason);
  return NextResponse.redirect(new URL("/login?error=google_failed", request.url));
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = request.cookies.get("dd_oauth_state")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return loginFailed(request, "missing code or state mismatch");
  }

  const appUrl = process.env.APP_URL || url.origin;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  }).catch(() => null);

  if (!tokenResponse?.ok) return loginFailed(request, "token exchange failed");
  const tokens = await tokenResponse.json();

  // The id_token arrived directly from Google over TLS in the exchange above,
  // so decoding its payload without a JWKS signature check is safe here.
  let claims;
  try {
    claims = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64url").toString("utf-8"),
    );
  } catch {
    return loginFailed(request, "bad id_token");
  }

  const { sub: googleId, email, name, email_verified: emailVerified } = claims;
  if (!googleId || !email || !emailVerified) {
    return loginFailed(request, "unverified google account");
  }

  let user = getUserByGoogleId(googleId);
  if (!user) {
    const existing = getUserByEmail(email);
    if (existing) {
      linkGoogleId(existing.id, googleId);
      user = existing;
    } else {
      user = createUser({ name: name || email.split("@")[0], email, googleId });
    }
  }

  const token = startSession(user.id);
  // First-time / unverified Google users verify their phone before chatting.
  const destination = user.phoneVerified ? "/chat" : "/verify";
  const response = NextResponse.redirect(new URL(destination, request.url));
  setAuthCookie(response, token);
  response.cookies.set("dd_oauth_state", "", { path: "/", maxAge: 0 });
  return response;
}
