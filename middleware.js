import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// Constant-time string compare (Edge runtime — no node:crypto here).
function safeEqual(a, b) {
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function middleware(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const auth = request.headers.get("authorization");

  if (expected && auth?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(auth.slice("Basic ".length));
    } catch {
      /* fall through to 401 */
    }
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (password && safeEqual(password, expected)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Digital Dhaal Admin"' },
  });
}
