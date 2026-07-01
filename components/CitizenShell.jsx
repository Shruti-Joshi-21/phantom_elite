"use client";

import MapPanel from "@/components/MapPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import { TreePine, Building2, Droplets, MapPin, Clock, Activity } from "lucide-react";

const ICON_MAP = {
  "🌳": <TreePine size={18} style={{ color: "#22C55E" }} />,
  "🏗️": <Building2 size={18} style={{ color: "#94A3B8" }} />,
  "💧": <Droplets size={18} style={{ color: "#3B82F6" }} />,
  "🌿": <MapPin size={18} style={{ color: "#22C55E" }} />,
  "🕗": <Clock size={18} style={{ color: "#FACC15" }} />,
};

/**
 * CitizenShell — Dark-themed Citizen Dashboard.
 * Accepts all mock data via the `data` prop; swap data source in app/citizen/page.js.
 */
export default function CitizenShell({ data }) {
  const { location, heat, zones, diagnosis, recommendations } = data;

  /* ── heat token colour map — dark-tuned ─────────────────────────── */
  const HEAT_COLORS = {
    cool:     { bg: "#1E3A5F", text: "#93C5FD", dot: "#3B82F6", glow: "#3B82F630" },
    mild:     { bg: "#0C2D40", text: "#7DD3FC", dot: "#38BDF8", glow: "#38BDF830" },
    moderate: { bg: "#3A2E00", text: "#FDE047", dot: "#FACC15", glow: "#FACC1530" },
    high:     { bg: "#3D1A00", text: "#FCA572", dot: "#FB923C", glow: "#FB923C30" },
    severe:   { bg: "#3B0A0A", text: "#FCA5A5", dot: "#DC2626", glow: "#DC262630" },
  };

  const hc = HEAT_COLORS[heat.severity] ?? HEAT_COLORS.moderate;

  /* User location for the map marker */
  const userLocation = { lat: location.lat, lng: location.lng };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#020617", paddingBottom: "3rem" }}>

      {/* ── PERSISTENT ROLE-AWARE NAVIGATION ─────────────────────────── */}
      <RoleSwitcher currentRole="citizen" locationLabel={location.label} />

      {/* ── PAGE BODY ──────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        padding: "2rem 3rem",
        display: "flex", flexDirection: "column", gap: "1.5rem",
      }}>

        {/* ── 1. HERO HEAT CARD ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: "1.25rem",
          border: "none",
          backgroundColor: "rgba(2, 6, 23, 1.0)",
          padding: "2rem",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}>
          {/* Top row: temp circle + right-side info */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.75rem", flexWrap: "wrap" }}>
            {/* Temperature ring */}
            <div style={{
              position: "relative",
              width: "108px", height: "108px",
              borderRadius: "50%",
              background: hc.bg,
              border: `3px solid ${hc.dot}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 0 8px ${hc.glow}`,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: hc.text, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {heat.tempC}°
              </span>
            </div>

            {/* Right side text */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.375rem" }}>
              {/* Severity badge + feels like */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  backgroundColor: hc.bg, color: hc.text,
                  borderRadius: "9999px", padding: "0.3rem 0.875rem",
                  fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  border: `1px solid ${hc.dot}50`,
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: hc.dot, display: "inline-block" }} />
                  {heat.severity} heat
                </span>
                <span style={{ fontSize: "0.9rem", color: "#64748B" }}>
                  Feels like <strong style={{ color: hc.text }}>{heat.feelsLikeC}°C</strong>
                </span>
                <span style={{ fontSize: "0.75rem", color: "#475569" }}>{heat.updatedAt}</span>
              </div>

              {/* Status message */}
              <p style={{
                margin: 0,
                fontSize: "1.0625rem", fontWeight: 600,
                color: "#F1F5F9", lineHeight: 1.5,
                borderLeft: `3px solid ${hc.dot}`,
                paddingLeft: "0.875rem",
              }}>
                {heat.statusLine}
              </p>

              {/* Source */}
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22C55E", display: "inline-block", boxShadow: "0 0 0 3px #22C55E30" }} />
                {heat.source}
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. WHY IS IT HOT HERE? ────────────────────────────────────── */}
        <div style={{
          borderRadius: "1.25rem",
          border: "none",
          backgroundColor: "rgba(2, 6, 23, 1.0)",
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)",
        }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.01em" }}>
            Why is it hot here?
          </h2>

          {/* Two-column: diagnosis list left, map right */}
          <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap", alignItems: "flex-start" }}>

            {/* Diagnosis list */}
            <div style={{ flex: "0 0 auto", width: "220px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {diagnosis.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{
                    width: "24px", height: "24px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {ICON_MAP[d.icon] || <Activity size={18} style={{ color: "#94A3B8" }} />}
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "#94A3B8", lineHeight: 1.6, paddingTop: "0.15rem" }}>
                    {d.reason}
                  </span>
                </div>
              ))}
            </div>

            {/* Leaflet map */}
            <div style={{ flex: "1 1 300px", minWidth: "260px" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.6875rem", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Nearby zones · heat map
              </p>
              <MapPanel
                centerLat={location.lat}
                centerLng={location.lng}
                zoom={13}
                zones={zones}
                userLocation={userLocation}
                height="260px"
              />
              {/* Heat legend */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <span style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 700 }}>COOL</span>
                <div style={{ height: "3px", flex: 1, borderRadius: "9999px", background: "linear-gradient(to right, #3B82F6, #38BDF8, #FACC15, #FB923C, #DC2626)" }} />
                <span style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 700 }}>SEVERE</span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "0.6875rem", color: "#64748B", textAlign: "left", lineHeight: 1.4 }}>
                Live data · refreshed every 16 days (satellite Landsat revisit cycle)
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. WHAT YOU CAN DO ────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.01em" }}>
            What you can do
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.875rem" }}>
            {recommendations.map((rec) => (
              <div key={rec.id} style={{
                borderRadius: "1rem",
                border: "none",
                backgroundColor: "rgba(2, 6, 23, 1.0)",
                padding: "1.125rem 1.25rem",
                display: "flex", alignItems: "flex-start", gap: "1rem",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)",
              }}>
                {/* Icon bubble */}
                <div style={{
                  width: "24px", height: "24px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {ICON_MAP[rec.icon] || <Activity size={18} style={{ color: "#22C55E" }} />}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#2DD4BF" }}>
                    {rec.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "#64748B", lineHeight: 1.6 }}>
                    {rec.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
