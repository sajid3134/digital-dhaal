"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneVerify from "./PhoneVerify.jsx";
import SupportSection from "./SupportSection.jsx";
import CaseSidebar from "./CaseSidebar.jsx";
import CaseProgress from "./CaseProgress.jsx";
import BreachCheck from "./BreachCheck.jsx";
import { DhaalIcon } from "./Brand.jsx";
import {
  SendIcon,
  MenuIcon,
  CheckCircleIcon,
  PlusIcon,
  LockIcon,
  BadgeCheckIcon,
  ScanFaceIcon,
  FileIcon,
  VideoIcon,
  EyeOffIcon,
} from "./Icons.jsx";

const CLOSED_STATUSES = new Set(["complete", "blocked_minor"]);

export default function ChatWindow({
  userName,
  verified = false,
  initialMessages = [],
  initialStatus = "collecting",
  cases = [],
  activeCaseId = null,
  caseEvents = [],
  caseStatus = "new",
  kycStatus = "none",
  breachCheck = null,
  engineerMessage = "",
  meetingLink = "",
  engineerMessageAt = null,
  lang = "bn",
  t,
  bkashNumber = null,
}) {
  const kycVerified = kycStatus === "verified";
  const router = useRouter();
  const [messages, setMessages] = useState(
    initialMessages.length > 0
      ? initialMessages
      : [{ role: "agent", text: t.chatui.greeting }],
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [failedText, setFailedText] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const listedRef = useRef(initialMessages.length > 0);

  const c = t.chatui;
  const done = CLOSED_STATUSES.has(status);
  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  const clock = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!sending) inputRef.current?.focus();
  }, [sending]);

  async function deliver(text) {
    setSending(true);
    setFailedText(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (res.status === 401) {
        router.push("/login?next=/chat");
        return;
      }
      const data = await res.json();
      if (!res.ok || data.failed) {
        setFailedText(text);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.reply_to_user, at: new Date().toISOString() },
      ]);
      setStatus(data.status ?? "collecting");
      if (!listedRef.current || CLOSED_STATUSES.has(data.status)) {
        listedRef.current = true;
        router.refresh(); // keep sidebar + timeline in sync
      }
    } catch {
      setFailedText(text);
    } finally {
      setSending(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text, at: new Date().toISOString() },
    ]);
    setInput("");
    await deliver(text);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleNewCase() {
    await fetch("/api/chat/new", { method: "POST" });
    router.refresh();
  }

  const showTimeline =
    activeCaseId && (done || (caseStatus && caseStatus !== "new"));
  const resolved = caseStatus === "resolved" || caseStatus === "closed";

  // Per-case security tools: breach/leak check, identity verification (demo),
  // and — once the case is resolved — the downloadable incident report.
  const securityTools = activeCaseId ? (
    <div className="space-y-3">
      <BreachCheck caseId={activeCaseId} initial={breachCheck} t={t.breach} lang={lang} />
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/kyc"
          className="dd-card hover-lift p-4 flex items-center gap-3 flex-1"
        >
          <div className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center">
            {kycVerified ? (
              <BadgeCheckIcon width={18} height={18} />
            ) : (
              <ScanFaceIcon width={18} height={18} />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight">
              {kycVerified ? t.kyc.verifiedBadge : t.kyc.title}
            </p>
            <p className="text-xs text-[var(--color-muted)] leading-snug mt-0.5 truncate">
              {kycVerified ? t.kyc.resultSub : t.kyc.sub}
            </p>
          </div>
        </Link>
        {resolved && (
          <a
            href={`/report/${activeCaseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dd-card hover-lift p-4 flex items-center gap-3 flex-1"
          >
            <div className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center">
              <FileIcon width={18} height={18} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight">{t.report.download}</p>
              <p className="text-xs text-[var(--color-muted)] leading-snug mt-0.5 font-mono">
                PDF · {activeCaseId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </a>
        )}
      </div>
    </div>
  ) : null;

  // Engineer's message to the victim (with an optional meeting link). Rendered
  // as its own prominent, catchable panel at the very top of the chat — this is
  // how the engineer reaches her, so it must be impossible to miss.
  const engineerCard = engineerMessage ? (
    <div className="animate-fade-up rounded-2xl border-2 border-[var(--color-primary)]/35 bg-gradient-to-br from-[var(--color-primary-soft)] to-[var(--color-surface)] shadow-md overflow-hidden">
      <div className="bg-[var(--color-primary)] text-white px-5 py-2.5 flex items-center gap-2">
        <BadgeCheckIcon width={17} height={17} />
        <span className="font-semibold text-[15px]">{c.engineerMsgTitle}</span>
        {engineerMessageAt && (
          <span className="ml-auto text-[11px] text-white/85 font-mono">
            {new Date(engineerMessageAt).toLocaleString(locale, {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-[16px] leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
          {engineerMessage}
        </p>
        {meetingLink && (
          <div className="mt-4 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-surface)] p-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center shrink-0">
              <VideoIcon width={24} height={24} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-tight">{c.joinCallTitle}</p>
              <p className="text-xs text-[var(--color-muted)] font-mono truncate">{meetingLink}</p>
            </div>
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-3 text-[15px] font-bold transition-all hover:shadow-md"
            >
              <VideoIcon width={19} height={19} />
              {c.joinCall}
            </a>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // Minimal, post-service review — only shown once the case is resolved.
  const reviewBlock = resolved ? (
    <div className="animate-fade-up space-y-3 pt-1">
      <div className="dd-card p-5 flex items-start gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          <CheckCircleIcon width={22} height={22} />
        </span>
        <div>
          <h3 className="font-bold">{c.resolvedTitle}</h3>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">{c.resolvedSub}</p>
        </div>
      </div>
      <SupportSection t={t} bkashNumber={bkashNumber} compact />
    </div>
  ) : null;

  return (
    <div className="flex h-dvh bg-[var(--color-bg)]">
      <CaseSidebar
        cases={cases}
        activeCaseId={activeCaseId}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        t={c}
        lang={lang}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-gradient-to-r from-white via-white to-[var(--color-primary-soft)] border-b border-black/5 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 shrink-0 rounded-lg border border-black/10 flex items-center justify-center hover:bg-black/[0.03] transition-colors"
              aria-label="History"
            >
              <MenuIcon width={18} height={18} />
            </button>
            <DhaalIcon size={38} className="shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-[17px] leading-tight truncate">Digital Dhaal</p>
              <p className="text-xs text-[var(--color-muted)] leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {c.confidential}
              </p>
            </div>
            {activeCaseId && (
              <span
                className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  done
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {done ? c.statusDone : c.statusActive}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="dd-chip dd-chip-secure hidden md:inline-flex">
              <LockIcon width={11} height={11} />
              {t.security.secureSession}
            </span>
            {kycVerified && (
              <span className="dd-chip dd-chip-secure hidden lg:inline-flex">
                <BadgeCheckIcon width={11} height={11} />
                {t.security.idVerified}
              </span>
            )}
            <span className="hidden sm:block text-sm text-[var(--color-muted)]">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] border border-black/10 rounded-lg px-3 py-1.5 transition-colors hover:bg-black/[0.03]"
            >
              {c.logout}
            </button>
          </div>
        </header>

        {/* Cyber trust strip — a slim partition that keeps the calm security
            register visible and reassures "we never ask for passwords". */}
        <div className="dd-cyber-grid border-b border-black/5">
          <div className="max-w-3xl mx-auto px-4 py-1.5 flex items-center gap-2 flex-wrap">
            <span className="dd-chip dd-chip-dark">
              <LockIcon width={11} height={11} />
              {t.security.chipEncrypted}
            </span>
            <span className="dd-chip dd-chip-dark">
              <EyeOffIcon width={11} height={11} />
              {t.security.chipConfidential}
            </span>
            {verified && (
              <span className="dd-chip dd-chip-dark">
                <BadgeCheckIcon width={11} height={11} />
                {t.security.chipVerified}
              </span>
            )}
            <span className="ml-auto hidden sm:inline font-mono text-[11px] text-[var(--color-cyber)]/85">
              {c.neverAsk}
            </span>
          </div>
        </div>

        {!verified && <PhoneVerify t={c} tv={t.verify} />}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-[var(--color-primary-soft)]/30">
          <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
            {engineerCard}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 animate-fade-up ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role !== "user" && (
                  <span className="shrink-0 mb-4 w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
                    <DhaalIcon size={20} />
                  </span>
                )}
                <div className={`max-w-[85%] sm:max-w-[72%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block text-left rounded-2xl px-4 py-3 text-[16px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-br-md shadow-md shadow-[var(--color-primary)]/25"
                        : "bg-white border border-black/[0.06] shadow-md shadow-black/[0.03] text-[var(--color-text)] rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.at && (
                    <p className="text-[10px] text-[var(--color-muted)] mt-1 px-1">
                      {clock(m.at)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-end gap-2 justify-start animate-fade-up">
                <span className="shrink-0 w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
                  <DhaalIcon size={20} />
                </span>
                <div className="rounded-2xl rounded-bl-md bg-white border border-black/[0.06] shadow-md shadow-black/[0.03] px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {failedText && !sending && (
              <div className="flex justify-start animate-fade-up">
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-center gap-3">
                  {c.failed}
                  <button
                    onClick={() => deliver(failedText)}
                    className="font-semibold underline underline-offset-2"
                  >
                    {c.retry}
                  </button>
                </div>
              </div>
            )}

            {done && (
              <div className="animate-fade-up space-y-4 pt-2">
                <div className="dd-card p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                      <CheckCircleIcon width={20} height={20} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{c.caseDoneTitle}</h3>
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                        {c.caseDoneText}
                      </p>
                      <button
                        onClick={handleNewCase}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        <PlusIcon width={14} height={14} />
                        {c.newCaseBtn}
                      </button>
                    </div>
                  </div>
                </div>

                {showTimeline && (
                  <CaseProgress
                    events={caseEvents}
                    caseStatus={caseStatus}
                    labels={t.progress}
                    title={c.progressTitle}
                    lang={lang}
                  />
                )}

                {securityTools}
              </div>
            )}

            {!done && showTimeline && (
              <div className="animate-fade-up pt-2 space-y-4">
                <CaseProgress
                  events={caseEvents}
                  caseStatus={caseStatus}
                  labels={t.progress}
                  title={c.progressTitle}
                  lang={lang}
                />
                {securityTools}
              </div>
            )}

            {reviewBlock}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="bg-white border-t border-black/5">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={done ? c.placeholderDone : c.placeholder}
              disabled={sending}
              autoFocus
              className="flex-1 rounded-full border border-black/10 px-5 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 disabled:bg-black/[0.02]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={c.send}
              className="w-12 h-12 shrink-0 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white flex items-center justify-center transition-all disabled:opacity-40 hover:shadow-md"
            >
              <SendIcon width={18} height={18} />
            </button>
          </form>
          <p className="text-center text-[11px] text-[var(--color-muted)] pb-2.5">
            {c.neverAsk}
          </p>
        </div>
      </div>
    </div>
  );
}
