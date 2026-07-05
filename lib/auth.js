import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHash,
  randomUUID,
} from "node:crypto";
import {
  createAuthSession,
  getUserByAuthSession,
  deleteAuthSession,
} from "./db.js";

export const AUTH_COOKIE = "dd_auth";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/* -------------------------- passwords -------------------------- */

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/* --------------------------- sessions --------------------------- */

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export function startSession(userId) {
  const token = randomBytes(32).toString("hex");
  createAuthSession(sha256(token), userId, SESSION_TTL_MS);
  return token;
}

export function endSession(token) {
  if (token) deleteAuthSession(sha256(token));
}

export function userFromToken(token) {
  if (!token) return null;
  return getUserByAuthSession(sha256(token));
}

// For route handlers (NextRequest).
export function getUserFromRequest(request) {
  return userFromToken(request.cookies.get(AUTH_COOKIE)?.value);
}

// For server components (pass the awaited cookies() store).
export function getUserFromCookieStore(cookieStore) {
  return userFromToken(cookieStore.get(AUTH_COOKIE)?.value);
}

export function setAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
}

/* ----------------------------- OTP ------------------------------ */

export function generateOtpCode() {
  // 6 digits, cryptographically random, no modulo bias worth caring about here.
  return String(100000 + (randomBytes(4).readUInt32BE(0) % 900000));
}

export const hashOtp = (code, userId) => sha256(`${userId}:${code}`);

export { randomUUID };
