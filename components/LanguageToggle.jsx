"use client";

import { useRouter } from "next/navigation";

export default function LanguageToggle({ lang }) {
  const router = useRouter();

  function setLang(next) {
    document.cookie = `dd_lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  const btn = (code, label) => (
    <button
      onClick={() => setLang(code)}
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
        lang === code
          ? "bg-[var(--color-primary)] text-white"
          : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
      }`}
      aria-pressed={lang === code}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-black/10 bg-white p-0.5">
      {btn("bn", "বাংলা")}
      {btn("en", "EN")}
    </div>
  );
}
