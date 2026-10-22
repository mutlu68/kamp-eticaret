import { TruckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

/**
 * KARGO BEDAVA İLERLEME ÇUBUĞU
 *
 * Dönüşüm kuralı: sepette şart. Eşiğe kalan tutarı somut olarak göstermek,
 * sepet ortalamasını yükselten en etkili tek öğe. Eşik geçildiğinde çubuk
 * doluyor ve mesaj kutlamaya dönüyor.
 */
export function FreeShippingProgress({
  subtotal,
  className,
}: {
  subtotal: number;
  className?: string;
}) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualified = remaining === 0;

  return (
    <div className={cn("rounded-[var(--radius-card)] bg-stone/8 p-3.5", className)}>
      <p className="flex items-center gap-2 text-[0.82rem] font-medium text-stone">
        <TruckIcon className="shrink-0 text-base" />
        {qualified ? (
          <span>
            <strong className="font-bold">Tebrikler!</strong> Kargonuz bedava.
          </span>
        ) : (
          <span>
            Kargo bedavaya{" "}
            <strong className="font-bold">{formatPrice(remaining)}</strong> kaldı.
          </span>
        )}
      </p>

      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone/15"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ücretsiz kargo ilerlemesi"
      >
        <div
          className="h-full rounded-full bg-stone transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
