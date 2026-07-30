import { NextResponse } from "next/server";
import { getFeedbackById, verifyFeedbackPayment } from "../../../../../lib/db.js";
import { jsonError } from "../../../../../lib/security.js";

// Engineer confirms a claimed bKash payment after checking the TrxID
// against the bKash statement. Auth handled by middleware.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const feedback = getFeedbackById(id);
  if (!feedback) return jsonError("Not found", 404);
  if (feedback.payment_status !== "claimed") {
    return jsonError("Nothing to verify on this entry", 400);
  }
  verifyFeedbackPayment(id);
  return NextResponse.json({ ok: true });
}
