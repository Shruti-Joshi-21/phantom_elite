import { masterZones } from "./zones";

/**
 * Mock data for the Citizen Dashboard.
 * Swap these values with real GPS + LST API responses in production.
 */

export const mockCitizenData = {
  /* ── Location ────────────────────────────────────────── */
  location: {
    label: "Kothrud, Pune",
    ward: "Ward 17",
    lat: 18.5074,
    lng: 73.8077,
  },

  /* ── Current heat reading ────────────────────────────── */
  heat: {
    tempC: 38.2,
    feelsLikeC: 41,
    /** "cool" | "mild" | "moderate" | "high" | "severe" */
    severity: "high",
    statusLine: "High heat exposure — limit outdoor activity 12–4 PM",
    updatedAt: "Today, 12:45 PM",
    source: "Live reading · GPS + satellite LST fusion",
  },

  /* ── Zone map data (derived from shared masterZones) ──── */
  zones: masterZones.map((z) => ({
    id: z.id,
    name: z.name,
    lat: z.lat,
    lng: z.lng,
    heatLevel: z.heatLevel,
    current: z.name === "Kothrud",
  })),

  /* ── Why it's hot (plain-language diagnosis) ─────────── */
  diagnosis: [
    { id: "d1", icon: "🌳", reason: "Low tree cover in this area" },
    { id: "d2", icon: "🏗️", reason: "High concrete and asphalt density" },
    { id: "d3", icon: "💧", reason: "No nearby water body or green buffer" },
  ],

  /* ── Citizen recommendations ─────────────────────────── */
  recommendations: [
    {
      id: "r1",
      icon: "🌿",
      title: "Nearest cool zone",
      detail: "Pu La Deshpande Garden — 12 min walk (est. 32°C)",
    },
    {
      id: "r2",
      icon: "🕗",
      title: "Best outdoor window today",
      detail: "Before 9 AM or after 6 PM — UV index drops significantly",
    },
    {
      id: "r3",
      icon: "💧",
      title: "Stay hydrated",
      detail: "High heat index expected until evening — carry water",
    },
  ],
};
