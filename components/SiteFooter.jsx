import Link from "next/link";

export default function SiteFooter({ t }) {
  const f = t.footer;
  return (
    <footer className="border-t border-black/5 bg-white mt-4">
      <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-3 gap-10 text-[15px]">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
              ঢাল
            </div>
            <span className="font-bold">Digital Dhaal</span>
          </div>
          <p className="text-[var(--color-muted)]">{f.tagline}</p>
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
