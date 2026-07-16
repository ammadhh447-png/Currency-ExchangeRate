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
  if (currentRate <= 0) return [];
  const startRate = currentRate / (1 + changePercent / 100);
  const step = (currentRate - startRate) / (points - 1);
  return Array.from({ length: points }, (_, i) => {
    const base = startRate + step * i;
    const noise = base * (Math.sin(i * 1.7) * 0.003);
    return base + noise;
  });
}

export function normalizeSparkline(data: number[], minPoints = 2): number[] {
  const valid = data.filter(
    (v) => typeof v === "number" && Number.isFinite(v) && v > 0
  );
  if (valid.length === 0) return [];
  if (valid.length >= minPoints) return valid;
  const last = valid[valid.length - 1];
  return Array.from({ length: minPoints }, () => last);
}

export function buildCrossSparkline(
  fromSeries: number[],
  toSeries: number[],
  from: string,
  to: string,
  base = "USD",
  liveRate?: number
): number[] {
  const len = Math.max(fromSeries.length, toSeries.length, 1);
  const result: number[] = [];

  for (let i = 0; i < len; i++) {
    const fromRate =
      from === base
        ? 1
        : (fromSeries[i] ??
          fromSeries[fromSeries.length - 1] ??
          fromSeries[0] ??
          0);
    const toRate =
      to === base
        ? 1
        : (toSeries[i] ?? toSeries[toSeries.length - 1] ?? toSeries[0] ?? 0);

    if (fromRate > 0 && toRate > 0) {
      result.push(toRate / fromRate);
    }
  }

  if (liveRate != null && liveRate > 0) {
    if (result.length === 0) result.push(liveRate);
    else result[result.length - 1] = liveRate;
  }

  return normalizeSparkline(result);
}

export function sparklineChangePercent(series: number[]): number {
  if (series.length < 2) return 0;
  const previous = series[series.length - 2];
  const current = series[series.length - 1];
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
}

export function seededChange(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 200) - 100) / 100;
}
