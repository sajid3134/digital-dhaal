import Link from "next/link";
import { cookies } from "next/headers";

import { getLang, STRINGS } from "../../lib/i18n.js";
import SupportSection from "../../components/SupportSection.jsx";

export const metadata = {
  title: "Support — Digital Dhaal",
};

export default async function SupportPage() {
  const lang = getLang(await cookies());
  const t = STRINGS[lang];

  return (
    <main className="min-h-dvh px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          ← Digital Dhaal
        </Link>

        <SupportSection
          t={t}
          bkashNumber={process.env.BKASH_NUMBER || null}
        />
      </div>
    </main>
  );
}
