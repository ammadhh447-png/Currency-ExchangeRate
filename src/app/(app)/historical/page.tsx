"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { AppHeader } from "@/components/layout/app-header";
import { HistoricalChart } from "@/components/shared/historical-chart";
import { CurrencySelect } from "@/components/shared/currency-select";
import { ErrorState } from "@/components/shared/error-state";
import { LiveRatesIndicator } from "@/components/shared/live-rates-indicator";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useConversionRate, useHistoricalRates } from "@/hooks/use-exchange-rates";
import { computeStats } from "@/lib/utils/currency";
import { formatPercent, formatRate } from "@/lib/utils/format";
import type { TimePeriod } from "@/lib/types/exchange";
import { useState } from "react";
import { TrendingDown, TrendingUp, Minus, BarChart3 } from "lucide-react";

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

export default function HistoricalPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [period, setPeriod] = useState<TimePeriod>("30d");

  const { data, isLoading, isError, refetch, isFetching } = useHistoricalRates(
    from,
    to,
    period
  );
  const { rate: liveRate, refetch: refetchLive } = useConversionRate(from, to);

  const chartData = useMemo(() => {
    if (!data?.rates) return [];
    const points = Object.entries(data.rates)
      .map(([date, rates]) => ({
        date,
        rate: rates[to] ?? 0,
      }))
      .filter((p) => p.rate > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (liveRate > 0 && points.length > 0) {
      const today = format(new Date(), "yyyy-MM-dd");
      const last = points[points.length - 1];
      if (last.date === today) {
        points[points.length - 1] = { date: today, rate: liveRate };
      } else {
        points.push({ date: today, rate: liveRate });
      }
    }

    return points;
  }, [data, to, liveRate]);

  const stats = useMemo(() => computeStats(chartData), [chartData]);

  return (
    <>
      <AppHeader
        title="Historical Trends"
        subtitle="Analyze currency performance over time"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <CurrencySelect value={from} onValueChange={setFrom} exclude={to} />
            <span className="text-muted-foreground">to</span>
            <CurrencySelect value={to} onValueChange={setTo} exclude={from} />
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <LiveRatesIndicator
              isFetching={isFetching}
              onRefresh={() => {
                refetch();
                refetchLive();
              }}
            />
            <ToggleGroup
              value={[period]}
              onValueChange={(v) => v[0] && setPeriod(v[0] as TimePeriod)}
              variant="outline"
            >
              {PERIODS.map((p) => (
                <ToggleGroupItem key={p.value} value={p.value}>
                  {p.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        {isLoading && <PageSkeleton />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={TrendingUp}
                label="Highest Rate"
                value={formatRate(stats.highest)}
                color="text-emerald-600"
              />
              <StatCard
                icon={TrendingDown}
                label="Lowest Rate"
                value={formatRate(stats.lowest)}
                color="text-red-600"
              />
              <StatCard
                icon={Minus}
                label="Average Rate"
                value={formatRate(stats.average)}
                color="text-blue-600"
              />
              <StatCard
                icon={BarChart3}
                label={`Change (${period.toUpperCase()})`}
                value={formatPercent(stats.changePercent)}
                color={
                  stats.changePercent >= 0 ? "text-emerald-600" : "text-red-600"
                }
              />
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <HistoricalChart data={chartData} height={360} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-lg bg-muted p-2 ${color}`}>
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
