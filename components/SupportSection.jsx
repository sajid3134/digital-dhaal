"use client";

import { useState } from "react";

const LatteCup = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M10 18h24v14a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V18z" fill="#8B5A2B" />
    <path d="M10 18h24v5H10z" fill="#EBD9C3" />
    <path
      d="M34 21h3a5 5 0 0 1 0 10h-3v-4h3a1 1 0 0 0 0-2h-3v-4z"
      fill="#8B5A2B"
    />
    <path
      d="M17 8c0 2-2 2.5-2 4.5S17 15 17 15M24 8c0 2-2 2.5-2 4.5S24 15 24 15M31 8c0 2-2 2.5-2 4.5S31 15 31 15"
      stroke="#B08968"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TIERS = [
  {
    id: "latte_large",
    icon: <LatteCup size={44} />,
    title: "বড় লাটে",
    price: "১৯৯৳",
    perk: "সাথে কেস ফাইল তৈরিতে বাড়তি সাহায্য",
    highlight: true,
  },
  {
    id: "latte_regular",
    icon: <LatteCup size={38} />,
    title: "রেগুলার লাটে",
    price: "৯৯৳",
    perk: "আমাদের কাজ চালিয়ে যেতে সাহায্য করে",
  },
  {
    id: "hug",
    icon: <span className="text-4xl leading-none">🤝</span>,
    title: "ভাইকে সাপোর্ট",
    price: "ফ্রি",
    perk: "একটা আন্তরিক রিভিউই আমাদের জন্য অনেক",
  },
];

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
          className={`text-3xl leading-none transition-transform hover:scale-110 ${
            n <= value ? "text-[var(--color-star)]" : "text-black/15"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function SupportSection({ compact = false }) {
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [thanked, setThanked] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (rating < 1) {
      setError("রেটিং দিন — তারায় ট্যাপ করুন।");
      return;
    }
    if (review.trim().length < 5) {
      setError("দু-এক লাইনের একটা রিভিউ লিখুন।");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supportType: selected, rating, review: review.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "সমস্যা হয়েছে — আবার চেষ্টা করুন।");
        return;
      }
      setThanked(true);
    } catch {
      setError("সংযোগে সমস্যা হয়েছে।");
    } finally {
      setBusy(false);
    }
  }

  if (thanked) {
    return (
      <div className="dd-card p-6 text-center animate-fade-up">
        <div className="text-4xl mb-2">💚</div>
        <h3 className="font-bold mb-1">অসংখ্য ধন্যবাদ!</h3>
        <p className="text-sm text-[var(--color-muted)]">
          আপনার রিভিউ আমাদের এগিয়ে যেতে সাহায্য করবে।
          {selected !== "hug" && " পেমেন্ট অপশন শীঘ্রই আসছে — এখন পর্যন্ত সবকিছু ফ্রি।"}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "max-w-3xl mx-auto"}>
      {!selected ? (
        <div className="dd-card p-5 sm:p-6">
          <h3 className="font-bold mb-1">
            {compact ? "আমাদের কাজ ভালো লাগলে…" : "আমাদের সাপোর্ট করুন"}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            আমরা স্বেচ্ছাসেবী উদ্যোগ — কোনো চাপ নেই। এক কাপ কফি বা শুধু একটা
            রিভিউ, দুটোই আমাদের জন্য মূল্যবান।
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelected(tier.id)}
                className={`text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  tier.highlight
                    ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/[0.04]"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-2">{tier.icon}</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{tier.title}</span>
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    {tier.price}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  {tier.perk}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="dd-card p-5 sm:p-6 animate-fade-up">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] mb-3"
          >
            ← অন্যটা বেছে নিন
          </button>
          <h3 className="font-bold text-center mb-1">
            {TIERS.find((t) => t.id === selected)?.title} —{" "}
            {TIERS.find((t) => t.id === selected)?.price}
          </h3>
          <p className="text-sm text-[var(--color-muted)] text-center mb-4">
            {selected === "hug"
              ? "আপনার অভিজ্ঞতা কেমন ছিল? রেটিং ও রিভিউ দিন।"
              : "পেমেন্ট অপশন শীঘ্রই আসছে — আপাতত আপনার রেটিং ও রিভিউটাই যথেষ্ট।"}
          </p>
          <Stars value={rating} onChange={setRating} />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="আপনার অভিজ্ঞতা লিখুন…"
            rows={3}
            maxLength={1000}
            className="w-full mt-4 rounded-xl border border-black/10 px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 resize-none"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {busy ? "পাঠানো হচ্ছে…" : "রিভিউ জমা দিন"}
          </button>
        </form>
      )}
    </div>
  );
}
