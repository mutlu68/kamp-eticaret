# Kamp Rotası — Kamp Malzemeleri E-Ticaret Demosu

Dönüşüm (CRO) odaklı, Türkçe, mobil öncelikli bir kamp malzemeleri vitrini.
**Bu bir demodur:** gerçek ödeme alınmaz, veri yereldir, e-posta gönderilmez.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand
- **Veri:** `src/lib/data/` altında 24 demo ürün, 7 kategori, 55 yorum
- **Görseller:** `public/img/` altında üretilmiş SVG placeholder'lar (uzak servis yok)

---

## Kurulum

```bash
npm install
npm run dev          # http://localhost:3000
```

Üretim derlemesi ve Lighthouse ölçümü için:

```bash
npm run build
npm start
```

Ortam değişkeni **gerektirmez** — hiçbir dış servise bağlanmıyor.

### Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (24 ürün + 7 kategori sayfası statik üretilir) |
| `npm start` | Üretim sunucusu |
| `npm run lint` | ESLint |
| `node scripts/generate-placeholders.mjs` | Ürün/kategori SVG'lerini yeniden üretir |

---

## Klasör yapısı

```
src/
  app/
    layout.tsx            kök düzen: fontlar, site geneli metadata
    (shop)/               duyuru barı + header + footer + sepet drawer
      page.tsx            ana sayfa
      urun/[slug]/        ürün detay (statik üretiliyor)
      kategori/[slug]/    kategori (filtre/sıralama URL'de)
      urunler/            tüm ürünler
      hakkimizda|iletisim|sss|kargo-iade/
    (checkout)/           sadece logo olan sade kabuk
      odeme/              tek sayfa checkout
      odeme/basarili/     sipariş onayı
    api/arama/            canlı arama önerileri
    api/sepet-onerileri/  sepet çapraz satışı
    not-found.tsx  sitemap.ts  robots.ts  icon.svg
  components/
    ui/          Button, Badge, Price, Rating, Accordion, Drawer, Carousel, ...
    layout/      Header, Footer, SearchBox, AnnouncementBar, ShopChrome
    sections/    Hero, CategoryShowcase, TrustBand, CountdownPromo, ...
    product/     ProductCard, Gallery, BuyBox, Reviews, BundleCrossSell
    collection/  FilterPanel, CollectionToolbar, LoadMoreGrid, CollectionView
    cart/        CartDrawer, CartButton, FreeShippingProgress
    checkout/    CheckoutForm, OrderSummary, OrderSuccess
  lib/
    repository.ts   ← TEK veri erişim noktası
    data/           types, products, categories, reviews
    payment/        provider (arayüz) + mock (demo sağlayıcı)
    constants.ts    kargo eşiği, stok eşiği, kampanya tarihi
    format.ts       TL biçimi, teslimat tahmini, Türkçe arama normalizasyonu
    hooks.ts        useMounted, useFocusTrap, useScrolledPast, ...
  store/cart.ts     Zustand + localStorage
scripts/generate-placeholders.mjs
```

---

## Ürün ekleme

Şu an ürün girişi kod dosyasından yapılıyor; admin paneli yok (bilinçli tercih,
bkz. "Yapılmayanlar"). Yeni bir ürün eklemek iki adım:

**1. `src/lib/data/products.ts` dizisine bir nesne ekleyin**

```ts
{
  id: "p-25",                              // benzersiz, mevcutlarla çakışmasın
  slug: "yeni-urun-adi",                   // URL: /urun/yeni-urun-adi
  name: "Yeni Ürün Adı",
  brand: "Toros Gear",                     // yeni marka yazarsanız filtreye kendi düşer
  categoryId: "cat-cadir",                 // aşağıdaki listeden
  summary: "Kartta ve meta açıklamasında görünen tek cümle.",
  description: ["Birinci paragraf.", "İkinci paragraf."],
  specs: [{ label: "Ağırlık", value: "2.4 kg" }],
  price: 4500,
  salePrice: 3600,                         // indirim yoksa bu satırı silin
  stock: 8,                                // <= 5 ise "son X adet" etiketi çıkar
  variants: [
    { id: "v-25-a", label: "Antrasit", kind: "color", swatch: "#3a3f42", stock: 8 },
    // kind: "size" ise swatch yerine düz buton olur, priceDelta ile fiyat farkı eklenebilir
  ],
  images: [
    "/img/products/yeni-urun-adi-1.svg",   // ilk görsel kartta
    "/img/products/yeni-urun-adi-2.svg",   // ikincisi kart hover'ında
  ],
  rating: 4.5,
  reviewCount: 12,
  salesRank: 25,                           // küçük sayı = daha çok satan
  isBestSeller: false,
  isNew: true,
  createdAt: "2026-09-01",                 // "en yeni" sıralaması bunu kullanır
  bundleWith: ["p-19", "p-22"],            // "birlikte alınanlar" bloğu
}
```

