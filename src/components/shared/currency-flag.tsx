"use client";

import { useState } from "react";
import { getCountryCodeForCurrency } from "@/lib/constants/currency-flags";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { cn } from "@/lib/utils";

interface CurrencyFlagProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-[1.375rem]",
  md: "h-4 w-6",
  lg: "h-6 w-9",
};

const fallbackSizes = {
  sm: "size-5 text-[9px]",
  md: "size-6 text-[10px]",
  lg: "size-9 text-xs",
};

export function CurrencyFlag({ code, size = "md", className }: CurrencyFlagProps) {
  const [failed, setFailed] = useState(false);
  const countryCode = getCountryCodeForCurrency(code);
  const meta = getCurrencyMeta(code);

  if (!countryCode || failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-muted font-bold text-muted-foreground ring-1 ring-border/60",
          fallbackSizes[size],
          className
        )}
        role="img"
        aria-label={`${meta.name} flag`}
      >
        {code.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x`}
      alt={`${meta.name} flag`}
      width={24}
      height={18}
      className={cn(
        "inline-block shrink-0 rounded-sm object-cover ring-1 ring-border/40",
        sizeClasses[size],
        className
      )}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
