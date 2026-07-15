"use client";

import { useCallback, useEffect, useState } from "react";
import type { ConversionRecord } from "@/lib/types/exchange";

const STORAGE_KEY = "exchangehub-history";
const MAX_HISTORY = 50;

function saveToStorage(items: ConversionRecord[]) {
  if (items.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export function useConversionHistory() {
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      setHistory([]);
    }
    setLoaded(true);
  }, []);

  const addConversion = useCallback(
    (record: Omit<ConversionRecord, "id" | "timestamp">) => {
      setHistory((prev) => {
        const entry: ConversionRecord = {
          ...record,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        const updated = [entry, ...prev].slice(0, MAX_HISTORY);
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const removeConversions = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    setHistory((prev) => {
      const updated = prev.filter((item) => !idSet.has(item.id));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeConversion = useCallback(
    (id: string) => removeConversions([id]),
    [removeConversions]
  );

  const clearHistory = useCallback(() => {
    saveToStorage([]);
    setHistory([]);
  }, []);

  return {
    history,
    loaded,
    addConversion,
    removeConversion,
    removeConversions,
    clearHistory,
  };
}
