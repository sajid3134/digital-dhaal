"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneIcon, MailIcon, CheckCircleIcon, LockIcon } from "./Icons.jsx";

// Identity verification after signup. The user chooses email OR phone; a code
// is sent (demo mode: printed to the server terminal) and confirmed here.
export default function VerifyPhone({ userName, userEmail, t }) {
  const router = useRouter();
  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [step, setStep] = useState("send"); // "send" | "code" | "done"
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
    const body = method === "email" ? { method: "email" } : { method: "phone", phone };
    const data = await post("/api/auth/otp/send", body);
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

  const methodBtn = (m, Icon, label) => (
    <button
      type="button"
      onClick={() => {
        setMethod(m);
        setError("");
        setNotice("");
      }}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        method === m
          ? "bg-[var(--color-primary)] text-white shadow-sm"
          : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
      }`}
    >
      <Icon width={16} height={16} />
      {label}
    </button>
  );

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
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center mb-4">
              {method === "email" ? <MailIcon width={26} height={26} /> : <PhoneIcon width={26} height={26} />}
            </div>
            <h2 className="text-xl font-bold mb-2">
              {userName ? `${userName}, ` : ""}
              {t.title}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">{t.why}</p>
          </div>

          {step === "send" && (
            <>
              <p className="text-xs font-semibold text-[var(--color-muted)] mb-2">{t.chooseMethod}</p>
              <div className="flex gap-1 p-1 bg-black/5 rounded-2xl mb-5">
                {methodBtn("email", MailIcon, t.methodEmail)}
                {methodBtn("phone", PhoneIcon, t.methodPhone)}
              </div>

              <form onSubmit={sendCode} className="space-y-4">
                {method === "email" ? (
                  <div className="rounded-xl bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/15 px-4 py-3 text-sm">
                    <p className="text-[var(--color-muted)]">{t.emailWhy}</p>
                    {userEmail && <p className="font-mono text-[var(--color-primary-dark)] mt-1 break-all">{userEmail}</p>}
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[var(--color-muted)]">{t.phoneWhy}</p>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      inputMode="numeric"
                      required
                      autoFocus
                      className={inputClass}
                    />
                  </>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3.5 font-semibold transition-colors disabled:opacity-50"
                >
                  {busy ? t.sending : method === "email" ? t.sendEmailBtn : t.sendBtn}
                </button>
              </form>
            </>
          )}

          {step === "code" && (
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
                onClick={() => {
                  setStep("send");
                  setCode("");
                  setNotice("");
                }}
                className="w-full text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                ← {t.changeMethod}
              </button>
            </form>
          )}

          {notice && <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-2.5 mt-4">{notice}</p>}
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 mt-4">{error}</p>}

          <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted)] mt-5">
            <LockIcon width={13} height={13} className="text-[var(--color-primary)]" />
            {t.noPassword}
          </p>

          <p className="text-center mt-3">
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
