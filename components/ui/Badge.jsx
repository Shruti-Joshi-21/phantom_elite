/**
 * Badge — pill-shaped, semantic color variants.
 * Dark-mode tuned: backgrounds darkened to avoid blowing out on dark surfaces.
 *
 * variant: "heat" | "action" | "budget" | "tradeoff"
 * For heat variant you can also pass a heatLevel: "cool" | "mild" | "moderate" | "high" | "severe"
 */

const VARIANT_STYLES = {
  heat: {
    cool:     { background: "#1E3A5F", color: "#93C5FD" },
    mild:     { background: "#0C2D40", color: "#7DD3FC" },
    moderate: { background: "#3A2E00", color: "#FDE047" },
    high:     { background: "#3D1A00", color: "#FCA572" },
    severe:   { background: "#3B0A0A", color: "#FCA5A5" },
  },
  action:   { background: "#0D2E2B", color: "#2DD4BF" },
  budget:   { background: "#1E1B4B", color: "#A5B4FC" },
  tradeoff: { background: "#2D1F00", color: "#FCD34D" },
};

export default function Badge({
  children,
  variant = "action",
  heatLevel = "moderate",
  className = "",
  style = {},
  ...props
}) {
  let resolvedStyle;

  if (variant === "heat") {
    resolvedStyle = VARIANT_STYLES.heat[heatLevel] ?? VARIANT_STYLES.heat.moderate;
  } else {
    resolvedStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.action;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        padding: "0.25rem 0.75rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "0.01em",
        ...resolvedStyle,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}
