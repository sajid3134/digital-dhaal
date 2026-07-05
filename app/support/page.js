import Link from "next/link";
import SupportSection from "../../components/SupportSection.jsx";

export const metadata = { title: "সাপোর্ট করুন — Digital Dhaal" };

export default function SupportPage() {
  return (
    <main className="min-h-dvh py-10 px-5">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6"
        >
          ← হোমে ফিরুন
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">আমাদের সাপোর্ট করুন</h1>
        <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
          Digital Dhaal একটি স্বেচ্ছাসেবী উদ্যোগ — সাইবার বিপদে পড়া মানুষদের
          বিনামূল্যে সাহায্য করাই আমাদের লক্ষ্য। আপনার এক কাপ কফি বা একটা আন্তরিক
          রিভিউ আমাদের অনেকদূর নিয়ে যায়।
        </p>
        <SupportSection />
      </div>
    </main>
  );
}
