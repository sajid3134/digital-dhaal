import { NextResponse } from "next/server";

// Same-origin check for state-changing requests. sameSite=lax cookies already
// block most CSRF; this closes the rest without needing token plumbing.
// Also accepts x-forwarded-host so the app works behind a tunnel/proxy (e.g.
// a Cloudflare quick tunnel used to share a public link) — the request Host
// may be localhost there, but the forwarded host matches the browser's Origin.
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl, server-side)
  try {
    const originHost = new URL(origin).host;
    const host = request.headers.get("host");
    const forwardedHost = request.headers.get("x-forwarded-host");
    return originHost === host || originHost === forwardedHost;
  } catch {
    return false;
  }
}

export function jsonError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export const isValidEmail = (email) =>
  typeof email === "string" &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Bangladeshi mobile: 01 then operator digit 3-9 then 8 digits.
export const isValidBdPhone = (phone) =>
  typeof phone === "string" && /^01[3-9]\d{8}$/.test(phone);

export const cleanString = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";
