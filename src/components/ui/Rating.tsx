import { cn } from "@/lib/cn";
import { formatRating } from "@/lib/format";

import { StarIcon } from "./Icons";

/**
 * Yıldız + yorum sayısı.
 *
 * Dönüşüm kuralı: HER ürün kartında sosyal kanıt görünür. Bu yüzden bileşen
 * yorum sayısı 0 olsa bile yıldızları çizer.
 *
 * Kısmi yıldız, üst üste iki katman ve `clip-path` ile yapılıyor — böylece
 * 4.7 puan gerçekten 4.7 yıldız genişliğinde görünüyor.
 */
export function Rating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}) {
  const starSize = { sm: "text-[13px]", md: "text-base", lg: "text-lg" }[size];
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn("relative inline-flex", starSize)}
        role="img"
        aria-label={`5 üzerinden ${formatRating(rating)} puan`}
      >
        {/* Boş yıldızlar */}
        <span className="flex gap-0.5 text-sage/30">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} />
          ))}
        </span>
        {/* Dolu katman, puana göre kırpılıyor */}
        <span
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-[#C9A227]"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} />
          ))}
        </span>
      </span>

      {/*
        Yorum sayısı, ana puanla aynı renkte (text-sage) yazılıyor. Daha önce
        `text-sage/80` kullanılıyordu ama beyaz zeminde kontrastı 3.65:1'e
        düşüyordu — WCAG AA'nın küçük metin için istediği 4.5:1'in altında.
      */}
      {showCount && (
        <span className="text-xs text-sage tabular-nums">
          {formatRating(rating)}
          {reviewCount != null && <span> ({reviewCount})</span>}
        </span>
      )}
    </span>
  );
}
