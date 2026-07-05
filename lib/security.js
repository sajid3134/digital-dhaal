import { NextResponse } from "next/server";

// Same-origin check for state-changing requests. sameSite=lax cookies already
// block most CSRF; this closes the rest without needing token plumbing.
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl, server-side)
  try {
    return new URL(origin).host === request.headers.get("host");
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
