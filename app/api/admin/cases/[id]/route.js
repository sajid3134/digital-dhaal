import { NextResponse } from "next/server";
import { getCaseById, updateCaseWorkflow, CASE_WORKFLOW_STATUSES } from "../../../../../lib/db.js";
import { jsonError } from "../../../../../lib/security.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) return jsonError("Not found", 404);
  return NextResponse.json({ case: caseData });
}

// Engineer workflow updates: status + notes. Auth handled by middleware.
export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!getCaseById(id)) return jsonError("Not found", 404);

  const body = await request.json().catch(() => ({}));
  const caseStatus = body.caseStatus;
  if (!CASE_WORKFLOW_STATUSES.includes(caseStatus)) {
    return jsonError("Invalid case status", 400);
  }

  const updated = updateCaseWorkflow(id, {
    caseStatus,
    engineerNotes: body.engineerNotes,
  });
  return NextResponse.json({ case: updated });
}
