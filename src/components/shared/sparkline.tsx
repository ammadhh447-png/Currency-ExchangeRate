"use client";

import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  positive?: boolean;
  className?: string;
  height?: number;
}

export function Sparkline({
  data,
  positive = true,
  className,
  height = 32,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
