import type { Metadata } from "next";

import { OrderSuccess } from "@/components/checkout/OrderSuccess";
import { ProductCard } from "@/components/product/ProductCard";
import { Carousel } from "@/components/ui/Carousel";
import { getPopularPicks } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Siparişiniz alındı",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage() {
  const picks = await getPopularPicks(6);

  return (
    <OrderSuccess
      recommendations={
        <Carousel
          title="Bunlar da ilgini çekebilir"
          subtitle="Siparişini tamamlayan müşterilerin sık aldığı diğer ürünler."
          viewAllHref="/urunler"
        >
          {picks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      }
    />
  );
}
