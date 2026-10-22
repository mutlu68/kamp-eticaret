import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Category } from "@/lib/data/types";

/**
 * KATEGORİ VİTRİNİ
 *
 * Altı kategori, görselli kartlar. İlk kart mobilde tam genişlik, masaüstünde
 * iki sütun kaplıyor — ziyaretçinin gözü doğal olarak en çok satan kategoriye
 * (çadır) düşüyor.
 */
export function CategoryShowcase({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  return (
    <section className="container-page py-14 sm:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Neye ihtiyacınız var?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-sage sm:text-base">
          Kamp kurulumunun her parçası için ayrı ayrı seçilmiş ekipman.
        </p>
      </div>

      {/*
        6 kategori, masaüstünde 3 sütun = tam iki sıra. Daha önce ilk kart
        2x2 kaplıyordu ama 4 sütunlu ızgarada 5 küçük kart tam sıra yapmıyor,
        sonuncusu tek başına alta düşüyordu. Eşit ızgara hem daha temiz duruyor
        hem kategori sayısı değişse de bozulmuyor.
      */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {categories.map((category, index) => (
          <li key={category.id}>
            <Link
              href={`/kategori/${category.slug}`}
              className="group relative block h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-alt transition-colors hover:border-ink/25"
            >
              <div className="relative aspect-4/3">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Metnin okunması için alttan koyulaşan katman */}
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div>
                  <h3 className="font-display text-base font-bold text-white sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white">
                    {counts[category.id] ?? 0} ürün
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-base text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-ink">
                  <ArrowRightIcon />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
