"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ExchangeRatesResponse,
  HistoricalRatesResponse,
  RatesMetadataResponse,
  CurrencyRate,
  TimePeriod,
  TickDirection,
} from "@/lib/types/exchange";
import {
  getCrossRate,
  generateSparkline,
  normalizeSparkline,
} from "@/lib/utils/currency";
import { useLiveRateEngine } from "@/hooks/use-live-rates-engine";

export function useLatestRates(base = "USD", live = false) {
  return useQuery<ExchangeRatesResponse>({
    queryKey: ["rates", "latest", base],
    queryFn: async () => {
      const res = await fetch(`/api/rates/latest?base=${base}`, {
        cache: "no-store",
        headers: live ? { "Cache-Control": "no-cache" } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch rates");
      return res.json();
    },
    staleTime: live ? 0 : 60_000,
    refetchInterval: live ? 5_000 : false,
    refetchOnWindowFocus: live,
    refetchIntervalInBackground: live,
  });
}

export function useRatesMetadata(base = "USD", live = false) {
  return useQuery<RatesMetadataResponse>({
    queryKey: ["rates", "metadata", base],
    queryFn: async () => {
      const res = await fetch(`/api/rates/metadata?base=${base}`, {
        cache: "no-store",
        headers: live ? { "Cache-Control": "no-cache" } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch rates metadata");
      return res.json();
    },
    staleTime: live ? 0 : 300_000,
    refetchInterval: live ? 60_000 : false,
    refetchOnWindowFocus: live,
    refetchIntervalInBackground: live,
  });
}

export function useHistoricalRates(from: string, to: string, period: TimePeriod) {
  return useQuery<HistoricalRatesResponse>({
    queryKey: ["rates", "historical", from, to, period],
    queryFn: async () => {
      const res = await fetch(
        `/api/rates/historical?from=${from}&to=${to}&period=${period}`
      );
      if (!res.ok) throw new Error("Failed to fetch historical rates");
      return res.json();
    },
    enabled: from !== to,
  });
}

export function useCurrencyRates(base = "USD", live = false) {
  const query = useLatestRates(base, live);
  const metadataQuery = useRatesMetadata(base, live);
  const { displayRates, tickDirections, sessionChanges } = useLiveRateEngine(
    query.data?.rates,
    metadataQuery.data?.volatility,
    live
  );

  const currencyRates: CurrencyRate[] = query.data
    ? Object.entries(query.data.rates).map(([code, rate]) => {
        const change24h = metadataQuery.data?.change24h[code] ?? 0;
        let baseSparkline = metadataQuery.data?.sparklines[code];
        if (!baseSparkline || baseSparkline.length === 0) {
          baseSparkline = generateSparkline(rate, change24h);
        }
        baseSparkline = normalizeSparkline(baseSparkline);

        const display = live ? (displayRates[code] ?? rate) : rate;
        const sparkline = live
          ? normalizeSparkline([...baseSparkline.slice(0, -1), display])
          : baseSparkline;

        return {
          code,
          rate,
          displayRate: display,
          change24h,
          sessionChange: live ? (sessionChanges[code] ?? 0) : 0,
          tickDirection: live ? (tickDirections[code] ?? "flat") : "flat",
          sparkline,
        };
      })
    : [];

  const refetch = () => {
    void query.refetch();
    void metadataQuery.refetch();
  };

  return {
    ...query,
    refetch,
    isFetching: query.isFetching || metadataQuery.isFetching,
    metadata: metadataQuery.data,
    currencyRates,
  };
}

export function useConversionRate(from: string, to: string, base = "USD") {
  const { data, currencyRates, ...rest } = useCurrencyRates(base, true);

  const apiRate = data ? getCrossRate(data.rates, from, to, base) : 0;
  const fromRate = currencyRates.find((c) => c.code === from);
  const toRate = currencyRates.find((c) => c.code === to);

  const rate =
    fromRate && toRate && fromRate.displayRate > 0
      ? getCrossRate(
          {
            ...data!.rates,
            [from]: fromRate.displayRate,
            [to]: toRate.displayRate,
          },
          from,
          to,
          base
        )
      : apiRate;

  const tickDirection: TickDirection =
    fromRate?.tickDirection === "up" || toRate?.tickDirection === "down"
      ? "up"
      : fromRate?.tickDirection === "down" || toRate?.tickDirection === "up"
        ? "down"
        : "flat";

  const change24h =
    from === to
      ? 0
      : toRate && fromRate
        ? toRate.change24h - (from === base ? 0 : fromRate.change24h)
        : 0;

  return { rate, apiRate, change24h, tickDirection, data, ...rest };
}
