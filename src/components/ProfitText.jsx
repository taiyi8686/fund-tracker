export default function ProfitText({ value, pct, size = "normal" }) {
  if (value == null) return null;
  const positive = value >= 0;
  const color = positive ? "#e94560" : "#22c55e";
  const fSize = size === "large" ? 24 : size === "medium" ? 18 : 14;
  const pctSize = size === "large" ? 13 : size === "medium" ? 12 : 11;

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: fSize, fontWeight: 700, color }}>
        {positive ? "+" : ""}{typeof value === "number" ? value.toFixed(2) : value}
      </span>
      {pct !== undefined && pct !== null && (
        <span style={{ fontSize: pctSize, color, fontWeight: 500 }}>
          {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
