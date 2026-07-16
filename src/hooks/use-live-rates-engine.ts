"use client";

import { useEffect, useRef, useState } from "react";
import type { TickDirection } from "@/lib/types/exchange";

export interface LiveRateSnapshot {
  displayRates: Record<string, number>;
  tickDirections: Record<string, TickDirection>;
  sessionChanges: Record<string, number>;
}

function getDirection(current: number, previous: number): TickDirection {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

export function useLiveRateEngine(
  apiRates: Record<string, number> | undefined,
  volatility: Record<string, number> | undefined,
  enabled: boolean
): LiveRateSnapshot {
  const [displayRates, setDisplayRates] = useState<Record<string, number>>({});
  const [tickDirections, setTickDirections] = useState<
    Record<string, TickDirection>
  >({});
  const [sessionChanges, setSessionChanges] = useState<Record<string, number>>(
    {}
  );

  const anchorRatesRef = useRef<Record<string, number>>({});
  const sessionStartRef = useRef<Record<string, number>>({});
  const prevDisplayRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!apiRates) return;

    anchorRatesRef.current = { ...apiRates };

    setDisplayRates((prev) => {
      const next = { ...prev };
      for (const [code, rate] of Object.entries(apiRates)) {
        if (!sessionStartRef.current[code]) {
          sessionStartRef.current[code] = rate;
        }
        next[code] = rate;
      }
      prevDisplayRef.current = next;
      return next;
    });
  }, [apiRates]);

  useEffect(() => {
    if (!enabled || !apiRates) return;

    const id = setInterval(() => {
      setDisplayRates((prev) => {
        const next: Record<string, number> = { ...prev };
        const directions: Record<string, TickDirection> = {};
        const sessions: Record<string, number> = {};

        for (const [code, anchor] of Object.entries(anchorRatesRef.current)) {
          const vol = volatility?.[code] ?? 0.00012;
          const current = next[code] ?? anchor;
          const impulse = (Math.random() - 0.5) * vol * 0.35;
          const reversion = (anchor - current) / anchor;
          const updated = current * (1 + impulse + reversion * 0.08);
          next[code] = updated;

          const previous = prevDisplayRef.current[code] ?? current;
          directions[code] = getDirection(updated, previous);

          const start = sessionStartRef.current[code] ?? anchor;
          sessions[code] =
            start > 0 ? ((updated - start) / start) * 100 : 0;
        }

        prevDisplayRef.current = next;
        setTickDirections(directions);
        setSessionChanges(sessions);
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [enabled, apiRates, volatility]);

  return { displayRates, tickDirections, sessionChanges };
}
