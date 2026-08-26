import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getLang, STRINGS } from "../../lib/i18n.js";
import AuthForm from "../../components/AuthForm.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";
import { DhaalMark } from "../../components/Brand.jsx";
import { LockIcon } from "../../components/Icons.jsx";

export const metadata = { title: "Login — Digital Dhaal" };

export default async function LoginPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  if (user) redirect("/chat");

  const lang = getLang(cookieStore);
  const t = STRINGS[lang].auth;
  const sec = STRINGS[lang].security;

  return (
    <main className="min-h-dvh flex">
      {/* Brand panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[var(--color-ink)] to-[var(--color-primary-dark)] dd-cyber-grid text-white p-12">
        <Link href="/" className="flex items-center gap-3">
          <DhaalMark size={40} />
          <span className="text-lg font-semibold">Digital Dhaal</span>
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-cyber)] secure-dot" />
            <span className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--color-cyber)]">
              {sec.kicker}
            </span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.08] mb-5 !text-white tracking-tight">
            {t.sideTitle1}
            <br />
            <span className="text-[var(--color-cyber)]">{t.sideTitle2}</span>
          </h1>
          <p className="font-mono text-sm text-[var(--color-cyber)]/80 mb-4 tracking-tight">
            &gt; secure_incident_response --bangla-first
          </p>
          <p className="text-white/75 text-lg leading-relaxed max-w-md">{t.sideText}</p>
          <div className="flex flex-wrap gap-2 mt-7">
            <span className="dd-chip dd-chip-dark">{sec.chipEncrypted}</span>
            <span className="dd-chip dd-chip-dark">{sec.chipConfidential}</span>
            <span className="dd-chip dd-chip-dark">{sec.chipVerified}</span>
          </div>
        </div>
        <p className="text-white/50 text-sm flex items-center gap-2">
          <LockIcon width={14} height={14} className="text-[var(--color-cyber)]" />
          {t.sideFoot}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-5 right-5">
          <LanguageToggle lang={lang} />
        </div>
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <DhaalMark size={36} />
          <span className="font-semibold">Digital Dhaal</span>
        </Link>
        <h2 className="text-xl font-bold mb-1">{t.welcome}</h2>
        <p className="text-sm text-[var(--color-muted)] mb-8 text-center max-w-sm">{t.sub}</p>
        <Suspense>
          <AuthForm t={t} />
        </Suspense>
      </div>
    </main>
  );
}
