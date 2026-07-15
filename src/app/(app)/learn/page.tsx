"use client";

import { AppHeader } from "@/components/layout/app-header";
import { FaqSection } from "@/components/learn/faq-section";
import { Button } from "@/components/ui/button";
import { LEARN_TOPICS } from "@/lib/constants/currencies";
import { FAQ_ITEMS } from "@/lib/constants/faqs";
import {
  HelpCircle,
  TrendingUp,
  Hash,
  Scale,
  Globe,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const iconMap = {
  HelpCircle,
  TrendingUp,
  Hash,
  Scale,
  Globe,
};

const accentColors = [
  "from-blue-500/10 to-blue-600/5 border-blue-500/20",
  "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
  "from-violet-500/10 to-violet-600/5 border-violet-500/20",
  "from-amber-500/10 to-amber-600/5 border-amber-500/20",
  "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
];

const iconColors = [
  "bg-blue-600 text-white",
  "bg-emerald-600 text-white",
  "bg-violet-600 text-white",
  "bg-amber-600 text-white",
  "bg-cyan-600 text-white",
];

const guideTopics = LEARN_TOPICS;

export default function LearnPage() {
  return (
    <>
      <AppHeader
        title="Learn"
        subtitle="Understanding currency exchange fundamentals"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#0A192F] to-[#112240] p-8 text-white shadow-lg sm:p-10">
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                  <BookOpen className="size-3.5" />
                  Knowledge Center
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Master the Basics of Currency Exchange
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  Whether you&apos;re traveling, trading, or managing international
                  finances — understanding exchange rates is essential.
                </p>
              </div>
              <div className="flex shrink-0 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-400">5</p>
                  <p className="text-xs text-slate-400">Guides</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-blue-400">
                    {FAQ_ITEMS.length}
                  </p>
                  <p className="text-xs text-slate-400">FAQs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guideTopics.map((topic, i) => {
              const Icon =
                iconMap[topic.icon as keyof typeof iconMap] ?? HelpCircle;

              return (
                <motion.article
                  key={topic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                    accentColors[i % accentColors.length]
                  )}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl shadow-sm",
                        iconColors[i % iconColors.length]
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight">
                    {topic.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {topic.summary}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {topic.content}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <FaqSection />

          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-muted/30 p-6 sm:flex-row sm:p-8">
            <div>
              <p className="font-semibold">Ready to put knowledge into practice?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try converting currencies with live rates.
              </p>
            </div>
            <Link href="/converter">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Open Converter
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
