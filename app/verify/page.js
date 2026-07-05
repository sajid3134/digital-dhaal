import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getLang, STRINGS } from "../../lib/i18n.js";
import VerifyPhone from "../../components/VerifyPhone.jsx";

export const metadata = { title: "Verify — Digital Dhaal" };

export default async function VerifyPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  if (!user) redirect("/login");
  if (user.phoneVerified) redirect("/chat");

  const lang = getLang(cookieStore);
  const t = STRINGS[lang].verify;

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
          ঢাল
        </div>
        <span className="font-bold text-lg">Digital Dhaal</span>
      </Link>
      <VerifyPhone userName={user.name.split(" ")[0]} t={t} />
    </main>
  );
}
