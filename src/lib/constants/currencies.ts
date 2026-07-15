import type { CurrencyMeta } from "@/lib/types/exchange";

export const BASE_CURRENCY = "USD";

export const POPULAR_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "PKR",
  "INR",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
] as const;

export const POPULAR_PAIRS = [
  { from: "USD", to: "PKR" },
  { from: "EUR", to: "USD" },
  { from: "GBP", to: "USD" },
  { from: "USD", to: "INR" },
] as const;

export const CURRENCY_METADATA: Record<string, CurrencyMeta> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    countries: ["United States", "Ecuador", "El Salvador"],
    description:
      "The US Dollar is the world's primary reserve currency and the most traded currency in global forex markets.",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    countries: ["Germany", "France", "Italy", "Spain", "Netherlands"],
    description:
      "The Euro is the official currency of the Eurozone, used by 20 European Union member states.",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    countries: ["United Kingdom"],
    description:
      "The British Pound Sterling is one of the oldest currencies still in use and a major global reserve currency.",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    countries: ["Japan"],
    description:
      "The Japanese Yen is the third most traded currency and a key safe-haven asset in global markets.",
  },
  PKR: {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨",
    flag: "🇵🇰",
    countries: ["Pakistan"],
    description:
      "The Pakistani Rupee is the official currency of Pakistan, managed by the State Bank of Pakistan.",
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    countries: ["India", "Bhutan"],
    description:
      "The Indian Rupee is the official currency of India, one of the fastest-growing major economies.",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    countries: ["Australia", "Kiribati", "Nauru"],
    description:
      "The Australian Dollar is a commodity-linked currency widely traded in the Asia-Pacific region.",
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    countries: ["Canada"],
    description:
      "The Canadian Dollar is closely tied to commodity exports, especially oil and natural resources.",
  },
  CHF: {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr",
    flag: "🇨🇭",
    countries: ["Switzerland", "Liechtenstein"],
    description:
      "The Swiss Franc is considered a safe-haven currency due to Switzerland's political and economic stability.",
  },
  CNY: {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    countries: ["China"],
    description:
      "The Chinese Yuan is the official currency of China and increasingly important in international trade.",
  },
  AED: {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    flag: "🇦🇪",
    countries: ["United Arab Emirates"],
    description: "The UAE Dirham is pegged to the US Dollar and widely used in Gulf trade.",
  },
  SAR: {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
    flag: "🇸🇦",
    countries: ["Saudi Arabia"],
    description: "The Saudi Riyal is pegged to the US Dollar and backed by oil-export revenues.",
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    countries: ["Singapore"],
    description: "The Singapore Dollar is a stable currency from one of Asia's leading financial hubs.",
  },
  KRW: {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    countries: ["South Korea"],
    description: "The South Korean Won reflects one of the world's most dynamic export-driven economies.",
  },
  BRL: {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    countries: ["Brazil"],
    description: "The Brazilian Real is Latin America's most traded currency.",
  },
  MXN: {
    code: "MXN",
    name: "Mexican Peso",
    symbol: "$",
    flag: "🇲🇽",
    countries: ["Mexico"],
    description: "The Mexican Peso is among the most liquid emerging-market currencies.",
  },
  NZD: {
    code: "NZD",
    name: "New Zealand Dollar",
    symbol: "NZ$",
    flag: "🇳🇿",
    countries: ["New Zealand"],
    description: "The New Zealand Dollar is a commodity currency popular among forex traders.",
  },
  SEK: {
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
    flag: "🇸🇪",
    countries: ["Sweden"],
    description: "The Swedish Krona is managed by Sveriges Riksbank, the world's oldest central bank.",
  },
  NOK: {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    flag: "🇳🇴",
    countries: ["Norway"],
    description: "The Norwegian Krone is influenced by oil prices and North Sea production.",
  },
  TRY: {
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
    flag: "🇹🇷",
    countries: ["Turkey"],
    description: "The Turkish Lira is the currency of Turkey, bridging Europe and the Middle East.",
  },
  ZAR: {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    flag: "🇿🇦",
    countries: ["South Africa"],
    description: "The South African Rand is the most traded African currency.",
  },
  HKD: {
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
    flag: "🇭🇰",
    countries: ["Hong Kong"],
    description: "The Hong Kong Dollar is pegged to the US Dollar within a defined trading band.",
  },
  THB: {
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
    flag: "🇹🇭",
    countries: ["Thailand"],
    description: "The Thai Baht is Southeast Asia's second most traded currency after the Singapore Dollar.",
  },
  PLN: {
    code: "PLN",
    name: "Polish Zloty",
    symbol: "zł",
    flag: "🇵🇱",
    countries: ["Poland"],
    description: "The Polish Zloty is Central Europe's most actively traded currency.",
  },
  RUB: {
    code: "RUB",
    name: "Russian Ruble",
    symbol: "₽",
    flag: "🇷🇺",
    countries: ["Russia"],
    description: "The Russian Ruble is influenced by energy exports and geopolitical factors.",
  },
};

export function getCurrencyMeta(code: string): CurrencyMeta {
  return (
    CURRENCY_METADATA[code] ?? {
      code,
      name: code,
      symbol: code,
      flag: "🏳️",
      countries: [],
      description: `${code} is an international currency used in global forex markets.`,
    }
  );
}

export const LEARN_TOPICS = [
  {
    id: "exchange-rate",
    title: "What is an Exchange Rate?",
    icon: "HelpCircle",
    summary: "The price of one currency expressed in terms of another.",
    content:
      "An exchange rate is the price of one currency expressed in terms of another. For example, if 1 USD equals 0.92 EUR, the USD/EUR exchange rate is 0.92. Exchange rates fluctuate constantly based on supply and demand in the global forex market.",
  },
  {
    id: "why-rates-change",
    title: "Why Do Rates Change?",
    icon: "TrendingUp",
    summary: "Key economic and political factors that move currency values.",
    content:
      "Exchange rates change due to interest rate differences, inflation, economic growth, political stability, trade balances, and market sentiment. Central bank policies and geopolitical events can cause rapid movements in currency values.",
  },
  {
    id: "currency-codes",
    title: "Currency Codes (ISO 4217)",
    icon: "Hash",
    summary: "Standardized three-letter codes used worldwide.",
    content:
      "Every currency has a three-letter ISO code: USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen). These standardized codes are used globally in banking, trading, and international transactions.",
  },
  {
    id: "floating-vs-fixed",
    title: "Floating vs Fixed Rates",
    icon: "Scale",
    summary: "How governments and markets determine currency values.",
    content:
      "Floating exchange rates are determined by market forces and fluctuate freely. Fixed (or pegged) rates are set by governments and maintained within a narrow band. Most major currencies float, while some Gulf states peg to the US Dollar.",
  },
  {
    id: "forex-basics",
    title: "Forex Market Basics",
    icon: "Globe",
    summary: "An overview of the world's largest financial market.",
    content:
      "The foreign exchange (forex) market is the largest financial market globally, with over $7 trillion traded daily. It operates 24/5 across major financial centers: London, New York, Tokyo, and Sydney.",
  },
] as const;
