import { NextResponse } from "next/server";
import {
  getCaseById,
  updateCaseWorkflow,
  setEngineerContact,
  CASE_WORKFLOW_STATUSES,
} from "../../../../../lib/db.js";
import { jsonError } from "../../../../../lib/security.js";

// Only allow safe meeting-link schemes (a pasted Meet/Zoom/Teams URL, etc.).
function cleanMeetingLink(value) {
  const s = String(value ?? "").trim().slice(0, 500);
  if (!s) return "";
  try {
    const url = new URL(s);
    return url.protocol === "https:" || url.protocol === "http:" ? s : "";
  } catch {
    return "";
  }
}

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

  updateCaseWorkflow(id, {
    caseStatus,
    engineerNotes: body.engineerNotes,
  });

  // Engineer's message + meeting link to the victim (delivered in-app).
  const updated = setEngineerContact(id, {
    engineerMessage: body.engineerMessage,
    meetingLink: cleanMeetingLink(body.meetingLink),
  });

  return NextResponse.json({ case: updated });
}
