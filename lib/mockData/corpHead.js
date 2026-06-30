import { masterZones } from "./zones";

/**
 * Mock data for the Corporation Head Dashboard.
 * Swap this file with real backend APIs in production.
 */

export const mockCorpHeadData = {
  /* ── Executive Stats Summary ─────────────────────────── */
  stats: {
    budgetAllocated: 3850000,
    avgTempReduction: -1.8,
    zonesCovered: "14 of 22 Wards",
    equityScore: "88/100",
  },

  /* ── City Zones with Funded Status (derived from shared masterZones) ── */
  zones: masterZones.map((z) => ({
    id: z.id,
    name: z.name,
    lat: z.lat,
    lng: z.lng,
    heatLevel: z.heatLevel,
    // Simulate funded zones based on Planner's selection cap of ~₹3.85M
    funded: ["z1", "z2", "z3", "z4", "z5"].includes(z.id),
  })),

  /* ── Portfolio Budget Split ─────────────────────────── */
  portfolio: [
    { type: "Cool Roofs",          amount: 1750000, percentage: 45 },
    { type: "Urban Greening",      amount: 1150000, percentage: 30 },
    { type: "Reflective Pavement", amount: 950000,  percentage: 25 },
  ],

  /* ── Equity-Weighted Prioritization ──────────────────── */
  equityPrioritization: masterZones
    .map((z) => ({
      id: "ep-" + z.id,
      zoneName: z.name,
      vulnerabilityScore: z.vulnerabilityScore,
      details: z.details,
      funded: ["z1", "z2", "z3", "z4", "z5"].includes(z.id),
    }))
    // Sorted by vulnerability score descending (highest score first)
    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore),

  /* ── City-Wide Tradeoffs ─────────────────────────────── */
  tradeoffs: [
    "⚠ 3 interventions may raise humidity nearby (Cool Roofs in Karve Nagar & Kothrud)",
    "✔ 1 zone shows spillover cooling benefit to adjacent ward (Karve Nagar)",
    "⚠ High albedo pavements show diminishing pedestrian benefit if over-concentrated",
  ],
};
