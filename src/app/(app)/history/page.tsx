"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ConversionHistoryTable } from "@/components/history/conversion-history-table";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConversionHistory } from "@/hooks/use-conversion-history";
import { usePagination } from "@/hooks/use-pagination";
import { Filter, History, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  subDays,
  startOfDay,
  isAfter,
  isBefore,
  endOfDay,
} from "date-fns";

const PAGE_SIZE = 10;

type PeriodFilter = "all" | "today" | "7d" | "30d";

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function matchesPeriod(timestamp: number, period: PeriodFilter): boolean {
  if (period === "all") return true;

  const date = new Date(timestamp);
  const now = new Date();

  if (period === "today") {
    return (
      isAfter(date, startOfDay(now)) && isBefore(date, endOfDay(now))
    );
  }
  if (period === "7d") return isAfter(date, subDays(now, 7));
  if (period === "30d") return isAfter(date, subDays(now, 30));

  return true;
}

export default function HistoryPage() {
  const { history, loaded, clearHistory, removeConversion, removeConversions } =
    useConversionHistory();
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let items = history.filter((item) =>
      matchesPeriod(item.timestamp, periodFilter)
    );

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.from.toLowerCase().includes(q) ||
          item.to.toLowerCase().includes(q) ||
          String(item.amount).includes(q) ||
          String(item.result).includes(q)
      );
    }

    return items;
  }, [history, search, periodFilter]);

  const filteredIds = useMemo(
    () => filtered.map((item) => item.id),
    [filtered]
  );

  const {
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filtered, PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, periodFilter, setPage]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const valid = new Set(filteredIds);
      const next = new Set([...prev].filter((id) => valid.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [filteredIds]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.has(item.id));
  const someSelected = filtered.some((item) => selectedIds.has(item.id));
  const selectedCount = [...selectedIds].filter((id) =>
    filteredIds.includes(id)
  ).length;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  }, [allFilteredSelected, filteredIds]);

  const handleDeleteOne = useCallback(
    (id: string) => {
      removeConversion(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Conversion removed");
    },
    [removeConversion]
  );

  const handleDeleteSelected = useCallback(() => {
    const ids = [...selectedIds].filter((id) => filteredIds.includes(id));
    if (ids.length === 0) return;
    removeConversions(ids);
    setSelectedIds(new Set());
    toast.success(`Removed ${ids.length} conversion${ids.length > 1 ? "s" : ""}`);
  }, [selectedIds, filteredIds, removeConversions]);

  const handleClearAll = () => {
    clearHistory();
    setSearch("");
    setPeriodFilter("all");
    setSelectedIds(new Set());
    toast.success("Conversion history cleared");
  };

  const hasActiveFilters = search.trim() !== "" || periodFilter !== "all";

  return (
    <>
      <AppHeader
        title="Conversion History"
        subtitle="Your recent currency conversions"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {loaded && history.length > 0 && (
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search conversions..."
                  className="flex-1"
                />
                <Select
                  value={periodFilter}
                  onValueChange={(v) => v && setPeriodFilter(v as PeriodFilter)}
                >
                  <SelectTrigger className="h-9 w-full gap-2 sm:w-44">
                    <Filter className="size-3.5 shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {PERIOD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  {hasActiveFilters
                    ? `${filtered.length} of ${history.length} conversions`
                    : `${history.length} conversions`}
                  {selectedCount > 0 && (
                    <span className="ml-2 font-medium text-foreground">
                      · {selectedCount} selected
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  {selectedCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteSelected}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Delete selected
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loaded ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center shadow-sm">
              <History className="size-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-semibold">No conversion history</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your conversions will appear here after you use the converter.
              </p>
              <Link href="/converter">
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                  Open Converter
                </Button>
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border bg-card py-16 text-center shadow-sm">
              <p className="font-medium">No matches found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term or time period.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setPeriodFilter("all");
                  }}
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <ConversionHistoryTable
                items={paginatedItems}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                allFilteredSelected={allFilteredSelected}
                someSelected={someSelected}
                onDelete={handleDeleteOne}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
