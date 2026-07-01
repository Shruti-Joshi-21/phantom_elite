/**
 * Button — three variants: primary | secondary | ghost.
 * Dark-mode tuned.
 *
 * primary  → solid budget-indigo background
 * secondary → outlined budget-indigo border
 * ghost    → transparent, subtle hover on dark surfaces
 */

const VARIANT_STYLES = {
  primary: {
    base: {
      backgroundColor: "#0D9488",
      color: "#ffffff",
      border: "1px solid transparent",
    },
    hover: {
      backgroundColor: "#0F766E",
    },
  },
  secondary: {
    base: {
      backgroundColor: "transparent",
      color: "#2DD4BF",
      border: "1px solid #0D9488",
    },
    hover: {
      backgroundColor: "rgba(13, 148, 136, 0.15)",
    },
  },
  ghost: {
    base: {
      backgroundColor: "transparent",
      color: "#94A3B8",   /* slate-400 */
      border: "1px solid transparent",
    },
    hover: {
      backgroundColor: "#1E293B",   /* slate-800 */
    },
  },
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  style = {},
  disabled = false,
  ...props
}) {
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        borderRadius: "0.5rem",
        padding: "0.5rem 1.25rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        lineHeight: 1.5,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background-color 150ms ease, opacity 150ms ease",
        outline: "none",
        ...variantStyle.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) Object.assign(e.currentTarget.style, variantStyle.hover);
      }}
      onMouseLeave={(e) => {
        if (!disabled) Object.assign(e.currentTarget.style, variantStyle.base);
      }}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