Geçerli `categoryId` değerleri: `cat-cadir`, `cat-uyku-tulumu`, `cat-kamp-ocagi`,
`cat-sirt-cantasi`, `cat-aydinlatma`, `cat-kamp-mobilyasi`, `cat-aksesuar`.

**2. Görselleri üretin**

```bash
node scripts/generate-placeholders.mjs
```

Script `products.ts`'i okuyup `images` dizisinde yazdığınız yollara placeholder
SVG'leri kendisi yazar — dosyaları elle oluşturmanız gerekmez.

Gerisi otomatik: kategori sayıları, marka filtresi, fiyat aralığı slider'ı,
arama, sitemap, JSON-LD ve statik ürün sayfası `repository.ts` üzerinden
türetiliyor. `npm run dev` açıksa sayfa anında güncellenir.

İsteğe bağlı olarak `src/lib/data/reviews.ts` içine aynı `productId` ile yorum
ekleyebilirsiniz; eklemezseniz yalnızca puan dağılım grafiği görünür.

> **Bu bir geliştirici akışıdır.** Teknik olmayan birinin ürün girmesi veya
> değişikliğin deploy olmadan canlıya çıkması gerekiyorsa yol haritasındaki
> veritabanı adımı gerekir.

---

## Tasarım sistemi

Token'lar `src/app/globals.css` içindeki `@theme` bloğunda. Tailwind v4'te
`tailwind.config` dosyası yok; `--color-ink` gibi bir değişken tanımlamak
`bg-ink`, `text-ink`, `border-ink` yardımcılarını otomatik üretir.

| Token | Değer | Kullanım |
| --- | --- | --- |
| `--color-bg` | `#FAFAF7` | Zemin |
| `--color-ink` | `#1E2D24` | Başlıklar, header, koyu bloklar |
| `--color-cta` | `#BE5410` | **Sadece** CTA butonu + indirim rozeti |
| `--color-sage` | `#5C6B5E` | İkincil metin, ikonlar |
| `--color-stone` | `#2F4A5C` | Güven rozetleri, bilgi kutuları |
| `--color-danger` | `#9B2C2C` | Form hataları |

### Turuncu kuralı (pazarlıksız)

Kor turuncusu yalnızca dört yerde geçer ve hepsi bir satın alma eylemidir:
`Button variant="primary"`, `Badge variant="discount"`, ürün kartındaki hızlı
sepete ekle, mobil sticky sepete ekle. Yeni bir turuncu yüzey eklemeden önce
iki kez düşünün — butonların anında fark edilmesi bu kısıtlamaya bağlı.

Denetlemek için:

```bash
grep -rn "bg-cta\|text-cta" src/
```

> **Not:** Brief'te CTA rengi `#C75B12` verilmişti. Bu değer beyaz metinle
> 4,25:1 kontrast veriyor ve WCAG AA'nın istediği 4,5:1'in altında kalıyor
> (Lighthouse bunu hata olarak işaretledi). Brief aynı zamanda "kontrast
> standartları" da istediği için renk, eşiği geçecek **en az** miktarda
> koyulaştırıldı: `#BE5410` → 4,70:1. Fark gözle ayırt edilemiyor.

---

## Ölçülen sonuçlar

Lighthouse, mobil profil, `npm run build && npm start` üzerinde çalıştırıldı.
Aşağıdaki sayılar tahmin değil, ölçüm sonucudur (skorlar çalıştırmalar arasında
±2 oynayabiliyor):

| Sayfa | Performans | Erişilebilirlik | En İyi Uygulamalar | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Ana sayfa | 86–89 | 100 | 100 | 100 | 3,8–4,0 sn | 0 |
| Ürün detay | 88–89 | 100 | 100 | 100 | 3,7 sn | 0 |
| Kategori | 89–90 | 100 | 100 | 100 | 3,6 sn | 0 |
| Ödeme | 90 | 100 | 100 | 63¹ | 3,6 sn | 0 |

¹ Ödeme sayfası bilinçli olarak `noindex` — SEO skorunun düşük olması beklenen
davranış.

**Hedefi tutmayan tek metrik LCP** (hedef < 2,5 sn). Nedeni ölçüldü: iki web
fontu (Archivo + Inter, `latin` + `latin-ext` = 4 dosya, 198 KB) sayfa
ağırlığının yaklaşık yarısını oluşturuyor.

| Durum | Performans | LCP | Toplam ağırlık |
| --- | --- | --- | --- |
| İki web fontuyla (teslim edilen) | 89 | 3,8 sn | 445 KB |
| Web fontu olmadan (tanı denemesi) | 97 | 2,7 sn | 246 KB |

Yani brief'in "Lighthouse 90+ / LCP < 2,5 sn" hedefi ile "belirgin şekilde
farklı iki yazı ailesi" isteği, Lighthouse'un simüle ettiği yavaş 4G + 4x CPU
koşulunda birbiriyle çelişiyor. Tasarım isteği korundu. Kısıtlamasız gerçek
ölçümde aynı sayfanın LCP'si **0,46 sn**.

