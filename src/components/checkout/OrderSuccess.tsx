"use client";

import { useMemo, type ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon, MailIcon, TruckIcon } from "@/components/ui/Icons";
import type { Order } from "@/lib/data/types";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/hooks";

import { LAST_ORDER_KEY } from "./CheckoutForm";

/**
 * SİPARİŞ BAŞARILI
 *
 * Sipariş bilgisi checkout adımında sessionStorage'a yazıldı; burada okunuyor.
 * Gerçek uygulamada sipariş veritabanına yazılır ve bu sayfa
 * `/odeme/basarili?no=KMP-2026-4817` gibi bir parametreyle sunucudan çeker.
 *
 * Öneriler sunucuda render edilip `recommendations` olarak buraya geçiliyor —
 * ürün verisi istemciye inmiyor.
 */
export function OrderSuccess({ recommendations }: { recommendations: ReactNode }) {
  // sessionStorage sunucuda yok: hidrasyon tamamlanmadan okumaya çalışmak
  // sunucu/istemci HTML'inin ayrışmasına yol açar. `mounted` true olduğunda
  // okuma render sırasında yapılıyor — yan etkisi olmayan bir okuma olduğu
  // için effect'e gerek yok.
  const mounted = useMounted();

  const order = useMemo<Order | null>(() => {
    if (!mounted) return null;
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      return raw ? (JSON.parse(raw) as Order) : null;
    } catch {
      // Bozuk kayıt: siparişsiz duruma düş
      return null;
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="container-page py-20">
        <p className="text-sm text-sage">Sipariş bilgisi yükleniyor...</p>
      </div>
    );
  }

  // Doğrudan adres çubuğundan gelinmişse sipariş yok
  if (!order) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Görüntülenecek sipariş bulunamadı
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-sage">
          Bu sayfa yalnızca yeni tamamlanan bir siparişten sonra görüntülenir.
        </p>
        <ButtonLink href="/urunler" className="mt-6" size="lg">
          Alışverişe başla
        </ButtonLink>
      </div>
    );
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone/12 text-2xl text-stone">
          <CheckIcon />
        </span>

        <h1 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
          Siparişiniz alındı
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-sage sm:text-base">
          Teşekkür ederiz {order.customer.firstName}. Sipariş özetini birazdan
          e-posta ile göndereceğiz.
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 text-left">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-sage">
                Sipariş numarası
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-ink">
                {order.number}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-sage">Toplam</dt>
              <dd className="mt-1 font-display text-lg font-bold text-ink">
                {formatPrice(order.total)}{" "}
                <span className="text-sm font-normal text-sage">
                  ({itemCount} ürün)
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-sage">
                Teslimat adresi
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">
                {order.customer.firstName} {order.customer.lastName}
                <br />
                {order.customer.address}
                <br />
                {order.customer.district} / {order.customer.city}
                {order.customer.postalCode && ` — ${order.customer.postalCode}`}
              </dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            <li className="flex items-start gap-2.5 text-sm text-sage">
              <MailIcon className="mt-0.5 shrink-0 text-base text-stone" />
              Sipariş onayı{" "}
              <strong className="font-semibold text-ink">
                {order.customer.email}
              </strong>{" "}
              adresine gönderildi.
            </li>
            <li className="flex items-start gap-2.5 text-sm text-sage">
              <TruckIcon className="mt-0.5 shrink-0 text-base text-stone" />
              Kargoya verildiğinde takip numarasını SMS ile paylaşacağız.
            </li>
          </ul>

          <p className="mt-5 rounded-[var(--radius-card)] bg-surface-alt p-3 text-xs leading-relaxed text-sage">
            Bu bir demo siparişidir: gerçek bir ödeme alınmadı ve kargo
            oluşturulmadı.
          </p>
        </div>

        <div className="mt-8">
          <ButtonLink href="/urunler" size="lg">
            Alışverişe devam et
          </ButtonLink>
        </div>
      </div>

      <div className="mt-16">{recommendations}</div>
    </div>
  );
}
