import { listCasesForAdmin, caseStats, listFeedback, feedbackStats } from "../../lib/db.js";
import CaseTable from "../../components/CaseTable.jsx";

export const metadata = { title: "Case Queue — Digital Dhaal Admin" };
export const dynamic = "force-dynamic";

const SUPPORT_LABELS = {
  latte_large: "☕ বড় লাটে",
  latte_regular: "☕ রেগুলার লাটে",
  hug: "🤝 সাপোর্ট",
};

function StatCard({ label, value, tone = "" }) {
  return (
    <div className="dd-card px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const cases = listCasesForAdmin();
  const stats = caseStats();
  const feedback = listFeedback();
  const fbStats = feedbackStats();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">Digital Dhaal — Engineer Portal</h1>
        <p className="text-sm text-gray-500">
          Cases sorted by severity — critical first.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total cases" value={stats.total} />
        <StatCard label="Critical open" value={stats.critical} tone="text-red-600" />
        <StatCard label="Open" value={stats.open} tone="text-amber-600" />
        <StatCard label="Resolved" value={stats.resolved} tone="text-green-600" />
        <StatCard
          label="Avg rating"
          value={fbStats.average ? `${fbStats.average} ★` : "—"}
          tone="text-[var(--color-star)]"
        />
      </div>

      <CaseTable cases={cases} />

      <section>
        <h2 className="font-bold mb-3">
          Feedback & reviews{" "}
          <span className="text-sm font-normal text-gray-500">({fbStats.count})</span>
        </h2>
        {feedback.length === 0 ? (
          <p className="text-sm text-gray-500">No feedback yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {feedback.map((f) => (
              <div key={f.id} className="dd-card p-4 text-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium">{SUPPORT_LABELS[f.supportType] ?? f.supportType}</span>
                  <span className="text-[var(--color-star)]">
                    {"★".repeat(f.rating)}
                    <span className="text-black/15">{"★".repeat(5 - f.rating)}</span>
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-2">“{f.review}”</p>
                <p className="text-xs text-gray-400">
                  {f.userName} · {new Date(f.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
