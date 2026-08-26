"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneIcon, MailIcon, LockIcon } from "./Icons.jsx";

// Slim in-chat banner to verify identity for users who skipped the /verify
// step. Offers email OR phone. Demo mode: code prints to the server terminal.
export default function PhoneVerify({ t, tv }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("email");
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
      setTimeout(() => router.refresh(), 1200);
    }
  }

  if (step === "done") {
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 py-2.5 text-center text-sm text-green-700">
        {t.verifiedNote}
      </div>
    );
  }

  const chip = (m, Icon, label) => (
    <button
      type="button"
      onClick={() => setMethod(m)}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
        method === m
          ? "bg-amber-500 text-white"
          : "bg-white text-amber-800 border border-amber-200"
      }`}
    >
      <Icon width={12} height={12} />
      {label}
    </button>
  );

  return (
    <div className="bg-amber-50 border-b border-amber-100">
      <div className="max-w-3xl mx-auto px-4 py-2.5">
        {!open ? (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-amber-800 flex items-center gap-2">
              <LockIcon width={15} height={15} />
              {t.verifyBanner}
            </span>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 font-semibold text-amber-900 underline underline-offset-2"
            >
              {t.verifyAction}
            </button>
          </div>
        ) : step === "send" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-800">{tv.chooseMethod}</span>
              {chip("email", MailIcon, tv.methodEmail)}
              {chip("phone", PhoneIcon, tv.methodPhone)}
            </div>
            <form onSubmit={sendCode} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              {method === "phone" && (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tv.phonePlaceholder}
                  inputMode="numeric"
                  required
                  className="flex-1 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-amber-400"
                />
              )}
              {method === "email" && (
                <span className="flex-1 text-xs text-amber-800 self-center">{tv.emailWhy}</span>
              )}
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {busy ? tv.sending : method === "email" ? tv.sendEmailBtn : tv.sendBtn}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={verifyCode} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={tv.codePlaceholder}
              inputMode="numeric"
              maxLength={6}
              required
              className="flex-1 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {busy ? tv.verifying : tv.verifyBtn}
            </button>
            <button
              type="button"
              onClick={() => { setStep("send"); setCode(""); setNotice(""); }}
              className="text-xs text-amber-800 underline"
            >
              {tv.changeMethod}
            </button>
          </form>
        )}
        {notice && open && <p className="text-xs text-amber-700 mt-1.5">{notice}</p>}
        {error && open && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      </div>
    </div>
  );
}
