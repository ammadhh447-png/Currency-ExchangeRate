"use client";

import { FAQ_ITEMS } from "@/lib/constants/faqs";
import { cn } from "@/lib/utils";
import {
  Banknote,
  BarChart3,
  Clock,
  Globe,
  MessageCircleQuestion,
  Minus,
  Plus,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  Globe,
  BarChart3,
  Clock,
  RefreshCw,
  TrendingUp,
  Banknote,
};

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b bg-muted/30 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-rose-600 text-white">
            <MessageCircleQuestion className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <p className="text-sm text-muted-foreground">
              Tap a question to reveal a detailed answer
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {FAQ_ITEMS.map((faq) => {
          const Icon = iconMap[faq.icon as keyof typeof iconMap] ?? Globe;
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id}>
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-6 py-4 text-left transition-colors sm:px-8",
                  isOpen ? "bg-muted/20" : "hover:bg-muted/30"
                )}
                aria-expanded={isOpen}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isOpen
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600/10 text-blue-600"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="flex-1 text-sm font-semibold sm:text-base">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isOpen ? (
                    <Minus className="size-3.5" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 pl-14 sm:pl-[4.5rem] sm:pr-8">
                      <div className="space-y-0 overflow-hidden rounded-xl border bg-muted/30">
                        {faq.answer.map((line, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex gap-3 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground",
                              i !== faq.answer.length - 1 &&
                                "border-b border-border/60"
                            )}
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                            <p>{line}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
