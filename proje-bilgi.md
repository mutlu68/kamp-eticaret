---
proje_adi: Kamp Rotası (kamp-eticaret)
tur: web sitesi / e-ticaret vitrini (demo)
durum: geliştirme
---

## Genel
- Amaç: Kamp ve doğa sporları malzemeleri için dönüşüm odaklı, Türkçe, mobil
  öncelikli bir e-ticaret vitrini. Shopify premium tema kalitesi hedeflendi.
  Deneme/demo projesi — gerçek satış ve ödeme yok.
- Müşteri/sahip: iç proje (brief: `Masaüstü/kamp-eticaret-brief.md`)
- Repo: yerel; `npx create-next-app` kendi git deposunu oluşturdu, uzak repo yok

## Stack
- Dil/çatı: TypeScript, Next.js 16.3 (App Router), React 19.2
- Veritabanı: **yok** — veri `src/lib/data/` altında TS dizileri.
  Tüm erişim `src/lib/repository.ts` üzerinden; Prisma'ya geçiş için sadece o
  dosyanın gövdesi değişecek.
- Önemli kütüphaneler: Tailwind CSS v4 (token'lar `globals.css` `@theme`
  bloğunda), Zustand + persist (sepet). Karusel/akordeon/slider/geri sayım
  elle yazıldı, ek bağımlılık yok.

## Ortam ve Deploy
- Hosting/deploy hedefi: henüz belirlenmedi (Vercel veya Hostinger VPS)
- Ortamlar: yalnızca yerel geliştirme
- Erişim yöntemi: —
- CI/CD: yok
- `.env` gerekli mi: **hayır**. Proje hiçbir dış servise bağlanmıyor.
  Gerçek ödeme entegrasyonunda sağlayıcı anahtarları gerekecek (değer değil,
  isim olarak: ödeme sağlayıcı API anahtarı + gizli anahtar).

## Notlar
- **Turuncu kuralı:** `--color-cta` yalnızca CTA butonları ve indirim
  rozetinde kullanılır. Denetim: `grep -rn "bg-cta\|text-cta" src/`
- **CTA rengi brief'ten 1 adım koyu:** brief `#C75B12` diyordu; beyaz metinle
  kontrastı 4,25:1 çıkıp WCAG AA (4,5:1) altında kaldığı için `#BE5410`
  yapıldı (4,70:1). Brief kontrast standartlarını da istiyordu.
- **Hidrasyon tuzağı:** localStorage/sessionStorage ve tarih-saat kullanan her
  istemci bileşeni `useMounted()` arkasında olmalı. Sepet rozeti, sepet
  drawer'ı, geri sayım ve teslimat tahmini bu kurala göre yazıldı.
- **Fiyat biçimlendirme `Intl` KULLANMIYOR:** Node ile tarayıcının ICU
  sürümleri para birimi öncesi farklı boşluk karakteri üretip hidrasyon hatası
  veriyordu. `lib/format.ts` elle biçimlendiriyor.
- **Performans/tipografi çelişkisi (ölçüldü):** iki web fontu (198 KB) LCP'yi
  2,7 sn'den 3,8 sn'ye çıkarıyor, Performance 97 → 89. Brief'in hem "90+ /
  LCP < 2,5 sn" hem "iki belirgin farklı yazı ailesi" isteği yavaş 4G
  simülasyonunda birlikte tutmuyor. Tasarım isteği korundu; ayrıntı ve geri
  alınan denemeler `src/app/layout.tsx` yorumunda.
- **SVG placeholder'larda XML kaçışı şart:** kategori adındaki `&` karakteri
  kaçırılmadığında ("Kamp Ocağı & Pişirme") SVG'nin tamamı ayrıştırılamıyor ve
  görsel kırık çıkıyor. Üreteçte `xmlEscape` var, kaldırmayın.
- **Windows'ta `pkill` `next start`'ı öldürmüyor.** Portu dinleyen PID'i
  `netstat -ano` ile bulup `taskkill //PID <pid> //F` gerekiyor; aksi halde
  yeni sunucu sessizce başlamıyor ve eski derleme servis edilmeye devam ediyor.

## Yapılacaklar / Yol Haritası
- [ ] Gerçek ürün fotoğrafları (SVG'leri aynı isimli `.webp` ile değiştir)
- [ ] PostgreSQL + Prisma (`repository.ts` gövdelerini değiştir)
- [ ] iyzico veya Stripe (`lib/payment/provider.ts` arayüzünü uygula)
- [ ] Bülten ve iletişim formlarını gerçek servise bağla (Server Action)
- [ ] Deploy hedefi seç ve CI kur
- [ ] Üyelik + sipariş geçmişi (kapsam dışı bırakılmıştı)

<!-- Kimlik bilgilerini (şifre, API key, token, .env içeriği) BU DOSYAYA YAZMA. -->
