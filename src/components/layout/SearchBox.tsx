"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { SearchResult } from "@/app/api/arama/route";
import { Price } from "@/components/ui/Price";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { useClickOutside, useDebouncedValue } from "@/lib/hooks";

/**
 * Canlı öneri açılır listesi olan arama kutusu.
 *
 * Yazarken her tuşta değil, 220 ms duraklayınca istek atıyor. Açık istek varsa
 * AbortController ile iptal ediliyor; yavaş bir yanıt sonradan gelip yeni
 * sonuçların üstüne yazamıyor.
 *
 * Klavye: yukarı/aşağı ile öneriler arasında gezinme, Enter ile seçim,
 * Esc ile kapatma. combobox rolü ekran okuyucuya durumu bildiriyor.
 */
export function SearchBox({
  onNavigate,
  autoFocus = false,
  className,
}: {
  /** Mobil arama panelini kapatmak için — sonuç seçilince çağrılır. */
  onNavigate?: () => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounced = useDebouncedValue(query, 220);
  const term = debounced.trim();

  /**
   * Sonuçlar hangi arama terimine ait olduklarıyla birlikte saklanıyor.
   * Böylece "yükleniyor" ve "gösterilecek sonuç" durumlarını ayrı state olarak
   * tutmaya gerek kalmıyor: ikisi de render sırasında türetiliyor. Yavaş bir
   * yanıt sonradan gelirse terim eşleşmediği için ekrana basılmıyor.
   */
  const [fetched, setFetched] = useState<{ term: string; results: SearchResult[] }>({
    term: "",
    results: [],
  });

  const results = fetched.term === term ? fetched.results : [];
  const loading = term.length >= 2 && fetched.term !== term;

  // Terim değişince klavye seçimini ve kapatılmış durumunu sıfırla
  const [lastTerm, setLastTerm] = useState(term);
  if (lastTerm !== term) {
    setLastTerm(term);
    setActiveIndex(-1);
    setClosed(false);
  }

  useClickOutside(containerRef, () => setClosed(true), !closed);

  useEffect(() => {
    if (term.length < 2) return;

    const controller = new AbortController();

    fetch(`/api/arama?q=${encodeURIComponent(term)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { results: SearchResult[] }) => {
        setFetched({ term, results: data.results });
      })
      .catch((error) => {
        // İptal edilen istek hata değil, sessizce geç
        if ((error as Error).name !== "AbortError") {
          setFetched({ term, results: [] });
        }
      });

    return () => controller.abort();
  }, [term]);

  function goTo(slug: string) {
    setClosed(true);
    setQuery("");
    onNavigate?.();
    router.push(`/urun/${slug}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setClosed(true);
      return;
    }
    if (closed || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      goTo(results[activeIndex].slug);
    }
  }

  // Panel: terim yeterince uzunsa ve kullanıcı kapatmadıysa görünür
  const showPanel = !closed && term.length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) goTo(results[0].slug);
        }}
      >
        <label htmlFor="site-arama" className="sr-only">
          Ürün ara
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-sage" />
          <input
            id="site-arama"
            type="search"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls="arama-onerileri"
            aria-autocomplete="list"
            autoComplete="off"
            autoFocus={autoFocus}
            value={query}
            placeholder="Çadır, uyku tulumu, ocak..."
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setClosed(false)}
            onKeyDown={onKeyDown}
            className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-10 text-[0.95rem] text-ink placeholder:text-sage/70 focus:border-ink/30 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-sage hover:text-ink"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </form>

      {showPanel && (
        <div
          id="arama-onerileri"
          role="listbox"
          aria-label="Arama önerileri"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-pop)]"
        >
          {loading && results.length === 0 && (
            <p className="px-4 py-5 text-sm text-sage">Aranıyor...</p>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-5">
              <p className="text-sm font-semibold text-ink">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-sage">
                Farklı bir kelime deneyin ya da{" "}
                <Link
                  href="/urunler"
                  onClick={() => {
                    setClosed(true);
                    onNavigate?.();
                  }}
                  className="font-semibold text-ink underline underline-offset-2"
                >
                  tüm ürünlere
                </Link>{" "}
                göz atın.
              </p>
            </div>
          )}

          <ul className="max-h-[60vh] overflow-y-auto">
            {results.map((result, index) => (
              <li key={result.slug} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goTo(result.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    index === activeIndex ? "bg-surface-alt" : "hover:bg-surface-alt",
                  )}
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                    <Image
                      src={result.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {result.name}
                    </span>
                    <span className="block text-xs text-sage">{result.category}</span>
                  </span>
                  <Price
                    price={result.price}
                    salePrice={result.salePrice}
                    size="sm"
                    showBadge={false}
                    className="shrink-0"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
