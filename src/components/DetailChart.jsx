export default function DetailChart({ data, positive, height = 160 }) {
  if (!data || data.length < 2) return null;
  const w = 340;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const color = positive ? "#e94560" : "#22c55e";
  const startVal = data[0];

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - 20 - ((v - min) / range) * (height - 40);
    return [x, y];
  });

  const baseY = height - 20 - ((startVal - min) / range) * (height - 40);
  const polyStr = points.map((p) => p.join(",")).join(" ");
  const areaStr = `0,${height - 20} ${polyStr} ${w},${height - 20}`;

  const gridLines = 4;
  const gridValues = [];
  for (let i = 0; i <= gridLines; i++) {
    const val = min + (range * i) / gridLines;
    const pct = ((val - startVal) / startVal) * 100;
    gridValues.push({ y: height - 20 - (i / gridLines) * (height - 40), pct });
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {gridValues.map((g, i) => (
        <g key={i}>
          <line x1="0" y1={g.y} x2={w} y2={g.y} stroke="#eee" strokeWidth="0.5" />
          <text x={w - 2} y={g.y - 3} textAnchor="end" fontSize="9" fill="#bbb">
            {g.pct >= 0 ? "+" : ""}{g.pct.toFixed(2)}%
          </text>
        </g>
      ))}
      <line x1="0" y1={baseY} x2={w} y2={baseY} stroke="#999" strokeWidth="0.5" strokeDasharray="3,3" />
      <polygon points={areaStr} fill="url(#detailGrad)" />
      <polyline
        points={polyStr}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="3" fill={color} />
    </svg>
  );
}
