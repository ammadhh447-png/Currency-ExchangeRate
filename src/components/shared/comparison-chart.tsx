"use client";

import { useMemo } from "react";
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ReferenceLine,
} from "recharts";
import { formatDateLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export interface ComparisonSeries {
  code: string;
  color: string;
}

export type ComparisonRow = Record<string, number | string | null>;

interface ComparisonChartProps {
  data: ComparisonRow[];
  series: ComparisonSeries[];
  className?: string;
  height?: number;
}

interface TooltipEntry {
  dataKey: string;
  value: number | null;
  color: string;
}

function lastValue(data: ComparisonRow[], code: string): number | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const v = data[i][code];
    if (typeof v === "number") return v;
  }
  return null;
}

function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getPercentDomain(data: ComparisonRow[], series: ComparisonSeries[]): [number, number] {
  const values: number[] = [];
  for (const row of data) {
    for (const { code } of series) {
      const v = row[code];
      if (typeof v === "number") values.push(v);
    }
  }
  if (values.length === 0) return [-1, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    const pad = Math.max(Math.abs(min) * 0.1, 0.5);
    return [min - pad, max + pad];
  }
  const pad = (max - min) * 0.12;
  return [min - pad, max + pad];
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        {typeof label === "string" ? formatDateLabel(label) : label}
      </p>
      <div className="space-y-1">
        {payload
          .filter((e) => typeof e.value === "number")
          .map((entry) => (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between gap-6 text-xs"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="font-medium text-foreground">
                  {entry.dataKey}
                </span>
              </span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  (entry.value ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {formatSignedPercent(entry.value ?? 0)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export function ComparisonChart({
  data,
  series,
  className,
  height = 320,
}: ComparisonChartProps) {
  const yDomain = useMemo(() => getPercentDomain(data, series), [data, series]);

  if (data.length === 0 || series.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        No chart data available
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((s) => {
          const total = lastValue(data, s.code) ?? 0;
          return (
            <div key={s.code} className="flex items-center gap-2">
              <span
                className="h-1 w-4 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-sm font-semibold">{s.code}</span>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  total >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {formatSignedPercent(total)}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) =>
                typeof v === "string" ? formatDateLabel(v) : String(v)
              }
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={52}
              domain={yDomain}
              tickFormatter={(v) =>
                `${v > 0 ? "+" : ""}${Number(v).toFixed(0)}%`
              }
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "3 3" }}
            />
            {series.map((s) => (
              <Line
                key={s.code}
                type="monotone"
                dataKey={s.code}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: s.color }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
