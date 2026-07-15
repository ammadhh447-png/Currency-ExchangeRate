import type { RateStats, TimePeriod } from "@/lib/types/exchange";

export function convertAmount(
  amount: number,
  fromRate: number,
  toRate: number,
  baseIsFrom = true
): number {
  if (baseIsFrom) {
    return (amount / fromRate) * toRate;
  }
  return amount * (toRate / fromRate);
}

export function getCrossRate(
  rates: Record<string, number>,
  from: string,
  to: string,
  base = "USD"
): number {
  if (from === to) return 1;
  const fromRate = from === base ? 1 : rates[from];
  const toRate = to === base ? 1 : rates[to];
  if (!fromRate || !toRate) return 0;
  return toRate / fromRate;
}

export function computeStats(
  dataPoints: { date: string; rate: number }[]
): RateStats {
  if (dataPoints.length === 0) {
    return { highest: 0, lowest: 0, average: 0, change: 0, changePercent: 0 };
  }

  const rates = dataPoints.map((d) => d.rate);
  const highest = Math.max(...rates);
  const lowest = Math.min(...rates);
  const average = rates.reduce((a, b) => a + b, 0) / rates.length;
  const first = rates[0];
  const last = rates[rates.length - 1];
  const change = last - first;
  const changePercent = first !== 0 ? (change / first) * 100 : 0;

  return { highest, lowest, average, change, changePercent };
}

export function getPeriodDays(period: TimePeriod): number {
  switch (period) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
  }
}

export function generateSparkline(
  currentRate: number,
  changePercent: number,
  points = 12
): number[] {
  const startRate = currentRate / (1 + changePercent / 100);
  const step = (currentRate - startRate) / (points - 1);
  return Array.from({ length: points }, (_, i) => {
    const base = startRate + step * i;
    const noise = base * (Math.sin(i * 1.7) * 0.003);
    return base + noise;
  });
}

export function seededChange(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 200) - 100) / 100;
}
