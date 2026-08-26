"use client";

import { useRef } from "react";
import { AlertIcon, PlusIcon, ImageIcon } from "./Icons.jsx";

// Victim-side evidence gallery: attached screenshots + an "add" tile. Upload
// logic lives in the parent (ChatWindow) so paste-to-upload can share it.
// Copy makes the safety rule loud: screenshots yes, intimate photos never.
export default function EvidencePanel({
  evidence = [],
  max = 10,
  uploading = false,
  error = "",
  onFiles,
  t,
}) {
  const inputRef = useRef(null);
  const full = evidence.length >= max;

  return (
    <div className="rounded-xl border border-black/[0.07] bg-[var(--color-surface)] px-3 py-2.5">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon width={15} height={15} className="text-[var(--color-primary-dark)] shrink-0" />
        <p className="font-semibold text-[13px] leading-none">{t.title}</p>
        <span className="text-[11px] text-[var(--color-muted)] font-mono">{evidence.length}/{max}</span>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-amber-700 leading-tight text-right">
          <AlertIcon width={12} height={12} className="shrink-0" />
          <span className="hidden sm:inline">{t.safety}</span>
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {evidence.map((ev) => (
          <a
            key={ev.id}
            href={`/api/evidence/${ev.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 rounded-lg overflow-hidden border border-black/10 bg-black/[0.03] hover:ring-2 hover:ring-[var(--color-primary)]/40 transition-shadow shrink-0"
            title={t.open}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/evidence/${ev.id}`} alt="evidence" className="w-full h-full object-cover" />
          </a>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-[var(--color-primary)]/30 text-[var(--color-primary-dark)] bg-[var(--color-primary-soft)]/40 hover:bg-[var(--color-primary-soft)] flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="typing-dot !bg-[var(--color-primary)]" />
            ) : (
              <>
                <PlusIcon width={16} height={16} />
                <span className="text-[9px] font-medium leading-none text-center px-1">{t.add}</span>
              </>
            )}
          </button>
        )}
      </div>

      <span className="sm:hidden mt-1.5 flex items-start gap-1 text-[11px] text-amber-700 leading-snug">
        <AlertIcon width={12} height={12} className="shrink-0 mt-0.5" />
        {t.safety}
      </span>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          onFiles?.(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
