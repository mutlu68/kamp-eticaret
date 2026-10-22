import Link from "next/link";

import { LockIcon, LogoMark } from "@/components/ui/Icons";
import { STORE_NAME } from "@/lib/constants";

/**
 * ÖDEME KABUĞU
 *
 * Dönüşüm kuralı: checkout dikkat dağıtıcı öğelerden arındırılır. Header'da
 * yalnızca logo var — arama, mega menü, sepet ikonu ve footer bilinçli olarak
 * yok. Bu adımda kullanıcının yapabileceği tek anlamlı iş siparişi tamamlamak.
 */
export default function CheckoutLayout({ children }: LayoutProps<"/"> ) {
  return (
    <>
      <header className="border-b border-line bg-bg">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-ink"
            aria-label={`${STORE_NAME} ana sayfa`}
          >
            <LogoMark className="text-[1.6rem]" />
            <span className="font-display text-lg font-bold tracking-tight">
              {STORE_NAME}
            </span>
          </Link>

          <span className="flex items-center gap-1.5 text-xs font-medium text-sage">
            <LockIcon className="text-base text-stone" />
            Güvenli ödeme
          </span>
        </div>
      </header>

      <main id="icerik" className="flex-1">
        {children}
      </main>
    </>
  );
}
