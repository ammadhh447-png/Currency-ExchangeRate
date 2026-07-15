"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ChangeBadge } from "@/components/shared/change-badge";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import { SearchInput } from "@/components/shared/search-input";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrencyRates } from "@/hooks/use-exchange-rates";
import { useFavorites } from "@/hooks/use-favorites";
import { getCurrencyMeta } from "@/lib/constants/currencies";
import { formatRate } from "@/lib/utils/format";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortOption = "code" | "rate" | "change";

export default function FavoritesPage() {
  const { favorites, loaded, removeFavorite } = useFavorites();
  const { currencyRates, isLoading } = useCurrencyRates();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("code");

  const items = useMemo(() => {
    let list = favorites.map((code) => {
      const cr = currencyRates.find((c) => c.code === code);
      return {
        code,
        meta: getCurrencyMeta(code),
        rate: cr?.rate ?? (code === "USD" ? 1 : 0),
        change: cr?.change24h ?? 0,
      };
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.code.toLowerCase().includes(q) ||
          item.meta.name.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "code") return a.code.localeCompare(b.code);
      if (sortBy === "rate") return b.rate - a.rate;
      return b.change - a.change;
    });

    return list;
  }, [favorites, currencyRates, search, sortBy]);

  return (
    <>
      <AppHeader
        title="Favorites"
        subtitle="Your saved currencies for quick access"
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {!loaded || isLoading ? (
          <TableSkeleton />
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Star className="size-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No favorites yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Star currencies on the Live Rates page to add them here.
            </p>
            <Link href="/rates">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Browse Rates
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search favorites..."
                className="flex-1"
              />
              <Select
                value={sortBy}
                onValueChange={(v) => v && setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Sort: Code A–Z</SelectItem>
                  <SelectItem value="rate">Sort: Highest rate</SelectItem>
                  <SelectItem value="change">Sort: 24h change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border bg-card py-16 text-center">
                <p className="font-medium">No favorites match your search</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Clear the search to see all saved currencies.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-8" />
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Rate (USD)</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.code} className="hover:bg-muted/30">
                        <TableCell>
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/currency/${item.code}`}
                            className="flex items-center gap-2 hover:text-blue-600"
                          >
                            <CurrencyFlag code={item.code} size="sm" />
                            <span className="font-medium">{item.code}</span>
                            <span className="hidden text-muted-foreground sm:inline">
                              {item.meta.name}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatRate(item.rate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <ChangeBadge value={item.change} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeFavorite(item.code)}
                          >
                            <Trash2 className="size-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
