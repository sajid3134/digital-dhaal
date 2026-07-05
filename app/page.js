import Link from "next/link";
import { cookies } from "next/headers";
import { getUserFromCookieStore } from "../lib/auth.js";

const PILLARS = [
  {
    icon: "🔓",
    title: "অ্যাকাউন্ট হ্যাক",
    text: "ফেসবুক, জিমেইল, ইনস্টাগ্রাম বা স্ন্যাপচ্যাট হ্যাক হলে দ্রুত উদ্ধারে সাহায্য।",
  },
  {
    icon: "🛡️",
    title: "ছবি নিয়ে ব্ল্যাকমেইল",
    text: "ব্যক্তিগত ছবি বা ডিপফেক ছড়ানোর হুমকি? ছবি আপনার ফোন থেকে বাইরে না পাঠিয়েই ব্যবস্থা।",
  },
  {
    icon: "👥",
    title: "ভুয়া প্রোফাইল",
    text: "আপনার নামে ভুয়া অ্যাকাউন্ট খুলে প্রতারণা করছে কেউ? রিপোর্ট ও অপসারণে সাহায্য।",
  },
];

const STEPS = [
  ["১", "চ্যাটে বলুন", "যা ঘটেছে নিজের ভাষায় বলুন — বাংলা, বাংলিশ বা ইংরেজি।"],
  ["২", "কেস তৈরি হয়", "আপনার তথ্য থেকে স্বয়ংক্রিয়ভাবে গোপনীয় কেস ফাইল তৈরি হয়।"],
  ["৩", "পরিচয় যাচাই", "ছোট্ট একটি ভিডিও কলে পরিচয় নিশ্চিত করা হয় — ভুয়া রিপোর্ট ঠেকাতে।"],
  ["৪", "ইঞ্জিনিয়ার সমাধান করেন", "একজন মানব বিশেষজ্ঞ আপনার সাথে থেকে সমস্যার সমাধান করেন।"],
];

export default async function LandingPage() {
  const user = getUserFromCookieStore(await cookies());

  return (
    <main className="min-h-dvh">
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
              ঢাল
            </div>
            <span className="font-bold text-lg">Digital Dhaal</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/support"
              className="hidden sm:block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              সাপোর্ট করুন
            </Link>
            <Link
              href={user ? "/chat" : "/login"}
              className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 text-sm font-semibold transition-colors"
            >
              {user ? "চ্যাটে ফিরুন" : "লগইন"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-semibold px-3.5 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          সম্পূর্ণ গোপনীয় · এখন ফ্রি
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
          সাইবার বিপদে,
          <br />
          <span className="text-[var(--color-primary)]">আপনার পাশে।</span>
        </h1>
        <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          অ্যাকাউন্ট হ্যাক, ছবি নিয়ে ব্ল্যাকমেইল বা ভুয়া প্রোফাইল — লজ্জা বা ভয়
          না পেয়ে বলুন। বাংলায়, গোপনে, মানুষের সাহায্যে সমাধান।
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={user ? "/chat" : "/login?next=/chat"}
            className="rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3.5 text-base font-semibold shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:shadow-xl hover:shadow-[var(--color-primary)]/30"
          >
            সাহায্য নিন — এখনই
          </Link>
          <a
            href="#how"
            className="rounded-2xl border border-black/10 bg-white hover:bg-black/[0.02] px-8 py-3.5 text-base font-medium transition-colors"
          >
            কীভাবে কাজ করে?
          </a>
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-6">
          আমরা <strong>কখনোই</strong> পাসওয়ার্ড, OTP বা ছবি চাই না।
        </p>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="dd-card p-6">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-lg mb-1.5">{p.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white border-y border-black/5 py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            কীভাবে কাজ করে
          </h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {STEPS.map(([num, title, text]) => (
              <div key={num} className="text-center">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-lg mb-3">
                  {num}
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety strip */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="dd-card p-8 sm:p-10 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] !border-0 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">আমাদের প্রতিশ্রুতি</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm sm:text-[15px]">
            <li className="flex gap-2.5"><span>✓</span> পাসওয়ার্ড, OTP বা PIN কখনো চাওয়া হবে না</li>
            <li className="flex gap-2.5"><span>✓</span> কোনো ছবি বা ভিডিও পাঠাতে বলা হবে না</li>
            <li className="flex gap-2.5"><span>✓</span> আপনার তথ্য শুধু নিযুক্ত ইঞ্জিনিয়ার দেখেন</li>
            <li className="flex gap-2.5"><span>✓</span> কাজ শুরুর আগে কোনো টাকা নয় — এখন সবকিছু ফ্রি</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-[var(--color-muted)]">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="font-semibold text-[var(--color-text)] mb-1">Digital Dhaal — ডিজিটাল ঢাল</p>
              <p>বাংলা-ফার্স্ট সাইবার ইনসিডেন্ট রেসপন্স</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)] mb-1">জরুরি হেল্পলাইন</p>
              <p>জাতীয় জরুরি সেবা: ৯৯৯ · চাইল্ড হেল্পলাইন: ১০৯৮</p>
              <p>মানসিক সহায়তা: কান পেতে রই</p>
            </div>
          </div>
          <p className="mt-6 text-xs">
            জীবন-হুমকির পরিস্থিতিতে আগে ৯৯৯-এ কল করুন। Digital Dhaal জরুরি সেবার বিকল্প নয়।
          </p>
        </div>
      </footer>
    </main>
  );
}
