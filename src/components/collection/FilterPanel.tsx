"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CloseIcon, StarIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

/**
 * FİLTRE PANELİ
 *
 * Filtre durumu URL'de tutuluyor (?marka=...&min=...&puan=...). Bunun üç
 * getirisi var: sonuç paylaşılabilir, tarayıcı geri tuşu doğru çalışır ve
 * filtreleme sunucuda yapılabildiği için istemciye ürün listesi taşınmaz.
 *
 * Fiyat aralığı iki üst üste binen native range input ile yapıldı: klavyeyle
 * kullanılabiliyor ve ekstra kütüphane gerektirmiyor.
 */
export function FilterPanel({
  brands,
  bounds,
  onApply,
}: {
  brands: string[];
  bounds: { min: number; max: number };
  /** Mobil drawer'da "Uygula" sonrası paneli kapatmak için. */
  onApply?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedBrands = (searchParams.get("marka") ?? "").split(",").filter(Boolean);
  const minRating = Number(searchParams.get("puan") ?? 0);
  const inStockOnly = searchParams.get("stok") === "1";

  const urlMin = Number(searchParams.get("min") ?? bounds.min);
  const urlMax = Number(searchParams.get("max") ?? bounds.max);

  // Slider sürüklenirken her piksel için yönlendirme yapmamak adına yerel durum.
  // URL dışarıdan değişirse (filtre temizleme, geri tuşu) yerel durumu render
  // sırasında hizalıyoruz — useEffect ile senkronlamak fazladan bir render
  // turu ve bir kare boyunca yanlış konumda duran bir slider demek olurdu.
  const [range, setRange] = useState<[number, number]>([urlMin, urlMax]);
  const [syncedWith, setSyncedWith] = useState<[number, number]>([urlMin, urlMax]);
  if (syncedWith[0] !== urlMin || syncedWith[1] !== urlMax) {
    setSyncedWith([urlMin, urlMax]);
    setRange([urlMin, urlMax]);
  }

  /** Tek bir parametreyi güncelleyip URL'i değiştirir. */
  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);

    const query = params.toString();
    // scroll: false — filtre değişince sayfa başına zıplamasın
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function toggleBrand(brand: string) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setParam("marka", next.join(","));
  }

  function commitRange(next: [number, number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next[0] > bounds.min) params.set("min", String(next[0]));
    else params.delete("min");
    if (next[1] < bounds.max) params.set("max", String(next[1]));
    else params.delete("max");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const activeCount =
    selectedBrands.length +
    (minRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (urlMin > bounds.min || urlMax < bounds.max ? 1 : 0);

  const step = 100;

  return (
    <div className="space-y-7">
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4"
        >
          <CloseIcon className="text-base" />
          Filtreleri temizle ({activeCount})
        </button>
      )}

      {/* Fiyat aralığı */}
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">
          Fiyat aralığı
        </legend>

        <p className="mt-2 text-sm text-sage tabular-nums">
          {formatPrice(range[0])} — {formatPrice(range[1])}
        </p>

        <div className="relative mt-4 h-6">
          {/* Ray */}
          <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          {/* Seçili aralık */}
          <span
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink"
            style={{
              left: `${((range[0] - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
              right: `${100 - ((range[1] - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
            }}
          />

          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={range[0]}
            aria-label="En düşük fiyat"
            onChange={(e) =>
              setRange([Math.min(Number(e.target.value), range[1] - step), range[1]])
            }
            onPointerUp={() => commitRange(range)}
            onKeyUp={() => commitRange(range)}
            className="pointer-events-none absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-surface [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-surface"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={range[1]}
            aria-label="En yüksek fiyat"
            onChange={(e) =>
              setRange([range[0], Math.max(Number(e.target.value), range[0] + step)])
            }
            onPointerUp={() => commitRange(range)}
            onKeyUp={() => commitRange(range)}
            className="pointer-events-none absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-surface [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-surface"
          />
        </div>
      </fieldset>

      {/* Marka */}
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">Marka</legend>
        <ul className="mt-3 space-y-2.5">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-sage hover:text-ink">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 accent-[var(--color-ink)]"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Puan */}
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">
          Müşteri puanı
        </legend>
        <ul className="mt-3 space-y-2">
          {[4.5, 4, 3.5].map((value) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => setParam("puan", minRating === value ? null : String(value))}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  minRating === value
                    ? "bg-surface-alt font-semibold text-ink"
                    : "text-sage hover:bg-surface-alt",
                )}
              >
                <StarIcon className="text-sm text-[#C9A227]" />
                {value.toString().replace(".", ",")} ve üzeri
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Stok durumu */}
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">
          Stok durumu
        </legend>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-sage hover:text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setParam("stok", inStockOnly ? null : "1")}
            className="h-4 w-4 accent-[var(--color-ink)]"
          />
          Sadece stokta olanlar
        </label>
      </fieldset>

      {onApply && (
        <Button fullWidth size="lg" onClick={onApply}>
          Sonuçları göster
        </Button>
      )}
    </div>
  );
}
