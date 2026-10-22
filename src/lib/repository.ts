import { categories, categoryById, categoryBySlug } from "./data/categories";
import { brands, products } from "./data/products";
import { reviews, testimonials } from "./data/reviews";
import { effectivePrice, normalizeForSearch } from "./format";
import type {
  Category,
  Product,
  ProductFilters,
  Review,
  SortKey,
  Testimonial,
} from "./data/types";

/**
 * VERİ ERİŞİM KATMANI
 * ===================
 * Uygulamadaki TEK veri kapısı. Bileşenler `lib/data/*` dosyalarını doğrudan
 * import etmez, hep buradan geçer.
 *
 * Bugün: bellekteki diziler üzerinde çalışıyor.
 * Yarın: PostgreSQL + Prisma'ya geçildiğinde sadece bu dosyanın gövdesi
 *        değişir; fonksiyon imzaları (hepsi `async`, hepsi Promise dönüyor)
 *        aynı kaldığı için çağıran hiçbir bileşene dokunmak gerekmez.
 *
 * Örnek geçiş:
 *   export async function getProductBySlug(slug: string) {
 *     return prisma.product.findUnique({ where: { slug }, include: { variants: true } });
 *   }
 */

// ---------------------------------------------------------------- KATEGORİLER

export async function getCategories(): Promise<Category[]> {
  return categories;
}

/** Ana sayfa vitrininde gösterilecek 6 kategori. */
export async function getFeaturedCategories(): Promise<Category[]> {
  return categories.filter((c) => c.featured);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categoryBySlug.get(slug) ?? null;
}

/** Kategori bazında ürün sayısı — mega menüde ve filtre panelinde gösterilir. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const p of products) {
    counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  }
  return counts;
}

// -------------------------------------------------------------------- ÜRÜNLER

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  // Verilen sırayı koru — çapraz satış blokları sıralamaya güveniyor
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Tüm slug'lar — generateStaticParams için. */
export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

export async function getBrands(): Promise<string[]> {
  return brands;
}

/** Çok satanlar karuseli. */
export async function getBestSellers(limit = 8): Promise<Product[]> {
  return [...products]
    .filter((p) => p.isBestSeller)
    .sort((a, b) => a.salesRank - b.salesRank)
    .slice(0, limit);
}

/** Kampanya bloğunda gösterilecek, indirim oranı en yüksek ürünler. */
export async function getDeals(limit = 4): Promise<Product[]> {
  return [...products]
    .filter((p) => p.salePrice)
    .sort((a, b) => {
      const da = (a.price - (a.salePrice ?? a.price)) / a.price;
      const db = (b.price - (b.salePrice ?? b.price)) / b.price;
      return db - da;
    })
    .slice(0, limit);
}

/** "Benzer ürünler": aynı kategoriden, kendisi hariç, en çok satanlar. */
export async function getRelated(product: Product, limit = 8): Promise<Product[]> {
  const sameCategory = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .sort((a, b) => a.salesRank - b.salesRank);

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  // Kategori az ürün içeriyorsa genel çok satanlarla tamamla
  const filler = products
    .filter(
      (p) => p.id !== product.id && !sameCategory.some((s) => s.id === p.id),
    )
    .sort((a, b) => a.salesRank - b.salesRank);

  return [...sameCategory, ...filler].slice(0, limit);
}

/** "Birlikte alınanlar" çapraz satış bloğu. */
export async function getBundle(product: Product): Promise<Product[]> {
  return getProductsByIds(product.bundleWith);
}

/** Sepetteki "Bunları unutma" önerisi: sepette olmayan ucuz aksesuarlar. */
export async function getCartSuggestions(
  excludeProductIds: string[],
  limit = 2,
): Promise<Product[]> {
  return products
    .filter((p) => !excludeProductIds.includes(p.id) && p.stock > 0)
    .sort((a, b) => effectivePrice(a.price, a.salePrice) - effectivePrice(b.price, b.salePrice))
    .slice(0, limit);
}

/** 404 sayfası ve başarı sayfasında gösterilen öneriler. */
export async function getPopularPicks(limit = 4): Promise<Product[]> {
  return [...products].sort((a, b) => a.salesRank - b.salesRank).slice(0, limit);
}

// -------------------------------------------------------- ARAMA / FİLTRE

/**
 * Header'daki canlı arama.
 * Türkçe aksan farklarını yok sayar: "cadir" araması "Çadır" bulur.
 */
