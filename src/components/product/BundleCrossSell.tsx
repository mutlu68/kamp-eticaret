"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckIcon, PlusIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { BUNDLE_DISCOUNT_PERCENT } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { useCart, type AddToCartInput } from "@/store/cart";

export interface BundleEntry {
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  soldOut: boolean;
  cartItem: AddToCartInput;
}

/**
 * "BİRLİKTE ALINANLAR" ÇAPRAZ SATIŞ
 *
 * Ana ürün + iki tamamlayıcı ürün. Kullanıcı istediğini işaretleyip kaldırıyor;
 * ana ürünün işareti kaldırılamıyor (paketin çıpası o).
 *
 * İki veya daha fazla ürün seçiliyse %12 paket indirimi uygulanıyor. İndirim
 * satır bazında dağıtılıyor ki sepette gösterilen tutar toplamla tutarlı olsun.
 */
export function BundleCrossSell({
  main,
  extras,
}: {
  main: BundleEntry;
  extras: BundleEntry[];
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);

  const available = extras.filter((extra) => !extra.soldOut);
  const [selected, setSelected] = useState<string[]>(
    available.map((extra) => extra.slug),
  );
  const [added, setAdded] = useState(false);

  if (available.length === 0) return null;

  const chosen = [main, ...available.filter((extra) => selected.includes(extra.slug))];
  const rawTotal = chosen.reduce((sum, entry) => sum + entry.unitPrice, 0);
  const discountApplies = chosen.length >= 2;
  const total = discountApplies
    ? Math.round(rawTotal * (1 - BUNDLE_DISCOUNT_PERCENT / 100))
    : rawTotal;

  function addBundle() {
    const factor = discountApplies ? 1 - BUNDLE_DISCOUNT_PERCENT / 100 : 1;

    for (const entry of chosen) {
      add({
        ...entry.cartItem,
        // Paket indirimi satır bazında uygulanıyor
        unitPrice: Math.round(entry.cartItem.unitPrice * factor),
        listPrice: entry.cartItem.listPrice ?? entry.cartItem.unitPrice,
        quantity: 1,
      });
    }

    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-lg font-bold text-ink">
          Birlikte alınanlar
        </h2>
        {discountApplies && (
          <Badge variant="discount">%{BUNDLE_DISCOUNT_PERCENT} paket indirimi</Badge>
        )}
      </div>

      <p className="mt-1.5 text-sm text-sage">
        Bu ürünü alanların çoğu bunları da birlikte alıyor.
      </p>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
        {/*
          Mobilde 2 sütunlu ızgara, sm ve üstünde "ürün + ürün + ürün" şeklinde
          yan yana dizilim. Dar ekranda artı işaretlerini araya sıkıştırmak
          kartları kaydırıp düzeni tırtıklı gösteriyordu; o yüzden artı işareti
          yalnızca yatay dizilimde görünüyor.
        */}
        <ul className="grid flex-1 grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          {[main, ...available].map((entry, index) => {
            const isMain = index === 0;
            const isChecked = isMain || selected.includes(entry.slug);

            return (
              <li key={entry.slug} className="flex items-center gap-3">
                {index > 0 && (
                  <PlusIcon
                    aria-hidden="true"
                    className="hidden text-base text-sage sm:block"
                  />
                )}

                <label
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-2 rounded-[var(--radius-card)] border p-2.5 transition-colors sm:w-36",
                    isChecked ? "border-ink/30 bg-surface-alt" : "border-line",
                    isMain && "cursor-default",
                  )}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-md bg-surface-alt">
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="144px"
                      loading="lazy"
                      className={cn("object-cover", !isChecked && "opacity-45")}
                    />
                  </span>

                  <span className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isMain}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, entry.slug]
                            : current.filter((slug) => slug !== entry.slug),
                        )
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-ink)]"
                      aria-label={`${entry.name} ürününü pakete dahil et`}
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold leading-snug text-ink">
                        {isMain ? (
                          <span className="line-clamp-2">{entry.name}</span>
                        ) : (
                          <Link
                            href={`/urun/${entry.slug}`}
                            className="line-clamp-2 hover:underline"
                          >
                            {entry.name}
                          </Link>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-sage">
                        {formatPrice(entry.unitPrice)}
                      </span>
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="shrink-0 lg:w-56 lg:border-l lg:border-line lg:pl-6">
          <p className="text-xs text-sage">
            {chosen.length} ürünlük paket toplamı
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">
              {formatPrice(total)}
            </span>
            {discountApplies && (
              <span className="text-sm text-sage line-through">
                {formatPrice(rawTotal)}
              </span>
            )}
          </p>

          <Button onClick={addBundle} fullWidth className="mt-3">
            {added ? (
              <>
                <CheckIcon className="text-base" />
                Sepete eklendi
              </>
            ) : (
              "Paketi Sepete Ekle"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
