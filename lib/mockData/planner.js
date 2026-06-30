import { masterZones } from "./zones";

/**
 * Mock data for the Planner Dashboard.
 * Swap this file with real backend APIs in production.
 */

export const mockPlannerData = {
  /* ── Ward Metadata ───────────────────────────────────── */
  ward: {
    name: "Pune — Ward Overview",
    city: "Pune",
    activeZonesCount: 8,
  },

  /* ── Zones List (derived from shared masterZones) ────── */
  zones: masterZones.map((z) => ({
    id: z.id,
    name: z.name,
    lat: z.lat,
    lng: z.lng,
    tempC: z.tempC,
    feelsLikeC: z.feelsLikeC,
    heatLevel: z.heatLevel,
    vulnerability: z.vulnerability,
    drivers: z.drivers,
  })),

  /* ── Master Interventions List ───────────────────────── */
  interventions: [
    {
      id: "i1",
      type: "Cool Roofs",
      zoneName: "Karve Nagar",
      cost: 950000,
      tempReduction: -2.0,
      tradeoff: "⚠ Cool roofs may slightly raise humidity nearby",
    },
    {
      id: "i2",
      type: "Cool Pavement",
      zoneName: "Karve Nagar",
      cost: 1500000,
      tempReduction: -2.5,
      tradeoff: "⚠ Highly reflective surfaces can increase pedestrian glare",
    },
    {
      id: "i3",
      type: "Cooling Centers",
      zoneName: "Aundh",
      cost: 1800000,
      tempReduction: -2.2,
      tradeoff: "⚠ High electricity demand unless powered by solar",
    },
    {
      id: "i4",
      type: "Pocket Parks",
      zoneName: "Aundh",
      cost: 1200000,
      tempReduction: -1.6,
      tradeoff: "",
    },
    {
      id: "i5",
      type: "Cool Roofs",
      zoneName: "Kothrud",
      cost: 800000,
      tempReduction: -1.8,
      tradeoff: "⚠ Cool roofs may slightly raise humidity nearby",
    },
    {
      id: "i6",
      type: "Cool Pavement",
      zoneName: "Kothrud",
      cost: 1100000,
      tempReduction: -1.5,
      tradeoff: "⚠ Highly reflective surfaces can increase pedestrian glare",
    },
    {
      id: "i7",
      type: "Urban Greening",
      zoneName: "Warje",
      cost: 650000,
      tempReduction: -1.2,
      tradeoff: "⚠ Trees require regular watering for first 3 years",
    },
    {
      id: "i8",
      type: "Urban Greening",
      zoneName: "Baner",
      cost: 750000,
      tempReduction: -1.1,
      tradeoff: "",
    },
    {
      id: "i9",
      type: "Green Roofs",
      zoneName: "Shivajinagar",
      cost: 400000,
      tempReduction: -0.8,
      tradeoff: "",
    },
    {
      id: "i10",
      type: "Urban Greening",
      zoneName: "Bavdhan",
      cost: 500000,
      tempReduction: -0.7,
      tradeoff: "",
    },
  ],
};
