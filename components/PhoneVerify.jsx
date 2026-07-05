"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Banner + inline flow to verify a phone number. Currently demo mode:
// the code is printed to the server terminal instead of a real SMS.
export default function PhoneVerify() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("phone"); // "phone" | "code" | "done"
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
        setError(data.error || "সমস্যা হয়েছে — আবার চেষ্টা করুন।");
        return null;
      }
      return data;
    } catch {
      setError("সংযোগে সমস্যা হয়েছে।");
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
      setTimeout(() => router.refresh(), 1200);
    }
  }

  if (step === "done") {
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 py-2.5 text-center text-sm text-green-700">
        ✓ নম্বর যাচাই সম্পন্ন — ধন্যবাদ!
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100">
      <div className="max-w-3xl mx-auto px-4 py-2.5">
        {!open ? (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-amber-800">
              📱 মোবাইল নম্বর যাচাই করুন — আপনার কেস দ্রুত ও নিরাপদে এগোবে
            </span>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 font-semibold text-amber-900 underline underline-offset-2"
            >
              যাচাই করুন
            </button>
          </div>
        ) : (
          <form
            onSubmit={step === "phone" ? sendCode : verifyCode}
            className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
          >
            {step === "phone" ? (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                inputMode="numeric"
                required
                className="flex-1 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-amber-400"
              />
            ) : (
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="৬ সংখ্যার কোড"
                inputMode="numeric"
                maxLength={6}
                required
                className="flex-1 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-amber-400"
              />
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {busy ? "…" : step === "phone" ? "কোড পাঠান" : "যাচাই করুন"}
            </button>
            {step === "code" && (
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs text-amber-800 underline"
              >
                নম্বর বদলান
              </button>
            )}
          </form>
        )}
        {notice && open && (
          <p className="text-xs text-amber-700 mt-1.5">{notice}</p>
        )}
        {error && open && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      </div>
    </div>
  );
}
