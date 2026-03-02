import { useMemo } from 'react';

export default function MiniChart({ seed = 'default', isPositive = true }) {
  const pathD = useMemo(() => {
    let hash = 0;
    const s = String(seed) + '_spark';
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash = hash & hash;
    }

    const N = 28;
    const W = 120;
    const H = 36;
    const pts = [];
    let val = 50;

    for (let i = 0; i < N; i++) {
      hash = Math.abs((hash * 16807 + 12345) % 2147483647);
      const noise = ((hash % 1000) / 1000 - 0.45) * 7;
      const trend = isPositive ? 0.55 : -0.3;
      val += noise + trend;
      val = Math.max(8, Math.min(92, val));
      pts.push(val);
    }

    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;

    return pts.map((v, i) => {
      const x = (i / (N - 1)) * W;
      const y = 2 + ((max - v) / range) * (H - 4);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [seed, isPositive]);

  return (
    <svg width="120" height="36" viewBox="0 0 120 36" className="block shrink-0">
      <path
        d={pathD}
        fill="none"
        stroke={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
