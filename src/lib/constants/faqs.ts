export interface FaqItem {
  id: string;
  icon: string;
  question: string;
  answer: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "rates-everywhere",
    icon: "Globe",
    question: "Are exchange rates the same everywhere?",
    answer: [
      "No. Banks, airports, and currency exchange counters each add a markup or spread on top of the mid-market rate.",
      "The rate shown on ExchangeHub reflects the mid-market value — useful for fair comparison, but not identical to retail prices.",
      "Always compare the final amount you receive after fees, not just the headline rate.",
    ],
  },
  {
    id: "mid-market",
    icon: "BarChart3",
    question: "What is the mid-market exchange rate?",
    answer: [
      "The mid-market rate is the midpoint between the buy and sell prices in the global interbank market.",
      "It represents the fairest reference rate before any provider adds their margin or commission.",
      "Financial platforms and tools like ExchangeHub use this rate as a benchmark for transparent comparisons.",
    ],
  },
  {
    id: "best-time",
    icon: "Clock",
    question: "When is the best time to convert currency?",
    answer: [
      "There is no single perfect moment — rates move continuously based on economic news and market activity.",
      "Monitoring trends over 7–30 days can help you spot favorable windows rather than converting on impulse.",
      "For large transfers, consider setting a target rate and converting when the market reaches it.",
    ],
  },
  {
    id: "data-updates",
    icon: "RefreshCw",
    question: "How often are rates updated on ExchangeHub?",
    answer: [
      "Rates are fetched from trusted public APIs and refreshed regularly throughout the day.",
      "The Dashboard and Live Rates pages display a last-updated timestamp so you know how current the data is.",
      "For travel or large transactions, always verify the final rate with your bank or provider before committing.",
    ],
  },
  {
    id: "rate-fluctuation",
    icon: "TrendingUp",
    question: "What causes exchange rates to fluctuate daily?",
    answer: [
      "Interest rate decisions, inflation reports, and GDP data from major economies drive daily movements.",
      "Political events, trade balances, and central bank policy announcements can cause sharp short-term shifts.",
      "Market sentiment and global risk appetite also influence demand for safe-haven vs. emerging-market currencies.",
    ],
  },
  {
    id: "stronger-currency",
    icon: "Banknote",
    question: "Does a stronger currency always mean a better deal?",
    answer: [
      "Not necessarily. A stronger home currency means you get more foreign currency per unit — which helps when buying abroad.",
      "Conversely, a weaker home currency benefits exporters and inbound remittances.",
      "Focus on the rate relative to recent history and your specific conversion direction, not absolute strength alone.",
    ],
  },
];
