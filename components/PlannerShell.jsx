"use client";

import { useEffect, useMemo } from "react";
import MapPanel from "@/components/MapPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { AlertTriangle, Check, Plus } from "lucide-react";

/**
 * PlannerShell — Dark-themed City Planner Dashboard.
 * Includes interactive budget-aware intervention ranking, map selectors,
 * and SHAP driver diagnostic cards.
 */
export default function PlannerShell({
  data,
  selectedZoneId,
  setSelectedZoneId,
  selectedInterventionIds,
  setSelectedInterventionIds,
  planConfirmed,
  setPlanConfirmed,
  budget,
  setBudget,
}) {
  const { ward, zones, interventions } = data;

  // Sync state: deselect interventions that exceed the current budget cap
  useEffect(() => {
    setSelectedInterventionIds((prev) =>
      prev.filter((id) => {
        const item = interventions.find((i) => i.id === id);
        return item && item.cost <= budget;
      })
    );
  }, [budget, interventions, setSelectedInterventionIds]);

  // Compute active diagnosed zone
  const activeZone = useMemo(() => {
    return zones.find((z) => z.id === selectedZoneId) || null;
  }, [selectedZoneId, zones]);

  // Filter & sort interventions by cost-efficiency (temperature drop per Rupee spent)
  const sortedInterventions = useMemo(() => {
    const affordable = interventions.filter((item) => item.cost <= budget);
    return [...affordable].sort((a, b) => {
      const effA = Math.abs(a.tempReduction) / a.cost;
      const effB = Math.abs(b.tempReduction) / b.cost;
      return effB - effA; // Highest efficiency first
    });
  }, [budget, interventions]);

  // Find locked interventions exceeding the budget
  const lockedInterventions = useMemo(() => {
    return interventions.filter((item) => item.cost > budget);
  }, [budget, interventions]);

  // Compute summary stats from SELECTED interventions only
  const activeSelected = useMemo(() => {
    return sortedInterventions.filter((item) => selectedInterventionIds.includes(item.id));
  }, [sortedInterventions, selectedInterventionIds]);

  const totalCostSpent = useMemo(() => {
    return activeSelected.reduce((sum, item) => sum + item.cost, 0);
  }, [activeSelected]);

  const totalTempReduction = useMemo(() => {
    const sum = activeSelected.reduce((sum, item) => sum + item.tempReduction, 0);
    return Math.abs(sum); // Absolute degree reduction
  }, [activeSelected]);

  const remainingBudget = budget - totalCostSpent;

  // Toggle selection handler
  const handleToggleIntervention = (id) => {
    setSelectedInterventionIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Format currency helper
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
                userLocation={{ lat: 18.5074, lng: 73.8077 }} // User location at Kothrud
                height="340px"
                selectedZoneId={selectedZoneId}
                onZoneClick={setSelectedZoneId}
              />
            </Card>

            {/* Click-to-diagnose SHAP attributions */}
            {activeZone === null ? (
              <Card style={{ borderLeft: "3.5px solid #64748B", padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", textAlign: "center" }}>
                <span style={{ fontSize: "2.25rem", color: "#475569", marginBottom: "0.75rem" }}>📍</span>
                <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F1F5F9" }}>No Zone Selected</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                  Click a zone on the map or list to see its heat drivers
                </p>
              </Card>
            ) : (
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
            )}

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
                            backgroundColor: isSelected ? "rgba(79, 70, 229, 0.12)" : "transparent",
                            borderLeft: isSelected ? "4px solid #818CF8" : "4px solid transparent",
                            transition: "background-color 150ms, border-left 150ms",
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
                value={budget}
                displayValue={formatCurrency(budget)}
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
                  Select cards to include them in the heat mitigation blueprint
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                {sortedInterventions.length === 0 ? (
                  <div className="py-8 px-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No recommendations affordable at this budget cap limit.
                  </div>
                ) : (
                  sortedInterventions.map((item) => {
                    const isSelected = selectedInterventionIds.includes(item.id);
                    const effRatio = (item.cost / Math.abs(item.tempReduction)).toFixed(0);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleIntervention(item.id)}
                        style={{
                          border: isSelected ? "2px solid #0D9488" : "none",
                          background: isSelected ? "rgba(13, 148, 136, 0.08)" : "rgba(2, 6, 23, 1.0)",
                          borderRadius: "0.75rem",
                          padding: "0.875rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          cursor: "pointer",
                          transition: "box-shadow 150ms ease, background-color 150ms ease, transform 100ms ease",
                          boxShadow: isSelected ? "0 4px 12px rgba(13, 148, 136, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          if (!isSelected) {
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(255, 255, 255, 0.08)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          if (!isSelected) {
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <div style={{
                              width: "20px", height: "20px", borderRadius: "50%",
                              background: isSelected ? "#0D9488" : "#1E293B", color: "#F8FAFC",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0, marginTop: "2px"
                            }}>
                              {isSelected ? <Check size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={3} />}
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
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F8FAFC" }}>
                              {formatCurrency(item.cost)}
                            </span>
                            <span style={{ fontSize: "0.65rem", color: isSelected ? "#2DD4BF" : "#64748B", fontWeight: 600 }}>
                              {isSelected ? "In Plan" : "Add to Plan"}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1E293B", paddingTop: "0.375rem", fontSize: "0.75rem" }}>
                          <span style={{ color: "#2DD4BF", fontWeight: 600 }}>
                            Projected Yield: {item.tempReduction.toFixed(1)}°C
                          </span>
                          <span style={{ color: "#64748B" }}>
                            {formatCurrency(Number(effRatio))}/°C
                          </span>
                        </div>

                        {item.tradeoff && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <Badge variant="tradeoff" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                              <AlertTriangle size={10} style={{ color: "#FCD34D" }} />
                              {item.tradeoff.replace(/^[⚠✔]\s*/, "")}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Exceeds budget section */}
                {lockedInterventions.length > 0 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 700, color: "#475569", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Locked — Exceeds Budget ({lockedInterventions.length})
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", opacity: 0.45 }}>
                      {lockedInterventions.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            border: "none",
                            background: "rgba(2, 6, 23, 1.0)",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)",
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
            <Card style={{ padding: "1.25rem", background: "rgba(2, 6, 23, 1.0)", border: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Active Allocations:</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F8FAFC" }}>
                    {activeSelected.length} Selected
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Total Cost Spent:</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F8FAFC" }}>
                    {formatCurrency(totalCostSpent)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Budget Remaining:</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: remainingBudget >= 0 ? "#86EFAC" : "#FCA5A5" }}>
                    {formatCurrency(remainingBudget)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(79, 70, 229, 0.2)", paddingTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>Projected Heat Mitigation:</span>
                  <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "#2DD4BF" }}>
                    -{totalTempReduction.toFixed(1)}°C
                  </span>
                </div>

                <Button
                  variant="primary"
                  disabled={activeSelected.length === 0}
                  onClick={() => setPlanConfirmed(true)}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                >
                  Confirm Plan
                </Button>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* ── PLAN CONFIRMATION MODAL OVERLAY ────────────────────────────── */}
      {planConfirmed && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(2, 6, 23, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
        }}>
          <div style={{
            background: "rgba(2, 6, 23, 1.0)",
            border: "none",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "520px",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}>
            {/* Header / Success Icon */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.08)",
                border: "2px solid #10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
                marginBottom: "0.5rem",
                boxShadow: "0 0 16px rgba(16, 185, 129, 0.2)",
              }}>
                <Check size={28} strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Plan Confirmed</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748B", margin: 0 }}>
                Your heat mitigation blueprint is locked and ready for deployment.
              </p>
            </div>

            {/* List of Selected Interventions */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              maxHeight: "180px",
              overflowY: "auto",
              borderTop: "1px solid #1e293b",
              borderBottom: "1px solid #1e293b",
              padding: "1rem 0",
            }}>
              {activeSelected.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#E2E8F0" }}>{item.type}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Zone: {item.zoneName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{formatCurrency(item.cost)}</div>
                    <div style={{ fontSize: "0.75rem", color: "#2DD4BF" }}>{item.tempReduction.toFixed(1)}°C Reduction</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Statistics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#94A3B8" }}>Total Interventions Selected:</span>
                <span style={{ fontWeight: 700, color: "#F8FAFC" }}>{activeSelected.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#94A3B8" }}>Committed Budget Spend:</span>
                <span style={{ fontWeight: 700, color: "#F8FAFC" }}>{formatCurrency(totalCostSpent)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#94A3B8" }}>Remaining Ward Cap Limit:</span>
                <span style={{ fontWeight: 700, color: "#86EFAC" }}>{formatCurrency(remainingBudget)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", borderTop: "1px solid #1e293b", paddingTop: "0.75rem" }}>
                <span style={{ color: "#A5B4FC", fontWeight: 600 }}>Projected Area mitigation:</span>
                <span style={{ fontWeight: 800, color: "#2DD4BF", fontSize: "1.125rem" }}>-{totalTempReduction.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Edit / Go Back Button */}
            <div style={{ marginTop: "0.5rem" }}>
              <Button
                variant="secondary"
                onClick={() => setPlanConfirmed(false)}
                style={{ width: "100%" }}
              >
                Edit Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
