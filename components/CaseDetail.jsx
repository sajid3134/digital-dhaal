"use client";

import { useState } from "react";
import Link from "next/link";
import { FileIcon } from "./Icons.jsx";

const WORKFLOW_OPTIONS = [
  ["new", "New"],
  ["verifying", "Verifying identity"],
  ["contacted", "Contacted victim"],
  ["in_progress", "In progress"],
  ["resolved", "Resolved"],
  ["closed", "Closed"],
];

function renderAgentTurn(raw) {
  try {
    return JSON.parse(raw).reply_to_user;
  } catch {
    return "[unparseable turn]";
  }
}

const EVENT_LABELS = {
  created: "Case created",
  submitted: "Intake completed — entered engineer queue",
  breach_checked: "Data-breach check performed",
  engineer_message: "Message sent to victim",
  verifying: "Identity verification started",
  contacted: "Victim contacted",
  in_progress: "Resolution in progress",
  resolved: "Marked resolved",
  closed: "Case closed",
};

export default function CaseDetail({ caseData, events = [] }) {
  const { caseCard, conversation, flags, pillar, status, severity, user, breachCheck } = caseData;
  const [caseStatus, setCaseStatus] = useState(caseData.caseStatus);
  const [notes, setNotes] = useState(caseData.engineerNotes);
  const [victimMsg, setVictimMsg] = useState(caseData.engineerMessage ?? "");
  const [meetingLink, setMeetingLink] = useState(caseData.meetingLink ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/cases/${caseData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseStatus,
          engineerNotes: notes,
          engineerMessage: victimMsg,
          meetingLink,
        }),
      });
      if (!res.ok) {
        setError("Save failed — try again.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Save failed — connection problem.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">
          ← Back to case queue
        </Link>
        <Link
          href={`/admin/${caseData.id}/report`}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-primary)]/10 transition-colors"
        >
          <FileIcon width={15} height={15} />
          Download incident report
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold">Case {caseData.id.slice(0, 8)}</h1>
        <p className="text-sm text-gray-500">
          Pillar {pillar ?? "—"} · intake {status} · severity {severity ?? "—"}
        </p>
        {flags.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {flags.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reporter identity — the fraud-check panel */}
      <div className="dd-card p-4 text-sm">
        <h2 className="font-semibold mb-2">Reporter</h2>
        {user ? (
          <div className="grid sm:grid-cols-3 gap-2">
            <p><span className="text-gray-500">Name:</span> {user.name}</p>
            <p>
              <span className="text-gray-500">Email:</span> {user.email}{" "}
              {user.emailVerified && (
                <span className="text-green-600 font-semibold">✓ verified</span>
              )}
            </p>
            <p>
              <span className="text-gray-500">Phone:</span>{" "}
              {user.phone ?? "not provided"}{" "}
              {user.phoneVerified ? (
                <span className="text-green-600 font-semibold">✓ verified</span>
              ) : (
                <span className="text-amber-600">(unverified)</span>
              )}
            </p>
            <p>
              <span className="text-gray-500">Identity (KYC):</span>{" "}
              {user.kycStatus === "verified" ? (
                <span className="text-green-600 font-semibold">✓ verified (demo)</span>
              ) : (
                <span className="text-gray-400">not completed</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">No account linked (legacy case)</p>
        )}
      </div>

      {/* Data-breach check result (run by the victim during intake) */}
      {breachCheck && (
        <div className="dd-card p-4 text-sm">
          <h2 className="font-semibold mb-2">Data-breach check</h2>
          <p className="text-gray-600">
            Checked <span className="font-mono">{breachCheck.query}</span>{" "}
            <span className="text-gray-400 text-xs">· {breachCheck.source}</span>
          </p>
          {breachCheck.status === "found" ? (
            <div className="mt-2">
              <p className="text-amber-700 font-semibold">
                Exposed in {breachCheck.breaches.length} breach
                {breachCheck.breaches.length === 1 ? "" : "es"}:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {breachCheck.breaches.map((b) => (
                  <span
                    key={b}
                    className="font-mono text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded px-1.5 py-0.5"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ) : breachCheck.status === "clean" ? (
            <p className="text-green-600 mt-2 font-medium">No exposure found in known breaches.</p>
          ) : (
            <p className="text-gray-500 mt-2">Phone identifiers not covered by the breach source.</p>
          )}
        </div>
      )}

      {/* Contact the victim — message + meeting link, delivered in her chat */}
      <div className="dd-card p-4 space-y-3">
        <div>
          <h2 className="font-semibold text-sm">Message the victim</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            This appears in the victim's chat as a message from her engineer. Paste a Google
            Meet / Zoom / Teams link to invite her to a call — she gets a "Join secure call"
            button. Delivered inside the platform; no email needed.
          </p>
        </div>
        <textarea
          value={victimMsg}
          onChange={(e) => setVictimMsg(e.target.value)}
          placeholder="e.g. Hi Mira, I've reviewed your case. Let's do a quick call so I can guide the recovery — join using the button below at 5pm today."
          rows={3}
          maxLength={2000}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-y"
        />
        <input
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder="Meeting link (optional) — https://meet.google.com/..."
          type="url"
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] font-mono"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? "Sending…" : "Send to victim"}
          </button>
          {saved && <span className="text-green-600 text-sm">✓ Sent</span>}
          {caseData.engineerMessageAt && !saved && (
            <span className="text-xs text-gray-400">
              Last sent {new Date(caseData.engineerMessageAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Engineer workflow */}
      <div className="dd-card p-4 space-y-3">
        <h2 className="font-semibold text-sm">Engineer workflow</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={caseStatus}
            onChange={(e) => setCaseStatus(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm bg-white outline-none focus:border-[var(--color-primary)]"
          >
            {WORKFLOW_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-green-600 text-sm self-center">✓ Saved</span>}
          {error && <span className="text-red-600 text-sm self-center">{error}</span>}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Engineer notes (never shown to the victim)…"
          rows={3}
          maxLength={5000}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-y"
        />
      </div>

      {/* Case timeline — every status change with its timestamp */}
      {events.length > 0 && (
        <div className="dd-card p-4">
          <h2 className="font-semibold text-sm mb-3">Case timeline</h2>
          <ol className="space-y-2">
            {events.map((e, i) => (
              <li key={i} className="flex items-baseline gap-3 text-sm">
                <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--color-primary)] translate-y-[-1px]" />
                <span className="font-medium">{EVENT_LABELS[e.type] ?? e.type}</span>
                <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                  {new Date(e.at).toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {caseCard && (
        <div className="dd-card p-4 space-y-2 text-sm">
          <h2 className="font-semibold">Case Card</h2>
          <p><strong>Summary (EN):</strong> {caseCard.summary_en}</p>
          <p><strong>সারাংশ (BN):</strong> {caseCard.summary_bn}</p>
          <p><strong>Urgency reason:</strong> {caseCard.urgency_reason}</p>
          <p><strong>Recommended first action:</strong> {caseCard.recommended_first_action}</p>
          <p><strong>Support path:</strong> {caseCard.support_path}</p>
          <p><strong>Cross-pillar notes:</strong> {caseCard.cross_pillar_notes ?? "—"}</p>
        </div>
      )}

      <div className="dd-card p-4">
        <h2 className="font-semibold text-sm mb-3">Conversation transcript</h2>
        <div className="space-y-2.5">
          {conversation.map((m, i) => (
            <div key={i} className="text-sm leading-relaxed">
              <span
                className={`font-semibold ${
                  m.role === "user" ? "text-[var(--color-primary)]" : "text-gray-500"
                }`}
              >
                {m.role === "user" ? "Victim" : "Agent"}:
              </span>{" "}
              {m.role === "assistant" ? renderAgentTurn(m.content) : m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
