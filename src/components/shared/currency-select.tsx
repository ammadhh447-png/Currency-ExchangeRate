"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { useLatestRates } from "@/hooks/use-exchange-rates";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  exclude?: string;
  className?: string;
  instanceId?: string;
  variant?: "default" | "converter";
}

export function CurrencySelect({
  value,
  onValueChange,
  exclude,
  className,
  instanceId,
  variant = "default",
}: CurrencySelectProps) {
  const { data, isLoading } = useLatestRates();

  const currencies = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.rates)
      .concat(data.base_code)
      .filter((c, i, arr) => arr.indexOf(c) === i && c !== exclude)
      .sort((a, b) =>
        getCurrencyMeta(a).name.localeCompare(getCurrencyMeta(b).name)
      );
  }, [data, exclude]);

  if (isLoading) {
    return <Skeleton className="h-10 w-36 rounded-lg" />;
  }

  const isConverter = variant === "converter";

  return (
    <Select
      value={value}
      onValueChange={(v) => v && onValueChange(v)}
      name={instanceId}
    >
      <SelectTrigger
        className={cn(
          "w-full justify-between gap-2 shadow-none",
          isConverter &&
            "h-10 rounded-lg border border-border/80 bg-muted/40 px-3 hover:bg-muted/60",
          className
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <CurrencyFlag code={value} size="sm" />
            <span className="font-semibold">{value}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-72 p-1.5",
          isConverter && "min-w-[min(100vw-2rem,20rem)]"
        )}
        alignItemWithTrigger={false}
        align="start"
        side="bottom"
        sideOffset={6}
      >
        {currencies.map((code) => {
          const m = getCurrencyMeta(code);
          return (
            <SelectItem
              key={`${instanceId ?? "currency"}-${code}`}
              value={code}
              className={cn(
                "cursor-pointer rounded-lg py-2.5 pr-9 pl-2.5",
                "data-highlighted:bg-muted data-highlighted:text-foreground",
                "focus:bg-muted focus:text-foreground"
              )}
            >
              <span className="flex w-full min-w-0 items-center gap-3">
                <CurrencyFlag code={code} size="sm" />
                <span className="w-10 shrink-0 font-semibold">{code}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {m.name}
                </span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
