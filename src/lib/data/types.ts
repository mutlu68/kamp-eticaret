/**
 * Alan modeli.
 *
 * Bu tipler bilinçli olarak bir veritabanı şemasına birebir çevrilebilecek
 * şekilde yazıldı: her varlığın `id`'si var, ilişkiler id üzerinden kuruluyor.
 * PostgreSQL + Prisma'ya geçildiğinde bu dosya neredeyse aynen `schema.prisma`
 * karşılığına dönüşür ve bileşen kodunda değişiklik gerekmez.
 */

/** Varyant ekranda nasıl gösterilecek: renk yuvarlağı mı, metin butonu mu. */
export type VariantKind = "color" | "size";

export interface Variant {
  id: string;
  /** Kullanıcıya gösterilen ad: "Antrasit", "3 Mevsim", "60 L" */
  label: string;
  kind: VariantKind;
  /** kind === "color" ise yuvarlağın dolgu rengi (hex) */
  swatch?: string;
  /** Bu varyantın taban fiyata eklediği fark (TL). Yoksa 0. */
  priceDelta?: number;
  /** Varyant bazlı stok; 0 ise seçilemez (tükendi). */
  stock: number;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  /** URL'de kullanılan benzersiz anahtar: /urun/<slug> */
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  /** Kart ve meta açıklamasında kullanılan tek cümlelik özet */
  summary: string;
  /** Ürün detay akordeonundaki uzun açıklama (paragraflar) */
  description: string[];
  /** "Teknik özellikler" tablosu */
  specs: SpecRow[];
  /** Liste (üstü çizilecek) fiyat — TL */
  price: number;
  /** İndirimli fiyat. Yoksa ürün indirimde değildir. */
  salePrice?: number;
  /** Toplam stok. <= LOW_STOCK_THRESHOLD ise aciliyet etiketi gösterilir. */
  stock: number;
  variants: Variant[];
  /** Görsel yolları — ilk görsel kartta, ikincisi hover'da kullanılır. */
  images: string[];
  rating: number;
  reviewCount: number;
  /** Çok satanlar karuselinde ve "en çok satan" sıralamasında kullanılır */
  salesRank: number;
  isBestSeller: boolean;
  isNew: boolean;
  /** Sıralamada "en yeni" için — ISO tarih */
  createdAt: string;
  /** "Birlikte alınanlar" çapraz satış bloğunda önerilecek ürün id'leri */
  bundleWith: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Kategori sayfası başlığı altındaki açıklama + meta description */
  description: string;
  image: string;
  /** Ana sayfa kategori vitrininde gösterilsin mi (vitrinde 6 kategori var) */
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  /** 1-5 */
  rating: number;
  title: string;
  body: string;
  date: string;
  /** Doğrulanmış alışveriş rozeti */
  verified: boolean;
}

/** Ana sayfadaki sosyal kanıt karuselinde gösterilen genel mağaza yorumları */
export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  body: string;
  productName: string;
  avatarHue: number;
}

/** Sepetteki tek satır. `key` = productId + variantId birleşimi. */
export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  /** Satır birim fiyatı (varyant farkı dahil, indirim uygulanmış) */
  unitPrice: number;
  /** Üstü çizili gösterilecek liste fiyatı; indirim yoksa undefined */
  listPrice?: number;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  /** Satır eklenirken geçerli olan stok — adet artırmada üst sınır */
  maxQuantity: number;
}

export type OrderStatus = "hazirlaniyor" | "kargoda" | "teslim";

export interface OrderCustomer {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  note?: string;
}

export interface Order {
  id: string;
  /** Kullanıcıya gösterilen sipariş numarası: KMP-2026-4817 */
  number: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: OrderCustomer;
  status: OrderStatus;
}

/** Kategori sayfası filtre/sıralama durumu */
export type SortKey = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "cok-satan" | "en-yeni";

export interface ProductFilters {
  categoryId?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  /** En az bu puana sahip ürünler */
  minRating?: number;
  /** Sadece stokta olanlar */
  inStockOnly?: boolean;
  search?: string;
  sort?: SortKey;
}
