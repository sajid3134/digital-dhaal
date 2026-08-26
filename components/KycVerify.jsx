"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  IdCardIcon,
  UploadIcon,
  BadgeCheckIcon,
  RefreshIcon,
  AlertIcon,
  CheckIcon,
  LockIcon,
} from "./Icons.jsx";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Teal corner brackets — the "scanning frame" that guides the user and makes
// the capture feel like a real identity check.
function ScanCorners() {
  const base = "absolute w-6 h-6 border-[var(--color-primary)]";
  return (
    <>
      <span className={`${base} top-2 left-2 border-t-2 border-l-2 rounded-tl-md`} />
      <span className={`${base} top-2 right-2 border-t-2 border-r-2 rounded-tr-md`} />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md`} />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2 rounded-br-md`} />
    </>
  );
}

// Prototype identity check. IMPORTANT: no real matching happens and no image is
// uploaded — the ID photos stay in the browser as data URLs. Only a "verified"
// status flag is sent to the server. The user photographs both sides of their
// NSU ID card or NID; no selfie is taken.
export default function KycVerify({ t, initialStatus = "none" }) {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(initialStatus === "verified" ? "done" : "idle");
  const [step, setStep] = useState(0);
  const [confidence, setConfidence] = useState(97);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  function onFile(e, setter) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  }

  async function verify() {
    if (!front || !back) {
      setError(t.needBoth);
      return;
    }
    setError("");
    setPhase("analyzing");
    for (let i = 0; i < t.analyzing.length; i++) {
      setStep(i);
      await sleep(750);
    }
    setConfidence(94 + Math.floor(Math.random() * 5)); // 94–98%, simulated
    try {
      await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified" }),
      });
    } catch {
      /* status is best-effort in the demo */
    }
    setPhase("done");
  }

  function reset() {
    setFront(null);
    setBack(null);
    setError("");
    setStep(0);
    setPhase("idle");
  }

  /* ------------------------------ done ------------------------------ */
  if (phase === "done") {
    return (
      <div className="dd-card p-7 text-center animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
          <BadgeCheckIcon width={34} height={34} />
        </div>
        <h2 className="text-xl font-bold">{t.resultTitle}</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1.5 max-w-sm mx-auto">{t.resultSub}</p>

        <div className="mt-5 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-[var(--color-muted)]">
              {t.confidence} <span className="font-mono text-[11px]">{t.simulated}</span>
            </span>
            <span className="font-mono font-semibold text-green-700">{confidence}%</span>
          </div>
          <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-[width] duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/chat"
            className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {t.done}
          </Link>
          <button
            onClick={reset}
            className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshIcon width={15} height={15} />
            {t.chooseFile}
          </button>
        </div>

        <p className="mt-5 text-[11px] text-[var(--color-muted)]">{t.prototypeNote}</p>
      </div>
    );
  }

  /* --------------------------- capture flow --------------------------- */
  const uploadBox = (img, setter, ref, title, hint) => (
    <div className="dd-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <IdCardIcon width={18} height={18} className="text-[var(--color-primary-dark)]" />
        <h3 className="font-semibold">{title}</h3>
        {img && <CheckIcon width={16} height={16} className="text-green-600 ml-auto" />}
      </div>
      <p className="text-sm text-[var(--color-muted)] mb-3">{hint}</p>

      <div className="relative aspect-[16/10] rounded-xl border-2 border-dashed border-[var(--color-primary)]/25 bg-[var(--color-primary-soft)]/40 overflow-hidden flex flex-col items-center justify-center">
        {img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="ID preview" className="w-full h-full object-cover" />
            <ScanCorners />
          </>
        ) : (
          <>
            <ScanCorners />
            <IdCardIcon width={38} height={38} className="text-[var(--color-primary)]/40" />
            <p className="text-[11px] text-[var(--color-primary-dark)]/70 mt-2 px-4 text-center">
              {t.frameLabel}
            </p>
          </>
        )}
      </div>

      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={(e) => onFile(e, setter)} className="hidden" />
      <button
        onClick={() => ref.current?.click()}
        className="mt-3 w-full rounded-xl border border-black/10 py-2.5 text-sm font-medium hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2"
      >
        <UploadIcon width={16} height={16} />
        {img ? t.replaceFile : t.chooseFile}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Safety reassurance — front and center, calm and trust-building */}
      <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-4 py-3 flex gap-3 text-sm text-[var(--color-primary-dark)]">
        <LockIcon width={18} height={18} className="shrink-0 mt-0.5" />
        <p className="leading-snug font-medium">{t.safeLine}</p>
      </div>

      {/* Prototype disclaimer — impossible to miss */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 text-sm text-amber-800">
        <AlertIcon width={18} height={18} className="shrink-0 mt-0.5" />
        <p className="leading-snug">{t.prototypeNote}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {uploadBox(front, setFront, frontRef, t.step1Title, t.step1Hint)}
        {uploadBox(back, setBack, backRef, t.step2Title, t.step2Hint)}
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        onClick={verify}
        disabled={phase === "analyzing"}
        className="w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3.5 text-[15px] font-semibold transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {phase === "analyzing" ? (
          <>
            <span className="typing-dot !bg-white" />
            <span className="font-mono text-sm">{t.analyzing[step]}</span>
          </>
        ) : (
          <>
            <BadgeCheckIcon width={18} height={18} />
            {t.verifyBtn}
          </>
        )}
      </button>
    </div>
  );
}
