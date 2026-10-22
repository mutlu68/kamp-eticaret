import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Rozet.
 *
 * `discount` varyantı, Button primary dışındaki TEK turuncu yüzeydir
 * (bkz. Button.tsx içindeki turuncu kuralı). Diğer tüm rozetler koyu yeşil,
 * adaçayı veya kaya mavisi kullanır.
 */
type Variant = "discount" | "new" | "stock" | "neutral" | "info";

const variants: Record<Variant, string> = {
  // İzinli ikinci turuncu yüzey: indirim yüzdesi
  discount: "bg-cta text-white",
  new: "bg-ink text-bg",
  // Düşük stok uyarısı — dikkat çekmeli ama turuncuyla yarışmamalı
  stock: "bg-white text-stone ring-1 ring-stone/25",
  neutral: "bg-white/90 text-ink ring-1 ring-line",
  info: "bg-stone/10 text-stone",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
