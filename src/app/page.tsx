import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Globe,
  LineChart,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/landing-navbar";

const stats = [
  { value: "170+", label: "Currencies" },
  { value: "Real-time", label: "Exchange Rates" },
  { value: "99.9%", label: "Data Accuracy" },
  { value: "Free", label: "To Use" },
];

const features = [
  {
    icon: LineChart,
    title: "Live Rates",
    description: "Real-time exchange rates updated regularly from trusted APIs.",
  },
  {
    icon: RefreshCw,
    title: "Currency Converter",
    description: "Instant conversion between 170+ world currencies.",
  },
  {
    icon: BarChart3,
    title: "Historical Charts",
    description: "Interactive charts showing trends over 7 days to 1 year.",
  },
  {
    icon: Globe,
    title: "Compare Currencies",
    description: "Side-by-side comparison with trend analysis.",
  },
  {
    icon: Shield,
    title: "Global Coverage",
    description: "Major and emerging market currencies worldwide.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-[#0A192F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
        <LandingNavbar />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The Smarter Way to{" "}
              <span className="text-blue-400">Exchange Currencies</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-300">
              Track live rates, convert instantly, analyze historical trends, and
              manage your favorite currencies — all in one professional platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/rates">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Explore Rates
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/converter">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Try Converter
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative size-72 sm:size-80">
              <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative flex size-full items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-600/30 to-blue-900/50">
                <Globe className="size-32 text-blue-400 sm:size-40" />
              </div>
              {["$", "€", "£", "¥"].map((symbol, i) => (
                <div
                  key={symbol}
                  className="absolute flex size-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold shadow-lg"
                  style={{
                    top: `${[10, 20, 60, 70][i]}%`,
                    left: `${[70, 5, 80, 10][i]}%`,
                  }}
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Everything You Need in One Place</h2>
            <p className="mt-3 text-muted-foreground">
              A complete fintech toolkit for currency exchange and analysis.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/10">
                  <Icon className="size-5 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
            <div className="rounded-xl border bg-blue-600 p-6 text-white shadow-sm sm:col-span-2 lg:col-span-1">
              <Zap className="size-8" />
              <h3 className="mt-4 font-semibold">Built for Speed</h3>
              <p className="mt-2 text-sm text-blue-100">
                Optimized with TanStack Query for instant data fetching and smooth UX.
              </p>
              <Link href="/dashboard">
                <Button className="mt-4 bg-white text-blue-600 hover:bg-blue-50">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
