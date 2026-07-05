import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/auth.js";

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
  });
}
