/**
 * Card — rounded-xl, shadow-sm, slate-700 border, 1rem padding.
 * Dark-themed: slate-800 surface background.
 */
export default function Card({ children, className = "", style = {}, ...props }) {
  return (
    <div
      style={{
        borderRadius: "0.75rem",
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(255, 255, 255, 0.02)",
        border: "none",
        padding: "1rem",
        backgroundColor: "rgba(2, 6, 23, 1.0)",   /* deep blackish slate-950 */
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
