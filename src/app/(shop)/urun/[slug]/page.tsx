import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BundleCrossSell, type BundleEntry } from "@/components/product/BundleCrossSell";
import { BuyBox } from "@/components/product/BuyBox";
import { Gallery } from "@/components/product/Gallery";
import { ProductCard } from "@/components/product/ProductCard";
import { Reviews } from "@/components/product/Reviews";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Carousel } from "@/components/ui/Carousel";
import { Rating } from "@/components/ui/Rating";
import { buildCartItem, defaultVariant } from "@/lib/cart-helpers";
import { STORE_NAME } from "@/lib/constants";
import { effectivePrice } from "@/lib/format";
import {
  getAllProductSlugs,
  getBundle,
  getCategoryOf,
  getProductBySlug,
  getRatingBreakdown,
  getRelated,
  getReviews,
} from "@/lib/repository";

/** 24 ürünün tamamı derleme anında statik üretilir — LCP için en hızlısı. */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/urun/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Ürün bulunamadı" };

  const category = getCategoryOf(product);

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${STORE_NAME}`,
      description: product.summary,
      images: [{ url: product.images[0], alt: product.name }],
    },
    other: category ? { "product:category": category.name } : undefined,
  };
}

export default async function ProductPage(props: PageProps<"/urun/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const category = getCategoryOf(product);

  const [reviews, breakdown, bundle, related] = await Promise.all([
    getReviews(product.id),
    getRatingBreakdown(product),
    getBundle(product),
    getRelated(product),
  ]);

  const price = effectivePrice(product.price, product.salePrice);

  /**
   * JSON-LD Product schema — Google'ın zengin sonuçlarında fiyat, stok ve
   * yıldız puanının görünmesini sağlar. Fiyat ve stok bilgisi sayfadaki
   * görünen bilgiyle birebir aynı olmalı, aksi halde Google yapılandırılmış
   * veriyi yok sayar.
   */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    category: category?.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: STORE_NAME },
    },
    review: reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      name: review.title,
      reviewBody: review.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `/kategori/${category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: product.name,
        item: `/urun/${product.slug}`,
      },
    ],
  };

  // Çapraz satış paketi için serileştirilebilir girdiler
  const mainEntry: BundleEntry = {
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    unitPrice: price,
    soldOut: product.stock <= 0,
    cartItem: buildCartItem(product, defaultVariant(product)),
  };

  const bundleEntries: BundleEntry[] = bundle.map((item) => ({
    slug: item.slug,
    name: item.name,
    image: item.images[0],
    unitPrice: effectivePrice(item.price, item.salePrice),
    soldOut: item.stock <= 0,
    cartItem: buildCartItem(item, defaultVariant(item)),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-page py-6 lg:py-10">
        <nav aria-label="Konum" className="mb-6 text-xs text-sage">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink hover:underline">
                Ana Sayfa
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/kategori/${category.slug}`}
                    className="hover:text-ink hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Gallery images={product.images} productName={product.name} />

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sage">
              {product.brand}
            </p>

            <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-[2.1rem]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Puana tıklayınca yorumlara kayar */}
              <a
                href="#yorumlar"
                className="inline-flex items-center gap-2 rounded-full py-1 underline-offset-4 hover:underline"
              >
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="md"
                />
                <span className="text-xs text-sage">değerlendirmeleri gör</span>
              </a>

              {product.isNew && <Badge variant="new">Yeni</Badge>}
            </div>

            <p className="mt-5 text-[0.95rem] leading-relaxed text-sage">
              {product.summary}
            </p>

            <BuyBox product={product} />
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Accordion
            items={[
              {
                id: "aciklama",
                title: "Ürün açıklaması",
                content: (
                  <div className="space-y-3">
                    {product.description.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ),
              },
              {
                id: "ozellikler",
                title: "Teknik özellikler",
                content: (
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-line">
                      {product.specs.map((spec) => (
                        <tr key={spec.label}>
                          <th
                            scope="row"
                            className="w-2/5 py-2.5 pr-4 font-medium text-ink"
                          >
                            {spec.label}
                          </th>
                          <td className="py-2.5 text-sage">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ),
              },
              {
                id: "kargo",
                title: "Kargo & İade",
                content: (
                  <div className="space-y-3">
                    <p>
                      1.500 TL üzeri siparişlerde kargo ücretsizdir. Saat 16:00
                      öncesi verilen siparişler aynı gün kargoya teslim edilir,
                      teslimat 2 iş günü sürer.
                    </p>
                    <p>
                      Ürünü teslim aldıktan sonra 14 gün içinde koşulsuz iade
                      edebilirsiniz. İade kargo ücreti bize aittir; kullanılmamış
                      ve etiketleri sökülmemiş olması yeterlidir.
                    </p>
                    <p>
                      Tüm ürünlerimiz üretim hatalarına karşı 2 yıl garantilidir.
                    </p>
                  </div>
                ),
              },
            ]}
          />

          <BundleCrossSell main={mainEntry} extras={bundleEntries} />
        </div>

        <div className="mt-16">
          <Reviews product={product} reviews={reviews} breakdown={breakdown} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-line py-14 sm:py-20">
          <Carousel
            title="Benzer ürünler"
            subtitle={
              category
                ? `${category.name} kategorisinden diğer seçenekler.`
                : undefined
            }
            viewAllHref={category ? `/kategori/${category.slug}` : "/urunler"}
          >
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Carousel>
        </div>
      )}
    </>
  );
}
