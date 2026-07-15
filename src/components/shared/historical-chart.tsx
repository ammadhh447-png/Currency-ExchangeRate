"use client";

import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import { formatDateLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface HistoricalChartProps {
  data: { date: string; rate: number }[];
  className?: string;
  height?: number;
}

export function HistoricalChart({
  data,
  className,
  height = 320,
}: HistoricalChartProps) {
  if (data.length === 0) {
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
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            width={60}
            tickFormatter={(v) => v.toFixed(4)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
            labelFormatter={(label) =>
              typeof label === "string" ? formatDateLabel(label) : String(label)
            }
            formatter={(value) => [
              typeof value === "number" ? value.toFixed(4) : String(value),
              "Rate",
            ]}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
