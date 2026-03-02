import { useMemo } from 'react';

export default function MiniChart({ seed = 'default', isPositive = true }) {
  const pathD = useMemo(() => {
    // 基于 seed 生成确定性的伪随机曲线
    let hash = 0;
    const s = String(seed) + '_sparkline';
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash = hash & hash;
    }

    const numPoints = 30;
    const w = 130;
    const h = 40;
    const pad = 3;
    const pts = [];
    let val = 50;

    for (let i = 0; i < numPoints; i++) {
      hash = Math.abs((hash * 16807 + 12345) % 2147483647);
      const noise = ((hash % 1000) / 1000 - 0.45) * 8;
      const trend = isPositive ? 0.6 : -0.3;
      val += noise + trend;
      val = Math.max(5, Math.min(95, val));
      pts.push(val);
    }

    const minV = Math.min(...pts);
    const maxV = Math.max(...pts);
    const range = maxV - minV || 1;

    return pts.map((v, i) => {
      const x = (i / (numPoints - 1)) * w;
      const y = pad + ((maxV - v) / range) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [seed, isPositive]);

  const color = isPositive ? '#E74C3C' : '#27AE60';

  return (
    <svg width="130" height="40" viewBox="0 0 130 40" className="block flex-shrink-0">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
