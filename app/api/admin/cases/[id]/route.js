import { NextResponse } from "next/server";
import { getCaseById } from "../../../../../lib/db.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ case: caseData });
}
