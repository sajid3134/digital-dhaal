"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm({ googleEnabled }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("error") === "google_failed"
      ? "গুগল লগইন ব্যর্থ হয়েছে — আবার চেষ্টা করুন।"
      : "",
  );
  const [busy, setBusy] = useState(false);

  const next = searchParams.get("next") || "/chat";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { name, email, password },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "কিছু একটা সমস্যা হয়েছে — আবার চেষ্টা করুন।");
        return;
      }
      // New accounts verify their phone number first; returning users go straight in.
      router.push(mode === "register" ? "/verify" : next);
      router.refresh();
    } catch {
      setError("সংযোগে সমস্যা হয়েছে — আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  const tabClass = (active) =>
    `flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
      active
        ? "bg-[var(--color-primary)] text-white shadow-sm"
        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
    }`;

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-1 p-1 bg-black/5 rounded-2xl mb-6">
        <button type="button" className={tabClass(mode === "login")} onClick={() => setMode("login")}>
          লগইন
        </button>
        <button type="button" className={tabClass(mode === "register")} onClick={() => setMode("register")}>
          নতুন অ্যাকাউন্ট
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম"
            required
            minLength={2}
            maxLength={80}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ইমেইল"
          required
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "register" ? "পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)" : "পাসওয়ার্ড"}
          required
          minLength={8}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 text-[15px] font-semibold transition-colors disabled:opacity-50"
        >
          {busy ? "একটু অপেক্ষা করুন…" : mode === "login" ? "লগইন করুন" : "অ্যাকাউন্ট খুলুন"}
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs text-[var(--color-muted)]">অথবা</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-black/10 bg-white hover:bg-black/[0.03] py-3 text-[15px] font-medium transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
              <path fill="#FBBC05" d="M10.3 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.5-5.9l-7.6-5.9c-2.1 1.4-4.8 2.3-7.9 2.3-6.4 0-11.8-3.7-13.7-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            গুগল দিয়ে চালিয়ে যান
          </a>
        </>
      )}

      <p className="text-xs text-[var(--color-muted)] text-center mt-6 leading-relaxed">
        লগইন করলে আমরা শুধু আপনার নাম ও ইমেইল রাখি। আপনার কেসের তথ্য সম্পূর্ণ
        গোপন থাকে — শুধু আমাদের ইঞ্জিনিয়ার দেখতে পারেন।
      </p>
    </div>
  );
}
