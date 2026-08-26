import Link from "next/link";
import { DhaalMark } from "./Brand.jsx";
import { LockIcon, BadgeCheckIcon, EyeOffIcon } from "./Icons.jsx";

export default function SiteFooter({ t }) {
  const f = t.footer;
  const sec = t.security;
  return (
    <footer className="border-t border-black/5 bg-white mt-4">
      <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-3 gap-10 text-[15px]">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <DhaalMark size={30} />
            <span className="font-bold">Digital Dhaal</span>
          </div>
          <p className="text-[var(--color-muted)]">{f.tagline}</p>
          {sec && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="dd-chip dd-chip-secure">
                <LockIcon width={11} height={11} />
                {sec.chipEncrypted}
              </span>
              <span className="dd-chip dd-chip-secure">
                <EyeOffIcon width={11} height={11} />
                {sec.chipConfidential}
              </span>
              <span className="dd-chip dd-chip-secure">
                <BadgeCheckIcon width={11} height={11} />
                {sec.chipVerified}
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="font-semibold mb-3">{f.quick}</p>
          <ul className="space-y-2 text-[var(--color-muted)]">
            <li><Link href="#how" className="hover:text-[var(--color-primary)] transition-colors">{t.nav.how}</Link></li>
            <li><Link href="#resources" className="hover:text-[var(--color-primary)] transition-colors">{t.nav.resources}</Link></li>
            <li><Link href="#about" className="hover:text-[var(--color-primary)] transition-colors">{t.nav.about}</Link></li>
            <li><Link href="/support" className="hover:text-[var(--color-primary)] transition-colors">{t.nav.support}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">{f.emergency}</p>
          <ul className="space-y-2 text-[var(--color-muted)]">
            {f.emergencyLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5">
        <p className="max-w-6xl mx-auto px-5 py-5 text-sm text-[var(--color-muted)]">
          {f.disclaimer}
        </p>
      </div>
    </footer>
  );
}
