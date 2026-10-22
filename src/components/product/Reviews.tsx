import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { StarIcon } from "@/components/ui/Icons";
import type { Product, Review } from "@/lib/data/types";
import { formatDate, formatRating } from "@/lib/format";

/**
 * YORUM BÖLÜMÜ
 *
 * Solda puan dağılım grafiği (özet), sağda tekil yorumlar. Dağılım çubukları
 * ürünün ortalaması ve toplam yorum sayısından türetiliyor
 * (repository.getRatingBreakdown) — gerçek veritabanında bu bir GROUP BY olur.
 *
 * `id="yorumlar"` başlıktaki yıldızlara tıklandığında buraya scroll etmek için.
 */
export function Reviews({
  product,
  reviews,
  breakdown,
}: {
  product: Product;
  reviews: Review[];
  breakdown: { stars: number; count: number; percent: number }[];
}) {
  return (
    <section id="yorumlar" className="scroll-mt-28 border-t border-line pt-12">
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Değerlendirmeler
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
        {/* Özet */}
        <div>
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold leading-none text-ink">
              {formatRating(product.rating)}
            </span>
            <span className="pb-1">
              <Rating rating={product.rating} showCount={false} size="md" />
              <span className="mt-1 block text-xs text-sage">
                {product.reviewCount} değerlendirme
              </span>
            </span>
          </div>

          <ul className="mt-6 space-y-2">
            {breakdown.map((row) => (
              <li key={row.stars} className="flex items-center gap-3">
                <span className="flex w-10 shrink-0 items-center gap-1 text-xs text-sage tabular-nums">
                  {row.stars}
                  <StarIcon className="text-[0.7rem] text-[#C9A227]" />
                </span>

                <span
                  className="h-2 flex-1 overflow-hidden rounded-full bg-surface-alt"
                  role="img"
                  aria-label={`${row.stars} yıldız: %${row.percent}, ${row.count} değerlendirme`}
                >
                  <span
                    className="block h-full rounded-full bg-sage"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>

                <span className="w-10 shrink-0 text-right text-xs text-sage tabular-nums">
                  %{row.percent}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-[var(--radius-card)] bg-stone/8 p-3.5 text-xs leading-relaxed text-stone">
            Değerlendirmeler yalnızca ürünü satın almış ve teslim almış
            müşterilere açıktır. Yorumlar düzenlenmez, sıralama tarihe göredir.
          </p>
        </div>

        {/* Tekil yorumlar */}
        <div>
          {reviews.length === 0 ? (
            <p className="text-sm text-sage">
              Bu ürün için henüz yazılı yorum yok.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {reviews.map((review) => (
                <li key={review.id} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Rating rating={review.rating} showCount={false} />
                    <h3 className="font-display text-base font-semibold text-ink">
                      {review.title}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-sage">
                    {review.body}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-sage">
                    <span className="font-semibold text-ink">{review.author}</span>
                    <span>{formatDate(review.date)}</span>
                    {review.verified && (
                      <Badge variant="info" className="text-[0.65rem]">
                        Doğrulanmış alışveriş
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
