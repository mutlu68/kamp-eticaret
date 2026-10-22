import { cn } from "@/lib/cn";
import { discountPercent, formatPrice } from "@/lib/format";

import { Badge } from "./Badge";

/**
 * Fiyat bloğu.
 *
 * İndirim varsa: indirimli fiyat büyük ve koyu, liste fiyatı küçük ve üstü
 * çizili, yanında yüzde rozeti. Bu üçlü sıralama dönüşümde en çok test edilmiş
 * düzen — göz önce ödeyeceği tutarı, sonra referans fiyatı görüyor.
 */
export function Price({
  price,
  salePrice,
  size = "md",
  showBadge = true,
  onDark = false,
  className,
}: {
  price: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  /**
   * Koyu zeminde kullanım (kampanya bloğu). Yalnızca fiyat metinlerinin rengini
   * çevirir; indirim rozeti kendi rengini korur. Daha önce bu iş dışarıdan
   * `[&_*]:text-bg` ile yapılıyordu ve rozetin beyaz yazısını da kırık beyaza
   * çevirip kontrastı 4,49:1'e düşürüyordu (AA eşiği 4,5:1).
   */
  onDark?: boolean;
  className?: string;
}) {
  const onSale = Boolean(salePrice && salePrice < price);
  const current = onSale ? salePrice! : price;
  const percent = onSale ? discountPercent(price, salePrice!) : 0;

  const currentSize = {
    sm: "text-[0.95rem]",
    md: "text-lg",
    lg: "text-[1.75rem] leading-none",
  }[size];

  const oldSize = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-display font-bold tracking-tight",
          onDark ? "text-bg" : "text-ink",
          currentSize,
        )}
      >
        {formatPrice(current)}
      </span>

      {onSale && (
        <>
          <span
            className={cn(
              "line-through",
              onDark ? "text-bg/70" : "text-sage",
              oldSize,
            )}
          >
            {formatPrice(price)}
          </span>
          {showBadge && <Badge variant="discount">%{percent}</Badge>}
        </>
      )}
    </div>
  );
}
