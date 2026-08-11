"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IdCardIcon,
  CameraIcon,
  UploadIcon,
  ScanFaceIcon,
  BadgeCheckIcon,
  RefreshIcon,
  AlertIcon,
  CheckIcon,
} from "./Icons.jsx";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Prototype identity check. IMPORTANT: no real biometric matching happens and
// no image is ever uploaded — the NID photo and selfie stay in the browser as
// data URLs. Only a "verified" status flag is sent to the server.
export default function KycVerify({ t, initialStatus = "none" }) {
  const [nid, setNid] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(initialStatus === "verified" ? "done" : "idle");
  const [step, setStep] = useState(0);
  const [confidence, setConfidence] = useState(97);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  // Always release the camera when the component goes away.
  useEffect(() => () => stopCamera(), []);

  async function startCamera() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // Attach after the <video> is in the DOM.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setCameraError(t.cameraError);
    }
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setSelfie(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  }

  function onNidFile(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setNid(reader.result);
    reader.readAsDataURL(file);
  }

  async function verify() {
    if (!nid || !selfie) {
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
    setNid(null);
    setSelfie(null);
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
            {t.retake}
          </button>
        </div>

        <p className="mt-5 text-[11px] text-[var(--color-muted)]">{t.prototypeNote}</p>
      </div>
    );
  }

  /* --------------------------- capture flow --------------------------- */
  return (
    <div className="space-y-4">
      {/* Prototype disclaimer — impossible to miss */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 text-sm text-amber-800">
        <AlertIcon width={18} height={18} className="shrink-0 mt-0.5" />
        <p className="leading-snug">{t.prototypeNote}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Step 1 — NID */}
        <div className="dd-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <IdCardIcon width={18} height={18} className="text-[var(--color-primary-dark)]" />
            <h3 className="font-semibold">{t.step1Title}</h3>
            {nid && <CheckIcon width={16} height={16} className="text-green-600 ml-auto" />}
          </div>
          <p className="text-sm text-[var(--color-muted)] mb-3">{t.step1Hint}</p>

          <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-black/10 bg-black/[0.02] overflow-hidden flex items-center justify-center">
            {nid ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={nid} alt="NID preview" className="w-full h-full object-cover" />
            ) : (
              <IdCardIcon width={38} height={38} className="text-black/15" />
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onNidFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 w-full rounded-xl border border-black/10 py-2.5 text-sm font-medium hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2"
          >
            <UploadIcon width={16} height={16} />
            {nid ? t.replaceFile : t.chooseFile}
          </button>
        </div>

        {/* Step 2 — Selfie */}
        <div className="dd-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <ScanFaceIcon width={18} height={18} className="text-[var(--color-primary-dark)]" />
            <h3 className="font-semibold">{t.step2Title}</h3>
            {selfie && <CheckIcon width={16} height={16} className="text-green-600 ml-auto" />}
          </div>
          <p className="text-sm text-[var(--color-muted)] mb-3">{t.step2Hint}</p>

          <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-black/10 bg-black/[0.02] overflow-hidden flex items-center justify-center relative">
            {selfie ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selfie} alt="Selfie preview" className="w-full h-full object-cover" />
            ) : cameraOn ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <ScanFaceIcon width={38} height={38} className="text-black/15" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          {!selfie ? (
            cameraOn ? (
              <button
                onClick={capture}
                className="mt-3 w-full rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-2.5 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <CameraIcon width={16} height={16} />
                {t.capture}
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="mt-3 w-full rounded-xl border border-black/10 py-2.5 text-sm font-medium hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2"
              >
                <CameraIcon width={16} height={16} />
                {t.startCamera}
              </button>
            )
          ) : (
            <button
              onClick={() => {
                setSelfie(null);
                startCamera();
              }}
              className="mt-3 w-full rounded-xl border border-black/10 py-2.5 text-sm font-medium hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshIcon width={15} height={15} />
              {t.retake}
            </button>
          )}
          {cameraError && <p className="text-xs text-red-600 mt-2">{cameraError}</p>}
        </div>
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
