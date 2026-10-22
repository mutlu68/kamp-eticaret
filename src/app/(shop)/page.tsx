import { ProductCard } from "@/components/product/ProductCard";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { CountdownPromo } from "@/components/sections/CountdownPromo";
import { Hero } from "@/components/sections/Hero";
import { Newsletter } from "@/components/sections/Newsletter";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBand } from "@/components/sections/TrustBand";
import { Carousel } from "@/components/ui/Carousel";
import {
  getBestSellers,
  getCategoryCounts,
  getDeals,
  getFeaturedCategories,
  getTestimonials,
} from "@/lib/repository";

/**
 * ANA SAYFA
 *
 * Bölüm sırası bilinçli: önce tek mesajlı hero, sonra "neye ihtiyacın var"
 * (kategori), sonra "başkaları ne alıyor" (çok satanlar), ardından itirazları
 * karşılayan güven bandı, aciliyet (geri sayım), sosyal kanıt ve en sonda
 * e-posta yakalama.
 *
 * Tamamı sunucu bileşeni; tarayıcıya yalnızca geri sayım, karusel okları,
 * bülten formu ve sepete ekleme butonlarının JS'i iniyor.
 */
export default async function HomePage() {
  const [categories, counts, bestSellers, deals, testimonials] = await Promise.all([
    getFeaturedCategories(),
    getCategoryCounts(),
    getBestSellers(8),
    getDeals(4),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />

      <CategoryShowcase categories={categories} counts={counts} />

      <Carousel
        title="Çok satanlar"
        subtitle="Bu sezon en çok tercih edilen ekipman."
        viewAllHref="/urunler?sirala=cok-satan"
        className="pb-14 sm:pb-20"
      >
        {bestSellers.map((product, index) => (
          // İlk iki kart görünür alanda olabilir; onları öncelikli yükle
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </Carousel>

      <TrustBand />

      <CountdownPromo deals={deals} />

      <Testimonials testimonials={testimonials} />

      <Newsletter />
    </>
  );
}
