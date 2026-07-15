"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "exchangehub-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      setFavorites([]);
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((items: string[]) => {
    setFavorites(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const toggleFavorite = useCallback(
    (code: string) => {
      persist(
        favorites.includes(code)
          ? favorites.filter((c) => c !== code)
          : [...favorites, code]
      );
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites]
  );

  const removeFavorite = useCallback(
    (code: string) => {
      persist(favorites.filter((c) => c !== code));
    },
    [favorites, persist]
  );

  return { favorites, loaded, toggleFavorite, isFavorite, removeFavorite };
}
