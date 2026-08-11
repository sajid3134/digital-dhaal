import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getLang, STRINGS } from "../../lib/i18n.js";
import KycVerify from "../../components/KycVerify.jsx";
import { DhaalMark } from "../../components/Brand.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";

export const metadata = { title: "Identity verification — Digital Dhaal" };
export const dynamic = "force-dynamic";

export default async function KycPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  if (!user) redirect("/login?next=/kyc");

  const lang = getLang(cookieStore);
  const t = STRINGS[lang].kyc;

  return (
    <main className="min-h-dvh bg-[var(--color-bg)]">
      <header className="bg-white border-b border-black/5">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <Link href="/chat" className="flex items-center gap-2.5">
            <DhaalMark size={32} />
            <span className="font-bold">Digital Dhaal</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="dd-chip dd-chip-secure">{t.prototypeBadge}</span>
            <LanguageToggle lang={lang} />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-[var(--color-muted)] mt-1">{t.sub}</p>
        </div>
        <KycVerify t={t} initialStatus={user.kycStatus} />
      </div>
    </main>
  );
}
