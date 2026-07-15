"use client";

import { CurrencyFlag } from "@/components/shared/currency-flag";
import { formatRate, formatRelativeTime } from "@/lib/utils/format";
import type { ConversionRecord } from "@/lib/types/exchange";
import { ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ConversionHistoryListProps {
  items: ConversionRecord[];
  compact?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ConversionHistoryList({
  items,
  compact = false,
  emptyMessage = "No conversions yet.",
  className,
}: ConversionHistoryListProps) {
  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center py-10 text-center", className)}>
        <History className="size-9 text-muted-foreground/25" />
        <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-border/60", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "flex items-center justify-between gap-3",
            compact ? "py-3.5" : "p-4"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <CurrencyFlag code={item.from} size="sm" />
              <span className="text-sm font-medium">
                {item.amount} {item.from}
              </span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <CurrencyFlag code={item.to} size="sm" />
              <span className="text-sm font-medium">{item.to}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRelativeTime(item.timestamp)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-blue-600">
            {formatRate(item.result, 2)}
          </p>
        </li>
      ))}
    </ul>
  );
}

interface RecentConversionsPanelProps {
  history: ConversionRecord[];
  limit?: number;
}

export function RecentConversionsPanel({
  history,
  limit = 4,
}: RecentConversionsPanelProps) {
  const recent = history.slice(0, limit);

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div>
          <h3 className="text-sm font-semibold">Recent Conversions</h3>
          {history.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {history.length} saved locally
            </p>
          )}
        </div>
        {history.length > 0 && (
          <Link
            href="/history"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="flex-1 px-5 pb-5">
        <ConversionHistoryList
          items={recent}
          compact
          emptyMessage="No conversions yet. Try converting above!"
        />
      </div>
    </div>
  );
}
