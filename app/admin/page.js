import { listCasesForAdmin } from "../../lib/db.js";
import CaseTable from "../../components/CaseTable.jsx";

export default function AdminPage() {
  const cases = listCasesForAdmin();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-1">Digital Dhaal — Case Queue</h1>
      <p className="text-sm text-gray-500 mb-4">
        Sorted by severity — critical cases first.
      </p>
      <CaseTable cases={cases} />
    </main>
  );
}
