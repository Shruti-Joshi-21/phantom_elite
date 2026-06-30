"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

/**
 * MapPanel — Leaflet map rendered client-side only.
 * Renders a CartoDB Dark Matter tile layer with a synthetic satellite-style land surface temperature
 * raster overlay generated dynamically on canvas, plus a distinct marker for the user's location
 * and key zone callouts.
 *
 * Props:
 *   centerLat      {number}   Map center latitude
 *   centerLng      {number}   Map center longitude
 *   zoom           {number}   Initial zoom level (default 13)
 *   zones          {Array}    [{id, name, lat, lng, heatLevel, funded}]
 *   userLocation   {Object}   {lat, lng} — rendered as pulsing dot marker
 *   height         {string}   CSS height string (default "280px")
 *   selectedZoneId {string}   ID of the currently highlighted zone
 *   onZoneClick    {function} Callback when a zone is clicked/selected
 */

// Seeded mulberry32 pseudo-random number generator to keep noise generation consistent
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Helper to generate synthetic LST satellite raster overlay using offscreen canvas and simplex noise
function generateHeatRasterDataURL(hotspots, width = 1200, height = 800) {
  function getColorForLevel(level, alpha) {
    const colors = [
      { stop: 0.0, r: 37, g: 99, b: 235 },   // cool: #2563EB
      { stop: 0.25, r: 56, g: 189, b: 248 }, // mild: #38BDF8
      { stop: 0.5, r: 250, g: 204, b: 21 },  // moderate: #FACC15
      { stop: 0.75, r: 251, g: 146, b: 60 }, // high: #FB923C
      { stop: 1.0, r: 220, g: 38, b: 38 }    // severe: #DC2626
    ];
    let lower = colors[0];
    let upper = colors[colors.length - 1];
    for (let i = 0; i < colors.length - 1; i++) {
      if (level >= colors[i].stop && level <= colors[i + 1].stop) {
        lower = colors[i];
        upper = colors[i + 1];
        break;
      }
    }
    const range = upper.stop - lower.stop;
    const factor = range > 0 ? (level - lower.stop) / range : 0;
    const r = Math.round(lower.r + (upper.r - lower.r) * factor);
    const g = Math.round(lower.g + (upper.g - lower.g) * factor);
    const b = Math.round(lower.b + (upper.b - lower.b) * factor);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Consistent seeded noise generator
  const prng = mulberry32(789);
  const noise2D = createNoise2D(prng);

  const cellSize = 8;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  for (let rIndex = 0; rIndex < rows; rIndex++) {
    for (let cIndex = 0; cIndex < cols; cIndex++) {
      const cx = cIndex * cellSize + cellSize / 2;
      const cy = rIndex * cellSize + cellSize / 2;

      // 1. Distance falloff influence from hotspots (Max-based Gaussian decay)
      let maxInfluence = 0.0;
      hotspots.forEach((hs) => {
        const hsx = hs.xFrac * width;
        const hsy = hs.yFrac * height;
        const dx = cx - hsx;
        const dy = cy - hsy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = hs.radiusFrac * width;

        // Gaussian decay formula: intensity * exp(-(dist^2) / (2 * radius^2))
        const influence = hs.intensity * Math.exp(-(dist * dist) / (2 * radius * radius));
        if (influence > maxInfluence) {
          maxInfluence = influence;
        }
      });

      // 2. Multi-octave simplex noise overlay
      const nx = cx / width;
      const ny = cy / height;
      const noiseL = noise2D(nx * 4.0, ny * 4.0);  // Low-frequency regional variation
      const noiseH = noise2D(nx * 20.0, ny * 20.0); // High-frequency granular texture
      const noiseVal = noiseL * 0.75 + noiseH * 0.25;

      // Perturb base value by ±15% (small additive/multiplicative adjustment)
      let combinedVal = maxInfluence + 0.15 * noiseVal;

      // Clamp values between 0.0 and 1.0
      combinedVal = Math.min(1.0, Math.max(0.0, combinedVal));

      // Fill cell
      ctx.fillStyle = getColorForLevel(combinedVal, 0.95);
      ctx.fillRect(cIndex * cellSize, rIndex * cellSize, cellSize, cellSize);
    }
  }

  return canvas.toDataURL();
}

export default function MapPanel({
  centerLat = 18.5074,
  centerLng = 73.8077,
  zoom = 13,
  zones = [],
  userLocation = null,
  height = "280px",
  selectedZoneId = null,
  onZoneClick = null,
}) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const highlightLayerRef = useRef(null);

  // Sync selected zone highlights and pan map smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (highlightLayerRef.current) {
      map.removeLayer(highlightLayerRef.current);
      highlightLayerRef.current = null;
    }

    if (!selectedZoneId) return;

    const selZone = zones.find((z) => z.id === selectedZoneId);
    if (!selZone) return;

    import("leaflet").then((LModule) => {
      const Leaflet = LModule.default || LModule;

      const highlightHtml = `
        <div style="
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid #F59E0B;
          box-sizing: border-box;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.4), 0 0 16px rgba(245, 158, 11, 0.6);
          animation: highlightPulse 1.5s infinite ease-in-out;
        "></div>
        <style>
          @keyframes highlightPulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.18); opacity: 0.5; }
          }
        </style>
      `;

      const highlightIcon = Leaflet.divIcon({
        html: highlightHtml,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      highlightLayerRef.current = Leaflet.marker([selZone.lat, selZone.lng], {
        icon: highlightIcon,
        interactive: false,
      }).addTo(map);

      map.panTo([selZone.lat, selZone.lng], { animate: true });
    });
  }, [selectedZoneId, zones]);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    /* Dynamic import for Leaflet only */
    import("leaflet").then((LModule) => {
      // Guard against double init in StrictMode
      if (mapInstanceRef.current) return;

      const Leaflet = LModule.default || LModule;

      /* Leaflet default icon fix */
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });


      /* Create map instance */
      const map = Leaflet.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // Invalidate size to ensure it gets the correct container dimensions
      map.invalidateSize();
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      /* CartoDB Dark Matter tiles */
      Leaflet.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Compute geographic bounds and expand them slightly (e.g. by 20% total, 10% on each side)
      const bounds = map.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const latDiff = (northEast.lat - southWest.lat) || 0.01;
      const lngDiff = (northEast.lng - southWest.lng) || 0.01;

      const expandedSouthWest = Leaflet.latLng(
        southWest.lat - latDiff * 0.1,
        southWest.lng - lngDiff * 0.1
      );
      const expandedNorthEast = Leaflet.latLng(
        northEast.lat + latDiff * 0.1,
        northEast.lng + lngDiff * 0.1
      );
      const expandedBounds = Leaflet.latLngBounds(expandedSouthWest, expandedNorthEast);

      // Define 6-10 hotspots matching mock zones and extra textures
      const rawHotspots = [
        // Zone center hotspots matching mock data:
        // Baner (moderate): lat: 18.5590, lng: 73.7868
        { lat: 18.5590, lng: 73.7868, intensity: 0.6, radiusFrac: 0.28 },
        // Aundh (high): lat: 18.5584, lng: 73.8076
        { lat: 18.5584, lng: 73.8076, intensity: 0.8, radiusFrac: 0.30 },
        // Kothrud (high): lat: 18.5074, lng: 73.8077
        { lat: 18.5074, lng: 73.8077, intensity: 0.8, radiusFrac: 0.32 },
        // Karve Nagar (severe): lat: 18.4918, lng: 73.8225
        { lat: 18.4918, lng: 73.8225, intensity: 1.0, radiusFrac: 0.35 },
        // Warje (moderate): lat: 18.4857, lng: 73.7922
        { lat: 18.4857, lng: 73.7922, intensity: 0.6, radiusFrac: 0.28 },
        // Bavdhan (mild): lat: 18.5216, lng: 73.7663
        { lat: 18.5216, lng: 73.7663, intensity: 0.4, radiusFrac: 0.24 },

        // Intermediary textured hotspots for continuous realism:
        // Near Pashan Lake
        { lat: 18.5380, lng: 73.7950, intensity: 0.5, radiusFrac: 0.20 },
        // Near Shivajinagar
        { lat: 18.5350, lng: 73.8250, intensity: 0.75, radiusFrac: 0.22 },
        // Near Erandwane
        { lat: 18.5120, lng: 73.8250, intensity: 0.85, radiusFrac: 0.25 },
      ];

      // Convert geo hotspots to canvas fractional coordinates of the expanded bounding box
      const expandedLatDiff = (expandedNorthEast.lat - expandedSouthWest.lat) || 0.01;
      const expandedLngDiff = (expandedNorthEast.lng - expandedSouthWest.lng) || 0.01;

      const canvasHotspots = rawHotspots.map((rh) => {
        const xFrac = (rh.lng - expandedSouthWest.lng) / expandedLngDiff;
        const yFrac = (expandedNorthEast.lat - rh.lat) / expandedLatDiff;
        return {
          xFrac,
          yFrac,
          intensity: rh.intensity,
          radiusFrac: rh.radiusFrac,
        };
      });

      // Generate the synthetic raster (1200x800 resolution)
      const dataUrl = generateHeatRasterDataURL(canvasHotspots, 1200, 800);

      // Add full-coverage satellite land surface temperature raster overlay with 0.62 opacity
      Leaflet.imageOverlay(dataUrl, expandedBounds, {
        opacity: 0.62,
        interactive: false,
      }).addTo(map);

      /* Add 3-4 small premium dark labeled callout pills above the overlay */
      const calloutZones = [
        { name: "Kothrud", lat: 18.5074, lng: 73.8077, temp: "38.2°C" },
        { name: "Karve Nagar", lat: 18.4918, lng: 73.8225, temp: "41.5°C" },
        { name: "Baner", lat: 18.5590, lng: 73.7868, temp: "35.8°C" },
        { name: "Aundh", lat: 18.5584, lng: 73.8076, temp: "39.4°C" },
      ];

      calloutZones.forEach((cz) => {
        const matchingZone = zones.find((z) => z.name === cz.name);
        const isFunded = matchingZone ? matchingZone.funded : false;
        const hasFundingField = matchingZone && matchingZone.funded !== undefined;

        // Apply distinct outline styling to funded vs. unfunded zones
        const borderColor = hasFundingField ? (isFunded ? "#0D9488" : "#E2E8F030") : "#475569";
        const labelText = hasFundingField ? (isFunded ? `${cz.name} (Funded)` : `${cz.name} (Unfunded)`) : cz.name;
        const shadowColor = hasFundingField ? (isFunded ? "0 0 12px #0D9488" : "0 4px 6px rgba(0,0,0,0.5)") : "0 4px 6px rgba(0,0,0,0.5)";

        const html = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 90px;
            height: 40px;
            pointer-events: none;
            font-family: inherit;
          ">
            <div style="
              background: rgba(15, 23, 42, 0.95);
              border: 1.5px solid ${borderColor};
              border-radius: 4px;
              padding: 2px 6px;
              box-shadow: ${shadowColor};
              text-align: center;
              white-space: nowrap;
            ">
              <div style="color: #94A3B8; font-size: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.1;">${labelText}</div>
              <div style="color: #F8FAFC; font-size: 10px; font-weight: 700; margin-top: 1px; line-height: 1.1;">${cz.temp}</div>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-top: 4px solid ${borderColor};
              margin-top: -1px;
            "></div>
          </div>
        `;
        const icon = Leaflet.divIcon({
          html,
          className: "",
          iconSize: [90, 40],
          iconAnchor: [45, 39], // Centered at the arrow point
        });

        const marker = Leaflet.marker([cz.lat, cz.lng], { icon, interactive: true }).addTo(map);
        marker.on("click", () => {
          if (onZoneClick) {
            const matching = zones.find((z) => z.name === cz.name);
            if (matching) onZoneClick(matching.id);
          }
        });
      });

      /* Zone center tooltip markers (invisible circles so hover still shows detailed tooltip labels) */
      zones.forEach((z) => {
        const hasCallout = calloutZones.some((cz) => cz.name === z.name);
        
        const marker = Leaflet.circleMarker([z.lat, z.lng], {
          radius: 14,
          stroke: false,
          fillColor: "transparent",
          fillOpacity: 0,
          interactive: true,
        }).addTo(map);

        if (!hasCallout) {
          marker.bindTooltip(
            `<div style="font-family: inherit; font-size: 11px; line-height: 1.4;">
              <strong style="color: #F8FAFC;">${z.name}</strong><br/>
              <span style="color: #94A3B8; text-transform: capitalize;">${z.heatLevel} Heat</span>
            </div>`,
            { permanent: false, direction: "top", offset: [0, -6] }
          );
        }

        marker.on("click", () => {
          if (onZoneClick) onZoneClick(z.id);
        });
      });

      /* User location marker — pulsing teal dot rendered crisp on top */
      if (userLocation) {
        const pulseHtml = `
          <div style="
            width:20px;height:20px;border-radius:50%;
            background:#0D9488;
            border:2.5px solid #F8FAFC;
            box-shadow:0 0 0 6px #0D948840, 0 0 0 12px #0D948820;
            animation:pulse 2s ease infinite;
          "></div>
          <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 4px #0D948840,0 0 0 10px #0D948818}50%{box-shadow:0 0 0 8px #0D948830,0 0 0 16px #0D948812}}</style>
        `;
        const icon = Leaflet.divIcon({
          html:       pulseHtml,
          className:  "",
          iconSize:   [20, 20],
          iconAnchor: [10, 10],
        });
        Leaflet.marker([userLocation.lat, userLocation.lng], { icon })
          .addTo(map)
          .bindTooltip("You are here", { permanent: false, direction: "top", offset: [0, -10] });
      }
    });

    /* Cleanup function to remove map instance on unmount */
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width: "100%",
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid #334155",
        backgroundColor: "#0F172A",
      }}
    />
  );
}
