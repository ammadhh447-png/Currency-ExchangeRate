# ExchangeHub

Professional currency exchange platform with live rates, conversion tools, historical charts, and educational content. Built for clarity on desktop and mobile.

## Features

| Module | Description |
|--------|-------------|
| Dashboard | Live overview, popular pairs, quick convert, gainers & losers |
| Converter | Real-time conversion with swap, copy, and share |
| Live Rates | Searchable table for 170+ currencies with auto-refresh |
| Historical | Interactive trend charts (7D / 30D / 90D / 1Y) |
| Compare | Side-by-side performance comparison vs USD |
| Details | Currency facts, charts, and favorites |
| History | Local conversion history with filters |
| Favorites | Saved currencies for quick access |
| Learn | Guides and FAQ on forex basics |
| About | Product overview |

## Tech Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **UI:** Tailwind CSS v4 · shadcn/ui · Lucide icons
- **Data:** TanStack Query · Recharts
- **Theme:** next-themes (light / dark)
- **UX:** Framer Motion · Sonner toasts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Deployment:
FOR LIVE DEMO YOU CAN CLICK TO THE LINK 
https://currency-exchange-rate-indol.vercel.app/ 

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root providers
│   ├── (app)/                # Authenticated-style app shell
│   │   ├── layout.tsx        # Top navbar + page outlet
│   │   └── [modules]/        # dashboard, converter, rates, …
│   └── api/rates/            # Server proxies for exchange APIs
├── components/
│   ├── layout/               # Navbar, header, theme toggle
│   ├── shared/               # Charts, flags, search, pagination
│   ├── converter/            # Converter UI
│   ├── history/              # History table
│   ├── learn/                # FAQ
│   └── ui/                   # Design-system primitives
├── hooks/                    # Rates, favorites, history, pagination
├── lib/
│   ├── api/                  # External API clients + fallbacks
│   ├── constants/            # Currencies, flags, FAQs
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Formatting & rate helpers
└── providers/                # Theme + React Query
```

**Data flow:** Client hooks → `/api/rates/*` route handlers → external providers (with fallbacks). Favorites and conversion history persist in `localStorage`.

## API Sources

| Purpose | Provider | Update frequency |
|---------|----------|------------------|
| Live rates (primary) | [exchangerate.fun](https://api.exchangerate.fun) | Hourly |
| Live rates (fallback) | [open.er-api.com](https://open.er-api.com) | Daily |
| Historical (primary) | [Frankfurter](https://www.frankfurter.app) | Daily |
| Historical (fallback) | [@fawazahmed0/currency-api](https://github.com/fawazahmed0/currency-api) | Daily |

Live pages poll every **5 seconds**. Rates tick every **1 second** with volatility-based movement anchored to the latest API values. 24h change and sparklines use real historical snapshots.

## Responsive Design

- Mobile-first layouts with adaptive grids and navigation
- Compact top navbar with mobile menu; desktop horizontal nav
- Touch-friendly controls and safe-area padding on notched devices

## License

Private project — all rights reserved.
