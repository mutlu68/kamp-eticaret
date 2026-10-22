import type { Metadata } from "next";

import { CollectionView } from "@/components/collection/CollectionView";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description:
    "Çadırdan uyku tulumuna, kamp ocağından aydınlatmaya kadar tüm kamp ekipmanı. Fiyata, markaya, puana ve stok durumuna göre filtreleyin.",
  alternates: { canonical: "/urunler" },
};

export default async function AllProductsPage(props: PageProps<"/urunler">) {
  const searchParams = await props.searchParams;

  return (
    <CollectionView
      title="Tüm Ürünler"
      description="Sahada denenmiş kamp ekipmanının tamamı. Filtreleri kullanarak aradığınızı hızlıca daraltın."
      searchParams={searchParams}
    />
  );
}
