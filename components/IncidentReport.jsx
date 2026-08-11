// Official-looking incident report, designed to be printed to PDF by the
// browser (which renders Bangla correctly, unlike JS PDF libraries). The page
// is styled for A4; `.no-print` chrome drops out when printing. Server
// component — no client JS beyond the small PrintBar button.

import { DhaalMark } from "./Brand.jsx";
import PrintButton from "./PrintButton.jsx";

const PILLARS = {
  A: { en: "Account takeover", bn: "অ্যাকাউন্ট হ্যাক" },
  B: { en: "Intimate image / deepfake", bn: "ব্যক্তিগত ছবি / ডিপফেক" },
  C: { en: "Impersonation", bn: "ভুয়া প্রোফাইল" },
};

const SEVERITY = {
  critical: { en: "Critical", bn: "গুরুতর", cls: "sev-critical" },
  high: { en: "High", bn: "উচ্চ", cls: "sev-high" },
  standard: { en: "Standard", bn: "সাধারণ", cls: "sev-standard" },
};

const SUPPORT_PATH = {
  android_meet_screenshare: "Android · guided screen-share session",
  pc_session: "PC · remote-guided session",
  guided_chat: "Guided chat (no live session required)",
};

const STATUS_LABELS = {
  new: "New — awaiting triage",
  verifying: "Identity verification in progress",
  contacted: "Reporter contacted",
  in_progress: "Resolution in progress",
  resolved: "Resolved",
  closed: "Closed",
};

const EVENT_LABELS = {
  created: "Case opened",
  submitted: "Intake completed — entered engineer queue",
  breach_checked: "Data-breach check performed",
  verifying: "Identity verification started",
  contacted: "Reporter contacted",
  in_progress: "Resolution in progress",
  resolved: "Marked resolved",
  closed: "Case closed",
};

