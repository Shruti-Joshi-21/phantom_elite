"use client";

import { useState, useMemo } from "react";
import MapPanel from "@/components/MapPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";

/**
 * PlannerShell — Dark-themed City Planner Dashboard.
 * Includes interactive budget-aware intervention ranking, map selectors,
 * and SHAP driver diagnostic cards.
 */
export default function PlannerShell({ data }) {
  const { ward, zones, interventions } = data;

  // State
  const [selectedZoneId, setSelectedZoneId] = useState("z3"); // Default Kothrud
  const [budget, setBudget] = useState(2000000); // Default ₹20 Lakhs

  // Compute active diagnosed zone
  const activeZone = useMemo(() => {
    return zones.find((z) => z.id === selectedZoneId) || zones[0];
  }, [selectedZoneId, zones]);

  // Greedy intervention optimizer:
  // Sorts by efficiency (absolute temperature drop per Rupee spend),
  // then allocates budget greedily.
  const optimizationResults = useMemo(() => {
    const sorted = [...interventions].sort((a, b) => {
      const effA = Math.abs(a.tempReduction) / a.cost;
      const effB = Math.abs(b.tempReduction) / b.cost;
      return effB - effA; // Highest efficiency first
    });

    let remainingBudget = budget;
    const selected = [];
    const unselected = [];

    sorted.forEach((item) => {
      if (item.cost <= remainingBudget) {
        selected.push(item);
        remainingBudget -= item.cost;
      } else {
        unselected.push(item);
      }
    });

    const totalCostSpent = selected.reduce((sum, item) => sum + item.cost, 0);
    const totalTempReduction = selected.reduce((sum, item) => sum + item.tempReduction, 0);

    return {
      selected,
      unselected,
      totalCostSpent,
      totalTempReduction: Math.abs(totalTempReduction), // absolute degrees mitigated
    };
  }, [budget, interventions]);

  const { selected, unselected, totalCostSpent, totalTempReduction } = optimizationResults;

  // Format currency helpers
  const formatCurrency = (val) => {
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#020617", paddingBottom: "4rem" }}>
      {/* ── PERSISTENT ROLE-AWARE NAVIGATION ─────────────────────────── */}
      <RoleSwitcher currentRole="planner" locationLabel={ward.name} />

      {/* ── MAIN DASHBOARD CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ── LEFT COLUMN (65% width equivalent) ────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map panel card */}
            <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F1F5F9" }}>
                    Geospatial LST Satellite Overlay
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>
                    Click any zone to inspect drivers · Landsat revisit cycle: 16 days
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 700 }}>COOL</span>
                  <div style={{ width: "80px", height: "3px", borderRadius: "9999px", background: "linear-gradient(to right, #3B82F6, #38BDF8, #FACC15, #FB923C, #DC2626)" }} />
                  <span style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 700 }}>SEVERE</span>
                </div>
              </div>

              <MapPanel
                centerLat={18.5204}
                centerLng={73.7937}
                zoom={12.4}
                zones={zones}
                userLocation={{ lat: 18.5074, lng: 73.8077 }} // user location at Kothrud
                height="340px"
                selectedZoneId={selectedZoneId}
                onZoneClick={setSelectedZoneId}
              />
            </Card>

            {/* Click-to-diagnose SHAP attributions */}
            <Card style={{ borderLeft: "3.5px solid #F59E0B", padding: "1.25rem" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-amber-500 font-bold">Diagnosed Zone</span>
                    <Badge variant="heat" heatLevel={activeZone.heatLevel}>
                      {activeZone.heatLevel}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 mt-1">{activeZone.name}</h4>
                </div>
                <div className="text-right sm:text-right flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                  <span className="text-2xl font-extrabold text-slate-100">{activeZone.tempC}°C</span>
                  <span className="text-[11px] text-slate-400">Feels Like: {activeZone.feelsLikeC}°C</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">
                Geospatial Driver Attributions (SHAP Attribution Score)
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeZone.drivers.map((drv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-1.5"
                  >
                    <span className="text-xs text-slate-300 font-medium leading-relaxed">{drv.split(" (")[0]}</span>
                    <span className="text-xs font-bold text-amber-500">{drv.includes("SHAP:") ? drv.substring(drv.indexOf("SHAP:") + 5, drv.length - 1) : "+1.2°C"}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compact Zone List Table */}
            <Card style={{ padding: "0" }}>
              <div style={{ padding: "1.25rem", borderBottom: "1px solid #334155" }}>
                <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F1F5F9" }}>
                  Ward Vulnerability Index
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", textAlign: "left", color: "#94A3B8" }}>
                      <th style={{ padding: "0.75rem 1.25rem", fontWeight: 600 }}>Zone Name</th>
                      <th style={{ padding: "0.75rem 1.25rem", fontWeight: 600 }}>Avg Temp</th>
                      <th style={{ padding: "0.75rem 1.25rem", fontWeight: 600 }}>Vulnerability</th>
                      <th style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z) => {
                      const isSelected = z.id === selectedZoneId;
                      return (
                        <tr
                          key={z.id}
                          style={{
                            borderBottom: "1px solid #1E293B",
                            backgroundColor: isSelected ? "rgba(99, 102, 241, 0.05)" : "transparent",
                            transition: "background-color 150ms",
                          }}
                        >
                          <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#F1F5F9" }}>
                            {z.name}
                          </td>
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <Badge variant="heat" heatLevel={z.heatLevel}>
                              {z.tempC}°C
                            </Badge>
                          </td>
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color:
                                  z.vulnerability === "High"
                                    ? "#FCA5A5"
                                    : z.vulnerability === "Medium"
                                    ? "#FDE047"
                                    : "#86EFAC",
                              }}
                            >
                              {z.vulnerability}
                            </span>
                          </td>
                          <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                            <Button
                              variant={isSelected ? "primary" : "ghost"}
                              style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                              onClick={() => setSelectedZoneId(z.id)}
                            >
                              Diagnose
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── RIGHT COLUMN (35% width equivalent, sticky) ──────────────── */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-4">
            
            {/* Available Budget Slider Card */}
            <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F1F5F9" }}>
                  Available Budget
                </h3>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                  Adjust to see ranked interventions update in real time
                </p>
              </div>

              <Slider
                min={0}
                max={5000000}
                step={50000}
                value={formatCurrency(budget)}
                onChange={(e) => setBudget(Number(e.target.value))}
                label="Ward Cap Limit"
              />
            </Card>

            {/* Recommended Interventions Panel */}
            <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F1F5F9" }}>
                  Recommended Interventions
                </h3>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748B" }}>
                  Optimized for thermal reduction yield per Rupee spent
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                {selected.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No recommendations affordable at this budget cap limit.
                  </div>
                ) : (
                  selected.map((item, idx) => {
                    const effRatio = (item.cost / Math.abs(item.tempReduction)).toFixed(0);
                    return (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid #134E4A",
                          background: "#022C22",
                          borderRadius: "0.75rem",
                          padding: "0.875rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <div style={{
                              width: "20px", height: "20px", borderRadius: "50%",
                              background: "#0D9488", color: "#F8FAFC",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.6875rem", fontWeight: 800, flexShrink: 0, marginTop: "2px"
                            }}>
                              {idx + 1}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0" }}>
                                {item.type}
                              </h4>
                              <p style={{ margin: 0, fontSize: "0.75rem", color: "#2DD4BF" }}>
                                Zone: {item.zoneName}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F8FAFC" }}>
                            {formatCurrency(item.cost)}
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #115E59", paddingTop: "0.375rem", fontSize: "0.75rem" }}>
                          <span style={{ color: "#2DD4BF", fontWeight: 600 }}>
                            Projected Yield: {item.tempReduction.toFixed(1)}°C
                          </span>
                          <span style={{ color: "#64748B" }}>
                            {formatCurrency(Number(effRatio))}/°C
                          </span>
                        </div>

                        {item.tradeoff && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <Badge variant="tradeoff" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.5rem" }}>
                              {item.tradeoff}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Exceeds budget section */}
                {unselected.length > 0 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 700, color: "#475569", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Locked — Exceeds Budget ({unselected.length})
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", opacity: 0.45 }}>
                      {unselected.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            border: "1px solid #334155",
                            background: "#0F172A",
                            borderRadius: "0.75rem",
                            padding: "0.75rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: "#94A3B8" }}>{item.type}</span>
                            <span style={{ color: "#64748B", marginLeft: "4px" }}>({item.zoneName})</span>
                          </div>
                          <span style={{ fontWeight: 700, color: "#94A3B8" }}>{formatCurrency(item.cost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Live Summary Strip Card */}
            <Card style={{ padding: "1rem", background: "linear-gradient(to right, #1E1B4B, #0F172A)", border: "1px solid #4F46E535" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Active Allocations:</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F8FAFC" }}>
                    {selected.length} Selected
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Total Cost Spent:</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F8FAFC" }}>
                    {formatCurrency(totalCostSpent)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Projected Heat Mitigation:</span>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#2DD4BF" }}>
                    -{totalTempReduction.toFixed(1)}°C
                  </span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
