"use client";

import { cn } from "@/lib/utils";
import { formatRate } from "@/lib/utils/format";
import type { TickDirection } from "@/lib/types/exchange";
import { useEffect, useRef } from "react";

interface LiveRateValueProps {
  value: number;
  direction?: TickDirection;
  className?: string;
  decimals?: number;
}

export function LiveRateValue({
  value,
  direction = "flat",
  className,
  decimals,
}: LiveRateValueProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || direction === "flat") return;

    ref.current.classList.remove("live-rate-flash-up", "live-rate-flash-down");
    void ref.current.offsetWidth;
    ref.current.classList.add(
      direction === "up" ? "live-rate-flash-up" : "live-rate-flash-down"
    );
  }, [value, direction]);

  return (
    <span
      ref={ref}
      className={cn(
        "font-mono tabular-nums transition-colors duration-300",
        direction === "up" && "text-emerald-600 dark:text-emerald-400",
        direction === "down" && "text-red-600 dark:text-red-400",
        className
      )}
    >
      {formatRate(value, decimals)}
    </span>
  );
}
