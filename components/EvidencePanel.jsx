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
    <div className="dd-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 shrink-0 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center">
          <ImageIcon width={17} height={17} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight">{t.title}</p>
          <p className="text-[11px] text-[var(--color-muted)] leading-tight">
            {evidence.length}/{max}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex gap-2 text-[12px] text-amber-800 leading-snug mb-3">
        <AlertIcon width={14} height={14} className="shrink-0 mt-0.5" />
        <span>{t.safety}</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {evidence.map((ev) => (
          <a
            key={ev.id}
            href={`/api/evidence/${ev.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-lg overflow-hidden border border-black/10 bg-black/[0.03] hover:ring-2 hover:ring-[var(--color-primary)]/40 transition-shadow"
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
            className="aspect-square rounded-lg border-2 border-dashed border-[var(--color-primary)]/30 text-[var(--color-primary-dark)] bg-[var(--color-primary-soft)]/40 hover:bg-[var(--color-primary-soft)] flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="typing-dot !bg-[var(--color-primary)]" />
            ) : (
              <>
                <PlusIcon width={18} height={18} />
                <span className="text-[10px] font-medium leading-none text-center px-1">{t.add}</span>
              </>
            )}
          </button>
        )}
      </div>

      {evidence.length === 0 && !uploading && (
        <p className="text-xs text-[var(--color-muted)] mt-2">{t.empty}</p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

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
