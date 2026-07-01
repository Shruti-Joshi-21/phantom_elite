"use client";

import { usePathname } from "next/navigation";

export default function MainHeader() {
  const pathname = usePathname();

  // Hide the header on the three dashboard views
  const isDashboard =
    pathname === "/citizen" ||
    pathname === "/planner" ||
    pathname === "/corp-head" ||
    pathname.startsWith("/citizen/") ||
    pathname.startsWith("/planner/") ||
    pathname.startsWith("/corp-head/");

  if (isDashboard) {
    return null;
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-base-border)",
        backgroundColor: "rgba(2, 6, 23, 0.9)",   /* slate-950 with 90% opacity */
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

        {/* Right side — navigation links */}
        <nav className="flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Contact Us
          </a>
          <a
            href="/planner"
            className="text-sm font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 px-4 py-1.5 rounded-full transition-colors"
          >
            View Demo
          </a>
        </nav>
      </div>
    </header>
  );
}
