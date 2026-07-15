import { format, formatDistanceToNow } from "date-fns";

export function formatRate(value: number, decimals = 4): string {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toFixed(decimals);
  return value.toFixed(6);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCurrencyAmount(
  amount: number,
  symbol: string,
  decimals = 2
): string {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatTimestamp(unix: number): string {
  return format(new Date(unix * 1000), "MMM d, yyyy h:mm a");
}

export function formatLiveDateTime(date: Date = new Date()): string {
  return format(date, "MMM d, yyyy · h:mm:ss a");
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function formatDateLabel(dateStr: string): string {
  return format(new Date(dateStr), "MMM d");
}
