"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GoogleIcon } from "./Icons.jsx";

export default function AuthForm({ t }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const urlError = searchParams.get("error");

  const [error, setError] = useState(
    urlError === "google_failed"
      ? t.googleFailed
      : urlError === "google_not_configured"
        ? t.googleNotConfigured
        : "",
  );

  const [busy, setBusy] = useState(false);

  const next = searchParams.get("next") || "/chat";

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const res = await fetch(
        `/api/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            mode === "login"
              ? { email, password }
              : { name, email, password },
          ),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.genericError);
        return;
      }

      // New accounts verify their phone number first;
      // returning users go straight in.
      router.push(mode === "register" ? "/verify" : next);
      router.refresh();
    } catch {
      setError(t.connError);
    } finally {
      setBusy(false);
    }
  }

  const tabClass = (active) =>
    `flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
      active
        ? "bg-[var(--color-primary)] text-white shadow-sm"
        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
    }`;

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex gap-1 rounded-2xl bg-black/5 p-1">
        <button
          type="button"
          className={tabClass(mode === "login")}
          onClick={() => setMode("login")}
        >
          {t.loginTab}
        </button>

        <button
          type="button"
          className={tabClass(mode === "register")}
          onClick={() => setMode("register")}
        >
          {t.registerTab}
        </button>
      </div>

      {/* Google first — one tap, no form. */}
      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white py-3 text-[15px] font-medium transition-all hover:border-black/20 hover:bg-black/[0.03]"
      >
        <GoogleIcon />
        {mode === "register" ? t.googleSignup : t.google}
      </a>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />

        <span className="text-xs text-[var(--color-muted)]">
          {t.or}
        </span>

        <div className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.name}
            required
            minLength={2}
            maxLength={80}
            className={inputClass}
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.email}
          required
          className={inputClass}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "register" ? t.passwordNew : t.password}
          required
          minLength={8}
          className={inputClass}
        />

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {busy
            ? t.wait
            : mode === "login"
              ? t.loginBtn
              : t.registerBtn}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-[var(--color-muted)]">
        {t.privacy}
      </p>
    </div>
  );
}
