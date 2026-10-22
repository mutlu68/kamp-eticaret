"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CartIcon, CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { useCart, type AddToCartInput } from "@/store/cart";

/**
 * SEPETE EKLE
 *
 * Dönüşüm kuralı: sepete ekleme ASLA sayfa yenilemez. Buton state'i istemcide
 * güncelliyor, sepet drawer'ı otomatik açılıyor (store içindeki `add` bunu
 * yapıyor) ve butonda kısa bir "Eklendi" onayı beliriyor.
 */
export function AddToCartButton({
  item,
  quantity = 1,
  size = "md",
  variant = "primary",
  fullWidth,
  label = "Sepete Ekle",
  className,
  disabled,
  disabledLabel = "Tükendi",
}: {
  item: AddToCartInput;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "dark";
  fullWidth?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    add({ ...item, quantity });
    setJustAdded(true);
    // Onay durumu kısa sürsün; drawer zaten asıl geri bildirimi veriyor
    setTimeout(() => setJustAdded(false), 1400);
  }

  if (disabled) {
    return (
      <Button size={size} variant="secondary" fullWidth={fullWidth} disabled className={className}>
        {disabledLabel}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      onClick={handleClick}
      className={cn("relative", className)}
      aria-label={`${item.name} ürününü sepete ekle`}
    >
      {justAdded ? (
        <>
          <CheckIcon className="text-[1.1em]" />
          Eklendi
        </>
      ) : (
        <>
          <CartIcon className="text-[1.1em]" />
          {label}
        </>
      )}
    </Button>
  );
}

/**
 * Ürün kartı üzerindeki kompakt hızlı ekleme butonu.
 * Kart görselinin altına, hover/focus ile beliren şekilde yerleşir; mobilde
 * her zaman görünür (dokunmatik cihazda hover yok).
 */
export function QuickAddButton({
  item,
  disabled,
  hasOptions,
}: {
  item: AddToCartInput;
  disabled?: boolean;
  /** Üründe birden fazla varyant varsa kullanıcıya hangisinin eklendiği söylenir. */
  hasOptions?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  if (disabled) {
    return (
      <span className="flex h-10 w-full items-center justify-center rounded-[var(--radius-card)] border border-line bg-surface text-sm font-semibold text-sage">
        Tükendi
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        // Kart bir <Link> içinde: tıklama ürün sayfasına gitmesin
        event.preventDefault();
        event.stopPropagation();
        add({ ...item, quantity: 1 });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
      }}
      title={
        hasOptions
          ? `${item.variantLabel} seçeneği eklenir, ürün sayfasından değiştirebilirsiniz`
          : undefined
      }
      className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[var(--radius-card)] bg-cta text-sm font-semibold text-white transition-colors hover:bg-cta-dark"
    >
      {justAdded ? (
        <>
          <CheckIcon className="text-base" />
          Eklendi
        </>
      ) : (
        <>
          <CartIcon className="text-base" />
          Sepete Ekle
        </>
      )}
    </button>
  );
}
