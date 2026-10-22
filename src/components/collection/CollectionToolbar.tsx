"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { FilterIcon } from "@/components/ui/Icons";
import type { SortKey } from "@/lib/data/types";

import { FilterPanel } from "./FilterPanel";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "onerilen", label: "Önerilen" },
  { value: "fiyat-artan", label: "Fiyat: artan" },
  { value: "fiyat-azalan", label: "Fiyat: azalan" },
  { value: "cok-satan", label: "En çok satan" },
  { value: "en-yeni", label: "En yeni" },
];

/**
 * Kategori sayfası üst çubuğu: sonuç sayısı, sıralama ve mobilde filtre
 * drawer'ını açan buton.
 *
 * Mobilde filtreler alttan açılan panelde (Drawer side="bottom"); masaüstünde
 * sol sütunda sabit duruyor.
 */
export function CollectionToolbar({
  total,
  brands,
  bounds,
}: {
  total: number;
  brands: string[];
  bounds: { min: number; max: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentSort = (searchParams.get("sirala") ?? "onerilen") as SortKey;

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "onerilen") params.delete("sirala");
    else params.set("sirala", value);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <p className="text-sm text-sage">
          <strong className="font-semibold text-ink">{total}</strong> ürün
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-sm font-semibold text-ink lg:hidden"
          >
            <FilterIcon className="text-base" />
            Filtrele
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="siralama" className="sr-only">
              Sıralama
            </label>
            <select
              id="siralama"
              value={currentSort}
              onChange={(event) => changeSort(event.target.value)}
              className="h-10 rounded-[var(--radius-card)] border border-line bg-surface px-3 text-sm font-semibold text-ink focus:border-ink/30 focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtrele"
        side="bottom"
      >
        <div className="px-5 py-5">
          <FilterPanel
            brands={brands}
            bounds={bounds}
            onApply={() => setFiltersOpen(false)}
          />
        </div>
      </Drawer>
    </>
  );
}
