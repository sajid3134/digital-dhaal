"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneVerify from "./PhoneVerify.jsx";
import SupportSection from "./SupportSection.jsx";
import CaseSidebar from "./CaseSidebar.jsx";
import CaseProgress from "./CaseProgress.jsx";
import { SendIcon, MenuIcon, CheckCircleIcon, PlusIcon } from "./Icons.jsx";

// Must match the "Opening message" line in digital-dhaal-intake-agent-prompt.md.
const OPENING_MESSAGE =
  "আসসালামু আলাইকুম / নমস্কার! আমি ডিজিটাল ঢালের সহকারী। আপনি নিরাপদ জায়গায় এসেছেন — এখানে যা বলবেন তা সম্পূর্ণ গোপন থাকবে। একটু ধীরে ধীরে বলুন, কী হয়েছে?";

const CLOSED_STATUSES = new Set(["complete", "blocked_minor"]);

export default function ChatWindow({
  userName,
  phoneVerified,
  initialMessages = [],
  initialStatus = "collecting",
  cases = [],
  activeCaseId = null,
  caseEvents = [],
  caseStatus = "new",
  lang = "bn",
  t,
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(
    initialMessages.length > 0
      ? initialMessages
      : [{ role: "agent", text: OPENING_MESSAGE }],
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
        <header className="bg-white border-b border-black/5 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 shrink-0 rounded-lg border border-black/10 flex items-center justify-center hover:bg-black/[0.03] transition-colors"
              aria-label="History"
            >
              <MenuIcon width={18} height={18} />
            </button>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
              ঢাল
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight truncate">Digital Dhaal</p>
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
            <span className="hidden sm:block text-sm text-[var(--color-muted)]">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] border border-black/10 rounded-lg px-3 py-1.5 transition-colors hover:bg-black/[0.03]"
            >
              {c.logout}
            </button>
          </div>
        </header>

        {!phoneVerified && <PhoneVerify t={c} tv={t.verify} />}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 animate-fade-up ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role !== "user" && (
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-bold mb-4">
                    ঢাল
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[72%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block text-left rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[var(--color-bubble-user)] text-white rounded-br-md shadow-sm"
                        : "bg-white border border-black/5 shadow-sm text-[var(--color-text)] rounded-bl-md"
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
                <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-bold">
                  ঢাল
                </div>
                <div className="rounded-2xl rounded-bl-md bg-white border border-black/5 shadow-sm px-4 py-3 flex items-center gap-1.5">
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

                <SupportSection t={t} compact />
              </div>
            )}

            {!done && showTimeline && (
              <div className="animate-fade-up pt-2">
                <CaseProgress
                  events={caseEvents}
                  caseStatus={caseStatus}
                  labels={t.progress}
                  title={c.progressTitle}
                  lang={lang}
                />
              </div>
            )}

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
