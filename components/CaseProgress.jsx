// Vertical progress timeline the victim sees on their case — each step
// stamped with the real time it happened. Server passes safe data only
// (event types + timestamps), never engineer notes.

const STEP_ORDER = [
  "created",
  "submitted",
  "verifying",
  "contacted",
  "in_progress",
  "resolved",
];

export default function CaseProgress({ events, caseStatus, labels, title, lang }) {
  const eventMap = new Map(events.map((e) => [e.type, e.at]));
  if (eventMap.has("closed")) eventMap.set("resolved", eventMap.get("closed"));

  // A step counts as reached if we have its event, or a later step happened.
  const reachedIndex = Math.max(
    ...STEP_ORDER.map((step, i) => (eventMap.has(step) ? i : -1)),
    STEP_ORDER.indexOf(caseStatus), // engineer's current workflow position
  );
  if (reachedIndex < 0) return null;

  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  const fmt = (iso) =>
    new Date(iso).toLocaleString(locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="dd-card p-5">
      <h3 className="font-bold mb-4">{title}</h3>
      <ol className="relative">
        {STEP_ORDER.map((step, i) => {
          const done = i < reachedIndex;
          const current = i === reachedIndex;
          const at = eventMap.get(step);
          const last = i === STEP_ORDER.length - 1;
          return (
            <li key={step} className="relative flex gap-3.5 pb-5 last:pb-0">
              {!last && (
                <span
                  className={`absolute left-[9px] top-5 bottom-0 w-px ${
                    done ? "bg-[var(--color-primary)]" : "bg-black/10"
                  }`}
                />
              )}
              <span
                className={`relative z-10 mt-0.5 w-[19px] h-[19px] shrink-0 rounded-full border-2 flex items-center justify-center ${
                  done
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : current
                      ? "bg-white border-[var(--color-primary)]"
                      : "bg-white border-black/15"
                }`}
              >
                {done && (
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
                {current && (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                )}
              </span>
              <div className={done || current ? "" : "opacity-45"}>
                <p className={`text-[15px] leading-snug ${current ? "font-bold" : "font-medium"}`}>
                  {labels[step]}
                </p>
                {at && (
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{fmt(at)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
