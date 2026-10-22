import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { TrustBand } from "@/components/sections/TrustBand";
import { ButtonLink } from "@/components/ui/Button";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kamp Rotası, 2018'den beri kamp ve doğa sporları ekipmanı satıyor. Sattığımız her ürünü önce kendimiz sahada deniyoruz.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Hakkımızda"
        lead="Kataloğa aldığımız her ürünü, satışa çıkmadan önce en az bir gece sahada kullanırız. Listede olmayan şey, denenmemiş şeydir."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-20">
        <div className="space-y-5 text-[0.98rem] leading-relaxed text-sage">
          <p>
            {STORE_NAME}, 2018 yılında üç kişilik bir ekiple, Kadıköy&apos;de küçük
            bir depoda kuruldu. Başlangıç noktamız basit bir sorundu: internetten
            aldığımız çadırın gerçekten kaç dakikada kurulduğunu, tulumun
            etiketindeki dereceye güvenilip güvenilemeyeceğini hiçbir yerde
            bulamıyorduk.
          </p>
          <p>
            Bugün kataloğumuzda yedi kategori ve düzinelerce ürün var; ama seçim
            yöntemi değişmedi. Bir ürün listeye girmeden önce ekipten biri onu
            alır, bir hafta sonu kullanır ve notlarını yazar. Ürün
            açıklamalarındaki &ldquo;sekiz dakikada kuruluyor&rdquo;,
            &ldquo;yan yatanlarda çökmüyor&rdquo; gibi cümleler pazarlama metni
            değil, o notlardan gelir.
          </p>
          <p>
            Bir ürünü beğenmezsek listeye almayız — üreticinin bize kaç adet
            gönderdiğinden bağımsız olarak. Bu yüzden kataloğumuz rakiplerimizden
            küçük ve iade oranımız düşük.
          </p>

          <h2 className="pt-4 font-display text-xl font-bold text-ink">
            Neye dikkat ediyoruz?
          </h2>
          <ul className="space-y-3">
            {[
              [
                "Etiket değil, ölçüm",
                "Ağırlıkları kendi terazimizde tartar, su geçirmezlik iddialarını yağmurda test ederiz.",
              ],
              [
                "Onarılabilirlik",
                "Yedek parçası bulunmayan, tamir edilemeyen ürünü listeye almayız.",
              ],
              [
                "Dürüst stok",
                "Stokta olmayan ürünü 'yakında' diye satmayız; sitede gördüğünüz adet gerçek adettir.",
              ],
            ].map(([title, text]) => (
              <li key={title}>
                <strong className="font-semibold text-ink">{title}:</strong> {text}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-bold text-ink">
              Rakamlarla
            </h2>
            <dl className="mt-4 space-y-4">
              {[
                ["2018", "Kuruluş yılı"],
                ["7", "Ürün kategorisi"],
                ["2.400+", "Doğrulanmış değerlendirme"],
                ["4,7", "Ortalama müşteri puanı"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold text-ink">
                    {value}
                  </dt>
                  <dd className="text-xs text-sage">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[var(--radius-card)] bg-stone/8 p-6">
            <h2 className="font-display text-base font-bold text-stone">
              Bir sorunuz mu var?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone/85">
              Hangi ürünün size uygun olduğundan emin değilseniz yazın; ürünü
              gerçekten kullanmış biri cevaplasın.
            </p>
            <ButtonLink href="/iletisim" variant="dark" size="sm" className="mt-4">
              İletişime geç
            </ButtonLink>
          </div>
        </aside>
      </div>

      <TrustBand />
    </>
  );
}
