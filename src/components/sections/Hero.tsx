import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { StarIcon, TruckIcon } from "@/components/ui/Icons";

/**
 * HERO
 *
 * Tek mesaj, tek CTA. İkinci bir buton bilinçli olarak yok: iki eşit ağırlıklı
 * çağrı, tıklama oranını böler. Altındaki üç küçük güven satırı butonla
 * yarışmayacak ağırlıkta.
 *
 * Görsel `priority` ile yükleniyor — sayfanın LCP öğesi bu.
 * Topografya deseni yalnızca burada ve footer'da kullanılıyor (imza öğe).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface-alt">
      <div
        aria-hidden="true"
        className="topo-pattern pointer-events-none absolute inset-0 opacity-[0.07]"
      />

      <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-stone/10 px-3 py-1.5 text-xs font-semibold text-stone">
            <StarIcon className="text-[0.9rem]" />
            Sonbahar sezonu açıldı
          </p>

          <h1 className="mt-5 font-display text-[2.15rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Hava döndüğünde geri dönmek zorunda kalmayın
          </h1>

          <p className="mt-5 text-base leading-relaxed text-sage sm:text-lg">
            Rüzgârda sönmeyen ocaklar, eksi derecede uyutan tulumlar, sekiz
            dakikada kurulan çadırlar. Her ürün, satışa çıkmadan önce ekibimizle
            birlikte sahada bir gece geçirir.
          </p>

          <div className="mt-8">
            <ButtonLink href="/urunler" size="lg">
              Koleksiyonu Keşfet
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-sage">
            <span className="flex items-center gap-2">
              <TruckIcon className="text-base text-stone" />
              1.500 TL üzeri ücretsiz kargo
            </span>
            <span className="flex items-center gap-2">
              <Rating rating={4.7} showCount={false} />
              2.400+ değerlendirme
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface lg:aspect-square">
            <Image
              src="/img/categories/cadir.svg"
              alt="Yayla Pro 3 mevsim çadır, kurulu halde"
              fill
              // Hero görseli sayfanın LCP öğesi: hem öncelikli yüklenir hem de
              // tarayıcıya yüksek öncelik bildirilir (Lighthouse bunu ayrıca
              // denetliyor: "fetchpriority=high should be applied").
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>

          {/* Görselin üstünde küçük bir sosyal kanıt kartı */}
          <div className="absolute -bottom-4 left-4 max-w-[15rem] rounded-[var(--radius-card)] border border-line bg-surface p-3.5 shadow-[var(--shadow-lift)] sm:left-6">
            <Rating rating={4.7} reviewCount={128} />
            <p className="mt-1.5 text-xs leading-relaxed text-sage">
              &ldquo;İki gece sağanak yağdı, iç çadır kupkuru kaldı.&rdquo;
            </p>
            <p className="mt-1 text-xs font-semibold text-ink">Mert K. — Rize</p>
          </div>
        </div>
      </div>
    </section>
  );
}
