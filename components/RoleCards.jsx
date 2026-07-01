"use client";

import Link from "next/link";

/* ── SVG Icons ─────────────────────────────────────────────────────── */
function CitizenIcon({ color }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

function PlannerIcon({ color }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M17.5 14v7M14 17.5h7" />
    </svg>
  );
}

function CorpIcon({ color }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 9h1m5 0h1M9 13h1m5 0h1" />
    </svg>
  );
}

const ROLES = [
  {
    id: "citizen",
    href: "/citizen",
    label: "Citizen",
    description: "See your local heat exposure and what you can do",
    accent: "#94A3B8",
    accentBg: "#1E293B",
    borderBase: "#334155",
    icon: CitizenIcon,
  },
  {
    id: "planner",
    href: "/planner",
    label: "City Planner",
    description: "Simulate cooling interventions and allocate budget across zones",
    accent: "#94A3B8",
    accentBg: "#1E293B",
    borderBase: "#334155",
    icon: PlannerIcon,
  },
  {
    id: "corp-head",
    href: "/corp-head",
    label: "Corporation Head",
    description: "Oversee city-wide cooling strategy and trade-offs",
    accent: "#94A3B8",
    accentBg: "#1E293B",
    borderBase: "#334155",
    icon: CorpIcon,
  },
];

export default function RoleCards() {
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "stretch", flexWrap: "wrap" }}>
      {ROLES.map((role) => {
        const Icon = role.icon;
        return (
          <Link
            key={role.id}
            href={role.href}
            id={`role-card-${role.id}`}
            style={{ textDecoration: "none", display: "block", flex: 1, minWidth: "260px" }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                borderRadius: "1.25rem",
                border: "none",
                backgroundColor: "rgba(2, 6, 23, 1.0)",
                padding: "2rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
                cursor: "pointer",
                transition: "box-shadow 250ms ease, transform 250ms ease, background-color 250ms ease",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 24px 2px rgba(148, 163, 184, 0.15), 0 1px 5px rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.backgroundColor = "rgba(15, 23, 42, 1.0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.backgroundColor = "rgba(2, 6, 23, 1.0)";
              }}
            >
              {/* Icon bubble */}
              <div style={{
                width: "56px", height: "56px", borderRadius: "0.875rem",
                backgroundColor: role.accentBg,
                border: `1px solid ${role.borderBase}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon color={role.accent} />
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center" }}>
                <h2 style={{
                  margin: 0, fontSize: "1.125rem", fontWeight: 700,
                  color: "#F1F5F9", letterSpacing: "-0.02em",
                }}>
                  {role.label}
                </h2>
                <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.65, color: "#64748B" }}>
                  {role.description}
                </p>
              </div>

              {/* Arrow cue */}
              <div style={{
                marginTop: "auto", display: "flex", alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem", fontSize: "0.8125rem", fontWeight: 600, color: "#0D9488",
              }}>
                Enter view
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
