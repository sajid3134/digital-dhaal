import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookieStore } from "../../lib/auth.js";
import AuthForm from "../../components/AuthForm.jsx";

export const metadata = { title: "লগইন — Digital Dhaal" };

export default async function LoginPage() {
  const user = getUserFromCookieStore(await cookies());
  if (user) redirect("/chat");

  const googleEnabled = !!process.env.GOOGLE_CLIENT_ID;

  return (
    <main className="min-h-dvh flex">
      {/* Brand panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">ঢাল</div>
          <span className="text-lg font-semibold">Digital Dhaal</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold leading-snug mb-4">
            সাইবার বিপদে,<br />আপনার পাশে।
          </h1>
          <p className="text-white/80 leading-relaxed max-w-sm">
            অ্যাকাউন্ট হ্যাক, ছবি নিয়ে ব্ল্যাকমেইল, ভুয়া প্রোফাইল — যেকোনো
            সমস্যায় গোপনীয়ভাবে সাহায্য নিন। আমরা কখনো পাসওয়ার্ড বা OTP চাই না।
          </p>
        </div>
        <p className="text-white/50 text-sm">আপনার তথ্য সম্পূর্ণ গোপনীয় ও সুরক্ষিত</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">ঢাল</div>
          <span className="font-semibold">Digital Dhaal</span>
        </Link>
        <h2 className="text-xl font-bold mb-1">স্বাগতম</h2>
        <p className="text-sm text-[var(--color-muted)] mb-8">
          সাহায্য নিতে লগইন করুন — এতে ভুয়া রিপোর্ট কমে, আপনার কেস সুরক্ষিত থাকে
        </p>
        <Suspense>
          <AuthForm googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </main>
  );
}
