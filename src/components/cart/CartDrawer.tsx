"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { CartSuggestion } from "@/app/api/sepet-onerileri/route";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CartIcon, LockIcon, TrashIcon } from "@/components/ui/Icons";
import { Drawer } from "@/components/ui/Drawer";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useCartHydrated } from "@/lib/hooks";
import {
  selectItemCount,
  selectSavings,
  selectSubtotal,
  useCart,
} from "@/store/cart";

import { FreeShippingProgress } from "./FreeShippingProgress";

/**
 * SEPET DRAWER
 *
 * Dönüşüm kuralları:
 *  - sepet ayrı bir SAYFA değil, yandan açılan panel
 *  - sepete ekleyince otomatik açılır (store içindeki `add` isOpen: true yapar)
 *  - kargo bedava ilerleme çubuğu her zaman görünür
 *  - "Bunları unutma" ile iki küçük çapraz satış önerisi
 *  - tek ve büyük "Ödemeye Geç" butonu
 */
export function CartDrawer() {
  const hydrated = useCartHydrated();
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const lastAddedKey = useCart((s) => s.lastAddedKey);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  const subtotal = selectSubtotal(items);
  const savings = selectSavings(items);
  const count = selectItemCount(items);

  const [suggestions, setSuggestions] = useState<CartSuggestion[]>([]);

  // Bağımlılık olarak dizinin kendisi değil, ürün kimliklerinden üretilmiş
  // sabit bir metin kullanılıyor: adet değiştirmek öneri isteğini tetiklemesin,
  // yalnızca sepetteki ÜRÜNLER değişince yeniden çekilsin.
  const excludeKey = items
    .map((i) => i.productId)
    .sort()
    .join(",");

  // Öneriler yalnızca panel açıkken çekilir — kapalıyken ağ trafiği yok
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    fetch(`/api/sepet-onerileri?haric=${encodeURIComponent(excludeKey)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { suggestions: CartSuggestion[] }) => setSuggestions(data.suggestions))
      .catch(() => setSuggestions([]));

    return () => controller.abort();
  }, [isOpen, excludeKey]);

  // Hidrasyon tamamlanmadan paneli açma: sunucu ile istemcinin sepeti farklı
  if (!hydrated) return null;

  const isEmpty = items.length === 0;

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={isEmpty ? "Sepetiniz" : `Sepetiniz (${count} ürün)`}
      footer={
        isEmpty ? undefined : (
          <div>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm text-sage">Ara toplam</span>
              <span className="font-display text-xl font-bold text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            {savings > 0 && (
              <p className="mb-2 text-right text-xs font-semibold text-stone">
                Bu sepette {formatPrice(savings)} tasarruf ediyorsunuz
              </p>
            )}

            <p className="mb-3 text-xs text-sage">
              Kargo ve vergiler ödeme adımında hesaplanır.
            </p>

            <ButtonLink href="/odeme" size="lg" fullWidth onClick={closeCart}>
              Ödemeye Geç
            </ButtonLink>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-sage">
              <LockIcon className="text-sm" />
              256-bit SSL ile güvenli ödeme
            </p>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyCart onClose={closeCart} />
      ) : (
        <div className="px-5 py-4">
          <FreeShippingProgress subtotal={subtotal} className="mb-5" />

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.key}
                className={cn(
                  "flex gap-3 py-4 transition-colors",
                  // Son eklenen satır kısa süre vurgulanır
                  item.key === lastAddedKey && "bg-stone/5",
                )}
              >
                <Link
                  href={`/urun/${item.slug}`}
                  onClick={closeCart}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-surface-alt"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/urun/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-semibold leading-snug text-ink hover:underline"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      aria-label={`${item.name} ürününü sepetten çıkar`}
                      className="-mt-1 shrink-0 p-1 text-base text-sage transition-colors hover:text-ink"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {item.variantLabel && (
                    <p className="mt-0.5 text-xs text-sage">{item.variantLabel}</p>
                  )}

                  <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      max={item.maxQuantity}
                      min={1}
                      onChange={(next) => setQuantity(item.key, next)}
                      label={`${item.name} adedi`}
                    />

                    <div className="text-right">
                      <p className="text-sm font-bold text-ink">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                      {item.listPrice && (
                        <p className="text-xs text-sage line-through">
                          {formatPrice(item.listPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.quantity >= item.maxQuantity && (
                    <p className="mt-1.5 text-xs text-stone">
                      Bu üründe stok sınırına ulaştınız
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {suggestions.length > 0 && <CrossSell suggestions={suggestions} />}
        </div>
      )}
    </Drawer>
  );
}

/** Sepette çapraz satış: "Bunları unutma" */
function CrossSell({ suggestions }: { suggestions: CartSuggestion[] }) {
  const add = useCart((s) => s.add);

  return (
    <section className="mt-6 border-t border-line pt-5">
      <h3 className="font-display text-sm font-bold text-ink">Bunları unutma</h3>
      <p className="mt-1 text-xs text-sage">
        Kamp çantasında en çok eksik kalan küçük parçalar.
      </p>

      <ul className="mt-3 space-y-2.5">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.slug}
            className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-2.5"
          >
            <Link
              href={`/urun/${suggestion.slug}`}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-alt"
            >
              <Image
                src={suggestion.image}
                alt={suggestion.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/urun/${suggestion.slug}`}
                className="block truncate text-[0.8rem] font-semibold text-ink hover:underline"
              >
                {suggestion.name}
              </Link>
              <p className="text-xs font-bold text-ink">
                {formatPrice(suggestion.salePrice ?? suggestion.price)}
              </p>
            </div>

            <Button
              size="sm"
              variant="secondary"
              disabled={suggestion.soldOut}
              onClick={() => add(suggestion.cartItem)}
              className="shrink-0"
            >
              Ekle
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt text-3xl text-sage">
        <CartIcon />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold text-ink">
        Sepetiniz henüz boş
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-sage">
        Çadırdan uyku tulumuna, ocaktan kamp sandalyesine kadar tüm ekipmana göz
        atın.
      </p>
      <ButtonLink href="/urunler" size="md" className="mt-6" onClick={onClose}>
        Ürünleri keşfet
      </ButtonLink>
    </div>
  );
}
