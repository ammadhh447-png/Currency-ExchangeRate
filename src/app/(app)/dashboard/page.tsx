"use client";

import { AppHeader } from "@/components/layout/app-header";
import { QuickConverter } from "@/components/converter/quick-converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeBadge } from "@/components/shared/change-badge";
import { Sparkline } from "@/components/shared/sparkline";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { ErrorState } from "@/components/shared/error-state";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { LiveRatesIndicator } from "@/components/shared/live-rates-indicator";
import { SearchInput } from "@/components/shared/search-input";
import { LiveRateValue } from "@/components/shared/live-rate-value";
import { useCurrencyRates } from "@/hooks/use-exchange-rates";
import {
  POPULAR_CURRENCIES,
  POPULAR_PAIRS,
  getCurrencyMeta,
} from "@/lib/constants/currencies";
import type { TickDirection } from "@/lib/types/exchange";
import {
  getCrossRate,
  buildCrossSparkline,
  sparklineChangePercent,
} from "@/lib/utils/currency";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    currencyRates,
  } = useCurrencyRates("USD", true);
  const [search, setSearch] = useState("");

  const pairCards = useMemo(() => {
    if (!data) return [];
    const byCode = new Map(currencyRates.map((c) => [c.code, c]));
    const liveRates = Object.fromEntries(
      currencyRates.map((c) => [c.code, c.displayRate])
    );

    return POPULAR_PAIRS.map(({ from, to }) => {
      const fromInfo = byCode.get(from);
      const toInfo = byCode.get(to);
      const rate = getCrossRate(liveRates, from, to, data.base_code);
      const sparkline = buildCrossSparkline(
        fromInfo?.sparkline ?? (from === data.base_code ? [1] : []),
        toInfo?.sparkline ?? (to === data.base_code ? [1] : []),
        from,
        to,
        data.base_code,
        rate
      );
      const change = sparklineChangePercent(sparkline);
      const tickDirection: TickDirection =
        toInfo?.tickDirection === "up" || fromInfo?.tickDirection === "down"
          ? "up"
          : toInfo?.tickDirection === "down" || fromInfo?.tickDirection === "up"
            ? "down"
            : "flat";

      return { from, to, rate, change, sparkline, tickDirection };
    });
  }, [data, currencyRates]);

  const popular = useMemo(() => {
    return POPULAR_CURRENCIES.map((code) => {
      const cr = currencyRates.find((c) => c.code === code);
      return {
        code,
        meta: getCurrencyMeta(code),
        rate: cr?.displayRate ?? (code === "USD" ? 1 : 0),
        change: cr?.change24h ?? 0,
        tickDirection: cr?.tickDirection ?? "flat",
      };
    }).filter((c) => c.rate > 0);
  }, [currencyRates]);

  const filtered = useMemo(() => {
    if (!search) return popular;
    const q = search.toLowerCase();
    return popular.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.meta.name.toLowerCase().includes(q)
    );
  }, [popular, search]);

  const gainers = [...currencyRates]
    .filter((c) => c.sparkline.length >= 2)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5);
  const losers = [...currencyRates]
    .filter((c) => c.sparkline.length >= 2)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5);

  if (isLoading) {
    return (
      <>
        <AppHeader title="Dashboard" subtitle="Live exchange rate overview" />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <PageSkeleton />
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <AppHeader title="Dashboard" />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <ErrorState onRetry={() => refetch()} />
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Dashboard"
        subtitle="Live exchange rate overview"
      />
      <main className="flex-1 space-y-6 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search currencies..."
            className="max-w-sm flex-1"
          />
          <LiveRatesIndicator
            isFetching={isFetching}
            onRefresh={() => refetch()}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pairCards.map(({ from, to, rate, change, sparkline, tickDirection }) => (
            <Card key={`${from}-${to}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {from}/{to}
                  </p>
                  <ChangeBadge value={change} />
                </div>
                <p className="mt-1 text-2xl font-bold">
                  <LiveRateValue value={rate} direction={tickDirection} />
                </p>
                <Sparkline
                  data={sparkline}
                  positive={change >= 0}
                  className="mt-2"
                  height={36}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <QuickConverter />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Popular Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">24h</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(({ code, meta, rate, change, tickDirection }) => (
                    <TableRow key={code}>
                      <TableCell>
                        <Link
                          href={`/currency/${code}`}
                          className="flex items-center gap-2 hover:text-blue-600"
                        >
                          <CurrencyFlag code={code} size="sm" />
                          <span className="font-medium">{code}</span>
                          <span className="hidden text-muted-foreground sm:inline">
                            {meta.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        <LiveRateValue
                          value={rate}
                          direction={tickDirection}
                          className="justify-end"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <ChangeBadge value={change} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base text-emerald-600">
                Top Gainers
              </CardTitle>
              <Link
                href="/rates"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {gainers.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between gap-4"
                >
                  <Link
                    href={`/currency/${c.code}`}
                    className="flex items-center gap-2 font-medium hover:text-blue-600"
                  >
                    <CurrencyFlag code={c.code} size="sm" />
                    {c.code}
                  </Link>
                  <Sparkline
                    data={c.sparkline}
                    positive
                    className="max-w-24"
                    height={28}
                  />
                  <ChangeBadge value={c.change24h} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base text-red-600">Top Losers</CardTitle>
              <Link
                href="/rates"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {losers.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between gap-4"
                >
                  <Link
                    href={`/currency/${c.code}`}
                    className="flex items-center gap-2 font-medium hover:text-blue-600"
                  >
                    <CurrencyFlag code={c.code} size="sm" />
                    {c.code}
                  </Link>
                  <Sparkline
                    data={c.sparkline}
                    positive={false}
                    className="max-w-24"
                    height={28}
                  />
                  <ChangeBadge value={c.change24h} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
