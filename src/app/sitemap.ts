import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/repository";

const BASE = "https://kamprotasi.example";

/** Site haritası — ürün ve kategori sayfaları veri katmanından türetilir. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticPages = [
    { path: "", priority: 1 },
    { path: "/urunler", priority: 0.9 },
    { path: "/hakkimizda", priority: 0.5 },
    { path: "/iletisim", priority: 0.5 },
    { path: "/sss", priority: 0.6 },
    { path: "/kargo-iade", priority: 0.6 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${BASE}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page.priority,
    })),
    ...categories.map((category) => ({
      url: `${BASE}/kategori/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${BASE}/urun/${product.slug}`,
      lastModified: new Date(product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
