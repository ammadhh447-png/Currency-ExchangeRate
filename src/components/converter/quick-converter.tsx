"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrencySelect } from "@/components/shared/currency-select";
import { ChangeBadge } from "@/components/shared/change-badge";
import { useConversionRate } from "@/hooks/use-exchange-rates";
import { useConversionHistory } from "@/hooks/use-conversion-history";
import { formatRate } from "@/lib/utils/format";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuickConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
  compact?: boolean;
}

export function QuickConverter({
  defaultFrom = "USD",
  defaultTo = "PKR",
  compact = false,
}: QuickConverterProps) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState("100");
  const { rate, isLoading } = useConversionRate(from, to);
  const { addConversion } = useConversionHistory();

  const numAmount = parseFloat(amount) || 0;
  const result = numAmount * rate;

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
    toast.success(`Converted ${numAmount} ${from} to ${result.toFixed(2)} ${to}`);
  };

  return (
    <Card>
      <CardHeader className={compact ? "pb-3" : undefined}>
        <CardTitle className="text-base">Quick Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            You send
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              min="0"
              step="any"
            />
            <CurrencySelect
              value={from}
              onValueChange={setFrom}
              exclude={to}
              className="w-36"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwap}>
            <ArrowDownUp className="size-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            You get
          </label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={isLoading ? "..." : formatRate(result, 2)}
              className="flex-1 bg-muted/50"
            />
            <CurrencySelect
              value={to}
              onValueChange={setTo}
              exclude={from}
              className="w-36"
            />
          </div>
        </div>

        {rate > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            1 {from} = {formatRate(rate)} {to}
          </p>
        )}

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleConvert}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Convert"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
