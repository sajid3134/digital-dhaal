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
  if (user) redirect("/chat");

  const lang = getLang(cookieStore);
  const t = STRINGS[lang].auth;

  return (
    <main className="min-h-dvh flex">
      {/* Brand panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">ঢাল</div>
          <span className="text-lg font-semibold">Digital Dhaal</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold leading-snug mb-4 !text-white">
            {t.sideTitle1}
            <br />
            {t.sideTitle2}
          </h1>
          <p className="text-white/80 leading-relaxed max-w-sm">{t.sideText}</p>
        </div>
        <p className="text-white/50 text-sm">{t.sideFoot}</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-5 right-5">
          <LanguageToggle lang={lang} />
        </div>
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">ঢাল</div>
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
