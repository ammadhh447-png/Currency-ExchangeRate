"use client";

import { useLiveClock } from "@/hooks/use-live-clock";
import { Button } from "@/components/ui/button";
import { formatLiveDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface LiveRatesIndicatorProps {
  isFetching?: boolean;
  onRefresh: () => void;
  className?: string;
}

export function LiveRatesIndicator({
  isFetching = false,
  onRefresh,
  className,
}: LiveRatesIndicatorProps) {
  const now = useLiveClock(1000);
  const currentTime = formatLiveDateTime(new Date(now));

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 shadow-sm",
        className
      )}
    >
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-semibold tracking-wide text-emerald-600 uppercase">
        Live
      </span>
      <span className="text-border">|</span>
      <time
        dateTime={new Date(now).toISOString()}
        suppressHydrationWarning
        className="text-xs tabular-nums text-muted-foreground"
      >
        {currentTime}
      </time>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label="Refresh rates"
        className="ml-0.5 text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
      </Button>
    </div>
  );
}
