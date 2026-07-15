"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ChangeBadge } from "@/components/shared/change-badge";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { Sparkline } from "@/components/shared/sparkline";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { LiveRatesIndicator } from "@/components/shared/live-rates-indicator";
import { SearchInput } from "@/components/shared/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCurrencyRates } from "@/hooks/use-exchange-rates";
import { useFavorites } from "@/hooks/use-favorites";
import { usePagination } from "@/hooks/use-pagination";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { formatRate } from "@/lib/utils/format";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

type SortKey = "code" | "rate" | "change";

export default function LiveRatesPage() {
  const { currencyRates, isLoading, isError, isFetching, refetch } =
    useCurrencyRates("USD", true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let items = currencyRates.map((c) => ({
      ...c,
      meta: getCurrencyMeta(c.code),
    }));

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.meta.name.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "code") cmp = a.code.localeCompare(b.code);
      else if (sortKey === "rate") cmp = a.rate - b.rate;
      else cmp = a.change24h - b.change24h;
      return sortAsc ? cmp : -cmp;
    });

    return items;
  }, [currencyRates, search, sortKey, sortAsc]);

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
  }, [search, sortKey, sortAsc, setPage]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleFavorite = (code: string) => {
    toggleFavorite(code);
    toast.success(
      isFavorite(code) ? `Removed ${code} from favorites` : `Added ${code} to favorites`
    );
  };

  return (
    <>
      <AppHeader
        title="Live Exchange Rates"
        subtitle="Real-time rates for 170+ currencies"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search currencies..."
            className="max-w-sm flex-1"
          />
          <LiveRatesIndicator
            isFetching={isFetching}
            onRefresh={() => refetch()}
          />
        </div>

        {isLoading && <TableSkeleton rows={10} />}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-medium">No currencies found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-8" />
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("code")}
                      >
                        Currency {sortKey === "code" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer text-right hover:text-foreground"
                        onClick={() => handleSort("rate")}
                      >
                        Price (USD) {sortKey === "rate" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer text-right hover:text-foreground"
                        onClick={() => handleSort("change")}
                      >
                        Change (24h) {sortKey === "change" && (sortAsc ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="w-32">Chart</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((c) => (
                      <TableRow key={c.code} className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleFavorite(c.code)}
                          >
                            <Star
                              className={`size-4 ${isFavorite(c.code) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                            />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/currency/${c.code}`}
                            className="flex items-center gap-2 hover:text-blue-600"
                          >
                            <CurrencyFlag code={c.code} size="sm" />
                            <div>
                              <span className="font-medium">{c.code}</span>
                              <span className="ml-2 hidden text-muted-foreground sm:inline">
                                {c.meta.name}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatRate(c.rate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <ChangeBadge value={c.change24h} />
                        </TableCell>
                        <TableCell>
                          <Sparkline
                            data={c.sparkline}
                            positive={c.change24h >= 0}
                            height={28}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  totalItems={totalItems}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}
