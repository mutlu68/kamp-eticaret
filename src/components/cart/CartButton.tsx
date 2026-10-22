"use client";

import { CartIcon } from "@/components/ui/Icons";
import { useCartHydrated } from "@/lib/hooks";
import { selectItemCount, useCart } from "@/store/cart";

/**
 * Header'daki sepet düğmesi + adet rozeti.
 *
 * Rozet, sepet localStorage'dan okunana kadar gizli kalır (useCartHydrated).
 * Aksi halde sunucu "0" yazar, istemci "3" yazar ve React hydration hatası
 * verir.
 *
 * Rozet her değiştiğinde CSS `cart-pop` animasyonu çalışır — sepete ekleme
 * onayının sayfa yenilemeden verildiği ikinci sinyal (birincisi drawer).
 */
export function CartButton() {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = selectItemCount(items);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-[1.35rem] text-ink transition-colors hover:bg-ink/5"
      aria-label={
        hydrated && count > 0 ? `Sepeti aç, ${count} ürün` : "Sepeti aç"
      }
    >
      <CartIcon />
      {hydrated && count > 0 && (
        <span
          // key: adet değişince animasyon yeniden tetiklensin
          key={count}
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[0.7rem] font-bold leading-none text-bg [animation:cart-pop_320ms_ease-out]"
        >
          {count}
        </span>
      )}
    </button>
  );
}
