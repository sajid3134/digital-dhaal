import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getUserFromCookieStore } from "../../../lib/auth.js";
import { getCaseById, listCaseEvents } from "../../../lib/db.js";
import IncidentReport from "../../../components/IncidentReport.jsx";

export const metadata = { title: "Incident Report — Digital Dhaal" };
export const dynamic = "force-dynamic";

const RESOLVED = new Set(["resolved", "closed"]);

// Victim-facing incident report. Only the case owner may view it, and only
// once the case has been resolved/closed.
export default async function VictimReportPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  if (!user) redirect(`/login?next=/report/${id}`);

  const caseData = getCaseById(id);
  if (!caseData) notFound();

  // Ownership check — never expose another user's case.
  if (caseData.userId && caseData.userId !== user.id) notFound();
  // Available only once the engineer has resolved/closed the case.
  if (!RESOLVED.has(caseData.caseStatus)) redirect("/chat");

  const events = listCaseEvents(id);

  return (
    <IncidentReport
      caseData={caseData}
      events={events}
      backHref="/chat"
      backLabel="Back to chat"
    />
  );
}
