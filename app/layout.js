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
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} ${jetBrainsMono.variable} antialiased`}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
