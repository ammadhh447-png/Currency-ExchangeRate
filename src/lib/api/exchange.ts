import type {
  ExchangeRatesResponse,
  HistoricalRatesResponse,
  TimePeriod,
} from "@/lib/types/exchange";
import { getPeriodDays } from "@/lib/utils/currency";
import { format, subDays } from "date-fns";

const ER_API = "https://open.er-api.com/v6";
const FRANKFURTER_API = "https://api.frankfurter.app";
const FAWAZ_API = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";

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
  const fetchOptions = options?.noCache
    ? { cache: "no-store" as RequestCache }
    : { next: { revalidate: 3600 } };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${ER_API}/latest/${base}`, fetchOptions);
      if (!res.ok) throw new Error("Failed to fetch exchange rates");

      const data = (await res.json()) as ExchangeRatesResponse;
      if (data.result === "success" && data.rates) {
        return data;
      }
      throw new Error("Invalid exchange rates response");
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Unknown error");
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
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
