"use client";

import { useState } from "react";
import { LatteCup, HeartIcon, CheckCircleIcon } from "./Icons.jsx";

// One dignified card: rating + review first (the real ask), an optional
// "treat the team" choice tucked below as small chips. No begging.
export default function SupportSection({ t, compact = false }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tier, setTier] = useState("hug");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [thanked, setThanked] = useState(false);

  const s = t.support;

  const TIERS = [
    { id: "hug", label: s.tierHug, note: s.tierHugNote, icon: <HeartIcon width={15} height={15} /> },
    { id: "latte_regular", label: s.tierLatteR, note: s.tierLatteRNote, icon: <LatteCup size={16} /> },
    { id: "latte_large", label: s.tierLatteL, note: s.tierLatteLNote, icon: <LatteCup size={16} /> },
  ];

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (rating < 1) return setError(s.needRating);
    if (review.trim().length < 5) return setError(s.needReview);
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supportType: tier, rating, review: review.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || s.needReview);
        return;
      }
      setThanked(true);
    } catch {
      setError(s.needReview);
    } finally {
      setBusy(false);
    }
  }

  if (thanked) {
    return (
      <div className="dd-card p-7 text-center animate-fade-up">
        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
          <CheckCircleIcon width={26} height={26} />
        </div>
        <h3 className="font-bold text-lg mb-1">{s.thanks}</h3>
        <p className="text-[15px] text-[var(--color-muted)]">
          {s.thanksSub}
          {tier !== "hug" && ` ${s.paymentSoon}`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`dd-card p-6 ${compact ? "" : "sm:p-7"}`}>
      <h3 className="font-bold text-lg mb-1">{s.title}</h3>
      <p className="text-[15px] text-[var(--color-muted)] mb-5">{s.sub}</p>

      <p className="text-sm font-medium mb-2">{s.ratePrompt}</p>
      <div className="flex gap-1.5 mb-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star`}
            className={`text-[28px] leading-none transition-all hover:scale-110 ${
              n <= rating ? "text-[var(--color-star)]" : "text-black/15 hover:text-black/30"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder={s.reviewPlaceholder}
        rows={3}
        maxLength={1000}
        className="w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 resize-none mb-5"
      />

      <p className="text-sm text-[var(--color-muted)] mb-2.5">{s.treatPrompt}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {TIERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTier(option.id)}
            title={option.note}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              tier === option.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                : "border-black/10 bg-white text-[var(--color-muted)] hover:border-black/25"
            }`}
          >
            {option.icon}
            {option.label}
            <span className="opacity-70 font-normal">· {option.note.split("·")[0].trim()}</span>
          </button>
        ))}
      </div>
      {tier !== "hug" && (
        <p className="text-xs text-[var(--color-muted)] mb-3">{s.paymentSoon}</p>
      )}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full sm:w-auto rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3 text-sm font-semibold transition-colors disabled:opacity-50 mt-1"
      >
        {busy ? s.submitting : s.submit}
      </button>
    </form>
  );
}
