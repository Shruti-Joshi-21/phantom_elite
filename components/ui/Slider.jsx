/**
 * Slider — styled range input with budget-indigo accent.
 * Dark-mode tuned label colors.
 */

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  label,
  unit = "",
  className = "",
  style = {},
  id,
  ...props
}) {
  const sliderId = id ?? `slider-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.375rem", ...style }}
      className={className}
    >
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#94A3B8",    /* slate-400 on dark */
          }}
        >
          <label htmlFor={sliderId}>{label}</label>
          {value !== undefined && (
            <span style={{ color: "#818CF8", fontWeight: 600 }}>
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        style={{
          width: "100%",
          height: "6px",
          borderRadius: "9999px",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          accentColor: "#4F46E5",
          outline: "none",
          background: "#334155",   /* slate-700 track on dark */
        }}
        {...props}
      />
    </div>
  );
}
