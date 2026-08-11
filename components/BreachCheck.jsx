"use client";

import { useState } from "react";
import { SearchIcon, ShieldCheckIcon, AlertIcon, ServerIcon } from "./Icons.jsx";

// Data-breach lookup for the active case. The browser only ever talks to our
// own /api/breach-check route (same-origin); that route queries the free
// XposedOrNot API server-side and stores the sanitized result on the case.
export default function BreachCheck({ caseId, initial = null, t, lang = "bn" }) {
  const [query, setQuery] = useState(initial?.query ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initial);
  const [error, setError] = useState("");

  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  const fmt = (iso) =>
    iso
      ? new Date(iso).toLocaleString(locale, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  async function run(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/breach-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, query: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.status === "invalid") setError(t.invalid);
        else setError(t.errorSub);
        return;
      }
      setResult(data);
    } catch {
      setError(t.errorSub);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dd-card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center">
          <SearchIcon width={18} height={18} />
        </div>
        <div>
          <h3 className="font-bold leading-tight">{t.title}</h3>
          <p className="text-sm text-[var(--color-muted)] leading-snug mt-0.5">{t.sub}</p>
        </div>
      </div>

      <form onSubmit={run} className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.inputPlaceholder}
          type="text"
          inputMode="email"
          autoComplete="off"
          className="flex-1 rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <SearchIcon width={15} height={15} />
          {loading ? t.checking : t.checkBtn}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {result && !error && (
        <div className="mt-4">
          {result.status === "found" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <AlertIcon width={17} height={17} />
                {t.foundTitle}
                <span className="dd-chip bg-amber-100 text-amber-800 border border-amber-200 ml-auto">
                  {result.breaches.length} {t.breachWord}
                </span>
              </div>
              <p className="text-sm text-amber-800/80 mt-1.5">{t.foundSub}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.breaches.map((b) => (
                  <span
                    key={b}
                    className="font-mono text-xs bg-white border border-amber-200 text-amber-900 rounded-md px-2 py-1"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-amber-900/90 mt-3 leading-snug">{t.whatNow}</p>
            </div>
          )}

          {result.status === "clean" && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <ShieldCheckIcon width={18} height={18} />
                {t.cleanTitle}
              </div>
              <p className="text-sm text-green-800/80 mt-1.5">{t.cleanSub}</p>
            </div>
          )}

          {result.status === "unsupported" && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              {t.unsupportedPhone}
            </div>
          )}

          {result.status === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-700">{t.errorTitle}</p>
              <p className="text-sm text-red-700/80 mt-1">{t.errorSub}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 text-[11px] text-[var(--color-muted)] font-mono">
            <ServerIcon width={12} height={12} />
            <span>{t.poweredBy}</span>
            {result.checkedAt && (
              <span className="ml-auto">
                {t.lastChecked}: {fmt(result.checkedAt)}
              </span>
            )}
          </div>
          {(result.status === "found" || result.status === "clean") && (
            <p className="text-[11px] text-[var(--color-muted)] mt-1.5">{t.savedNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
