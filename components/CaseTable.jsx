import Link from "next/link";

const SEVERITY_STYLES = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  standard: "bg-green-100 text-green-700",
};

const WORKFLOW_LABELS = {
  new: ["New", "bg-blue-100 text-blue-700"],
  verifying: ["Verifying", "bg-purple-100 text-purple-700"],
  contacted: ["Contacted", "bg-cyan-100 text-cyan-700"],
  in_progress: ["In progress", "bg-amber-100 text-amber-700"],
  resolved: ["Resolved", "bg-green-100 text-green-700"],
  closed: ["Closed", "bg-gray-100 text-gray-600"],
};

export default function CaseTable({ cases }) {
  if (cases.length === 0) {
    return <p className="text-gray-500 text-sm">No cases yet.</p>;
  }

  return (
    <div className="overflow-x-auto dd-card">
      <table className="w-full text-sm border-collapse min-w-[760px]">
        <thead>
          <tr className="text-left border-b border-black/10 text-xs uppercase tracking-wide text-gray-500">
            <th className="py-3 px-4">Severity</th>
            <th className="py-3 px-4">Pillar</th>
            <th className="py-3 px-4">Workflow</th>
            <th className="py-3 px-4">Reporter</th>
            <th className="py-3 px-4">Verified</th>
            <th className="py-3 px-4">Updated</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            const [label, style] = WORKFLOW_LABELS[c.caseStatus] ?? WORKFLOW_LABELS.new;
            return (
              <tr key={c.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-2.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      SEVERITY_STYLES[c.severity] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.severity ?? "pending"}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-medium">{c.pillar ?? "—"}</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
                    {label}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  {c.user ? (
                    <div>
                      <p className="font-medium">{c.user.name}</p>
                      <p className="text-xs text-gray-500">{c.user.email}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">anonymous</span>
                  )}
                </td>
                <td className="py-2.5 px-4">
                  {c.user?.phoneVerified ? (
                    <span className="text-green-600 font-medium text-xs">✓ phone</span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(c.updatedAt).toLocaleString()}
                </td>
                <td className="py-2.5 px-4">
                  <Link
                    href={`/admin/${c.id}`}
                    className="text-[var(--color-primary)] font-medium hover:underline whitespace-nowrap"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