export async function searchProducts(query: string, limit = 6): Promise<Product[]> {
  const q = normalizeForSearch(query).trim();
  if (q.length < 2) return [];

  const scored = products
    .map((p) => {
      const haystackName = normalizeForSearch(p.name);
      const haystackAll = normalizeForSearch(
        `${p.name} ${p.brand} ${p.summary} ${categoryById.get(p.categoryId)?.name ?? ""}`,
      );
      // İsimde geçen sonuçlar önce gelsin
      let score = 0;
      if (haystackName.startsWith(q)) score = 3;
      else if (haystackName.includes(q)) score = 2;
      else if (haystackAll.includes(q)) score = 1;
      return { product: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.product.salesRank - b.product.salesRank);

  return scored.slice(0, limit).map((s) => s.product);
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  onerilen: (a, b) => a.salesRank - b.salesRank,
  "fiyat-artan": (a, b) =>
    effectivePrice(a.price, a.salePrice) - effectivePrice(b.price, b.salePrice),
  "fiyat-azalan": (a, b) =>
    effectivePrice(b.price, b.salePrice) - effectivePrice(a.price, a.salePrice),
  "cok-satan": (a, b) => a.salesRank - b.salesRank,
  "en-yeni": (a, b) => b.createdAt.localeCompare(a.createdAt),
};

/**
 * Kategori sayfasının filtre + sıralama motoru.
 * Sunucuda çağrılır; filtre durumu URL'de tutulduğu için sonuç paylaşılabilir.
 */
export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  let result = [...products];

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand));
  }
  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }
  if (filters.minPrice != null) {
    result = result.filter(
      (p) => effectivePrice(p.price, p.salePrice) >= filters.minPrice!,
    );
  }
  if (filters.maxPrice != null) {
    result = result.filter(
      (p) => effectivePrice(p.price, p.salePrice) <= filters.maxPrice!,
    );
  }
  if (filters.search) {
    const q = normalizeForSearch(filters.search);
    result = result.filter((p) =>
      normalizeForSearch(`${p.name} ${p.brand} ${p.summary}`).includes(q),
    );
  }

  return result.sort(sorters[filters.sort ?? "onerilen"]);
}

/** Filtre panelindeki fiyat slider'ının uçlarını belirler. */
export async function getPriceBounds(
  categoryId?: string,
): Promise<{ min: number; max: number }> {
  const pool = categoryId
    ? products.filter((p) => p.categoryId === categoryId)
    : products;
  const prices = pool.map((p) => effectivePrice(p.price, p.salePrice));
  return {
    min: Math.floor(Math.min(...prices) / 100) * 100,
    max: Math.ceil(Math.max(...prices) / 100) * 100,
  };
}

// ------------------------------------------------------------------ YORUMLAR

export async function getReviews(productId: string): Promise<Review[]> {
  return reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

/**
 * Puan dağılım grafiği (5 yıldız %72, 4 yıldız %18 ...).
 *
 * Ürünün ortalama puanı ve toplam yorum sayısından türetilen deterministik bir
 * dağılım. Gerçek veritabanında bu bir `GROUP BY rating` sorgusu olacak; imza
 * aynı kaldığı için bileşen değişmeyecek.
 */
export async function getRatingBreakdown(
  product: Product,
): Promise<{ stars: number; count: number; percent: number }[]> {
  const { rating, reviewCount } = product;

  // Ortalamayı koruyan, gerçekçi biçimde sağa yatık bir dağılım üret
  const weights = [5, 4, 3, 2, 1].map((stars) => {
    const distance = Math.abs(stars - rating);
    return Math.exp(-distance * distance * 1.9);
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const raw = weights.map((w) => (w / weightSum) * reviewCount);
  const counts = raw.map((n) => Math.round(n));

  // Yuvarlama farkını en büyük gruba ekleyerek toplamı tutturuyoruz
  const diff = reviewCount - counts.reduce((a, b) => a + b, 0);
  counts[0] += diff;

  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    count: Math.max(0, counts[i]),
    percent: reviewCount ? Math.round((Math.max(0, counts[i]) / reviewCount) * 100) : 0,
  }));
}

// ------------------------------------------------------------------ YARDIMCI

export function getCategoryOf(product: Product): Category | null {
  return categoryById.get(product.categoryId) ?? null;
}
