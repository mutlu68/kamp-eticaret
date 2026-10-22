"use client";

import { cn } from "@/lib/cn";

import { MinusIcon, PlusIcon } from "./Icons";

/**
 * Adet seçici. Hem ürün sayfasında hem sepet satırlarında kullanılıyor.
 * Üst sınır her zaman stok; kullanıcı sepete stoktan fazlasını koyamaz.
 */
export function QuantityStepper({
  value,
  onChange,
  max = 99,
  min = 1,
  size = "md",
  label = "Adet",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const box = size === "sm" ? "h-9" : "h-12";
  const button = size === "sm" ? "w-9 text-sm" : "w-12 text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-card)] border border-line bg-surface",
        box,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label} azalt`}
        className={cn(
          "flex h-full items-center justify-center text-ink transition-colors hover:bg-surface-alt disabled:opacity-35 disabled:hover:bg-transparent",
          button,
        )}
      >
        <MinusIcon />
      </button>

      <span
        className={cn(
          "min-w-8 text-center font-semibold tabular-nums",
          size === "sm" ? "text-sm" : "text-base",
        )}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${label} artır`}
        className={cn(
          "flex h-full items-center justify-center text-ink transition-colors hover:bg-surface-alt disabled:opacity-35 disabled:hover:bg-transparent",
          button,
        )}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
