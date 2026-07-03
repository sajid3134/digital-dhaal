import { NextResponse } from "next/server";
import { listCasesForAdmin } from "../../../../lib/db.js";

export async function GET() {
  return NextResponse.json({ cases: listCasesForAdmin() });
}
