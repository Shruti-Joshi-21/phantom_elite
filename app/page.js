import RoleCards from "@/components/RoleCards";

export const metadata = {
  title: "UrbanCool — AI-powered Urban Heat Mitigation",
  description:
    "From geospatial heat hotspot detection to optimized, budget-aware cooling recommendations. One system, three role-based views.",
};

export default function LandingPage() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: 'url("/hero section background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#020617",
      }}
    >
      {/* 50% Black Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Ambient gradient orbs — dark edition ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div style={{
          position: "absolute", top: "-160px", left: "-100px",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, #3B82F625 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", top: "35%", right: "-80px",
          width: "440px", height: "440px", borderRadius: "50%",
          background: "radial-gradient(circle, #0D948820 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", left: "35%",
          width: "520px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, #FB923C14 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      {/* ── Page content — full-bleed bg, constrained column ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 3rem",
        }}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          style={{
            paddingTop: "clamp(3.5rem, 9vw, 7rem)",
            paddingBottom: "clamp(2.5rem, 5vw, 4.5rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: "#0D2E2B", color: "#2DD4BF",
            borderRadius: "9999px", padding: "0.3rem 1rem",
            fontSize: "0.75rem", fontWeight: 600,
            letterSpacing: "0.05em", textTransform: "uppercase",
            border: "1px solid #134E4A",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#0D9488", display: "inline-block", boxShadow: "0 0 0 3px #0D948840" }} />
            Bharat Antariksh Hackathon · PS-1
          </div>

          {/* Headline */}
          <h1 style={{
            margin: 0,
            fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "#F8FAFC",
            maxWidth: "860px",
          }}>
            <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>Urban Heat Mitigation, </span>
            <span style={{
              background: "linear-gradient(90deg, #2DD4BF, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
            }}>
              intelligently planned
            </span>
          </h1>

          {/* Tagline */}
          <p style={{
            margin: 0,
            fontSize: "clamp(1.125rem, 2.5vw, 1.35rem)",
            color: "#E2E8F0",
            fontWeight: 600,
            lineHeight: 1.65,
            maxWidth: "580px",
            textShadow: "0 2px 6px rgba(0,0,0,0.85)",
          }}>
            AI-powered cooling intervention planning for Indian cities
          </p>

          {/* Subtext */}
          <p style={{
            margin: 0, fontSize: "0.9375rem",
            color: "#CBD5E1", lineHeight: 1.75, maxWidth: "640px",
            fontWeight: 500,
            textShadow: "0 2px 4px rgba(0,0,0,0.9)",
          }}>
            From geospatial heat hotspot detection to optimized, budget-aware
            cooling recommendations — one system for every stakeholder.
          </p>

          {/* Heat spectrum bar */}
          <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.6875rem", color: "#64748B", letterSpacing: "0.06em", fontWeight: 700 }}>COOL</span>
            <div style={{
              width: "180px", height: "6px", borderRadius: "9999px",
              background: "linear-gradient(to right, #3B82F6, #38BDF8, #FACC15, #FB923C, #DC2626)",
              boxShadow: "0 0 12px #FB923C40",
            }} />
            <span style={{ fontSize: "0.6875rem", color: "#64748B", letterSpacing: "0.06em", fontWeight: 700 }}>SEVERE</span>
          </div>
        </section>

        {/* ── ROLE SELECTOR ────────────────────────────────────────── */}
        <section aria-label="Select your role" style={{ paddingBottom: "clamp(3rem, 8vw, 5.5rem)" }}>
          <p style={{
            textAlign: "center",
            fontSize: "0.8125rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#CBD5E1", marginBottom: "2rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.9)",
          }}>
            Choose your view
          </p>
          <RoleCards />
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid #1E293B", padding: "1.75rem 0", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "#475569" }}>
            Built for{" "}
            <span style={{ color: "#64748B", fontWeight: 600 }}>Bharat Antariksh Hackathon</span>
            {" "}· PS-1: Optimizing Urban Heat Mitigation
          </p>
        </footer>
      </div>
    </div>
  );
}
