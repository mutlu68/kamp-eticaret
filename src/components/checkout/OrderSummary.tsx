"use client";

import Image from "next/image";
import { useState } from "react";

import { ChevronDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import type { CartItem } from "@/lib/data/types";
import { formatPrice } from "@/lib/format";

/**
 * SİPARİŞ ÖZETİ
 *
 * Masaüstünde sağ sütunda sabit (sticky) duruyor, mobilde formun üstünde
 * açılır-kapanır bir blok. Mobilde varsayılan kapalı: ilk ekranda formun
 * kendisi görünmeli, özet değil.
 */
export function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  savings,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  savings: number;
}) {
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <aside className="rounded-[var(--radius-card)] border border-line bg-surface lg:sticky lg:top-6">
      {/* Mobil başlık — dokununca açılır */}
      <button
        type="button"
        onClick={() => setOpenOnMobile((v) => !v)}
        aria-expanded={openOnMobile}
        aria-controls="siparis-ozeti"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          Sipariş özeti ({itemCount} ürün)
          <ChevronDownIcon
            className={cn("text-base text-sage transition-transform", openOnMobile && "rotate-180")}
          />
        </span>
        <span className="font-display text-lg font-bold text-ink">
          {formatPrice(total)}
        </span>
      </button>

      <h2 className="hidden px-5 pt-5 font-display text-lg font-bold text-ink lg:block">
        Sipariş özeti
      </h2>

      <div
        id="siparis-ozeti"
        className={cn("px-5 pb-5 lg:block", openOnMobile ? "block" : "hidden")}
      >
        <ul className="divide-y divide-line border-b border-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3 py-3.5">
              <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] font-bold text-bg">
                  {item.quantity}
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug text-ink">
                  {item.name}
                </span>
                {item.variantLabel && (
                  <span className="mt-0.5 block text-xs text-sage">
                    {item.variantLabel}
                  </span>
                )}
              </span>

              <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-sage">Ara toplam</dt>
            <dd className="font-medium text-ink tabular-nums">
              {formatPrice(subtotal)}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-sage">Kargo</dt>
            <dd className="font-medium text-ink tabular-nums">
              {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
            </dd>
          </div>
        </dl>

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-display text-base font-bold text-ink">Toplam</span>
          <span className="font-display text-2xl font-bold text-ink tabular-nums">
            {formatPrice(total)}
          </span>
        </div>

        {/*
          Tasarruf bir İNDİRİM SATIRI değil: ara toplam zaten indirimli
          fiyatlardan hesaplanıyor. "İndirimler −2.250 TL" diye ayrı bir satır
          koymak, toplamdan bir kez daha düşülüyormuş izlenimi veriyordu.
          Bu yüzden toplamın altında bir kazanç notu olarak duruyor.
        */}
        {savings > 0 && (
          <p className="mt-2 text-right text-xs font-semibold text-stone">
            Bu siparişte {formatPrice(savings)} tasarruf ettiniz
          </p>
        )}

        <p className="mt-1.5 text-right text-xs text-sage">KDV dahildir.</p>
      </div>
    </aside>
  );
}
