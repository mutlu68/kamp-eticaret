import { CUTOFF_HOUR } from "./constants";

/**
 * Fiyat biçimlendirme.
 *
 * Bilinçli olarak Intl.NumberFormat KULLANILMIYOR: Node ve tarayıcı farklı ICU
 * sürümleriyle gelebiliyor ve para birimi simgesinden önce farklı boşluk
 * karakterleri üretebiliyor. Bu, sunucuda üretilen HTML ile istemcinin ürettiği
 * HTML'in ayrışmasına (hydration mismatch) yol açar. Elle biçimlendirme her iki
 * tarafta bit bazında aynı sonucu verir.
 */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const hasFraction = rounded % 1 !== 0;
  const [intPart, fracPart] = rounded.toFixed(hasFraction ? 2 : 0).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped}${fracPart ? "," + fracPart : ""} TL`;
}

/** İndirim yüzdesi — yukarı yuvarlanmaz, aşağı yuvarlanır ki abartılmasın. */
export function discountPercent(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.floor(((price - salePrice) / price) * 100);
}

/** Ürünün ekranda geçerli olan fiyatı (indirim varsa indirimli). */
export function effectivePrice(price: number, salePrice?: number): number {
  return salePrice && salePrice < price ? salePrice : price;
}

const WEEKDAYS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/** "12 Ağustos 2026" biçimi — yorum tarihlerinde kullanılır. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Teslimat tahmini: kesim saatinden önce verilen siparişler aynı gün çıkar,
 * kargo 2 iş günü sürer. Hafta sonu atlanır.
 *
 * DİKKAT: Bu fonksiyon "şu an"a bağlıdır, yani sunucuda derleme anındaki
 * sonuçla istemcideki sonuç farklı olabilir. Bu yüzden sadece istemci
 * bileşenlerinde, mount sonrası çağrılmalı (bkz. DeliveryEstimate).
 */
export function estimateDelivery(now: Date = new Date()): string {
  const d = new Date(now);
  // Kesim saatini geçtiysek sipariş ertesi gün çıkar
  if (d.getHours() >= CUTOFF_HOUR) d.setDate(d.getDate() + 1);

  let businessDaysToAdd = 2;
  while (businessDaysToAdd > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) businessDaysToAdd--;
  }
  return `${WEEKDAYS[d.getDay()]} (${d.getDate()} ${MONTHS[d.getMonth()]})`;
}

/** Sipariş numarası: KMP-2026-4817 */
export function generateOrderNumber(now: Date = new Date()): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `KMP-${now.getFullYear()}-${suffix}`;
}

/** Puanı "4,7" olarak yazar (Türkçe ondalık ayırıcı). */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

/** URL'de kullanılabilir hale getirir — arama sorgularında kullanılır. */
export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Türkçe arama için normalize eder: "çadir" yazan da "çadır" bulur.
 * Aksan ve büyük/küçük harf farklarını siler.
 */
export function normalizeForSearch(text: string): string {
  return slugify(text).replace(/-/g, " ");
}
