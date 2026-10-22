import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getCategories, getCategoryCounts } from "@/lib/repository";

/**
 * Mağaza kabuğu: duyuru barı, header, footer ve sepet paneli.
 *
 * Hem (shop) route group'unun düzeni hem de 404 sayfası bunu kullanıyor —
 * böylece "sayfa bulunamadı" ekranında da gezinme ve arama elimizin altında
 * kalıyor (dönüşüm için önemli: 404 çıkmaz sokak olmamalı).
 */
export async function ShopChrome({ children }: { children: ReactNode }) {
  // Kategori listesi header ve footer'ın ikisinde de gerekiyor; tek yerde
  // okunup aşağı geçiriliyor.
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header categories={categories} counts={counts} />

      <main id="icerik" className="flex-1">
        {children}
      </main>

      <Footer categories={categories} />

      {/* Sepet paneli her sayfada hazır bekler; sepete ekleme onu açar */}
      <CartDrawer />
    </>
  );
}
