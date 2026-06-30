/**
 * Card — rounded-xl, shadow-sm, slate-700 border, 1rem padding.
 * Dark-themed: slate-800 surface background.
 */
export default function Card({ children, className = "", style = {}, ...props }) {
  return (
    <div
      style={{
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.3)",
        border: "1px solid var(--color-base-border)",   /* slate-700 */
        padding: "1rem",
        backgroundColor: "var(--color-base-surface)",   /* slate-800 */
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
