"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUPPORT_LABELS = {
  latte_large: "Large latte",
  latte_regular: "Coffee",
  hug: "Good wishes",
};

// Engineer view of reviews + claimed bKash treats. "Mark verified" is for
// after the TrxID has been checked against the bKash statement.
export default function FeedbackList({ feedback }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);

  async function markVerified(id) {
    setBusyId(id);
    await fetch(`/api/admin/feedback/${id}`, { method: "PATCH" }).catch(() => {});
    setBusyId(null);
    router.refresh();
  }

  if (feedback.length === 0) {
    return <p className="text-sm text-gray-500">No feedback yet.</p>;
  }

  return (
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

          {f.amount > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                {f.amount}৳
              </span>
              {f.paymentStatus === "verified" ? (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  ✓ payment verified
                </span>
              ) : f.paymentStatus === "claimed" ? (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    TrxID: {f.trxId}
                  </span>
                  <button
                    onClick={() => markVerified(f.id)}
                    disabled={busyId === f.id}
                    className="text-xs font-semibold text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-full px-2.5 py-0.5 hover:bg-[var(--color-primary-soft)] transition-colors disabled:opacity-50"
                  >
                    {busyId === f.id ? "…" : "Mark verified"}
                  </button>
                </>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                  no TrxID given
                </span>
              )}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed mb-2">“{f.review}”</p>
          <p className="text-xs text-gray-400">
            {f.userName} · {new Date(f.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
