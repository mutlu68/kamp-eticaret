import { Carousel } from "@/components/ui/Carousel";
import { Rating } from "@/components/ui/Rating";
import { CheckIcon } from "@/components/ui/Icons";
import type { Testimonial } from "@/lib/data/types";

/**
 * SOSYAL KANIT KARUSELİ
 *
 * Yorumlar hangi ürüne ait olduğu belirtilerek gösteriliyor — "harika ürün"
 * tipi soyut övgü yerine somut bir deneyim, ikna edici olan da bu.
 *
 * Avatarlar stok fotoğraf değil, kişinin baş harflerinden üretilen renkli
 * daireler: sahte insan fotoğrafı kullanmak güveni zedeler.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-14 sm:py-20">
      <Carousel
        title="Müşterilerimiz ne diyor?"
        subtitle="2.400'den fazla doğrulanmış değerlendirme, ortalama 4,7 puan."
        itemClassName="w-[80vw] max-w-[360px] sm:w-[360px]"
      >
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.id}
            className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5"
          >
            <Rating rating={testimonial.rating} showCount={false} size="md" />

            <blockquote className="mt-3.5 flex-1 text-[0.95rem] leading-relaxed text-ink">
              {testimonial.body}
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                style={{
                  // %42 açıklıkta beyaz metinle kontrast 3,9:1'de kalıyordu;
                  // %30 ile 4,5:1 eşiği güvenli biçimde aşılıyor.
                  backgroundColor: `hsl(${testimonial.avatarHue} 34% 30%)`,
                }}
              >
                {testimonial.author
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {testimonial.author}
                  <span className="font-normal text-sage"> · {testimonial.location}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-sage">
                  <CheckIcon className="text-sm text-stone" />
                  {testimonial.productName}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </section>
  );
}
