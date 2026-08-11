import { notFound } from "next/navigation";
import { getCaseById, listCaseEvents } from "../../../../lib/db.js";
import IncidentReport from "../../../../components/IncidentReport.jsx";

export const metadata = { title: "Incident Report — Digital Dhaal" };
export const dynamic = "force-dynamic";

// Engineer-facing incident report. Access is gated by the admin middleware
// (Basic Auth on /admin/:path*).
export default async function EngineerReportPage({ params }) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) notFound();
  const events = listCaseEvents(id);

  return (
    <IncidentReport
      caseData={caseData}
      events={events}
      backHref={`/admin/${id}`}
      backLabel="Back to case"
    />
  );
}
