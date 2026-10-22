import type { Metadata } from "next";

import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { STORE_EMAIL, STORE_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Sipariş, ürün seçimi ve iade konularında bize ulaşın. Hafta içi 09:00-18:00 arası telefonla, her zaman e-posta ile.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const channels = [
    {
      icon: PhoneIcon,
      title: "Telefon",
      value: STORE_PHONE,
      href: `tel:${STORE_PHONE.replace(/\s/g, "")}`,
      note: "Hafta içi 09:00 - 18:00",
    },
    {
      icon: MailIcon,
      title: "E-posta",
      value: STORE_EMAIL,
      href: `mailto:${STORE_EMAIL}`,
      note: "Ortalama yanıt süresi 4 saat",
    },
    {
      icon: PinIcon,
      title: "Adres",
      value: "Caferağa Mah. Örnek Sok. No:12, Kadıköy / İstanbul",
      note: "Mağaza ziyareti randevuyla",
    },
    {
      icon: ClockIcon,
      title: "Kargo kesim saati",
      value: "16:00",
      note: "Bu saatten önceki siparişler aynı gün çıkar",
    },
  ];

  return (
    <>
      <PageHeader
        title="İletişim"
        lead="Ürün seçiminde tereddüt ettiyseniz yazın; size cevap veren kişi o ürünü sahada kullanmış olacak."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Bize ulaşın
          </h2>

          <ul className="mt-6 space-y-6">
            {channels.map(({ icon: Icon, title, value, href, note }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone/10 text-xl text-stone">
                  <Icon />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-ink">{title}</p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-0.5 block text-[0.95rem] text-ink underline-offset-4 hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[0.95rem] text-ink">{value}</p>
                  )}
                  <p className="mt-0.5 text-xs text-sage">{note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </>
  );
}
