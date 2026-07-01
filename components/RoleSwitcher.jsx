"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * RoleSwitcher — Shared navigation header component for dashboard views.
 * Acts as the main sticky header on dashboard screens.
 */
export default function RoleSwitcher({ currentRole, locationLabel }) {
  const router = useRouter();

  const roles = [
    { id: "citizen", label: "Citizen View", path: "/citizen", activeColor: "#2DD4BF", activeBg: "#0D2E2B", dotColor: "#0D9488" },
    { id: "planner", label: "Planner View", path: "/planner", activeColor: "#818CF8", activeBg: "#1E1B4B", dotColor: "#6366F1" },
    { id: "corp-head", label: "Corp View", path: "/corp-head", activeColor: "#FCD34D", activeBg: "#1E293B", dotColor: "#F59E0B" },
  ];

  const activeRoleConfig = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div
      style={{
        borderBottom: "1px solid #1E293B",
        backgroundColor: "rgba(2, 6, 23, 0.9)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        height: "56px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4 flex-wrap"
        style={{ width: "100%" }}
      >
        
        {/* Left: Back Link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            color: "#64748B",
            textDecoration: "none",
            fontWeight: 600,
            transition: "color 150ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = activeRoleConfig.activeColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          All views
        </Link>

        {/* Center: Static Role Badge in Primary Color */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: activeRoleConfig.dotColor, display: "inline-block", boxShadow: `0 0 0 3px ${activeRoleConfig.dotColor}30` }} />
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: activeRoleConfig.activeColor, letterSpacing: "0.02em" }}>
            {activeRoleConfig.label}
          </span>
        </div>

        {/* Right: Location & Satellite Cycle Metadata Info */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          {locationLabel && (
            <span style={{ color: "#475569" }}>
              📍 {locationLabel}
            </span>
          )}
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            Satellite revisit cycle: 16 days
          </span>
        </div>

      </div>
    </div>
  );
}