function Field({ label, children }) {
  return (
    <div className="py-2 border-b border-black/5">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-mono mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-800 leading-snug">{children}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-[13px] font-bold uppercase tracking-wide text-[var(--color-primary-dark)] border-b-2 border-[var(--color-primary)]/30 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function IncidentReport({ caseData, events = [], backHref, backLabel }) {
  const {
    id,
    createdAt,
    caseCard,
    pillar,
    severity,
    caseStatus,
    flags = [],
    conversation = [],
    breachCheck,
    user,
  } = caseData;

  const ref = `DD-${String(id).slice(0, 8).toUpperCase()}`;
  const generatedAt = new Date();
  const pill = PILLARS[pillar];
  const sev = SEVERITY[severity];
  const msgCount = conversation.length;

  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <div className="bg-[var(--color-bg)] min-h-dvh py-6 px-4">
      {/* Screen-only action bar */}
      <div className="no-print max-w-[820px] mx-auto mb-4 flex items-center justify-between gap-3">
        {backHref ? (
          <a href={backHref} className="text-sm text-[var(--color-primary)] hover:underline">
            ← {backLabel ?? "Back"}
          </a>
        ) : (
          <span />
        )}
        <PrintButton label="Download / Print PDF" />
      </div>

      {/* The printable sheet */}
      <article className="report-page max-w-[820px] mx-auto bg-white text-gray-900 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] rounded-sm px-10 py-9">
        {/* Classification banner */}
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500 border border-gray-200 rounded px-3 py-1.5 mb-6">
          <span>Confidential</span>
          <span>For the authorised recipient only</span>
        </div>

        {/* Header */}
        <header className="flex items-start justify-between gap-6 pb-5 border-b-2 border-[var(--color-primary)]">
          <div className="flex items-center gap-3">
            <DhaalMark size={46} />
            <div>
              <p className="font-bold text-lg leading-tight">Digital Dhaal</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
                Cyber Incident Response Unit
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] leading-relaxed">
            <p className="font-bold text-[13px] uppercase tracking-wide text-gray-800">
              Incident Report
            </p>
            <p className="font-mono text-gray-600 mt-0.5">
              Ref&nbsp;<span className="text-gray-900 font-semibold">{ref}</span>
            </p>
            <p className="font-mono text-gray-500">Generated {fmt(generatedAt.toISOString())}</p>
          </div>
        </header>

        {/* Case meta */}
        <Section title="Case summary">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <Field label="Case ID">
              <span className="font-mono">{id}</span>
            </Field>
            <Field label="Date opened">{fmt(createdAt)}</Field>
            <Field label="Incident category">
              {pill ? `${pill.en} — ${pill.bn} (Pillar ${pillar})` : pillar ?? "—"}
            </Field>
            <Field label="Severity">
              {sev ? (
                <span className={`font-semibold ${
                  severity === "critical" ? "text-red-700" : severity === "high" ? "text-amber-700" : "text-green-700"
                }`}>
                  {sev.en} · {sev.bn}
                </span>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Current status">
              {STATUS_LABELS[caseStatus] ?? caseStatus}
            </Field>
            <Field label="Intake messages on file">{msgCount}</Field>
          </div>
        </Section>

        {/* Reporter */}
        <Section title="Reporter & verification">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <Field label="Name">{user?.name ?? "Not linked to an account"}</Field>
            <Field label="Email">{user?.email ?? "—"}</Field>
            <Field label="Phone">
              {user?.phone ?? "Not provided"}{" "}
              {user?.phone &&
                (user.phoneVerified ? (
                  <span className="text-green-700 font-semibold">· verified (OTP)</span>
                ) : (
                  <span className="text-amber-700">· unverified</span>
                ))}
            </Field>
            <Field label="Identity check (KYC)">
              {user?.kycStatus === "verified" ? (
                <span className="text-green-700 font-semibold">Verified — prototype demo</span>
              ) : (
                "Not completed"
              )}
            </Field>
          </div>
        </Section>

        {/* Incident summary — bilingual */}
        {caseCard && (
          <Section title="Incident summary">
            <p className="text-sm leading-relaxed text-gray-800">{caseCard.summary_en}</p>
            {caseCard.summary_bn && (
              <p className="text-sm leading-relaxed text-gray-700 mt-2">{caseCard.summary_bn}</p>
            )}
            {caseCard.urgency_reason && (
              <p className="text-[13px] text-gray-600 mt-3">
                <span className="font-semibold">Urgency:</span> {caseCard.urgency_reason}
              </p>
            )}
          </Section>
        )}

        {/* Breach findings */}
        {breachCheck && (
          <Section title="Data-breach check">
            <p className="text-sm text-gray-800">
              Identifier checked: <span className="font-mono">{breachCheck.query}</span>{" "}
              <span className="text-gray-400 font-mono text-xs">
                ({breachCheck.source})
              </span>
            </p>
            {breachCheck.status === "found" ? (
              <>
                <p className="text-sm text-amber-800 font-semibold mt-1">
                  Exposed in {breachCheck.breaches.length} known breach
                  {breachCheck.breaches.length === 1 ? "" : "es"}:
                </p>
                <p className="text-[13px] font-mono text-gray-700 mt-1 leading-relaxed">
                  {breachCheck.breaches.join(" · ")}
                </p>
              </>
            ) : breachCheck.status === "clean" ? (
              <p className="text-sm text-green-700 mt-1">No exposure found in known breaches.</p>
            ) : (
              <p className="text-sm text-gray-600 mt-1">
                Phone identifiers are not covered by the breach source.
              </p>
            )}
          </Section>
        )}

        {/* Recommended actions */}
        {caseCard && (
          <Section title="Recommended actions">
            <ol className="text-sm text-gray-800 space-y-1.5 list-decimal pl-5">
              {caseCard.recommended_first_action && (
                <li>{caseCard.recommended_first_action}</li>
              )}
              <li>
                Support path:{" "}
                {SUPPORT_PATH[caseCard.support_path] ?? caseCard.support_path ?? "—"}
              </li>
              {caseCard.cross_pillar_notes && caseCard.cross_pillar_notes !== "—" && (
                <li>Cross-pillar note: {caseCard.cross_pillar_notes}</li>
              )}
            </ol>
          </Section>
        )}

        {/* Evidence & references */}
        <Section title="Evidence & references">
          <ul className="text-sm text-gray-800 space-y-1.5 list-disc pl-5">
            <li>Full intake transcript ({msgCount} messages) retained on file with Digital Dhaal.</li>
            {breachCheck && (
              <li>Breach-exposure lookup on record (source: {breachCheck.source}).</li>
            )}
            {flags.length > 0 && (
              <li>
                System flags:{" "}
                <span className="font-mono text-[13px]">{flags.join(", ")}</span>
              </li>
            )}
            <li className="text-gray-500">
              No passwords, OTPs, PINs, or intimate media are collected or stored by Digital Dhaal.
            </li>
          </ul>
        </Section>

        {/* Timeline */}
        {events.length > 0 && (
          <Section title="Case timeline">
            <ol className="space-y-1.5">
              {events.map((e, i) => (
                <li key={i} className="flex items-baseline gap-3 text-[13px]">
                  <span className="font-mono text-gray-400 whitespace-nowrap w-40 shrink-0">
                    {fmt(e.at)}
                  </span>
                  <span className="text-gray-800">{EVENT_LABELS[e.type] ?? e.type}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Footer / disclaimer */}
        <footer className="mt-8 pt-4 border-t border-gray-200 text-[11px] text-gray-500 leading-relaxed">
          <p>
            This report was generated by Digital Dhaal, a volunteer Bangla-first cyber incident
            response service, from the reporter's own intake. It is provided to assist the reporter
            and any authority they choose to involve. It is not a legal determination and is not a
            substitute for a formal police complaint. In a life-threatening emergency, call 999.
          </p>
          <div className="flex justify-between mt-4">
            <span>
              Prepared by: <span className="font-mono">Digital Dhaal · Automated intake</span>
            </span>
            <span className="font-mono">{ref}</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
