import Link from "next/link";
import { cookies } from "next/headers";
import { getUserFromCookieStore } from "../lib/auth.js";
import { getLang, STRINGS } from "../lib/i18n.js";
import Navbar from "../components/Navbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  const lang = getLang(cookieStore);
  const t = STRINGS[lang];

  return (
    <main className="min-h-dvh">
      <Navbar lang={lang} nav={t.nav} loggedIn={!!user} />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        {/* soft background blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-100/40 blur-3xl animate-blob-slow" />

        <div className="relative max-w-6xl mx-auto px-5 pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/20 text-[var(--color-primary-dark)] text-sm font-medium px-4 py-1.5 mb-7">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              {t.hero.badge}
            </div>
            <h1 className="text-[2.6rem] sm:text-6xl font-bold leading-[1.12] mb-6">
              {t.hero.title1}
              <br />
              <span className="text-[var(--color-primary)]">{t.hero.title2}</span>
            </h1>
            <p className="text-[var(--color-muted)] text-lg sm:text-xl leading-relaxed mb-9 max-w-xl">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <Link
                href={user ? "/chat" : "/login?next=/chat"}
                className="rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:shadow-xl hover:shadow-[var(--color-primary)]/35 hover:-translate-y-0.5"
              >
                {t.hero.cta}
              </Link>
              <a
                href="#how"
                className="rounded-2xl border border-black/10 bg-white hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary-dark)] px-8 py-4 text-lg font-medium transition-all"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
            <p className="text-sm text-[var(--color-muted)] mt-7">🔒 {t.hero.never}</p>
          </div>

          {/* Chat mockup — makes it feel real */}
          <div className="hidden lg:block">
            <div className="dd-card p-5 max-w-md ml-auto rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-3 pb-4 border-b border-black/5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                  ঢাল
                </div>
                <div>
                  <p className="font-semibold leading-tight">Digital Dhaal</p>
                  <p className="text-xs text-green-600 leading-tight flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> online
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[var(--color-bubble-user)] text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] max-w-[85%]">
                    {t.hero.mockUser}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[var(--color-bubble-agent)] rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] max-w-[85%]">
                    {t.hero.mockAgent}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[var(--color-bubble-agent)] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="relative border-y border-black/5 bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-5 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {t.hero.stats.map((s) => (
              <p key={s} className="text-[15px] font-medium text-[var(--color-muted)]">
                <span className="text-[var(--color-primary)] mr-1.5">✓</span>
                {s}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Pillars ---------- */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-2xl sm:text-[2rem] font-bold text-center mb-12">
          {t.pillars.heading}
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {t.pillars.items.map((p) => (
            <div key={p.title} className="dd-card hover-lift p-7">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center text-3xl mb-5">
                {p.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{p.title}</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="bg-white border-y border-black/5 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl sm:text-[2rem] font-bold text-center mb-14">
            {t.how.heading}
          </h2>
          <div className="grid sm:grid-cols-4 gap-8 relative">
            {/* connecting line (desktop) */}
            <div className="hidden sm:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/25 to-transparent" />
            {t.how.steps.map(([title, text], i) => (
              <div key={title} className="text-center relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-[var(--color-primary)]/20 relative z-10">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-1.5">{title}</h3>
                <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Resources: laws + what to do ---------- */}
      <section id="resources" className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-2xl sm:text-[2rem] font-bold text-center mb-3">
          {t.resources.heading}
        </h2>
        <p className="text-center text-[var(--color-muted)] text-lg mb-12">{t.resources.sub}</p>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {t.resources.cards.map((c) => (
            <div key={c.title} className="dd-card hover-lift p-6">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-lg mb-3">{c.title}</h3>
              <p className="text-[15px] leading-relaxed mb-3">
                <span className="font-semibold text-[var(--color-primary-dark)]">
                  {lang === "bn" ? "করণীয়: " : "Do: "}
                </span>
                {c.todo}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--color-heading)]">
                  {lang === "bn" ? "আইনে: " : "Law: "}
                </span>
                {c.law}
              </p>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-xl mb-5">{t.resources.contactHeading}</h3>
        <div className="dd-card overflow-hidden overflow-x-auto">
          <table className="w-full text-[15px] min-w-[560px]">
            <thead>
              <tr className="bg-[var(--color-primary-soft)] text-left">
                {t.resources.tableHead.map((h) => (
                  <th key={h} className="px-5 py-3.5 font-semibold text-[var(--color-primary-dark)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.resources.table.map(([org, use, contact]) => (
                <tr key={org} className="border-t border-black/5 hover:bg-black/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-medium">{org}</td>
                  <td className="px-5 py-3.5 text-[var(--color-muted)]">{use}</td>
                  <td className="px-5 py-3.5 font-semibold text-[var(--color-primary-dark)]">{contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--color-muted)] mt-4">{t.resources.lawNote}</p>
      </section>

      {/* ---------- Promise ---------- */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="dd-card p-9 sm:p-12 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] !border-0 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 !text-white">{t.promise.heading}</h2>
          <ul className="grid sm:grid-cols-2 gap-4 text-[15px] sm:text-base">
            {t.promise.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-sm">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className="bg-white border-y border-black/5 py-20">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-2xl sm:text-[2rem] font-bold mb-6">{t.about.heading}</h2>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed">{t.about.text}</p>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="max-w-6xl mx-auto px-5 py-20">
        <div className="dd-card hover-lift max-w-xl mx-auto p-9 text-center">
          <h2 className="text-2xl font-bold mb-3">{t.contact.heading}</h2>
          <p className="text-[var(--color-muted)] mb-5">{t.contact.text}</p>
          <a
            href="mailto:team@digitaldhaal.org"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/20 px-5 py-3 font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)]/10 transition-colors"
          >
            ✉️ team@digitaldhaal.org
          </a>
        </div>
      </section>

      <SiteFooter t={t} />
    </main>
  );
}
