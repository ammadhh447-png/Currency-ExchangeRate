"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ConverterField } from "@/components/converter/converter-field";
import { LiveRateValue } from "@/components/shared/live-rate-value";
import { ChangeBadge } from "@/components/shared/change-badge";
import { RecentConversionsPanel } from "@/components/converter/recent-conversions";
import { Button } from "@/components/ui/button";
import { useConversionRate } from "@/hooks/use-exchange-rates";
import { useConversionHistory } from "@/hooks/use-conversion-history";
import { formatRate } from "@/lib/utils/format";
import { ArrowDownUp, Copy, Loader2, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ConverterPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const { rate, change24h, tickDirection, isLoading } = useConversionRate(from, to);
  const { history, addConversion } = useConversionHistory();
  const shareInProgress = useRef(false);
  const [isSharing, setIsSharing] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const result = numAmount * rate;
  const resultDisplay = isLoading ? "..." : formatRate(result, 2);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleConvert = () => {
    if (numAmount <= 0 || rate <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    addConversion({ from, to, amount: numAmount, result, rate });
    toast.success("Conversion saved to history");
  };

  const handleCopy = async () => {
    const text = `${numAmount} ${from} = ${formatRate(result, 2)} ${to} (Rate: 1 ${from} = ${formatRate(rate)} ${to})`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  const handleShare = async () => {
    if (shareInProgress.current) return;
    const text = `${numAmount} ${from} → ${formatRate(result, 2)} ${to}`;

    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied share text");
      } catch {
        toast.error("Unable to copy share text");
      }
      return;
    }

    shareInProgress.current = true;
    setIsSharing(true);
    try {
      await navigator.share({ title: "ExchangeHub Conversion", text });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied share text");
      } catch {
        toast.error("Unable to share conversion");
      }
    } finally {
      shareInProgress.current = false;
      setIsSharing(false);
    }
  };

  return (
    <>
      <AppHeader
        title="Currency Converter"
        subtitle="Convert between 170+ currencies in real-time"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5 lg:gap-6">
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="space-y-1">
                <ConverterField
                  label="You send"
                  currency={from}
                  onCurrencyChange={setFrom}
                  exclude={to}
                  amount={amount}
                  onAmountChange={setAmount}
                  fieldId="from"
                />

                <div className="relative z-10 -my-3 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSwap}
                    aria-label="Swap currencies"
                    className="size-10 rounded-full border-2 bg-card shadow-sm hover:border-blue-500 hover:bg-blue-500/5"
                  >
                    <ArrowDownUp className="size-4 text-blue-600" />
                  </Button>
                </div>

                <ConverterField
                  label="You get"
                  currency={to}
                  onCurrencyChange={setTo}
                  exclude={from}
                  amount={resultDisplay}
                  readOnly
                  fieldId="to"
                />
              </div>

              {rate > 0 && !isLoading && (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-muted/50 py-2.5 text-sm">
                  <span className="text-muted-foreground">
                    Mid-market rate
                  </span>
                  <span className="font-medium">
                    1 {from} ={" "}
                    <LiveRateValue
                      value={rate}
                      direction={tickDirection}
                      className="inline-flex"
                    />{" "}
                    {to}
                  </span>
                  <ChangeBadge value={change24h} />
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  className="h-11 flex-1 bg-blue-600 text-base font-medium hover:bg-blue-700"
                  onClick={handleConvert}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Convert"
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-11 flex-1 sm:flex-none sm:px-6"
                    onClick={() => setAmount("")}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11 shrink-0"
                    onClick={handleCopy}
                    aria-label="Copy result"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11 shrink-0"
                    onClick={handleShare}
                    disabled={isSharing}
                    aria-label="Share conversion"
                  >
                    {isSharing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Share2 className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <RecentConversionsPanel history={history} limit={4} />
          </div>
        </div>
      </main>
    </>
  );
}
