"use client";

import { AppHeader } from "@/components/layout/app-header";
import { HistoricalChart } from "@/components/shared/historical-chart";
import { ChangeBadge } from "@/components/shared/change-badge";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { ErrorState } from "@/components/shared/error-state";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrencyRates, useHistoricalRates } from "@/hooks/use-exchange-rates";
import { useFavorites } from "@/hooks/use-favorites";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { formatRate } from "@/lib/utils/format";
import { Star } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function CurrencyDetailsPage() {
  const params = useParams();
  const code = (params.code as string)?.toUpperCase() ?? "USD";
  const { currencyRates, isLoading, isError, refetch } = useCurrencyRates();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { data: histData, isLoading: histLoading } = useHistoricalRates(
    "USD",
    code === "USD" ? "EUR" : code,
    "30d"
  );

  const meta = getCurrencyMeta(code);
  const rateInfo = currencyRates.find((c) => c.code === code);
  const rate = code === "USD" ? 1 : rateInfo?.rate ?? 0;
  const change = rateInfo?.change24h ?? 0;

  const chartData = useMemo(() => {
    if (!histData?.rates) return [];
    const target = code === "USD" ? "EUR" : code;
    return Object.entries(histData.rates)
      .map(([date, rates]) => ({
        date,
        rate: rates[target] ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [histData, code]);

  const facts = [
    { label: "Currency Code", value: meta.code },
    { label: "Symbol", value: meta.symbol },
    { label: "Base Currency", value: "USD" },
    {
      label: "Used In",
      value: meta.countries.length ? meta.countries.join(", ") : "Global",
    },
  ];

  if (isLoading) {
    return (
      <>
        <AppHeader title="Currency Details" />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <PageSkeleton />
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <AppHeader title="Currency Details" />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <ErrorState onRetry={() => refetch()} />
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Currency Details" subtitle={`${meta.name} (${code})`} />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CurrencyFlag code={code} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">
                {code} — {meta.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <ChangeBadge value={change} />
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              toggleFavorite(code);
              toast.success(
                isFavorite(code)
                  ? `Removed ${code} from favorites`
                  : `Added ${code} to favorites`
              );
            }}
          >
            <Star
              className={`size-4 ${isFavorite(code) ? "fill-amber-400 text-amber-400" : ""}`}
            />
            {isFavorite(code) ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>

        <p className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
          {formatRate(rate)}{" "}
          <span className="text-lg font-normal text-muted-foreground">USD</span>
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Quick Facts</h3>
              <dl className="space-y-3">
                {facts.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between border-b pb-3 last:border-0"
                  >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {meta.description}
              </p>
              <Link
                href="/converter"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Convert {code} →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">30-Day Performance</h3>
              {histLoading ? (
                <PageSkeleton />
              ) : (
                <HistoricalChart data={chartData} height={260} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
