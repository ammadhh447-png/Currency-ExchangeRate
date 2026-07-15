export interface ExchangeRatesResponse {
  result: string;
  base_code: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface CurrencyMeta {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  countries: string[];
  description: string;
}

export interface ConversionRecord {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export type TimePeriod = "7d" | "30d" | "90d" | "1y";

export interface RateStats {
  highest: number;
  lowest: number;
  average: number;
  change: number;
  changePercent: number;
}

export interface CurrencyRate {
  code: string;
  rate: number;
  change24h: number;
  sparkline: number[];
}
