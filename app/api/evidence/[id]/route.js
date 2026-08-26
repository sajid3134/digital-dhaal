import { getUserFromRequest } from "../../../../lib/auth.js";
import { getEvidenceById, getCaseById } from "../../../../lib/db.js";
import { readEvidence } from "../../../../lib/evidence.js";
import { jsonError } from "../../../../lib/security.js";

export const runtime = "nodejs";

// Serve an evidence image to the case owner (victim).
export async function GET(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  const { id } = await params;
  const row = getEvidenceById(id);
  if (!row) return jsonError("Not found", 404);

  const caseRow = getCaseById(row.case_id);
  if (caseRow?.userId && caseRow.userId !== user.id) return jsonError("Forbidden", 403);

  const data = await readEvidence(id);
  if (!data) return jsonError("Not found", 404);

  return new Response(new Uint8Array(data.buffer), {
    headers: { "Content-Type": data.mime, "Cache-Control": "private, max-age=3600" },
  });
}
