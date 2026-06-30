"use client";

import MapPanel from "@/components/MapPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CorpHeadShell({ data }) {
  const { stats, zones, portfolio, equityPrioritization, tradeoffs } = data;

  const formatCurrency = (val) => {
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#020617", paddingBottom: "4rem" }}>
      {/* ── PERSISTENT ROLE-AWARE NAVIGATION ─────────────────────────── */}
      <RoleSwitcher currentRole="corp-head" locationLabel="Pune Overview" />

      {/* ── MAIN EXEC DASHBOARD ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-6">
        
        {/* ── 1. HERO SUMMARY STATS (4 cards in a row) ──────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex flex-col gap-1.5" style={{ borderLeft: "3.5px solid #818CF8" }}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Allocated</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-100">{formatCurrency(stats.budgetAllocated)}</span>
            <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-950/40 px-2 py-0.5 rounded self-start mt-0.5 border border-indigo-900/50">Cap Approved</span>
          </Card>
          
          <Card className="flex flex-col gap-1.5" style={{ borderLeft: "3.5px solid #2DD4BF" }}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City-wide Reduction</span>
            <span className="text-xl md:text-2xl font-extrabold text-teal-400">{stats.avgTempReduction.toFixed(1)}°C</span>
            <span className="text-[10px] text-teal-300 font-semibold bg-teal-950/40 px-2 py-0.5 rounded self-start mt-0.5 border border-teal-900/50">Model Yield</span>
          </Card>

          <Card className="flex flex-col gap-1.5" style={{ borderLeft: "3.5px solid #94A3B8" }}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Coverage Wards</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-100">{stats.zonesCovered}</span>
            <span className="text-[10px] text-slate-300 font-semibold bg-slate-900 px-2 py-0.5 rounded self-start mt-0.5 border border-slate-700/50">Priority Focus</span>
          </Card>

          <Card className="flex flex-col gap-1.5" style={{ borderLeft: "3.5px solid #FCD34D" }}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Equity Index</span>
            <span className="text-xl md:text-2xl font-extrabold text-amber-400">{stats.equityScore}</span>
            <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded self-start mt-0.5 border border-amber-900/50">Vulnerability Weight</span>
          </Card>
        </div>

        {/* ── 2. FULL-WIDTH MAP PANEL ───────────────────────────────── */}
        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100"> Pune City-wide Spatial Heat & Budget Map </h3>
              <p className="text-xs text-slate-400 mt-1">Satellite LST overlay displaying budgeted areas · Landsat revisit cycle: 16 days</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", border: "1.5px solid #0D9488", backgroundColor: "rgba(13, 148, 136, 0.2)" }} />
                <span className="text-xs text-slate-300 font-medium">Funded Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", border: "1.5px solid #E2E8F030", backgroundColor: "rgba(30, 41, 59, 0.4)" }} />
                <span className="text-xs text-slate-300 font-medium">Unfunded Zone</span>
              </div>
            </div>
          </div>

          <MapPanel
            centerLat={18.5204}
            centerLng={73.7937}
            zoom={12.2}
            zones={zones}
            userLocation={null} // Exec view doesn't focus on individual's location
            height="380px"
          />
        </Card>

        {/* ── 3. PORTFOLIO & EQUITY PRIORITIZATION (Two cards row) ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Portfolio distribution card */}
          <Card className="flex flex-col gap-4" style={{ padding: "1.5rem" }}>
            <div>
              <h3 className="text-base font-bold text-slate-100">Budget Allocation Portfolio</h3>
              <p className="text-xs text-slate-400 mt-1">Multi-zone portfolio — diminishing returns modeled per zone to avoid over-concentration</p>
            </div>

            {/* Stacked allocation bar */}
            <div className="space-y-4">
              <div className="flex h-6 w-full rounded-md overflow-hidden bg-slate-900 border border-slate-800">
                <div style={{ width: "45%", backgroundColor: "#0D9488" }} title="Cool Roofs (45%)" />
                <div style={{ width: "30%", backgroundColor: "#0F766E" }} title="Urban Greening (30%)" />
                <div style={{ width: "25%", backgroundColor: "#115E59" }} title="Reflective Pavement (25%)" />
              </div>

              {/* Legend with numbers */}
              <div className="divide-y divide-slate-800">
                {portfolio.map((p, idx) => (
                  <div key={idx} className="flex justify-between py-2.5 text-sm items-center">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: idx === 0 ? "#0D9488" : idx === 1 ? "#0F766E" : "#115E59",
                        }}
                      />
                      <span className="text-slate-300 font-medium">{p.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-100 font-bold">{formatCurrency(p.amount)}</span>
                      <span className="text-xs text-teal-400 font-semibold ml-2">({p.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Equity weighted Prioritization card */}
          <Card className="flex flex-col gap-4" style={{ padding: "1.5rem" }}>
            <div>
              <h3 className="text-base font-bold text-slate-100">Equity-Weighted Prioritization</h3>
              <p className="text-xs text-slate-400 mt-1">Ranked zones by vulnerability index (Elderly %, Outdoor Workers, Canopy Lack)</p>
            </div>

            <div className="space-y-3">
              {equityPrioritization.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 bg-slate-950 w-6 h-6 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{ep.zoneName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ep.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-400">Score: {ep.vulnerabilityScore}</span>
                    <Badge variant={ep.funded ? "action" : "tradeoff"} style={{ fontSize: "0.6875rem", padding: "0.15rem 0.5rem" }}>
                      {ep.funded ? "Funded" : "Unfunded"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── 4. TRADE-OFFS AT A GLANCE ─────────────────────────────── */}
        <Card className="flex flex-col gap-4" style={{ padding: "1.5rem" }}>
          <div>
            <h3 className="text-base font-bold text-slate-100">Strategic Trade-offs & Side-Effects</h3>
            <p className="text-xs text-slate-400 mt-1">Aggregate macro secondary effects across the current funded cooling portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tradeoffs.map((t, idx) => {
              const isWarning = t.startsWith("⚠");
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg flex flex-col justify-between border"
                  style={{
                    backgroundColor: isWarning ? "#2D1F00" : "#0D2E2B",
                    borderColor: isWarning ? "#FCD34D30" : "#2DD4BF30",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: isWarning ? "#FCD34D" : "#2DD4BF",
                      lineHeight: 1.5,
                    }}
                  >
                    {t}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}
