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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* ── Top-level Nav ── */}
        <header
          style={{
            borderBottom: "1px solid var(--color-base-border)",
            backgroundColor: "rgba(15, 23, 42, 0.9)",   /* slate-900 with 90% opacity */
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 3rem",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "-0.03em",
                color: "var(--color-action-teal)",
              }}
            >
              UrbanCool
            </span>

            {/* Right side — role switcher comes in Phase 1 */}
            <div />
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
