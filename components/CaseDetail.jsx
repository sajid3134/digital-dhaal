import Link from "next/link";

function renderAgentTurn(raw) {
  try {
    return JSON.parse(raw).reply_to_user;
  } catch {
    return raw;
  }
}

export default function CaseDetail({ caseData }) {
  const { caseCard, conversation, flags, pillar, status, severity } = caseData;

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">
        ← Back to case queue
      </Link>

      <div>
        <h1 className="text-xl font-semibold">Case {caseData.id.slice(0, 8)}</h1>
        <p className="text-sm text-gray-500">
          Pillar {pillar ?? "—"} · {status} · Severity: {severity ?? "—"}
        </p>
        {flags.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {flags.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {caseCard && (
        <div className="bg-white border border-black/10 rounded-xl p-4 space-y-2 text-sm">
          <h2 className="font-semibold">Case Card</h2>
          <p>
            <strong>Summary (EN):</strong> {caseCard.summary_en}
          </p>
          <p>
            <strong>সারাংশ (BN):</strong> {caseCard.summary_bn}
          </p>
          <p>
            <strong>Urgency reason:</strong> {caseCard.urgency_reason}
          </p>
          <p>
            <strong>Recommended first action:</strong> {caseCard.recommended_first_action}
          </p>
          <p>
            <strong>Support path:</strong> {caseCard.support_path}
          </p>
          <p>
            <strong>Cross-pillar notes:</strong> {caseCard.cross_pillar_notes ?? "—"}
          </p>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-2">Conversation transcript</h2>
        <div className="space-y-2">
          {conversation.map((m, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{m.role === "user" ? "Victim" : "Agent"}:</span>{" "}
              {m.role === "assistant" ? renderAgentTurn(m.content) : m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
