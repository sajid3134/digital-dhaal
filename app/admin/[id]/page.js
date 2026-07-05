import { notFound } from "next/navigation";
import { getCaseById } from "../../../lib/db.js";
import CaseDetail from "../../../components/CaseDetail.jsx";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <CaseDetail caseData={caseData} />
    </main>
  );
}
