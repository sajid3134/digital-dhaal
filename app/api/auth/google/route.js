import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

// Step 1 of Google sign-in: redirect the browser to Google's consent screen.
// Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env (free from
// console.cloud.google.com → Credentials → OAuth client ID → Web application,
// authorized redirect URI: <APP_URL>/api/auth/google/callback).
export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
  }

  const appUrl = process.env.APP_URL || new URL(request.url).origin;
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  );
  // Double-submit state cookie, checked in the callback against CSRF.
  response.cookies.set("dd_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
