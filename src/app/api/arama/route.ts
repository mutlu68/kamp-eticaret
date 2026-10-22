import { NextResponse } from "next/server";

import { getCategoryOf, searchProducts } from "@/lib/repository";

/**
 * Header'daki canlı arama önerileri.
 *
 * Aramayı istemciye taşımak yerine küçük bir uç nokta kullanıyoruz: 24 ürünün
 * tamamını (açıklamalar, teknik tablolar dahil) JS bundle'ına koymak Lighthouse
 * hedefini bozardı. Burada sadece öneri kartı için gereken alanlar dönüyor.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const products = await searchProducts(query, 6);

  const results = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    image: p.images[0],
    price: p.price,
    salePrice: p.salePrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: getCategoryOf(p)?.name ?? "",
  }));

  return NextResponse.json({ results });
}

export type SearchResult = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
};
