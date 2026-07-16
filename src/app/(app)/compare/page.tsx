"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { AppHeader } from "@/components/layout/app-header";
import {
  ComparisonChart,
  type ComparisonRow,
  type ComparisonSeries,
} from "@/components/shared/comparison-chart";
import { CurrencySelect } from "@/components/shared/currency-select";
import { LiveRateValue } from "@/components/shared/live-rate-value";
import { ChangeBadge } from "@/components/shared/change-badge";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCurrencyRates, useHistoricalRates } from "@/hooks/use-exchange-rates";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { formatRate } from "@/lib/utils/format";
import type { HistoricalRatesResponse, TimePeriod } from "@/lib/types/exchange";
import { useState } from "react";

const SERIES_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

function extractPoints(
  histData: HistoricalRatesResponse | undefined,
  code: string
): { date: string; rate: number }[] {
  if (!histData?.rates || code === "USD") return [];
  return Object.entries(histData.rates)
    .map(([date, rates]) => ({ date, rate: rates[code] ?? 0 }))
    .filter((p) => p.rate > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function ComparePage() {
  const [currencies, setCurrencies] = useState(["USD", "EUR", "GBP"]);
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const { currencyRates } = useCurrencyRates("USD", true);

  const q0 = useHistoricalRates(
    "USD",
    currencies[0] === "USD" ? "EUR" : currencies[0],
    period
  );
  const q1 = useHistoricalRates(
    "USD",
    currencies[1] === "USD" ? "EUR" : currencies[1],
    period
  );
  const q2 = useHistoricalRates(
    "USD",
    currencies[2] === "USD" ? "EUR" : currencies[2],
    period
  );
  const queries = [q0, q1, q2];

  const compared = useMemo(() => {
    return currencies.map((code) => {
      const cr = currencyRates.find((c) => c.code === code);
      return {
        code,
        meta: getCurrencyMeta(code),
        rate: cr?.displayRate ?? (code === "USD" ? 1 : 0),
        change24h: cr?.change24h ?? 0,
        tickDirection: cr?.tickDirection ?? "flat",
      };
    });
  }, [currencies, currencyRates]);

  const series = useMemo<ComparisonSeries[]>(() => {
    const seen = new Set<string>();
    const result: ComparisonSeries[] = [];
    currencies.forEach((code, i) => {
      if (!seen.has(code)) {
        seen.add(code);
        result.push({ code, color: SERIES_COLORS[i % SERIES_COLORS.length] });
      }
    });
    return result;
  }, [currencies]);

  const chartData = useMemo<ComparisonRow[]>(() => {
    const rebased = new Map<string, Map<string, number>>();
    const dateSet = new Set<string>();
    const today = format(new Date(), "yyyy-MM-dd");

    currencies.forEach((code, i) => {
      if (code === "USD") return;
      const points = extractPoints(queries[i].data, code);
      if (points.length === 0) return;

      const liveRate = currencyRates.find((c) => c.code === code)?.displayRate;
      const enriched =
        liveRate && liveRate > 0
          ? (() => {
              const copy = [...points];
              const last = copy[copy.length - 1];
              if (last.date === today) {
                copy[copy.length - 1] = { date: today, rate: liveRate };
              } else {
                copy.push({ date: today, rate: liveRate });
              }
              return copy;
            })()
          : points;

      const base = enriched[0].rate;
      const perDate = new Map<string, number>();
      for (const p of enriched) {
        perDate.set(p.date, (p.rate / base - 1) * 100);
        dateSet.add(p.date);
      }
      rebased.set(code, perDate);
    });

    const dates = Array.from(dateSet).sort();

    return dates.map((date) => {
      const row: ComparisonRow = { date };
      for (const { code } of series) {
        if (code === "USD") {
          row[code] = 0;
        } else {
          const perDate = rebased.get(code);
          row[code] = perDate?.has(date) ? (perDate.get(date) as number) : null;
        }
      }
      return row;
    });
  }, [currencies, series, currencyRates, q0.data, q1.data, q2.data]);

  const isLoading = queries.some((q) => q.isLoading);

  const updateCurrency = (index: number, code: string) => {
    setCurrencies((prev) => {
      const next = [...prev];
      next[index] = code;
      return next;
    });
  };

  return (
    <>
      <AppHeader
        title="Compare Currencies"
        subtitle="Side-by-side rate comparison and trends"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {currencies.map((code, i) => (
            <CurrencySelect
              key={i}
              value={code}
              onValueChange={(v) => updateCurrency(i, v)}
              className="w-44"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {compared.map((c, i) => (
            <Card key={`${c.code}-${i}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                  />
                  <CurrencyFlag code={c.code} />
                  {c.code}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{c.meta.name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">1 USD equals</p>
                  <p className="text-2xl font-bold">
                    <LiveRateValue
                      value={c.rate}
                      direction={c.tickDirection}
                    />{" "}
                    {c.code}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">24h change</span>
                  <ChangeBadge value={c.change24h} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-base">
                  Performance Comparison
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Percentage change of each currency vs USD over the selected
                  period. All lines start at 0% — higher means it strengthened
                  against the US Dollar.
                </p>
              </div>
              <ToggleGroup
                value={[period]}
                onValueChange={(v) => v[0] && setPeriod(v[0] as TimePeriod)}
                variant="outline"
                className="shrink-0"
              >
                {PERIODS.map((p) => (
                  <ToggleGroupItem key={p.value} value={p.value}>
                    {p.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Loading comparison…
              </div>
            ) : (
              <ComparisonChart data={chartData} series={series} height={300} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
