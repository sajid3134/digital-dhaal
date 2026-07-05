"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, XIcon } from "./Icons.jsx";

const STATUS_DOT = {
  collecting: "bg-amber-400",
  complete: "bg-green-500",
  blocked_minor: "bg-red-500",
  out_of_scope: "bg-gray-400",
};

export default function CaseSidebar({ cases, activeCaseId, mobileOpen, onClose, t, lang }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const locale = lang === "bn" ? "bn-BD" : "en-GB";

  async function selectCase(caseId) {
    if (busy || caseId === activeCaseId) return onClose?.();
    setBusy(true);
    await fetch("/api/chat/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId }),
    }).catch(() => {});
    setBusy(false);
    onClose?.();
    router.refresh();
  }

  async function newCase() {
    if (busy) return;
    setBusy(true);
    await fetch("/api/chat/new", { method: "POST" }).catch(() => {});
    setBusy(false);
    onClose?.();
    router.refresh();
  }

  const body = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={newCase}
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <PlusIcon width={15} height={15} />
          {t.newProblem}
        </button>
      </div>

      <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {t.historyTitle}
      </p>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {cases.length === 0 ? (
          <p className="px-2 text-sm text-[var(--color-muted)]">{t.noCases}</p>
        ) : (
          cases.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => selectCase(caseItem.id)}
              disabled={busy}
              className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                caseItem.id === activeCaseId
                  ? "bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/25"
                  : "hover:bg-black/[0.04] border border-transparent"
              }`}
            >
              <p className="text-sm font-medium truncate leading-snug">{caseItem.title}</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5 flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${
                    STATUS_DOT[caseItem.status] ?? "bg-gray-300"
                  }`}
                />
                {new Date(caseItem.updatedAt).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                })}
                {caseItem.status === "complete" && ` · ${t.submittedTag}`}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 bg-white border-r border-black/5">
        {body}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-fade-up flex flex-col">
            <div className="flex justify-end p-2">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center"
                aria-label="Close"
              >
                <XIcon width={16} height={16} />
              </button>
            </div>
            {body}
          </aside>
        </div>
      )}
    </>
  );
}
