"use client";

import { CurrencySelect } from "@/components/shared/currency-select";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { cn } from "@/lib/utils";

interface ConverterFieldProps {
  label: string;
  currency: string;
  onCurrencyChange: (code: string) => void;
  exclude?: string;
  amount: string;
  onAmountChange?: (value: string) => void;
  readOnly?: boolean;
  fieldId: "from" | "to";
}

const fieldBoxClass =
  "rounded-xl border border-border bg-muted/25 p-5";

export function ConverterField({
  label,
  currency,
  onCurrencyChange,
  exclude,
  amount,
  onAmountChange,
  readOnly = false,
  fieldId,
}: ConverterFieldProps) {
  const meta = getCurrencyMeta(currency);

  return (
    <div className={fieldBoxClass}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="w-[9.5rem] shrink-0 sm:w-[10.5rem]">
          <CurrencySelect
            value={currency}
            onValueChange={onCurrencyChange}
            exclude={exclude}
            instanceId={`converter-${fieldId}`}
            variant="converter"
            className="h-10 w-full"
          />
        </div>

        <div className="h-10 w-px shrink-0 bg-border/80" />

        <input
          type={readOnly ? "text" : "number"}
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder="0.00"
          min="0"
          step="any"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-right text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40 sm:text-3xl",
            readOnly && "cursor-default"
          )}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <CurrencyFlag code={currency} size="sm" />
        <span>{meta.name}</span>
        <span className="text-border">·</span>
        <span>{meta.symbol}</span>
      </div>
    </div>
  );
}
