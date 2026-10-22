import { FREE_SHIPPING_THRESHOLD, WELCOME_DISCOUNT_PERCENT } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

/**
 * DUYURU BARI
 *
 * İki mesaj dönüşümlü olarak gösteriliyor. Dönüşüm saf CSS animasyonu ile
 * yapılıyor (JS yok, sunucu bileşeni kalabiliyor): iki katman aynı yerde durur,
 * `marquee-in` animasyonu gecikmeli başlatılarak sırayla görünürler.
 *
 * Ekran okuyucu her iki mesajı da tek seferde okur; animasyon yalnızca görsel.
 */
export function AnnouncementBar() {
  const messages = [
    `${formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri kargo bedava`,
    `E-posta listesine katılın, ilk siparişinizde %${WELCOME_DISCOUNT_PERCENT} indirim`,
  ];

  return (
    <div className="bg-ink text-bg">
      <div className="container-page flex h-9 items-center justify-center overflow-hidden">
        <p className="relative h-9 w-full text-center text-[0.8rem] font-medium">
          {messages.map((message, index) => (
            <span
              key={message}
              className="absolute inset-0 flex items-center justify-center opacity-0 [animation:marquee-in_9s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 4.5}s` }}
            >
              {message}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
