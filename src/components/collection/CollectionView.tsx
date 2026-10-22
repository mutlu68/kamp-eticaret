import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import type { ProductFilters, SortKey } from "@/lib/data/types";
import { filterProducts, getBrands, getPriceBounds } from "@/lib/repository";

import { CollectionToolbar } from "./CollectionToolbar";
import { FilterPanel } from "./FilterPanel";
import { LoadMoreGrid } from "./LoadMoreGrid";

/** URL parametrelerini repository'nin anladığı filtre nesnesine çevirir. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
  categoryId?: string,
): ProductFilters {
  const single = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sort = single("sirala") as SortKey | undefined;
  const validSorts: SortKey[] = [
    "onerilen",
    "fiyat-artan",
    "fiyat-azalan",
    "cok-satan",
    "en-yeni",
  ];

  return {
    categoryId,
    brands: (single("marka") ?? "").split(",").filter(Boolean),
    minPrice: single("min") ? Number(single("min")) : undefined,
    maxPrice: single("max") ? Number(single("max")) : undefined,
    minRating: single("puan") ? Number(single("puan")) : undefined,
    inStockOnly: single("stok") === "1",
    search: single("q") || undefined,
    sort: sort && validSorts.includes(sort) ? sort : "onerilen",
  };
}

/**
 * KOLEKSİYON GÖRÜNÜMÜ
 *
 * Hem /urunler hem /kategori/[slug] bu bileşeni kullanır — tek fark başlık ve
 * kategori kısıtı. Filtreleme sunucuda yapılıyor; istemciye yalnızca render
 * edilmiş kartlar ve filtre kontrolleri iniyor.
 */
export async function CollectionView({
  title,
  description,
  categoryId,
  searchParams,
}: {
  title: string;
  description?: string;
  categoryId?: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams, categoryId);

  const [products, brands, bounds] = await Promise.all([
    filterProducts(filters),
    getBrands(),
    getPriceBounds(categoryId),
  ]);

  return (
    <div className="container-page py-8 lg:py-12">
      <nav aria-label="Konum" className="mb-5 text-xs text-sage">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Ana Sayfa
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-sage sm:text-base">
            {description}
          </p>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
        {/* Masaüstü filtre sütunu */}
        <aside className="hidden lg:block">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Filtrele</h2>
          <FilterPanel brands={brands} bounds={bounds} />
        </aside>

        <div>
          <CollectionToolbar
            total={products.length}
            brands={brands}
            bounds={bounds}
          />

          <div className="mt-6">
            {products.length === 0 ? (
              <div className="rounded-[var(--radius-card)] border border-line bg-surface p-10 text-center">
                <h2 className="font-display text-lg font-bold text-ink">
                  Bu filtrelere uyan ürün yok
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sage">
                  Fiyat aralığını genişletmeyi veya marka seçimini azaltmayı
                  deneyin.
                </p>
                <ButtonLink href="/urunler" variant="secondary" className="mt-5">
                  Tüm ürünlere dön
                </ButtonLink>
              </div>
            ) : (
              <>
                {/*
                  Görünmez başlık: filtre sütunundaki h2 mobilde gizlendiği
                  için ürün kartlarının h3'leri h1'in hemen altında kalıyor ve
                  başlık sırası bozuluyordu. Ekran okuyucu için de listenin ne
                  olduğunu söyleyen bir başlık kazandırıyor.
                */}
                <h2 className="sr-only">Ürünler</h2>
                <LoadMoreGrid>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 3}
                  />
                ))}
                </LoadMoreGrid>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
