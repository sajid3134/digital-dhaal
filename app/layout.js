import { Hind_Siliguri } from "next/font/google";
import RegisterSW from "../components/RegisterSW.jsx";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  title: "Digital Dhaal — ডিজিটাল ঢাল",
  description: "Bangla-first cyber incident response intake",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} antialiased`}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
