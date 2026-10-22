import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Kargo, iade, garanti, ödeme ve ürün seçimi hakkında en sık sorulan sorular ve yanıtları.",
  alternates: { canonical: "/sss" },
};

const faqs = [
  {
    id: "kargo-suresi",
    title: "Siparişim ne zaman elime ulaşır?",
    text: "Saat 16:00'dan önce verilen siparişler aynı gün kargoya teslim edilir. Kargo süresi büyükşehirlerde 1-2, diğer illerde 2-3 iş günüdür. Sipariş kargoya verildiğinde takip numarasını SMS ile göndeririz.",
  },
  {
    id: "kargo-ucreti",
    title: "Kargo ücreti ne kadar?",
    text: "1.500 TL ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde 89 TL kargo ücreti uygulanır. Sepette kargo bedavaya ne kadar kaldığını gösteren bir ilerleme çubuğu bulunur.",
  },
  {
    id: "iade-kosullari",
    title: "İade koşulları nelerdir?",
    text: "Ürünü teslim aldıktan sonra 14 gün içinde koşulsuz iade edebilirsiniz. Ürünün kullanılmamış, etiketleri sökülmemiş ve orijinal ambalajında olması yeterlidir. İade kargo ücretini biz karşılarız; iade talebinizi oluşturduğunuzda kargo kodu size iletilir. Uyku tulumu ve iç giyim gibi hijyen gerektiren ürünlerde ambalajın açılmamış olması gerekir.",
  },
  {
    id: "garanti",
    title: "Garanti kapsamı nedir?",
    text: "Tüm ürünlerimiz üretim ve malzeme hatalarına karşı 2 yıl garantilidir. Garanti; normal kullanım aşınması, yanlış kullanım, yırtık ve yanık gibi kullanıcı kaynaklı hasarları kapsamaz. Garanti talebi için fotoğrafla birlikte bize yazmanız yeterli.",
  },
  {
    id: "odeme-yontemleri",
    title: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    text: "Visa, Mastercard ve Troy kredi/banka kartları ile havale/EFT kabul ediyoruz. Kart bilgileriniz bize iletilmez, ödeme kuruluşunun güvenli sayfasında işlenir. Not: bu site bir demodur, gerçek ödeme alınmaz.",
  },
  {
    id: "uyelik",
    title: "Sipariş vermek için üye olmam gerekiyor mu?",
    text: "Hayır. Ödeme adımında misafir olarak devam edebilirsiniz; e-posta ve telefon bilgisi sipariş takibi için yeterlidir. İsterseniz ödeme sırasında tek tıkla hesap oluşturabilirsiniz.",
  },
  {
    id: "beden-secimi",
    title: "Uyku tulumunda hangi bedeni seçmeliyim?",
    text: "Standart beden 185 cm boya kadar rahat eder. 185 cm üzerindeyseniz uzun bedeni tercih edin; ayak ucunda sıkışma dolgunun sıkışmasına ve yalıtımın düşmesine yol açar. Kararsızsanız bize yazın, boyunuza göre öneri yapalım.",
  },
  {
    id: "sicaklik-degeri",
    title: "Uyku tulumundaki 'konfor' ve 'limit' sıcaklık ne demek?",
    text: "Konfor sıcaklığı, ortalama bir kullanıcının o derecede rahat uyuyabildiği sıcaklıktır. Limit sıcaklık ise büzülerek de olsa uyunabilen alt sınırdır. Kamp planınızın gece sıcaklığına göre konfor değerine bakın, limit değerine değil.",
  },
  {
    id: "gizlilik",
    title: "Gizlilik politikası",
    text: "Yalnızca siparişi tamamlamak ve size ulaşmak için gerekli verileri toplarız: ad-soyad, e-posta, telefon ve teslimat adresi. Bu veriler kargo firması dışında üçüncü taraflarla paylaşılmaz, pazarlama amacıyla satılmaz. Bu bir demo sitesi olduğu için girdiğiniz veriler hiçbir sunucuya gönderilmez.",
  },
  {
    id: "mesafeli-satis",
    title: "Mesafeli satış sözleşmesi",
    text: "Sipariş verdiğinizde, satıcı ile alıcı arasındaki mesafeli satış sözleşmesi kurulmuş sayılır. Sözleşme; ürünün temel nitelikleri, satış fiyatı, ödeme ve teslimat koşulları ile cayma hakkını kapsar. Cayma hakkı, teslim tarihinden itibaren 14 gündür. Bu demo sitede gerçek bir satış işlemi gerçekleşmez.",
  },
  {
    id: "kvkk",
    title: "KVKK aydınlatma metni",
    text: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, kişisel verileriniz sipariş süreçlerinin yürütülmesi amacıyla işlenir. Verilerinize erişme, düzeltilmesini veya silinmesini isteme hakkınız vardır; bu talepler için iletişim sayfamızdaki e-posta adresine yazabilirsiniz.",
  },
];

export default function FaqPage() {
  /**
   * FAQPage schema — Google'ın arama sonuçlarında soru-cevapları açılır
   * biçimde göstermesini sağlar.
   */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: { "@type": "Answer", text: faq.text },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHeader
        title="Sıkça Sorulan Sorular"
        lead="Kargo, iade, garanti ve ürün seçimi hakkında en çok merak edilenler. Aradığınızı bulamazsanız bize yazın."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem] lg:gap-16 lg:py-20">
        <div>
          {/*
            Her sorunun kendi id'si var: footer'daki "Gizlilik Politikası",
            "KVKK" gibi bağlantılar doğrudan ilgili başlığa iniyor.
          */}
          <Accordion
            items={faqs.map((faq) => ({
              id: faq.id,
              title: faq.title,
              content: <p>{faq.text}</p>,
            }))}
          />

          {/* Bağlantı hedefleri — akordeon kapalıyken de sayfada bir çıpa olsun */}
          <div aria-hidden="true" className="sr-only">
            {faqs.map((faq) => (
              <span key={faq.id} id={faq.id} />
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[var(--radius-card)] bg-stone/8 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-base font-bold text-stone">
            Cevabını bulamadınız mı?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone/85">
            {STORE_NAME} ekibi hafta içi 09:00-18:00 arası telefonda, her zaman
            e-postada.
          </p>
          <ButtonLink href="/iletisim" variant="dark" size="sm" className="mt-4">
            Bize yazın
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
