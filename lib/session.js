import { randomUUID } from "node:crypto";

const COOKIE_NAME = "dd_session";

export function readSessionId(request) {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function newSessionId() {
  return randomUUID();
}

export function ensureSessionCookie(response, sessionId) {
  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
