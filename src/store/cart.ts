"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";
import type { CartItem } from "@/lib/data/types";

/**
 * SEPET DURUMU
 * ============
 * Zustand + persist(localStorage). Sepet sayfa yenilense de kaybolmuyor.
 *
 * HİDRASYON NOTU (kritik):
 * localStorage sunucuda yok. Sunucu HTML'i her zaman BOŞ sepetle üretilir,
 * istemci ise saklanmış sepetle uyanır. Bu ikisi ilk render'da farklı olursa
 * React hydration hatası verir. Bu yüzden sepete bağlı her görsel öğe
 * (header rozeti, drawer içeriği, ilerleme çubuğu) `useCartHydrated()`
 * true dönene kadar boş/iskelet render etmeli.
 */

/** Yeni satır eklerken verilen bilgi — `key` ve `quantity` burada üretilir. */
export type AddToCartInput = Omit<CartItem, "key" | "quantity"> & {
  quantity?: number;
};

interface CartState {
  items: CartItem[];
  /** Drawer açık mı — kalıcı DEĞİL, her oturumda kapalı başlar. */
  isOpen: boolean;
  /** Son eklenen satır; drawer'da kısa bir vurgu animasyonu için. */
  lastAddedKey: string | null;

  add: (input: AddToCartInput) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

/** Aynı ürünün aynı varyantı tek satırda toplansın diye birleşik anahtar. */
function cartKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastAddedKey: null,

      add: (input) =>
        set((state) => {
          const key = cartKey(input.productId, input.variantId);
          const quantity = input.quantity ?? 1;
          const existing = state.items.find((i) => i.key === key);

          const items = existing
            ? state.items.map((i) =>
                i.key === key
                  ? {
                      ...i,
                      // Stok üst sınırını aşma
                      quantity: Math.min(i.quantity + quantity, i.maxQuantity),
                    }
                  : i,
              )
            : [
                ...state.items,
                {
                  ...input,
                  key,
                  quantity: Math.min(quantity, input.maxQuantity),
                },
              ];

          // Sepete ekleme asla sayfa yenilemez: drawer'ı burada açıyoruz
          return { items, isOpen: true, lastAddedKey: key };
        }),

      remove: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) =>
                  i.key === key
                    ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
                    : i,
                ),
        })),

      clear: () => set({ items: [], lastAddedKey: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false, lastAddedKey: null }),
    }),
    {
      name: "kamp-rotasi-sepet",
      version: 1,
      // Sadece satırları sakla; drawer'ın açık olması kalıcı olmamalı
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// ------------------------------------------------------------------ TÜRETİLEN

export function selectItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

/** Liste fiyatı üzerinden toplam tasarruf — sepette "kazancınız" satırı. */
export function selectSavings(items: CartItem[]): number {
  return items.reduce(
    (sum, i) => sum + ((i.listPrice ?? i.unitPrice) - i.unitPrice) * i.quantity,
    0,
  );
}

export function selectShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

/** Kargo bedava eşiğine kalan tutar; 0 ise eşik geçilmiş demektir. */
export function selectRemainingForFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}
