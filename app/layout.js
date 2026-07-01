import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "UrbanCool — Urban Heat Island Management",
  description:
    "AI-powered urban heat island management platform for city planners and field engineers.",
};

import MainHeader from "@/components/MainHeader";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* ── Conditional Top-level Nav ── */}
        <MainHeader />

        {/* ── Page Content ── */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
