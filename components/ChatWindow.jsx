"use client";

import { useEffect, useRef, useState } from "react";

// Must match the "Opening message" line in digital-dhaal-intake-agent-prompt.md.
const OPENING_MESSAGE =
  "আসসালামু আলাইকুম। আমি ডিজিটাল ঢালের সহকারী। আপনি নিরাপদ জায়গায় এসেছেন — এখানে যা বলবেন তা গোপন থাকবে। একটু ধীরে ধীরে বলুন, কী হয়েছে?";

const CLOSED_STATUSES = new Set(["complete", "blocked_minor"]);

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: "agent", text: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("collecting");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || CLOSED_STATUSES.has(status)) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.reply_to_user },
      ]);
      setStatus(data.status ?? "collecting");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "দুঃখিত, সংযোগে সমস্যা হয়েছে। একটু পর আবার চেষ্টা করুন।",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  const closed = CLOSED_STATUSES.has(status);

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-[var(--color-surface)] shadow-sm">
      <header className="px-5 py-4 border-b border-black/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-semibold">
          ঢাল
        </div>
        <div>
          <p className="font-semibold leading-tight">Digital Dhaal</p>
          <p className="text-xs text-[var(--color-muted)] leading-tight">
            আপনার তথ্য সম্পূর্ণ গোপনীয়
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[var(--color-bubble-user)] text-white rounded-br-sm"
                  : "bg-[var(--color-bubble-agent)] text-[var(--color-text)] rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-[var(--color-bubble-agent)] px-4 py-2.5 text-sm text-[var(--color-muted)]">
              লিখছে…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {closed ? (
        <div className="px-5 py-4 border-t border-black/5 text-sm text-center text-[var(--color-muted)]">
          আপনার তথ্য সংরক্ষণ করা হয়েছে। আমাদের একজন টিম মেম্বার শীঘ্রই যোগাযোগ করবেন।
        </div>
      ) : (
        <form onSubmit={handleSend} className="px-4 py-3 border-t border-black/5 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="এখানে লিখুন…"
            disabled={sending}
            className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-[15px] outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-full bg-[var(--color-primary)] text-white px-5 py-2.5 text-sm font-medium disabled:opacity-40"
          >
            পাঠান
          </button>
        </form>
      )}
    </div>
  );
}
