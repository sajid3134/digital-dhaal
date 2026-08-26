import { readEvidence } from "../../../../../lib/evidence.js";
import { jsonError } from "../../../../../lib/security.js";

export const runtime = "nodejs";

// Serve an evidence image to the engineer. Access is gated by the admin
// middleware (Basic Auth on /api/admin/:path*).
export async function GET(request, { params }) {
  const { id } = await params;
  const data = await readEvidence(id);
  if (!data) return jsonError("Not found", 404);
  return new Response(new Uint8Array(data.buffer), {
    headers: { "Content-Type": data.mime, "Cache-Control": "private, max-age=3600" },
  });
}
