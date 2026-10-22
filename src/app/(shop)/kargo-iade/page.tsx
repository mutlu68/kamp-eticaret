import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { TrustBand } from "@/components/sections/TrustBand";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon, ClockIcon, ReturnIcon, TruckIcon } from "@/components/ui/Icons";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kargo & İade",
  description:
    "Kargo süreleri, ücretsiz kargo eşiği, iade koşulları ve garanti kapsamı. 14 gün koşulsuz iade, iade kargosu bizden.",
  alternates: { canonical: "/kargo-iade" },
};

export default function ShippingReturnsPage() {
  const shippingRows = [
    ["Kesim saati", "16:00 (hafta içi)"],
    ["Kargoya veriliş", "Aynı gün"],
    ["Büyükşehirler", "1-2 iş günü"],
    ["Diğer iller", "2-3 iş günü"],
    ["Ücretsiz kargo eşiği", formatPrice(FREE_SHIPPING_THRESHOLD)],
    ["Eşik altı kargo ücreti", formatPrice(SHIPPING_COST)],
  ];

  const returnSteps = [
    "İletişim sayfasından veya e-posta ile iade talebinizi iletin.",
    "Size iade kargo kodunu gönderelim — kargo ücreti bizde.",
    "Ürünü orijinal ambalajında kargoya verin.",
    "Ürün depomuza ulaştıktan sonra 3 iş günü içinde iade tutarı kartınıza yansır.",
  ];

  return (
    <>
      <PageHeader
        title="Kargo & İade"
        lead="Ne zaman elinize geçeceğini ve beğenmezseniz ne olacağını baştan bilin. Sürpriz yok."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <section>
          <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
            <TruckIcon className="text-2xl text-stone" />
            Kargo
          </h2>

          <table className="mt-5 w-full text-left text-sm">
            <tbody className="divide-y divide-line border-y border-line">
              {shippingRows.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row" className="w-1/2 py-3 pr-4 font-medium text-ink">
                    {label}
                  </th>
                  <td className="py-3 text-sage">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-5 flex items-start gap-2 rounded-[var(--radius-card)] bg-stone/8 p-3.5 text-xs leading-relaxed text-stone">
            <ClockIcon className="mt-px shrink-0 text-sm" />
            Cumartesi 12:00&apos;den sonra ve pazar günü verilen siparişler
            pazartesi kargoya verilir.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
            <ReturnIcon className="text-2xl text-stone" />
            İade
          </h2>

          <p className="mt-4 text-[0.95rem] leading-relaxed text-sage">
            Teslim aldığınız tarihten itibaren <strong className="font-semibold text-ink">14 gün</strong> içinde,
            sebep belirtmeden iade edebilirsiniz. Tek şart: ürünün kullanılmamış,
            etiketlerinin sökülmemiş ve orijinal ambalajında olması.
          </p>

          <ol className="mt-6 space-y-3">
            {returnSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-bg">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-sage">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <CheckIcon className="text-base text-stone" />
              İade edilemeyen ürünler
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-sage">
              Hijyen gerektiren ürünlerde (uyku tulumu iç astarı, iç giyim)
              ambalaj açılmışsa iade alınamaz. Kişiye özel üretilmiş veya
              adınıza baskı yapılmış ürünler de iade kapsamı dışındadır.
            </p>
          </div>

          <ButtonLink href="/iletisim" className="mt-6">
            İade talebi oluştur
          </ButtonLink>
        </section>
      </div>

      <TrustBand />
    </>
  );
}
