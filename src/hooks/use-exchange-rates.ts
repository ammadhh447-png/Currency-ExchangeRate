"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExchangeRatesResponse, TimePeriod, HistoricalRatesResponse } from "@/lib/types/exchange";
import { getCrossRate, seededChange, generateSparkline } from "@/lib/utils/currency";
import type { CurrencyRate } from "@/lib/types/exchange";

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
    refetchInterval: live ? 30_000 : false,
    refetchOnWindowFocus: live,
    refetchIntervalInBackground: false,
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

  const currencyRates: CurrencyRate[] = query.data
    ? Object.entries(query.data.rates).map(([code, rate]) => {
        const change24h = seededChange(code);
        return {
          code,
          rate,
          change24h,
          sparkline: generateSparkline(rate, change24h),
        };
      })
    : [];

  return { ...query, currencyRates };
}

export function useConversionRate(from: string, to: string, base = "USD") {
  const { data, ...rest } = useLatestRates(base);

  const rate = data ? getCrossRate(data.rates, from, to, base) : 0;

  return { rate, data, ...rest };
}
