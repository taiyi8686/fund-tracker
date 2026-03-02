export default function Badge({ up, count }) {
  if (!count) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontSize: 12,
        fontWeight: 600,
        color: up ? "#e94560" : "#22c55e",
        background: up ? "rgba(233,69,96,0.08)" : "rgba(34,197,94,0.08)",
        padding: "2px 8px",
        borderRadius: 6,
      }}
    >
      {up ? "↑" : "↓"} {count}
    </span>
  );
}
