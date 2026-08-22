import { Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import RegisterSW from "../components/RegisterSW.jsx";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

// Monospace carries the calm "security firm" register — case IDs, session
// labels, and encrypted/verified accents. Loaded self-hosted via next/font.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Digital Dhaal — ডিজিটাল ঢাল",
  description: "Bangla-first cyber incident response intake",
};

export default function RootLayout({ children }) {
  // suppressHydrationWarning: browser extensions (e.g. focus-visible polyfills)
  // mutate <html>/<body> attributes before React hydrates. That's harmless but
  // otherwise trips a hydration-mismatch warning on the top-level elements.
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${hindSiliguri.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
