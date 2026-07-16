import type {
  ExchangeRatesResponse,
  HistoricalRatesResponse,
  RatesMetadataResponse,
  TimePeriod,
} from "@/lib/types/exchange";
import { getPeriodDays } from "@/lib/utils/currency";
import { format, subDays } from "date-fns";

const ER_API = "https://open.er-api.com/v6";
const EXCHANGE_FUN_API = "https://api.exchangerate.fun";
const FRANKFURTER_API = "https://api.frankfurter.app";
const FAWAZ_API = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";

function normalizeRatesResponse(
  base: string,
  rates: Record<string, number>,
  timestamp?: number
): ExchangeRatesResponse {
  const unix = timestamp ?? Math.floor(Date.now() / 1000);
  return {
    result: "success",
    base_code: base,
    time_last_update_unix: unix,
    time_last_update_utc: new Date(unix * 1000).toUTCString(),
    rates: { [base]: 1, ...rates },
  };
}

async function fetchExchangeFunLatest(base: string): Promise<ExchangeRatesResponse> {
  const res = await fetch(`${EXCHANGE_FUN_API}/latest?base=${base}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("exchangerate.fun fetch failed");

  const data = (await res.json()) as {
    base: string;
    timestamp: number;
    rates: Record<string, number>;
  };

  if (!data.rates || Object.keys(data.rates).length === 0) {
    throw new Error("exchangerate.fun returned empty rates");
  }

  return normalizeRatesResponse(data.base ?? base, data.rates, data.timestamp);
}

async function fetchErApiLatest(
  base: string,
  options?: { noCache?: boolean }
): Promise<ExchangeRatesResponse> {
  const fetchOptions = options?.noCache
    ? { cache: "no-store" as RequestCache }
    : { next: { revalidate: 3600 } };

  const res = await fetch(`${ER_API}/latest/${base}`, fetchOptions);
  if (!res.ok) throw new Error("open.er-api fetch failed");

  const data = (await res.json()) as ExchangeRatesResponse;
  if (data.result !== "success" || !data.rates) {
    throw new Error("Invalid open.er-api response");
  }

  return data;
}

function getSampledDates(period: TimePeriod): string[] {
  const days = getPeriodDays(period);
  const end = new Date();
  const step = period === "1y" ? 7 : period === "90d" ? 3 : 1;
  const dates: string[] = [];

  for (let offset = days; offset >= 0; offset -= step) {
    dates.push(format(subDays(end, offset), "yyyy-MM-dd"));
  }

  const today = format(end, "yyyy-MM-dd");
  if (!dates.includes(today)) {
    dates.push(today);
  }

  return dates;
}

async function fetchFrankfurterHistorical(
  from: string,
  to: string,
  period: TimePeriod
): Promise<HistoricalRatesResponse> {
  const days = getPeriodDays(period);
  const end = new Date();
  const start = subDays(end, days);
  const startStr = format(start, "yyyy-MM-dd");
  const endStr = format(end, "yyyy-MM-dd");

  const res = await fetch(
    `${FRANKFURTER_API}/${startStr}..${endStr}?from=${from}&to=${to}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Frankfurter historical fetch failed");
  }

  const data = (await res.json()) as HistoricalRatesResponse;
  if (!data.rates || Object.keys(data.rates).length === 0) {
    throw new Error("Frankfurter returned no historical data");
  }

  return data;
}

