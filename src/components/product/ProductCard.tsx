import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { buildCartItem, defaultVariant, hasRealChoice } from "@/lib/cart-helpers";
import { cn } from "@/lib/cn";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { Product } from "@/lib/data/types";

import { QuickAddButton } from "./AddToCartButton";

/**
 * ÜRÜN KARTI
 *
 * Sunucu bileşeni; içindeki tek istemci parçası hızlı sepete ekleme butonu.
 * Böylece kategori sayfasında 24 kart render edilse bile tarayıcıya yalnızca
 * buton mantığı iniyor.
 *
 * Dönüşüm kuralları:
 *  - her kartta yıldız + yorum sayısı (sosyal kanıt) görünür
 *  - hover'da ikinci görsel (ürünü ikinci kez tanıtma fırsatı)
 *  - düşük stokta aciliyet etiketi
 *  - kartın üzerinde hızlı "Sepete Ekle"
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  /** Ana sayfada ilk sıradaki kartlar için LCP optimizasyonu. */
  priority?: boolean;
  className?: string;
}) {
  const variant = defaultVariant(product);
  const cartItem = buildCartItem(product, variant);
  const isSoldOut = product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const secondImage = product.images[1];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors hover:border-ink/25",
        className,
      )}
    >
      <Link
        href={`/urun/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden bg-surface-alt"
        // Kart başlığı zaten bağlantı metnini veriyor, ikinci kez okutma
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn(
            "object-cover transition-opacity duration-300",
            secondImage && "group-hover:opacity-0",
          )}
        />
        {secondImage && (
          <Image
            src={secondImage}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            loading="lazy"
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </Link>

      {/* Rozetler — sol üstte tek sütun */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
        {product.salePrice && (
          <Badge variant="discount">
            %{Math.floor(((product.price - product.salePrice) / product.price) * 100)} indirim
          </Badge>
        )}
        {product.isNew && <Badge variant="new">Yeni</Badge>}
        {isLowStock && <Badge variant="stock">Son {product.stock} adet</Badge>}
        {isSoldOut && <Badge variant="neutral">Tükendi</Badge>}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-sage">
          {product.brand}
        </p>

        <h3 className="font-display text-[0.98rem] font-semibold leading-snug text-ink">
          <Link
            href={`/urun/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {product.name}
          </Link>
        </h3>

        <Rating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto pt-2">
          <Price price={product.price} salePrice={product.salePrice} />
        </div>

        {/*
          Hızlı ekleme: masaüstünde hover/odak ile beliriyor, dokunmatik
          cihazlarda (hover yok) her zaman görünür. `relative z-10` kartın
          tamamını kaplayan bağlantı katmanının üstünde kalmasını sağlıyor.
        */}
        <div className="relative z-10 pt-1 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <QuickAddButton
            item={cartItem}
            disabled={isSoldOut}
            hasOptions={hasRealChoice(product)}
          />
        </div>
      </div>
    </article>
  );
}

/** Sepet içi ve çapraz satış blokları için küçük yatay kart. */
export function ProductCardCompact({ product }: { product: Product }) {
  return (
    <Link
      href={`/urun/${product.slug}`}
      className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-2.5 transition-colors hover:border-ink/25"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-alt">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="64px"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
        <Rating rating={product.rating} reviewCount={product.reviewCount} className="mt-0.5" />
        <Price
          price={product.price}
          salePrice={product.salePrice}
          size="sm"
          showBadge={false}
          className="mt-1"
        />
      </div>
    </Link>
  );
}
