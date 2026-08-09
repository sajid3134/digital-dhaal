import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getLang, STRINGS } from "../../lib/i18n.js";
import AuthForm from "../../components/AuthForm.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";

export const metadata = { title: "Login — Digital Dhaal" };

export default async function LoginPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);

  // Keep existing authentication flow
  if (user) redirect("/chat");

  // Keep existing language handling
  const lang = getLang(cookieStore);
  const t = STRINGS[lang].auth;

  return (
    <main className="min-h-dvh bg-slate-50 flex">
      {/* ================= LEFT BRAND SECTION ================= */}
      <section className="hidden lg:flex relative w-[46%] overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-emerald-500 text-white">
        {/* Decorative background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold shadow-lg">
              ঢাল
            </div>

            <div>
              <p className="font-bold text-lg leading-tight">Digital Dhaal</p>
              <p className="text-xs text-white/60">
                Safer Digital Experience
              </p>
            </div>
          </Link>

          {/* Hero content */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              Secure • Simple • Accessible
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-5 !text-white">
              {t.sideTitle1}
              <br />
              <span className="text-white/90">{t.sideTitle2}</span>
            </h1>

            <p className="text-white/75 leading-7 max-w-md text-base">
              {t.sideText}
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <div className="text-xl mb-2">🛡️</div>
                <p className="text-xs text-white/75">Secure</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <div className="text-xl mb-2">💬</div>
                <p className="text-xs text-white/75">Support</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <div className="text-xl mb-2">🌐</div>
                <p className="text-xs text-white/75">বাংলা</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/45 text-xs">{t.sideFoot}</p>
        </div>
      </section>

      {/* ================= LOGIN SECTION ================= */}
      <section className="flex-1 relative flex flex-col min-h-dvh">
        {/* Top navigation */}
        <div className="flex items-center justify-between p-5 sm:p-7">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shadow-sm">
              ঢাল
            </div>

            <div>
              <span className="font-bold text-[15px] block leading-tight">
                Digital Dhaal
              </span>
              <span className="text-[10px] text-[var(--color-muted)]">
                Digital Safety Platform
              </span>
            </div>
          </Link>

          <div className="hidden lg:block" />

          <LanguageToggle lang={lang} />
        </div>

        {/* Form wrapper */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 pb-12">
          <div className="w-full max-w-md">
            {/* Login card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)] p-7 sm:p-9">
              {/* Heading */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                    ঢাল
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {t.welcome}
                </h2>

                <p className="text-sm text-[var(--color-muted)] leading-6 max-w-sm mx-auto">
                  {t.sub}
                </p>
              </div>

              {/* Existing Auth Form */}
              <Suspense
                fallback={
                  <div className="py-10 flex justify-center">
                    <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <AuthForm t={t} />
              </Suspense>
            </div>

            {/* Bottom note */}
            <p className="text-center text-xs text-slate-400 mt-6">
              Digital Dhaal • Your digital safety companion
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