Denenip geri alınan ayarlar `src/app/layout.tsx` içindeki yorumda kayıtlı
(`preload: false` FCP'yi 0,9 → 1,5 sn yaptı ve CLS oluşturdu; Inter'e ağırlık
listesi vermek bayt kazandırmadı).

Font yükünü düşürmek isterseniz en etkili adım gövde fontunu sistem yığınına
almaktır: `globals.css` içindeki `--font-sans` satırından `var(--font-inter),`
ifadesini çıkarmak font baytının yarısını siler.

---

## Yol haritası

### 1. Gerçek veritabanına geçiş (PostgreSQL + Prisma)

Bütün veri erişimi tek dosyadan geçiyor: **`src/lib/repository.ts`**.
Hiçbir bileşen `lib/data/*` dosyalarını doğrudan import etmiyor ve tüm
fonksiyonlar zaten `async` — imzalar değişmediği için bileşen kodunda
değişiklik gerekmez.

1. `npm i prisma @prisma/client && npx prisma init`
2. `src/lib/data/types.ts` içindeki tipleri `schema.prisma`'ya çevirin
   (her varlığın `id`'si ve ilişkileri id üzerinden kurulu, birebir karşılığı var).
3. `repository.ts` içindeki fonksiyonların **gövdesini** değiştirin:

   ```ts
   export async function getProductBySlug(slug: string) {
     return prisma.product.findUnique({
       where: { slug },
       include: { variants: true },
     });
   }
   ```

4. `getRatingBreakdown` bugün ortalamadan türetiliyor; veritabanında
   `GROUP BY rating` sorgusuna dönüşür.
5. Ürün sayfaları `generateStaticParams` ile statik üretiliyor. Stok gerçek
   zamanlı olacaksa ilgili sayfalara `revalidate` ekleyin.

### 2. Gerçek ödemeye geçiş (iyzico / Stripe)

Checkout sayfası somut bir sağlayıcıyı değil, **`src/lib/payment/provider.ts`**
içindeki `PaymentProvider` arayüzünü çağırıyor.

1. `src/lib/payment/iyzico.ts` dosyasında aynı arayüzü uygulayın.
2. `getPaymentProvider()` içindeki seçimi ortam değişkenine bağlayın.
3. Sayfa kodunda tek satır değişmez.

> **Güvenlik:** Gerçek entegrasyonda kart bilgisi kendi sunucunuza asla
> gönderilmemeli. Sağlayıcının barındırdığı forma (iyzico checkout / Stripe
> Elements) yönlendirin ve yalnızca token alın. Bugünkü demo formu hiçbir yere
> veri iletmiyor. API anahtarları koda değil ortam değişkenine yazılır.

### 3. Gerçek ürün fotoğrafları

`public/img/products/` altındaki SVG'ler aynı isimle `.webp` olarak
değiştirilip `src/lib/data/products.ts` içindeki uzantılar güncellenir.
Placeholder üretecini tekrar çalıştırmaya gerek yoktur.

### 4. Yapılmayanlar

Üyelik ve sipariş geçmişi, admin paneli, gerçek e-posta gönderimi (bülten ve
iletişim formları yalnızca arayüzde onay verir), stok yönetimi, çoklu dil.

---

## Dönüşüm kuralları — nerede uygulandı

| Kural | Dosya |
| --- | --- |
| CTA rengi başka amaçla kullanılmaz | `ui/Button.tsx`, `ui/Badge.tsx` |
| Sepete ekleme sayfa yenilemez, drawer açılır | `store/cart.ts` (`add` → `isOpen: true`) |
| Mobilde sticky sepete ekle barı | `product/BuyBox.tsx` |
| Kargo bedava ilerleme çubuğu | `cart/FreeShippingProgress.tsx` |
| Her kartta yıldız + yorum sayısı | `product/ProductCard.tsx` |
| Checkout'ta üyelik zorunlu değil | `checkout/CheckoutForm.tsx` |
| Sonsuz kaydırma yerine "Daha Fazla Yükle" | `collection/LoadMoreGrid.tsx` |
| Tüm görseller lazy, fontlar `next/font` | `ProductCard`, `app/layout.tsx` |

---

## Bilinen sınırlar

- **Hidrasyon:** localStorage ve tarih/saate bağlan her şey `useMounted()`
  arkasında. Yeni bir istemci bileşeninde `localStorage`, `Date.now()` veya
  `sessionStorage` kullanacaksanız aynı korumayı uygulayın.
- **Sipariş kalıcılığı:** Başarı sayfası siparişi `sessionStorage`'dan okur.
  Sekme kapanınca kaybolur — gerçek uygulamada veritabanından okunacak.
- **Fiyat biçimi:** `Intl.NumberFormat` bilinçli olarak kullanılmadı; Node ile
  tarayıcının ICU sürümleri farklı boşluk karakteri üretip hidrasyon hatası
  veriyordu. `lib/format.ts` elle biçimlendiriyor.
