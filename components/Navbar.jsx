"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle.jsx";
import { MenuIcon, XIcon } from "./Icons.jsx";

export default function Navbar({ lang, nav, loggedIn }) {
  const [open, setOpen] = useState(false);

  const links = [
    ["#how", nav.how],
    ["#resources", nav.resources],
    ["#about", nav.about],
    ["#contact", nav.contact],
    ["/support", nav.support],
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            ঢাল
          </div>
          <span className="font-bold text-lg tracking-tight">Digital Dhaal</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-[15px] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-black/[0.04] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageToggle lang={lang} />
          <Link
            href={loggedIn ? "/chat" : "/login"}
            className="hidden sm:block rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 text-sm font-semibold transition-all hover:shadow-md"
          >
            {loggedIn ? nav.backToChat : nav.login}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 rounded-lg border border-black/10 flex items-center justify-center"
            aria-label="Menu"
          >
            {open ? <XIcon width={17} height={17} /> : <MenuIcon width={17} height={17} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-black/5 bg-white px-5 py-3 space-y-1 animate-fade-up">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[15px] hover:bg-black/[0.04]"
            >
              {label}
            </Link>
          ))}
          <Link
            href={loggedIn ? "/chat" : "/login"}
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[var(--color-primary)]"
          >
            {loggedIn ? nav.backToChat : nav.login}
          </Link>
        </nav>
      )}
    </header>
  );
}
