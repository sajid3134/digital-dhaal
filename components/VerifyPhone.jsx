"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneIcon, CheckCircleIcon } from "./Icons.jsx";

// Full-page phone verification shown right after signup.
// Demo mode: the code prints in the server terminal instead of a real SMS.
export default function VerifyPhone({ userName, t }) {
  const router = useRouter();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function post(path, body) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "…");
        return null;
      }
      return data;
    } catch {
      setError("…");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function sendCode(e) {
    e.preventDefault();
    const data = await post("/api/auth/otp/send", { phone });
    if (data) {
      setNotice(data.message || "");
      setStep("code");
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    const data = await post("/api/auth/otp/verify", { code });
    if (data) {
      setStep("done");
      setTimeout(() => {
        router.push("/chat");
        router.refresh();
      }, 1200);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-lg text-center tracking-wide outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

  return (
    <div className="w-full max-w-md dd-card p-8 animate-fade-up">
      {step === "done" ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <CheckCircleIcon width={32} height={32} />
          </div>
          <h2 className="text-xl font-bold mb-1">{t.done}</h2>
          <p className="text-[var(--color-muted)]">{t.toChat}</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center mb-4">
              <PhoneIcon width={26} height={26} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {userName ? `${userName}, ` : ""}
              {t.title}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">{t.why}</p>
          </div>

          {step === "phone" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                inputMode="numeric"
                required
                autoFocus
                className={inputClass}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3.5 font-semibold transition-colors disabled:opacity-50"
              >
                {busy ? t.sending : t.sendBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t.codePlaceholder}
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                className={inputClass}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3.5 font-semibold transition-colors disabled:opacity-50"
              >
                {busy ? t.verifying : t.verifyBtn}
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                ← {t.changeNumber}
              </button>
            </form>
          )}

          {notice && <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-2.5 mt-4">{notice}</p>}
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 mt-4">{error}</p>}

          <p className="text-center mt-6">
            <Link
              href="/chat"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors"
            >
              {t.skip}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
