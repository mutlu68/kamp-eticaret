import { LockIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * GÜVEN BANDI
 *
 * Dört madde: kargo, iade, ödeme güvenliği, garanti. Renk olarak kaya mavisi
 * (--color-stone) kullanılıyor; turuncuyla yarışmaması için bilinçli tercih.
 *
 * `compact` sürümü ürün sayfasında Sepete Ekle butonunun hemen altında
 * kullanılıyor — satın alma kararının verildiği saniyede itirazları karşılıyor.
 */
const items = [
  {
    icon: TruckIcon,
    title: "Ücretsiz kargo",
    text: "1.500 TL üzeri siparişlerde",
  },
  {
    icon: ReturnIcon,
    title: "14 gün iade",
    text: "Koşulsuz, kargo bizden",
  },
  {
    icon: LockIcon,
    title: "Güvenli ödeme",
    text: "256-bit SSL, 3D Secure",
  },
  {
    icon: ShieldIcon,
    title: "2 yıl garanti",
    text: "Üretim hatalarına karşı",
  },
];

export function TrustBand({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-line bg-surface", className)}>
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-7 py-9 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone/10 text-xl text-stone">
              <Icon />
            </span>
            <span>
              <span className="block font-display text-sm font-bold text-ink">
                {title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-sage">
                {text}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Ürün sayfasında butonun altına giren tek satırlık kompakt sürüm. */
export function TrustRow({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-sage",
        className,
      )}
    >
      <li className="flex items-center gap-1.5">
        <ReturnIcon className="text-sm text-stone" />
        14 gün koşulsuz iade
      </li>
      <li className="flex items-center gap-1.5">
        <ShieldIcon className="text-sm text-stone" />2 yıl garanti
      </li>
      <li className="flex items-center gap-1.5">
        <LockIcon className="text-sm text-stone" />
        Güvenli ödeme
      </li>
    </ul>
  );
}
