"use client";

import { CurrencyFlag } from "@/components/shared/currency-flag";
import { Button } from "@/components/ui/button";
import { formatRate, formatRelativeTime } from "@/lib/utils/format";
import type { ConversionRecord } from "@/lib/types/exchange";
import { ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversionHistoryTableProps {
  items: ConversionRecord[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  allFilteredSelected: boolean;
  someSelected: boolean;
  onDelete: (id: string) => void;
}

export function ConversionHistoryTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  allFilteredSelected,
  someSelected,
  onDelete,
}: ConversionHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allFilteredSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all"
                className="size-4 cursor-pointer rounded border-input accent-blue-600"
              />
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Conversion
            </th>
            <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
              Rate
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Result
            </th>
            <th className="w-14 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {items.map((item) => {
            const selected = selectedIds.has(item.id);
            return (
              <tr
                key={item.id}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  selected && "bg-blue-500/[0.04]"
                )}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(item.id)}
                    aria-label={`Select ${item.amount} ${item.from} to ${item.to}`}
                    className="size-4 cursor-pointer rounded border-input accent-blue-600"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <CurrencyFlag code={item.from} size="sm" />
                    <span className="font-medium">
                      {item.amount} {item.from}
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                    <CurrencyFlag code={item.to} size="sm" />
                    <span className="font-medium">{item.to}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </td>
                <td className="hidden px-4 py-4 font-mono text-muted-foreground sm:table-cell">
                  1 {item.from} = {formatRate(item.rate)} {item.to}
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-semibold tabular-nums text-blue-600">
                    {formatRate(item.result, 2)} {item.to}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete conversion"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