async function fetchFawazRateForDate(
  date: string,
  from: string,
  to: string
): Promise<number | null> {
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();

  try {
    const res = await fetch(
      `${FAWAZ_API}@${date}/v1/currencies/${fromLower}.min.json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const rate = data[fromLower]?.[toLower];
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchFawazHistorical(
  from: string,
  to: string,
  period: TimePeriod
): Promise<HistoricalRatesResponse> {
  const dates = getSampledDates(period);
  const rates: Record<string, Record<string, number>> = {};
  const batchSize = 8;

  for (let i = 0; i < dates.length; i += batchSize) {
    const batch = dates.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (date) => ({
        date,
        rate: await fetchFawazRateForDate(date, from, to),
      }))
    );

    for (const { date, rate } of results) {
      if (rate != null) {
        rates[date] = { [to]: rate };
      }
    }
  }

  if (Object.keys(rates).length === 0) {
    throw new Error("No historical data available for this currency pair");
  }

  const sortedDates = Object.keys(rates).sort();

  return {
    amount: 1,
    base: from,
    start_date: sortedDates[0],
    end_date: sortedDates[sortedDates.length - 1],
    rates,
  };
}

export async function fetchLatestRates(
  base = "USD",
  options?: { noCache?: boolean }
): Promise<ExchangeRatesResponse> {
  const sources = [
    () => fetchExchangeFunLatest(base),
    () => fetchErApiLatest(base, options),
  ];

  let lastError: Error | null = null;

  for (const source of sources) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await source();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Unknown error");
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }
  }

  throw lastError ?? new Error("Failed to fetch exchange rates");
}

export async function fetchHistoricalRates(
  from: string,
  to: string,
  period: TimePeriod
): Promise<HistoricalRatesResponse> {
  try {
    return await fetchFrankfurterHistorical(from, to, period);
  } catch {
    return fetchFawazHistorical(from, to, period);
  }
}

function computeVolatilityFromSeries(values: number[]): number {
  if (values.length < 2) return 0.00015;

  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] !== 0) {
      returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
  }

  if (returns.length === 0) return 0.00015;

  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length;

  return Math.max(Math.sqrt(variance), 0.00008);
}

export async function fetchRatesMetadata(base = "USD"): Promise<RatesMetadataResponse> {
  const latest = await fetchLatestRates(base, { noCache: true });
  const codes = Object.keys(latest.rates).filter((code) => code !== base);
  const baseLower = base.toLowerCase();

  const dates = Array.from({ length: 8 }, (_, i) =>
    format(subDays(new Date(), 7 - i), "yyyy-MM-dd")
  );

  const dailySnapshots = await Promise.all(
    dates.map(async (date) => {
      try {
        const res = await fetch(
          `${FAWAZ_API}@${date}/v1/currencies/${baseLower}.min.json`,
          { next: { revalidate: 1800 } }
        );
        if (!res.ok) return null;

        const data = await res.json();
        const ratesObj = data[baseLower] as Record<string, number> | undefined;
        if (!ratesObj) return null;

        const normalized: Record<string, number> = {};
        for (const [code, rate] of Object.entries(ratesObj)) {
          normalized[code.toUpperCase()] = rate;
        }
        return normalized;
      } catch {
        return null;
      }
    })
  );

  const change24h: Record<string, number> = {};
  const sparklines: Record<string, number[]> = {};
  const volatility: Record<string, number> = {};

  for (const code of codes) {
    const current = latest.rates[code];
    if (!current || current <= 0) continue;

    const series: number[] = [];
    for (const snap of dailySnapshots) {
      const value = snap?.[code];
      if (typeof value === "number" && value > 0) {
        series.push(value);
      }
    }

    if (series.length === 0 || series[series.length - 1] !== current) {
      series.push(current);
    }

    sparklines[code] = series.slice(-12);

    const previous =
      series.length >= 2 ? series[series.length - 2] : series[0];
    change24h[code] =
      previous && previous > 0 ? ((current - previous) / previous) * 100 : 0;

    volatility[code] = computeVolatilityFromSeries(series);
  }

  return {
    base,
    change24h,
    sparklines,
    volatility,
    updatedAt: latest.time_last_update_unix * 1000,
  };
}

export async function fetchRatesForDate(
  date: string,
  base = "USD"
): Promise<ExchangeRatesResponse> {
  const res = await fetch(`${FRANKFURTER_API}/${date}?from=${base}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch rates for date");

  const data = await res.json();
  return {
    result: "success",
    base_code: data.base,
    time_last_update_unix: Math.floor(new Date(date).getTime() / 1000),
    time_last_update_utc: date,
    rates: { [base]: 1, ...data.rates },
  };
}
