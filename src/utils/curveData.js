// Deterministic curve data generator (seeded pseudo-random)
export function generateCurveData(seed, isPositive, points = 30) {
  let hash = 0;
  const s = String(seed) + '_curve';
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash = hash & hash;
  }

  const data = [100];
  for (let i = 1; i < points; i++) {
    hash = Math.abs((hash * 16807 + 12345) % 2147483647);
    const random = (hash % 1000) / 1000;
    const change = (random - (isPositive ? 0.35 : 0.6)) * 3;
    data.push(Math.max(50, data[i - 1] + change));
  }
  return data;
}
