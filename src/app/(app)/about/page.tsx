import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "170+", label: "Currencies" },
  { value: "9", label: "Modules" },
  { value: "24/7", label: "Rate Access" },
  { value: "100%", label: "Free" },
];

const values = [
  {
    icon: Zap,
    title: "Real-time Data",
    description: "Rates updated regularly from trusted public APIs.",
    color: "bg-blue-600/10 text-blue-600",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "170+ currencies from major and emerging markets.",
    color: "bg-emerald-600/10 text-emerald-600",
  },
  {
    icon: Heart,
    title: "Free To Use",
    description: "No sign-up required. Full access to all features.",
    color: "bg-rose-600/10 text-rose-600",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description: "Favorites and history stored locally on your device.",
    color: "bg-violet-600/10 text-violet-600",
  },
];

export default function AboutPage() {
  return (
    <>
      <AppHeader title="About" subtitle="About ExchangeHub" />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#0A192F] via-[#0f2137] to-[#112240] p-8 text-white shadow-lg sm:p-12">
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -top-10 -right-10 size-48 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                  <Globe className="size-3.5" />
                  ExchangeHub
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  The Smarter Way to Exchange Currencies
                </h2>
                <p className="mt-4 leading-relaxed text-slate-300">
                  A professional currency exchange platform with real-time rates,
                  interactive charts, and a polished experience — no account
                  required.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Explore Dashboard
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative size-56 sm:size-64">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />
                  <div className="relative flex size-full items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <Globe className="size-28 text-blue-400 sm:size-32" />
                  </div>
                  {["$", "€", "£", "¥"].map((symbol, i) => (
                    <div
                      key={symbol}
                      className="absolute flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold shadow-lg ring-2 ring-[#0A192F]"
                      style={{
                        top: `${[8, 22, 62, 72][i]}%`,
                        left: `${[78, -2, 88, 12][i]}%`,
                      }}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border bg-card p-5 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-5">
            <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-blue-600/10">
                <Users className="size-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Make currency information accessible, visual, and easy to
                understand for everyone — from travelers to finance enthusiasts
                managing international money.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="size-4 text-blue-600" />
                Built for clarity, speed, and professional UX
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
              {values.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex size-10 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
