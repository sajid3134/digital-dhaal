import Link from "next/link";

const SEVERITY_STYLES = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  standard: "bg-green-100 text-green-700",
};

export default function CaseTable({ cases }) {
  if (cases.length === 0) {
    return <p className="text-gray-500 text-sm">No cases yet.</p>;
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b border-black/10">
          <th className="py-2 pr-4">Severity</th>
          <th className="py-2 pr-4">Pillar</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Updated</th>
          <th className="py-2 pr-4">Summary</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr key={c.id} className="border-b border-black/5 hover:bg-black/[0.02]">
            <td className="py-2 pr-4">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  SEVERITY_STYLES[c.severity] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {c.severity ?? "—"}
              </span>
            </td>
            <td className="py-2 pr-4">{c.pillar ?? "—"}</td>
            <td className="py-2 pr-4">{c.status}</td>
            <td className="py-2 pr-4">{new Date(c.updatedAt).toLocaleString()}</td>
            <td className="py-2 pr-4">
              <Link
                href={`/admin/${c.id}`}
                className="text-[var(--color-primary)] hover:underline"
              >
                {c.caseCard?.summary_en
                  ? `${c.caseCard.summary_en.slice(0, 60)}…`
                  : "View case"}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
