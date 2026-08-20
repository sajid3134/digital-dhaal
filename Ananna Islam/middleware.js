import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

/**
 * Constant-time string comparison.
 * Uses only Web APIs so it remains compatible with the Edge runtime.
 */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  const maxLength = Math.max(a.length, b.length);
  let difference = a.length === b.length ? 0 : 1;

  for (let i = 0; i < maxLength; i++) {
    difference |=
      (a.charCodeAt(i) || 0) ^
      (b.charCodeAt(i) || 0);
  }

  return difference === 0;
}

export function middleware(request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const authorization = request.headers.get("authorization");

  // No configured password means admin routes remain protected.
  if (!expectedPassword) {
    return unauthorizedResponse();
  }

  if (authorization?.startsWith("Basic ")) {
    const encodedCredentials = authorization.slice("Basic ".length);

    try {
      const decodedCredentials = atob(encodedCredentials);
      const separatorIndex = decodedCredentials.indexOf(":");

      if (separatorIndex !== -1) {
        const password = decodedCredentials.slice(separatorIndex + 1);

        if (safeEqual(password, expectedPassword)) {
          return NextResponse.next();
        }
      }
    } catch {
      // Invalid Base64 credentials — continue to 401 response.
    }
  }

  return unauthorizedResponse();
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Digital Dhaal Admin"',
      "Cache-Control": "no-store",
    },
  });
}
