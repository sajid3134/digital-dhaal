import {
  listCasesForAdmin,
  caseStats,
  listFeedback,
  feedbackStats,
} from "../../lib/db.js";

import CaseTable from "../../components/CaseTable.jsx";
import FeedbackList from "../../components/FeedbackList.jsx";

export const metadata = {
  title: "Case Queue — Digital Dhaal Admin",
};

export const dynamic = "force-dynamic";

function StatCard({ label, value, tone = "" }) {
  return (
    <div className="dd-card px-5 py-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className={`text-2xl font-bold ${tone}`}>
        {value}
      </p>
    </div>
  );
}

export default function AdminPage() {
  const cases = listCasesForAdmin();
  const stats = caseStats();

  const feedback = listFeedback();
  const fbStats = feedbackStats();

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-xl font-bold">
          Digital Dhaal — Engineer Portal
        </h1>

        <p className="text-sm text-gray-500">
          Cases sorted by severity — critical first.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard
          label="Total cases"
          value={stats.total}
        />

        <StatCard
          label="Critical open"
          value={stats.critical}
          tone="text-red-600"
        />

        <StatCard
          label="Open"
          value={stats.open}
          tone="text-amber-600"
        />

        <StatCard
          label="Resolved"
          value={stats.resolved}
          tone="text-green-600"
        />

        <StatCard
          label="Avg rating"
          value={fbStats.average ? `${fbStats.average} ★` : "—"}
          tone="text-[var(--color-star)]"
        />
      </div>

      {/* Case Queue */}
      <CaseTable cases={cases} />

      {/* Feedback */}
      <section>
        <h2 className="mb-3 font-bold">
          Feedback & reviews{" "}
          <span className="text-sm font-normal text-gray-500">
            ({fbStats.count})
          </span>
        </h2>

        <FeedbackList feedback={feedback} />
      </section>
    </main>
  );
}
