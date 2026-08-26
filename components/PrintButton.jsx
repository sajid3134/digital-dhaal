"use client";

import { DownloadIcon } from "./Icons.jsx";

// Opens the browser's print dialog — the user picks "Save as PDF". This uses
// the browser's own rendering, which shapes Bangla correctly (JS PDF libraries
// do not), and needs zero extra dependencies.
export default function PrintButton({ label = "Download / Print PDF", className = "" }) {
  return (
    <button
      onClick={() => window.print()}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 text-sm font-semibold transition-colors"
      }
    >
      <DownloadIcon width={16} height={16} />
      {label}
    </button>
  );
}
