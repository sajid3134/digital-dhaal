import Link from "next/link";
import { cookies } from "next/headers";
import { getLang, STRINGS } from "../../lib/i18n.js";
import SupportSection from "../../components/SupportSection.jsx";

export const metadata = { title: "Support — Digital Dhaal" };

export default async function SupportPage() {
  const lang = getLang(await cookies());
  const t = STRINGS[lang];

  return (
    <main className="min-h-dvh py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6 transition-colors"
        >
          ← Digital Dhaal
        </Link>
        <SupportSection t={t} />
      </div>
    </main>
  );
}
