import Link from "next/link";

import { ShopChrome } from "@/components/layout/ShopChrome";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { getFeaturedCategories, getPopularPicks } from "@/lib/repository";

/**
 * 404
 *
 * Çıkmaz sokak olmamalı: header ve arama kutusu burada da var, altında
 * kategori kısayolları ve en çok satan ürünler. Kaybolan ziyaretçiyi
 * mağazada tutmanın en ucuz yolu.
 */
export default async function NotFound() {
  const [picks, categories] = await Promise.all([
    getPopularPicks(6),
    getFeaturedCategories(),
  ]);

  return (
    <ShopChrome>
      <div className="container-page py-16 text-center sm:py-24">
        <p className="font-display text-6xl font-bold text-line sm:text-7xl">404</p>

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Bu patika bir yere çıkmıyor
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sage sm:text-base">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Aşağıdan
          devam edebilir ya da üstteki arama kutusunu kullanabilirsiniz.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/urunler" size="lg">
            Tüm ürünler
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Ana sayfa
          </ButtonLink>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${category.slug}`}
                className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line py-14">
        <Carousel
          title="Çok satanlara göz atın"
          viewAllHref="/urunler?sirala=cok-satan"
        >
          {picks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </ShopChrome>
  );
}
