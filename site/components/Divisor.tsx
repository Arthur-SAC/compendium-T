export function Divisor() {
  return (
    <div
      data-testid="divisor"
      aria-hidden
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--destaque)", opacity: 0.8 }}
    >
      <span style={{ height: 1, width: 90, background: "linear-gradient(90deg,transparent,var(--destaque))" }} />
      <span style={{ width: 7, height: 7, background: "var(--destaque)", transform: "rotate(45deg)" }} />
      <span style={{ height: 1, width: 90, background: "linear-gradient(90deg,var(--destaque),transparent)" }} />
    </div>
  );
}
