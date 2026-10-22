"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { CheckIcon, FlameIcon, TruckIcon } from "@/components/ui/Icons";
import { TrustRow } from "@/components/sections/TrustBand";
import { buildCartItem } from "@/lib/cart-helpers";
import { cn } from "@/lib/cn";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { Product, Variant } from "@/lib/data/types";
import { estimateDelivery, formatPrice } from "@/lib/format";
import { useMounted, useScrolledPast } from "@/lib/hooks";
import { useCart } from "@/store/cart";

import { AddToCartButton } from "./AddToCartButton";

/**
 * SATIN ALMA KUTUSU — dönüşümün kalbi
 *
 * Varyant seçimi fiyatı ve stoğu değiştirdiği için fiyat bloğu, adet seçici ve
 * sepete ekleme butonu tek bir istemci bileşeninde toplandı. Sayfanın geri
 * kalanı (açıklama, teknik tablo, yorumlar) sunucu bileşeni olarak kalıyor.
 *
 * Mobil sticky bar: asıl "Sepete Ekle" butonu ekrandan yukarı çıktığında
 * ekranın altına sabit bir bar beliriyor (useScrolledPast → IntersectionObserver).
 */
export function BuyBox({ product }: { product: Product }) {
  const [selectedId, setSelectedId] = useState(
    () => (product.variants.find((v) => v.stock > 0) ?? product.variants[0])?.id,
  );
  const [quantity, setQuantity] = useState(1);

  const addButtonRef = useRef<HTMLDivElement>(null);
  const scrolledPast = useScrolledPast(addButtonRef);

  const variant = product.variants.find((v) => v.id === selectedId);
  const cartItem = useMemo(() => buildCartItem(product, variant), [product, variant]);

  const stock = variant ? variant.stock : product.stock;
  const isSoldOut = stock <= 0;
  const isLowStock = !isSoldOut && stock <= LOW_STOCK_THRESHOLD;

  // Varyant değişince adet stoğu aşmasın
  const clampedQuantity = Math.min(quantity, Math.max(1, stock));

  const colorVariants = product.variants.filter((v) => v.kind === "color");
  const sizeVariants = product.variants.filter((v) => v.kind === "size");
  // "Tek beden" gibi tek seçenekli listelerde seçici göstermeye gerek yok
  const showSizePicker = sizeVariants.length > 1;

  return (
    <div>
      <Price
        price={cartItem.listPrice ?? cartItem.unitPrice}
        salePrice={cartItem.listPrice ? cartItem.unitPrice : undefined}
        size="lg"
      />

      {cartItem.listPrice && (
        <p className="mt-2 text-sm font-semibold text-stone">
          {formatPrice(cartItem.listPrice - cartItem.unitPrice)} tasarruf ediyorsunuz
        </p>
      )}

      <p className="mt-1.5 text-xs text-sage">
        Tüm fiyatlara KDV dahildir.
      </p>

      {/* Renk yuvarlakları */}
      {colorVariants.length > 0 && (
        <fieldset className="mt-7">
          <legend className="text-sm font-semibold text-ink">
            Renk:{" "}
            <span className="font-normal text-sage">
              {variant?.kind === "color" ? variant.label : "Seçiniz"}
            </span>
          </legend>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {colorVariants.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                disabled={option.stock <= 0}
                aria-pressed={option.id === selectedId}
                aria-label={
                  option.stock <= 0 ? `${option.label} — tükendi` : option.label
                }
                title={option.label}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors disabled:cursor-not-allowed",
                  option.id === selectedId
                    ? "border-ink"
                    : "border-line hover:border-sage",
                  option.stock <= 0 && "opacity-40",
                )}
              >
                <span
                  className="h-7 w-7 rounded-full ring-1 ring-inset ring-ink/10"
                  style={{ backgroundColor: option.swatch }}
                />
                {option.stock <= 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute h-px w-9 rotate-45 bg-ink/60"
                  />
                )}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Beden / kapasite butonları */}
      {showSizePicker && (
        <fieldset className="mt-7">
          <legend className="text-sm font-semibold text-ink">Seçenek</legend>

          <div className="mt-3 flex flex-wrap gap-2">
            {sizeVariants.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                disabled={option.stock <= 0}
                aria-pressed={option.id === selectedId}
                className={cn(
                  "rounded-[var(--radius-card)] border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  option.id === selectedId
                    ? "border-ink bg-ink text-bg"
                    : "border-line bg-surface text-ink hover:border-sage",
                )}
              >
                {option.label}
                {option.priceDelta ? (
                  <span className="ml-1.5 text-xs font-normal opacity-70">
                    +{formatPrice(option.priceDelta)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Aciliyet sinyalleri */}
      <div className="mt-7 space-y-2">
        {isSoldOut ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-sage">
            Bu seçenek şu anda tükendi
          </p>
        ) : (
          <>
            {isLowStock && (
              <p className="flex items-center gap-2 text-sm font-semibold text-stone">
                <FlameIcon className="text-base" />
                Stokta son {stock} adet
              </p>
            )}
            <DeliveryEstimate />
          </>
        )}
      </div>

      {/* Adet + sepete ekle */}
      <div ref={addButtonRef} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <QuantityStepper
          value={clampedQuantity}
          onChange={setQuantity}
          max={Math.max(1, stock)}
          className="shrink-0"
        />
        <AddToCartButton
          item={cartItem}
          quantity={clampedQuantity}
          size="lg"
          fullWidth
          disabled={isSoldOut}
        />
      </div>

      <TrustRow className="mt-4" />

      {/* Mobil sticky bar */}
      <StickyAddToCart
        product={product}
        variant={variant}
        quantity={clampedQuantity}
        visible={scrolledPast && !isSoldOut}
      />
    </div>
  );
}

/**
 * Teslimat tahmini yalnızca istemcide hesaplanır: "bugün" sunucuda derleme
 * anıdır, sayfa statik üretildiği için orada hesaplanan gün yanlış olurdu.
 */
function DeliveryEstimate() {
  const mounted = useMounted();

  return (
    <p className="flex min-h-5 items-center gap-2 text-sm text-sage">
      <TruckIcon className="text-base text-stone" />
      {mounted ? (
        <span>
          Bugün sipariş verin,{" "}
          <strong className="font-semibold text-ink">{estimateDelivery()}</strong>{" "}
          kapınızda
        </span>
      ) : (
        // Sunucu render'ında yer tutucu: hydration farkı oluşmasın
        <span>Teslimat tarihi hesaplanıyor...</span>
      )}
    </p>
  );
}

/**
 * MOBİLDE EKRANIN ALTINA SABİTLENEN SEPETE EKLE BARI
 * Dönüşüm kuralı: mobil ürün sayfasında şart.
 */
function StickyAddToCart({
  product,
  variant,
  quantity,
  visible,
}: {
  product: Product;
  variant?: Variant;
  quantity: number;
  visible: boolean;
}) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);
  const item = buildCartItem(product, variant);

  return (
    <div
      // Görünmezken tıklanamaz olmalı, yoksa altındaki içeriği engeller
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur transition-transform duration-200 lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="container-page flex items-center gap-3 py-3">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-alt">
          <Image
            src={product.images[0]}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-ink">
            {product.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink">
              {formatPrice(item.unitPrice * quantity)}
            </span>
            {variant && (
              <Badge variant="neutral" className="px-1.5 py-0.5 text-[0.65rem]">
                {variant.label}
              </Badge>
            )}
          </span>
        </span>

        <button
          type="button"
          onClick={() => {
            add({ ...item, quantity });
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1400);
          }}
          tabIndex={visible ? 0 : -1}
          className="flex h-12 shrink-0 items-center gap-1.5 rounded-[var(--radius-card)] bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-dark"
        >
          {justAdded ? (
            <>
              <CheckIcon className="text-base" />
              Eklendi
            </>
          ) : (
            "Sepete Ekle"
          )}
        </button>
      </div>
    </div>
  );
}
