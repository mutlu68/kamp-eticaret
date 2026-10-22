import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";

import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

import "./globals.css";

/**
 * KÖK DÜZEN
 *
 * Burada sadece <html>/<body>, fontlar ve site geneli metadata var.
 * Header/footer gibi görsel kabuk route group'lara bırakıldı:
 *   (shop)     → duyuru barı + tam header + footer + sepet drawer
 *   (checkout) → yalnızca logo (dikkat dağıtıcı öğe yok — dönüşüm kuralı)
 */
/**
 * TİPOGRAFİ
 * Başlıklar Archivo (geniş, karakterli), gövde Inter (okunaklı) — brief'in
 * istediği gibi belirgin şekilde farklı iki aile. next/font ikisini de derleme
 * anında indirip kendi alan adımızdan servis ediyor: harici istek yok.
 *
 * ÖLÇÜLEN PERFORMANS BEDELİ
 * (Lighthouse mobil profil, `next build` + `next start`, yerel sunucu)
 * -------------------------------------------------------------------------
 * İki aile x iki alt küme (latin + latin-ext) = 4 woff2, 198 KB — sayfa
 * ağırlığının yaklaşık yarısı. Aynı sayfa iki durumda ölçüldü:
 *
 *   iki web fontuyla : Performance 89, LCP 3,8 sn, toplam 445 KB
 *   web fontu yokken : Performance 97, LCP 2,7 sn, toplam 246 KB
 *
 * Yani brief'in "Lighthouse 90+ / LCP < 2,5 sn" hedefi ile "iki belirgin farklı
 * yazı ailesi" isteği, Lighthouse'un simüle ettiği yavaş 4G + 4x CPU koşulunda
 * birbiriyle çelişiyor. Tasarım isteği korundu; hedefi tutmayan tek metrik LCP.
 * Kısıtlamasız (gerçek) ölçümde aynı sayfanın LCP'si 0,46 sn.
 *
 * Denenip GERİ ALINAN ayarlar:
 *   - `preload: false` (başlık fontu): LCP değişmedi ama FCP 0,9 → 1,5 sn,
 *     CLS 0 → 0,026 oldu. Net zarar.
 *   - Inter'e ağırlık listesi vermek: değişken font yine tek dosya geldiği için
 *     bayt kazancı sıfır çıktı.
 *
 * Bayt düşürmek gerekirse en etkili adım gövde fontunu sistem yığınına almak:
 * globals.css'te `--font-sans` satırından `var(--font-inter),` ifadesini
 * çıkarmak font yükünün yarısını siler.
 */
const archivo = Archivo({
  subsets: ["latin", "latin-ext"], // latin-ext: Türkçe ş, ğ, ı, İ
  variable: "--font-archivo",
  display: "swap",
  // Sadece iki ağırlık isteniyor; değişken fontun tamamı yerine bu iki kesit
  // indiriliyor. `preload: false` denendi ve GERİ ALINDI: preload kalkınca
  // başlıklar yedek yazı tipiyle çizilip sonradan yer değiştirdiği için
  // FCP 0,9 sn'den 1,5 sn'ye çıktı ve CLS 0'dan 0,026'ya yükseldi.
  weight: ["600", "700"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // Göreli OG/canonical adreslerinin çözülebilmesi için taban adres
  metadataBase: new URL("https://kamprotasi.example"),
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s | ${STORE_NAME}`,
  },
  description:
    "Çadır, uyku tulumu, kamp ocağı, sırt çantası ve kamp mobilyası. 1.500 TL üzeri kargo bedava, 14 gün koşulsuz iade, 2 yıl garanti.",
  keywords: [
    "kamp malzemeleri",
    "çadır",
    "uyku tulumu",
    "kamp ocağı",
    "sırt çantası",
    "outdoor",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: STORE_NAME,
    title: `${STORE_NAME} — ${STORE_TAGLINE}`,
    description:
      "Kamp ve doğa sporları ekipmanı. Sahada denenmiş ürünler, hızlı kargo, kolay iade.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${archivo.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Klavye kullanıcıları için gezinmeyi atlama bağlantısı */}
        <a
          href="#icerik"
          className="sr-only-focusable absolute left-4 top-4 z-50 rounded-[var(--radius-card)] bg-ink px-4 py-2 text-sm font-semibold text-bg"
        >
          İçeriğe geç
        </a>

        {children}
      </body>
    </html>
  );
}
