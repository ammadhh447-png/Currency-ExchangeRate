"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { normalizeSparkline } from "@/lib/utils/currency";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  positive?: boolean;
  className?: string;
  height?: number;
}

function getDomain(values: number[]): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    const pad = min * 0.002 || 0.001;
    return [min - pad, max + pad];
  }
  const pad = (max - min) * 0.08;
  return [min - pad, max + pad];
}

export function Sparkline({
  data,
  positive = true,
  className,
  height = 32,
}: SparklineProps) {
  const { chartData, domain } = useMemo(() => {
    const values = normalizeSparkline(data);
    return {
      chartData: values.map((value, index) => ({ index, value })),
      domain: values.length ? getDomain(values) : ([0, 1] as [number, number]),
    };
  }, [data]);

  const color = positive ? "#22c55e" : "#ef4444";

  if (chartData.length === 0) {
    return (
      <div
        className={cn("w-full rounded bg-muted/40", className)}
        style={{ height }}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("w-full min-w-[48px]", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <YAxis hide domain={domain} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
