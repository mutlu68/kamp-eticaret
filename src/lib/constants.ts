/** Mağaza geneli iş kuralları. Tek yerde tutuluyor ki kampanya değişince
 *  tüm yüzeyler (duyuru barı, sepet ilerleme çubuğu, checkout) birlikte
 *  güncellensin. */

/** Bu tutarın üstünde kargo bedava. Sepetteki ilerleme çubuğu buna bakar. */
export const FREE_SHIPPING_THRESHOLD = 1500;

/** Eşiğin altındaki siparişlerde alınan kargo ücreti (TL). */
export const SHIPPING_COST = 89;

/** Stok bu değerin altına düşünce "son X adet" aciliyet etiketi gösterilir. */
export const LOW_STOCK_THRESHOLD = 5;

/** E-posta kaydı karşılığında verilen hoş geldin indirimi (%). */
export const WELCOME_DISCOUNT_PERCENT = 10;

/** "Birlikte al" paketinde uygulanan ek indirim (%). */
export const BUNDLE_DISCOUNT_PERCENT = 12;

/** Kategori sayfasında "Daha Fazla Yükle" başına gösterilen ürün sayısı. */
export const PAGE_SIZE = 8;

/** Kargo kesim saati — bu saatten önceki siparişler aynı gün çıkar. */
export const CUTOFF_HOUR = 16;

export const STORE_NAME = "Kamp Rotası";
export const STORE_TAGLINE = "Doğada kalmak için gereken her şey";
export const STORE_PHONE = "0850 000 00 00";
export const STORE_EMAIL = "merhaba@kamprotasi.example";

/**
 * Sezon kampanyasının bitiş anı.
 *
 * Sabit bir ISO tarihi; geri sayım bileşeni bunu okur. Demo tarihi geçtiğinde
 * sayaç sıfırlanıp "Kampanya sona erdi" gösterir — tarihi ileriye çekmek için
 * tek satır yeterli.
 */
export const CAMPAIGN_ENDS_AT = "2026-12-31T23:59:59+03:00";
